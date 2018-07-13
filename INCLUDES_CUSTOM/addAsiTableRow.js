/*
* ALLOWS ADDING OF MULTIPLE COLUMNS IN ONE ROW
    columnArray = [
        { columnName: 'Abatement #', fieldValue: capIDString },
        { columnName: 'Type', fieldValue: 'Snow' }
    ]
*/
function addAsiTableRow(tableName, columnArray, options) {
    var settings = {
        capId: capId,
    };
    for (var attr in options) { settings[attr] = options[attr]; } //optional params - overriding default settings
  
    var asitFieldArray = [];
    for(var idx in columnArray) {
        var col = aa.util.newHashMap();
        col.put(columnArray[idx].columnName, columnArray[idx].fieldValue);
        asitFieldArray.push(col);
    }

    // add asit data
    if(asitFieldArray.length > 0) {
        addAppSpecificTableInfors();
    }


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
        return aa.appSpecificTableScript.addAppSpecificTableInfors(settings.capId, asitTableModel);
    }

}

