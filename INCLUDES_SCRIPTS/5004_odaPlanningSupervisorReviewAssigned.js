//************************************************ >>  5004_odaPlanningSupervisorReviewAssigned.js  << ****************************
// SCRIPTNUMBER: 5004
// SCRIPTFILENAME: 5004_odaPlanningSupervisorReviewAssigned.js
// PURPOSE: ​This is SCW's first - does this script even work?
// DATECREATED: 2018-03-13
// BY: Unknown

logDebug("Starting Script");
if (wfTask == "Planning Supervisor Review" && wfStatus == "Assigned")
{
	deactivateTask("Planning Supervisor Review");
		
}