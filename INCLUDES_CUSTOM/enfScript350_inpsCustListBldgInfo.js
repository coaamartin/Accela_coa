function enfScript350_inpsCustListBldgInfo(){
    logDebug("enfScript350_inpsCustListBldgInfo() started.");
    try{
        var $iTrc = ifTracer;
        var bldgInspViolsTname = "BUILDING INSPECTION VIOLATIONS";
        var inspectionsTable = "INSPECTION INFORMATION";
        var unitInspViolsTname = "UNIT INSPECTION VIOLATIONS";
        var bldgInspViolTable = [];
        var unitInspViolTable = [];
        var inspectionInfoTblArr = [];
        var bldgNumbers = [];
        var unitNumbers = [];
        var numberOfBuildings = 0;
        var numberOfUnits = 0;
        var unitsFailed = 0;
        var unitsNoViol = 0
        var unitsNoAccess = 0;
        var unitsNoAccRei = 0;
        bldgInspViolTable = loadASITable(bldgInspViolsTname);
        unitInspViolTable = loadASITable(unitInspViolsTname);
        inspectionInfoTblArr = loadASITable(inspectionsTable);
        
        //Read BUILDING INSPECTION VIOLATIONS TABLE
        if(bldgInspViolTable){
            for(eachRow in bldgInspViolTable){
                var aRow = bldgInspViolTable[eachRow];
                
                var colValue = aRow["Bldg #"] + "";
                if(bldgNumbers.indexOf(colValue) == -1){
                    bldgNumbers.push(colValue);
                    numberOfBuildings++;
                }
            }
            
            for(eachInsp in inspectionInfoTblArr){
                var inspRow = inspectionInfoTblArr[eachInsp];
                inspRow["# of Bldgs Inspected"] = numberOfBuildings + "";
            }
            //updateAsiTableRow(inspectionsTable, "# of Bldgs Inspected", numberOfBuildings);
        }
        
        if(unitInspViolTable){
            for(eachRow in unitInspViolTable){
                var aRow = unitInspViolTable[eachRow];
                var colValue = aRow["Bldg #"] + aRow["Unit #"] + "";
                if(unitNumbers.indexOf(colValue) == -1) {
                    unitNumbers.push(colValue);
                    numberOfUnits++;
                }
                
                var roomCol = aRow["Room"];
                if(roomCol == "No Violation") unitsNoViol++;
                if(matches(roomCol, "Basement:","Bedroom 1:","Bedroom 2:","Bedroom 3:",
                                         "Bathroom 1:","Bathroom 2:","Dining Room:","Entire Unit:",
                                         "Hallway:","Kitchen:","Laundry Room:",
                                         "Living Room:","Patio:","Stairs:","Sun Room:")) unitsFailed++;
                
                if(matches(roomCol, "Tenant Refusal","R. B. R.","Tenant Ill - Pass")) unitsNoAccess++;
                if(matches(roomCol, "Dog on Premises","Lockout","Tenant Ill - Re-Inspect")) unitsNoAccRei++;
            }
            
            for(eachInsp in inspectionInfoTblArr){
                var inspRow = inspectionInfoTblArr[eachInsp];
                inspRow["# of Units Inspected"] = numberOfUnits+ "";
                inspRow["Units - Passed"]       = unitsNoViol+ "";
                inspRow["Units - Failed"]       = unitsFailed+ "";
                inspRow["Units - No Access"]    = unitsNoAccess+ "";
                inspRow["Units - No Access/Re-Inspect"] = unitsNoAccRei+ "";
            }
            
            //updateAsiTableRow(inspectionsTable, "# of Units Inspected", numberOfUnits);
            //updateAsiTableRow(inspectionsTable, "Units - Passed", unitsNoViol);
            //updateAsiTableRow(inspectionsTable, "Units - Failed", unitsFailed);
            //updateAsiTableRow(inspectionsTable, "Units - No Access", unitsNoAccess);
            //updateAsiTableRow(inspectionsTable, "Units - No Access/Re-Inspect", unitsNoAccRei);
        }
        
        removeASITable(inspectionsTable);
        addASITable(inspectionsTable, inspectionInfoTblArr);
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function enfScript350_inpsCustListBldgInfo(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function enfScript350_inpsCustListBldgInfo(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("enfScript350_inpsCustListBldgInfo() ended.");
}//END enfScript350_inpsCustListBldgInfo()