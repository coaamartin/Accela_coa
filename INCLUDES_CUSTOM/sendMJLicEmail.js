//Scripts 226, 227
function sendMJLicEmail(itemCap){
    logDebug("sendMJLicEmail() started.");
    var itemCap = capId;
    if (arguments.length > 0)
        itemCap = arguments[0];

    try{
        var asiValues = new Array();
        loadAppSpecific(asiValues); 
        var adResult = aa.address.getAddressByCapId(capId).getOutput(); 
        for(x in adResult)
        {
            var adType = adResult[x].getAddressType(); 
            var stNum = adResult[x].getHouseNumberStart();
            var preDir =adResult[x].getStreetDirection();
            var stName = adResult[x].getStreetName(); 
            var stType = adResult[x].getStreetSuffix();
            var city = adResult[x].getCity();
            var state = adResult[x].getState();
            var zip = adResult[x].getZip();
        }
        var primaryAddress = stNum + " " + preDir + " " + stName + " " + stType + " " + "," + city + " " + state + " " + zip;
        var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
        acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
        var recordDeepUrl = getACARecordURL(acaURLDefault);
        
        var tradeName = getAppName(capId);

        var vEmailTemplate = "LIC MJ APPROVAL OF LICENSE #226 - 230";
        var vReportTemplate = "MJ_License";
        var vEParams = aa.util.newHashtable();
        addParameter(vEParams, "$$ApplicationName$$", appTypeAlias);
        addParameter(vEParams, "$$recordAlias$$", appTypeAlias);
        addParameter(vEParams, "$$wfComment$$", wfComment);
        addParameter(vEParams, "$$StateLicenseNumber$$", asiValues["State License Number"]);  
        addParameter(vEParams, "$$TradeName$$", tradeName);
        //addParameter(vEParams, "$$TradeName$$", asiValues["Trade Name"]);
        addParameter(vEParams, "$$FullAddress$$", primaryAddress); 
        addParameter(vEParams, "$$acaRecordUrl$$", recordDeepUrl);

        var vRParams = aa.util.newHashtable();
        addParameter(vRParams, "Record_ID", itemCap.getCustomID());
        
        //emailContactsWithReportLinkASync("Applicant,Responsible Party", vEmailTemplate, vEParams, vReportTemplate, vRParams, null, null, itemCap);
        //emailContactsWithReportLinkASync("Applicant,Responsible Party", emailTemplate, eParams, "", "", "N", "");

        var emails = _getContactEmailNoDupEmail(capId,"Applicant");
        var emails2 = _getContactEmailNoDupEmail(capId,"Responsible Party");
        var allEmails = arrayUnique(emails.concat(emails2));
        allEmails = allEmails.join(";");

        logDebug("Email send to: " + allEmails)
        var reportFiles = new Array();
        var report = _generateReportFile(vReportTemplate, vRParams, aa.getServiceProviderCode(), itemCap);
        reportFiles.push(report);
        _sendNotification("noreply@auroragov.org", allEmails, "", vEmailTemplate, vEParams, reportFiles, itemCap);

    }
    catch(err){
        showMessage = true;
        comment("Error on custom function sendMJLicEmail(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function sendMJLicEmail(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("sendMJLicEmail() ended.");
}//END sendMJLicEmail()
