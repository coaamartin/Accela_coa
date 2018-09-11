/*Title : Inspection Scheduling
Purpose : Automatically schedule an inspection for a record type, assigning same inspector from last time (if available)
Author: Yazan Barghouth

Functional Area : Batch Job

Description: 
- Automatically schedule an inspection for a record type, assigning same inspector from last time (if available)
If no previous inspection were scheduled/resulted for the CAP, an inspection is scheduled without being assigned to a user.
If last inspector is not available (workload wise) the supervisor will be assigned to the new scheduled inspection
- required parameters: 
	DATE_FIELD_NAME: ASI field name that contains inspection date
	INSPECTION_NAME: inspection name to schedule
	INSPECTORS_SUPERVISORS_TABLE: file name, of a lookup table lists inspectors and their supervisors
	RECORD_TYPE: record type to work with

- INSPECTORS_SUPERVISORS_TABLE sample JSON: {"inspectorUserID":"superVisorNameUserID",...}
- should be all upper case to match getUserID() in search
{
  "AMMAN05": "SABA",
  "AMMAN06": "SABA",
}

-- Last Inspector Availability:
using method aa.inspection.getInspectorsWorkload()
this returns how much % free load the user have (double number 0.0 - 1.0, ex 0.3 means 30%)

the inspection being assigned "Units" value is used 
with "Daily Inspection Units", to calculate how much load this inspection will need (a percentage %)

then this value compared to user's Free load.

Parameters:
DATE_FIELD_NAME: ASI field name (date) used to schedule inspection
INSPECTION_NAME: the inspection type to be scheduled
INSPECTORS_SUPERVISORS_TABLE: file name, of a lookup table lists inspectors and their supervisors
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

useAppSpecificGroupName = false;
var emailText = "";		

//try {
	showDebug = true
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
	
	//var sysYear = aa.date.getCurrentDate().getYear();
	var currentDate = new Date;
	var nextYear = dateAddMonths(currentDate, 12);	
	
	logDebug2("<br><Font Color=RED> Processing " + capIDList.length + " records <br>");
	
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
		var nextInspectionDate = getAppSpecific(DATE_FIELD_NAME);
		logDebug2("<Font Color=BLACK> <br> nextInspectionDate: " + nextInspectionDate)
		if (nextInspectionDate == null || nextInspectionDate == "") {
			logDebug2("<br> No Inspection Date is set. Moving to next record.");
			continue;
		}//date null/empty
		
		//nextInspectionYear = aa.date.parseDate(nextInspectionDate).getYear();
		//logDebug2("<br> nextInspectionYear: " + nextInspectionYear + ", sysYear: " + sysYear);
		
		logDebug2("<br> nextYear: " + nextYear);
		
		//if (nextInspectionYear == sysYear) {
		
		logDebug2("<br> dateDiff(nextYear, nextInspectionDate):" + dateDiff(nextYear, nextInspectionDate));
		logDebug2("<br> dateDiff(nextInspectionDate, currentDate):" + dateDiff(nextInspectionDate, currentDate));
		if (dateDiff(nextYear, nextInspectionDate) < 365 && dateDiff(nextInspectionDate, currentDate) > 0) {
			
			//schedule only, then try to assign
			//var lastInspectorId = getLastInspector(INSPECTION_NAME);
			//logDebug2("<br> lastInspectorId: " + lastInspectorId)
			//if (lastInspectorId == null) {
			//	//we can't assign to last inspector, and we can't get supervisor
			//	logDebug2("<br> Last Inspector ID is null, scheduling without assignment");
			//	scheduleInspectDate(INSPECTION_NAME, nextInspectionDate);
			//	continue;
			//}

			logDebug2("<BR> Scheduling " + INSPECTION_NAME + " on " + nextInspectionDate);		
			scheduleInspectDate(INSPECTION_NAME, nextInspectionDate)
			
			//var lastSchedInspectionObj = getLastScheduledInspection(capId, INSPECTION_NAME);
			//if (lastSchedInspectionObj == null) {
			//	logDebug("**INFO failed to scheduleInspectDate() " + capId + " " + INSPECTION_NAME);
			//	continue;
			//}

			//var lastSchedInspectionSeq = lastSchedInspectionObj.getIdNumber();

			//var assignTolastInsp = assignSameInspector(capId, lastSchedInspectionObj, nextInspectionDate, lastInspectorId);
			//if (!assignTolastInsp) {
			//	var supervisor = assignSupervisor(lastSchedInspectionSeq, lastInspectorId);
			//	logDebug2("<BR> Assigning Supervisor " + supervisor + " to Inspection ID " + lastSchedInspectionSeq )
			//}

		} else {
			//logDebug2("<br> Inspection year and system year do not match. Moving to next record.");
			logDebug2("<br> Next Inspection Date does not fall within the next year. Moving to next record");
		}
	}//for all capIds
//} catch (ex) {
	//logDebug("**ERROR: Exception while running batch job , Error: " + ex);
//}

/**
 * Format a ScriptDate mm/dd/yyyy
 * @param scriptDate
 * @returns {String} formatted date
 */
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

/**
 * return last scheduled inspection (object) that has max id
 * @param capId
 * @param inspectionType
 * @returns Inspection Object
 */
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

/***
 * this method tries to assign a scheduled inspection to a specific Inspecrot(User) if User's workload allows that.
 * <br/>Inspection workload percentage is calculated (InspectionsUnit/dailyInspectorUnits), if this percentage less than or equals
 * <br/>Inspector available workload (remaining capacity) then the inspection is assigned.
 * @param capId
 * @param lastSchedInspectionObj
 * @param nextInspectionDate
 * @param lastInspectorId
 * @returns {Boolean}
 */
 
function assignSameInspector(capId, lastSchedInspectionObj, nextInspectionDate, lastInspectorId) {
	if (lastInspectorId == null) {
		return false;
	}

	if (lastSchedInspectionObj == null) {
		return false;
	}
	var lastSchedInspectionSeq = lastSchedInspectionObj.getIdNumber();

	var inspectionGroup = lastSchedInspectionObj.getInspection().getActivity().getInspectionGroup();
	var inspectionType = lastSchedInspectionObj.getInspection().getActivity().getActivityDescription();

	var inspTypeObj = aa.inspection.getInspectionType(inspectionGroup, inspectionType);
	if (inspTypeObj.getSuccess()) {
		inspTypeObj = inspTypeObj.getOutput();
	} else {
		return false;
	}
	if (inspTypeObj == null || inspTypeObj[0].length == 0) {
		return false;
	}
	//get inspection units (used in calculation later)
	var inspectionUnits = inspTypeObj[0].getInspUnits();

	//get inspector Department
	var lastInspectorUser = aa.person.getUser(lastInspectorId);
	if (!lastInspectorUser.getSuccess()) {
		return false;
	}
	lastInspectorUser = lastInspectorUser.getOutput();

	//get work load for this inspection
	var ary = new Array();
	ary.push(lastSchedInspectionSeq);
	var workLoad = aa.inspection.getInspectorsWorkload(ary, capId, aa.date.parseDate(nextInspectionDate));
	if (!workLoad.getSuccess()) {
		return false;
	}

	workLoad = workLoad.getOutput();//ArrayList

	//check lastInspector is in the list
	var userIndex = workLoad.indexOf(lastInspectorUser);
	if (userIndex < 0) {
		return false;
	}
	//User's Daily Inspection Units (absolute number)
	var dailyInspectorUnits = workLoad.get(userIndex).getDailyInspUnits();
	//remaining capacity for inspector (Free percentage)
	var inspectorAvailableWorkLoadPercentage = workLoad.get(userIndex).getWorkload();

	//calculate how much % this inspection will cost the inspector
	var inspectionRequiredWorkloadPercentage = 0.0;
	inspectionRequiredWorkloadPercentage = (parseFloat(inspectionUnits) / parseFloat(dailyInspectorUnits));

	//if cost% is within inspectors capacity (Free %)
	if (inspectorAvailableWorkLoadPercentage >= inspectionRequiredWorkloadPercentage) {
		assignInspection(lastSchedInspectionSeq, lastInspectorId);
		return true;
	}

	return false;
}

function assignSupervisor(lastSchedInspectionSeq, lastInspectorId) {
	superVisor = lookup("PPBMP_INSPECTORS_SUPERVISORS_TABLE",lastInspectorId)
	//var lookupTableJsonStr = getScriptText(INSPECTORS_SUPERVISORS_TABLE);
	//var lookupTableJsonObj = JSON.parse(lookupTableJsonStr);
	//var superVisor = lookupTableJsonObj[lastInspectorId];
	if (!superVisor) {
		logDebug("**INFO could not get supervisor for " + lastInspectorId);
		return;
	}
	assignInspection(lastSchedInspectionSeq, superVisor);
	return superVisor;
}

function logDebug2(dstr)
	{
	// function of the same name in ACVCELA_FUNCTIONS creates multi lines in the Batch debug log. Use this one instead
	if(showDebug)
		{
		aa.print(dstr)
		emailText+= dstr + "<br>";
		aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"),dstr)
		}
	}