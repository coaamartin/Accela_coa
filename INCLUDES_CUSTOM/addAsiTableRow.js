/*
* ADDS ASIT ROW TO EXISTING TABLE 
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
        colsMapping = aa.util.newHashMap();;

    for(var idx in columnArray) {
        colsMapping.put(columnArray[idx].colName, columnArray[idx].colValue);
    }
    logDebug('addAsiTableRow(): inserting ASIT Row');
    asitFieldArray.push(colsMapping);
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

