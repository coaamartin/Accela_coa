function pWrksScript180_emailPermit(){
    logDebug("pWrksScript180_emailPermit() started");
    try{
        var emailTemplate = "PW PI ISSUED # 180";
		var reportTemplate = "PW_Public_Improvement_Permit";
        var emailParams = aa.util.newHashtable();
		var reportParams = aa.util.newHashtable();
        var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
        acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
        var recordURL = getACARecordURL(acaURLDefault);
        var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
        var reportFile = [];
        var emlTo = getContactEmailAddress("Applicant", capId);
        
        addParameter(emailParams, "$$altID$$", capIDString);
		//addParameter(emailParams, "$$acaDocDownloadURL$$", reportTemplate);
        addParameter(emailParams, "$$acaRecordUrl$$", recordURL);
		
		addParameter(reportParams, "RecordID", capIDString);
        
        if(emlTo)
			emailContacts("Applicant", emailTemplate, emailParams, reportTemplate, reportParams);
    }
    catch(err){
        showMessage = true;
        comment("Error on function pWrksScript180_emailPermit(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
        logDebug("Error on function pWrksScript180_emailPermit(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("pWrksScript180_emailPermit() ended");
}//END pWrksScript180_emailPermit()