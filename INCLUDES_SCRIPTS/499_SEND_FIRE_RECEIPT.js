var InvoiceNbr = InvoiceNbrArray[0] + "";
var envParameters = aa.util.newHashMap();
envParameters.put("capId", capId);
envParameters.put("cap", cap);
envParameters.put("amount", PaymentTotalPaidAmount);
envParameters.put("INVOICEID", InvoiceNbr);
var vAsyncScript = "SEND_FIRE_RECEIPT_ASYNC";
aa.runAsyncScript(vAsyncScript, envParameters);