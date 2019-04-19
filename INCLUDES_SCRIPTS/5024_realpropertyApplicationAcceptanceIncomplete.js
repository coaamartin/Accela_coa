//Written by JMAIN

//get current task
var currenttask = wfTask;

//get current task status
var currentstatus = wfStatus;

//email if task and status are what we want
if (currenttask == "Real Property Pre Acceptance" && currentstatus == "Incomplete")
{
	logDebug("running script 24...");
	
	//Prepare the email and report...
	var emailtemplate = "JD_TEST_TEMPLATE";
	var reportname = "JD_TEST_REPORT";
	var allowedcontacttypes = "Applicant";
	
	var emailparams = aa.util.newHashtable();
	var joke = "This will be a legit email template once created.";
	var currentstatuscomment = "Status and Application updated by script 24";
	emailparams.put("$$Joke$$", joke);
	emailparams.put("$$wfComment$$", currentstatuscomment);

	var reportparams = aa.util.newHashtable();
	reportparams.put("DEPARTMENT", "Administrator");
	
	//send the email...
	emailContacts(allowedcontacttypes, emailtemplate, emailparams, reportname, reportparams, "N", "");
	logDebug("email sent...");
}