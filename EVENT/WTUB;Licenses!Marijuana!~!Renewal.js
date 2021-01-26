//SWAKIL ID 488
if ("City Application Intake".equals(wfTask) && "Complete".equals(wfStatus))
{
	include("488_Check_MJ_Renewal_Docs");
}


var vPayment;
var vPayments;
var vPaymentSeqNbr = 0;
var vPaymentAmt = 0;

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
}

if(wfTask.equals("Renewal Review") && wfStatus.equals("Complete") && vPaymentAmt >= 2500){
	cancel = true;
	showMessage = true;
	comment("Fee is not Paid yet");
}