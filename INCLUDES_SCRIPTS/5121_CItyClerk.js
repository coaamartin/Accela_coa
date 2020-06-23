//Written by rprovinc   
//
//include("5121_CityClerkWTUA.js");

//*****************************************************************************
//Script WTUA;CityClerk!Incident!~!~.js
//Record Types:	CityClerk\Incident\*\* 
//Event: 		WTUA
//Desc:			Going to update the fee when ever a CityClerk record is open and Non-Profit is set to No.
//
//Created By: Rprovinc
//******************************************************************************
/*------------------------------------------------------------------------------------------------------/
| TESTING PARAMETERS (Uncomment to use in the script tester)
/------------------------------------------------------------------------------------------------------*/
//aa.env.setValue("paramStdChoice","");
//aa.env.setValue("eventType","Batch Process");

/*------------------------------------------------------------------------------------------------------/
| USER CONFIGURABLE PARAMETERS
/------------------------------------------------------------------------------------------------------*/
currentUserID = "ADMIN";
useAppSpecificGroupName = false;
/*------------------------------------------------------------------------------------------------------/
| GLOBAL VARIABLES
/------------------------------------------------------------------------------------------------------*/
message = "";
br = "<br>";
debug = "";
systemUserObj = aa.person.getUser(currentUserID).getOutput();
publicUser = false;
/*------------------------------------------------------------------------------------------------------/
| INCLUDE SCRIPTS (Core functions, batch includes, custom functions)
/------------------------------------------------------------------------------------------------------*/
SCRIPT_VERSION = 3.0;
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
    eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS", SA));
    eval(getMasterScriptText(SAScript, SA));
} else {
    eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS"));
}

eval(getScriptText("INCLUDES_BATCH"));
eval(getMasterScriptText("INCLUDES_CUSTOM"));

function getMasterScriptText(vScriptName) {
    var servProvCode = aa.getServiceProviderCode();
    if (arguments.length > 1)
        servProvCode = arguments[1]; // use different serv prov code
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
        return emseScript.getScriptText() + "";
    } catch (err) {
        return "";
    }
}

function getScriptText(vScriptName) {
    var servProvCode = aa.getServiceProviderCode();
    if (arguments.length > 1)
        servProvCode = arguments[1]; // use different serv prov code
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        var emseScript = emseBiz.getScriptByPK(servProvCode, vScriptName, "ADMIN");
        return emseScript.getScriptText() + "";
    } catch (err) {
        return "";
    }
}
/*------------------------------------------------------------------------------------------------------/
| CORE EXPIRATION BATCH FUNCTIONALITY
/------------------------------------------------------------------------------------------------------*/
try {
    showMessage = false;
    showDebug = true;
    if (String(aa.env.getValue("showDebug")).length > 0) {
        showDebug = aa.env.getValue("showDebug").substring(0, 1).toUpperCase().equals("Y");
    }

    sysDate = aa.date.getCurrentDate();
    var startDate = new Date();
    var startTime = startDate.getTime(); // Start timer
    var systemUserObj = aa.person.getUser("ADMIN").getOutput();

    sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "");
    batchJobResult = aa.batchJob.getJobID();
    batchJobName = "" + aa.env.getValue("BatchJobName");
    batchJobID = 0;

    if (batchJobResult.getSuccess()) {
        batchJobID = batchJobResult.getOutput();
        logDebug("Batch Job " + batchJobName + " Job ID is " + batchJobID);
    } else {
        logDebug("Batch job ID not found " + batchJobResult.getErrorMessage());
    }

    var vEmailFrom = ""; //Testing Only
    var vEmailTo = ""; //Testing Only
    var vEmailCC = ""; //Testing Only
    vEmailFrom = "noreply@auroragov.org"; //Testing Only
    vEmailTo = "noreply@auroragov.org"; //Testing Only
    vEmailCC = ""; //Testing Only

    //if (aa.env.getValue("FromEmail") != null && aa.env.getValue("FromEmail") != "") {
    //	vEmailFrom = aa.env.getValue("FromEmail");
    //}
    if (aa.env.getValue("ToEmail") != null && aa.env.getValue("ToEmail") != "") {
        vEmailTo = aa.env.getValue("ToEmail");
    }
    if (aa.env.getValue("CCEmail") != null && aa.env.getValue("CCEmail") != "") {
        vEmailCC = aa.env.getValue("CCEmail");
    }

    /*------------------------------------------------------------------------------------------------------/
    | <===========Main=Loop================>
    /-----------------------------------------------------------------------------------------------------*/

    logDebug("Starting batch script: 5091_LICENSE_EXPIRATION_MISCSERVICES_NA.js");

    mainProcess();

    logDebug("End of Job: Elapsed Time : " + elapsed() + " Seconds");

    /*------------------------------------------------------------------------------------------------------/
    | <===========END=Main=Loop================>
    /-----------------------------------------------------------------------------------------------------*/
} catch (err) {
    handleError(err, "Batch Job:" + batchJobName + " Job ID:" + batchJobID);
}

/*------------------------------------------------------------------------------------------------------/
| <=========== Errors and Reporting
/------------------------------------------------------------------------------------------------------*/
if (debug.indexOf("**ERROR") > 0) {
    aa.env.setValue("ScriptReturnCode", "1");
    aa.env.setValue("ScriptReturnMessage", debug);
    aa.sendMail(vEmailFrom, vEmailTo, vEmailCC, batchJobName + " - Error", debug);
} else {
    aa.env.setValue("ScriptReturnCode", "0");
    if (showMessage) {
        aa.env.setValue("ScriptReturnMessage", message);
        aa.sendMail(vEmailFrom, vEmailTo, vEmailCC, batchJobName + " Results", message);
    }
    if (showDebug) {
        aa.env.setValue("ScriptReturnMessage", debug);
        aa.sendMail(vEmailFrom, vEmailTo, vEmailCC, batchJobName + " Results - Debug", debug);
    }
}
mainProcess(){
    //var envParameters = aa.util.newHashMap();
    //var nonProfit = AInfo["Non Profit"];
    var vASIValue = getAppSpecific("Non Profit");
    var nonProfit = vASIValue;
    var envParameters = aa.util.newHashMap(); envParameters.put("capId", capId); envParameters.put("cap", cap); envParameters.put("appType", appTypeString);

    var appGroup = getJobParam("appGroup"); //   app Group to process {Licenses}
    var appTypeType = getJobParam("appTypeType"); //   app type to process {Rental License}
    var appSubtype = getJobParam("appSubtype"); //   app subtype to process {NA}
    var appCategory = getJobParam("appCategory");
    if (!appMatchArray) {
        appGroup = appGroup == "" ? "*" : appGroup;
        appTypeType = appTypeType == "" ? "*" : appTypeType;
        appSubtype = appSubtype == "" ? "*" : appSubtype;
        appCategory = appCategory == "" ? "*" : appCategory;
        var appType = appGroup + "/" + appTypeType + "/" + appSubtype + "/" + appCategory;
        appMatchArray = [appType];
    }


    if ((nonProfit = "No") && (appMatchArray = "CityClerk/Incident/DonationBins/NA")) {
        var vASIValue = getAppSpecific("Non Profit");
        var nonProfit = vASIValue;
        var envParameters = aa.util.newHashMap();
        envParameters.put("capId", capId);
        envParameters.put("cap", cap);
        envParameters.put("appType", appMatchArray);
        logDebug("CapID: " + capId);
        logDebug("Cap: " + cap);
        logDebug("appType", appMatchArray);
        logDebug("Starting to invoice fee on record.");
        var feecode = "CC_DB";
        var feeschedule = "CC_DB";
        var thefee = "1";
        //feeseqnum =    addFee(feecode, feeschedule, 'FINAL', parseFloat(thefee), 'Y');
        updateFee(feecode, feeschedule, "FINAL", parseFloat(thefee), "Y", "N");
        logDebug("End of Script 5121_CityClerkWTUA.js");
    }

    //Temp Use code
    else if ((nonProfit = "No") && (appMatchArray = "CityClerk/Incident/TempUse/NA")) {
        var vASIValue = getAppSpecific("Non Profit");
        var nonProfit = vASIValue;
        var envParameters = aa.util.newHashMap();
        envParameters.put("capId", capId);
        envParameters.put("cap", cap);
        envParameters.put("appType", appMatchArray);
        logDebug("CapID: " + capId);
        logDebug("Cap: " + cap);
        logDebug("appType", appMatchArray);
        logDebug("Starting to invoice fee on record.");
        var feecode = "CC_DB";
        var feeschedule = "CC_DB";
        var thefee = "1";
        //feeseqnum =    addFee(feecode, feeschedule, 'FINAL', parseFloat(thefee), 'Y');
        updateFee(feecode, feeschedule, "FINAL", parseFloat(thefee), "Y", "N");
        logDebug("End of Script 5121_CityClerkWTUA.js");
    }

    //Temp Sign code
    else if ((nonProfit = "No") && (appMatchArray = "CityClerk/Incident/TempSign/NA")) {
        var vASIValue = getAppSpecific("Non Profit");
        var nonProfit = vASIValue;
        var envParameters = aa.util.newHashMap();
        envParameters.put("capId", capId);
        envParameters.put("cap", cap);
        envParameters.put("appType", appMatchArray);
        logDebug("CapID: " + capId);
        logDebug("Cap: " + cap);
        logDebug("appType", appMatchArray);
        logDebug("Starting to invoice fee on record.");
        var feecode = "CC_DB";
        var feeschedule = "CC_DB";
        var thefee = "1";
        //feeseqnum =    addFee(feecode, feeschedule, 'FINAL', parseFloat(thefee), 'Y');
        updateFee(feecode, feeschedule, "FINAL", parseFloat(thefee), "Y", "N");
        logDebug("End of Script 5121_CityClerkWTUA.js");
    }
}