//Written by rprovinc   
//
//include("5121_CityClerkWTUA.js");

//*****************************************************************************
//Script WTUA;CityClerk!Incident!~!~.js
//Record Types:	CityClerk\Incident\*\* 
//Event: 		WTUA
//Desc:			Going to update the fee when ever a CityClerk record is open and Non-Profit is set to No.
//
//Created By: Rprovinc

//******************************************************************************
var vASIValue = getAppSpecific("Non-Profit");
appTypeResult = cap.getCapType(); //create CapTypeModel object
appTypeString = appTypeResult.toString();
appTypeArray = appTypeString.split("/");
logDebug("Non-Profit: " + vASIValue);
logDebug("appType: " + appTypeString);
if ("No".equals(vASIValue) && "Building/Permit/DonationBin/NA".equals(appTypeString)) {
    //Donation Bins code
    logDebug("Starting to invoice fee on record.");
    var feecode = "CC_DB";
    var feeschedule = "CC_DB";
    var thefee = "1";
    //feeseqnum =    addFee(feecode, feeschedule, 'FINAL', parseFloat(thefee), 'Y');
    updateFee(feecode, feeschedule, "FINAL", parseFloat(thefee), "Y", "N");

    //Send Notification
    logDebug("Starting to send notifications for fee processing");
    var emailTemplate = "CC_FEE_PAY";
    var capAlias = cap.getCapModel().getAppTypeAlias();
    var recordApplicant = getContactByType("Applicant", capId);
    var firstName = recordApplicant.getFirstName();
    var lastName = recordApplicant.getLastName();
    var emailTo = recordApplicant.getEmail();
    var altId = capId.getCustomID();
    var today = new Date();
    var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
    var tParams = aa.util.newHashtable();
    tParams.put("$$todayDate$$", thisDate);
    tParams.put("$$altid$$", altId);
    tParams.put("$$Record Type$$", "Donation Bin Request");
    tParams.put("$$capAlias$$", capAlias);
    tParams.put("$$FirstName$$", firstName);
    tParams.put("$$LastName$$", lastName);
    logDebug("EmailTo: " + emailTo);
    logDebug("Table Parameters: " + tParams);
    sendNotification("noreply@auroragov.org", emailTo, "", emailTemplate, tParams, null);
    logDebug("End of Script 5121_CityClerk.js");
}
//Temp Use code
else if ("No".equals(vASIValue) && "Building/Permit/TempUse/NA".equals(appTypeString)) {
    logDebug("Starting to invoice fee on record.");
    var feecode = "CC_TU";
    var feeschedule = "CC_TU";
    var thefee = "1";
    //feeseqnum =    addFee(feecode, feeschedule, 'FINAL', parseFloat(thefee), 'Y');
    updateFee(feecode, feeschedule, "FINAL", parseFloat(thefee), "Y", "N");

    //Send Notification for fee processing
    logDebug("Starting to send notifications for fee processing");
    var emailTemplate = "CC_FEE_PAY";
    var capAlias = cap.getCapModel().getAppTypeAlias();
    var altId = capId.getCustomID();
    var recordApplicant = getContactByType("Applicant", capId);
    var firstName = recordApplicant.getFirstName();
    var lastName = recordApplicant.getLastName();
    var emailTo = recordApplicant.getEmail();
    var today = new Date();
    var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
    var tParams = aa.util.newHashtable();
    tParams.put("$$todayDate$$", thisDate);
    tParams.put("$$altid$$", altId);
    tParams.put("$$Record Type$$", "Temp Use Permit");
    tParams.put("$$capAlias$$", capAlias);
    tParams.put("$$FirstName$$", firstName);
    tParams.put("$$LastName$$", lastName);
    logDebug("EmailTo: " + emailTo);
    logDebug("Table Parameters: " + tParams);
    sendNotification("noreply@auroragov.org", emailTo, "", emailTemplate, tParams, null);
    logDebug("End of Script 5121_CityClerk.js");
}

//Temp Sign code
else if ("No".equals(vASIValue) && "Building/Permit/TempSigns/NA".equals(appTypeString)) {
    logDebug("Starting to invoice fee on record.");
    var feecode = "CC_TS";
    var feeschedule = "CC_TS";
    var thefee = "1";
    //feeseqnum =    addFee(feecode, feeschedule, 'FINAL', parseFloat(thefee), 'Y');
    updateFee(feecode, feeschedule, "FINAL", parseFloat(thefee), "Y", "N");

    //Send Notification for fee processing
    logDebug("Starting to send notifications for fee processing");
    var emailTemplate = "CC_FEE_PAY";
    var capAlias = cap.getCapModel().getAppTypeAlias();
    var recordApplicant = getContactByType("Applicant", capId);
    var firstName = recordApplicant.getFirstName();
    var lastName = recordApplicant.getLastName();
    var emailTo = recordApplicant.getEmail();
    var altId = capId.getCustomID();
    var today = new Date();
    var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
    var tParams = aa.util.newHashtable();
    tParams.put("$$todayDate$$", thisDate);
    tParams.put("$$altid$$", altId);
    tParams.put("$$Record Type$$", "Temp Sign Permit");
    tParams.put("$$capAlias$$", capAlias);
    tParams.put("$$FirstName$$", firstName);
    tParams.put("$$LastName$$", lastName);
    logDebug("EmailTo: " + emailTo);
    logDebug("Table Parameters: " + tParams);
    sendNotification("noreply@auroragov.org", emailTo, "", emailTemplate, tParams, null);
    logDebug("End of Script 5121_CityClerk.js");
} 

else if ("Yes".equals(vASIValue)) {
    updateAppStatus("Approved", "Status updated via script 5121_CityClerk.js");
    closeTask("Application Close", "Approved", "", "");
    closeAllTasks(capId, "Approved");
    //include("5124_CityClerk_Approval");
    //aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
    //Start to generate the Certificate. This will attach to the record when ran.
    logDebug("Starting to kick off event to attach cert to record");
    logDebug("Starting to kick off event to attach cert to record");
	if ("Building/Permit/DonationBin/NA".equals(appTypeString)) {
		var altID = capId.getCustomID();
		appType = cap.getCapType().toString();
		var vAsyncScript = "SEND_EMAIL_DB_ASYNC";
		var envParameters = aa.util.newHashMap();
		envParameters.put("altID", altID);
		envParameters.put("capId", capId);
		envParameters.put("cap", cap);
		//envParameters.put("AppType", appType);
		logDebug("Starting to kick off ASYNC event for DB. Params being passed: " + envParameters);
		aa.runAsyncScript(vAsyncScript, envParameters);
	} else if ("Building/Permit/TempSigns/NA".equals(appTypeString)) {
		var altID = capId.getCustomID();
		appType = cap.getCapType().toString();
		var vAsyncScript = "SEND_EMAIL_TS_ASYNC";
		var envParameters = aa.util.newHashMap();
		envParameters.put("altID", altID);
		envParameters.put("capId", capId);
		envParameters.put("cap", cap);
		//envParameters.put("AppType", appType);
		logDebug("Starting to kick off ASYNC event for TS. Params being passed: " + envParameters);
		aa.runAsyncScript(vAsyncScript, envParameters);
	} else if ("Building/Permit/TempUse/NA".equals(appTypeString)) {
		var altID = capId.getCustomID();
		appType = cap.getCapType().toString();
		var vAsyncScript = "SEND_EMAIL_TU_ASYNC";
		var envParameters = aa.util.newHashMap();
		envParameters.put("altID", altID);
		envParameters.put("capId", capId);
		envParameters.put("cap", cap);
		//envParameters.put("AppType", appType);
		logDebug("Starting to kick off ASYNC event for TU. Params being passed: " + envParameters);
		aa.runAsyncScript(vAsyncScript, envParameters);
	}
    
    logDebug("End of tax exempt script");
}
logDebug("End of script 5121_CityClerk.js");
