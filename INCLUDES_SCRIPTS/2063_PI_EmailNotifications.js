if ((wfStatus == 'Resubmittal Requested') && appMatch('Public Works/Public Improvement/Permit/NA')) {
logDebug("Starting Resubmittal Requested Email script, 2063_PI_EMAILNOTIFICATIONS");
	var contactArray = getContactArray();
		for(ca in contactArray) {
			if(contactArray[ca]["contactType"] == "Applicant"){
				thisContact = contactArray[ca];	
				emailTo	= thisContact["email"];
			}
		}
	logDebug("Email is: " +emailTo);
	if (emailTo != "" && emailTo !=null){
		var capAlias = cap.getCapModel().getAppTypeAlias();
		var today = new Date();
		var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
		var tParams = aa.util.newHashtable();
		getACARecordParam4Notification(tParams,acaUrl)
		logDebug("TESTING ACA SITE " +acaUrl)
		tParams.put("$$todayDate$$", thisDate);
		tParams.put("$$altID$$", capId.getCustomID());
		tParams.put("$$capAlias$$", capAlias);
		addParameter(tParams, "$$wfComment$$", wfComment);
		var emailtemplate = "PI RESUBMITTAL REQUESTED # 382";
		sendNotification("noreply@auroraco.gov", emailTo, "", emailtemplate, tParams, null);
	}
logDebug("End of 2063_PI_EMAILNOTIFICATIONS script");
}

