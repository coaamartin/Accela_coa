/*------------------------------------------------------------------------------------------------------/
| Program: batch_DailyOverdueWorkflowTaskReport.js.js  Trigger: Batch
| Client: City of Aurora
| Partner:  Silver Lining Solutions, Copywrite 2017-2018
|
| Frequency: Run every night
|
| Desc: This batch script will run a report and send it to an email address as an attachment
|
/------------------------------------------------------------------------------------------------------*/
/*  - use the following for Script Tester  
aa.env.setValue("showDebug","Y");
aa.env.setValue("BatchJobName", "WorkFlowTasksOverdue");
aa.env.setValue("emailAddress","chad@esilverliningsolutions.com.com");
aa.env.setValue("ccAddress","");
aa.env.setValue("fromAddress","noreply@yourdomain.com");
aa.env.setValue("reportName","WorkFlowTasksOverdue"); 
aa.env.setValue("reportModule","Building");
aa.env.setValue("reportDesc","The attached report contains all over due work flow tasks by department.");
aa.env.setValue("CurrentUserID","ADMIN");
*/
 
/*------------------------------------------------------------------------------------------------------/
|
| START: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var emailText = "";
var maxSeconds = 4 * 60;		// number of seconds allowed for batch processing, usually < 5*60
var message = "";
var br = "<br>";
/*------------------------------------------------------------------------------------------------------/
| BEGIN Includes
/------------------------------------------------------------------------------------------------------*/
SCRIPT_VERSION = 3.0
eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_BATCH"));
eval(getMasterScriptText("INCLUDES_CUSTOM"));

function getScriptText(vScriptName){
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(),vScriptName,"ADMIN");
	return emseScript.getScriptText() + "";
}

function getMasterScriptText(vScriptName){
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(),vScriptName);
	return emseScript.getScriptText() + "";
}
/*------------------------------------------------------------------------------------------------------/
|
| END: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
//showDebug = false;
if (String(aa.env.getValue("showDebug")).length > 0) {
	showDebug = aa.env.getValue("showDebug").substring(0, 1).toUpperCase().equals("Y");
}
var sysDate = aa.date.getCurrentDate();
var batchJobResult = aa.batchJob.getJobID()
var batchJobName = "" + aa.env.getValue("BatchJobName");
var wfObjArray = null;

var batchJobID = 0;
/* =-=-=-=-=-=-=-=-=- */
if (batchJobResult.getSuccess())
  {
  batchJobID = batchJobResult.getOutput();
  logDebug("Batch Job " + batchJobName + " Job ID is " + batchJobID);
  }
else
  logDebug("Batch job ID not found " + batchJobResult.getErrorMessage());
/* =-=-=-=-=-=-=-=-=- */
/*----------------------------------------------------------------------------------------------------/
|
| Start: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/

var emailTo = getParam("emailAddress"); 
var emailCC = getParam("ccAddress"); 
var emailFrom = getParam("fromAddress"); 
var rptName = getParam("reportName"); 
var rptModule = getParam("reportModule"); 
var rptDesc = getParam("reportDesc");
var curUserId = getParam("CurrentUserID"); 
/*----------------------------------------------------------------------------------------------------/
|
| End: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();
var timeExpired = false;

var startTime = startDate.getTime();			// Start timer
var systemUserObj = aa.person.getUser("ADMIN").getOutput();

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/

logDebug("Start of Job");
if (!timeExpired) mainProcess();
logDebug("End of Job: Elapsed Time : " + elapsed() + " Seconds");

/*if (emailTo.length) {
	var emailSentOK = aa.sendEmail(emailFrom,emailTo,emailCC,batchJobName + " Completed","Please see the batch job logs for more information");
	var emailSentOK = true;
	if (!emailSentOK) {
		logDebug("EMAIL COULD NOT BE SENT! >" + emailSentOK );
	}
	else {
		logDebug("EMAIL SENT.");
	}

}
*/
/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

function mainProcess() {
	var myParams = aa.util.newHashMap();
//	myParams.put ("runDate", aa.date.getCurrentDate().month +"/"+ aa.date.getCurrentDate().dayOfMonth +"/"+ aa.date.getCurrentDate().year);
	myParams.put("RECORD_MODULE",rptModule);
	aa.print("params are:");
	aa.print(myParams);

    report = aa.reportManager.getReportInfoModelByName(rptName);
	report = report.getOutput();
    report.setModule(rptModule);

    report.setReportParameters(myParams);
    var canRunReport = aa.reportManager.hasPermission(rptName,"ADMIN");
	
    if(canRunReport.getOutput().booleanValue()) {
		var reportResult = aa.reportManager.getReportResult(report);
		if(reportResult) {
			reportResult = reportResult.getOutput();
			if (reportResult) {
				var myReportFileName = reportResult.name;
				var myNewRptFileName = "OverDueWorkFlowTasks_" + aa.date.getCurrentDate().year + aa.date.getCurrentDate().month + aa.date.getCurrentDate().dayOfMonth + aa.date.getCurrentDate().hourOfDay + aa.date.getCurrentDate().minute + aa.date.getCurrentDate().second + ".pdf";
				itWorkedForMe = reportResult.getReportResultModel().setName(myNewRptFileName);
				var reportFile = aa.reportManager.storeReportToDisk(reportResult);
				reportFile = reportFile.getOutput();
				var files = new Array();
				files[0] = reportFile;

				var emailReportOK = aa.sendEmailWithAttachedFiles(emailFrom,emailTo,emailCC,batchJobName + " " + aa.date.getCurrentDate().year + aa.date.getCurrentDate().month + aa.date.getCurrentDate().dayOfMonth + " Complete", rptDesc, files);

				if (emailReportOK.getSuccess()) {
					aa.print("Report was emailed to "+emailTo+" and CCd to "+emailCC);
					aa.print("with the following files attached:");
					aa.print(files);
				}
				else {
					aa.print("Report was NOT emailed to "+emailTo+"!!");
					aa.print("sendMail Result:");
					aa.print(emailReportOK.getErrorMessage());
				}
			} else aa.print("Could not get report result output!");
		} else aa.print("Could not get report result!");
	} else aa.print("Could not run report! permission result:"+canRunReport.getOutput());
}
