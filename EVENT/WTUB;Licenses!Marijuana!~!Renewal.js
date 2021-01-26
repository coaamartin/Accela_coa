//SWAKIL ID 488
if ("City Application Intake".equals(wfTask) && "Complete".equals(wfStatus))
{
	include("488_Check_MJ_Renewal_Docs");
}


var vPayment;
var vPayments;
var vPaymentSeqNbr = 0;
var vPaymentAmt = 0;

var totalPaid = totalPaidAmount();

if(wfTask.equals("Renewal Review") && wfStatus.equals("Complete") && totalPaid < 2500){
	cancel = true;
	showMessage = true;
	comment("Fee is not Paid yet");
}

function totalPaidAmount(){
    var vPayment;
    var vPayments;
    var vPaymentAmt = 0;

// Get all payments on the record
    vPayments = aa.finance.getPaymentByCapID(capId, null);
    if (vPayments.getSuccess() == true) {
        vPayments = vPayments.getOutput();
        var y = 0;
        // Loop through payments to get the latest by highest SEQ number
        for (y in vPayments) {
            vPayment = vPayments[y];
            vPaymentAmt += vPayment.getPaymentAmount();
        }
    }
    return vPaymentAmt;
}