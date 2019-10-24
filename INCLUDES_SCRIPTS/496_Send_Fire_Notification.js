if (balanceDue > 0)
{
	var vAsyncScript = "SEND_FIRE_INVOICE_ASYNC";
	var envParameters = aa.util.newHashMap();
	envParameters.put("capId", capId);
	envParameters.put("cap", cap);
	envParameters.put("invNbr", InvoiceNbrArray[0] + "");
	aa.runAsyncScript(vAsyncScript, envParameters)
}