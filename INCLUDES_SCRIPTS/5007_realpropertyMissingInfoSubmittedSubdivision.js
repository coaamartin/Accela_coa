/*

This is script 287 which checks if record status is "Waiting on Documents" AND
the Workflow step is currently "Application Status" AND
the workflow status is "Missing Information"

Written by JMAIN

*/

logDebug("Start realpropertyMissingInfoSubmittedSubdivision.js")

//get today's date in mm/dd/yyyy format
var d = new Date;
var month = d.getMonth() + 1;
var day = d.getDate();
var year = d.getFullYear();
var currentdate = month + "/" + day + "/" + year;
logDebug("Today is " + currentdate);

//get five business days from today
var fivebusinessdays = dateAdd(currentdate, 5, "Y");
logDebug("5 business days is " + fivebusinessdays);

//get the current overall record status
var currentrecordstatus = capStatus;
logDebug("Current record Status: " + currentrecordstatus);

//Is this the right record status for this script to do anything?
var iscorrectrecordstatus = false;
if (currentrecordstatus == "Waiting on Documents")
{
	iscorrectrecordstatus = true;
}
logDebug("iscorrectrecordstatus: " + iscorrectrecordstatus);

if (!iscorrectrecordstatus)
{
	logDebug("No work to do... would like to exit now if possible...");
	//if possible exit the script - I haven't figured that out yet...
}

//check if the active task is "Application Acceptance"
var tasktocheck = "Application Acceptance";
var iscorrecttask = isTaskActive(tasktocheck);
logDebug("iscorrecttask: " + iscorrecttask);

//check if the active workflow status is "Missing Information"
var iscorrecttaskstatus = isTaskStatus(tasktocheck, "Missing Information");
logDebug("iscorrecttaskstatus: " + iscorrecttaskstatus);

//run the business logic - if everything is true, update the record
if (iscorrectrecordstatus && iscorrecttask && iscorrecttaskstatus)
{
	logDebug("Doing a bunch of work...");
	updateAppStatus("Ready for Review", "updated by COA script realpropertyMissingInfoSubmittedSubdivision");
	activateTask("Application Acceptance");
	editTaskDueDate("Application Acceptance", fivebusinessdays);
	logDebug("Did a bunch of work...");
}
else
{
	logDebug("NOT doing a bunch of work...");
}