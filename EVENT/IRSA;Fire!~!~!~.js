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
		
	//assign inspector based on inspector assigned to the record
	var inspector = null;
	var assignedStaff = getAssignedStaff();
	if (assignedStaff != null && assignedStaff != "")
		{ inspector = assignedStaff; }
	
	//determine inspection date based on rules
	numFailInsp = getAppSpecific("Number of Failed Inspections");
	
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
	var dToday = new Date();
	var td = aa.date.parseDate(dateAddHC2(dToday,daysAhead,true));
	var targetDateString = ("0" + td.getMonth()).slice(-2) + "/" + ("0" + td.getDayOfMonth()).slice(-2) + "/" + td.getYear();
	var oneDay = 24*60*60*1000; // number of millisec in a day
	var targetDate = new Date(targetDateString);
	var daysOut = Math.round(Math.abs((targetDate.getTime() - dToday.getTime())/(oneDay)));
	scheduleInspection(newInspType,daysOut,inspector);

	//copy checklist to new inspection
	var inspId = getScheduledInspId(newInspType);
logDebug("Script 15 - check point 3");

	//delete full Custom List on the record
	deleteASIT("Fire Violations");
	
	//insert a row for each item on the checklist that was in violation
	
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


function deleteASIT(tableName)
{
	// Create a HashMap.
	var searchConditionMap = aa.util.newHashMap(); // Map<columnName, List<columnValue>>
	// Create a List object to add the value of Column.
	var columnName ="Violation Status";
	var valuesList = aa.util.newArrayList();
	valuesList.add("Compliance");
	valuesList.add("Corrected On Site");
	valuesList.add("Non Compliance");
	searchConditionMap.put(columnName, valuesList);

	var capIDModel = aa.cap.getCapIDModel(capId.getID1(),capId.getID2(),capId.getID3()).getOutput();
logDebug("deleteASIT - checkpoint 1");
	var appSpecificTableInfo = aa.appSpecificTableScript.getAppSpecificTableInfo(capIDModel, tableName, searchConditionMap);
	if (appSpecificTableInfo.getSuccess())
	{
logDebug("deleteASIT - checkpoint 2");
		var appSpecificTableModel = appSpecificTableInfo.getOutput().getAppSpecificTableModel();
		var tableFields = appSpecificTableModel.getTableFields(); // List
		if (tableFields != null && tableFields.size() > 0)
		{
logDebug("deleteASIT - checkpoint 3");
			var deleteIDsArray = []; // delete ASIT data rows ID
			for(var i=0; i < tableFields.size(); i++)
			{
logDebug("deleteASIT - checkpoint 4");
				var fieldObject = tableFields.get(i); // BaseField
				// get the column name.
				var columnName = fieldObject.getFieldLabel();
				// get the value of column
				var columnValue = fieldObject.getInputValue();
				// get the row ID 
				var rowID = fieldObject.getRowIndex();
				aa.print(columnName + ": " + columnValue + "   rowID: " + rowID);
				deleteIDsArray.push(rowID);
			}
			var result = deletedAppSpecificTableInfors(tableName, capIDModel, deleteIDsArray);
logDebug("deleteASIT - checkpoint 5 - result = " + result);
printObject(result);
		}	
	}
}


/**
* Delete ASIT rows data by rowID, format: Array[rowID]
**/
function deletedAppSpecificTableInfors(tableName, capIDModel, deleteIDsArray/** Array[rowID] **/)
{
logDebug("deleteASIT - checkpoint 10");
	if (deleteIDsArray == null || deleteIDsArray.length == 0)
	{
		return;
	}
logDebug("deleteASIT - checkpoint 11");	
	var asitTableScriptModel = aa.appSpecificTableScript.createTableScriptModel();
	var asitTableModel = asitTableScriptModel.getTabelModel();
	var rowList = asitTableModel.getRows();
	asitTableModel.setSubGroup(tableName);
	for (var i = 0; i < deleteIDsArray.length; i++)
	{
logDebug("deleteASIT - checkpoint 12");
		var rowScriptModel = aa.appSpecificTableScript.createRowScriptModel();
		var rowModel = rowScriptModel.getRow();
		rowModel.setId(deleteIDsArray[i]);
		rowList.add(rowModel);
	}
	return aa.appSpecificTableScript.deletedAppSpecificTableInfors(capIDModel, asitTableModel);
}	

