// SCRIPTNUMBER: 5119
// SCRIPTFILENAME: 5119_Send_HOA_Renewal.js
// PURPOSE: Called when NA Renewal record has review task updated to complete.  Communication will send out.
// DATECREATED: 03/23/2020
// BY: rprovinc
// CHANGELOG: 03/23/2020: created

function sendNotification(emailFrom,emailTo,emailCC,templateName,params,reportFile)
{
  var itemCap = capId;
  if (arguments.length == 7) itemCap = arguments[6]; // use cap ID specified in args

  var id1 = itemCap.ID1;
  var id2 = itemCap.ID2;
  var id3 = itemCap.ID3;

  var capIDScriptModel = aa.cap.createCapIDScriptModel(id1, id2, id3);

  var result = null;
  result = aa.document.sendEmailAndSaveAsDocument(emailFrom, emailTo, emailCC, templateName, params, capIDScriptModel, reportFile);
  if(result.getSuccess())
  {
    logDebug("Sent email successfully!");
    return true;
  }
  else
  {
    logDebug("Failed to send mail. - " + result.getErrorType());
    return false;
  }
}

logDebug("End of email renewal in 5082_HandleMiscServicesNARenewal");



// logDebug("At start of 5119");	 
// if (wfTask == "Review Application" && wfStatus == "Complete") {
// logDebug("Starting email communication");	 

// 	// send the email
// 	sendEmailForRenew();	
	
// }

// function sendEmailForRenew() {
// 	var envParameters = aa.util.newHashMap();
// 	envParameters.put("capId", capId);
// 	envParameters.put("cap", cap);
// 	envParameters.put("AGENCYID", "AURORACO");
// 	var vAsyncScript = "SEND_HOA_RENEW_EMAIL";
// 	aa.runAsyncScript(vAsyncScript, envParameters)
// 	logDebug("CapID info: " + envParameters);
// 	logDebug("End of email renewal in 5082_HandleMiscServicesNARenewal");
// }