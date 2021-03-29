/*Title : Passed MJ Inspection Automation
Purpose : Automatically schedule inspections and send out relevant notificatons on quarterly cycle for MJ Licenses
Author: Erich von Trapp - ETech Consulting, LLC
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


//var RECORD_TYPE = "Licenses/Marijuana/*/License"; //aa.env.getValue("RECORD_TYPE");
//var EMAIL_TEMPLATE = "LIC MJ COMPLIANCE #232"; //aa.env.getValue("EMAIL_TEMPLATE");
//var REPORT_TEMPLATE = "MJ_Compliance_Corrections_Letter"; //aa.env.getValue("REPORT_TEMPLATE");



useAppSpecificGroupName = false;
showDebug = true;
var capStatus;
var today = new Date;

//grab all Licenses/Marijuana/*/License records
var capTypeModel = aa.cap.getCapTypeModel().getOutput();
var tmpAry = RECORD_TYPE.split("/");
capTypeModel.setGroup(tmpAry[0]);
capTypeModel.setType(tmpAry[1]);
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

logDebug2("<br><Font Color=RED> Processing " + capIDList.length + " records <br>");

for (c in capIDList) {
    capId = capIDList[c].getCapID();
    capIDString = aa.cap.getCapID(capId.getID1(), capId.getID2(), capId.getID3()).getOutput().getCustomID();
    //if(!"20-000176-MXL".equals(capIDString)) continue; //For Testing

    logDebug2("<Font Color=BLUE> Processing record " + capIDString);

    var tmpCap = aa.cap.getCap(capId);
    if (!tmpCap.getSuccess()) {
        logDebug2("**INFO failed to get CapModel " + capId);
        continue;
    }
    tmpCap = tmpCap.getOutput();
    var recordCapScriptModel = tmpCap;
    tmpCap = tmpCap.getCapModel();
    tmpAsiGroups = tmpCap.getAppSpecificInfoGroups();

    var initialInspDate = getAppSpecific("Initial Inspection Date");

    //get record status
    capStatus = tmpCap.getCapStatus();
    logDebug2("<Font Color=BLACK>Record status: " + capStatus);

    //skip record if status is not 'Active'
    if (capStatus == "Active") {

        //check if license is Marijuana/Retail Store
        if (appMatch("Licenses/Marijuana/Retail Store/License", capId)) {

            //check if more than 281 days have passed since the initial inspection (365 days - 84 days, the period between record creation and initial inspection)
            if (!(initialInspDate == null || initialInspDate == "")) {
                initialInspDate = new Date(initialInspDate);
                if (dateDiff(initialInspDate, today) >= 281) {
                    logDebug2("Switching to 6-month inspection cycle for MJ Store Licenses");

                    //schedule new inspection 6 months out from passed inspection date
                    daysToAdd = 182;
                } else {

                    //schedule new inspection 3 months out from passed inspection date
                    daysToAdd = 91;
                }
            }
        } else {

            //schedule new inspection 3 months out from passed inspection date
            daysToAdd = 91;
        }

        var cycleInspections = getCycleInspections(capId);
        if (cycleInspections) {
            scheduleNextInspections(cycleInspections);
            sendNotificationsPassedInsp(cycleInspections, recordCapScriptModel);
            updateNextInspectionDate(cycleInspections, daysToAdd);
        }
    } else {
        logDebug2("<Font Color=RED> Skipping record; <Font Color=BLACK>status must be 'Active'");
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
        logDebug2("<Font Color=RED> Skipping record; <Font Color=BLACK>Next Inpsection Date field is empty");
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

    //filter to inspections within this quarterly cycle
    for (i in capInspections) {
        var inspSchedDate = capInspections[i].getScheduledDate();
        inspSchedDate = convertDate(inspSchedDate);
        if (inspSchedDate <= nextInspDate && inspSchedDate >= beginCycleDate) {

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
            //var inspector = getInspectorByInspID(cycleInspections[i].getIdNumber());
            var inspType = cycleInspections[i].getInspectionType();
            var nextInspDate = getAppSpecific("Next Inspection Date");

            //for building inspections, update inspection status and wait for other building inspections to be completed
            if (cycleInspections[i].getInspectionType().indexOf("MJ Building Inspections") != -1) {
                scheduleInspectDate(inspType, nextInspDate, inspector); 
                cycleInspections[i].setInspectionStatus("Passed - Notification Pending");
                aa.inspection.editInspection(cycleInspections[i]);
                inspCounter++;
            } else {
                scheduleInspectDate(inspType, nextInspDate, inspector);
                inspCounter++;
            }
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
    var adResult = aa.address.getAddressByCapId(capId).getOutput();

    for(x in adResult)
    {
        var stNum = adResult[x].getHouseNumberStart();
        var preDir =adResult[x].getStreetDirection();
        var stName = adResult[x].getStreetName();
        var stType = adResult[x].getStreetSuffix();
        var city = adResult[x].getCity();
        var state = adResult[x].getState();
        var zip = adResult[x].getZip();
    }
    var primaryAddress = stNum + " " + preDir + " " + stName + " " + stType + " " + "," + city + " " + state + " " + zip;
    var tradeName = getAppName(capId);

    var asiValues = new Array();
    loadAppSpecific(asiValues);

    for (i in cycleInspections) {
        if (cycleInspections[i].getInspectionStatus() == "Passed" || cycleInspections[i].getInspectionStatus() == "Passed - Minor Violations") {

        	/*
            var eParams = aa.util.newHashtable();
            addParameter(eParams, "$$altID$$", recordCapScriptModel.getCapModel().getAltID()+"");
            addParameter(eParams, "$$recordAlias$$", recordCapScriptModel.getCapModel().getCapType().getAlias()+"");
            addParameter(eParams, "$$recordStatus$$", recordCapScriptModel.getCapModel().getCapStatus()+"");
            addParameter(eParams, "$$inspId$$", cycleInspections[i].getIdNumber()+"");
            addParameter(eParams, "$$inspResult$$", cycleInspections[i].getInspectionStatus()+"");
            addParameter(eParams, "$$inspResultDate$$", formatDateX(cycleInspections[i].getInspectionDate())+"");
            addParameter(eParams, "$$inspType$$", cycleInspections[i].getInspectionType()+"");
            addParameter(eParams, "$$inspSchedDate$$", cycleInspections[i].getScheduledDate()+"");
            addParameter(eParams, "$$inspResultComment$$", cycleInspections[i].getInspectionComments()+"");

            if (primaryAddress)
                addParameter(eParams, "$$FullAddress$$", primaryAddress);
            if (tradeName)
                addParameter(eParams, "$$TradeName$$", tradeName);
            if (asiValues["State License Number"])
                addParameter(eParams, "$$StateLicenseNumber$$", asiValues["State License Number"]);

            var reportParams = aa.util.newHashtable();
            addParameter(reportParams, "InspActNumber", cycleInspections[i].getIdNumber()+"");

            logDebug2("Sending notification for Inspection Type " + cycleInspections[i].getInspectionType());

            var emails = _getContactEmailNoDupEmail(capId,"Inspection Contact");
            emails = emails.join(";");
            logDebug("Email send to: " + emails);
            var reportFiles = new Array();
            var report = _generateReportFile(REPORT_TEMPLATE, reportParams, aa.getServiceProviderCode());
            if(report) reportFiles.push(report);
			//Email sent from IRSA
            _sendNotification("noreply@auroragov.org", emails, "", EMAIL_TEMPLATE, eParams, reportFiles);
            */

            //send email with report attachment
            //emailContactsWithReportLinkASync("Inspection Contact", EMAIL_TEMPLATE, eParams, REPORT_TEMPLATE, reportParams, "N", "");
            //update inspection status to reflect that notification was sent
            cycleInspections[i].setInspectionStatus("Passed - Notification Sent");
            aa.inspection.editInspection(cycleInspections[i]);

        }
    }
    //Check Building Inspections
    for (i in cycleInspections) {
        if (cycleInspections[i].getInspectionType().indexOf("MJ Building Inspections") != -1 && cycleInspections[i].getInspectionStatus() == "Passed - Notification Pending") {
            bldgInspCount++;
            bldgInspId = cycleInspections[i].getIdNumber()+"";
            bldgInspResult = cycleInspections[i].getInspectionStatus()+"";
            bldgInspResultDate = formatDateX(cycleInspections[i].getInspectionDate())+"";
            bldgInspSchedDate = cycleInspections[i].getScheduledDate()+"";
        }
    }

    //only send one notification for building inspections when all five building inspection types have been passed
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

        if (primaryAddress)
            addParameter(eParams, "$$FullAddress$$", primaryAddress);
        if (tradeName)
            addParameter(eParams, "$$TradeName$$", tradeName);
        if (asiValues["State License Number"])
            addParameter(eParams, "$$StateLicenseNumber$$", asiValues["State License Number"]);

        var reportParams = aa.util.newHashtable();
        addParameter(reportParams, "InspActNumber", bldgInspId);

        logDebug2("Sending notification for Inspection Type " + bldgInspType);

        var emails = _getContactEmailNoDupEmail(capId,"Inspection Contact");
        emails = emails.join(";");
        logDebug("Email send to: " + emails);
        var reportFiles = new Array();
        var report = _generateReportFile(REPORT_TEMPLATE, reportParams, aa.getServiceProviderCode());
        if(report) reportFiles.push(report);

        _sendNotification("noreply@auroragov.org", emails, "", EMAIL_TEMPLATE, eParams, reportFiles);

        //send email with report attachment
        //emailContactsWithReportLinkASync("Inspection Contact", EMAIL_TEMPLATE, eParams, REPORT_TEMPLATE, reportParams, "N", "");

        //update inspection status to reflect that notification was sent
        for (i in cycleInspections) {
            if (cycleInspections[i].getInspectionStatus() == "Passed" || cycleInspections[i].getInspectionStatus() == "Passed - Minor Violations" || cycleInspections[i].getInspectionStatus() == "Passed - Notification Pending") {
                if (cycleInspections[i].getInspectionType().indexOf("MJ Building Inspections") != -1) {
                    cycleInspections[i].setInspectionStatus("Passed - Notification Sent");
                    aa.inspection.editInspection(cycleInspections[i]);
                }
            }
        }
    }
}


//checks to see if all eight inspections have passed during the quarterly cycle and updates next inspection date accordingly
function updateNextInspectionDate(cycleInspections, daysToAdd) {
    var readyCount = 0;
    var nextInspDate = getAppSpecific("Next Inspection Date");
    for (i in cycleInspections) {
        if (cycleInspections[i].getInspectionStatus() == "Passed - Notification Sent") {
            readyCount++;
        } else if (dateDiff(cycleInspections[i].getScheduledDate(), nextInspDate) <= 6) {
            //nextInspDate = new Date(nextInspDate);
            cycleInspections[i].setScheduledDate(aa.date.parseDate(nextInspDate));
            aa.inspection.editInspection(cycleInspections[i]);
            logDebug2("Failed inspection is within 6 days of cycle end. Moving inspection to next cycle");
            readyCount++;
        }
    }
    if (readyCount == 8) {
        logDebug2("Updating Next Inspection Date to: " + dateAdd(nextInspDate, daysToAdd));
        editAppSpecific("Next Inspection Date", dateAdd(nextInspDate, daysToAdd));
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

//prints debug from batch process
function logDebug2(dstr) {
    if(showDebug) {
        aa.print(dstr + "<br>");
        aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"),dstr);
    }
}

function _generateReportFile(aaReportName,parameters,rModule)
{
    var reportName = aaReportName;

    report = aa.reportManager.getReportInfoModelByName(reportName);
    report = report.getOutput();


    report.setModule(rModule);
    report.setCapId(capId);
    report.setReportParameters(parameters);
    //Added
    vAltId = capId.getCustomID();
    report.getEDMSEntityIdModel().setAltId(vAltId);
    var permit = aa.reportManager.hasPermission(reportName,"ADMIN");
    logDebug("Report successfully ran: "+permit.getOutput().booleanValue());
    if(permit.getOutput().booleanValue())
    {
        var reportResult = aa.reportManager.getReportResult(report);

        if(reportResult)
        {
            reportResult = reportResult.getOutput();
            try{
                var reportFile = aa.reportManager.storeReportToDisk(reportResult);

                //logDebug("Report Result: "+ reportResult);
                reportFile = reportFile.getOutput();
                logDebug("Report Result: "+ reportFile);
                return reportFile
            }
            catch(e){
                logDebug("Nope!");
                return false
            }

        } else
        {
            logDebug("Unable to run report: "+ reportName + " for Admin" + systemUserObj);
            return false;
        }
    } else
    {
        logDebug("No permission to report: "+ reportName + " for Admin" + systemUserObj);
        return false;
    }
}

function _getContactEmailNoDupEmail(vcapId, vconType){
    var thisItem = arguments[0];
    var searchConType = arguments[1];
    var conEmailArray = [];
    var vConObjArry;
    if(searchConType.toUpperCase()=="ALL"){
        vConObjArry = getContactObjsByCap(thisItem);
    }else{
        vConObjArry = getContactObjsByCap(thisItem,searchConType);
    }
    //return valid email addressses and only one address for multiple contacts with same email
    for(eachCont in vConObjArry){
        var vConObj = vConObjArry[eachCont];
        //Get contact email
        if (vConObj) {
            var conEmail = vConObj.people.getEmail();
            var conType = vConObj.people.getContactType();
            if (conEmail && conEmail != null && conEmail != "" && conEmail.indexOf("@") > 0) {
                if(!exists(conEmail,conEmailArray) ){
                    conEmailArray.push(conEmail);
                    logDebug("Returning email for :" + conType )
                    logDebug('Email: ' + conEmail)

                }

            }
        }
    }
    return conEmailArray;

}
function _sendNotification(emailFrom,emailTo,emailCC,templateName,params,reportFile)
{
    var capIDScriptModel = aa.cap.createCapIDScriptModel(capId.getID1(), capId.getID2(), capId.getID3());
    var result = null;
    result = aa.document.sendEmailAndSaveAsDocument(emailFrom, emailTo, emailCC, templateName, params, capIDScriptModel, reportFile);
    if(result.getSuccess())
    {
        logDebug("Sent email successfully!");
        return true;
    }
    else
    {
        logDebug("Failed to send mail. - " + result.getErrorType());
        var itemCap = capId;

        var id1 = itemCap.ID1;
        var id2 = itemCap.ID2;
        var id3 = itemCap.ID3;
        var capIDScriptModel = aa.cap.createCapIDScriptModel(id1, id2, id3);
        result = aa.document.sendEmailAndSaveAsDocument(emailFrom, emailTo, emailCC, templateName, params, capIDScriptModel, reportFile);
        if(result.getSuccess())
        {
            logDebug("2nd Attempt... Sent email successfully!");
            return true;
        }
        else
        {
            logDebug("2nd Attempt Failed to send mail. - " + result.getErrorType());
            return false;
        }
    }
}