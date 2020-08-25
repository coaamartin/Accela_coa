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


logDebug("ASA:CityClerk/Incident/NA/NA");
include("5110_CodeTempSignCTRCA");
checkACARun();

function checkACARun() {
var altId = capId;
var altId2 = capId.getCustomID();
logDebug("altId: " + altId);
logDebug("altId2: " + altId2);
var tempCheck = altId.toString().substr(2, 3);
var tempCheck2 = altId2.toString().substr(2, 3);
logDebug("TempCheck: " + tempCheck);
logDebug("TempCheck: " + tempCheck2);
if (tempCheck === "TMP"){
    logDebug("Temp check came back with: " + tempCheck);
    logDebug("altId: " + altId);
    logDebug("altId2: " + altId2);
} else {
    logDebug("Going to have 5110 script tirgger.")
//     include("5110_CodeTempSignCTRCA");
}


// logDebug("altId: " + altId);
// logDebug("altId2: " + altId2);

// if (ifTracer(altId2.equals("*TMP*"))) {
//      logDebug("Going to have the CTRCA event trigger.");
// } else {
//     
// }
}