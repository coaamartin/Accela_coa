/* Title :  Update Code Reference Field (Batch Job)

Purpose :   If criteria: If the user executes the batch job Action: Then update the custom field "Code Reference" using 2 batch
parameters with a find and replace functionality. The values will be provided by the user. Configure batch parameters
"Where Code Equals" and "Update Code To". This will allow the users to update specific code references where applicable
on records. In addition the batch job needs to update the record status from "Approved" to "Unapproved".

Record Type :Building/Permit/Master/NA

Author :   Israa Ismail

Functional Area : Records
 
Sample Call : updateCodeReferenceForBuildingPermitMasterRecords()

*/
var sysDate = aa.date.getCurrentDate();
// Global variables
var batchStartDate = new Date();
// System Date
var batchStartTime = batchStartDate.getTime();
var startTime = batchStartTime;
var batchJobName = "" + aa.env.getValue("BatchJobName"); // Name of the batch job
var codeEquals = aa.env.getValue("Where Code Equals");
var updateCodeTo = aa.env.getValue("Update Code To");

var SCRIPT_VERSION = 3.0;
var useCustomScriptFile = true;  // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useCustomScriptFile));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, useCustomScriptFile));
eval(getScriptText("INCLUDES_CUSTOM", null, useCustomScriptFile));

function getScriptText(vScriptName, servProvCode, useProductScripts) {
    if (!servProvCode) servProvCode = aa.getServiceProviderCode();
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
printDebug("Batch started on " + batchStartDate);
updateCodeReferenceForBuildingPermitMasterRecords();
printDebug("Run Time     : " + elapsed());
printDebug("Batch ended on " + new Date());


function updateCodeReferenceForBuildingPermitMasterRecords(){
    if (codeEquals!=null && codeEquals!="" && updateCodeTo!=null && updateCodeTo!=""){
        printDebug("Where Code Equals: " + codeEquals);
        printDebug("Update Code To   : " + updateCodeTo);
        //var capListResult = aa.cap.getByAppType("Building","Permit","Master","NA");
        var capListResult = aa.cap.getCapIDsByAppSpecificInfoField("Code Reference", codeEquals);
        capList = capListResult.getOutput();
        for(xx in capList)
        {
            var capId = capList[xx].getCapID();
            capId = aa.cap.getCapID(capId.getID1(), capId.getID2(), capId.getID3()).getOutput();
            var altId = capId.getCustomID();
            var cap = aa.cap.getCap(capId).getOutput();
            var appTypeString = cap.getCapType().toString();
            var capStatus = cap.getCapStatus();
            if(appTypeString != "Building/Permit/Master/NA") continue;
            printDebug("Processing Record: " + altId);
            useAppSpecificGroupName=false;
            printDebug("-->Updating Code Referece Custom field")
            editAppSpecific("Code Reference",updateCodeTo,capId);
            if( capStatus != "Approved" ) {printDebug("-->Record status not approved, moving on to next record."); continue;}
            printDebug("-->Updating record status to Unapproved");
            updateAppStatus("Unapproved","Updated via Batch Job : " + batchJobName,capId);
            
            //Remove master plan from shared dropdown list
            var AInfo = [];
            loadAppSpecific(AInfo, capId); // Add AppSpecific Info
            var masterTypePlan = AInfo["Master Plan Type"];
            var sDList2Update = "";
            
            if(masterTypePlan == "Single Family") sDList2Update = "BLD SINGLE FAMILY MASTER";
            if(masterTypePlan == "Multi Family") sDList2Update = "BLD MULTI FAMILY MASTER";
            if(masterTypePlan == "Other") sDList2Update = "BLD OTHER MASTER";
            
            //printDebug("-->Shared Drop-Down to update: " + sDList2Update);
            if(sDList2Update != ""){
                var appName = cap.getSpecialText();
                if (appName == null || appName == "") {
                    printDebug("-->Application name is null or empty, capId=" + capId + ". AltId = " + altId);
                    continue;
                }
                printDebug("-->Deactivating " + appName + " from " + sDList2Update + " if present.")
                deactivateSD(sDList2Update, appName);
            }
            else
                printDebug("-->No Shared Drop-Down list to update.")
        }
    }
}

function elapsed() {
    var thisDate = new Date();
    var thisTime = thisDate.getTime();
    return ((thisTime - batchStartTime) / 1000)
}

function printDebug(dstr){
    aa.print(dstr + br);
}
