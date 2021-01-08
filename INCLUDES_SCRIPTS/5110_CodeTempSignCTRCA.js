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

checkACARun();

function checkACARun() {
    var altId = capId;
    var altId2 = capId.getCustomID();
    logDebug("altId: " + altId);
    logDebug("altId2: " + altId2);
    var altIdString = String(altId);
    var altIdString2 = String(altId2);
    var tempCheck = altIdString.indexOf("TMP");
    var tempCheck2 = altIdString2.indexOf("TMP");
    logDebug("TempCheck: " + tempCheck);
    logDebug("TempCheck: " + tempCheck2);
    if (tempCheck2 > 1) {
        logDebug("Temp check came back with: " + tempCheck);
        logDebug("altId: " + altId);
        logDebug("altId2: " + altId2);
    } else {
        logDebug("Going to have 5110 script tirgger.")
        //Send email
        //Donation Bin
        if ("Building/Permit/DonationBin/NA".equals(appTypeString)) {
            // var emailTemplate = "TEMP SIGN SUBMIT APPLICANT";
            // var todayDate = new Date();
            // var altId = capId.getCustomID();
            // //var signType = AInfo["Type of Sign"];
            // var signAddress = AInfo["Address where proposed sign will be displayed"];
            // if (emailTemplate != null && emailTemplate != "") {
            //     logDebug("5110 sending DONATION BIN  APPLICANT.  Defaulting to contact Applicant.");
            //     eParams = aa.util.newHashtable();
            //     eParams.put("$$ContactEmail$$", "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org");
            //     eParams.put("$$todayDate$$", todayDate);
            //     eParams.put("$$altid$$", altId);
            //     eParams.put("$$capAlias$$", cap.getCapType().getAlias());
            //     //eParams.put("$$signType$$",signType);	
            //     eParams.put("$$signAddress$$", signAddress);
            //     logDebug('Attempting to send email: ' + emailTemplate + " : " + altId);
            //     emailContacts("Applicant", emailTemplate, eParams, null, null, "Y");
            // }
            logDebug("Starting to send notifications");
            //var emailTo = "esango@auroragov.org;gtaets@auroragov.org;jjking@auroragov.org;tvaughn@auroragov.org;dosoba@auroragov.org;wbarrett@auroragov.org;dhclark@auroragov.org;rpettina@auroragov.org";
            //var emailTo = "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org";
            var emailTo = "DB_Reviewers@auroragov.org";
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
                sendNotification("noreply@auroragov.org", emailTo, "", vEmailTemplate, tParams, null);
                logDebug("End of Script 5110_CityClerk_notifications.js");
            } else if (recordApplicant == null) {
                logDebug("Email could not be sent as there is no Applicant email address.")
            }
        }


        //Temp Use
        else if ("Building/Permit/TempUse/NA".equals(appTypeString)) {
            //Use these groups when in production to populate ContactEmail.  Use a comma separator: tup_zoning@auroragov.org,tup_citymanager@auroragov.org,tup_publicworks@auroragov.org,tup_risk@auroragov.org,tup_neighborhood@auroragov.org
            // var emailTemplate = "TEMP SIGN SUBMIT APPLICANT";
            // var todayDate = new Date();
            // var altId = capId.getCustomID();
            // var signType = AInfo["Type of Sign"];
            // var signAddress = AInfo["Address where proposed sign will be displayed"];
            // if (emailTemplate != null && emailTemplate != "") {
            //     logDebug("5110 sending TEMP USE SUBMIT REVIEWERS.  Sending to several email groups.");
            //     eParams = aa.util.newHashtable();
            //     eParams.put("$$ContactEmail$$", "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org");
            //     eParams.put("$$todayDate$$", todayDate);
            //     eParams.put("$$altid$$", altId);
            //     eParams.put("$$capAlias$$", cap.getCapType().getAlias());
            //     eParams.put("$$signType$$", signType);
            //     eParams.put("$$signAddress$$", signAddress);
            //     logDebug('Attempting to send email: ' + emailTemplate + " : " + altId);
            //     emailContacts("Applicant", emailTemplate, eParams, null, null, "Y");
            // }
            logDebug("Starting to send notifications");
            //var emailTo = "esango@auroragov.org;gtaets@auroragov.org;jjking@auroragov.org;tvaughn@auroragov.org;dosoba@auroragov.org;wbarrett@auroragov.org;dhclark@auroragov.org;rpettina@auroragov.org;rwittman@auroragov.org;rmoody@auroragov.org;SMCGHEE@auroragov.org;ccerinic@auroragov.org;mhanifin@auroragov.org";
            //var emailTo = "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org";
            var emailTo = "TUP_Reviewers@auroragov.org";
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
                sendNotification("noreply@auroragov.org", emailTo, "", vEmailTemplate, tParams, null);
                logDebug("End of Script 5110_CityClerk_notifications.js");
            } else if (recordApplicant == null) {
                logDebug("Email could not be sent as there is no Applicant email address.")
            }
        }


        //Temp Sign
        else if ("Building/Permit/TempSigns/NA".equals(appTypeString)) {
            //Use these groups when in production to populate ContactEmail.  Use a comma separator: tup_zoning@auroragov.org,tup_citymanager@auroragov.org,tup_publicworks@auroragov.org,tup_risk@auroragov.org,tup_neighborhood@auroragov.org
            // var emailTemplate = "TEMP SIGN SUBMIT APPLICANT";
            // var todayDate = new Date();
            // var altId = capId.getCustomID();
            // //var signType = AInfo["Type of Sign"];
            // var signAddress = AInfo["Address where proposed sign will be displayed"];
            // if (emailTemplate != null && emailTemplate != "") {
            //     logDebug("5110 sending TEMP SIGN SUBMIT REVIEWERS.  Sending to several email groups.");
            //     eParams = aa.util.newHashtable();
            //     eParams.put("$$ContactEmail$$", "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org");
            //     eParams.put("$$todayDate$$", todayDate);
            //     eParams.put("$$altid$$", altId);
            //     eParams.put("$$capAlias$$", cap.getCapType().getAlias());
            //     //eParams.put("$$signType$$",signType);	
            //     eParams.put("$$signAddress$$", signAddress);
            //     logDebug('Attempting to send email: ' + emailTemplate + " : " + altId);
            //     emailContacts("Applicant", emailTemplate, eParams, null, null, "Y");
            // }
            logDebug("Starting to send notifications");
            //var emailTo = "esango@auroragov.org;gtaets@auroragov.org;jjking@auroragov.org;tvaughn@auroragov.org;dosoba@auroragov.org;wbarrett@auroragov.org;dhclark@auroragov.org;rpettina@auroragov.org";
            //var emailTo = "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org";
            var emailTo = "TSP_Reviewers@auroragov.org";
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
                sendNotification("noreply@auroragov.org", emailTo, "", vEmailTemplate, tParams, null);
                logDebug("End of Script 5110_CityClerk_notifications.js");
            } else if (recordApplicant == null) {
                logDebug("Email could not be sent as there is no Applicant email address.")
            }
        }
    }
}



logDebug("---------------------> At end of 5110 CTRCA");
//aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);