/*Title : Passed MJ Inspection Automation
Purpose : Automatically schedule inspections and send out relevant notificatons on quarterly cycle for MJ Licenses
Author: Erich von Trapp

Functional Area : Batch Job
*/

function getMasterScriptText(vScriptName)
{
    var servProvCode = aa.getServiceProviderCode();
    if (arguments.length > 1) servProvCode = arguments[1]; // use different serv prov code
    vScriptName = vScriptName.toUpperCase();    
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(),vScriptName);
        return emseScript.getScriptText() + ""; 
        } 
	catch(err)
		{
		return "";
		}
}

function getScriptText(vScriptName)
{
    var servProvCode = aa.getServiceProviderCode();
    if (arguments.length > 1) servProvCode = arguments[1]; // use different serv prov code
    vScriptName = vScriptName.toUpperCase();    
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        var emseScript = emseBiz.getScriptByPK(servProvCode,vScriptName,"ADMIN");
        return emseScript.getScriptText() + ""; 
        } 
	catch(err)
		{
        return "";
		}
}

var SCRIPT_VERSION = 3.0;
eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getMasterScriptText("INCLUDES_ACCELA_GLOBALS"));
eval(getMasterScriptText("INCLUDES_CUSTOM"));

//define batch job parameters
var RECORD_TYPE = aa.env.getValue("RECORD_TYPE");
var EMAIL_TEMPLATE = aa.env.getValue("EMAIL_TEMPLATE");
var REPORT_TEMPLATE = aa.env.getValue("REPORT_TEMPLATE");

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
var vIsMJRetailStoreLicense;
var inspectionTypesAry = [ "MJ AMED Inspections", "MJ Building Inspections - Electrical", "MJ Building Inspections - Life Safety",
	"MJ Building Inspections - Mechanical", "MJ Building Inspections - Plumbing", "MJ Building Inspections - Structural", "MJ Security Inspections - 3rd Party",
	"MJ Zoning Inspections", "MJ Building Inspections", "MJ Code Enforcement Inspections", "MJ Planning Inspections", "MJ Security Inspections - Police" ];

vIsMJRetailStoreLicense = false;
vIsMJRetailStoreLicense = appMatch("Licenses/Marijuana/*/License");

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
	var recordCapScriptModel = tmpCap;
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
		sendNotificationsPassedInsp(cycleInspections, recordCapScriptModel);
		
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
	
	//establish date boundaries for this cycle
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
			
			//if multiple inspections of the same type, only add the most recent
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


//send notifications for passed inspections
function sendNotificationsPassedInsp(cycleInspections, recordCapScriptModel) {
var bldgInspCount = 0;
var bldgInspId;
var bldgInspResult;
var bldgInspResultDate;
var bldgInspType = "MJ Building Inspections";
var bldgInspSchedDate;

	for (i in cycleInspections) {
		if (cycleInspections[i].getInspectionStatus() == "Passed" || cycleInspections[i].getInspectionStatus() == "Passed - Minor Violations") {
		
			var eParams = aa.util.newHashtable();
			addParameter(eParams, "$$altID$$", recordCapScriptModel.getCapModel().getAltID());
			addParameter(eParams, "$$recordAlias$$", recordCapScriptModel.getCapModel().getCapType().getAlias());
			addParameter(eParams, "$$recordStatus$$", recordCapScriptModel.getCapModel().getCapStatus());
			addParameter(eParams, "$$inspId$$", cycleInspections[i].getIdNumber());
			addParameter(eParams, "$$inspResult$$", cycleInspections[i].getInspectionStatus());
			addParameter(eParams, "$$inspResultDate$$", cycleInspections[i].getInspectionDate());
			addParameter(eParams, "$$inspType$$", cycleInspections[i].getInspectionType());
			addParameter(eParams, "$$inspSchedDate$$", cycleInspections[i].getScheduledDate());
			
			var reportParams = aa.util.newHashtable();
			addParameter(reportParams, "InspActNumber", cycleInspections[i].getIdNumber());

			//only send one notification for building inspections when all five building types have been passed
			if (cycleInspections[i].getInspectionType().indexOf("MJ Building Inspections") != -1) {
				bldgInspCount++;
				bldgInspId = cycleInspections[i].getIdNumber();
				bldgInspResult = cycleInspections[i].getInspectionStatus();
				bldgInspResultDate = cycleInspections[i].getInspectionDate();
				bldgInspSchedDate = cycleInspections[i].getScheduledDate();
			} else {
				logDebug2("Sending notification for Inspection Type " + cycleInspections[i].getInspectionType());
				
				//send email with report attachment
				emailContactsWithReportLinkASync("Inspection Contact", EMAIL_TEMPLATE, eParams, REPORT_TEMPLATE, reportParams, "N", "");				
				
				//update inspection status to reflect that notification was sent
				cycleInspections[i].setInspectionStatus("Passed - Notification Sent");
				aa.inspection.editInspection(cycleInspections[i]);
				//var tmpInspObj = cycleInspections[i].getInspection();
				//aa.inspection.resultInspection(recordCapScriptModel, cycleInspections[i].getIdNumber().toString(), "Passed - Notification Sent", cycleInspections[i].getInspectionDate(), cycleInspections[i].getInspectionComments(), "");
				//resultInspection(inspType, inspStatus, resultDate, resultComment)
			}
		}
	}
	
	if (bldgInspCount == 5) {
		var eParams = aa.util.newHashtable();
		addParameter(eParams, "$$altID$$", recordCapScriptModel.getCapModel().getAltID());
		addParameter(eParams, "$$recordAlias$$", recordCapScriptModel.getCapModel().getCapType().getAlias());
		addParameter(eParams, "$$recordStatus$$", recordCapScriptModel.getCapModel().getCapStatus());
		addParameter(eParams, "$$inspId$$", bldgInspId);
		addParameter(eParams, "$$inspResult$$", bldgInspResult);
		addParameter(eParams, "$$inspResultDate$$", bldgInspResultDate);
		addParameter(eParams, "$$inspType$$", bldgInspType);
		addParameter(eParams, "$$inspSchedDate$$", bldgInspSchedDate);
		
		var reportParams = aa.util.newHashtable();
		addParameter(reportParams, "InspActNumber", bldgInspId);
		
		logDebug2("Sending notification for Inspection Type " + bldgInspType);
		
		//send email with report attachment
		emailContactsWithReportLinkASync("Inspection Contact", EMAIL_TEMPLATE, eParams, REPORT_TEMPLATE, reportParams, "N", "");
		
		//update inspection status to reflect that notification was sent
		for (i in cycleInspections) {
			if (cycleInspections[i].getInspectionStatus() == "Passed" || cycleInspections[i].getInspectionStatus() == "Passed - Minor Violations") {
				if (cycleInspections[i].getInspectionType().indexOf("MJ Building Inspections") != -1) {
					cycleInspections[i].setInspectionStatus("Passed - Notification Sent");
					aa.inspection.editInspection(cycleInspections[i]);
				}
			}
		}
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

//prints debug from batch process
function logDebug2(dstr) {
	
	// function of the same name in ACCELA_FUNCTIONS creates multi lines in the Batch debug log. Use this one instead
	if(showDebug) {
		aa.print(dstr + "<br>");
		aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"),dstr);
	}
}