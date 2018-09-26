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
        
        if(reAppFee == "Yes")
            updateFee("PW_PIP_36", feeSched, feePeriod, 1, feeInv);
        if(revFee == "Yes")
            updateFee("PW_PIP_35", feeSched, feePeriod, 1, feeInv);
        
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