
function invoiceNewFeesOneInvoice(itemCap){
	var thisFeeSeq_L = new Array(); 			// invoicing fee for CAP in args
    var thisPaymentPeriod_L = new Array(); 		// invoicing pay periods for CAP in args
	var getFeeResult = aa.fee.getFeeItems(itemCap, null, "NEW");
	if (getFeeResult.getSuccess()) {
		var feeList = getFeeResult.getOutput();
		for (feeNum in feeList) {
			var thisFee = feeList[feeNum];
			if (thisFee.getFeeitemStatus().equals("NEW")) {
				var feeSeq = thisFee.getFeeSeqNbr();
				var feePeriod = thisFee.getPaymentPeriod();
                thisFeeSeq_L.push(feeSeq);
				thisPaymentPeriod_L.push(feePeriod);
			}
		}
		
		var invoiceResult_L = aa.finance.createInvoice(itemCap, thisFeeSeq_L, thisPaymentPeriod_L);
        if (invoiceResult_L.getSuccess())
            logMessage("Invoicing assessed fee items is successful.");
        else
            logDebug("**ERROR: Invoicing the fee items assessed was not successful.  Reason: " + invoiceResult_L.getErrorMessage());
		
	} else {
		logDebug("**ERROR: getting fee items (" + feeList[feeNum].getFeeCod() + "): " + getFeeResult.getErrorMessage())
	}
}