if (balanceDue > 0)
{
	var vAsyncScript = "SEND_FIRE_INVOICE_ASYNC";
	var envParameters = aa.util.newHashMap();
	envParameters.put("capId", capId);
	envParameters.put("cap", cap);
	envParameters.put("invNbr", InvoiceNbrArray[0] + "");
	aa.runAsyncScript(vAsyncScript, envParameters)
	var capId = aa.env.getValue("capId");
	var iContact = getContactByType("Individual", capId);
	var fName = iContact.getFirstName();
	var lName = iContact.getLastName();
	var emailTo = iContact.getEmail();
	logDebug("User Last name: " + fName)
	logDebug("User First name: " + lName)
	logDebug("User email: " + emailTo)
}