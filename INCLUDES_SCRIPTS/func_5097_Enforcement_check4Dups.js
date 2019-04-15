// SCRIPTNUMBER: 5097
// SCRIPTFILENAME: 5097_Enforcement_check4Dups.js
// PURPOSE: Checks for duplicates records based on address and type.
// DATECREATED: 04/10/2019
// BY: amartin
// CHANGELOG: 
//Script Tester header.  Comment this out when deploying.
//var myCapId = "19-000022-CVM";
//var myUserId = "AMARTIN";
//var eventName = "";
//var wfTask = "Renewal Registration";
//var wfStatus = "Sent Renewal";
//var wfComment = "";

//var useProductScript = true;  // set to true to use the "productized" master scripts (events->master scripts), false to use scripts from (events->scripts)
//var runEvent = true; // set to true to simulate the event and run all std choices/scripts for the record type.  

///* master script code don't touch */ aa.env.setValue("EventName",eventName); var vEventName = eventName;  var controlString = eventName;  var tmpID = aa.cap.getCapID(myCapId).getOutput(); if(tmpID != null){aa.env.setValue("PermitId1",tmpID.getID1()); 	aa.env.setValue("PermitId2",tmpID.getID2()); 	aa.env.setValue("PermitId3",tmpID.getID3());} aa.env.setValue("CurrentUserID",myUserId); var preExecute = "PreExecuteForAfterEvents";var documentOnly = false;var SCRIPT_VERSION = 3.0;var useSA = false;var SA = null;var SAScript = null;var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_FOR_EMSE"); if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") { 	useSA = true; 		SA = bzr.getOutput().getDescription();	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_INCLUDE_SCRIPT"); 	if (bzr.getSuccess()) { SAScript = bzr.getOutput().getDescription(); }	}if (SA) {	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",SA,useProductScript));	eval(getScriptText("INCLUDES_ACCELA_GLOBALS",SA,useProductScript));	/* force for script test*/ showDebug = true; eval(getScriptText(SAScript,SA,useProductScript));	}else {	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",null,useProductScript));	eval(getScriptText("INCLUDES_ACCELA_GLOBALS",null,useProductScript));	}	eval(getScriptText("INCLUDES_CUSTOM",null,useProductScript));if (documentOnly) {	doStandardChoiceActions2(controlString,false,0);	aa.env.setValue("ScriptReturnCode", "0");	aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");	aa.abortScript();	}var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX",vEventName);var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS";var doStdChoices = true;  var doScripts = false;var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice ).getOutput().size() > 0;if (bzr) {	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"STD_CHOICE");	doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"SCRIPT");	doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";	}	function getScriptText(vScriptName, servProvCode, useProductScripts) {	if (!servProvCode)  servProvCode = aa.getServiceProviderCode();	vScriptName = vScriptName.toUpperCase();	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();	try {		if (useProductScripts) {			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);		} else {			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");		}		return emseScript.getScriptText() + "";	} catch (err) {		return "";	}}logGlobals(AInfo); if (runEvent && typeof(doStandardChoiceActions) == "function" && doStdChoices) try {doStandardChoiceActions(controlString,true,0); } catch (err) { logDebug(err.message) } if (runEvent && typeof(doScriptActions) == "function" && doScripts) doScriptActions(); var z = debug.replace(/<BR>/g,"\r");  aa.print(z); 

/*
User code generally goes inside the try block below.
*/

//try 
//{
//your code here
//End script Tester header 
//functions cannot start with a number so I preceded it with func_
func_5097_Enforcement_check4Dups();

function func_5097_Enforcement_check4Dups() {
	var possibleDupAltIds = "";	
    try{
    //if(ifTracer(appTypeString.startsWith("Enforcement/Incident/Vacant/"), '"Enforcement/Incident/Vacant/"')){
        
        var capIdsArray = capIdsGetByAddr4ACA(); //Get all records for same address
        var forestryRecsOpen = false;
        //For each record with same address
        for(eachCapId in capIdsArray){
            sameAddrCapId = capIdsArray[eachCapId];
            sameAddrAltId = capIdsArray[eachCapId].getCustomID();

            var sameAddrCap = aa.cap.getCap(sameAddrCapId).getOutput();
            var sameAddrCapStatus = sameAddrCap.getCapStatus();
            var sameAddrAppTypeString = sameAddrCap.getCapType().toString();
            var sameAddrAppTypeArray = sameAddrAppTypeString.split("/");

            logDebug("sameAddrAltId:" + sameAddrAltId + ", status: " + sameAddrCapStatus);
            //if type is Forestry/ and a status match cancel
            if(ifTracer(sameAddrAppTypeString.startsWith("Enforcement/Incident/Vacant/Master/") &&
                        matches(sameAddrCapStatus, "Application","Monitoring","Recorded","Recorded and Assessed","Recorded and Expired","Registered","Registered and Expired","Registered and Recorded"),
                        'Code Vacancy with correct status')){
                message += "It appears someone has already submitted a request for this Address.  Please call the Enforcement Department at 303-739-XXXX if you wish to submit an additional request.<BR>";
possibleDupAltIds +=  "Found1,"; 
 break;
            }
        }
    //}		
		/*
            var capAddResult = aa.cap.getCapListByDetailAddress(AddressStreetName,parseInt(AddressHouseNumber),AddressStreetSuffix,AddressZip,AddressStreetDirection,null);
			logDebug("---------------------> var capAddResult is: " + capAddResult);		
            if(!capAddResult.getSuccess()) return;
            logDebug("---------------------> Found a cap.");
            var capIdArray = capAddResult.getOutput();
                        logDebug("---------------------> capIdArray: " + capIdArray);
            for (cappy in capIdArray){
                var relCapId = capIdArray[cappy].getCapID();
			                        logDebug("---------------------> inside for loop.  relCapId is: " + relCapId);	
                var relCap = aa.cap.getCap(relCapId).getOutput();
                // get cap type
                var relType = relCap.getCapType().toString();
                var relStatus = relCap.getCapStatus();
                //Add new blocks here for other records.
                if(relType.startsWith("Enforcement/Incident/Vacant/Master") && matches(relStatus, "Application","Monitoring","Recorded","Recorded and Assessed","Recorded and Expired","Registered","Registered and Expired","Registered and Recorded")){
                    possibleDupAltIds += relCapId.getCustomID() + ",";
                        logDebug("---------------------> inside If that matches on record and status  " + relType.startsWith); 
				}
            }
			*/
            
            if(possibleDupAltIds.length > 0){
                cancel = true;
                showMessage = true;
                comment("Possible duplicates: " + possibleDupAltIds.substring(0, possibleDupAltIds.length -1));
            }
    }
    catch(err){
				logDebug("---------------------> caught error.");
		cancel = true;
        showMessage = true;
        comment("Error on custom function (). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function (). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
}

function capIdsGetByAddr4ACA() {
    //Gets CAPs with the same address as the current CAP, as capId (CapIDModel) object array (array includes current capId)
    //07SSP-00034/SP5015
    //

    //Get address(es) on current CAP
    var addr = cap.getAddressModel(capId);

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


logDebug("---------------------> 5097_Enforcement_check4Dups.js ended.");

//Script Tester footer.  Comment this out when deploying.
//}	

//catch (err) 
//{
//	logDebug("A JavaScript Error occured: " + err.message);
//}
//aa.env.setValue("ScriptReturnCode", "0");
//aa.env.setValue("ScriptReturnMessage", debug)