function createPPBMPRecord(workFlowTask, workflowStatusArray, asitNames) {
    logDebug("createPPBMPRecord() started");
    try{
        //In case the permit is issued from other event, we hard code the task and status.
        if(vEventName != "WorkflowTaskUpdateAfter"){
            logDebug("Event name is not WTUA");
            wfTask = "Permit Issud";
            wfStatus = "Complete";
        }
        //Print the condition to the debug to see if it's true;
        if (ifTracer(wfTask == workFlowTask, wfTask + " == " + workFlowTask)) {
        
            var statusMatch = false;
        
            for (s in workflowStatusArray) {
                if (wfStatus == workflowStatusArray[s]) {
                    statusMatch = true;
                    break;
                }
            }//for all status options
        
            if (!statusMatch) {
                logDebug("createPPBMPRecord() ended: no match");
                return false;
            }
        
            var childCapId = createChild("Water", "Water", "SWMP", "Permit", "");
            
            if(childCapId){
                copyOwner(capId, childCapId);
                copyAppSpecific(childCapId);
                updateAppStatus("Issued", "", childCapId);
                var thirtyDaysAhead = nextWorkDay(dateAdd(null, 30));
                var days4Insp = days_between(aa.util.parseDate(dateAdd(null, 0)), aa.util.parseDate(thirtyDaysAhead));
        
                scheduleInspectionCustom4CapId(childCapId, "Routine Inspections", days4Insp);
                
                //update Renewal status and date
                var vExpDate = new Date();
                var vNewExpDate = new Date(vExpDate.getFullYear() + 1, vExpDate.getMonth(), vExpDate.getDate());
                var rB1ExpResult = aa.expiration.getLicensesByCapID(childCapId).getOutput();
                rB1ExpResult.setExpDate(aa.date.getScriptDateTime(vNewExpDate));
                rB1ExpResult.setExpStatus("Active");
                aa.expiration.editB1Expiration(rB1ExpResult.getB1Expiration());
                
                // var parents = getParents("PublicWorks/Civil Plan/Review/NA")
                // if(!parents || parents.length == 0){
                //     logDebug("**WARN no parents found for record, capId=" + capId + ", altId=" + capIDString);
                //     logDebug("createPPBMPRecord() ended: no parent");
                //     return ;
                // }
                // recordParentCapId = parents[0];
                for(var idx in asitNames) {
                    var tbl = loadASITable(asitNames[idx], capId);
                    if (!tbl) {
                        logDebug("Parent " + capId.getCustomID() + " has no " + asitNames[idx] + " table");
                        logDebug("createPPBMPRecord() ended: no ASIT On parent");
                        return ;
                    }
                    
                    addASITable(asitNames[idx], tbl, childCapId);
                }
           
            }
        } else {
            logDebug("createPPBMPRecord() ended: wfTask No Match");
            return false;
        }
        logDebug("createPPBMPRecord() ended");
        return true;
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function (). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function (). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
}
