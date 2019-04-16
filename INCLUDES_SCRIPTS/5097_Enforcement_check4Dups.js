//function 5097_Enforcement_check4Dups(){


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


logGlobals(AInfo);

	//var vAddress;
	//AddedAddressList = AddedAddressList.toArray();	
	//logDebug("the message was " + AddedAddressList);
	//x = 0;
	//for (x in AddedAddressList) {
	//	vAddress = AddedAddressList[x];
	//logDebug("the address was " + AddedAddressList);		
	//}
    try{
        var checkForDups = AInfo["Check for Duplicates"];
        var possibleDupAltIds = "";
        
        //if(ifTracer(checkForDups == "CHECKED", 'Checking for duplicates')){
			logDebug("1 " + AddressStreetName);
			logDebug("1 " + AddressHouseNumber);
			logDebug("1 " + AddressStreetSuffix);
			logDebug("1 " + AddressZip);
			logDebug("1 " + AddressStreetDirection);			
            var capAddResult = aa.cap.getCapListByDetailAddress(AddressStreetName,parseInt(AddressHouseNumber),AddressStreetSuffix,AddressZip,AddressStreetDirection,null);
            if(!capAddResult.getSuccess()) {logDebug("the message was no data found. ");};
            logDebug("Found something so moving on. " + capAddResult);
            var capIdArray = capAddResult.getOutput();
              logDebug("Found something so moving on. " + capIdArray); 
y=0;			  
var relCapId = capIdArray[y].getCapID();
			logDebug("relCapId " + relCapId);
var relCap = aa.cap.getCap(relCapId).getOutput();
			logDebug("relCap " + relCap);
var relType = relCap.getCapType().toString();		
			logDebug("relType " + relType);
var relStatus = relCap.getCapStatus();	
			logDebug("relStatus " + relStatus);
            for (y in capIdArray){
				            logDebug("inside for loop. ");
                var relCapId = capIdArray[y].getCapID();
                var relCap = aa.cap.getCap(relCapId).getOutput();
                // get cap type
                var relType = relCap.getCapType().toString();
                var relStatus = relCap.getCapStatus();
                
                if(relType.startsWith("Enforcement/Incident/Vacant/Master") && matches(relStatus, "Monitoring","Assigned","Submitted","Working","No Plant","Planted","Removed","Complete Not Stake", "Complete Staked","Warranty Failed")){
                    possibleDupAltIds += relCapId.getCustomID() + ",";
                }
            }
            
            if(possibleDupAltIds.length > 0){
                cancel = true;
                showMessage = true;
                comment("Possible duplicates: " + possibleDupAltIds.substring(0, possibleDupAltIds.length -1));
            }
        //}
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function (). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function (). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
//}