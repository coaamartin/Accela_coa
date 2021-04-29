// if(!publicUser) script220_ApplicationReceivedEmailForPreApp();

logDebug("Starting ASA;ODA!Pre App!NA!NA");
var vEmailTemplate = "ODA PRE APP SUBMITAL EMAIL # 220";
   var capAlias = cap.getCapModel().getAppTypeAlias();
   var recordApplicant = getContactByType("Applicant", capId);
   var recordCC = getContactByType("Consultant", capId);
   if (recordCC == null) {
       recordCC = "";
   }
   var firstName = recordApplicant.getFirstName();
   var lastName = recordApplicant.getLastName();
   var emailTo = recordApplicant.getEmail();
   var emailCC = recordCC.getEmail();
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
   logDebug("End of Script ASA;ODA!Pre App!NA!NA");
