
function bldScript25_addCaptialNParkFees(){
    logDebug("bldScript25_addCaptialNParkFees() started");
    try{
        var $iTrc = ifTracer,
            sinFamDet = AInfo["Single Family Detached Home"],
            projCatry = AInfo["Project Category"],
            numResUntStr = AInfo["# of Residential Units"],
            numRetWalls = AInfo["# of Retaining Walls"],
            numResUnt = 0,
            valuation = AInfo["Valuation"],
            valAmt = 0,
            county = getCountyFromAddrOrParcel(),
            feeSched = "BLD_NEW_CON",
            feeItem12 = "BLD_NEW_12",
            feeQty12 = 0,
            feeItem14 = "BLD_NEW_14",
            feeQty14 = 0,
            feeItemPermit = "BLD_NEW_01",
            feeItemIrr = "WAT_IP_01",
            feeQtyIrr = 0,
            feeItemIrrOther = "WAT_IP_02",
            feeQtyIrrOther = 0,
            feeAraCty1 = "BLD_NEW_06",
            feeAraCty2 = "BLD_NEW_07",
            feeQtyCty = 0,
            feeBldUseTxFee = "BLD_NEW_05",
            feeQtyBldUse = 0,
            feeRetWals = "BLD_NEW_13",
            feeQtyRetW = 0,
            feePeriod = "FINAL",
            invFee = "N";
        
        if($iTrc(!isNaN(parseFloat(numResUntStr)), '!isNaN(numResUntStr)'))
            numResUnt = parseFloat(numResUntStr);
        
        if($iTrc(!isNaN(parseFloat(valuation)), '!isNaN(valuation)'))
            valAmt = parseFloat(valuation);
        
        if($iTrc(!isNaN(parseFloat(numRetWalls)), '!isNaN(numRetWalls)'))
            feeQtyRetW = parseFloat(numRetWalls);
        
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
        
        //Irrigation fee
        if($iTrc(matches(projCatry, "Custom Home", "Single Family From Master"), 'matches(projCatry, "Custom Home", "Single Family From Master")'))
            feeQtyIrr = 1;
        else feeQtyIrrOther = 1;
        
        //Calculate materials cost valuation for Tax use fee and county fee
        var materialsCost = AInfo["Materials Cost"];
        var valuation = AInfo["Valuation"];
        if (materialsCost && materialsCost != null && materialsCost != "" && valuation && valuation != null && valuation != ""
                && parseFloat(materialsCost) <= (parseFloat(valuation) / 2)) {
            feeQtyCty = feeQtyBldUse = parseFloat(valuation)/2;
        } else if (materialsCost && materialsCost != null && materialsCost != "" && valuation && valuation != null && valuation != ""
                && parseFloat(materialsCost) > (parseFloat(valuation) / 2)) {
            feeQtyCty = feeQtyBldUse = parseFloat(materialsCost);
        } 
        
        if($iTrc(feeQty12 > 0, feeQty12 + '> 0')) updateFee(feeItem12, feeSched, feePeriod, feeQty12, invFee);
        if($iTrc(feeQty14 > 0, feeQty14 + '> 0')) updateFee(feeItem14, feeSched, feePeriod, feeQty14, invFee);
        if($iTrc(valAmt > 0, valAmt + '> 0')) updateFee(feeItemPermit, feeSched, feePeriod, valAmt, invFee);
        if($iTrc(feeQtyIrr > 0, feeQtyIrr + '> 0')) updateFee(feeItemIrr, feeSched, feePeriod, feeQtyIrr, invFee);
        if($iTrc(feeQtyIrrOther > 0, feeQtyIrr + '> 0')) updateFee(feeQtyIrrOther, feeSched, feePeriod, feeQtyIrrOther, invFee);
        
        if($iTrc(county == "ARAPAHOE" && feeQtyCty > 0, 'county fee > 0')) {
            updateFee(feeAraCty1, feeSched, feePeriod, feeQtyCty, invFee);
            updateFee(feeAraCty2, feeSched, feePeriod, feeQtyCty, invFee);
        }
        
        if($iTrc(feeQtyBldUse > 0, 'Building Tax fee valuation > 0')) updateFee(feeBldUseTxFee, feeSched, feePeriod, feeQtyBldUse, invFee);
        if($iTrc(feeQtyRetW > 0, 'Number of Retaing Walls > 0')) updateFee(feeRetWals, feeSched, feePeriod, feeQtyRetW, invFee);
        
    }
    catch(err){
        showDebug = true;
        comment("Error on custom function bldScript25_addCaptialNParkFees(). Err: " + err);
        logDebug("Error on custom function bldScript25_addCaptialNParkFees(). Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("bldScript25_addCaptialNParkFees() ended");
}//END bldScript25_addCaptialNParkFees()