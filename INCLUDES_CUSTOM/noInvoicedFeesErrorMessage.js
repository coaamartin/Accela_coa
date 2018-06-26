function noInvoicedFeesErrorMessage(workFlowTask, workflowStatusArray) {

	if (wfTask == workFlowTask) {

		var statusMatch = false;

		for (s in workflowStatusArray) {
			if (wfStatus == workflowStatusArray[s]) {
				statusMatch = true;
				break;
			}
		}//for all status options

		if (!statusMatch) {
			return false;
		}

		var hasInvoiced = hasInvoicedFees(capId, "");
		//Script 164
		if (!hasInvoiced && AInfo["Review Fee?"] == "Yes") {
			cancel = true;
			showMessage = true;
			comment("Please add and invoice the correct fee item(s).");
			return false;
		}
	} else {
		return false;
	}
	return true;
}
