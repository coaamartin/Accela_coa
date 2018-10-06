/*Title : Passed MJ Inspection Automation
Purpose : Automatically schedule inspections and send out relevant notificatons on quarterly cycle for MJ Licenses
Author: Erich von Trapp

Functional Area : Batch Job

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

var EMAIL_TEMPLATE = aa.env.getValue("EMAIL_TEMPLATE");
var RECORD_TYPE = aa.env.getValue("RECORD_TYPE");
useAppSpecificGroupName = false;

showDebug = true;
var capStatus;

//grab all Licenses/Marijuana/*/License records
var capTypeModel = aa.cap.getCapTypeModel().getOutput();
var tmpAry = RECORD_TYPE.split("/");
capTypeModel.setGroup(tmpAry[0]);
capTypeModel.setType(tmpAry[1]);
//capTypeModel.setSubType(tmpAry[2]);
capTypeModel.setCategory(tmpAry[3]);
var capModel = aa.cap.getCapModel().getOutput();
capModel.setCapType(capTypeModel);
var capIDList = aa.cap.getCapIDListByCapModel(capModel);
if (!capIDList.getSuccess()) {
	logDebug2("**INFO failed to get capIds list " + capIDList.getErrorMessage());
	capIDList = new Array();//empty array script will exit
} else {
	capIDList = capIDList.getOutput();
}
//ATTN, this will need to be updated to accomodate MJ Store                           <<<<<----------------------------------
var daysToAdd = 91;
var vIsMJLicense;
var vIsMJRetailStoreLicense;
var inspectionTypesAry = [ "MJ AMED Inspections", "MJ Building Inspections - Electrical", "MJ Building Inspections - Life Safety",
	"MJ Building Inspections - Mechanical", "MJ Building Inspections - Plumbing", "MJ Building Inspections - Structural", "MJ Security Inspections - 3rd Party",
	"MJ Zoning Inspections", "MJ Building Inspections", "MJ Code Enforcement Inspections", "MJ Planning Inspections", "MJ Security Inspections - Police" ];

vIsMJRetailStoreLicense = false;
vIsMJLicense = appMatch("Licenses/Marijuana/*/License");

logDebug2("<br><Font Color=RED> Processing " + capIDList.length + " records <br>");

for (c in capIDList) {
	capId = capIDList[c].getCapID();
	capIDString = aa.cap.getCapID(capId.getID1(), capId.getID2(), capId.getID3()).getOutput().getCustomID()	
	logDebug2("<Font Color=BLUE> Processing record " + capIDString)
	
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
	logDebug2("<Font Color=BLACK>Record status: " + capStatus);
	
	//skip record if status is not 'Active'
	if (capStatus == "Active") {
		var cycleInspections = getCycleInspections(capId);
		
		//debug text
		for (j in cycleInspections) {
			logDebug2("Inspection ID :" + cycleInspections[j].getIdNumber());
		}
	} else {
		logDebug2("Skipping record; status must be 'Active'");
		continue;
	}

	
}


//returns object of inspections from current quarterly cycle
function getCycleInspections(capId) {
	//get inspections for this cap
	var capInspections = aa.inspection.getInspections(capId);
	if (!capInspections.getSuccess()) {
		logDebug2("Failed to retrieve inspections from Record " + aa.cap.getCapID(capId.getID1(), capId.getID2(), capId.getID3()).getOutput().getCustomID());
		return false;
	}
	capInspections = capInspections.getOutput();
	var returnArray;
	var nextInspDate = getAppSpecific("Next Inspection Date");
	if (nextInspDate == null || nextInspDate == "") {
			logDebug2("Skipping record, Next Inpsection Date field is empty");
			return false;
	} else {
		nextInspDate = new Date(nextInspDate);
	}
	var beginCycleDate = new Date();	
	beginCycleDate.setMonth(nextInspDate.getMonth());
	beginCycleDate.setFullYear(nextInspDate.getFullYear());
	beginCycleDate.setDate(nextInspDate.getDate() - daysToAdd);
	beginCycleDate.setHours(0);
	beginCycleDate.setMinutes(0);
	beginCycleDate.setSeconds(0);
	beginCycleDate = new Date(beginCycleDate);
	
	var inspWithMaxId = null;
	
	logDebug2("Begin Cycle Date: " + beginCycleDate);
	logDebug2("Next Inspection Date: " + nextInspDate);
	
	
	//find inspections within this quarterly cycle
	for (i in capInspections) {
		if (capInspections[i].getScheduledDate() < nextInspDate && capInspections[i].getScheduledDate() >= beginCycleDate) {
			
			//if multiple scheduled of same type, make sure to get last one (maxID)
			if (inspWithMaxId == null || (inspWithMaxId.getInspectionType() == capInspections[i].getInspectionType() && inspWithMaxId.getIdNumber() < capInspections[i].getIdNumber())) {
				inspWithMaxId = capInspections[i];
				returnArray.push(inspWithMaxId);
			} else {
				returnArray.push(capInspections[i]);
			}
		}//last sched inspection
	}//for all cap inspections
	return returnArray;
}






















function logDebug2(dstr) {
	
	// function of the same name in ACCELA_FUNCTIONS creates multi lines in the Batch debug log. Use this one instead
	if(showDebug) {
		aa.print(dstr + "<br>");
		//emailText+= dstr + "<br>";
		aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"),dstr);
	}
}