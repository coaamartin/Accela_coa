/*
* ALLOWS ADDING OF MULTIPLE COLUMNS IN ONE ROW
    columnArray = [
        { colName: 'Abatement #', colValue: capIDString },
        { colName: 'Type', colValue: 'Snow' }
    ]
*/
function addAsiTableRow(tableName, columnArray, options) {
    var settings = {
        capId: capId,
    };
    for (var attr in options) { settings[attr] = options[attr]; } //optional params - overriding default settings
  
    var asitFieldArray = [],
        col;

    for(var idx in columnArray) {
        col = aa.util.newHashMap();
        col.put(columnArray[idx].colName, columnArray[idx].colValue);
    }
    logDebug('addAsiTableRow(): inserting ASIT Row');
    asitFieldArray.push(col);
    addAppSpecificTableInfors();


    function addAppSpecificTableInfors() {
        var asitTableScriptModel = aa.appSpecificTableScript.createTableScriptModel();
        var asitTableModel = asitTableScriptModel.getTabelModel();
        var rowList = asitTableModel.getRows();
        asitTableModel.setSubGroup(tableName);
        for (var i = 0; i < asitFieldArray.length; i++) {
            var rowScriptModel = aa.appSpecificTableScript.createRowScriptModel();
            var rowModel = rowScriptModel.getRow();
            rowModel.setFields(asitFieldArray[i]);
            rowList.add(rowModel);
        }
        logDebug('addAppSpecificTableInfors(): inserting ASIT Row');
        return aa.appSpecificTableScript.addAppSpecificTableInfors(settings.capId, asitTableModel);
    }

}

