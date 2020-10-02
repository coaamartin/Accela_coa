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
    if ("No".equals(vASIValue) && "CityClerk/Incident/DonationBin/NA".equals(appTypeString)) {
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
    else if ("No".equals(vASIValue) && "CityClerk/Incident/TempUse/NA".equals(appTypeString)) {
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
    else if ("No".equals(vASIValue) && "CityClerk/Incident/TempSign/NA".equals(appTypeString)) {
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