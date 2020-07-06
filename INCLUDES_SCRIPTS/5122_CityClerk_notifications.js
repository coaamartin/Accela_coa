//Written by rprovinc   
//
//include("5122_CityClerk_notifications.js");

//*****************************************************************************
//Script ASA;CityClerk!~!~!~.js
//Record Types:	CityClerk\Incident\*\* 
//Event: 		ASA
//Desc:			Sending emails to all deparments that need to approve Temp Use/Temp Sign/Donation Bin permits.
//
//Created By: Rprovinc
//******************************************************************************
appTypeResult = cap.getCapType(); //create CapTypeModel object
appTypeString = appTypeResult.toString();
appTypeArray = appTypeString.split("/");
logDebug("appType: " + appTypeString);

if ("CityClerk/Incident/DonationBin/NA".equals(appTypeString)) {
    //Donation Bins code
    logDebug("Starting to send notifications");
    var emailTo = "rprovinc@auroragov.org";
    //var licenseType = "Contractor";
    //var addressType = "Business";
    var vEmailTemplate = "BLD_CLL_LICENSE_ISSUANCE_#111";
    //var vEParams = aa.util.newHashtable();
    //var asiValues = new Array();
    //loadAppSpecific(asiValues);
    //addParameter(vEParams, "", asiValues["Contractor Type"]);
    //Send email to all individuals that need to sign off on Donation Bins
    //emailContacts(contactType, vEmailTemplate, vEParams, "", "", "N", "");
    //sendNotification(contactType, vEmailTemplate, "", "", "", "N", "");
    sendNotification("noreply@auroraco.gov", emailTo, "", vEmailTemplate, null, null);
    logDebug("End of Script 5122_CityClerk_notifications.js");
}

//Temp Use code
else if ("CityClerk/Incident/TempUse/NA".equals(appTypeString)) {
    logDebug("Starting to send notifications");
    var contactType = "Applicant";
    //var licenseType = "Contractor";
    var addressType = "Business";
    var vEmailTemplate = "BLD_CLL_LICENSE_ISSUANCE_#111";
    var vEParams = aa.util.newHashtable();
    var asiValues = new Array();
    loadAppSpecific(asiValues);
    addParameter(vEParams, "", asiValues["Contractor Type"]);
    //Send email to all individuals that need to sign off on TempUse
    emailContacts(contactType, vEmailTemplate, vEParams, "", "", "N", "");
    logDebug("End of Script 5122_CityClerk_notifications.js");
}

//Temp Sign code
else if ("CityClerk/Incident/TempSign/NA".equals(appTypeString)) {
    logDebug("Starting to send notifications");
    var contactType = "Applicant";
    //var licenseType = "Contractor";
    var addressType = "Business";
    var vEmailTemplate = "BLD_CLL_LICENSE_ISSUANCE_#111";
    var vEParams = aa.util.newHashtable();
    var asiValues = new Array();
    loadAppSpecific(asiValues);
    addParameter(vEParams, "", asiValues["Contractor Type"]);
    //Send email to all individuals that need to sign off on TempSign
    emailContacts(contactType, vEmailTemplate, vEParams, "", "", "N", "");
    logDebug("End of Script 5122_CityClerk_notifications.js");
}