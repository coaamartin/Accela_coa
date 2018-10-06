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
		logDebug2("**INFO failed to get CapModel " + capId);
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
		
		//debug text                            <<<<<----------------------------------
		for (j in cycleInspections) {
			logDebug2("Inspection ID :" + cycleInspections[j].getIdNumber());
		}
		
		scheduleNextInspections(cycleInspections);
		
	} else {
		logDebug2("<Font Color=RED> Skipping record; status must be 'Active'<Font Color=BLACK>");
		continue;
	}

	
}


//returns object of inspections from current quarterly cycle
function getCycleInspections(capId) {
	
	//get all inspections for this cap
	var capInspections = aa.inspection.getInspections(capId);
	if (!capInspections.getSuccess()) {
		logDebug2("Failed to retrieve inspections from Record " + aa.cap.getCapID(capId.getID1(), capId.getID2(), capId.getID3()).getOutput().getCustomID());
		return false;
	}
	capInspections = capInspections.getOutput();
	var returnArray = [];
	
	//establish date boundaries
	var nextInspDate = getAppSpecific("Next Inspection Date");
	if (nextInspDate == null || nextInspDate == "") {
			logDebug2("<Font Color=RED> Skipping record; Next Inpsection Date field is empty<Font Color=BLACK>");
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
	
	//debug text, remove eventually                           <<<<<----------------------------------
	logDebug2("Begin Cycle Date: " + beginCycleDate);
	logDebug2("Next Inspection Date: " + nextInspDate);
	
	//filter to inspections within this quarterly cycle
	for (i in capInspections) {
		var inspSchedDate = capInspections[i].getScheduledDate();
		inspSchedDate = convertDate(inspSchedDate);
		if (inspSchedDate < nextInspDate && inspSchedDate >= beginCycleDate) {
			
			//if multiple inspections of the same type, add the most recent
			var pos = -1;				
			for (p in returnArray) {
				pos = returnArray[p].getInspectionType().indexOf(capInspections[i].getInspectionType());
				if (pos == 0) {
					pos = p;
					break;
				}							
			}
			if (pos == -1) {
				returnArray.push(capInspections[i]);
			} else {
				returnArray[pos] = capInspections[i];
			}
		}
	}
	return returnArray;
}

//schedules inspections that have a status of "Passed" or "Passed - Minor Violations" and assigns to previous inspector
function scheduleNextInspections(cycleInspections) {
	var inspCounter = 0;
	for (i in cycleInspections) {
		if (cycleInspections[i].getInspectionStatus() == "Passed" || cycleInspections[i].getInspectionStatus() == "Passed - Minor Violations") {
			var inspector = getInspectorByInspID(cycleInspections[i].getIdNumber());
			var inspType = cycleInspections[i].getInspectionType();
			var nextInspDate = getAppSpecific("Next Inspection Date");
			scheduleInspectDate(inspType, nextInspDate, inspector);
			inspCounter++;
		}
	}
	if (inspCounter != 0) {
		logDebug2("<Font Color=GREEN> Scheduled " + inspCounter + " new inspections<Font Color=BLACK>");
	} else {
		logDebug2("No new inspections were scheduled");
	}
}

//Get inspector by inspection ID
function getInspectorByInspID(iNumber) {

    var itemCap = capId;
    var iObjResult = aa.inspection.getInspection(itemCap, iNumber);
    if (!iObjResult.getSuccess()) {
        logDebug2("**WARNING retrieving inspection " + iNumber + " : " + iObjResult.getErrorMessage());
        return false;
    }
    
    iObj = iObjResult.getOutput();
    inspUserObj = aa.person.getUser(iObj.getInspector().getFirstName(),iObj.getInspector().getMiddleName(),iObj.getInspector().getLastName()).getOutput();
    return inspUserObj.getUserID();
}

//used to print debug from batch process
function logDebug2(dstr) {
	
	// function of the same name in ACCELA_FUNCTIONS creates multi lines in the Batch debug log. Use this one instead
	if(showDebug) {
		aa.print(dstr + "<br>");
		aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"),dstr);
	}
}