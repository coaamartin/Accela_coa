/*
* ALLOWS UPDATING OF ONE COLUMN OF ALL ROWS 

    NOTE: Can only be used by rows added using the UI or addAsiTableRow()
*/
function updateAsiTableRows(tableName, columnName, newValue, options) {
    var settings = {
        capId: capId,
        rowIndex: null //0 based row index - null means update all rows
    };
    for (var attr in options) { settings[attr] = options[attr]; } //optional params - overriding default settings

    var row,
        val,
        rtn = false;

    logDebug('updateAsiTableRows() starting');
    //first get existing rows - if available
    var asitTable = getAsiTableRows(tableName, {
        capId: settings.capId,
    })

    if(asitTable) { //found table
        if(settings.rowIndex != null && asitTable[settings.rowIndex] != null) { //update specific row
            row = asitTable[settings.rowIndex];
            val = row[columnName] ? row[columnName] : null;
            rtn = updateAsiTableRow(tableName, columnName, newValue, settings)
        } else {    //update all rows
            for (var ea in asitTable) {
                row = asitTable[ea];
                val = row[columnName] ? row[columnName] : null;
                rtn = updateAsiTableRow(tableName, columnName, newValue, settings)
            }
        }
        return true
    }
    return rtn;

    // function convertUserRowIndexToTableRowIndex() {
    //     var asitTableScriptModel = aa.appSpecificTableScript.createTableScriptModel();
    //     var asitTableModel = asitTableScriptModel.getTabelModel();
    //     var rowList = asitTableModel.getRows();
    //     asitTableModel.setSubGroup(tableName);
     
        
    //     for (var i = 0; i < rowIdArray.length; i++)
    //     {
    //         var rowScriptModel = aa.appSpecificTableScript.createRowScriptModel();
    //         var rowModel = rowScriptModel.getRow();
    //         rowModel.setFields(updateRowsMap.get(rowIdArray[i]));
    //         rowModel.setId(rowIdArray[i]);
    //         rowList.add(rowModel);
    //     }
    // }


    // function updateAsiTableRow(tableName, columnName, newValue, options) {
    //     var settings = {
    //         capId: capId,
    //     };
    //     for (var attr in options) { settings[attr] = options[attr]; } //optional params - overriding default settings
    
    //     var appSpecificTableInfo = aa.appSpecificTableScript.getAppSpecificTableInfo(settings.capId, tableName, null);
    //     if (appSpecificTableInfo.getSuccess())
    //     {
    //         var appSpecificTableModel = appSpecificTableInfo.getOutput().getAppSpecificTableModel();
    //         var tableFields = appSpecificTableModel.getTableFields(); // List<BaseField>
    //         if (tableFields != null && tableFields.size() > 0)
    //         {
    //             var updateRowsMap = aa.util.newHashMap(); // Map<rowID, Map<columnName, columnValue>>
    //             for (var i=0; i < tableFields.size(); i++)
    //             {
    //                 var fieldObject = tableFields.get(i); // BaseField
    //                 //get the column name.
    //                 var foColumnName = fieldObject.getFieldLabel();
    //                 //get the value of column
    //                 var foColumnValue = fieldObject.getInputValue();
    //                 //get the row ID 
    //                 var foRowIndex = fieldObject.getRowIndex();
    
    //                 if(i == 0) { logDebug('updateAsiTableRow(): foRowIndex = ' + foRowIndex); }
    //                 if(columnName == foColumnName) {
    //                     setUpdateColumnValue(updateRowsMap, foRowIndex, columnName, newValue);
    //                 }
    //              }
    //             if (!updateRowsMap.isEmpty())
    //             {
    //                 updateAppSpecificTableInfors(tableName, settings.capId, updateRowsMap);
    //             }
    //         }
    //         return true;	
    //     }
    //     return false;
    
    //     /** 
    //     /* Set update column value. format: Map<rowID, Map<columnName, columnValue>>
    //     **/
    //     function setUpdateColumnValue(updateRowsMap, rowID, columnName, columnValue)
    //     {
    //         logDebug('setUpdateColumnValue(): rowID = ' + rowID + ', columnName = ' + columnName + ', columnValue = ' + columnValue);
    //         var updateFieldsMap = updateRowsMap.get(rowID);
    //         if (updateFieldsMap == null)
    //         {
    //             logDebug('setUpdateColumnValue(): updateFieldsMap == null')
    //             updateFieldsMap = aa.util.newHashMap();
    //             updateRowsMap.put(rowID, updateFieldsMap);
    //         }
    //         updateFieldsMap.put(columnName, columnValue);
    //     }
    
    //     /**
    //     * update ASIT rows data. updateRowsMap format: Map<rowID, Map<columnName, columnValue>>
    //     **/
    //     function updateAppSpecificTableInfors(tableName, capId, updateRowsMap/** Map<rowID, Map<columnName, columnValue>> **/)
    //     {
    //     logDebug("in update STI");
    //         if (updateRowsMap == null || updateRowsMap.isEmpty())
    //         {
    //             return;
    //         }
            
    //         var asitTableScriptModel = aa.appSpecificTableScript.createTableScriptModel();
    //         var asitTableModel = asitTableScriptModel.getTabelModel();
    //         var rowList = asitTableModel.getRows();
    //         asitTableModel.setSubGroup(tableName);
    //         var rowIdArray = updateRowsMap.keySet().toArray();
    //         logDebug("rowIdArray.length = " + rowIdArray.length);
    //         for (var i = 0; i < rowIdArray.length; i++)
    //         {
    //             var rowScriptModel = aa.appSpecificTableScript.createRowScriptModel();
    //             var rowModel = rowScriptModel.getRow();
    //             rowModel.setFields(updateRowsMap.get(rowIdArray[i]));
    //             rowModel.setId(rowIdArray[i]);
    //             rowList.add(rowModel);
    //         }
    //         return aa.appSpecificTableScript.updateAppSpecificTableInfors(settings.capId, asitTableModel);
    //     }
    
    // }

}

