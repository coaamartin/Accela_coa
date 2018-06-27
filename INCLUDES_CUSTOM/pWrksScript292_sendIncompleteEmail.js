//Script 292
function pWrksScript292_sendIncompleteEmail(){
    logDebug("pWrksScript292_sendIncompleteEmail() started");
    try{
        var emailTemplate = "PW EA INCOMPLETE COMPLETENESS CHECK # 292";
        var applicantEmail = getContactEmailAddress("Applicant", capId);
        var permitFile = "";
        
        if(applicantEmail){
            var emailParams = aa.util.newHashtable();
            var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
            acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
            var recordURL = getACARecordURL(acaURLDefault);
            var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
            var reportFile = [];
            var emlTo = applicantEmail;
            
            addParameter(emailParams, "$$altID$$", capIDString);
            addParameter(emailParams, "$$acaRecordUrl$$", recordURL);
			addParameter(emailParams, "$$wfComment$$", wfComment == null ? "" : wfComment);
            
            var sendResult = sendNotification("noreply@aurora.gov",emlTo,"",emailTemplate,emailParams,reportFile,capID4Email);
            if (!sendResult) { logDebug("pWrksScript292_sendIncompleteEmail: UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
            else { logDebug("pWrksScript292_sendIncompleteEmail: Sent email notification that work order is complete to "+emlTo)}
        }
        else
            logDebug("WARNING: No applicant email on the record.");
    }
    catch(err){
        showMessage = true;
        comment("Error on function pWrksScript292_sendIncompleteEmail(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
        logDebug("Error on function pWrksScript292_sendIncompleteEmail(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("pWrksScript292_sendIncompleteEmail() ended");
}//END pWrksScript292_sendIncompleteEmail();