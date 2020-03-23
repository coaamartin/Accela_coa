// SCRIPTNUMBER: 5119
// SCRIPTFILENAME: 5119_Send_HOA_Renewal.js
// PURPOSE: Called when NA Renewal record has review task updated to complete.  Communication will send out.
// DATECREATED: 03/23/2020
// BY: rprovinc
// CHANGELOG: 03/23/2020: created

logDebug("At start of 5119");	 
if (wfTask == "Review Application" && wfStatus == "Complete") {
logDebug("Starting email communication");	 

	// send the email
	sendEmailForRenew();	
	
}

function sendEmailForRenew() {
	var envParameters = aa.util.newHashMap();
	envParameters.put("capId", capId);
	envParameters.put("cap", cap);
	envParameters.put("AGENCYID", "AURORACO");
	var vAsyncScript = "SEND_HOA_RENEW_EMAIL";
	aa.runAsyncScript(vAsyncScript, envParameters)
	logDebug("CapID info: " + envParameters);
	logDebug("End of email renewal in 5082_HandleMiscServicesNARenewal");
}