include("5_fireCompleteOrNoViolations");

//Written by SWAKIL
include("42_FireViolationsSummary");

//Script 15
//Record Types:	Fire\*\*\* 
//Event: 		IRSA
//Desc:			
//
//Created By: Silver Lining Solutions

logDebug("Script 15 - Start");
var newInspType = null;
if ((inspType == "FD Complaint Inspection" || inspType == "FD Primary Inspection" || inspType == "FD Initial Unscheduled Inspection")
	&& (inspResult == "Violations Found" || inspResult == "Order Notice" || inspResult == "Fail") )
{
	logDebug("Script 15 - criteria met");
	//determine follow up inspection based on this inspection
	if (inspType == "FD Complaint Inspection")
		{newInspType = "FD Complaint Follow-Up Inspection";}
	if (inspType == "FD Primary Inspection")
		{newInspType = "FD Follow-Up";}
	if (inspType == "FD Initial Unscheduled Inspection")
		{newInspType = "FD Follow-Up";}
		
	//delete full Custom List on the record
	
	//insert a row for each item on the checklist that was in violation
	
	//assign inspector based on inspector assigned to the record
	var inspector = null;
	var assignedStaff = getAssignedStaff();
	if (assignedStaff != null && assignedStaff != "")
		{ inspector = assignedStaff; }
	
	//determine inspection date based on rules
	numFailInsp = getAppSpecific("Number of Failed Inspections");
	
	var daysAhead = 0;
	if((inspResult == "Fail" || inspResult == Violations Found") && numFailInsp == 1 )
	{	//schedule 30 days out
		daysAhead = 30;	}
	else if((inspResult == "Order Notice")
	{	//schedule 3 days out
		daysAhead = 3;	}
	else if((inspResult == "Fail" || inspResult == Violations Found") && (numFailInsp == 2 || numFailInsp == 3) )
	{	//schedule 14 days out
		daysAhead = 14;	}
	else if(numFailInsp >= 4 )
	{	//schedule 1 days out
		daysAhead = 1;	}

	//schedule follow up inspection based on working days
	var dToday = new Date();
	var lookForPlanningMtgDate	= aa.date.parseDate(dateAddHC2(dToday,daysAhead));
	var lookForMMDDYYYY = ("0" + lookForPlanningMtgDate.getMonth()).slice(-2) + "/" 
							+ ("0" + lookForPlanningMtgDate.getDayOfMonth()).slice(-2) + "/" 
							+ lookForPlanningMtgDate.getYear();
	var inspDate = aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,0));
	scheduleInspection(newInspType,inspDate,inspector);

	//copy checklist to new inspection
	var inspId = getScheduledInspId(newInspType);
}

// notify all contacts and attach to record communications

if (inspResult == "Complete" || inspResult == "No Violations Found" || inspResult == "Cancelled")
{
	//close out
	editAppSpecific("Number of Failed Inspections", 0);
	closeTask("Inspection","Compliance/Complete","closed by script 15","closed by script 15");
	updateAppStatus("Complete","updated by script 15");
	closeCap(currentUserId);
}
logDebug("Script 15 - End");
