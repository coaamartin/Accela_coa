/**
 * Schedule the Stake Removal Inspection for all Forestry/Request/Planting/NA records where workflow task Quality Control
has a status of Complete Staked and Status date was 1 year ago or more.
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

var RECORD_TYPE = aa.env.getValue("RECORD_TYPE");
var TASK_NAME = aa.env.getValue("TASK_NAME");
var TASK_STATUS = aa.env.getValue("TASK_STATUS");
var INSPECTION_NAME = aa.env.getValue("INSPECTION_NAME");
var INSPECTION_DAYS_AHEAD = aa.env.getValue("INSPECTION_DAYS_AHEAD");

var taskCompletedBeforeDays = 365;

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

var currDateStr = formatDateX(aa.date.getCurrentDate());

for (c in capIDList) {
	var capId = capIDList[c].getCapID();
	var isStatus = isTaskStatus(TASK_NAME, TASK_STATUS);
	//check status date
	if (isStatus) {
		var statusDateStr = taskStatusDate(TASK_NAME);
		statusDateStr = formatDateX(aa.date.parseDate(statusDateStr));
		var diff = aa.date.diffDate(currDateStr, statusDateStr);

		if (diff >= taskCompletedBeforeDays) {
			var schduleDate = aa.date.addDate(currDateStr, INSPECTION_DAYS_AHEAD);

			if (!isAlreadyScheduled(capId, INSPECTION_NAME, schduleDate)) {
				scheduleInspectDate(INSPECTION_NAME, schduleDate);
			}
		}
	}
}//for all caps

/**
 * Check if an inspection is already scheduled on same date of same type
 * @param recordCapId
 * @param inspectionType
 * @param scheduleDate
 * @returns {Boolean}
 */
function isAlreadyScheduled(recordCapId, inspectionType, scheduleDate) {
	var t = aa.inspection.getInspections(recordCapId);
	if (t.getSuccess()) {
		inspList = t.getOutput();
		inspList.sort(compareInspDateDesc);
		for (xx in inspList) {
			if (String(inspectionType).equals(inspList[xx].getInspectionType()) && inspList[xx].getInspectionStatus().equals("Scheduled")) {
				var paramDate = aa.date.parseDate(scheduleDate);
				var insDate = inspList[xx].getScheduledDate();
				if (paramDate.getYear() == insDate.getYear() && paramDate.getMonth() == insDate.getMonth() && paramDate.getDayOfMonth() == insDate.getDayOfMonth()) {
					return true;
				}
			}
		}//for all inspections
	}//success
	return false;
}

function formatDateX(scriptDate) {
	var ret = "";
	ret += scriptDate.getMonth().toString().length == 1 ? "0" + scriptDate.getMonth() : scriptDate.getMonth();
	ret += "/";
	ret += scriptDate.getDayOfMonth().toString().length == 1 ? "0" + scriptDate.getDayOfMonth() : scriptDate.getDayOfMonth();
	ret += "/";
	ret += scriptDate.getYear();
	return ret;
}
