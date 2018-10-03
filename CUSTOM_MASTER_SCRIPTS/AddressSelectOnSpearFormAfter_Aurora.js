/*------------------------------------------------------------------------------------------------------/
| Program : AddressSelectOnSpearFormAfter_Aurora.js
| Event   : AddressSelectOnSpearFormAfter
|
| Usage   : Adapted from the UniversalMasterScript to check for duplicate records based on address only
|			for users whose default module is "Forestry"
|
| Client  : Aurora, CO
| Action# : Display message showing records related to an Address only for users who have "Forestry"
|			configured as their default module.
|
| Notes   :
|
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START Configurable Parameters
|	The following script code will attempt to read the assocaite event and invoker the proper standard choices
|
/------------------------------------------------------------------------------------------------------*/
var triggerEvent = aa.env.getValue("EventName");
var controlString = null;
var documentOnly = false; // Document Only -- displays hierarchy of std choice steps


var preExecute = "PreExecuteForAfterEvents"; //Assume after event unless before decected
var eventType = "After"; //Assume after event
if (triggerEvent != "") {
	controlString = triggerEvent; // Standard choice for control
	if (triggerEvent.indexOf("Before") > 0) {
		preExecute = "PreExecuteForBeforeEvents";
		eventType = "Before";
	}
}

/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var SCRIPT_VERSION = 3.0;
var useCustomScriptFile = true; // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
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
	eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA, useCustomScriptFile));
	eval(getScriptText(SAScript, SA));
} else {
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useCustomScriptFile));
	eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, useCustomScriptFile));
}

eval(getScriptText("INCLUDES_CUSTOM", null, useCustomScriptFile));

if (documentOnly) {
	doStandardChoiceActions(controlString, false, 0);
	aa.env.setValue("ScriptReturnCode", "0");
	aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");
	aa.abortScript();
}

var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX", vEventName);

var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS";
var doStdChoices = true; // compatibility default
var doScripts = false;
var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice).getOutput().size() > 0;
if (bzr) {
	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "STD_CHOICE");
	doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";
	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "SCRIPT");
	doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";
}

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

/*------------------------------------------------------------------------------------------------------/
| BEGIN Event Specific Variables
/------------------------------------------------------------------------------------------------------*/
//Log All Environmental Variables as  globals
var params = aa.env.getParamValues();
var keys = params.keys();
var key = null;
while (keys.hasMoreElements()) {
	key = keys.nextElement();
	eval("var " + key + " = aa.env.getValue(\"" + key + "\");");
	logDebug("Loaded Env Variable: " + key + " = " + aa.env.getValue(key));
}

/*------------------------------------------------------------------------------------------------------/
| END Event Specific Variables
/------------------------------------------------------------------------------------------------------*/

if (preExecute.length)
	doStandardChoiceActions(preExecute, true, 0); // run Pre-execution code

logGlobals(AInfo);

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/
//
//  Get the Standard choices entry we'll use for this App type
//  Then, get the action/criteria pairs for this app
//
// No record information exists for this event so we cannot do any branching
//if (doStdChoices) doStandardChoiceActions(controlString,true,0);


//
//  Next, execute and scripts that are associated to the record type
//
// No record information exists for this event so we cannot do any branching
//if (doScripts) doScriptActions();


var vCurrentUser = currentUserID;
var vUsersDefaultModule = getUserDefaultModule(vCurrentUser);

logDebug("Users Default Module: " + vUsersDefaultModule);

var ats = "Forestry/Request/Citizen/NA";
var ata = ats.split("/");
var x = 0;
var y = 0;
var z = 0;
var vAddress;
var capAddResult;
var capIdArray;
var relcap;
var reltype;
var reltypeArr = [];
var isMatch = true;
var retArr = [];
AddedAddressList = AddedAddressList.toArray();

// Check if the current user has "Forestry" selected as their default module.
if (vUsersDefaultModule == "Forestry") {
//if (vUsersDefaultModule != false && vUsersDefaultModule != null && vUsersDefaultModule != "") {
	// Parse the list of selected address and check if other records exist for the selected address
	x = 0;
	for (x in AddedAddressList) {
		vAddress = AddedAddressList[x];
//logDebug("Checking " + vAddress.getStreetName() + " : " + vAddress.getHouseNumberStart() + " : " + vAddress.getStreetSuffix() + " : " + vAddress.getZip() + " : " + vAddress.getStreetDirection());
		// get caps with same address
		capAddResult = aa.cap.getCapListByDetailAddress(vAddress.getStreetName(), vAddress.getHouseNumberStart(), vAddress.getStreetSuffix(), vAddress.getZip(), vAddress.getStreetDirection(), null);
		if (capAddResult.getSuccess()) {
			capIdArray = capAddResult.getOutput();
		} else {
			logDebug("**ERROR: getting similar addresses: " + capAddResult.getErrorMessage());
		}
		// loop through related caps to check for the correct type and of the correct status
		y = 0;
		for (y in capIdArray) {
			relcap = aa.cap.getCap(capIdArray[y].getCapID()).getOutput();
			// get cap type
			reltype = relcap.getCapType().toString();
			reltypeArr = reltype.split("/");
			isMatch = true;
			if (ata.length != 4) {
				logDebug("**ERROR: The following Application Type String is incorrectly formatted: " + ats);
			}
			else {
				for (xx in ata) {
					if (!ata[xx].equals(reltypeArr[xx]) && !ata[xx].equals("*")) {					
						isMatch = false;
					}
				}
				// Exclude records that are "Complete"
				if (relcap.getCapStatus() == "Complete") {
					isMatch = false;
				}
			}
			if (isMatch) {				
				retArr.push(capIdArray[y]);
			}
		}
		// loop through matching records and display message
		if (retArr.length > 0) {
			showMessage = true;
			comment("The following records already exist for the address(es) selected:");
			z = 0;
			for (z in retArr) {
				relcap = aa.cap.getCap(retArr[z].getCapID()).getOutput();
				// get cap type
				reltype = relcap.getCapType().toString();				
				comment("Record Id: " + retArr[z].getCapID().getCustomID() + " : " + reltype);
			}
		}
	}
}

//
// Check for invoicing of fees
//
if (feeSeqList.length) {
	invoiceResult = aa.finance.createInvoice(capId, feeSeqList, paymentPeriodList);
	if (invoiceResult.getSuccess())
		logMessage("Invoicing assessed fee items is successful.");
	else
		logMessage("**ERROR: Invoicing the fee items assessed to app # " + capIDString + " was not successful.  Reason: " + invoiceResult.getErrorMessage());
}

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/
if (eventType == "After") {
	if (debug.indexOf("**ERROR") > 0) {
		aa.env.setValue("ScriptReturnCode", "1");
		aa.env.setValue("ScriptReturnMessage", debug);
	} else {
		aa.env.setValue("ScriptReturnCode", "0");
		if (showMessage)
			aa.env.setValue("ScriptReturnMessage", message);
		if (showDebug)
			aa.env.setValue("ScriptReturnMessage", debug);
	}
} else { //Process Before Event with cancel check
	if (debug.indexOf("**ERROR") > 0) {
		aa.env.setValue("ScriptReturnCode", "1");
		aa.env.setValue("ScriptReturnMessage", debug);
	} else {
		if (cancel) {
			aa.env.setValue("ScriptReturnCode", "1");
			if (showMessage)
				aa.env.setValue("ScriptReturnMessage", "<font color=red><b>Action Cancelled</b></font><br><br>" + message);
			if (showDebug)
				aa.env.setValue("ScriptReturnMessage", "<font color=red><b>Action Cancelled</b></font><br><br>" + debug);
		} else {
			aa.env.setValue("ScriptReturnCode", "0");
			if (showMessage)
				aa.env.setValue("ScriptReturnMessage", message);
			if (showDebug)
				aa.env.setValue("ScriptReturnMessage", debug);
		}
	}
}

/*------------------------------------------------------------------------------------------------------/
| <===========External Functions (used by Action entries)
/------------------------------------------------------------------------------------------------------*/
