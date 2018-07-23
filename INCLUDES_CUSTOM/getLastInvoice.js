/*
* GETS LAST INVOICE

    OPTIONS: ADDITIONAL OPTIONS YOU NEED FOR FILTERING (CURRENTLY FILTERS BY feeCodes & zeroBalanceDue)
*/
function getLastInvoice(options) {
    var settings = {
		capId: capId,
		zeroBalanceDue: false,
		feeCodes: [] //an array of fee codes to filter by [ENF_HI_01, ENF_HI_02] - empty for all fees
    };
    for (var attr in options) { settings[attr] = options[attr]; } //optional params - overriding default settings

	var lastInvoice = null,
		invoice,
		balDue,
		fees,
		fee,
		feefound = false,
		invoices = aa.finance.getInvoiceByCapID(settings.capId, null).getOutput();

	for (var idxInv in invoices) {
		 invoice = invoices[idxInv];
		 balDue = invoice.getInvoiceModel().getBalanceDue();
		if(settings.zeroBalanceDue && balDue > 0) {
			continue;
		}
		if(settings.feeCodes.length > 0) {
			fees = aa.invoice.getFeeItemInvoiceByInvoiceNbr(thisInvoice.getInvNbr()).getOutput();
			feefound = false;
			for (var idxFee in fees) {
				fee = fees[idxFee];
				if(settings.feeCodes.indexOf(fee.feeCode)) {
					feefound = true;
					break;
				}
			}
			if(feefound == false) {
				continue;
			}
		}

		if(lastInvoice == null || lastInvoice.getInvNbr() < invoice.getInvNbr()) {
			lastInvoice = invoice;
		}
	}
	return invoice;
}
