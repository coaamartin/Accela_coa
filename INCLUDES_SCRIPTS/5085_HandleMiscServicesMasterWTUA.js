// SCRIPTNUMBER: 5085
// SCRIPTFILENAME: 5085_HandleMiscServicesMasterWTUA.js
// PURPOSE: Called when master record has task update
// DATECREATED: 02/11/2019
// BY: amartin
// CHANGELOG: 

logDebug("At start of 5085_HandleMiscServicesMasterWTUA.js");	 
if (wfTask == "Email GIS" && wfStatus == "Email Sent") {
logDebug("5085 sending Email to GIS");	 

		//sendEmailToGIS();
}

function sendEmailToGIS(){
		//generate email notices
		var emailTemplate = "MISC NA MASTER GIS REFERRAL";
		var todayDate = new Date();
		if (emailTemplate != null && emailTemplate != "") {
			eParams = aa.util.newHashtable();
			eParams.put("$$todayDate$$", todayDate);
			eParams.put("$$altid$$",capId.getCustomID());
			eParams.put("$$capAlias$$",cap.getCapType().getAlias());
			if (reportName != null && reportName != "") {
				var rParams = aa.util.newHashtable();
				addParameter(rParams, "prmRecordID", altId);
				addParameter(rParams, "prmReportType", reportType);
				addParameter(rParams, "prmFromDate", "");
				addParameter(rParams, "prmToDate", "");

				logDebug('Attempting to send email with report: ' + emailTemplate + " : " + reportName + " : " + capId.getCustomID());
				//logDebug('Attempting to send email with report: ' + emailTemplate + " : " + reportName + " : " + capId.getCustomID());
				emailContacts(sendEmailToContactTypes, emailTemplate, eParams, reportName, rParams, "Y");
			} else {
				logDebug('Attempting to send email: ' + emailTemplate + " : " + capId.getCustomID());
				//logDebug('Attempting to send email: ' + emailTemplate + " : " + capId.getCustomID());
				emailContacts(sendEmailToContactTypes, emailTemplate, eParams, null, null, "Y");
			}
		}
}
	logDebug("5085_HandleMiscServicesMasterWTUA.js ended.");
