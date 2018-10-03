
/**
* Add ASIT rows data, format: Array[Map<columnName, columnValue>]
**/
function addAppSpecificTableInforsCustom(tableName, capIDModel, asitFieldArray/** Array[Map<columnName, columnValue>] **/)
{
    if (asitFieldArray == null || asitFieldArray.length == 0)
    {
        return;
    }

    var asitTableScriptModel = aa.appSpecificTableScript.createTableScriptModel();
    var asitTableModel = asitTableScriptModel.getTabelModel();
    var rowList = asitTableModel.getRows();
    asitTableModel.setSubGroup(tableName);
    for (var i = 0; i < asitFieldArray.length; i++)
    {
        var rowScriptModel = aa.appSpecificTableScript.createRowScriptModel();
        var rowModel = rowScriptModel.getRow();
        rowModel.setFields(asitFieldArray[i]);
        rowList.add(rowModel);
    }
    return aa.appSpecificTableScript.addAppSpecificTableInfors(capIDModel, asitTableModel);
}