// For Housing Incident 
function enfScript350_archiveInspInformation(){
    logDebug("enfScript350_archiveInspInformation() started.");
    try{
        var inspInfoTable = loadASITable("INSPECTION INFORMATION");
        var inspInfoTArchive = "INSP INFORMATION ARCHIVE";
        var rowFieldArray = [];
        
        logDebug("Moving everything from INSPECTION INFORMATION to INSP INSPECTION ARCHIVE");
        for(each in inspInfoTable) {
            
            var aRow = inspInfoTable[each];
            var fieldRow = aa.util.newHashMap();
            
            for(colName in aRow) fieldRow.put(colName, aRow[colName] + "");
            
            rowFieldArray.push(fieldRow);
            
        }
        
        var updateRes = addAppSpecificTableInforsCustom(inspInfoTArchive, capId, rowFieldArray);
        
        removeASITable("INSPECTION INFORMATION");   
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function enfScript350_archiveInspInformation(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function enfScript350_archiveInspInformation(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("enfScript350_archiveInspInformation() ended.");
}//END enfScript350_archiveInspInformation()
