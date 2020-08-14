// SCRIPTNUMBER: 5110
// SCRIPTFILENAME: 5110_CodeTempSignCTRCA.js
// PURPOSE: Called when a CityClerk Permit record submitted from ACA.  Sends email.
// DATECREATED: 05/23/2019
// BY: amartin
// CHANGELOG: rprovinc 7/24/2020 updated to include all 3 record types for City Clerk. Also updated the email template that is being used for all 3 record types. 

logDebug("---------------------> At start of 5110 CTRCA");

var adResult = aa.address.getPrimaryAddressByCapID(capId, "Y");
addressLine = adResult.getOutput().getAddressModel();
logDebug("---------------------> addressLine " + addressLine);

editAppName(addressLine, capId);

logDebug("---------------------> Preparing to send email. ");

//I cannot get the async to work so using non-async by forcing env variable.
aa.env.setValue("eventType", "Batch Process");


//Send email
//Donation Bin
if ("CityClerk/Incident/DonationBin/NA".equals(appTypeString)) {
    var emailTemplate = "TEMP SIGN SUBMIT APPLICANT";
    var todayDate = new Date();
    //var signType = AInfo["Type of Sign"];
    var emailTo1 = recordApplicant.getEmail();
    var signAddress = AInfo["Address where proposed sign will be displayed"];
    if (emailTemplate != null && emailTemplate != "") {
        logDebug("5110 sending DONATION BIN  APPLICANT.  Defaulting to contact Applicant.");
        eParams = aa.util.newHashtable();
        eParams.put("$$ContactEmail$$", recordApplicant.getEmail());
        eParams.put("$$todayDate$$", todayDate);
        eParams.put("$$altid$$", capId.getCustomID());
        eParams.put("$$capAlias$$", cap.getCapType().getAlias());
        //eParams.put("$$signType$$",signType);	
        eParams.put("$$signAddress$$", signAddress);
        logDebug('Attempting to send email: ' + emailTemplate + " : " + capId.getCustomID());
        sendNotification("noreply@auroraco.gov", emailTo1, "", EmailTemplate, eParams, null);
    }
    logDebug("Starting to send notifications");
    //var emailTo = "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org;jjking@auroragov.org";
    var emailTo = "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org";
    var vEmailTemplate = "CC READY FOR REVIEW";
    var capAlias = cap.getCapModel().getAppTypeAlias();
    var recordApplicant = getContactByType("Applicant", capId);
    var firstName = recordApplicant.getFirstName();
    var lastName = recordApplicant.getLastName();
    var today = new Date();
    var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
    var altId = capId.getCustomID();
    logDebug("Testing to see if I get a temp record id before a new if statement. This is before. Altid: " + altId);
    if (recordApplicant != null) {
        var tParams = aa.util.newHashtable();
        tParams.put("$$todayDate$$", thisDate);
        tParams.put("$$altid$$", altId);
        tParams.put("$$Record Type$$", "Donation Bin");
        tParams.put("$$capAlias$$", capAlias);
        tParams.put("$$FirstName$$", firstName);
        tParams.put("$$LastName$$", lastName);
        logDebug("EmailTo: " + emailTo);
        logDebug("Table Parameters: " + tParams);
        sendNotification("noreply@auroraco.gov", emailTo, "", vEmailTemplate, tParams, null);
        logDebug("End of Script 5122_CityClerk_notifications.js");
    } else if (recordApplicant == null) {
        logDebug("Email could not be sent as there is no Applicant email address.")
    }
}


//Temp Use
else if ("CityClerk/Incident/TempUse/NA".equals(appTypeString)) {
    //Use these groups when in production to populate ContactEmail.  Use a comma separator: tup_zoning@auroragov.org,tup_citymanager@auroragov.org,tup_publicworks@auroragov.org,tup_risk@auroragov.org,tup_neighborhood@auroragov.org
    var emailTemplate = "TEMP SIGN SUBMIT REVIEWERS";
    var todayDate = new Date();
    var signType = AInfo["Type of Sign"];
    var signAddress = AInfo["Address where proposed sign will be displayed"];
    var emailTo1 = recordApplicant.getEmail();
    if (emailTemplate != null && emailTemplate != "") {
        logDebug("5110 sending TEMP USE SUBMIT REVIEWERS.  Sending to several email groups.");
        eParams = aa.util.newHashtable();
        eParams.put("$$ContactEmail$$", recordApplicant.getEmail());
        eParams.put("$$todayDate$$", todayDate);
        eParams.put("$$altid$$", capId.getCustomID());
        eParams.put("$$capAlias$$", cap.getCapType().getAlias());
        eParams.put("$$signType$$", signType);
        eParams.put("$$signAddress$$", signAddress);
        logDebug('Attempting to send email: ' + emailTemplate + " : " + capId.getCustomID());
        sendNotification("noreply@auroraco.gov", emailTo1, "", EmailTemplate, eParams, null);
    }
    logDebug("Starting to send notifications");
    //var emailTo = "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org;JNAPPER@auroragov.org";
    var emailTo = "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org";
    var vEmailTemplate = "CC READY FOR REVIEW";
    var capAlias = cap.getCapModel().getAppTypeAlias();
    var recordApplicant = getContactByType("Applicant", capId);
    var firstName = recordApplicant.getFirstName();
    var lastName = recordApplicant.getLastName();
    var today = new Date();
    var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
    var altId = capId.getCustomID();
    logDebug("Testing to see if I get a temp record id before a new if statement. This is before. Altid: " + altId);
    if (recordApplicant != null) {
        var tParams = aa.util.newHashtable();
        tParams.put("$$todayDate$$", thisDate);
        tParams.put("$$altid$$", altId);
        tParams.put("$$Record Type$$", "Temp Use Permit");
        tParams.put("$$capAlias$$", capAlias);
        tParams.put("$$FirstName$$", firstName);
        tParams.put("$$LastName$$", lastName);
        logDebug("EmailTo: " + emailTo);
        logDebug("Table Parameters: " + tParams);
        sendNotification("noreply@auroraco.gov", emailTo, "", vEmailTemplate, tParams, null);
        logDebug("End of Script 5122_CityClerk_notifications.js");
    } else if (recordApplicant == null) {
        logDebug("Email could not be sent as there is no Applicant email address.")
    }
}


//Temp Sign
else if ("CityClerk/Incident/TempSign/NA".equals(appTypeString)) {
    //Use these groups when in production to populate ContactEmail.  Use a comma separator: tup_zoning@auroragov.org,tup_citymanager@auroragov.org,tup_publicworks@auroragov.org,tup_risk@auroragov.org,tup_neighborhood@auroragov.org
    var emailTemplate = "TEMP SIGN SUBMIT APPLICANT";
    var todayDate = new Date();
    var emailTo1 = recordApplicant.getEmail();
    //var signType = AInfo["Type of Sign"];
    var signAddress = AInfo["Address where proposed sign will be displayed"];
    if (emailTemplate != null && emailTemplate != "") {
        logDebug("5110 sending TEMP SIGN SUBMIT REVIEWERS.  Sending to several email groups.");
        eParams = aa.util.newHashtable();
        eParams.put("$$ContactEmail$$", emailTo1);
        eParams.put("$$todayDate$$", todayDate);
        eParams.put("$$altid$$", capId.getCustomID());
        eParams.put("$$capAlias$$", cap.getCapType().getAlias());
        //eParams.put("$$signType$$",signType);	
        eParams.put("$$signAddress$$", signAddress);
        logDebug('Attempting to send email: ' + emailTemplate + " : " + capId.getCustomID());
        sendNotification("noreply@auroraco.gov", emailTo1, "", EmailTemplate, eParams, null);
    }
    logDebug("Starting to send notifications");
    //var emailTo = "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org;jjking@auroragov.org";
    var emailTo = "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org";
    var vEmailTemplate = "CC READY FOR REVIEW";
    var capAlias = cap.getCapModel().getAppTypeAlias();
    var recordApplicant = getContactByType("Applicant", capId);
    var firstName = recordApplicant.getFirstName();
    var lastName = recordApplicant.getLastName();
    var today = new Date();
    var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
    var altId = capId.getCustomID();
    logDebug("Testing to see if I get a temp record id before a new if statement. This is before. Altid: " + altId);
    if (recordApplicant != null) {
        var tParams = aa.util.newHashtable();
        tParams.put("$$todayDate$$", thisDate);
        tParams.put("$$altid$$", altId);
        tParams.put("$$Record Type$$", "Temp Sign Permit");
        tParams.put("$$capAlias$$", capAlias);
        tParams.put("$$FirstName$$", firstName);
        tParams.put("$$LastName$$", lastName);
        logDebug("EmailTo: " + emailTo);
        logDebug("Table Parameters: " + tParams);
        sendNotification("noreply@auroraco.gov", emailTo, "", vEmailTemplate, tParams, null);
        logDebug("End of Script 5122_CityClerk_notifications.js");
    } else if (recordApplicant == null) {
        logDebug("Email could not be sent as there is no Applicant email address.")
    }
}


logDebug("---------------------> At end of 5110 CTRCA");
aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);