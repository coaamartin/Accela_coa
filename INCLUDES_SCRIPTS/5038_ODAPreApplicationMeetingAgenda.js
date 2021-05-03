//written by JMAIN

logDebug("Starting email ODA PreApp agenda");
if (wfTask == "Finalize Agenda" && wfStatus == "Complete")
{
	// //need to get an ODA distro group - use emailAsync for this one
	// var emailtemplate = "JD_TEST_TEMPLATE";
	// var distroemail = "odapreappteam@auroragov.org";
	// var joke = "This will eventually be a real Email template - for now, just pretend.";
	// var emailparams = aa.util.newHashtable();
	// emailparams.put("$$Joke$$", joke);
	// emailparams.put("$$wfComment$$", wfComment + "");
	
	// //need to get the ODA Agenda Report
	// var reportname = "JD_TEST_REPORT";
	// var reportparams = aa.util.newHashtable();
	// reportparams.put("DEPARTMENT", "Administrator");
	
	// emailAsync(distroemail, emailtemplate, emailparams, reportname, reportparams, "", "");
	// logDebug("Called emailAsync...");
appTypeResult = cap.getCapType(); //create CapTypeModel object
appTypeString = appTypeResult.toString();
appTypeArray = appTypeString.split("/");
logDebug("appType: " + appTypeString);

logDebug("Starting 5038_ODAPreApplicationMeetingAgenda.js");
var vEmailTemplate = "ODA Finalize Agenda #222"; 
var capAlias = cap.getCapModel().getAppTypeAlias();
var recordApplicant = getContactByType("Applicant", capId);
var recordCC = getContactEmailAddress("Consultant", capId);
if (recordCC == null) {
    emailCC = "";
} else {
    var emailCC = getContactEmailAddress("Consultant", capId);
}
var firstName = recordApplicant.getFirstName();
var lastName = recordApplicant.getLastName();
var emailTo = recordApplicant.getEmail();
var today = new Date();
var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
var tParams = aa.util.newHashtable();
tParams.put("$$todayDate$$", thisDate);
tParams.put("$$altID$$", capId.getCustomID());
tParams.put("$$capAlias$$", capAlias);
tParams.put("$$FirstName$$", firstName);
tParams.put("$$LastName$$", lastName);
logDebug("EmailTo: " + emailTo);
logDebug("Table Parameters: " + tParams);
sendNotification("noreply@auroragov.org", emailTo, emailCC, vEmailTemplate, tParams, null);
logDebug("End of 5038_ODAPreApplicationMeetingAgenda.js");
}

