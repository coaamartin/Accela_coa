
function bldScript25_addCaptialNParkFees(){
    logDebug("bldScript25_addCaptialNParkFees() started");
    try{
        var $iTrc = ifTracer,
            sinFamDet = AInfo["Single Family Detached Home"],
            projCatry = AInfo["Project Category"],
            numResUntStr = AInfo["# of Residential Units"],
            numResUnt = 0,
            valuation = AInfo["Valuation"],
            valAmt = 0,
            feeSched = "BLD_NEW_CON",
            feeItem12 = "BLD_NEW_12",
            feeItem14 = "BLD_NEW_14",
            feeItemPermit = "BLD_NEW_01",
            feePeriod = "FINAL",
            invFee = "N",
            feeQty12 = 0,
            feeQty14 = 0;
        
        if($iTrc(!isNaN(parseFloat(numResUntStr)), '!isNaN(numResUntStr)'))
            numResUnt = parseFloat(numResUntStr);
        
        if($iTrc(!isNaN(parseFloat(valuation)), '!isNaN(valuation)'))
            valAmt = parseFloat(valuation);
        
        if($iTrc(projCatry && sinFamDet == "Yes" && matches(projCatry, "Custom Home", "Single Family From Master"), 'sinFamDet == "Yes" && matches(projCatry, "Custom Home", "Single Family From Master")')){
            feeQty12 = 1327;
            feeQty14 = 497.50;
        }
        
        if($iTrc(sinFamDet == "No" && numResUnt > 0 && projCatry && projCatry != "", 'sinFamDet == "No" && numResUnt > 0 && projCatry')){
            if($iTrc(matches(projCatry, "Custom Home", "Single Family From Master"), 'matches(projCatry, "Multi-Family Building", "Multi-Family From Master")')){
                feeQty12 = 1127.50 * numResUnt;
                feeQty14 = 497.50 * numResUnt;
            }
            
            if($iTrc(matches(projCatry, "Multi-Family Building", "Multi-Family From Master"), 'matches(projCatry, "Multi-Family Building", "Multi-Family From Master")')){
                feeQty12 = 932.00 * numResUnt;
                feeQty14 = 469.67 * numResUnt;
            }
        }
        
        if($iTrc(feeQty12 > 0, feeQty12 + '> 0')) updateFee(feeItem12, feeSched, feePeriod, feeQty12, invFee);
        if($iTrc(feeQty14 > 0, feeQty14 + '> 0')) updateFee(feeItem14, feeSched, feePeriod, feeQty14, invFee);
        if($iTrc(valAmt > 0, valAmt + '> 0')) updateFee(feeItemPermit, feeSched, feePeriod, valAmt, invFee);
    }
    catch(err){
        showDebug = true;
        comment("Error on custom function bldScript25_addCaptialNParkFees(). Err: " + err);
        logDebug("Error on custom function bldScript25_addCaptialNParkFees(). Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("bldScript25_addCaptialNParkFees() ended");
}//END bldScript25_addCaptialNParkFees()