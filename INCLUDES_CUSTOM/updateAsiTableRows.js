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
        rtn = false,
        asiTableRowIndexes = [];

    logDebug('updateAsiTableRows() starting');
    //first get existing rows - if available
    var asitTable = getAsiTableRows(tableName, {
        capId: settings.capId,
    })

    if(asitTable) { //found table
        asiTableRowIndexes = getAsiTableRowIndexes();
        if(settings.rowIndex != null && asitTable[settings.rowIndex] != null) { //update specific row
            row = asitTable[settings.rowIndex];
            val = row[columnName] ? row[columnName] : null;
            rtn = updateAsiTableRow(tableName, columnName, newValue, asiTableRowIndexes[settings.rowIndex], settings)
        } else {    //update all rows
            for (var ea in asitTable) {
                row = asitTable[ea];
                val = row[columnName] ? row[columnName] : null;
                rtn = updateAsiTableRow(tableName, columnName, newValue, asiTableRowIndexes[ea], settings)
            }
        }
        return true
    }
    return rtn;

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


}

