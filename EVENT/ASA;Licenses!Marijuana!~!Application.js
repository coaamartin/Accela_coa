//showDebug = true;
//JMAIN - MJ Application Submittal
/*if(!publicUser){
include("28_AMEDEmailApplicantAtRecordCreation");
}*/

//ACA FEE Invoice
if (appMatch("Licenses/Marijuana/Retail Cultivation/Application")) {
	updateFee("LIC_MJRC_02", "LIC_MJ_RC", "FINAL", 1, "N");
} else if (appMatch("Licenses/Marijuana/Retail Product Manufacturer/Application")) {
	updateFee("LIC_MJRPM_02", "LIC_MJ_RPM", "FINAL", 1, "N");
} else if (appMatch("Licenses/Marijuana/Retail Transporter/Application")) {
	updateFee("LIC_MJTR_02", "LIC_MJ_TRANS", "FINAL", 1, "N");
} else if (appMatch("Licenses/Marijuana/Testing Facility/Application")) {
	updateFee("LIC_MJTST_02", "LIC_MJ_TEST", "FINAL", 1, "N");
} else if (appMatch("Licenses/Marijuana/Retail Store/Application")) {
	updateFee("LIC_MJST_01", "LIC_MJ_STORE", "FINAL", 1, "N");
}

_invoiceAllFees();

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





