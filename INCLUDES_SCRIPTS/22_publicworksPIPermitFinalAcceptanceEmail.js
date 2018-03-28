/* 
Written by JMAIN
This script figures out if a few conditions are true and then
notifies the customer using an email template and report
*/

//get the current wfTask
var currenttask = wfTask;

//get the current wfStatus
var currentstatus = wfStatus;

logDebug("currenttask: " + currenttask);
logDebug("currentstatus: " + currentstatus);

if (currenttask == "Final Acceptance" && currentstatus == "Complete")
{
	logDebug("Starting Async Email...");
	
	//what contact types should get an email - comma delimited string of contact types
	var allowedcontacttypes = "Applicant,Developer";
		
	//send email to all contacts with the apropriate template and report
	var emailtemplate = "JD_TEST_TEMPLATE";
	var reportname = "JD_TEST_REPORT";
	
	//populate the email parameters not already included for "free" - must examine the template to know
	var joke = "Can a kangaroo jump higher than a house?  Of course, a house doesn't jump at all.";
	var emailparams = aa.util.newHashtable();
	emailparams.put("$$Joke$$", joke);
	
	//populate the report parameters - must examine the report to know
	var reportparams = aa.util.newHashtable();
	reportparams.put("DEPARTMENT", "Administrator");
	
	//call Emmett's emailContacts function - this runs asynchronously - puts "deep link" to report in email
	emailContacts("Applicant,Consultant", emailtemplate, emailparams, reportname, reportparams, "N", "");
	
	logDebug("Did it work?");
	
}