
function hasNewOrInvoicedFees(recordCapId, feeCode) {
var s = aa.fee.getFeeItems(recordCapId, feeCode, null);
if (!s.getSuccess())
	return false;

var n = s.getOutput();

for (ff in n) {
	if ("INVOICED" == n[ff].getFeeitemStatus() || "NEW" == n[ff].getFeeitemStatus()) {
		return true;
	}
}
return false;
}