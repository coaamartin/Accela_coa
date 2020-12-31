//Scripts 226, 227
function sendMJLicEmail(itemCap){
    logDebug("sendMJLicEmail() started.");
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
        var report = _generateReportFile(vReportTemplate, vRParams, aa.getServiceProviderCode());
        reportFiles.push(report);
        _sendNotification("noreply@auroragov.org", allEmails, "", vEmailTemplate, vEParams, reportFiles);

    }
    catch(err){
        showMessage = true;
        comment("Error on custom function sendMJLicEmail(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function sendMJLicEmail(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("sendMJLicEmail() ended.");
}//END sendMJLicEmail()



function _getContactEmailNoDupEmail(vcapId, vconType){
    var thisItem = arguments[0];
    var searchConType = arguments[1];
    var conEmailArray = [];
    var vConObjArry;
    if(searchConType.toUpperCase()=="ALL"){
        vConObjArry = getContactObjsByCap(thisItem);
    }else{
        vConObjArry = getContactObjsByCap(thisItem,searchConType);
    }
    //return valid email addressses and only one address for multiple contacts with same email
    for(eachCont in vConObjArry){
        var vConObj = vConObjArry[eachCont];
        //Get contact email
        if (vConObj) {
            var conEmail = vConObj.people.getEmail();   
            var conType = vConObj.people.getContactType();
            if (conEmail && conEmail != null && conEmail != "" && conEmail.indexOf("@") > 0) {
                if(!exists(conEmail,conEmailArray) ){
                    conEmailArray.push(conEmail);
                    logDebug("Returning email for :" + conType )
                    logDebug('Email: ' + conEmail)
                    
                }
                
            }
        }
    }
    return conEmailArray;
    
}
function _generateReportFile(aaReportName,parameters,rModule) 
{
    var reportName = aaReportName;

    report = aa.reportManager.getReportInfoModelByName(reportName);
    report = report.getOutput();


    report.setModule(rModule);
    report.setCapId(capId);
    report.setReportParameters(parameters);
    //Added
    vAltId = capId.getCustomID();
    report.getEDMSEntityIdModel().setAltId(vAltId);
    var permit = aa.reportManager.hasPermission(reportName,"ADMIN");
    logDebug("Report successfully ran: "+permit.getOutput().booleanValue());
    if(permit.getOutput().booleanValue()) 
    {
        var reportResult = aa.reportManager.getReportResult(report);

        if(reportResult) 
        {
            reportResult = reportResult.getOutput();
            var reportFile = aa.reportManager.storeReportToDisk(reportResult);
            //logDebug("Report Result: "+ reportResult);
            reportFile = reportFile.getOutput();
            logDebug("Report Result: "+ reportFile);
            return reportFile
        } else 
        {
            logDebug("Unable to run report: "+ reportName + " for Admin" + systemUserObj);
            return false;
        }
    } else 
    {
        logDebug("No permission to report: "+ reportName + " for Admin" + systemUserObj);
        return false; 
    }
}

function _sendNotification(emailFrom,emailTo,emailCC,templateName,params,reportFile)
{
    var capIDScriptModel = aa.cap.createCapIDScriptModel(capId.getID1(), capId.getID2(), capId.getID3());
    var result = null;
    result = aa.document.sendEmailAndSaveAsDocument(emailFrom, emailTo, emailCC, templateName, params, capIDScriptModel, reportFile);
    if(result.getSuccess())
    {
        logDebug("Sent email successfully!");
        return true;
    }
    else
    {
        logDebug("Failed to send mail. - " + result.getErrorType());
        var itemCap = capId;
    
        var id1 = itemCap.ID1;
        var id2 = itemCap.ID2;
        var id3 = itemCap.ID3;
        var capIDScriptModel = aa.cap.createCapIDScriptModel(id1, id2, id3);
        result = aa.document.sendEmailAndSaveAsDocument(emailFrom, emailTo, emailCC, templateName, params, capIDScriptModel, reportFile);
        if(result.getSuccess())
        {
            logDebug("2nd Attempt... Sent email successfully!");
            return true;
        }
        else
        {
            logDebug("2nd Attempt Failed to send mail. - " + result.getErrorType());
            return false;
        }
    }
}

function arrayUnique(array) {
    var tmp = [];
    var result = [];

    if (array !== undefined /* any additional error checking */ ) {
      for (var i = 0; i < array.length; i++) {
        var val = array[i];

        if (tmp[val] === undefined) {
           tmp[val] = true;
           result.push(val);
         }

        }
      }

      return result;
}