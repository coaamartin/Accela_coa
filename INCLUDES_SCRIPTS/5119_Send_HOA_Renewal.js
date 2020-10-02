// SCRIPTNUMBER: 5119
// SCRIPTFILENAME: 5119_Send_HOA_Renewal.js
// PURPOSE: Called when NA Renewal record has review task updated to complete.  Communication will send out.
// DATECREATED: 03/23/2020
// BY: rprovinc
// CHANGELOG: 03/23/2020: created

logDebug("At start of 5119");	 
if (wfTask == "Review Application" && wfStatus == "Complete") {
logDebug("Starting email communication");	 
logDebug("Script 5119_Send_HOA_Renewal.js")
	// send the email
	var envParameters = aa.util.newHashMap();
	var hoaName = AInfo["Name of HOA"];
	envParameters.put("capId", capId);
	envParameters.put("cap", cap);
	envParameters.put("AGENCYID", "AURORACO");
	envParameters.put("HOANAME", hoaName);
	var vAsyncScript = "SEND_HOA_RENEW_EMAIL";
	aa.runAsyncScript(vAsyncScript, envParameters)
	logDebug("CapID info: " + envParameters);
	logDebug("Name of HOA: " + hoaName);
	logDebug("End of Script 5119_Send_HOA_Renewal.js");

}

