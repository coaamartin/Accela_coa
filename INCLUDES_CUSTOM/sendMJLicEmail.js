//Scripts 226, 227
function sendMJLicEmail(itemCap){
    logDebug("sendMJLicEmail() started.");
    try{
        var vEmailTemplate = "LIC MJ APPROVAL OF LICENSE #226 - 230";
        var vReportTemplate = "MJ_License";
        var vEParams = aa.util.newHashtable();
        addParameter(vEParams, "$$ApplicationName$$", appTypeAlias);
        addParameter(vEParams, "$$recordAlias$$", appTypeAlias);
        addParameter(vEParams, "$$wfComment$$", wfComment);
        
        var vRParams = aa.util.newHashtable();
        addParameter(vRParams, "Record_ID", itemCap.getCustomID());
        
        emailContactsWithReportLinkASync("All", vEmailTemplate, vEParams, vReportTemplate, vRParams, null, null);
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function sendMJLicEmail(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function sendMJLicEmail(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("sendMJLicEmail() ended.");
}//END sendMJLicEmail()