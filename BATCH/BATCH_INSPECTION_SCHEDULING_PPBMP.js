/*Title : Inspection Scheduling
Purpose : Automatically schedule an inspection for a record type, assigning to supervisor
Author: Erich von Trapp

Functional Area : Batch Job

Description: 
- Automatically schedule an inspection for a record type, assigning to supervisor
- Record must be in "Active" status
- Schedule inspection only if Date of Next Inspection ASI falls within the next 365 days
- Schedule inspection on Date of Next Inspection (ASI)

Required Parameters:
DATE_FIELD_NAME: ASI field name (date) used to schedule inspection
INSPECTION_NAME: the inspection type to be scheduled
INSPECTORS_SUPERVISORS_TABLE: Standard Choice; a map to the supervisor's user ID
RECORD_TYPE: record type to be processed (4 levels)
*/

function getScriptText(e) {
	var t = aa.getServiceProviderCode();
	if (arguments.length > 1)
		t = arguments[1];
	e = e.toUpperCase();
	var n = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var r = n.getScriptByPK(t, e, "ADMIN");
		return r.getScriptText() + ""
	} catch (i) {
		return ""
	}
}

var SCRIPT_VERSION = 3.0;
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));

var DATE_FIELD_NAME = aa.env.getValue("DATE_FIELD_NAME");
var INSPECTION_NAME = aa.env.getValue("INSPECTION_NAME");
var INSPECTORS_SUPERVISORS_TABLE = aa.env.getValue("INSPECTORS_SUPERVISORS_TABLE");
var RECORD_TYPE = aa.env.getValue("RECORD_TYPE");
var emailText = "";		
useAppSpecificGroupName = false;

var capStatus;
var capTypeModel = aa.cap.getCapTypeModel().getOutput();
var tmpAry = RECORD_TYPE.split("/");
capTypeModel.setGroup(tmpAry[0]);
capTypeModel.setType(tmpAry[1]);
capTypeModel.setSubType(tmpAry[2]);
capTypeModel.setCategory(tmpAry[3]);
var capModel = aa.cap.getCapModel().getOutput();
capModel.setCapType(capTypeModel);
var capIDList = aa.cap.getCapIDListByCapModel(capModel);
if (!capIDList.getSuccess()) {
	logDebug("**INFO failed to get capIds list " + capIDList.getErrorMessage());
	capIDList = new Array();//empty array script will exit
} else {
	capIDList = capIDList.getOutput();
}

var currentDate = new Date;
var nextYear = dateAddMonths(currentDate, 12);	

logDebug2("<br><Font Color=RED> Processing " + capIDList.length + " records <br>");

//process list of records
for (c in capIDList) {
	capId = capIDList[c].getCapID();
	capIDString = aa.cap.getCapID(capId.getID1(), capId.getID2(), capId.getID3()).getOutput().getCustomID()	
	logDebug2("<Font Color=BLUE> <br> Processing record " + capIDString)
	var tmpCap = aa.cap.getCap(capId);
	if (!tmpCap.getSuccess()) {
		logDebug("**INFO failed to get CapModel " + capId);
		continue;
	}

	tmpCap = tmpCap.getOutput();
	tmpCap = tmpCap.getCapModel();
	tmpAsiGroups = tmpCap.getAppSpecificInfoGroups();
	
	//get record status
	capStatus = tmpCap.getCapStatus();
	logDebug2("<Font Color=BLACK><br>Record status: " + capStatus);
	
	//skip record if status is not 'Active'
	if (capStatus == "Active") {
		var nextInspectionDate = getAppSpecific(DATE_FIELD_NAME);
		
		if (nextInspectionDate == null || nextInspectionDate == "") {
			logDebug2("<br> No Inspection Date is set. Moving to next record.");
			continue;
		}
		logDebug2("<br> nextInspectionDate: " + nextInspectionDate)
		logDebug2("; nextYear: " + nextYear);
		
		//check if nextInspectionDate falls within the next calendar year
		if (dateDiff(nextInspectionDate, nextYear) <= 365 && dateDiff(nextInspectionDate, nextYear) >= 1) {
			
			logDebug2("<br> Scheduling " + INSPECTION_NAME + " on " + nextInspectionDate);		
			scheduleInspectDate(INSPECTION_NAME, nextInspectionDate)			
			
			var lastSchedInspectionObj = getLastScheduledInspection(capId, INSPECTION_NAME);
			if (lastSchedInspectionObj == null) {
				logDebug2("<br>**INFO failed to scheduleInspectDate() " + capId + " " + INSPECTION_NAME);
				continue;
			}

			//get inspection ID of most recently scheduled inspection, assign to supervisor
			var lastSchedInspectionSeq = lastSchedInspectionObj.getIdNumber();
			var supervisor = assignSupervisor(lastSchedInspectionSeq);
			logDebug2("<br> Assigning Supervisor " + supervisor + " to Inspection ID " + lastSchedInspectionSeq);
		} else {
			logDebug2("<br> Next Inspection Date does not fall within the next year. Moving to next record");
		}
	} else {
		logDebug2("<br>Skipping record; status must be 'Active'");
		continue;
	}
}

//formats date in MM/DD/YYYY format
function formatDateX(scriptDate) {
	if(scriptDate != null)
		{
		var ret = "";
		ret += scriptDate.getMonth().toString().length == 1 ? "0" + scriptDate.getMonth() : scriptDate.getMonth();
		ret += "/";
		ret += scriptDate.getDayOfMonth().toString().length == 1 ? "0" + scriptDate.getDayOfMonth() : scriptDate.getDayOfMonth();
		ret += "/";
		ret += scriptDate.getYear();
		return ret;
		}
}

//returns object of most recently scheduled inspection
function getLastScheduledInspection(capId, inspectionType) {
	//get inspections for this cap (of type INSPECTION_NAME, and SCHED)
	var capInspections = aa.inspection.getInspections(capId);
	if (!capInspections.getSuccess()) {
		return false;
	}
	capInspections = capInspections.getOutput();

	var schedInspWithMaxId = null;
	//find last one (we created)
	for (i in capInspections) {
		//invokeGetters(capInspections[i].getScheduledDate());
		if (capInspections[i].getInspectionType() == inspectionType && formatDateX(capInspections[i].getScheduledDate()) == nextInspectionDate
				&& capInspections[i].getInspectionStatus() == "Scheduled") {

			//if multiple scheduled of same type, make sure to get last one (maxID)
			//this effects calculating WorkLoad (assignSameInspector method)
			if (schedInspWithMaxId == null || schedInspWithMaxId.getIdNumber() < capInspections[i].getIdNumber()) {
				schedInspWithMaxId = capInspections[i];
			}
			//return capInspections[i];
		}//last sched inspection
	}//for all cap inspections
	return schedInspWithMaxId;
}

//finds user ID of supervisor from PPBMP_INSPECTORS_SUPERVISORS_TABLE standard choice and assigns inspection based on passed in sequence ID
function assignSupervisor(lastSchedInspectionSeq) {			
	var inspSupervisor = lookup("PPBMP_INSPECTORS_SUPERVISORS_TABLE", "PPBMP_SUPERVISOR");
	if (!inspSupervisor) {
		logDebug2("<br>**INFO could not retrieve PPBMP_SUPERVISOR from PPBMP_INSPECTORS_SUPERVISORS_TABLE");
		return;
	}
	assignInspection(lastSchedInspectionSeq, inspSupervisor);
	return inspSupervisor;
}

function logDebug2(dstr) {
	
	// function of the same name in ACCELA_FUNCTIONS creates multi lines in the Batch debug log. Use this one instead
	if(showDebug) {
		aa.print(dstr)
		emailText+= dstr + "<br>";
		aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"),dstr)
	}
}