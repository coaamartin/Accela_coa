/*
* ALLOWS UPDATING OF ONE COLUMN IN ONE ROW
    THIS IS FOR WHEN YOU ALREADY KNW THE CURRENT-VALUE 
    USE updateAsiTableRows() IF YOU DON'T KNOW THE CURRENT VALUE
*/
function updateAsiTableRow(tableName, columnName, curValue, newValue, rowIndex, options) {
    var settings = {
        capId: capId,
    };
    for (var attr in options) { settings[attr] = options[attr]; } //optional params - overriding default settings

    // logDebug('updateAsiTableRow() starting');
    // var searchConditionMap = aa.util.newHashMap(); // Map<columnName, List<columnValue>>
    // // Create a List object to add the value of Column.
    // var valuesList = aa.util.newArrayList();
    // valuesList.add(curValue);
    // searchConditionMap.put(columnName, valuesList);
    // printObjProps(searchConditionMap);
    
  //  var appSpecificTableInfo = aa.appSpecificTableScript.getAppSpecificTableInfo(settings.capId, tableName, searchConditionMap/** Map<columnName, List<columnValue>> **/);
    var appSpecificTableInfo = aa.appSpecificTableScript.getAppSpecificTableInfo(settings.capId, tableName, null);
    if (appSpecificTableInfo.getSuccess())
    {
        var appSpecificTableModel = appSpecificTableInfo.getOutput().getAppSpecificTableModel();
        var tableFields = appSpecificTableModel.getTableFields(); // List<BaseField>
        if (tableFields != null && tableFields.size() > 0)
        {
            var updateRowsMap = aa.util.newHashMap(); // Map<rowID, Map<columnName, columnValue>>
            for (var i=0; i < tableFields.size(); i++)
            {
                var fieldObject = tableFields.get(i); // BaseField
                //get the column name.
                var foColumnName = fieldObject.getFieldLabel();
                //get the value of column
                var foColumnValue = fieldObject.getInputValue();
                //get the row ID 
                var foRowIndex = fieldObject.getRowIndex();

                if(i == 0) { logDebug('updateAsiTableRow(): foRowIndex = ' + foRowIndex); }
                //logDebug(columnName + ": " + foColumnName + "   rowIndex: " + foRowIndex);
                if(columnName == foColumnName && rowIndex == foRowIndex) {
                    setUpdateColumnValue(updateRowsMap, foRowIndex, columnName, newValue);
                }
             }
            if (!updateRowsMap.isEmpty())
            {
                updateAppSpecificTableInfors(tableName, settings.capId, updateRowsMap);
            }
        }
        return true;	
    }
    return false;

    /** 
    /* Set update column value. format: Map<rowID, Map<columnName, columnValue>>
    **/
    function setUpdateColumnValue(updateRowsMap, rowID, columnName, columnValue)
    {
        logDebug('setUpdateColumnValue(): rowID = ' + rowID + ', columnName = ' + columnName + ', columnValue = ' + columnValue);
        var updateFieldsMap = updateRowsMap.get(rowID);
        if (updateFieldsMap == null)
        {
            logDebug('setUpdateColumnValue(): updateFieldsMap == null')
            updateFieldsMap = aa.util.newHashMap();
            updateRowsMap.put(rowID, updateFieldsMap);
        }
        updateFieldsMap.put(columnName, columnValue);
    }

    /**
    * update ASIT rows data. updateRowsMap format: Map<rowID, Map<columnName, columnValue>>
    **/
    function updateAppSpecificTableInfors(tableName, capId, updateRowsMap/** Map<rowID, Map<columnName, columnValue>> **/)
    {
    logDebug("in updateA STI");
        if (updateRowsMap == null || updateRowsMap.isEmpty())
        {
            return;
        }
        
        var asitTableScriptModel = aa.appSpecificTableScript.createTableScriptModel();
        var asitTableModel = asitTableScriptModel.getTabelModel();
        var rowList = asitTableModel.getRows();
        asitTableModel.setSubGroup(tableName);
        var rowIdArray = updateRowsMap.keySet().toArray();
        logDebug("rowIdArray.length = " + rowIdArray.length);
        for (var i = 0; i < rowIdArray.length; i++)
        {
            var rowScriptModel = aa.appSpecificTableScript.createRowScriptModel();
            var rowModel = rowScriptModel.getRow();
            rowModel.setFields(updateRowsMap.get(rowIdArray[i]));
            rowModel.setId(rowIdArray[i]);
            rowList.add(rowModel);
        }
      //  return aa.appSpecificTableScript.updateAppSpecificTableInfors(settings.capId, asitTableModel);
        aa.appSpecificTableScript.deletedAppSpecificTableInfors(settings.capId, asitTableModel); 
        aa.appSpecificTableScript.addAppSpecificTableInfors(settings.capId, asitTableModel);
    }

}
