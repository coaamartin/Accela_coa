function pWrksScript293_addFeeEmailReadyToPay(){
    logDebug("pWrksScript293_addFeeEmailReadyToPay() started");
    try{
        var $iTrc = ifTracer,
            reviewFee = AInfo["Review Fee?"],
            feeItem = "PW_EAS_01",
            sendEmail = false,
            emailTemplate = "PW READY TO PAY #123",
            applicantEmail = getContactEmailAddress("Applicant", capId);
            
        if($iTrc(reviewFee == "Yes", 'Review Fee')){
            if($iTrc(feeExists(feeItem) && feeExists(feeItem, "INVOICED") && feeBalance(feeItem) > 0, 'fee is invoiced and has balance'))
                sendEmail = true;
            if($iTrc(!feeExists(feeItem) || (feeExists(feeItem) && !feeExists(feeItem, "INVOICED") && feeBalance(feeItem) > 0), 'fee does not exists OR exists but it is not invoiced and has a balance.')){
                updateFee(feeItem, "PW_EASMNT", "FINAL", 1, "Y");
                sendEmail = true;
            }
            
            if($iTrc(sendEmail && applicantEmail, 'sendMail')){
                
                var contactTypes = 'Applicant';
                var acaUrl = lookup("ACA_CONFIGS","OFFICIAL_WEBSITE_URL");
                emailparams = aa.util.newHashtable();
                emailparams.put("$$ContactEmail$$", applicantEmail);
                emailparams.put("$$recordAlias$$", appTypeAlias);
                emailparams.put("$$altID$$", capId.getCustomID());
                emailparams.put("$$acaRecordUrl$$", acaUrl);
                emailparams.put("$$wfComment$$", wfComment == null ? "" : wfComment);
                
                emailContacts(contactTypes, emailTemplate, emailparams, "", "", "N", "");
            }
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on function pWrksScript293_addFeeEmailReadyToPay(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
        logDebug("Error on function pWrksScript293_addFeeEmailReadyToPay(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("pWrksScript293_addFeeEmailReadyToPay() ended");
}//END pWrksScript293_addFeeEmailReadyToPay()