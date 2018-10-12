
function getBalanceByCapId(feestr, feeSch, invoicedOnly, capId) {
    var amtFee = 0,
       amtPaid = 0,
       ff;

    invoicedOnly = (invoicedOnly == undefined || invoicedOnly == null) ? false : invoicedOnly;

    var feeResult = aa.fee.getFeeItems(capId, feestr, null);
    if (feeResult.getSuccess()) {
        var feeObjArr = feeResult.getOutput();
    }
    else {
        logDebug("**ERROR: getting fee items: " + capContResult.getErrorMessage());
        return 999999;
    }

    for (ff in feeObjArr)
        if ((!feestr || feestr.equals(feeObjArr[ff].getFeeCod())) && (!feeSch || feeSch.equals(feeObjArr[ff].getF4FeeItemModel().getFeeSchudle()))) {
            if (!(matches(feeObjArr[ff].feeitemStatus, "VOIDED", "CREDITED"))) {  //if fee is voided or credited - exclude
                if (!invoicedOnly || feeObjArr[ff].feeitemStatus == "INVOICED") {
                    amtFee += feeObjArr[ff].getFee();
                    var pfResult = aa.finance.getPaymentFeeItems(capId, null);
                    if (pfResult.getSuccess()) {
                        var pfObj = pfResult.getOutput();
                        for (ij in pfObj) {
                            if (feeObjArr[ff].getFeeSeqNbr() == pfObj[ij].getFeeSeqNbr()) {
                                amtPaid += pfObj[ij].getFeeAllocation()
                            }
                        }
                        logDebug("feestr=" + feestr + " - " + "status=" + feeObjArr[ff].feeitemStatus + " - " + "amtFee=" + amtFee + " - " + "amtPaid=" + amtPaid);
                    }
                }
                else {
                    logDebug("feestr=" + feestr + ' ---- NOT  Invoiced');
                }
            }
            else {
                logDebug("feestr=" + feestr + ' ---- Voided/Credited');
            }
        }
    return amtFee - amtPaid;
}