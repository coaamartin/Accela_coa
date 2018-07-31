/*------------------------------------------------------------------------------------------------------/
| Program : ACA Page Flow Template.js
| Event   : ACA Page Flow Template
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
var useCustomScriptFile = true;             // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
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
    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA));
    eval(getScriptText(SAScript, SA));
} else {
    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
}

eval(getScriptText("INCLUDES_CUSTOM",null,useCustomScriptFile));


function getScriptText(vScriptName, servProvCode, useProductScripts) {
    if (!servProvCode)  servProvCode = aa.getServiceProviderCode();
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
var parentId = cap.getParentCapID();
var appTypeResult = cap.getCapType();
var appTypeString = appTypeResult.toString();               // Convert application type to string ("Building/A/B/C")
var appTypeArray = appTypeString.split("/");                // Array of application type string
var AInfo = new Array();                        // Create array for tokenized variables
var capId = null; // needed for next call
//loadAppSpecific4ACA(AInfo);                       // Add AppSpecific Info

// page flow custom code begin

var parcel = null;
var address = null;
var parcelNum;
var streetName;
parcel = cap.getParcelModel();
address = cap.getAddressModel();

//Do any pageflow validation scripting for custom lists here for water
//if(appTypeArray[0] == 'Water'){
//    //Scripting for Water/Utility/Permit/NA
//    if(appTypeString == "Water/Utility/Permit/NA"){
//        var permitType = AInfo["Utility Permit Type"];
//        if(permitType == "Water Main Utility Permit"){
//            loadASITables4ACA();
//            //if (typeof (WATERMATERIAL) == "object") {
//            //    for(x in WATERMATERIAL){
//            //        var col1 = WATERMATERIAL[x]["Size of Pipe"];
//            //        var col2 = WATERMATERIAL[x]["Pipe Material"];       
//            //        var col3 = WATERMATERIAL[x]["Length in Lineal Feet"];
//            //        
//            //        logDebug("col1:" + col1 + ";col1.length():" + col1.length());
//            //        logDebug("col2:" + col2 + ";col2.length():" + col2.length());
//            //        logDebug("col3:" + col3 + ";col3.length():" + col3.length());
//            //        if((col1.length() != 0) || (col2.length()!=0) || (col3.length()!=0)){
//            //            cancel = false;
//            //        }
//            //        else
//            //            message += "You must add at least 1 row in  WATER MATERIAL.";
//            //    }
//            //}
//            //else
//            //    message += "You must add at least 1 row in  WATER MATERIAL.";
//        }
//    }
//    //end Scripting for Water/Utility/Permit/NA
//    message += "Test";
//	showDebug = true;
//    showMessage = cancel = message.length ? true : false;
//    
//}//END scriting for water module
  message += "Test";
  showDebug = true;// page flow custom code end
  showMessage = cancel = message.length ? true : false;
  aa.sendMail("jal@byrnesoftware.com", "jal@byrnesoftware.com", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);

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
