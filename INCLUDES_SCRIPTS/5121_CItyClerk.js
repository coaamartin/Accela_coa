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
//var appTypeString = getAppSpecific("Application Type");
//var appType = getAppSpecific(appType);
// var nonProfit = "";
// var nonProfit = vASIValue;
appTypeResult = cap.getCapType(); //create CapTypeModel object
appTypeString = appTypeResult.toString();
appTypeArray = appTypeString.split("/");
// logDebug("Non Profit: " + nonProfit);
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
//If Tax excempt is yes do the following.
else if ("Yes".equals(vASIValue)) {
    updateAppStatus("Approved", "Status updated via script 5127_CityClerk_PRA.js");
    closeTask("Application Close", "Approved", "", "");
    closeAllTasks(capId, "");
    include("5124_CityClerk_Approval");
    //aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
    //Start to generate the Certificate. This will attach to the record when ran.
    //include("5129_Cert_Attach");
} 
// else if ("Yes".equals(vASIValue) && "Building/Permit/DonationBin/NA".equals(appTypeString)) {
//     updateAppStatus("Approved", "Status updated via script 5127_CityClerk_PRA.js");
//     closeTask("Application Close", "Approved", "", "");
//     closeAllTasks(capId, "");
//     //include("5124_CityClerk_Approval");
//     //aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
//     //Start to generate the Certificate. This will attach to the record when ran.
//     logDebug("Starting to kick off event to attach cert to record");
//     var altID = capId.getCustomID();
//     var appType = cap.getCapType().toString();
//     var vAsyncScript = "RUN_DB_CERT";
//     var envParameters = aa.util.newHashMap();
//     envParameters.put("CapId", altID);
//     envParameters.put("AppType", appType)
//     logDebug("Starting to kick off ASYNC event for DB. Params being passed: " + envParameters);
//     aa.runAsyncScript(vAsyncScript, envParameters);
//     include("5124_CityClerk_Approval");
// } else if ("Yes".equals(vASIValue) && "Building/Permit/TempSigns/NA".equals(appTypeString)) {
//     updateAppStatus("Approved", "Status updated via script 5127_CityClerk_PRA.js");
//     closeTask("Application Close", "Approved", "", "");
//     closeAllTasks(capId, "");
//     //include("5124_CityClerk_Approval");
//     //aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
//     //Start to generate the Certificate. This will attach to the record when ran.
//     logDebug("Starting to kick off event to attach cert to record");
//     var altID = capId.getCustomID();
//     var appType = cap.getCapType().toString();
//     var vAsyncScript = "RUN_TS_CERT";
//     var envParameters = aa.util.newHashMap();
//     envParameters.put("CapId", altID);
//     envParameters.put("AppType", appType)
//     logDebug("Starting to kick off ASYNC eventfor TS. Params being passed: " + envParameters);
//     aa.runAsyncScript(vAsyncScript, envParameters);
//     include("5124_CityClerk_Approval");
// } else if ("Yes".equals(vASIValue) && "Building/Permit/TempUse/NA".equals(appTypeString)) {
//     updateAppStatus("Approved", "Status updated via script 5127_CityClerk_PRA.js");
//     closeTask("Application Close", "Approved", "", "");
//     closeAllTasks(capId, "");
//     include("5124_CityClerk_Approval");
//     wait(10000);
//     //aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
//     //Start to generate the Certificate. This will attach to the record when ran.
//     logDebug("Starting to kick off event to attach cert to record");
//     var capID = capId.getCustomID();
//     var appType = cap.getCapType().toString();
//     var serProvCode = aa.getServiceProviderCode();
//     var vAsyncScript = "RUN_TU_CERT";
//     // var envParameters = aa.util.newHashMap();
//     // envParameters.put("CapId", altID);
//     // envParameters.put("AppType", appType);
//     // envParameters.put("ServProvCode", serProvCode);
//     //logDebug("Starting to kick off ASYNC eventfor Temp Use. Params being passed: " + envParameters);
//     //aa.runAsyncScript(vAsyncScript, envParameters);
//     var module = "Building";
//     var repName = "Temp_Use_Permit_script";
//     reportParameters = aa.util.newHashMap(); 
//     reportParameters.put("RecordID", capID);
//     logDebug("Report Parameters: " + reportParameters);
//     report = null;
//     report = generateReportFile(repName, reportParameters, module);
//     aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
// }

logDebug("End of tax exempt script");
logDebug("End of script 5121_CityClerk.js");

// var altID = capId.getCustomID();
// appType = cap.getCapType().toString();
// var vAsyncScript = "RUN_PERMITS_CERT";
// var envParameters = aa.util.newHashMap();
// envParameters.put("CapId", altID);
// envParameters.put("AppType", appType)
// logDebug("Starting to kick off ASYNC event. Params being passed: " + envParameters);
// aa.runAsyncScript(vAsyncScript, envParameters);