//Script 281
//Record Types:	Fire/*/*/*
//Event: 		ISA
//Desc:			Event InspectionScheduleAfter 
//
//              Criteria: Any Fire Inspection being scheduled 
//
//              Action: When an Inspection is Scheduled update the Inspector 
//              to the assigned user on the record detail
//
//Created By: Silver Lining Solutions

function script281_AssignScheduledFireInspection(){
	logDebug("script281_AssignScheduledFireInspection() started.");
	try
	{
		// first get the user that has been assigned to the Record
		// if there is no user this may need to be an error
		var userID = getAssignedStaff();
		if (userID == null)
			throw "Record not Assigned to User. Please enter on the Record tab";			

		// we have the user, assign this user to the inspection being scheduled
		assignInspection(inspID,userID);
		
	}
	catch(err)
	{
		logDebug("Error on script281_AssignScheduledFireInspection(). Please contact administrator. Err: " + err);
	}
	logDebug("script281_AssignScheduledFireInspection() ended.");
};//END script281_AssignScheduledFireInspection
