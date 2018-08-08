/* 
Written by JMAIN
This script figures out if a few conditions are true and then
notifies the customer using an email template and report
*/

//get the current wfTask
var currenttask = wfTask;

//get the current wfStatus
var currentstatus = wfStatus;

//get the wfComment
var currentstatuscomment = wfComment + "";

logDebug("currenttask: " + currenttask);
logDebug("currentstatus: " + currentstatus);

if (currenttask == "Final Acceptance" && currentstatus == "Complete")
{
	logDebug("Starting Async Email...");
	
	//what contact types should get an email - comma delimited string of contact types
	var allowedcontacttypes = "Applicant,Developer,Contractor(s)";
		
	//send email to all contacts with the apropriate template and report
	var emailtemplate = "PI PERMIT FINAL ACCEPTANCE";
	
	//populate the email parameters not already included for "free" - must examine the template to know
	var emailparams = aa.util.newHashtable();
	emailparams.put("$$wfComment$$", currentstatuscomment);
	
	//call Emmett's emailContacts function - this runs asynchronously - puts "deep link" to report in email
	emailContacts(allowedcontacttypes, emailtemplate, emailparams, "", "", "N", "");
	
	logDebug("Did it work?");
	
}