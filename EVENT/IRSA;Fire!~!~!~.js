include("5_fireCompleteOrNoViolations");
//Written by SWAKIL
//duplicate script below.   Replaced by script 15 below.
//include("42_FireViolationsSummary");

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
	else if((inspResult == "Fail" || inspResult == "Violations Found") && (numFailInsp == 2 || numFailInsp == 3) )
	{	//schedule 14 days out
		daysAhead = 14;	}
	else if(numFailInsp >= 4 )
	{	//schedule 1 days out
		daysAhead = 1;	}

	//schedule follow up inspection based on working days
	//var dToday = new Date();
	//var td = aa.date.parseDate(dateAddHC2(dToday,daysAhead,true));
	//var targetDateString = ("0" + td.getMonth()).slice(-2) + "/" + ("0" + td.getDayOfMonth()).slice(-2) + "/" + td.getYear();
	//var oneDay = 24*60*60*1000; // number of millisec in a day
	//var targetDate = new Date(targetDateString);
	//var daysOut = Math.round(Math.abs((targetDate.getTime() - dToday.getTime())/(oneDay)));

	//delete full Custom List on the record
	removeASITable("Fire Violations");

	//insert a row for each item on the checklist that was in violation

	var gsi = getGuideSheetObjects(inspId);
	if (gsi) {
		for (var gs in gsi) {
			var t = gsi[gs];
			t.loadInfoTables();
			if (t.validTables) {
				var g = (t.infoTables["FIRE VIOLATIONS"] ? t.infoTables["FIRE VIOLATIONS"] : []);
				for (var fvi in g) {
					var fvit = g[fvi];
					if ("Non Compliance".equals(fvit["Violation Status"])) {
						var thisViolation = [{
								colName: "Sort Order",
								colValue: String(fvit["Sort Order"])
							}, {
								colName: "Violation",
								colValue: String(fvit["Violation"])
							}, {
								colName: "Comment",
								colValue: String(fvit["Comment"])
							}, {
								colName: "Violation Status",
								colValue: String(fvit["Violation Status"])
							}
						];
						addAsiTableRow("FIRE VIOLATIONS", thisViolation);
					}
				}
			}
		}
	}

	scheduleInspection(newInspType,daysAhead,inspector);

	//copy checklist to new inspection
	var newInspId = getScheduledInspId(newInspType);
	if (newInspId) {
		copyGuideSheetItemsByStatus(inspId, newInspId);
	}
}

// notify all contacts and attach to record communications

pEParams = aa.util.newHashtable();
addParameter(pEParams, "$$FullAddress$$", getCapFullAddress());
pRParams = aa.util.newHashtable();
addParameter(pRParams, "Record ID", capIDString);
emailContactsWithReportLinkASync("All","FIRE INSPECTION RESULTS #15", pEParams, "Fire_Primary_Inspection", pRParams);

if (inspResult == "Complete" || inspResult == "No Violations Found" || inspResult == "Cancelled")
{
	//close out
	editAppSpecific("Number of Failed Inspections", 0);
	closeTask("Inspection","Compliance/Complete","closed by script 15","closed by script 15");
	updateAppStatus("Complete","updated by script 15");
	closeCap(currentUserId);
}
logDebug("Script 15 - End");

