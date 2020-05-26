    logDebug("Starting BATCH_REPORT_TESTv2");
    var emailSendTo = getJobParam("emailSendTo"); // email to: 
    var emailTitle = getJobParam("emailTitle"); // email Title
    var emailBodyMsg = "";
    var reportName = getJobParam("reportName");
	var envParameters = aa.util.newHashMap();
	envParameters.put("emailSendTo", emailSendTo);
	envParameters.put("emailTitle", emailTitle);
    envParameters.put("emailBodyMsg", emailBodyMsg);
    envParameters.put("reportName", reportName);
	envParameters.put("AGENCYID", "AURORACO");
	var vAsyncScript = "SEND_BATCH_REPORT_TESTv2";
	aa.runAsyncScript(vAsyncScript, envParameters);
	logDebug("Env info: " + envParameters);
	logDebug("End of batch report test v2 script");
    logDebug("**END** Send batch report test v2 kicks off from here");
    
/*----------------------------------------------------------------------------------------------------/
	| Email Header
	/------------------------------------------------------------------------------------------------------*/
	emailBodyMsg += "Hello," + br;
	emailBodyMsg += br;
	emailBodyMsg += "Please see attached " + reportName + " " + br;
	emailBodyMsg += br;
	emailBodyMsg += "Thank you and have a great day," + br;
	emailBodyMsg += br;
	/*----------------------------------------------------------------------------------------------------/
	| End Email Header
	/------------------------------------------------------------------------------------------------------*/
    logDebug("=================================================");	
	logDebug("Email to: " + emailSendTo);
	logDebug("Email Title: " + emailTitle);
	logDebug("Email Body: " + emailBodyMsg);
	logDebug("=================================================");
	logDebug("Finished sending email");