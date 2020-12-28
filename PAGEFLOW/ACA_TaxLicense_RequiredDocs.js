/*------------------------------------------------------------------------------------------------------/
| Program : ACA_BLD_DOC_REQUIRED
| Event   : PAGEFLOWBEFORE
|
/------------------------------------------------------------------------------------------------------*/
if (aa.env.getValue("ScriptName") == "Test") { 	// Setup parameters for Script Test.
	var CurrentUserID = "PUBLICUSER124450"; // Public User ID: rschug
	var capIDString = "20TMP-000005";			// Test Temp Record from ACA.
	aa.env.setValue("ScriptCode", "Test");
	aa.env.setValue("CurrentUserID", CurrentUserID); 	// Current User
	sca = capIDString.split("-");
	if (sca.length == 3 && sca[1] == "00000") { // Real capId
		var capID = aa.cap.getCapID(sca[0], sca[1], sca[2]).getOutput();
		aa.print("capID: " + capID + ", capIDString: " + sca.join("-") + " sca");
	} else { // Alt capId
		capID = aa.cap.getCapID(capIDString).getOutput();
		aa.print("capID: " + capID + ", capIDString: " + capIDString);
	}
	capModel = aa.cap.getCapViewBySingle4ACA(capID);
	aa.env.setValue("CapModel", capModel);
	aa.print("CurrentUserID:" + CurrentUserID);
	aa.print("capIDString:" + capIDString);
	aa.print("capID:" + capID);
	aa.print("capModel:" + capModel);
}

/*------------------------------------------------------------------------------------------------------/
| START User Configurable Parameters
|
|     Only variables in the following section may be changed.  If any other section is modified, this
|     will no longer be considered a "Master" script and will not be supported in future releases.  If
|     changes are made, please add notes above.
/------------------------------------------------------------------------------------------------------*/
var showMessage = false; // Set to true to see results in popup window
var showDebug = true; // Set to true to see debug messages in popup window
var useAppSpecificGroupName = false; // Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = false; // Use Group name when populating Task Specific Info Values
var cancel = false;

var docCategoriesRequired = null;		// Use Doc Categories by Type if null otherwise use array of required doc categories.
var docCategoriesRequiredByType = [];	// Required doc categories
docCategoriesRequiredByType["Licneses/Supplemental/Door ID Badge/Application"] = ["Application Forms","Background Information"];
docCategoriesRequiredByType["Licneses/Supplemental/After Hours/Application"] = ["Application Forms","Background Information","Business Operations","Consent Forms","Financial Documentation","Legal Entity Documents","Premise Diagrams","Property Forms"];
docCategoriesRequiredByType["Licneses/Supplemental/Massage Facility/Application"] = ["Application Forms","Background Information","Business Operations","Consent Forms","Financial Documentation","Property Forms"];
docCategoriesRequiredByType["Licneses/Supplemental/Pawnbroker/Application"] = ["Application Forms","Background Information","Consent Forms","Financial Documentation","Legal Entity Documents","Insurance Documents","Property Forms"];
var systemMailFrom = "noreply@accela.com";
var adminUserEmail = "acharlton@truepointsolutions.com";
var debugEmailTo = "";
var errorEmailTo = adminUserEmail;			// To Email Address handle Error Message
var envName = ""
/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();
var startTime = startDate.getTime();
var message = ""; // Message String
var debug = ""; // Debug String
var br = "<BR>"; // Break Tag
var servProvCode = aa.getServiceProviderCode();
var serverName = java.net.InetAddress.getLocalHost().getHostName(); // Host Name
var systemMailFrom = systemMailFrom.replace("noreply@accela.com","noreply_"+servProvCode+(envName?"_"+envName:"")+"@accela.com");
var vScriptName = aa.env.getValue("ScriptName");
var vScriptCode = aa.env.getValue("ScriptCode");

var SCRIPT_VERSION = 9.0;
var useCustomScriptFile = true;  // if true, use Events->Custom Script and Master Scripts, else use Events->Scripts->INCLUDES_*
var useSA = false;
var SA = null;
var SAScript = null;

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

var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS";
var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice).getOutput().size() > 0;
if (bzr) {
   var bvr3 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "USE_MASTER_INCLUDES");
   if (bvr3.getSuccess()) { if (bvr3.getOutput().getDescription() == "No") useCustomScriptFile = false };
}

try {
if (SA) {
   eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA, useCustomScriptFile));
   eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA, useCustomScriptFile));
   eval(getScriptText(SAScript, SA));
} else {
   eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useCustomScriptFile));
   eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, useCustomScriptFile));
}

eval(getScriptText("INCLUDES_CUSTOM", null, useCustomScriptFile));
eval(getScriptText("INCLUDES_PAGEFLOW_FUNCTIONS"));
eval(getScriptText("INCLUDES_PAGEFLOW_GLOBALS"));
} catch (err) {
   context = "Page Flow Script: " + aa.env.getValue("ScriptCode") + " Loading INCLUDES"
   rollBack = true;
   aa.print((rollBack ? "**ERROR** " : "ERROR: ") + err.message + " In " + context + " Line " + err.lineNumber);
   aa.print("Stack: " + err.stack);
}

if (true) { // override standard functions.
function logDebug(dstr) {
	if (typeof (debug) == "undefined") debug = "";
	if (typeof (br) == "undefined") br = "<BR>";
	vLevel = 1
	if (arguments.length > 1)
		vLevel = arguments[1];
//	if ((showDebug & vLevel) == vLevel || vLevel == 1)
		debug += dstr + br;
	if ((showDebug & vLevel) == vLevel) {
		aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"), dstr);
	} else if (dstr.indexOf("**ERROR") >= 0) {
		aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID") + (typeof (ScriptCode) == "undefined" ? "" : " " + ScriptCode), dstr);
	}
}
} // End override.

logDebug("servProvCode: " + servProvCode);
logDebug("serverName: " + serverName);
logDebug("CapModel: " + aa.env.getValue("CapModel"));
/*------------------------------------------------------------------------------------------------------/
| BEGIN Event Specific Variables
/------------------------------------------------------------------------------------------------------*/
//Log All Environmental Variables as globals
var params = aa.env.getParamValues();
var keys = params.keys();
var key = null;
while (keys.hasMoreElements()) {
   key = keys.nextElement();
   if (!exists(key,["CapModel","CurrentUserID","ScriptName"])) {
      eval("var " + key + " = aa.env.getValue(\"" + key + "\");");
      keyMsg = " (Loaded)";
   } else {
      keyMsg = "         ";
   }
   logDebug("ENV Variable" + keyMsg + ": " + key + " = " + aa.env.getValue(key));
}

var capModelInited = aa.env.getValue("CAP_MODEL_INITED");
if (capModel == "") capModel = null;
if (currentUserID == "") currentUserID = "ADMIN";
/*------------------------------------------------------------------------------------------------------/
| END Event Specific Variables
/------------------------------------------------------------------------------------------------------*/

// Get Public User Email Address
var publicUserEmail = "";
if (publicUserID) {
   var publicUserModelResult = aa.publicUser.getPublicUserByPUser(publicUserID);
   if (publicUserModelResult.getSuccess() && publicUserModelResult.getOutput()) {
      publicUserEmail = publicUserModelResult.getOutput().getEmail();
	  if (publicUserEmail) publicUserEmail = publicUserEmail.replace("TURNED_OFF","").toLowerCase();
      logDebug("publicUserEmail: " + publicUserEmail + " for " + publicUserID)
   } else {
      publicUserEmail = null;
      logDebug("publicUserEmail: " + publicUserEmail);
   }
}

if (exists(publicUserEmail, ["rschug@truepointsolutions.com"])) {
	debugEmailTo = publicUserEmail;
	errorEmailTo = publicUserEmail;
}

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/
// page flow custom code begin
try {
	var capModel = aa.env.getValue("CapModel");
	var cap = capModel;
	if (cap && cap == "") cap = null;
	var capId = null, capType = null;
	if (cap) {
		var capId = cap.getCapID();
		var capType = cap.getCapType();
	}
	logDebug("cap: " + (cap && cap.getCapID? cap.getCapID() + " " + (cap.getCapID().getCustomID()? cap.getCapID().getCustomID()+ " ":""):"") + cap);
	logDebug("capType: " + capType);
	newCapIDString =  capId.getID1() + "-" + capId.getID2() + "-" + capId.getID3(); 
	logDebug("newCapIDString: " + newCapIDString);
	if (!docCategoriesRequired && docCategoriesRequiredByType)
		docCategoriesRequired = docCategoriesRequiredByType[capType];	// Required Document Categories

	var docCategoriesFound = [];
	var docCount = 0;
	var docCatCount = [];

	// Create a list of document categories.
	var docListResult = aa.document.getDocumentListByEntity(newCapIDString,"TMP_CAP");
	var docListArray = [];
	if (docListResult.getSuccess) docListArray = docListResult.getOutput().toArray();
	for (x in docListArray){
		var docCategory = docListArray[x].getDocCategory();
		docCount++;
		if (!docCategory) continue;
		if (typeof(docCatCount[docCategory]) == "undefined") docCatCount[docCategory] = 0;
		docCatCount[docCategory]++;
		if (docCategory && !exists(docCategory,docCategoriesFound)) docCategoriesFound.push(docCategory);
	}
	logDebug("In TMP_CAP found " + docListArray.length + " documents with " + docCategoriesFound.join(","));

	var docListResult = aa.document.getDocumentListByEntity(newCapIDString,"CAP");
	var docListArray = [];
	if (docListResult.getSuccess) docListArray = docListResult.getOutput().toArray();
	for (x in docListArray){
		var docCategory = docListArray[x].getDocCategory();
		docCount++;
		if (!docCategory) continue;
		if (typeof(docCatCount[docCategory]) == "undefined") docCatCount[docCategory] = 0;
		docCatCount[docCategory]++;
		if (docCategory && !exists(docCategory,docCategoriesFound)) docCategoriesFound.push(docCategory);
	}
	logDebug("In CAP found " + docListArray.length + " documents with " + docCategoriesFound.join(","));

	// Create a list of missing document categories.
	var docCategoriesMissing = [];
	for (x in docCategoriesRequired){
		var docCategory = docCategoriesRequired[x];
		if (docCategory && !exists(docCategory,docCategoriesFound)) docCategoriesMissing.push(docCategory);   
	}
	logDebug("Required document types: " + docCategoriesRequired.join(","));
	logDebug("Missing document types: " + docCategoriesMissing.join(","));

	var errorMessage = "";
	if (docCategoriesMissing.length > 0)	{
		//block submit
		cancel = true;
		showMessage = true; 
		if (docCategoriesMissing.length > 1) // more than 1 document type missing.
			errorMessage = "To Proceed you must attach at least one document for each of the following types: " + docCategoriesMissing.join(", ");
		else // Only one doc type missing
			errorMessage = "To Proceed you must attach at least one document with type " + docCategoriesMissing.join(", ");
		logMessage(errorMessage);
	}
} catch (err) {
   handleError(err, "Page Flow Script: " + vScriptName);
}

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/
if (debug.indexOf("**ERROR") > 0) {
   aa.env.setValue("ErrorCode", "1");
   aa.env.setValue("ErrorMessage", debug);
} else {
   if (cancel) {
      aa.env.setValue("ErrorCode", "-2");
      if (showMessage) aa.env.setValue("ErrorMessage", message);
      if (showDebug) aa.env.setValue("ErrorMessage", debug);
   }
   else {
      aa.env.setValue("ErrorCode", "0");
      if (showMessage) aa.env.setValue("ErrorMessage", message);
      if (showDebug) aa.env.setValue("ErrorMessage", debug);
   }
}

logDebug("ErrorCode: " + aa.env.getValue("ErrorCode"));
logDebug("ErrorMessage: " + aa.env.getValue("ErrorMessage"));
if (aa.env.getValue("ScriptName") == "Test") aa.print(debug.replace(/<BR>/g, "\r"));

// Send Debug Email
debugEmailSubject = "";
debugEmailSubject += (capIDString ? capIDString + " " : (cap && cap.getCapID ? cap.getCapID() + " " : "")) + vScriptName + " - Debug";
if (debugEmailTo && debugEmailTo != "")
   aa.sendMail(systemMailFrom, debugEmailTo, "", debugEmailSubject, "Debug: " + br + debug.replace(/\r/g, br));

// Send Error Email
if (debug.indexOf("**ERROR") > 0 && errorEmailTo != "") {
	aa.sendMail(systemMailFrom, errorEmailTo, "", "ERROR: "
		+ (capIDString ? capIDString + " " : "")
		+ (capId ? capId + " " : "") + vScriptName, "ERROR - " + err.message + br + "Debug: " + br + debug.replace(/\r/g, br));
}
/*------------------------------------------------------------------------------------------------------/
| <===========Internal Functions (used by Action entries)
/------------------------------------------------------------------------------------------------------*/
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

function logDebug(dstr) {
	if (typeof (debug) == "undefined") debug = "";
	if (typeof (br) == "undefined") br = "<BR>";
	vLevel = 1
	if (arguments.length > 1)
		vLevel = arguments[1];
//	if ((showDebug & vLevel) == vLevel || vLevel == 1)
		debug += dstr + br;
	if ((showDebug & vLevel) == vLevel) {
		aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"), dstr);
	} else if (dstr.indexOf("**ERROR") >= 0) {
		aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID") + (typeof (ScriptCode) == "undefined" ? "" : " " + ScriptCode), dstr);
	}
}

function handleError(err,context) {
	var rollBack = true;
	var showError = true;

	if (showError) showDebug = true;
	logDebug((rollBack ? "**ERROR** " : "ERROR: ") + err.message + " In " + context + " Line " + err.lineNumber);
    logDebug("Stack: " + err.stack);
}

