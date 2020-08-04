//Written by rprovinc   
//
//include("5125_Associations_Number.js");

//*****************************************************************************
//Script ASA;Assocaitons!~!~!~.js
//Record Types:	Associations\*\*\* 
//Event: 		ASA
//Desc:			Getting the highest HOA number and then incrementing it by 1 and updating the new record with the HOA number.
//
//Created By: Rprovinc
//******************************************************************************

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

getNeighborhoodNumber();

function getNeighborhoodNumber(){

    try {

        //Associations/Neighborhood/Association
        var sql = "SELECT MAX(VALUE_TO_NUM) " +
                  " FROM BCHCKBOX " +
                  " WHERE B1_CHECKBOX_DESC like 'Neighborhood Group Number'"
        logdebug("The highest neighborhood number is: " + sql);
        var hoaNumber = sql++;
        logdebug("New HOA number is: "+ hoaNumber);

    }
    finally {
       //push the new hoaNumber into the Neighborhood Group Number
       //This is a cutom field
    }
}