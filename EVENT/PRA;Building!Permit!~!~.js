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
if (!appMatch("Building/Permit/TempSigns/*") && !appMatch("Building/Permit/TempUse/*") &&
    !appMatch("Building/Permit/DonationBin/*")) {
    autoCloseWorkflow();
    script381_UpdatCustomFieldPermitExpirationDates();
}


//Written by rprovinc   
//
//

//*****************************************************************************
//Script PRA;CityClerk!Incident!~!~.js
//Record Types:	CityClerk\Incident\*\* 
//Event: 		PRA
//Desc:			Sending emails to citizen letting them know that there permit was Approved after payment has been recieved.
//
//Created By: Rprovinc
//******************************************************************************
else if (appMatch("Building/Permit/TempSigns/*") && appMatch("Building/Permit/TempUse/*") &&
appMatch("Building/Permit/DonationBin/*")){
logDebug("Starting PRA;Building!Permit!~!~.js ");
//include("5127_CityClerk_PRA.js");
logDebug("Current balance: " + balanceDue);
logDebug("Starting DB approval email and updating statues");
//Check balance and update task
if (balanceDue == 0) {
    updateAppStatus("Approved", "Status updated via script PRA;Building!Permit.js");
    closeTask("Application Close", "Approved", "", "");
    closeAllTasks(capId, "Approved");
    //include("5124_CityClerk_Approval");
    //aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
    //Start to generate the Certificate. This will attach to the record when ran.
    logDebug("Starting to kick off event to attach cert to record");
    if ("Building/Permit/DonationBin/NA".equals(appTypeString)) {
		var altID = capId.getCustomID();
		appType = cap.getCapType().toString();
		var vAsyncScript = "SEND_EMAIL_DB_ASYNC";
		var envParameters = aa.util.newHashMap();
		envParameters.put("altID", altID);
		envParameters.put("capId", capId);
		envParameters.put("cap", cap);
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
		logDebug("Starting to kick off ASYNC event for DB. Params being passed: " + envParameters);
		aa.runAsyncScript(vAsyncScript, envParameters);
	} else if ("Building/Permit/TempUse/NA".equals(appTypeString)) {
		var altID = capId.getCustomID();
		appType = cap.getCapType().toString();
		var vAsyncScript = "SEND_EMAIL_TU_ASYNC";
		var envParameters = aa.util.newHashMap();
		envParameters.put("altID", altID);
		envParameters.put("capId", capId);
		envParameters.put("cap", cap);
		logDebug("Starting to kick off ASYNC event for DB. Params being passed: " + envParameters);
		aa.runAsyncScript(vAsyncScript, envParameters);
	}
}
}
logDebug("End of PPA;Building!Permit!~!~.js ");