// SCRIPTFILENAME: 5083_HandleMiscServicesMasterWTUAEmail.js
// PURPOSE: Called when master record has task update
// DATECREATED: 02/27/2020
// BY: swakil
// CHANGELOG: 

logDebug("At start of 5083_HandleMiscServicesMasterWTUAEmail.js");	 

if (wfTask == "Email GIS" && wfStatus == "Email Sent") {
	var files = new Array();
	var emailTemplate = "MISC NA MASTER GIS REFERRAL_INT";		
	var emailAddress = "suhail.wakil@sbztechnology.com";
		
	var eParams = aa.util.newHashtable();
	eParams.put("$$ContactEmail$$", "suhail.wakil@sbztechnology.com");	

	var sent = aa.document.sendEmailByTemplateName("", emailAddress, "", emailTemplate, eParams, files);
	if (!sent.getSuccess())
		logDebug("**ERROR sending email failed, error:" + sent.getErrorMessage());
}

logDebug("5083_HandleMiscServicesMasterWTUAEmail.js ended.");