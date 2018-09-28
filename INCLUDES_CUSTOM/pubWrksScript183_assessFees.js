//Script 183 - Scenario 2
function pubWrksScript183_assessFees(){
    logDebug("pubWrksScript183_assessFees() stared");
    try{
        var typeOfImpvs = loadASITable("TYPE OF IMPROVEMENTS");
        var feeItem = "";
        var feeSched = "PW_PIP";
        var feePeriod = "FINAL";
        var feeQty = 0;
        var feeInv = "N";
        var feesAdded = [];
        var possibleFees = ["PW_PIP_13","PW_PIP_15","PW_PIP_16","PW_PIP_14","PW_PIP_23","PW_PIP_31","PW_PIP_32","PW_PIP_03","PW_PIP_34","PW_PIP_17","PW_PIP_05","PW_PIP_37","PW_PIP_20","PW_PIP_22","PW_PIP_04","PW_PIP_11","PW_PIP_19","PW_PIP_18","PW_PIP_12","PW_PIP_02","PW_PIP_10","PW_PIP_01","PW_PIP_07","PW_PIP_21","PW_PIP_09","PW_PIP_08","PW_PIP_24","PW_PIP_06"];
        
        for(var i in typeOfImpvs){
            var aRow = typeOfImpvs[i];
            var impvType = aRow["Type"].fieldValue;
            var impvTypeNum = aRow["Ea / Sq. Ft. / Lineal Ft."].fieldValue;
            
            if(impvType == null || impvTypeNum == null) { logDebug("WARNING: There is no value for 'Type' and/or 'Ea / Sq. Ft. / Lineal Ft.' in line " + (parseInt(i) + 1)); continue;}
            if(impvType == "Combo Curb, Gutter, Walk (LF)")                        { feeItem = "PW_PIP_13"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Cross Pans (EA)")                                      { feeItem = "PW_PIP_15"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Curb Cut for Driveway (EA)")                           { feeItem = "PW_PIP_16"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Curb Ramp (EA)")                                       { feeItem = "PW_PIP_14"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Directional Bore (LF)")                                { feeItem = "PW_PIP_23"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Driveway (EA)")                                        { feeItem = "PW_PIP_31"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Dry Utility Permit (SINGLE FEE)")                      { feeItem = "PW_PIP_32"; feeQty = 1; }
            if(impvType == "Guardrail (SINGLE FEE)")                               { feeItem = "PW_PIP_03"; feeQty = 1; }
            if(impvType == "Materials Lab (SINGLE FEE)")                           { feeItem = "PW_PIP_34"; feeQty = 1; }
            if(impvType == "Median Cover-Concrete or Aggregate (SF)")              { feeItem = "PW_PIP_17"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Median Curb and Gutter (LF)")                          { feeItem = "PW_PIP_05"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Mid Block Ramp (EA)")                                  { feeItem = "PW_PIP_37"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Mill & Overlay (SF)")                                  { feeItem = "PW_PIP_20"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Misc. w/Description (EA)")                             { feeItem = "PW_PIP_22"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Monitoring Well (EA)")                                 { feeItem = "PW_PIP_04"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Mountable Curb and Gutter (LF)")                       { feeItem = "PW_PIP_11"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Paving New Roads Including Subgrade Preparation (SF)") { feeItem = "PW_PIP_19"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Potholes (1-5 Lump Sum; More than 5 (EA))")            { feeItem = "PW_PIP_18"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Retaining Wall (EA)")                                  { feeItem = "PW_PIP_12"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Sidewalk (LF)")                                        { feeItem = "PW_PIP_02"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Sidewalk Chase Drain (EA)")                            { feeItem = "PW_PIP_10"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Small Cell Site (SINGLE FEE)")                         { feeItem = "PW_PIP_01"; feeQty = 1; }
            if(impvType == "Street Cuts (SF)")                                     { feeItem = "PW_PIP_07"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Street/Pedestrian Lights (EA)")                        { feeItem = "PW_PIP_21"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Structures - Box Culverts etc. (CF)")                  { feeItem = "PW_PIP_09"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Structures - Yard Surface (CF)")                       { feeItem = "PW_PIP_08"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Traffic Signal (SINGLE FEE)")                          { feeItem = "PW_PIP_24"; feeQty = 1; }
            if(impvType == "Vertical Curb and Gutter (LF)")                        { feeItem = "PW_PIP_06"; feeQty = parseFloat(impvTypeNum); }
            
            if(feeItem != "" && feeQty > 0) {
                logDebug("Adding fee " + feeItem + " with quantity of " + feeQty + ". For " + impvType + ".");
                updateFee(feeItem, feeSched, feePeriod, feeQty, feeInv);
                feesAdded.push(feeItem);
                feeItem = ""; feeQty = 0;
                logDebug("*****************************************************************************************");
            }
        }
        
        for(posFee in possibleFees){
            var pFee = possibleFees[posFee];
            if(!contains(feesAdded, pFee)) { if(feeExists(pFee)) removeFee(pFee, feePeriod); }
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function (). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function (). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("pubWrksScript183_assessFees() ended");
}//END pubWrksScript183_assessFees()