/*------------------------------------------------------------------------------------------------------/
| TEST PARAMETERS (Uncomment to use in the script tester)
/------------------------------------------------------------------------------------------------------*/
//aa.env.setValue("paramStdChoice","BATCH_REPORT_TEST");
//aa.env.setValue("eventType","Batch Process");
//aa.env.setValue("BatchJobName","BATCH_REPORT_TEST");
/*------------------------------------------------------------------------------------------------------/
| Program: BATCH_REPORT_TEST 
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
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
eval(getMasterScriptText("INCLUDES_CUSTOM"));
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
	var emailTo = getJobParam("emailSendTo"); // email to: 
	//var emailTo = "jwarthan@auroragov.org;rprovinc@auroragov.org";
	var emailTitle = getJobParam("emailTitle"); // email Title
	var emailtemplate = getJobParam("emailTemplate");	 // email Template
	var emailBodyMsg = getJobParam("emailBodyMsg");
	var reportName = getJobParam("reportName");
	//var reportName = "Daily Revenue User Summary_script";
	var rParams = aa.util.newHashtable();
	//rParams.put("FromDate", "5/1/2020");
	//rParams.put("ToDate", "5/31/2020");
	//rParams.put("Record_type", "ALL");
	//rParams.put("PaymentMethod", "ALL");
	var report = generateReportFile(reportName, rParams, aa.getServiceProviderCode());
	var tParams = aa.util.newHashtable();
	tParams.put("$$emailTitle$$", emailTitle);
	tParams.put("$$emailBodyMSG$$", emailBodyMsg);
    tParams.put("$$emailSendTo$$", emailTo);
	logDebug("EMail to: " + emailTo);
	logDebug("Report Name: " + reportName);
	sendNotificationLocal("noreply@auroragov.org", emailTo, "", emailtemplate, tParams, [report]);
	//sendMail("noreply@auroragov.org", emailTo, "", emailtemplate, tParams, null);
}

function generateReportFile(aaReportName,parameters,rModule) 
{
  var reportName = aaReportName;

  report = aa.reportManager.getReportInfoModelByName(reportName);
  report = report.getOutput();


  report.setModule(rModule);
  report.setCapId(capId);
  report.setReportParameters(parameters);
  //Added
  //vAltId = capId.getCustomID();
  //report.getEDMSEntityIdModel().setAltId(vAltId);
  var permit = aa.reportManager.hasPermission(reportName,"ADMIN");
  aa.print("---"+permit.getOutput().booleanValue());
  if(permit.getOutput().booleanValue()) 
  {
    var reportResult = aa.reportManager.getReportResult(report);

    if(reportResult) 
    {
      reportResult = reportResult.getOutput();
      var reportFile = aa.reportManager.storeReportToDisk(reportResult);
      logMessage("Report Result: "+ reportResult);
      reportFile = reportFile.getOutput();
      return reportFile
    } else 
    {
      logMessage("Unable to run report: "+ reportName + " for Admin" + systemUserObj);
      return false;
    }
  } else 
  {
    logMessage("No permission to report: "+ reportName + " for Admin" + systemUserObj);
    return false; 
  }
}

function sendMail(from, to, cc, templateName, params, fileNames)
{
    // var fileNames = [];
    var result = aa.document.sendEmailByTemplateName(from, to, cc, templateName, params, fileNames);
    if(result.getSuccess())
    {
        aa.print("Send mail success.");
    }
    else
    {
        aa.print("Send mail fail.");
    }
}

function sendNotificationLocal(emailFrom,emailTo,emailCC,templateName,params,reportFile)

{

	var itemCap = capId;

	if (arguments.length == 7) itemCap = arguments[6]; // use cap ID specified in args



	var id1 = itemCap.ID1;

 	var id2 = itemCap.ID2;

 	var id3 = itemCap.ID3;



	var capIDScriptModel = aa.cap.createCapIDScriptModel(id1, id2, id3);





	var result = null;

	result = aa.document.sendEmailAndSaveAsDocument(emailFrom, emailTo, emailCC, templateName, params, capIDScriptModel, reportFile);

	if(result.getSuccess())

	{

		logDebug("Sent email successfully!");

		return true;

	}

	else

	{

		logDebug("Failed to send mail. - " + result.getErrorType());

		return false;

	}
}