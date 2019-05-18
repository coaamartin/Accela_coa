//PRA;Licenses!Marijuana!~!Application.js

sendEmailReceipt_MJApplication();

var vPayment;
var vPayments;
var vPaymentSeqNbr = 0;
var vPaymentAmt;

// Get all payments on the record
vPayments = aa.finance.getPaymentByCapID(capId, null);	
if (vPayments.getSuccess() == true) {
	vPayments = vPayments.getOutput();
	var y = 0;
	// Loop through payments to get the latest by highest SEQ number
	for (y in vPayments) {
		vPayment = vPayments[y];
		if (vPayment.getPaymentSeqNbr() > vPaymentSeqNbr) {
			vPaymentSeqNbr = vPayment.getPaymentSeqNbr();
			vPaymentAmt = vPayment.getPaymentAmount();
		}
	}
	
	if (vPaymentSeqNbr != null && vPaymentSeqNbr != "") {
		logDebug("The latest payment has a sequence number of " + vPaymentSeqNbr + " and payment amount of " + vPaymentAmt);
	}
}


if (!publicUser) {
	if (vPaymentAmt  >= 2500) {
		logDebug("Minimum payment of $2500 has been made");
	}
}
//SW - Script 13
include("13_changeStatusAfterPaymentMJ");