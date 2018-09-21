// Script 350
function wtrScript350_archiveLists(){
    try{
        var bldgIv = loadASITable("BUILDING INSPECTION VIOLATIONS");
        var unitIv = loadASITable("UNIT INSPECTION VIOLATIONS");
        var archiveTable = "BDG INSP VIOLATIONS ARCHIVE";
        var unitArchTable = "UNIT INSP VIOLATIONS ARCHIVE";
        var col2Check = "Corrected";
        var val2Check = "Yes";
        var searchConditionMap = aa.util.newHashMap(); // Map<columnName, List<columnValue>>
        // Create a List object to add the value of Column.
        var columnName = col2Check;
        var valuesList = aa.util.newArrayList();
        valuesList.add(val2Check);
        searchConditionMap.put(columnName, valuesList);
        
        
        /*****************************************************************************************/
        /* BUILDING INSPECTION VIOLATIONS                                                        */
        /*****************************************************************************************/
        
        logDebug("Copying from BUILDING INSPECTION VIOLATIONS to archive table");
        for(each in bldgIv) {
            var aRow = bldgIv[each];
            
            if(aRow[col2Check] == val2Check){
                var rowFieldArray = [];
                var fieldRow = aa.util.newHashMap();
                fieldRow.put("Inspection Type", inspType);
                fieldRow.put("Inspection Result Date", formatToMMDDYYYY(new Date(inspResultDate)));
                fieldRow.put("Bldg #", aRow["Bldg #"] + "");
                fieldRow.put("Area", aRow["Area"] + "");
                fieldRow.put("Object", aRow["Object"] + "");
                fieldRow.put("Location", aRow["Location"] + "");
                fieldRow.put("Location 2", aRow["Location 2"] + "");
                fieldRow.put("Violation", aRow["Violation"] + "");
                fieldRow.put("24 Hour", aRow["24 Hour"] + "");
                fieldRow.put("Notes", aRow["Notes"] + "");
                fieldRow.put("Corrected", aRow["Corrected"] + "");
                fieldRow.put("Charged?", aRow["Charged?"] + "");
                rowFieldArray.push(fieldRow);
                
                addAppSpecificTableInforsCustom(archiveTable, capId, rowFieldArray);    
            }
        }
        
        var tableName = "BUILDING INSPECTION VIOLATIONS";
        
        var appSpecificTableInfo = aa.appSpecificTableScript.getAppSpecificTableInfo(capIdModel, tableName, searchConditionMap/** Map<columnName, List<columnValue>> **/);
        if (appSpecificTableInfo.getSuccess())
        {
            var appSpecificTableModel = appSpecificTableInfo.getOutput().getAppSpecificTableModel();
            var tableFields = appSpecificTableModel.getTableFields(); // List
            if (tableFields != null && tableFields.size() > 0)
            {
                var deleteIDsArray = []; // delete ASIT data rows ID
                for(var i=0; i < tableFields.size(); i++)
                {
                    var fieldObject = tableFields.get(i); // BaseField
                    // get the column name.
                    var columnName = fieldObject.getFieldLabel();
                    // get the value of column
                    var columnValue = fieldObject.getInputValue();
                    // get the row ID 
                    var rowID = fieldObject.getRowIndex();
                    logDebug(columnName + ": " + columnValue + "   rowID: " + rowID);
                    if (!contains(deleteIDsArray, rowID))
                    {
                        deleteIDsArray.push(rowID);
                    }
                }
                deletedAppSpecificTableInfors(tableName, capIdModel, deleteIDsArray);
            }   
        }
        
        /*****************************************************************************************/
        /* UNIT INPSPECTION VIOLATIONS                                                           */
        /*****************************************************************************************/
        
        logDebug("Copying from UNIT INPSPECTION VIOLATIONS to archive table");
        for(each in unitIv) {
            var aRow = unitIv[each];
            
            if(aRow[col2Check] == val2Check){
                var rowFieldArray = [];
                var fieldRow = aa.util.newHashMap();
                fieldRow.put("Inspection Type", inspType);
                fieldRow.put("Inspection Result Date", formatToMMDDYYYY(new Date(inspResultDate)));
                fieldRow.put("Bldg #", aRow["Bldg #"] + "");
                fieldRow.put("Unit #", aRow["Unit #"] + "");
                fieldRow.put("Room", aRow["Room"] + "");
                fieldRow.put("Object", aRow["Object"] + "");
                fieldRow.put("Location", aRow["Location"] + "");
                fieldRow.put("Violation", aRow["Violation"] + "");
                fieldRow.put("Notes", aRow["Notes"] + "");
                fieldRow.put("Corrected", aRow["Corrected"] + "");
                rowFieldArray.push(fieldRow);
                
                addAppSpecificTableInforsCustom(unitArchTable, capId, rowFieldArray);    
            }
        }
        
        var unitViolTn = "UNIT INSPECTION VIOLATIONS";
        
        var appSpecificTableInfo = aa.appSpecificTableScript.getAppSpecificTableInfo(capIdModel, unitViolTn, searchConditionMap/** Map<columnName, List<columnValue>> **/);
        if (appSpecificTableInfo.getSuccess())
        {
            var appSpecificTableModel = appSpecificTableInfo.getOutput().getAppSpecificTableModel();
            var tableFields = appSpecificTableModel.getTableFields(); // List
            if (tableFields != null && tableFields.size() > 0)
            {
                var deleteIDsArray4Unit = []; // delete ASIT data rows ID
                for(var i=0; i < tableFields.size(); i++)
                {
                    var fieldObject = tableFields.get(i); // BaseField
                    // get the column name.
                    var columnName = fieldObject.getFieldLabel();
                    // get the value of column
                    var columnValue = fieldObject.getInputValue();
                    // get the row ID 
                    var rowID = fieldObject.getRowIndex();
                    logDebug(columnName + ": " + columnValue + "   rowID: " + rowID);
                    if (!contains(deleteIDsArray4Unit, rowID))
                    {
                        deleteIDsArray4Unit.push(rowID);
                    }
                }
                deletedAppSpecificTableInfors(unitViolTn, capIdModel, deleteIDsArray4Unit);
            }   
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function wtrScript350_archiveLists(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function wtrScript350_archiveLists(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
}//END wtrScript350_archiveLists()