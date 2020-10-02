/*------------------------------------------------------------------------------------------------------/
| TEST PARAMETERS (Uncomment to use in the script tester)
/------------------------------------------------------------------------------------------------------*/
//aa.env.setValue("paramStdChoice","BATCH_CloseInactiveHOA");
//aa.env.setValue("eventType","Batch Process");
//aa.env.setValue("BatchJobName","BATCH_CloseInactiveHOA");
/*------------------------------------------------------------------------------------------------------/
| Program: BATCH_CloseInactiveHOA  
| Trigger: Batch
| Client: COA
|
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| USER CONFIGURABLE PARAMETERS
/------------------------------------------------------------------------------------------------------*/
currentUserID = "ADMIN";
useAppSpecificGroupName = false;
/*------------------------------------------------------------------------------------------------------/
| GLOBAL VARIABLES
/------------------------------------------------------------------------------------------------------*/
message = "";
br = "<br>";
debug = "";
systemUserObj = aa.person.getUser(currentUserID).getOutput();
publicUser = false;
/*------------------------------------------------------------------------------------------------------/
| INCLUDE SCRIPTS (Core functions, batch includes, custom functions)
/------------------------------------------------------------------------------------------------------*/
SCRIPT_VERSION = 3.0;
var useSA = false;
var SA = null;
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_FOR_EMSE");
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") {
	useSA = true;
	SA = bzr.getOutput().getDescription();
	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_INCLUDE_SCRIPT");
	if (bzr.getSuccess()) {
		SAScript = bzr.getOutput().getDescription();
	}
}

if (SA) {
	eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS", SA));
	eval(getMasterScriptText(SAScript, SA));
} else {
	eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS"));
}

eval(getScriptText("INCLUDES_BATCH"));
eval(getMasterScriptText("INCLUDES_CUSTOM"));

/*------------------------------------------------------------------------------------------------------/
| CORE EXPIRATION BATCH FUNCTIONALITY
/------------------------------------------------------------------------------------------------------*/
try {
	showMessage = false;
	showDebug = true;
	if (String(aa.env.getValue("showDebug")).length > 0) {
		showDebug = aa.env.getValue("showDebug").substring(0, 1).toUpperCase().equals("Y");
	}

	sysDate = aa.date.getCurrentDate();
	var startDate = new Date();
	var startTime = startDate.getTime(); // Start timer
	var systemUserObj = aa.person.getUser("ADMIN").getOutput();

	sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "");
	batchJobResult = aa.batchJob.getJobID();
	batchJobName = "" + aa.env.getValue("BatchJobName");
	batchJobID = 0;

	if (batchJobResult.getSuccess()) {
		batchJobID = batchJobResult.getOutput();
		logDebug("Batch Job " + batchJobName + " Job ID is " + batchJobID);
	} else {
		logDebug("Batch job ID not found " + batchJobResult.getErrorMessage());
	}


/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/
	logDebug("Start of Job");

	mainProcess();

	logDebug("End of Job: Elapsed Time : " + elapsed() + " Seconds");
	
/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/	
} catch (err) {
	handleError(err,"Batch Job:" + batchJobName + " Job ID:" + batchJobID);
}

/*------------------------------------------------------------------------------------------------------/
| <=========== Errors and Reporting
/------------------------------------------------------------------------------------------------------*/
if (debug.indexOf("**ERROR") > 0) {
	aa.env.setValue("ScriptReturnCode", "1");
	aa.env.setValue("ScriptReturnMessage", debug);
} else {
	aa.env.setValue("ScriptReturnCode", "0");
	if (showMessage) {
		aa.env.setValue("ScriptReturnMessage", message);
	}
	if (showDebug) {
		aa.env.setValue("ScriptReturnMessage", debug);
	}
}
/*------------------------------------------------------------------------------------------------------/
| FUNCTIONS (mainProcess is the core function for processing expiration records)
/------------------------------------------------------------------------------------------------------*/
function mainProcess() {
	/*----------------------------------------------------------------------------------------------------/
	| BATCH PARAMETERS
	/------------------------------------------------------------------------------------------------------*/
	var paramStdChoice = aa.env.getValue("paramStdChoice");	// use this standard choice for parameters instead of batchjob params
	var daysInactive = getJobParam("daysInactive");
	//var appTypeToLookFor = getJobParam("appTypeToLookFor");
	var appTypeToLookFor = "Associations/Neighborhood/Association/Master"
	var appTypeArrayToLookFor = ( appTypeToLookFor != "" ? appTypeToLookFor.split("/") : null); 
	var appStatusToLookFor = getJobParam("statusToLookFor");
	var appStatusToLookForArray = ( appStatusToLookFor != "" ? appStatusToLookFor.split(",") : null); 
	var newAppStatus = getJobParam("newAppStatus"); //   update the CAP to this status
	//var emailTemplate = getJobParam("emailTemplate"); // email Template
	var emailSendTo = getJobParam("emailSendTo");
	var emailTitle = getJobParam("emailTitle")
	var emailBodyMsg="";
	var capCount=0;
	logDebug("Processing Inactive Records Older Than " + dateAdd(startDate,-(daysInactive))+ ". ");
	/*----------------------------------------------------------------------------------------------------/
	| Email Header
	/------------------------------------------------------------------------------------------------------*/
	emailBodyMsg+="To All,"+br;
	emailBodyMsg+=br;
	emailBodyMsg+="This is to inform you that the following HOA records without activity since " + dateAdd(startDate,-(daysInactive)) +" have been closed. " + br;
	emailBodyMsg+=br;
	/*----------------------------------------------------------------------------------------------------/
	| End Email Header
	/------------------------------------------------------------------------------------------------------*/
	
	var appList = getRecordsToProcess(daysInactive,appTypeArrayToLookFor,appStatusToLookForArray);
	if(appList ==""){
		return false;
	}else{
		//do actions if not empty...
		logDebug("appList not empty... ");
		for (app in appList)
		{
			altId = ""+appList[app];
			logDebug(" "+altId);
			logDebug("=================================================");
			emailBodyMsg+=altId + br;
			
			logDebug("Inside if "+altId);
			
			// Actions start here:
			var capIdObj = aa.cap.getCapID(altId);
			if (!capIdObj.getSuccess()){
					logDebug( "**ERROR: getting cap conditions: " + capIdObj.getErrorMessage());
				continue;
				}
			//global var
			capId = capIdObj.getOutput();
			
			// update App Status
			if (newAppStatus && newAppStatus != "") {
				updateAppStatus(String(newAppStatus), "Updated by batch " + batchJobName)
			}
			var wfTaskDeactivated = getActiveWFTaskAndDeactivate(capId);
			if(wfTaskDeactivated!=""){
				logDebug("Deactivated Workflow Task:" + wfTaskDeactivated)
			}else{
				logDebug("No active workflow Task found")
			}
			logDebug("=================================================");
			capCount++
			
		}

		//generate email notices
		//if (emailTemplate != null && emailTemplate != "" && emailSendTo && emailSendTo != "" && capCount>0) {
		if (emailSendTo && emailSendTo != "" && capCount>0) {
			logDebug("=================================================");
			//logDebug('Attempting to send email: ' + emailTemplate );
				aa.sendMail("noreply@accela.com", emailSendTo, "", emailTitle, emailBodyMsg);
		}

		logDebug("=================================================");
		logDebug("Total CAPS processed: "+capCount );
	}
}


/*------------------------------------------------------------------------------------------------------/
| <===========internal functions - do not modify ================>
/-----------------------------------------------------------------------------------------------------*/

function getMasterScriptText(vScriptName) {
	var servProvCode = aa.getServiceProviderCode();
	if (arguments.length > 1)
		servProvCode = arguments[1]; // use different serv prov code
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}

function getScriptText(vScriptName) {
	var servProvCode = aa.getServiceProviderCode();
	if (arguments.length > 1)
		servProvCode = arguments[1]; // use different serv prov code
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var emseScript = emseBiz.getScriptByPK(servProvCode, vScriptName, "ADMIN");
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}

function getActiveWFTaskAndDeactivate(pCapId)
	{
	// counts the number of active tasks on a given process
   itemCapId = pCapId;
	var workFlowTaskDeactivated = ""; //add wf tasks deactivated and return 
	var workflowResult = aa.workflow.getTasks(itemCapId);
 	if (workflowResult.getSuccess())
  	 	wfObj = workflowResult.getOutput();
  	else
  	  	{ logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage()); return false; }
	
	for (i in wfObj)
		{
   		fTask = wfObj[i];
		if (fTask.getActiveFlag().equals("Y")){
			var stepnumber = fTask.getStepNumber();
			var processID = fTask.getProcessID();
			var completeFlag = fTask.getCompleteFlag();
			workFlowTaskDeactivated+= " "+fTask.getTaskDescription();
			aa.workflow.adjustTask(itemCapId, stepnumber, "N", completeFlag, null, null)
			}
		}
		
	return workFlowTaskDeactivated
	}
	
function getRecordsToProcess(pdaysInt,pLookappTypeArr,pLookStatusArr) {
		var daysInactive = pdaysInt;
		var appTypeToLookForArray = pLookappTypeArr
		var appStatusToLookForArray = pLookStatusArr;
		
		appStatusString = getAppStatusString(appStatusToLookForArray);
		logDebug("appStatusString" + appStatusString);
	try {
	
		//MiscServices/Neighborhood/Association
var sql = "SELECT DISTINCT B.B1_ALT_ID " +
		" FROM B1PERMIT B LEFT JOIN GPROCESS_HISTORY WFH " +
		" ON B.SERV_PROV_CODE = WFH.SERV_PROV_CODE " +
		" AND B.B1_PER_ID1 = WFH.B1_PER_ID1 " +
		" AND B.B1_PER_ID2 = WFH.B1_PER_ID2 " +
		" AND B.B1_PER_ID3 = WFH.B1_PER_ID3 " +          
		" WHERE b.SERV_PROV_CODE  = '" + aa.getServiceProviderCode() +"' " +
		" AND B.B1_PER_GROUP ='"+appTypeToLookForArray[0]+"' " +
		" AND B.B1_PER_TYPE = '"+appTypeToLookForArray[1]+"' " + 
		" AND b.B1_PER_SUB_TYPE = '"+appTypeToLookForArray[2]+"' " +
		" AND b.REC_STATUS = 'A' " +
		" AND NOT (B.B1_APPL_STATUS_DATE) >= SYSDATE -"+daysInactive + " " +
		" AND B.B1_APPL_STATUS IN "+ appStatusString +" " + 
		" AND WFH.SD_APP_DD = (SELECT MAX(GH.SD_APP_DD) " +
		" FROM GPROCESS_HISTORY GH " +
		" WHERE GH.SERV_PROV_CODE = B.SERV_PROV_CODE " +
		" AND GH.B1_PER_ID1 = B.B1_PER_ID1 " +
		" AND GH.B1_PER_ID2 = B.B1_PER_ID2 " +
		" AND GH.B1_PER_ID3 = B.B1_PER_ID3 " +
		" AND GH.REC_STATUS = B.REC_STATUS) " +
		" AND NOT (SELECT MAX(GH.SD_APP_DD) " +
		" FROM GPROCESS_HISTORY GH " +
		" WHERE GH.SERV_PROV_CODE = B.SERV_PROV_CODE" +
		" AND GH.B1_PER_ID1 = B.B1_PER_ID1 " +
		" AND GH.B1_PER_ID2 = B.B1_PER_ID2 " +
		" AND GH.B1_PER_ID3 = B.B1_PER_ID3 " +
		" AND GH.REC_STATUS = B.REC_STATUS " +
		" ) >= SYSDATE -"+daysInactive + " " +
		" ORDER BY 1 " 
		
		var array = [];
		var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
		var ds = initialContext.lookup("java:/AA");
		var conn = ds.getConnection();
		var sStmt = conn.prepareStatement(sql);

		//only execute select statements
		if (sql.toUpperCase().indexOf("SELECT") == 0) {
			sStmt.executeQuery();
			results = sStmt.getResultSet()
			while (results.next()){
					array.push( results.getString("B1_ALT_ID"));
				}
		rSet.close();
		sStmt.close();
		conn.close();
		if(array==null || array==undefined || array==""){
			return "";
		}
		return array;
		}
		} catch (err) {
			logDebug(err.message)
			
	}
}

function getAppStatusString(parray){
var x = ""+parray
x = x.split(",");
	stringStart = "('";
	stringEnd = "')";
	stringJoin = "','";
	newString = "";

if(x.length>0){
	for (a in x){
		y = x[a];
		if(a==0){
		newString = y;
		//aa.print(a+": "+newString)
		}else{
		//aa.print(a+": "+ newString)
		newString+= stringJoin + y;
		}
	
	}
	return newString = stringStart+newString+stringEnd;
	//aa.print("finished " + newString);
}else{
	return ""
	}

}

