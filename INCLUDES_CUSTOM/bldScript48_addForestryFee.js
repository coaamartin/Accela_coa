/* For Building/Permit/New Building/NA 
     where property abuts publicly dedicated street, except major arterials. 
     a Forestry fee is required. When Forestry Review task has a status = Approved and
       Custom Field "Forestry Fee Non Arterial Frontage" is greater than 0 or not null (Subgroup: PROJECT FEE INFORMATION).
       Add fee in the amount of Custom Field "Forestry Fee Non Arterial Frontage",
       select what fee item to add based on
       If Custom Field "Single Family Detached Home" = Yes then
        add fee (Fee Schedule BLD_NEW_CON - feecode BLD_NEW_16 - Fee Amount = Value in Custom Field * 6.80 in Custom Field "Forestry Fee Non Arterial Frontage")
       
       If Custom Field "Single Family Detached Home" = No
        then add fee (Fee Schedule BLD_NEW_CON - feecode BLD_NEW_17 - Fee Amount = Value in Custom Field * 3.40 in Custom Field "Forestry Fee Non Arterial Frontage")
*/
function bldScript48_addForestryFee(){
    logDebug("bldScript48_addForestryFee() started");
    try{
        var $iTrc = ifTracer,
            forFeeNonArtFront = AInfo["Forestry Fee Non Arterial Frontage"],
            sinFamDet = AInfo["Single Family Detached Home"],
            feeSched = "BLD_NEW_CON",
            feeItem = "",
            feePeriod = "FINAL",
            invFee = "N",
            feeQty = 0;
        
        if($iTrc(forFeeNonArtFront == null || forFeeNonArtFront == undefined || forFeeNonArtFront == "" || (parseFloat(forFeeNonArtFront)) <= 0, 'AInfo["Forestry Fee Non Arterial Frontage"] not valid')) return;
        
        if($iTrc(wfTask == "Forestry Review" && wfStatus == "Approved", 'wf:Forestry Review/Approved')){
            feeQty = parseFloat(forFeeNonArtFront);
            
            if($iTrc(sinFamDet == "Yes", 'sinFamDet == "Yes"')){
                feeItem = "BLD_NEW_16"; feeQty = (feeQty * 6.80).toFixed(2);
            }
            if($iTrc(sinFamDet == "No", 'sinFamDet == "No"')){
                feeItem = "BLD_NEW_17"; feeQty = (feeQty * 3.40).toFixed(2);
            }
                    
            if($iTrc(feeItem != "" && feeQty > 0, feeItem + ' != "" && ' + feeQty + ' > 0')) updateFee(feeItem, feeSched, feePeriod, feeQty, invFee);
        }
    }
    catch(err){
        showDebug = true;
        comment("Error on custom function bldScript48_addForestryFee(). Err: " + err);
        logDebug("Error on custom function bldScript48_addForestryFee(). Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("bldScript48_addForestryFee() ended");
}//END bldScript48_addForestryFee()