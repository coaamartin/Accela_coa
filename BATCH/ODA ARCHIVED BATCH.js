/*------------------------------------------------------------------------------------------------------/
| Program       : ODA Archived batch.js
| Event         : BATCH Script
|
| Description   : runs nightly, Criteria: Get records with application status of "Inactive" that do not have any child records or if child records do exist those records do not have any modifications in 
|                 the past 180 days.  Action:  Update application status to "Archived" and insert todays date into application status date
|
|
| Notes         : 
| Created by    : 
| Created at    : 05/06/2018
/------------------------------------------------------------------------------------------------------*/
var SCRIPT_VERSION = "3.0";
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, true));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, true));
eval(getScriptText("INCLUDES_CUSTOM", null, true));
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

/*------------------------------------ USER PARAMETERS ---------------------------------------*/
//Empty
/*------------------------------------ END OF USER PARAMETERS --------------------------------*/

var showDebug = true; // Set to true to see debug messages
var maxSeconds = 5 * 60; // number of seconds allowed for batch processing,
// usually < 5*60
var startDate = new Date();
var timeExpired = false;
var emailText = "";
var startTime = startDate.getTime(); // Start timer
var sysDate = aa.date.getCurrentDate();
var batchJobID = aa.batchJob.getJobID().getOutput();
var systemUserObj = aa.person.getUser("ADMIN").getOutput();
var servProvCode = aa.getServiceProviderCode();
var capId;


logMessage("START", "Start of Job");
if (!timeExpired) mainProcess();
logMessage("END", "End of Job: Elapsed Time : " + elapsed() + " Seconds");

function mainProcess() {
    var capIDListOutput,
        capIDList = new Array(),
        capTypeModel,
        capModel,
        feesArr,
        sysMonitorFeeCapSet;

    // Capturing the CapType Model
    capTypeModel = aa.cap.getCapTypeModel().getOutput();
    capTypeModel.setGroup("ODA");
    capTypeModel.setType("Pre App");
    capTypeModel.setSubType("NA");
    capTypeModel.setCategory("NA");
    // Getting Cap Model
    capModel = aa.cap.getCapModel().getOutput();
    capModel.setCapType(capTypeModel);
    capModel.setCapStatus("Inactive");

    capIDList = aa.cap.getCapIDListByCapModel(capModel).getOutput();

    for (i in capIDList) {
        // only continue if time hasn't passed max allowed
        if (elapsed() > maxSeconds) {
            logMessage("WARNING", "A script timeout has caused partial completion of this process. Please re-run.  " + elapsed() + " seconds elapsed, " + maxSeconds + " allowed.");
            timeExpired = true;
            break;
        }

        capId = capIDList[i].getCapID();
        var capIdArr = capId.toString().split('-');
        capId = aa.cap.getCapID(capIdArr[0], capIdArr[1], capIdArr[2]).getOutput();

        // check to see if there are any child records. if not then close
        var childArray = getChildren("*/*/*/*", capId);
        if (!childArray || childArray.length == 0)
        {
            logDebug("Closing record $record$ due to inactivity".replace("$record$", capId.getCustomID()));
            updateAppStatus("Archived", "Update via Batch ODA Archived batch", capId);
        }
        else if (childArray && childArray.length > 0)
        {
            for (var c in childArray)
            {
                var thisCapId = childArray[c];
                var thisCap = aa.cpa.getCap(thisCapId).getOutput();
                var thisCapModel = thisCap.getCapModel();
                var statusDate = new Date(thisCapModel.getCapStatusDate().getTime());
                var today = new Date();

                var lastStatusUpdate = dateDiff(statusDate, today);
                if (lastStatusUpdate >= 180)
                {
                    logDebug("Closing record $record$ due to inactivity".replace("$record$", capId.getCustomID()));
                    updateAppStatus("Archived", "Update via Batch ODA Archived batch", capId);
                }
            }
        }

    }
}

function elapsed() {
    var thisDate = new Date();
    var thisTime = thisDate.getTime();
    return ((thisTime - startTime) / 1000)
}