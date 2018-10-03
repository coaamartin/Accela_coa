function pubWrksScript183_assessFeesScenario1(){
    logDebug("pubWrksScript183_assessFeesScenario1() started.");
    try{
        var feeItem      = "";
        var feeSched     = "PW_PIP";
        var feePeriod    = "FINAL";
        var feeQty       = 0;
        var feeInv       = "N";
        var reAppFee     = AInfo["Re-Application Fee"];
        var revFee       = AInfo["Review Fee"];
        var trafCtrlInfo = loadASITable("TRAFFIC CONTROL INFORMATION");
		
		var reAppFeeItem = "PW_PIP_36";
		var revFeeItem = "PW_PIP_35";
        
        if(reAppFee == "Yes")
            updateFee(reAppFeeItem, feeSched, feePeriod, 1, feeInv);
		else { if(feeExists(reAppFeeItem)) removeFee(reAppFeeItem, feePeriod); }
        if(revFee == "Yes")
            updateFee(revFeeItem, feeSched, feePeriod, 1, feeInv);
		else { if(feeExists(revFeeItem)) removeFee(revFeeItem, feePeriod); }
        
        for(eachRow in trafCtrlInfo){
            var aRow = trafCtrlInfo[eachRow];
            feeQty += parseFloat(aRow["Street Occupancy Fee Amount"]);
        }
        
        if(feeQty > 0) updateFee("PW_PIP_30", feeSched, feePeriod, feeQty, feeInv);
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function pubWrksScript183_assessFeesScenario1(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function pubWrksScript183_assessFeesScenario1(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("pubWrksScript183_assessFeesScenario1() ended.");
}//END pubWrksScript183_assessFeesScenario1()