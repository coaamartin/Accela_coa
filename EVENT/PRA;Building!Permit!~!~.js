/*
Title : Auto Close Building Workflow (PaymentReceiveAfter) 

Purpose : check Balance, Update WfTasks and AppStatus

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	autoCloseWorkflow();
	
Notes:
	- in specs: records with 2nd level='Permits', correct name is 'Permit'
	- for record "Building/Permit/Plans/NA" Task name is 'Special Inspection Check' not 'Special Inspection'
*/
if(!appMatch("Building/Permit/TempSigns/*")&& !appMatch("Building/Permit/TempUse/*")
&& !appMatch("Building/Permit/DonationBin/*"))
{
autoCloseWorkflow();
script381_UpdatCustomFieldPermitExpirationDates();
}


//Written by rprovinc   
//
//include("5127_CityClerk_PRA.js");

//*****************************************************************************
//Script PRA;CityClerk!Incident!~!~.js
//Record Types:	CityClerk\Incident\*\* 
//Event: 		PRA
//Desc:			Sending emails to citizen letting them know that there permit was Approved after payment has been recieved.
//
//Created By: Rprovinc
//******************************************************************************

logDebug("Starting PPA;Building!~!~!~.js ");
logDebug("Starting 5127_CityClerk_PRA.js");
//include("5127_CityClerk_PRA.js");
logDebug("Current balance: " + balanceDue);
logDebug("Starting DB approval email and updating statues");
//Check balance and update task
if (balanceDue == 0) {
    updateAppStatus("Approved", "Status updated via script 5127_CityClerk_PRA.js");
    //updateTask("Application Close", "Approved", "Updated via script 5127_CityClerk_PRA.js");
    closeTask("Application Close", "Approved", "", "");
    closeAllTasks(capId, "");
    include("5124_CityClerk_Approval");
    logDebug("End of 5127_CityClerk_PRA script");
    logDebug("---------------------> 5127_CityClerk_PRA.js ended.");
    aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
//Start to generate the Certificate. This will attach to the record when ran.
    logDebug("Starting to kick off ASYNC event to attach cert to record");
    //var vEmailTemplate = "FT ARBORIST LICENSE ISSUANCE #146";
    var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
    var vEParams = aa.util.newHashtable();
    var altID = capId.getCustomID();
    vExpDate = new Date();
// All licenses expire on 12/31, if after march assume next year
	vNewExpDate = new Date(vExpDate.getFullYear() + (vExpDate.getMonth > 2 ? 1 : 0), 11, 31);
    addParameter(vEParams, "$$LicenseType$$", "Arborist Contractor License");
    addParameter(vEParams, "$$ExpirationDate$$", dateAdd(vNewExpDate, 0));
    //addParameter(vEParams, "$$ApplicationID$$", vLicenseID.getCustomID());
    addParameter(vEParams, "$$ApplicationID$$", altID);
    addParameter(vEParams, "$$altID$$", altID);
    addParameter(vEParams, "$$acaURL$$", acaSite);
    logDebug("Eparams for async envent" + vEParams);
    //emailContacts("All", vEmailTemplate, vEParams, "", "");
    var vAsyncScript = "RUN_ARBORIST_LICENSE_REPORT";
    var envParameters = aa.util.newHashMap();
    envParameters.put("CapId", altID);
    aa.runAsyncScript(vAsyncScript, envParameters);
}
logDebug("End of PPA;Building!Incident!~!~.js ");