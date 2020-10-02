// SCRIPTFILENAME: 5083_HandleAssoServicesMasterWTUAEmail.js
// PURPOSE: Called when master record has task update
// DATECREATED: 02/27/2020
// BY: swakil
// CHANGELOG: 

/*
if (wfTask == "Review Application" && wfStatus == "Complete") {
	var rB1ExpResult = aa.expiration.getLicensesByCapID(capId).getOutput();
	rB1ExpResult.setExpStatus("Active");	
	aa.expiration.editB1Expiration(rB1ExpResult.getB1Expiration());	
	updateAppStatus("Active", "Script 5083");	
	logDebug("Updated renewal status to Active and app status to Active.");	
}
*/

/*
if (wfTask == "Email GIS" && wfStatus == "Send Email") {
	var files = new Array();
	var emailTemplate = "MISC NA MASTER GIS REFERRAL_INT";		
	var emailAddress = lookup("Neighborhood Association Master GIS", "EMAIL_ADDR");
		
	var eParams = aa.util.newHashtable();
	eParams.put("$$ContactEmail$$", emailAddress);	
	eParams.put("$$gis1$$", AInfo["North Boundary"]);	
	eParams.put("$$gis3$$", AInfo["East Boundary"]);	
	eParams.put("$$gis2$$", AInfo["South Boundary"]);	
	eParams.put("$$gis4$$", AInfo["West Boundary"]);	
  eParams.put("$$HOANAME$$", AInfo["Name of HOA"]);
  eParams.put("$$HOANUMBER$$", AInfo["Neighborhood Group Number"]);

	sendNotification("", emailAddress, "", emailTemplate, eParams, null);

}
*/
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

logDebug("5083_HandleAssoServicesMasterWTUAEmail.js ended.");