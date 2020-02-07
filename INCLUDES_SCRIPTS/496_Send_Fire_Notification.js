if (balanceDue > 0)
{
	logDebug("Starting 496_Fire_Notifications script");
	var InvoiceNbr = InvoiceNbrArray[0] + "";
	var envParameters = aa.util.newHashMap();
	envParameters.put("capId", capId);
	envParameters.put("cap", cap);
	envParameters.put("INVOICEID", InvoiceNbr);
	envParameters.put("AGENCYID", "AURORACO");
	var vAsyncScript = "SEND_FIRE_INVOICE_ASYNC";
	aa.runAsyncScript(vAsyncScript, envParameters)
	logDebug("CapID info: " + envParameters);
	logDebug ("Invoice NBR: " + InvoiceNbr);
	logDebug("End of 496_Fire_Notifications script");
	logDebug("**END** FIRE_INVOICE_ASYNC kicks off from here");
	//var errorLog = [];
	//logDebug("Errors from Send_fire_Invoice_Async =" + errorLog);

	
}

