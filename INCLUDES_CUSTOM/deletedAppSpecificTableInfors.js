
/**
* Delete ASIT rows data by rowID, format: Array[rowID]
**/
function deletedAppSpecificTableInfors(tableName, capIDModel, deleteIDsArray/** Array[rowID] **/)
{
	if (deleteIDsArray == null || deleteIDsArray.length == 0)
	{
		return;
	}
	
	var asitTableScriptModel = aa.appSpecificTableScript.createTableScriptModel();
	var asitTableModel = asitTableScriptModel.getTabelModel();
	var rowList = asitTableModel.getRows();
	asitTableModel.setSubGroup(tableName);
	for (var i = 0; i < deleteIDsArray.length; i++)
	{
		var rowScriptModel = aa.appSpecificTableScript.createRowScriptModel();
		var rowModel = rowScriptModel.getRow();
		rowModel.setId(deleteIDsArray[i]);
		rowList.add(rowModel);
	}
	return aa.appSpecificTableScript.deletedAppSpecificTableInfors(capIDModel, asitTableModel);
}	