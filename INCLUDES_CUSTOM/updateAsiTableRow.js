/*
* UPDATES A COLUMN FOR AN EXISTING ROW(S)
*  UPDATES ALL ROWS (BY DEFAULT) - SEE OPTIONS

    NOTE 1: Can only be used by rows added using the UI or addAsiTableRow()
    NOTE 2: Filters are additive
    */
function updateAsiTableRow(tableName, columnName, newValue, options) {
    var settings = {
        capId: capId,
        rowIndex: null, //0 based row index - null means update all rows
        colFilters: null //array of column values to filter by... null = update all rows
    };
    for (var attr in options) { settings[attr] = options[attr]; } //optional params - overriding default settings

    var row,
        val,
        rtn = false,
        asiTableRowIndexes = [];

    logDebug('updateAsiTableRow() starting');
    //first get existing rows - if available
    var asitTable = getAsiTableRows(tableName, {
        capId: settings.capId,
    })
  
    if(asitTable != null) { //found table
        asiTableRowIndexes = getAsiTableRowIndexes();
        filterRows();


        // if(settings.rowIndex != null && asitTable[settings.rowIndex] != null) { //update specific row
        //     row = asitTable[settings.rowIndex];
        //     val = row[columnName] ? row[columnName] : null;
        //     rtn = updAsiTableRow(asiTableRowIndexes[settings.rowIndex])
        // } else {    //update all rows  todo
        for (var ea in asitTable) {
            row = asitTable[ea];
            val = row[columnName] ? row[columnName] : null;
            rtn = updAsiTableRow(asiTableRowIndexes[ea])
        }
     //   }
        return true
    }
    return rtn;


    function filterRows() {
        var filteredRows = [],
        matched,
        filter;

        //filter by settings.rowIndex
        if(settings.rowIndex != null && asitTable[settings.rowIndex] != null) { //update specific row
            filteredRows.push(asitTable[settings.rowIndex]);
            asitTable = filteredRows;
        }

        //filter by settings.colFilters
        if(settings.colFilters != null && settings.colFilters.length > 0) {
            for(var idxRows in asitTable) {
                matched = true;
                for(var idxFilter in settings.colFilters) {
                    filter = settings.colFilters[idxFilter];
                    if(filter.colValue != asitTable[idxRows][filter.colName]) {
                        matched = false;
                    }
                }
                if(matched) {
                    filteredRows.push(asitTable[idxRows]);
                }
            }
            asitTable = filteredRows;
        } 
    }

    function getAsiTableRowIndexes() {
        var asiTableRowIndexes = [];
            appSpecificTableInfo = aa.appSpecificTableScript.getAppSpecificTableInfo(settings.capId, tableName, null);
        
        if (appSpecificTableInfo.getSuccess())
        {     
            appSpecificTableModel = appSpecificTableInfo.getOutput().getAppSpecificTableModel();
            var tableFields = appSpecificTableModel.getTableFields(); // List<BaseField>
            if (tableFields != null && tableFields.size() > 0)
            {
                var updateRowsMap = aa.util.newHashMap(); // Map<rowID, Map<columnName, columnValue>>
                for (var i=0; i < tableFields.size(); i++)
                {
                    var fieldObject = tableFields.get(i); // BaseField
                    //get the row ID 
                    var foRowIndex = fieldObject.getRowIndex();

                    if(asiTableRowIndexes.indexOf(foRowIndex) < 0) {
                        asiTableRowIndexes.push(foRowIndex)
                    }

                }
            }
        }
        return asiTableRowIndexes;	
    }

    /*
* ALLOWS UPDATING OF ONE COLUMN IN ONE ROW
 
    NOTE: Can only be used by rows added using the UI or addAsiTableRow()
*/
    function updAsiTableRow(rowIndex) {
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

                if(columnName == foColumnName && rowIndex == foRowIndex) {
                    setUpdateColumnValue(rowIndex);
                }
             }
            if (!updateRowsMap.isEmpty())
            {
                updateAppSpecificTableInfors();
            }
        }
        return true;	
    }
    return false;

    /** 
    /* Set update column value. format: Map<rowID, Map<columnName, columnValue>>
    **/
    function setUpdateColumnValue(rowIndex)
    {
        logDebug('setUpdateColumnValue(): rowIndex = ' + rowIndex + ', columnName = ' + columnName + ', columnValue = ' + newValue);
        var updateFieldsMap = updateRowsMap.get(rowIndex);
        if (updateFieldsMap == null)
        {
            updateFieldsMap = aa.util.newHashMap();
            updateRowsMap.put(rowIndex, updateFieldsMap);
        }
        updateFieldsMap.put(columnName, newValue);
    }

    /**
    * update ASIT rows data. updateRowsMap format: Map<rowID, Map<columnName, columnValue>>
    **/
    function updateAppSpecificTableInfors()
    {
    logDebug("in update STI");
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
        return aa.appSpecificTableScript.updateAppSpecificTableInfors(settings.capId, asitTableModel);
    }

    }

}

