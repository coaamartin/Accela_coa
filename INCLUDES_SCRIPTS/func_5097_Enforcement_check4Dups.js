/*------------------------------------------------------------------------------------------------------/
| Program : ACA_BEFORE_LOCATION.js
| Event   : ACA_BEFORE_LOCATION
|
| Usage   : Master Script by Accela.  See accompanying documentation and release notes.
|
| Client  : N/A
| Action# : N/A
|
| Notes   :
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START User Configurable Parameters
|
|     Only variables in the following section may be changed.  If any other section is modified, this
|     will no longer be considered a "Master" script and will not be supported in future releases.  If
|     changes are made, please add notes above.
/------------------------------------------------------------------------------------------------------*/
var showMessage = false; // Set to true to see results in popup window
var showDebug = false; // Set to true to see debug messages in popup window
var useAppSpecificGroupName = false; // Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = false; // Use Group name when populating Task Specific Info Values
var cancel = false;
var useCustomScriptFile = true; // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();
var startTime = startDate.getTime();
var message = ""; // Message String
var debug = ""; // Debug String
var br = "<BR>"; // Break Tag

var useSA = false;
var SA = null;
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_FOR_EMSE");
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") {
    useSA = true;
    SA = bzr.getOutput().getDescription();
    bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_INCLUDE_SCRIPT");
    if (bzr.getSuccess()) {
        SAScript = bzr.getOutput().getDescription();
    }
}

if (SA) {
    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA, useCustomScriptFile));
    eval(getScriptText(SAScript, SA));
} else {
    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useCustomScriptFile));
}

//eval(getScriptText("INCLUDES_CUSTOM", null, useCustomScriptFile));

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

var cap = aa.env.getValue("CapModel");
var capId = cap.getCapID();
var parentId = cap.getParentCapID();
var appTypeResult = cap.getCapType();
var appTypeString = appTypeResult.toString();           // Convert application type to string ("Building/A/B/C")
var appTypeArray = appTypeString.split("/");            // Array of application type string
// page flow custom code begin
logDebug("right before try");
try{
    //Script 26
    //if(ifTracer(appTypeString.startsWith("Enforcement/Incident/Vacant/"), '"Enforcement/Incident/Vacant/"')){
 logDebug("inside try");       
        var capIdsArray = capIdsGetByAddr4ACA(); //Get all records for same address
        var forestryRecsOpen = false;
        //For each record with same address
        for(eachCapId in capIdsArray){
			logDebug("inside for loop");
            sameAddrCapId = capIdsArray[eachCapId];
            sameAddrAltId = capIdsArray[eachCapId].getCustomID();

            var sameAddrCap = aa.cap.getCap(sameAddrCapId).getOutput();
            var sameAddrCapStatus = sameAddrCap.getCapStatus();
            var sameAddrAppTypeString = sameAddrCap.getCapType().toString();
            var sameAddrAppTypeArray = sameAddrAppTypeString.split("/");

            logDebug("sameAddrAltId:" + sameAddrAltId + ", status: " + sameAddrCapStatus);
            //if type is Forestry/ and a status match cancel
            if(ifTracer(sameAddrAppTypeString.startsWith("Enforcement/Incident/Vacant/") &&
                        matches(sameAddrCapStatus, "Application","Monitoring","Recorded","Recorded and Assessed","Recorded and Expired","Registered","Registered and Expired","Registered and Recorded"),
                        'Code Vacancy with correct status')){
                message += "It appears someone has already submitted a request for this Address.  Please call the Enforcement Department at 303-739-XXXX if you wish to submit an additional request.<BR>";
                break;
            }
        }
    //}//END Script 26
    showMessage = cancel = message.length ? true : false;
}
catch(err){
    //cancel = true;
    //showDebug = 3;
    logDebug("Error on custom pageflow ACA_BEFORE_LOCATION. Err: " + err);
}

// page flow custom code end
if (debug.indexOf("**ERROR") > 0) {
    aa.env.setValue("ErrorCode", "1");
    aa.env.setValue("ErrorMessage", debug);
} else {
    if (cancel) {
        aa.env.setValue("ErrorCode", "-2");
        if (showMessage)
            aa.env.setValue("ErrorMessage", message);
        if (showDebug)
            aa.env.setValue("ErrorMessage", debug);
    } else {
        aa.env.setValue("ErrorCode", "0");
        if (showMessage)
            aa.env.setValue("ErrorMessage", message);
        if (showDebug)
            aa.env.setValue("ErrorMessage", debug);
    }
}

function capIdsGetByAddr4ACA() {
    //Gets CAPs with the same address as the current CAP, as capId (CapIDModel) object array (array includes current capId)
    //07SSP-00034/SP5015
    //

    //Get address(es) on current CAP
    var addr = cap.getAddressModel();

    if (addr) {
        
        var streetName = addr.streetName;
        var hseNum = addr.houseNumberStart;
        var streetSuffix = addr.streetSuffix;
        var zip = addr.zip;
        var streetDir = addr.streetDirection;

        if (streetDir == "")
            streetDir = null;
        if (streetSuffix == "")
            streetSuffix = null;
        if (zip == "")
            zip = null;

        if (hseNum && !isNaN(hseNum)) {
            hseNum = parseInt(hseNum);
        } else {
            hseNum = null;
        }

        // get caps with same address
        var capAddResult = aa.cap.getCapListByDetailAddress(streetName, hseNum, streetSuffix, zip, streetDir, null);
        if (capAddResult.getSuccess())
            var capArray = capAddResult.getOutput();
        else {
            logDebug("**ERROR: getting similar addresses: " + capAddResult.getErrorMessage());
            return false;
        }

        var capIdArray = new Array();
        //convert CapIDScriptModel objects to CapIDModel objects
        for (i in capArray)
            capIdArray.push(capArray[i].getCapID());
        
        if (capIdArray)
            return (capIdArray);
        else
            return false;
    }
}

/*
 * Helper
 * 
 * Desc:            
 * Used to display results of boolean condition
 * often wrapped in if statement as follows:
 *  if(ifTracer(''foo == 'bar', 'foo equals bar')) {}
 * 
*/

function ifTracer (cond, msg) {
    cond = cond ? true : false;
    logDebug((cond).toString().toUpperCase() + ': ' + msg);
    return cond;
}
