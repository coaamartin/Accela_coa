
function bldScript25_invoiceCaptialNParkFees(){
    logDebug("bldScript25_invoiceCaptialNParkFees() started");
    try{
        var $iTrc = ifTracer,
            feeItem12 = "BLD_NEW_12",
            feeItem14 = "BLD_NEW_14",
			feeItemPermit = "BLD_NEW_01",
            feePeriod = "FINAL";
        
            if($iTrc(feeExists(feeItem12), 'feeExists(' + feeItem12 + ')')) invoiceFee(feeItem12, feePeriod);
            if($iTrc(feeExists(feeItem14), 'feeExists(' + feeItem14 + ')')) invoiceFee(feeItem14, feePeriod);
            if($iTrc(feeExists(feeItemPermit), 'feeExists(' + feeItemPermit + ')')) invoiceFee(feeItemPermit, feePeriod);
    }
    catch(err){
        showDebug = true;
        comment("Error on custom function bldScript25_invoiceCaptialNParkFees(). Err: " + err);
        logDebug("Error on custom function bldScript25_invoiceCaptialNParkFees(). Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("bldScript25_invoiceCaptialNParkFees() ended");
}//END bldScript25_invoiceCaptialNParkFees()