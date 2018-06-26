function pWrksScript289_subPlatNotification(){
    logDebug("pWrksScript289_subPlatNotification() started");
    try{
        var emailTemplate = "PLN SUB PLAT RECORDED # 289";
        var emailParams = aa.util.newHashtable();
        var recepNumber = AInfo["Reception Number"];
        var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
        acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
        var recordURL = getACARecordURL(acaURLDefault);
        var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
        var reportFile = [];
        var emlTo = getAllContactsEmails();
        
        addParameter(emailParams, "$$altID$$", capIDString);
        addParameter(emailParams, "$$recordName$$", capName);
        addParameter(emailParams, "$$receptionNumber$$", recepNumber);
        addParameter(emailParams, "$$acaRecordUrl$$", recordURL);
        if(emlTo){
            var sendResult = sendNotification("noreply@aurora.gov",emlTo,"",emailTemplate,emailParams,reportFile,capID4Email);
            if (!sendResult) { logDebug("pWrksScript289_subPlatNotification: UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
            else { logDebug("pWrksScript289_subPlatNotification: Sent email notification that application has been recorded to "+emlTo)}
        }
        else
            logDebug("WARNING: There are no emails on file for the contacts.");
    }
    catch(err){
        showMessage = true;
        comment("Error on function pWrksScript289_subPlatNotification(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
        logDebug("Error on function pWrksScript289_subPlatNotification(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("pWrksScript289_subPlatNotification() ended");
}//END pWrksScript289_subPlatNotification()