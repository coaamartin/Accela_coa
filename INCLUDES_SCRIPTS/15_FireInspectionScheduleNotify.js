//Written by SWAKIL
//duplicate script below.   Replaced by script 15 below.
//include("5042_FireViolationsSummary");

//*****************************************************************************
//Script 15
//Record Types:	Fire\*\*\* 
//Event: 		IRSA
//Desc:			
//
//Created By: Silver Lining Solutions
//******************************************************************************
logDebug("Script 15 - Start");
var newInspType = null;

var inspectionExist = aa.inspection.getInspections(capId);
if (!inspectionExist.getSuccess()) {
   
}   

if ((inspType == "FD Follow-up" || inspType == "FD Complaint Inspection" || inspType == "FD Primary Inspection" || inspType == "FD Initial Unscheduled Inspection" || inspType == "FD Complaint Follow-Up Inspection" || inspType == "FD Operational Permit" || inspType == "FD TUP" || inspType == "FD Initial Requested Inspection")
	&& (inspResult == "Violations Found" || inspResult == "Order Notice" || inspResult == "Fail" || inspResult == "Stop Use" || inspResult == "Summons Served" || inspResult == "Parking Citation Issued" || inspResult == "Pre-citation Issued"))
{
	logDebug("Script 15 - criteria met");
	
	//determine follow up inspection based on this inspection
	if (inspType == "FD Complaint Inspection")
		{newInspType = "FD Complaint Follow-Up Inspection";}
	else if (inspType == "FD Primary Inspection")
		{newInspType = "FD Follow-up";}
	else if (inspType == "FD Initial Unscheduled Inspection")
		{newInspType = "FD Follow-up";}
	else if (inspType == "FD Follow-up")
		{newInspType = "FD Follow-up";}
	else if (inspType == "FD Complaint Follow-Up Inspection")
		{newInspType = "FD Complaint Follow-Up Inspection";}
	else {newInspType = "FD Follow-up";}
		
	//assign inspector based on inspector assigned to the record
	var inspector = null;
	var assignedStaff = getAssignedStaff();
	if (assignedStaff != null && assignedStaff != "")
		{ inspector = assignedStaff; }
	
	//determine inspection date based on rules
	numFailInsp = parseInt(getAppSpecific("Number of Failed Inspections"));
	
	var daysAhead = 0;
	if((inspResult == "Fail" || inspResult == "Violations Found") && numFailInsp == 1 )
	{	//schedule 30 days out
		daysAhead = 30;	}
	else if(inspResult == "Order Notice")
	{	//schedule 3 days out
		daysAhead = 3;	}
	else if((inspResult == "Fail" || inspResult == "Violations Found") && numFailInsp == 2)
	{	//schedule 14 days out
		daysAhead = 14;	}
	else if (numFailInsp == 3 && inspResult == "Violations Found")
	{
		daysAhead = 7;
	}
	else if(numFailInsp >= 4 || matches(inspResult, "Stop Use", "Pre-citation Issued", "Summons Served", "Parking Citation Issued"))
	{	//schedule 1 days out
		daysAhead = 1;	}
	showDebug = true
	logDebug("daysAhead " + daysAhead)
	//schedule follow up inspection based on working days
	//var dToday = new Date();
	//var td = aa.date.parseDate(dateAddHC2(dToday,daysAhead,true));
	var schedDate = dateAddHC2(null,daysAhead,true)
	var schedDate2 = dateAddHC(null,daysAhead,true)
	logDebug("schedDate " + schedDate)
	logDebug("schedDate2 " + schedDate2)
	//var targetDateString = ("0" + td.getMonth()).slice(-2) + "/" + ("0" + td.getDayOfMonth()).slice(-2) + "/" + td.getYear();
	//var oneDay = 24*60*60*1000; // number of millisec in a day
	//var targetDate = new Date(targetDateString);
	//var daysOut = Math.round(Math.abs((targetDate.getTime() - dToday.getTime())/(oneDay)));

	scheduleInspection(newInspType,daysAhead,inspector, 0, "Scheduled due to previous inspection result: " + inspResult);
	//scheduleInspectDate(newInspType,schedDate,inspector);
	//copy checklist to new inspection
	var newInspId = getScheduledInspId(newInspType);
	if (newInspId) {
		copyGuideSheetItemsByStatus(inspId, newInspId);
	}
	
	//delete full Custom List on the record
	removeASITable("Fire Violations");

	//insert a row for each item on the checklist that was in violation
	// var gsi = getGuideSheetObjects(inspId);
	// if (gsi) {
	// 	for (var gs in gsi) {
	// 		var t = gsi[gs];
	// 		t.loadInfoTables();
	// 		if (t.validTables) {
	// 			for (var tb in t.infoTables)
	// 			{					
	// 				var g = (t.infoTables[tb] ? t.infoTables[tb] : []);
	// 				for (var fvi in g) {
	// 					var fvit = g[fvi];
	// 					if ("Non Compliance".equals(fvit["Violation Status"])) {
	// 						var thisViolation = [{
	// 								colName: "Sort Order",
	// 								colValue: fvit["Sort Order"] || ""
	// 							}, {
	// 								colName: "Violation",
	// 								colValue: fvit["Violation"] || ""
	// 							}, {
	// 								colName: "Comment",
	// 								colValue: fvit["Comment"] || ""
	// 							}, {
	// 								colName: "Violation Status",
	// 								colValue: fvit["Violation Status"] || ""
	// 							}
	// 						];
	// 						addAsiTableRow(tb, thisViolation);
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// }


}

// notify all contacts and attach to record communications
logDebug("InspType: " + inspType);
logDebug("Starting notification to all contacts")

if ("FD Primary Inspection".equals(inspType) && "Violations Found".equals(inspResult))
{
	logDebug("Kicking off SEND_FIRE_INSP_RESULT");
	var envParameters = aa.util.newHashMap();
	envParameters.put("capId", capId);
	envParameters.put("cap", cap);
	envParameters.put("reportName", "Fire_Primary_Inspection");
	envParameters.put("InspActNumber", inspId);
	logDebug("Sending Fire Primary Inspection for Inspection type: " + inspType);
	var vAsyncScript = "SEND_FIRE_INSP_RESULT";
	aa.runAsyncScript(vAsyncScript, envParameters);	
}
else if ("Order Notice".equals(inspType))
{
	logDebug("Kicking off SEND_FIRE_INSP_RESULT");
	var envParameters = aa.util.newHashMap();
	envParameters.put("capId", capId);
	envParameters.put("cap", cap);
	//envParameters.put("reportName", "Fire_Primary_Inspection");
	envParameters.put("reportName", "Fire Order Notice");
	envParameters.put("InspActNumber", inspId);
	logDebug("Sending Fire Order Notice for Inspection type: " + inspType);
	var vAsyncScript = "SEND_FIRE_INSP_RESULT";
	aa.runAsyncScript(vAsyncScript, envParameters);	
}
else if ("FD Complaint Inspection".equals(inspType) && "Violations Found".equals(inspResult))
{
	logDebug("Kicking off SEND_FIRE_INSP_RESULT");
	var envParameters = aa.util.newHashMap();
	envParameters.put("capId", capId);
	envParameters.put("cap", cap);
	envParameters.put("reportName", "Fire_Primary_Inspection");
	envParameters.put("InspActNumber", inspId);
	logDebug("Sending Fire_Primary_Inspection for Inspection type: " + inspType);
	var vAsyncScript = "SEND_FIRE_INSP_RESULT";
	aa.runAsyncScript(vAsyncScript, envParameters);	
}

else if ("FD Follow-up".equals(inspType) && "Violations Found".equals(inspResult))
{
	logDebug("Kicking off SEND_FIRE_INSP_RESULT");
	var envParameters = aa.util.newHashMap();
	envParameters.put("capId", capId);
	envParameters.put("cap", cap);
	//envParameters.put("reportName", "Fire_Follow_Up_Inspection");
	envParameters.put("reportName", "Fire_Primary_Inspection");
	envParameters.put("InspActNumber", inspId);	
	logDebug("Sending Fire Follow_up");
	var vAsyncScript = "SEND_FIRE_INSP_RESULT";
	aa.runAsyncScript(vAsyncScript, envParameters);	
}
if (inspResult == "Complete" || inspResult == "No Violations Found" || inspResult == "Cancelled")
{
	//close out
	editAppSpecific("Number of Failed Inspections", 0);
	closeTask("Inspection","Compliance/Complete","closed by script 15","closed by script 15");
	updateAppStatus("Complete","updated by script 15");
	closeCap(currentUserID);
}
logDebug("Script 15 - End");
