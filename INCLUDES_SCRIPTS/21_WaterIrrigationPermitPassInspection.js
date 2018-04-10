/*

Event InspectionResultSubmitAfter Criteria Inspection = Commercial Lawn/Irrigation Inspection
or Single Family Residential Lawn/Irrigation Inspection and result = Pass
Action - Complete status on Workflow Task "Inspection" and update Application Status to “Approved” 
and email Applicant “ Your inspection is complete you may access the watering guidelines Here
(Tim to provide watering guidelines URL). (city to provide email template)

written by JMAIN

*/

logDebug("Starting check irrigation inspections script # 21");

//check the inspection results...
var inspectiontocheck1 = "Single Family Residential Lawn/Irrigation Inspection";
var inspectiontocheck2 = "Commercial Lawn/Irrigation Inspection";
var inspectionstatustocheck = "Pass";

var insp1pass = checkInspectionResult(inspectiontocheck1, inspectionstatustocheck);
var insp2pass = checkInspectionResult(inspectiontocheck2, inspectionstatustocheck);
logDebug(insp1pass);
logDebug(insp2pass);

//if either type of inspection has passed - update the workflow and application status
if (insp1pass || insp2pass)
{
	logDebug("getting ready to send an email...");
	
	//update the record
	updateTask("Inspection", "Completed", "updated by script 21", "updated by script 21");
	updateAppStatus("Approved", "updated by script 21");
	
	//Prepare the email and report...
	var emailtemplate = "JD_TEST_TEMPLATE";
	var reportname = "JD_TEST_REPORT";
	var allowedcontacttypes = "Applicant";
	
	var emailparams = aa.util.newHashtable();
	var joke = "This will be a legit email template once created.";
	var currentstatuscomment = "Status and Application updated by script 21";
	emailparams.put("$$Joke$$", joke);
	emailparams.put("$$wfComment$$", currentstatuscomment);

	var reportparams = aa.util.newHashtable();
	reportparams.put("DEPARTMENT", "Administrator");
	
	//send the email...
	emailContacts(allowedcontacttypes, emailtemplate, emailparams, reportname, reportparams, "N", "");
	logDebug("email sent...");
}	

