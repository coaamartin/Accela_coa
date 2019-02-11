// SCRIPTNUMBER: 5084
// SCRIPTFILENAME: WTUA;MiscServices!Neighborhood!Association!Master.js
// PURPOSE: The event called by Accela when a Master task update is taking place.
// DATECREATED: 02/11/2019
// BY: amartin
// CHANGELOG: 
logDebug("Calling 5085 script");
include("5085_HandleMiscServicesMasterWTUA");

		var emailTemplate = "MISC NA MASTER GIS REFERRAL";
		var todayDate = new Date();
		if (emailTemplate != null && emailTemplate != "") {
			logDebug("5085 sending Email to GIS");	
			eParams = aa.util.newHashtable();
			eParams.put("$$ContactEmail$$", "amartin@auroragov.org");			
			eParams.put("$$todayDate$$", todayDate);
			eParams.put("$$altid$$",capId.getCustomID());
			eParams.put("$$capAlias$$",cap.getCapType().getAlias());
			logDebug('Attempting to send email: ' + emailTemplate + " : " + capId.getCustomID());
			//emailContacts("Individual", emailTemplate, eParams, null, null, "Y");
		    emailAsync2("", emailTemplate, eParams);	
			emailAsync("amartin@auroragov.org", emailTemplate, eParams, "", "", "", "");			
		}