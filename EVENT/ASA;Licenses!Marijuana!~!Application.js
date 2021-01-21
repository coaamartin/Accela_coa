//showDebug = true;
//JMAIN - MJ Application Submittal
/*if(!publicUser){
include("28_AMEDEmailApplicantAtRecordCreation");
}*/

//ACA FEE Invoice
if(publicUser){
	_invoiceAllFees();
}
//assess State MJ Licensing Fee on application submit
//include("246_AssessStateMJFee");

//SWAKIL
//required docs conditions
//include("495_Add_Required_Docs_Conditions");

function _invoiceAllFees() {
	itemCapId = capId;
	if (arguments.length > 0) itemCapId = arguments[0];
	feeSeqList = [];
	periodList = [];
	periodExists = false;	
	
	feeList = aa.finance.getFeeItemByCapID(itemCapId).getOutput();

	for (fee in feeList) {
		if (feeList[fee].getFeeitemStatus() == "NEW") {
			feeSeqList.push(feeList[fee].getFeeSeqNbr());
			for (per in periodList){
				if (periodList[per] == feeList[fee].getPaymentPeriod()) periodExists = true;
			}
			if (!periodExists) periodList.push(feeList[fee].getPaymentPeriod());
		}
	}

	if(feeSeqList.length > 0) {
		doInvoice = aa.finance.createInvoice(itemCapId, feeSeqList, periodList);
		if (!doInvoice.getSuccess()){
			logDebug("Error during invoicing: " + doInvoice.getErrorMessage());
		}
	}
}
