/*
* ALLOWS UPDATING OF ONE COLUMN IN ONE OR MORE ROWS 
    CALLS BY updateAsiTableRow() 
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
            rtn = updateAsiTableRow(tableName, columnName, val, newValue, settings.rowIndex, settings)
        } else {    //update all rows
            for (var ea in asitTable) {
                row = asitTable[ea];
                val = row[columnName] ? row[columnName] : null;
                rtn = updateAsiTableRow(tableName, columnName, val, newValue, ea, settings)
            }
        }
        return true
    }
    return rtn;
}

