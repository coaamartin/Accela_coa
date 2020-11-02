if (wfTask.equals("City Application Intake") && wfStatus.equals("Complete"))
{
    var feeItemCode = null;
    if (appTypeArray[2] == "Retail Cultivation")
        feeItemCode = "LIC_MJRC_02";
    else if (appTypeArray[2] == "Retail Store")
        feeItemCode = "LIC_MJST_01";
    else if (appTypeArray[2] == "Retail Product Manufacturer")
        feeItemCode = "LIC_MJRPM_02";
    else if (appTypeArray[2] == "Retail Transporter")
        feeItemCode = "LIC_MJTR_02";
    else if (appTypeArray[2] == "Testing Facility")
        feeItemCode = "LIC_MJTST_02";
    if (feeItemCode && !isFeeItemPaid(feeItemCode))
    {
        cancel = true;
        showMessage = true;
        comment("Cannot proceed without paying city fees");
    }
}




function isFeeItemPaid(feestr) {
    var amtFee = 0;
    var amtPaid = 0;
    var feeSch;

    if (arguments.length == 2)
        feeSch = arguments[1];

    var feeResult = aa.fee.getFeeItems(capId);
    if (feeResult.getSuccess()) {
        var feeObjArr = feeResult.getOutput();
    } else {
        logDebug("**ERROR: getting fee items: " + capContResult.getErrorMessage());
        return false
    }    
    var feeItemExists = false;
    for (ff in feeObjArr)
        if ((!feestr || feestr.equals(feeObjArr[ff].getFeeCod())) && (!feeSch || feeSch.equals(feeObjArr[ff].getF4FeeItemModel().getFeeSchudle()))) {
            feeItemExists = true;
            amtFee += feeObjArr[ff].getFee();
            var pfResult = aa.finance.getPaymentFeeItems(capId, null);
            if (pfResult.getSuccess()) {
                var pfObj = pfResult.getOutput();
                for (ij in pfObj)
                    if (feeObjArr[ff].getFeeSeqNbr() == pfObj[ij].getFeeSeqNbr())
                        amtPaid += pfObj[ij].getFeeAllocation()
            }
        }
    if (!feeItemExists)
        return false;
    if ((amtFee - amtPaid) == 0)
        return true;
    else
        return false;
}