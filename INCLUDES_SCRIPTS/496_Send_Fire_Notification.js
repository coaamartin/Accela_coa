if (balanceDue > 0)
{
	logDebug("Starting 496_Fire_Notifications script");
	var invoiceNbrArray = aa.env.getValue("INVOICEID");
	var envParameters = aa.util.newHashMap();
	envParameters.put("capId", capId);
	envParameters.put("cap", cap);
	envParameters.put("INVOICEID", invoiceNbrArray);
	envParameters.put("AGENCYID", "AURORACO");
	//var capId = aa.env.getValue("capId");
	var vAsyncScript = "SEND_FIRE_INVOICE_ASYNC";
	aa.runAsyncScript(vAsyncScript, envParameters)
	//var invNbr = aa.env.getValue("INVOICEID");
	logDebug("CapID info: " + envParameters);
	logDebug("Invoice ID = " + invoiceNbrArray);
	logDebug("End of 496_Fire_Notifications script");
	logDebug("**END** FIRE_INVOICE_ASYNC kicks off from here");
}

