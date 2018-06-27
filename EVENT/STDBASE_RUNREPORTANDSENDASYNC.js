/*------------------------------------------------------------------------------------------------------/
| Program : STDBASE_RUNREPORTANDSENDASYNC.js
| Event   : 
|
| Usage   : Run report and send async.
|
| Client  : N/A
| Action# : N/A
|
| Notes   :
|
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START User Configurable Parameters
|
|     Only variables in the following section may be changed.  If any other section is modified, this
|     will no longer be considered a "Master" script and will not be supported in future releases.  If
|     changes are made, please add notes above.
/------------------------------------------------------------------------------------------------------*/

// ********************************************************************************************************************************
//	Env Paramters Below
// ********************************************************************************************************************************
var servProvCode = aa.env.getValue("ServProvCode");			// Service Provider Code
var capIDString = aa.env.getValue("CustomCapId");			// Custom CAP ID
var capId = aa.env.getValue("CapID");
var reportName = aa.env.getValue("ReportName"); 			// Report Name
var reportParameters = aa.env.getValue("ReportParameters");	// Report Paramters, it should be HashTable
var reportAttach = aa.env.getValue("ReportAttach");			// Attach the report to the email
var module = aa.env.getValue("Module");						// Module Name
var reportUser = aa.env.getValue("ReportUser"); 			// AA User
var errorEmailTo = aa.env.getValue("ErrorEmailTo");			// To Email Address handle Error Message
var debugEmailTo = aa.env.getValue("DebugEmailTo");			// To Email Address handle Debug Message
var	emailFrom = aa.env.getValue("EmailFrom");
var	emailTo = aa.env.getValue("EmailTo");
var	emailTemplate = aa.env.getValue("EmailTemplate");
var	emailParameters = aa.env.getValue("EmailParameters");
var emailCC = aa.env.getValue("EmailCC");
var waitTime = aa.env.getValue("WaitTime");
var systemMailFrom = aa.env.getValue("SystemMailFrom");

if(matches(waitTime,null,undefined,"")) waitTime = 10000;
else waitTime = parseInt(waitTime);

var acaURL = lookup("ACA_CONFIGS","ACA_SITE");
acaURL = acaURL.substr(8,acaURL.toUpperCase().indexOf("/ADMIN"));


 
var debug = "";
var error = "";
var br = "<BR/>";

// 

var rParams = aa.util.newHashMap();
if(reportParameters && reportParameters.getClass().toString() != "class java.util.HashMap")
	rParams = convertStringToHashMap(String(reportParamters));
else
	rParams = reportParameters;


var eParams = aa.util.newHashtable();
logDebug("emailParameters getClass - " + emailParameters.getClass().toString());
if(emailParameters && emailParameters.getClass().toString() != "class java.util.Hashtable")
	eParams = convertStringToHashTable(String(emailParameters));
else
	eParams = emailParameters;


logDebug("Starting async script. Waiting " + waitTime + " milliseconds to execute...");
wait(waitTime);  //7 seconds in milliseconds
logDebug("Done waiting, it's been: " + waitTime + "milliseconds");

// ********************************************************************
printEnv();
// ***********************************************************************
handleEnvParamters();

try{
	var success = sendReport();

	if(errorEmailTo != null && errorEmailTo != "" && success == false) {
		aa.sendMail(systemMailFrom, errorEmailTo, "", "Errors occurs in Sending Report Script", error);
	}

	if(debugEmailTo != null && debugEmailTo != "") {
		aa.sendMail(systemMailFrom, debugEmailTo, "", "Debug Information in Sending Report Script", debug);
	}
}
catch(err){
	logDebug("(RUNREPORTANDSENDASYNC) A JavaScript Error occured: " + err.message + " at line " + err.lineNumber + " stack: "+ err.stack);
	aa.sendMail(systemMailFrom, debugEmailTo, "", "EXCEPTION: Debug Information in Sending Report Script", debug);
}


// ======================================================================
//
//					Internal Function
//
// ======================================================================

// Main Function to send report
function sendReport() {
	var capIDArray = capId.toString().split("-");
		
	var id1 = capIDArray[0];
	var id2 = capIDArray[1];
	var id3 = capIDArray[2];
	
	try {
		// Step 1.  Get Report Model by ReportName
		logDebug("Step 1.  Get Report Model by ReportName");
		var reportInfoResult = aa.reportManager.getReportInfoModelByName(reportName);
		if(reportInfoResult.getSuccess() == false) {
			// Notify adimistrator via Email, for example
			logError("Could not found this report " + reportName);		
			return false;
		}
		
		// Step 2. Initialize report
		logDebug("Step 2. Initialize report");
		report = reportInfoResult.getOutput();
		report.setModule(module);
		report.setCapId(id1 + "-" + id2 + "-" + id3);
		report.setReportParameters(rParams);
		report.getEDMSEntityIdModel().setAltId(capIDString);
		
		// Step 3. Check permission on report
		logDebug("Step 3. Check permission on report");
		var permissionResult = aa.reportManager.hasPermission(reportName,reportUser);
		if(permissionResult.getSuccess() == false || permissionResult.getOutput().booleanValue() == false) {
			// Notify adimistrator via Email, for example
			logError("The user " + reportUser + " does not have perssion on this report " + reportName);		
			return false;
		}
		
		// Step 4. Run report
		logDebug("Step 4. Run report");
		var reportResult = aa.reportManager.getReportResult(report);
		if(reportResult.getSuccess() == false){
			// Notify adimistrator via Email, for example
			logError("Could not get report from report manager normally, error message please refer to (" + capIDString +"): " + reportResult.getErrorType() + ":" + reportResult.getErrorMessage());		
			return false;
		}
		
		// Step 5, Store Report File to harddisk
		logDebug("Step 5, Store Report File to harddisk");
		reportResult = reportResult.getOutput();
	    var reportFileResult = aa.reportManager.storeReportToDisk(reportResult);
		if(reportFileResult.getSuccess() == false) {
			// Notify adimistrator via Email, for example
			logError("The appliation does not have permission to store this temporary report " + reportName + ", error message please refer to:" + reportResult.getErrorMessage());		
			return false;
		}
		
		// Step 5a. Get the document that was created from the record and generate params for notification
		var reportFileName = reportResult.getName();
		getACADocumentNameURLParams4Notification(eParams,reportFileName,acaURL);
		
		// Step 6. Send Report via Email
		logDebug("Step 6. Send Report via Email - reportFileName = " + reportFileName);
	    var reportFile = reportFileResult.getOutput();

		
		var capIDScriptModel = aa.cap.createCapIDScriptModel(id1, id2, id3);
		

		var rFiles = [];
		if(matches(reportAttach,true,"true")){
			rFiles.push(reportFile);
		}
		if (!matches(emailTo,null,"",undefined)) {
			var result = null;
			result = aa.document.sendEmailAndSaveAsDocument(emailFrom, emailTo, emailCC, emailTemplate, eParams, capIDScriptModel, rFiles);
			if(result.getSuccess())
			{
				logDebug("Sent email successfully!");
				return true;
			}
			else
			{
				logError("Failed to send mail. - " + result.getErrorType());
				return false;
			}		
		} else {
			logError("No email address available.");
			return false;
		}		


		
	}
	catch(err){
		logError("One error occurs. Error description: " + err );
		return false;
	}	
}

function getDocumentList() {
	// Returns an array of documentmodels if any
	// returns an empty array if no documents
	itemCapId = (arguments.length == 1) ? arguments[0] : capId;
	var docListArray = new Array();

	docListResult = aa.document.getCapDocumentList(itemCapId,"ADMIN");

	if (docListResult.getSuccess()) {		
		docListArray = docListResult.getOutput();
	}
	return docListArray;
} 

function addParameter(pamaremeters, key, value)
{
	if(key != null)
	{
		if(value == null)
		{
			value = "";
		}
		pamaremeters.put(key, value);
	}
}

function getACADocumentDownloadUrl(acaUrl,documentModel) {
  	//returns the ACA URL for supplied document model
	var acaUrlResult = aa.document.getACADocumentUrl(acaUrl, documentModel);

	if(acaUrlResult.getSuccess())
	{
		acaDocUrl = acaUrlResult.getOutput();
		return acaDocUrl;
	}
	else
	{
		logDebug("Error retrieving ACA Document URL: " + acaUrlResult.getErrorType());
		return false;
	}
}

function getACADocumentNameURLParams4Notification(params,pDocName,acaURL)  {
	itemCapId = (arguments.length == 4) ? arguments[3] : capId;
	// pass in a hashtable and it will add the additional parameters to the table

	var vDocListArray = getDocumentList(itemCapId);
	var vDocName = "";
	var vDocDownloadURL = "";

	for(iDoc in vDocListArray){
		var docModel = vDocListArray[iDoc];
		var docNo = docModel.getDocumentNo(); 
		var docCategory = docModel.getDocCategory();
		var docName = docModel.getDocName(); 
		var docStatus = docModel.getDocStatus();
		
		if(docName == pDocName){
			// Find the most current version of the document type
				vDocName = docName;
				vDocDownloadURL = getACADocumentDownloadUrl(acaURL,docModel);
				addParameter(params, "$$acaDocName$$",pDocName);
				addParameter(params, "$$acaDocDownloadURL$$",vDocDownloadURL);
				logDebug("(getACADocumentNameURLParams4Notification) $$acaDocName$$ - " + pDocName +  " $$acaDocDownloadURL$$ - https:\\" + vDocDownloadURL);
		}
	}
	
	return params;
}

function lookup(stdChoice,stdValue) 
	{
	var strControl;
	var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice,stdValue);
	
   	if (bizDomScriptResult.getSuccess())
   		{
		var bizDomScriptObj = bizDomScriptResult.getOutput();
		strControl = "" + bizDomScriptObj.getDescription(); // had to do this or it bombs.  who knows why?
		logDebug("lookup(" + stdChoice + "," + stdValue + ") = " + strControl);
		}
	else
		{
		logDebug("lookup(" + stdChoice + "," + stdValue + ") does not exist");
		}
	return strControl;
	}

function handleEnvParamters() {
	if(servProvCode == null) servProvCode = "";	
	if(capIDString == null) capIDString = "";
	if(capId == null) capId = "";
	if(reportName == null) reportName = "";
	if(reportAttach == null) reportAttach = true;
	if(module == null) module = "";
	if(reportUser == null) reportUser = "";
	if(errorEmailTo == null) errorEmailTo = "";
	if(debugEmailTo == null) debugEmailTo = "";
	if(emailFrom == null) emailFrom = "";
	if(emailTo == null) emailTo = "";
	if(emailTemplate == null) emailTemplate = "";
	if(systemMailFrom == null) systemMailFrom = "";
}

function logDebug(dstr) {
	debug += dstr + br;	
}

function logError(dstr) {
	error += dstr + br;
	logDebug(dstr);
}

function printEnv() {
    //Log All Environmental Variables as  globals
    var params = aa.env.getParamValues();
    var keys =  params.keys();
    var key = null;
    while(keys.hasMoreElements())
    {
     key = keys.nextElement();
     eval("var " + key + " = aa.env.getValue(\"" + key + "\");");
     logDebug(key + " = " + aa.env.getValue(key));
    }
}

function convertStringToHashMap(theString) {
    var retObj = aa.util.newHashMap();
    theString = theString.replace(/^\{|\}$/g,'').split(',');
    for(var i=0,cur,pair;cur=theString[i];i++){
        pair = cur.split('=');
        var key = pair[0].trim().toString()
        if (pair[1]) var val = pair[1].toString(); else val = "";
        retObj.put(key,val);
    }
    return retObj;
}

function convertStringToHashTable(theString) {
    var retObj = aa.util.newHashtable();
    theString = theString.replace(/^\{|\}$/g,'').split(',');
    for(var i=0,cur,pair;cur=theString[i];i++){
        pair = cur.split('=');
        var key = pair[0].trim().toString()
        if (pair[1]) var val = pair[1].toString(); else val = "";
        retObj.put(key,val);
    }
    return retObj;
}

function matches(eVal,argList) {
   for (var i=1; i<arguments.length;i++)
   	if (arguments[i] == eVal)
   		return true;

}

function asyncDebug(dstr) {
	aa.debug(aa.getServiceProviderCode() + " : " + myUserId + " : " + capId1 + "-" + capId2 + "-" +capId3, dstr);
	debug+=dstr;
}

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}
