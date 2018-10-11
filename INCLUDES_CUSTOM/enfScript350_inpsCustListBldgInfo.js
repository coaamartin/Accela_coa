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
        var unitsFailedArr = [];
        var numberOfBuildings = 0;
        var numberOfUnits = 0;
        var countedUnits = [];
        var unitsFailed = 0;
        var unitsNoViol = 0
        var unitsNoAccess = 0;
        var unitsNoAccRei = 0;
        //Use these variables to mark each unit as what it is:
        var NO_VIOLATION = "No Violation";
        var FAIL = "Fail";
        var NA = "NA";
        var NA_REINSP = "NA Reinsp"
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
                
                aRow = unitInspViolTable[eachRow];
                var colValue = aRow["Bldg #"] + aRow["Unit #"] + "";
                var roomCol = aRow["Room"];
                var isCorrected = aRow["Corrected"] == "CHECKED";
                
                //If no Violation is found, then we mark the unit as No Violation
                if(roomCol == "No Violation"){
                    //unitsNoViol++;
                    countedUnits[colValue] = NO_VIOLATION;
                }
                
                //Process Fail units
                if(matches(roomCol, "Basement:","Bedroom 1:","Bedroom 2:","Bedroom 3:",
                                    "Bathroom 1:","Bathroom 2:","Dining Room:","Entire Unit:",
                                    "Hallway:","Kitchen:","Laundry Room:",
                                    "Living Room:","Patio:","Stairs:","Sun Room:")) {
                    
                    //If a Fail unit
                    //Check if it has been marked as No Violation
                    if(countedUnits[colValue] == NO_VIOLATION){
                        //unitsFailed++;
                        //if it has been marked as No Violation
                        // but this new row is not marked as corrected, then mark as Fail
                        if(!isCorrected){
                            countedUnits[colValue] = FAIL;
                        }
                        //Else if Corrected, leave as is
                        //if(isCorrected){
                        //  countedUnits[colValue] = NO_VIOLATION;
                        //}
                    }
                    //If it has not been marked as No Violation
                    if(countedUnits[colValue] != NO_VIOLATION){
                        //if not corrected, mark as fail
                        if(!isCorrected){
                            countedUnits[colValue] = FAIL;
                        }
                        //Else if corrected and not marked as Fail then mark as NO_VIOLATION
                        if(isCorrected && countedUnits[colValue] != FAIL){
                            countedUnits[colValue] = NO_VIOLATION;
                        }
                    }
                    
                }
                
                //If Not a violation or a fail,  then we have a No Access
                if(matches(roomCol, "Tenant Refusal","R. B. R.","Tenant Ill - Pass")) {
                    if(countedUnits[colValue] != NO_VIOLATION && countedUnits[colValue] != FAIL){
                        //unitsNoAccess++;
                        countedUnits[colValue] = NA
                    }
                }
                
                //If not a violation or fail or No Access, then mark as No Access Reinspect
                if(matches(roomCol, "Dog on Premises","Lockout","Tenant Ill - Re-Inspect")){
                    if(countedUnits[colValue] != NO_VIOLATION && countedUnits[colValue] != FAIL && countedUnits[colValue] != NA){
                        //unitsNoAccRei++;
                        countedUnits[colValue] = NA_REINSP;
                    }
                }
            }
            
            //Finally loop through the units and their markings to count the corresponding number of units.
            for(unit in countedUnits){
                var aUnit = countedUnits[unit];
                if(aUnit == NO_VIOLATION) unitsNoViol++;
                if(aUnit == FAIL)         unitsFailed++;
                if(aUnit == NA)           unitsNoAccess++;
                if(aUnit == NA_REINSP)    unitsNoAccRei++;
            }
            
			numberOfUnits = unitsNoViol + unitsFailed + unitsNoAccess + unitsNoAccRei;
			
            for(eachInsp in inspectionInfoTblArr){
                var inspRow = inspectionInfoTblArr[eachInsp];
                if(inspRow["Validated"] == "UNCHECKED"){
                    inspRow["# of Units Inspected"]         = numberOfUnits         + "";
                    inspRow["Units - Passed"]               = unitsNoViol           + "";
                    inspRow["Units - Failed"]               = unitsFailed           + "";
                    inspRow["Units - No Access"]            = unitsNoAccess         + "";
                    inspRow["Units - No Access/Re-Inspect"] = unitsNoAccRei + "";
                }
            }
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