logDebug("Starting PPA;Building!Permit!~!~.js ");
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
	//aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
	//Start to generate the Certificate. This will attach to the record when ran.
	logDebug("Starting to kick off event to attach cert to record");
	altId = capId.getCustomID();
	appType = cap.getCapType().toString();
	var vAsyncScript = "RUN_PERMITS_CERT";
	var envParameters = aa.util.newHashMap();
	envParameters.put("CapId", altId);
	envParameters.put("AppType", appType)
	logDebug("Starting to kick off ASYNC event. Params being passed: " + envParameters);
	aa.runAsyncScript(vAsyncScript, envParameters);
}
logDebug("End of PPA;CityClerk!Incident!~!~.js ");