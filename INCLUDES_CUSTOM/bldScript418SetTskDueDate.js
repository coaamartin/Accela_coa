function bldScript418SetTskDueDate(){
    logDebug("bldScript418SetTskDueDate() started");
    try{
        var taskToUpdateDueDte = [];
        var daysForDueDate = 0;
        
        if(appMatch("Building/Permit/New Building/NA")){
            var projCat = AInfo["Project Category"];
            
            if(projCat == "Custom Home"){
                taskToUpdateDueDte.push("Structural Plan Review","Electrical Plan Review","Mechanical Plan Review","Plumbing Plan Review","Structural Engineering Review","Bldg Life Safety Review","Fire Life Safety Review");
                daysForDueDate = 21;
            }
            
            if(matches(projCat, "Assembly Building","Business Use Building","Factory Use Building","Group E Building","Group U Building",
                                "Hotel Building","Institutional Use Building","Mercantile Use Building","Non-Res Addition",
                                "Storage Use Building","Multi-Family Building")){
                taskToUpdateDueDte.push("Structural Plan Review","Electrical Plan Review","Mechanical Plan Review","Plumbing Plan Review","Structural Engineering Review","Bldg Life Safety Review","Fire Life Safety Review")
                daysForDueDate = 26;
            }
            
            if(projCat == "Single Family From Master"){
                taskToUpdateDueDte.push("Structural Plan Review");
                daysForDueDate = 7;
            }
        }
        
        if(appMatch("Building/Permit/Master/NA")){
            var masterPlnTyp = AInfo["Master Plan Type"];
            
            if(masterPlnTyp != "Other"){
                taskToUpdateDueDte.push("Structural Plan Review","Electrical Plan Review","Mechanical Plan Review","Plumbing Plan Review","Structural Engineering Review","Bldg Life Safety Review","Fire Life Safety Review");
                daysForDueDate = 21;
            }
        }
        
        if(taskToUpdateDueDte.length > 0)
            for(tsk in taskToUpdateDueDte)
                editTaskDueDate(taskToUpdateDueDte[tsk], dateAdd(wfDateMMDDYYYY, daysForDueDate, true))
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function bldScript418SetTskDueDate(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function bldScript418SetTskDueDate(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("bldScript418SetTskDueDate() ended");
}//END bldScript418SetTskDueDate()