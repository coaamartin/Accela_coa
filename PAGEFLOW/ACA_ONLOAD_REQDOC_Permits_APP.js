/*------------------------------------------------------------------------------------------------------/
| Author : Raymond Province   
| Event   :ACA_ONLOAD_REQDOC_DB_APP - This will make Donation bin documents required on submittal.
|
/------------------------------------------------------------------------------------------------------*/
try {
    var SCRIPT_VERSION = 3.0
    var cap = aa.env.getValue("CapModel");
    var capId = cap.getCapID();
    eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
    eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
    eval(getScriptText("COMMON_ACA_PAGEFLOW_FUNCTIONS"));
    //var applicantType = null;
    //var contactArray = cap.getContactsGroup().toArray();

    //remove all documents first
    removeAllRequiredDocumentCapCondition();



    if (appMatch("Building/Permit/TempSigns/NA", capId)) {
        // addRequiredDocument("Owner Consent and Authorization Form");
        // addRequiredDocument("Owner Authorization for Graffiti Removal Form");
        addRequiredDocument("Location of Sign");
    } 
    // else if (appMatch("Building/Permit/TempUse/NA", capId)) {
    //     addRequiredDocument("Owner Consent and Authorization Form");
    //     addRequiredDocument("Owner Authorization for Graffiti Removal Form");
    //     addRequiredDocument("Location of bins Map");
    // } 
    else if (appMatch("Building/Permit/DonationBin/NA", capId)) {
        addRequiredDocument("Owner Consent and Authorization Form");
        addRequiredDocument("Owner Authorization for Graffiti Removal Form");
        addRequiredDocument("Location of bins Map");
    }
} catch (err) {
    aa.env.setValue("ErrorMessage", err.message);
}


function getScriptText(vScriptName) {
    var servProvCode = aa.getServiceProviderCode();
    if (arguments.length > 1) {
        servProvCode = arguments[1]; // use different serv prov code
    }
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        var emseScript = emseBiz.getScriptByPK(servProvCode, vScriptName, "ADMIN");
        return emseScript.getScriptText() + "";
    } catch (err) {
        return "";
    }
}