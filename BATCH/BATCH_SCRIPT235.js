/*
Title : When the batch job is ran(Will be scheduled to run daily)If a PI Inspection is scheduled for the current day and is still in a
"Scheduled" status at 11:59 pm that day then update the inspection result status to "Missed"

Author: Haitham Eleisah

Functional Area : Records

Parameters : None.
Notes:
this batch should be scheduled to run at 11:45 PM for each day.
Sample Call:
UpdateInspectionMissedStatus("Missed", "Scheduled", "PI Inspection", "PublicWorks/Public Improvement/Permit/NA");
This is also part of script 169
 */

function getScriptText(vScriptName, servProvCode, useProductScripts) {
	if (!servProvCode)
		servProvCode = aa.getServiceProviderCode();
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		if (useProductScripts) {
			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
		} else {
			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
		}
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}

var debug = "<h2>Debug Log: </h2>";
var br = "<BR>";

var UpdateStatus = "Missed";
var ScheduledStatus = "Scheduled";
var inspectionType = "PI Inspection";
var recordType = "PublicWorks/Public Improvement/Permit/NA"
UpdateInspectionMissedStatus(UpdateStatus, ScheduledStatus, inspectionType, recordType);
/**
 * this function will check the inspections for the record type and if the inspection still scheduled  will update the status to be missed.
 * @param InspectionStatus
 * @param ScheduledStatus
 * @param inspectionType
 * @param recordType
 */
function UpdateInspectionMissedStatus(InspectionStatus, ScheduledStatus, inspectionType, recordType) {
	var currDate = aa.date.getCurrentDate();
	var recordTypeArray = recordType.split("/");
	//var capTypeModel = aa.cap.getCapTypeModel().getOutput();
	//capTypeModel.setGroup(recordTypeArray[0]);
	//capTypeModel.setType(recordTypeArray[1]);
	//capTypeModel.setSubType(recordTypeArray[2]);
	//capTypeModel.setCategory(recordTypeArray[3]);
    //
	////Getting Cap Model
	//var capModelSearch = aa.cap.getCapModel().getOutput();
	//capModelSearch.setCapType(capTypeModel);
	//var capIDList = aa.cap.getCapIDListByCapModel(capModelSearch).getOutput();

	var capListResult = aa.cap.getByAppType(recordTypeArray[0], recordTypeArray[1], recordTypeArray[2], recordTypeArray[3]);
	
	if(!capListResult.getSuccess()) {LogBatchDebug("DEBUG", "Unable to get records " + capListResult.getErrorMessage(), true); return ; }
	
	capIDList = capListResult.getOutput();
	
	LogBatchDebug("DEBUG", "start checking " + capIDList.length + " caps", false);
	for (i in capIDList) {
		var mycapModel = capIDList[i];
		capIDModel = mycapModel.getCapID();
		var capId = aa.cap.getCapID(capIDModel.getID1(), capIDModel.getID2(), capIDModel.getID3()).getOutput();
		LogBatchDebug("DEBUG", "Cap ID " + capIDModel + ", altID " + capId.getCustomID(), false);
		var inspList;
		var inspResult = aa.inspection.getInspections(capIDModel);
		if (inspResult.getSuccess())
			inspList = inspResult.getOutput();

		LogBatchDebug("DEBUG", "cap has  " + inspList.length + " Inspections", false);
		for (ins in inspList) {
			var inspObj = inspList[ins];
			if (inspObj.getInspectionType().equalsIgnoreCase(inspectionType) && inspObj.getScheduledDate() != null
					&& inspObj.getInspectionStatus().equalsIgnoreCase(ScheduledStatus)) {
				if (compareAccelaDates(inspObj.getScheduledDate(), currDate)) {
					inspObj.setInspectionStatus(InspectionStatus);
					var updateResult = aa.inspection.editInspection(inspObj);
					if (updateResult.getSuccess()) {
						LogBatchDebug("DEBUG", "Inspection Status has been Updated Successfully", false);
					} else {
						LogBatchDebug("ERROR", "Update Inspection Status Failed . Ex " + updateResult.getErrorMessage(), false);
					}
				}

			} else {
				LogBatchDebug("DEBUG", "This inspection does not meet the criteria ", false);
			}

		}

	}
}

/**
 * this function to compare between 2 days
 * @param Date1 
 * @param Date2
 * @returns true if the dates is matched else will return false
 */
function compareAccelaDates(Date1, Date2) {
	var formattedDate1 = Date1.getMonth() + '/' + Date1.getDayOfMonth() + '/' + Date1.getYear();
	var formattedDate2 = Date2.getMonth() + '/' + Date2.getDayOfMonth() + '/' + Date2.getYear();

	if (formattedDate1 == formattedDate2)
		return true;

	return false;

}

///

function LogBatchDebug(etype, edesc, createEventLog) {

	var msg = etype + " : " + edesc;

	if (etype == "ERROR") {
		msg = "<font color='red' size=2>" + msg + "</font><BR>"
	} else {
		msg = "<font color='green' size=2>" + msg + "</font><BR>"
	}
	if (etype == "DEBUG") {

		aa.print(msg);

	} else {
		aa.print(msg);
	}
	debug += msg;
}