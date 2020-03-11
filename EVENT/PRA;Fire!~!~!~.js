//SWAKIL 03/11/2020
var invoiceNbrObj = getLastInvoice({});
var invNbr = invoiceNbrObj.getInvNbr();
var envParameters = aa.util.newHashMap();
envParameters.put("capId", capId);
envParameters.put("cap", cap);
envParameters.put("INVOICEID", invNbr);
var vAsyncScript = "SEND_FIRE_RECEIPT_ASYNC";
aa.runAsyncScript(vAsyncScript, envParameters)
