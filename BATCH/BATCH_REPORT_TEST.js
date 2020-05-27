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
//eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
//eval(getScriptText("INCLUDES_CUSTOM", null, true));
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
	handleError(err, "Batch Job:" + batchJobName + " Job ID:" + batchJobID);
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
| FUNCTIONS (mainProcess is the core function for sending emails)
/------------------------------------------------------------------------------------------------------*/
function mainProcess() {
	/*----------------------------------------------------------------------------------------------------/
	| BATCH PARAMETERS
    /------------------------------------------------------------------------------------------------------*/
	var paramStdChoice = aa.env.getValue("paramStdChoice"); // use this standard choice for parameters instead of batchjob params
	//var dateRange = getJobParam("dateRange");//this will be used to determine how often to run the report...will change var name
	//var today = new Date();
	//var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
	//--mm/dd/yyyy configuration for reporting
	var emailTo = getJobParam("emailSendTo"); // email to: 
	var emailTitle = getJobParam("emailTitle"); // email Title
	//var emailTemplate = "Report_Test_Email"; // email Template
	var emailBodyMsg = "";
	var reportName = getJobParam("reportName");
	//var capCount= 0;
	//var report = generateReportFile(reportName, rParams, aa.getServiceProviderCode());
	//var expMonth = datepart1.getMonth();
	//sendNotification("noreply@aurora.gov", emailTo, "", emailtemplate, tParams,null);
	logDebug("Processing Batch_report_test.js. ")
	/*----------------------------------------------------------------------------------------------------/
	| Email Header
	/------------------------------------------------------------------------------------------------------*/
	emailBodyMsg += "Hello," + br;
	emailBodyMsg += br;
	emailBodyMsg += "Please see attached " + reportName + " " + br;
	emailBodyMsg += br;
	emailBodyMsg += "Thank you and have a great day," + br;
	emailBodyMsg += br;
	/*----------------------------------------------------------------------------------------------------/
	| End Email Header
	/------------------------------------------------------------------------------------------------------*/
	//generate email notices

	logDebug("=================================================");
	//aa.sendMail("noreply@aurora.gov", emailTo, "", emailTitle, emailBodyMsg);
	aa.sendMail("noreply@aurora.gov", "rprovinc@auroragov.org", "", "emailTitle", "emailBodyMsg");
	//sendNotification("noreply@aurora.gov", emailSendTo, "", emailtemplate, tParams, [report]);
	//sendNotification("noreply@aurora.gov", emailSendTo, "", emailTemplate, "", "");
	//emailContacts(emailSendTo, emailTemplate, eParams, reportName, rParams, "Y");
	//emailContacts(emailSendTo, emailTemplate, "", reportName, "", "Y");
	logDebug("Email to: " + emailTo);
	logDebug("Email Title: " + emailTitle);
	logDebug("Email Body: " + emailBodyMsg);
	logDebug("=================================================");
	logDebug("Finished sending email");
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
// function sendNotification(emailFrom,emailSendTo,emailCC,emailTemplate,params,reportFile)

// {

// 	var itemCap = capId;

// 	if (arguments.length == 7) itemCap = arguments[6]; // use cap ID specified in args



// 	var id1 = itemCap.ID1;

//  	var id2 = itemCap.ID2;

//  	var id3 = itemCap.ID3;



// 	var capIDScriptModel = aa.cap.createCapIDScriptModel(id1, id2, id3);





// 	var result = null;

// 	result = aa.document.sendEmailAndSaveAsDocument(emailFrom, emailSendTo, emailCC, emailTemplate, params, capIDScriptModel, reportFile);

// 	if(result.getSuccess())

// 	{

// 		logDebug("Sent email successfully!");

// 		return true;

// 	}

// 	else

// 	{

// 		logDebug("Failed to send mail. - " + result.getErrorType());

// 		return false;

// 	}

// }