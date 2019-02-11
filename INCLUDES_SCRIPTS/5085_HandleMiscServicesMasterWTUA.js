// SCRIPTNUMBER: 5085
// SCRIPTFILENAME: 5085_HandleMiscServicesMasterWTUA.js
// PURPOSE: Called when master record has task update
// DATECREATED: 02/11/2019
// BY: amartin
// CHANGELOG: 
aa.env.setValue("eventType","Batch Process");
logDebug("At start of 5085_HandleMiscServicesMasterWTUA.js");	 
if (wfTask == "Email GIS" && wfStatus == "Email Sent") {
logDebug("5085 calling Email function");	 

		sendEmailToGIS();
}

function sendEmailToGIS(){
		//generate email notices
		var emailTemplate = "MISC NA MASTER GIS REFERRAL";
		//var emailTemplate = "MISC HOA RENEWAL NOTICE";		
		var todayDate = new Date();
		if (emailTemplate != null && emailTemplate != "") {
			logDebug("5085 sending Email to GIS");	
			eParams = aa.util.newHashtable();
			eParams.put("$$ContactEmail$$", "amartin@auroragov.org");			
			eParams.put("$$todayDate$$", todayDate);
			eParams.put("$$altid$$",capId.getCustomID());
			eParams.put("$$capAlias$$",cap.getCapType().getAlias());
			logDebug('Attempting to send email: ' + emailTemplate + " : " + capId.getCustomID());
			emailContacts("Individual", emailTemplate, eParams, null, null, "Y");
		    emailAsync2("", emailTemplate, eParams);	
			emailAsync("amartin@auroragov.org", emailTemplate, eParams, "", "", "", "");			
		}
		return;
}
	logDebug("5085_HandleMiscServicesMasterWTUA.js ended.");
