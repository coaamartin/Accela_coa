//written by Rprovince
appTypeResult = cap.getCapType(); //create CapTypeModel object
appTypeString = appTypeResult.toString();
appTypeArray = appTypeString.split("/");
logDebug("appType: " + appTypeString);
logDebug("Starting email ODA PreApp agenda");

if (wfTask == "Finalize Agenda" && wfStatus == "Complete")
{
logDebug("Starting 5038_ODAPreApplicationMeetingAgenda.js");
		var altID = capId.getCustomID();
		appType = cap.getCapType().toString();
		var vAsyncScript = "SEND_EMAIL_ODA";
		var recordApplicant = getContactByType("Applicant", capId);
		var recordCC = getContactEmailAddress("Consultant", capId);
		if (recordCC == null) {
		    emailCC = "";
		} else {
		    var emailCC = getContactEmailAddress("Consultant", capId);
		}
		var firstName = recordApplicant.getFirstName();
		var lastName = recordApplicant.getLastName();
		var envParameters = aa.util.newHashMap();
		envParameters.put("altID", altID);
		envParameters.put("capId", capId);
		envParameters.put("cap", cap);
		envParameters.put("appType", appType);
		envParameters.put("recordApplicant", recordApplicant);
		envParameters.put("cap", cap);
		logDebug("Starting to kick off ASYNC event for OTC Final Agenda. Params being passed: " + envParameters);
		aa.runAsyncScript(vAsyncScript, envParameters);
		logDebug("End of 5038_ODAPreApplicationMeetingAgenda.js");
// var vEmailTemplate = "ODA Finalize Agenda #222"; 
// var capAlias = cap.getCapModel().getAppTypeAlias();
// var recordApplicant = getContactByType("Applicant", capId);
// var recordCC = getContactEmailAddress("Consultant", capId);
// if (recordCC == null) {
//     emailCC = "";
// } else {
//     var emailCC = getContactEmailAddress("Consultant", capId);
// }
// var firstName = recordApplicant.getFirstName();
// var lastName = recordApplicant.getLastName();
// var emailTo = recordApplicant.getEmail();
// var today = new Date();
// var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
// var tParams = aa.util.newHashtable();
// tParams.put("$$todayDate$$", thisDate);
// tParams.put("$$altID$$", capId.getCustomID());
// tParams.put("$$capAlias$$", capAlias);
// tParams.put("$$FirstName$$", firstName);
// tParams.put("$$LastName$$", lastName);
// logDebug("EmailTo: " + emailTo);
// logDebug("Table Parameters: " + tParams);
// sendNotification("noreply@auroragov.org", emailTo, emailCC, vEmailTemplate, tParams, null);

}

