
/**
 * check workflow task/status and either add or invoice Fees
 * 
 * @param feeSchedName fee schedule name
 * @param {array} feeCodesAry fee codes to add or invoice
 * @param addFeesWfTaskName wfTask name, when matched - add fee related
 * @param addFeesWfStatusAry wfStatus name, when matched - add fee related
 * @param invoiceFeesWfTaskName wfTask name, when matched - invoice fee related
 * @param invoiceFeesWfStatusAry wfStatus name, when matched - invoice fee related
 * @returns {Boolean}
 */
function calculateAndAssessConstructionBuildingFees(feeSchedName, feeCodesAry, addFeesWfTaskName, addFeesWfStatusAry, invoiceFeesWfTaskName, invoiceFeesWfStatusAry) {

	if (wfTask == addFeesWfTaskName) {
		var statusMatch = false;
		for (s in addFeesWfStatusAry) {
			if (wfStatus == addFeesWfStatusAry[s]) {
				statusMatch = true;
				break;
			}
		}//for all status options

		if (statusMatch) {
			//Add Fees:
			for (fc in feeCodesAry) {
				addFee(feeCodesAry[fc], feeSchedName, "FINAL", 1, "N");
			}
		}

	}

	if (wfTask == invoiceFeesWfTaskName) {
		var statusMatch = false;
		for (s in invoiceFeesWfStatusAry) {
			if (wfStatus == invoiceFeesWfStatusAry[s]) {
				statusMatch = true;
				break;
			}
		}//for all status options

		if (statusMatch) {
			//Invoice Fees:
			for (fc in feeCodesAry) {
				invoiceFee(feeCodesAry[fc], "FINAL");
			}
		}
	}
	return true;
}