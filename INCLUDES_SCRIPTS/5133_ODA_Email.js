appTypeResult = cap.getCapType(); //create CapTypeModel object
appTypeString = appTypeResult.toString();
appTypeArray = appTypeString.split("/");
logDebug("appType: " + appTypeString);

logDebug("Starting 5133_ODA_Email.js");
var vEmailTemplate = "ODA PRE APP SUBMITAL EMAIL # 220";
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
tParams.put("$$altid$$", capId.getCustomID());
tParams.put("$$capAlias$$", capAlias);
tParams.put("$$FirstName$$", firstName);
tParams.put("$$LastName$$", lastName);
logDebug("EmailTo: " + emailTo);
logDebug("Table Parameters: " + tParams);
sendNotification("noreply@auroragov.org", emailTo, emailCC, vEmailTemplate, tParams, null);
logDebug("End of Script 5133_ODA_Email.js");