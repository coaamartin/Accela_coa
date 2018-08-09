
function bldScript25_invoiceCaptialNParkFees(){
    logDebug("bldScript25_invoiceCaptialNParkFees() started");
    try{
        var $iTrc = ifTracer,
            feePeriod = "FINAL",
            feeItemArry = ["BLD_NEW_12", "BLD_NEW_14", "BLD_NEW_01", "WAT_IP_01", "WAT_IP_02", "BLD_NEW_06", "BLD_NEW_07", "BLD_NEW_05", "BLD_NEW_13"];
        
        for(aFee in feeItemArry){
            var feeItem = feeItemArry[aFee];
            if($iTrc(feeExists(feeItem), feeItem + ' exists')) invoiceFee(feeItem, feePeriod);
        }
    }
    catch(err){
        showDebug = true;
        comment("Error on custom function bldScript25_invoiceCaptialNParkFees(). Err: " + err);
        logDebug("Error on custom function bldScript25_invoiceCaptialNParkFees(). Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("bldScript25_invoiceCaptialNParkFees() ended");
}//END bldScript25_invoiceCaptialNParkFees()