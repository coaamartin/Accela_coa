/* For Building/Permit/New Building/NA 
     If workflow task = "Fee Processing" and Status = "Ready to Pay" check Custom Field "Single Family Residential Detached Home" = Yes 
     if so then insert Irrigation Fee (Fee schedule = WAT_IP, fee item = WAT_IP_01 amount is CONSTANT at
     $30.75 
     Also Mark the Irrigation Inspection as Pending. 
     
     If Custom Field "Single Family Residential Detached Home" = No
     just mark the Irrigation Inspection as Pending and do not insert the Irrigation Fee.
*/
function bldScript390_addSinFamFee(){
    logDebug("bldScript390_addSinFamFee() started");
    try{
        var $iTrc = ifTracer,
            sinFamDet = AInfo["Single Family Detached Home"],
            feeSched = "WAT_IP",
            feeItem = "WAT_IP_01",
            feePeriod = "FINAL",
            invFee = "N",
            feeQty = 1;
        
        if($iTrc(sinFamDet == "Yes", 'sinFamDet == "Yes"')){
            updateFee(feeItem, feeSched, feePeriod, feeQty, invFee);
            createPendingInspection("BLD_NEW_CON", "Irrigation Inspection");
        }
        
        if($iTrc(sinFamDet == "No", 'sinFamDet == "No"'))
            createPendingInspection("BLD_NEW_CON", "Irrigation Inspection");
    }
    catch(err){
        showDebug = true;
        comment("Error on custom function bldScript390_addSinFamFee(). Err: " + err);
        logDebug("Error on custom function bldScript390_addSinFamFee(). Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("bldScript390_addSinFamFee() ended");
}//END bldScript390_addSinFamFee()