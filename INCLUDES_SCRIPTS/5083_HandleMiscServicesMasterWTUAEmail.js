// SCRIPTFILENAME: 5083_HandleMiscServicesMasterWTUAEmail.js
// PURPOSE: Called when master record has task update
// DATECREATED: 02/27/2020
// BY: swakil
// CHANGELOG: 


if (wfTask == "Review Application" && wfStatus == "Complete") {
	var rB1ExpResult = aa.expiration.getLicensesByCapID(capId).getOutput();
	rB1ExpResult.setExpStatus("Active");	
	aa.expiration.editB1Expiration(rB1ExpResult.getB1Expiration());	
	updateAppStatus("Active", "Script 5083");	
	logDebug("Updated renewal status to Active and app status to Active.");	
}

if (wfTask == "Email GIS" && wfStatus == "Email Sent") {
	var files = new Array();
	var emailTemplate = "MISC NA MASTER GIS REFERRAL_INT";		
	var emailAddress = = lookup("Neighborhood Association Master GIS", "EMAIL_ADDR");
		
	var eParams = aa.util.newHashtable();
	eParams.put("$$ContactEmail$$", "suhail.wakil@sbztechnology.com");	
	eParams.put("$$gis1$$", AInfo["What is the south boundary street?"]);	
	eParams.put("$$gis2$$", AInfo["What is the north boundary street?"]);	
	eParams.put("$$gis3$$", AInfo["What is the east boundary?"]);	
	eParams.put("$$gis4$$", AInfo["What is the west boundary?"]);	

	var sent = aa.document.sendEmailByTemplateName("", emailAddress, "", emailTemplate, eParams, files);
	if (!sent.getSuccess())
		logDebug("**ERROR sending email failed, error:" + sent.getErrorMessage());
}

logDebug("5083_HandleMiscServicesMasterWTUAEmail.js ended.");