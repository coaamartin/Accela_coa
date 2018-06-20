function pWrksScript303_reqOwnerSigEmail(){
    logDebug("pWrksScript303_reqOwnerSigEmail() started");
    try{
        var $iTrc = ifTracer,
            emailTemplate = "",
			ownerEmail = getPrimaryOwnerEmail();
		
            
        if($iTrc(ownerEmail, 'ownerEmail')){
            var contactTypes = 'Owner';
            var acaUrl = lookup("ACA_CONFIGS","OFFICIAL_WEBSITE_URL");
            emailparams = aa.util.newHashtable();
            emailparams.put("$$ContactEmail$$", applicantEmail);
            emailparams.put("$$recordAlias$$", appTypeAlias);
            emailparams.put("$$altID$$", capId.getCustomID());
            emailparams.put("$$acaRecordUrl$$", acaUrl);
            //emailparams.put("$$wfComment$$", wfComment == null ? "" : wfComment);
            
            //emailContacts(contactTypes, emailTemplate, emailparams, "", "", "N", "");
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on function pWrksScript303_reqOwnerSigEmail(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
        logDebug("Error on function pWrksScript303_reqOwnerSigEmail(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("pWrksScript303_reqOwnerSigEmail() ended");
}//END pWrksScript303_reqOwnerSigEmail()