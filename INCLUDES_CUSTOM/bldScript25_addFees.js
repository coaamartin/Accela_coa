/* For Building/Permit/New Building/NA 
    If the workflow task = "Quality Check" and the Status = "Approved" add the following fees:
    BLD_NEW_12: 
    if Custom Field "Single Family Detached Home" = Yes then fee is $230.00 if No then Fee is based on Custom Field "Project Category" and "# of Residential Units". If Project Category = Multi-Family Building or Multi-Family From Master then fee is $198.00 * value within # of Residential Units, If Project Category NOT = Multi-Family Building or Multi-Family From Master then fee is $161.00 * value within # of Residential Units. (fee is per unit).
    BLD_NEW_14:
    if Custom Field "Single Family Detached Home" = Yes then fee is $300.00 if No then Fee is based on Custom Field "Project Category" and "# of Residential Units" if not null. If Project Category = Multi-Family Building or Multi-Family From Master then fee is $253.00 * value within # of Residential Units, If Project Category NOT = Multi-Family Building or Multi-Family From Master and # or Residential units is not null or 0 (zero) then fee is $211.00 * value within # of Residential Units. (fee is per unit)

    Fees will be Invoiced when workflow tals Fee Processing has a status of Ready to Pay
*/
function bldScript25_addFees(){
    logDebug("bldScript25_addFees() started");
    try{
        var $iTrc = ifTracer,
            sinFamDet = AInfo["Single Family Detached Home"],
            projCatry = AInfo["Project Category"],
            numResUntStr = AInfo["# of Residential Units"],
            numResUnt = 0,
            feeSched = "BLD_NEW_CON",
            feeItem12 = "BLD_NEW_12",
            feeItem14 = "BLD_NEW_14",
            feePeriod = "FINAL",
            invFee = "N",
            feeQty12 = 0,
            feeQty14 = 0;
        
        if($iTrc(!isNaN(parseFloat(numResUntStr)), '!isNaN(numResUntStr)'))
            numResUnt = parseFloat(numResUntStr);
        
        if($iTrc(wfTask == "Quality Check" && wfStatus == "Approved" && sinFamDet, 'wf:Quality Check/Approved && sinFamDet')){
            
            if($iTrc(sinFamDet == "Yes", 'sinFamDet == "Yes"')){
                feeQty12 = 230;
                feeQty14 = 300;
            }
            
            if($iTrc(sinFamDet == "No" && numResUnt > 0 && projCatry && projCatry != "", 'sinFamDet == "No" && numResUnt > 0 && projCatry')){
                if($iTrc(matches(projCatry, "Multi-Family Building", "Multi-Family From Master"), 'matches(projCatry, "Multi-Family Building", "Multi-Family From Master")')){
                    feeQty12 = 198.00 * numResUnt;
                    feeQty14 = 253.00 * numResUnt;
                }
                
                if($iTrc(!matches(projCatry, "Multi-Family Building", "Multi-Family From Master"), 'matches(projCatry, "Multi-Family Building", "Multi-Family From Master")')){
                    feeQty12 = 161.00 * numResUnt;
                    feeQty14 = 211.00 * numResUnt;
                }
            }
            
            if($iTrc(feeQty12 > 0, feeQty12 + '> 0')) updateFee(feeItem12, feeSched, feePeriod, feeQty12, invFee);
            if($iTrc(feeQty14 > 0, feeQty14 + '> 0')) updateFee(feeItem14, feeSched, feePeriod, feeQty14, invFee);
        }
        
        if($iTrc(wfTask == "Fee Processing" && wfStatus == "Ready to Pay", 'wf:Fee Processing/Ready to Pay')){
            if($iTrc(feeExists(feeItem12), 'feeExists(' + feeItem12 + ')')) invoiceFee(feeItem12, feePeriod);
            if($iTrc(feeExists(feeItem14), 'feeExists(' + feeItem14 + ')')) invoiceFee(feeItem14, feePeriod);
        }
    }
    catch(err){
        showDebug = true;
        comment("Error on custom function bldScript25_addFees(). Err: " + err);
        logDebug("Error on custom function bldScript25_addFees(). Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("bldScript25_addFees() ended");
}//END bldScript25_addFees()