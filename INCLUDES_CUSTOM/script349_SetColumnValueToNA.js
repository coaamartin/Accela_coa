//script349_SetColumnValueToNA
//Record Types:	Enforcement/Housing/Inspection/NA
//Event: ASIUA
//Desc: ASIUA - when custom list field "Room" 
//     (Subgroup - "UNIT INSPECTION VIOLATIONS") is set to: 
//     (No Violation; Dog on Premises; Lockout; Tenant Refusal; RBR; 
//     Tenant Ill - Pass; Tenant Ill - Reinspect), then make custom 
//     list fields (Object; Location; and Violation) set to "NA" even 
//     if any one of the fields has a value (NOT Null) when saved. 
//     Enforcement/Housing/Inspection/NA
//
//Created By: Silver Lining Solutions

/**
* Set update column value. format: Map<rowID, Map<columnName, columnValue>>
**/
function setUpdateColumnValue(updateRowsMap/** Map<rowID, Map<columnName, columnValue>> **/, rowID, columnName, columnValue)
{
	var updateFieldsMap = updateRowsMap.get(rowID);
	if (updateFieldsMap == null)
	{
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
	if (updateRowsMap == null || updateRowsMap.isEmpty())
	{
		return;
	}
	
	var asitTableScriptModel = aa.appSpecificTableScript.createTableScriptModel();
	var asitTableModel = asitTableScriptModel.getTabelModel();
	var rowList = asitTableModel.getRows();
	asitTableModel.setSubGroup(tableName);
	var rowIdArray = updateRowsMap.keySet().toArray();
	for (var i = 0; i < rowIdArray.length; i++)
	{
		var rowScriptModel = aa.appSpecificTableScript.createRowScriptModel();
		var rowModel = rowScriptModel.getRow();
		comment("rowIdArray[i] = " + rowIdArray[i]);
		rowModel.setFields(updateRowsMap.get(rowIdArray[i]));
		rowModel.setId(rowIdArray[i]);
		rowList.add(rowModel);
	}
	return aa.appSpecificTableScript.updateAppSpecificTableInfors(capId, asitTableModel);
}




function script349_SetColumnValueToNA() {
	
	logDebug("script349_SetColumnValueToNA  started.");
	try{
		//var capIDModel = aa.cap.getCapIDModel(capId.ID1,capId.ID2,capId.ID3).getOutput();

		// table name
		var tableName = "UNIT INSPECTION VIOLATIONS";
		var columnName ="Room";

		// Create a HashMap.
		var searchConditionMap = aa.util.newHashMap(); // Map<columnName, List<columnValue>>

		// Create a List object to add the value of Column.
		var valuesList = aa.util.newArrayList();
		valuesList.add("No Violation");
		valuesList.add("Dog on Premises");
		valuesList.add("Lockout");
		valuesList.add("Tenent Refusal");
		valuesList.add("R. B. R.");
		valuesList.add("Tenent Ill - Pass");
		valuesList.add("Tenent Ill - Reinspect");

		searchConditionMap.put(columnName, valuesList);

		//var appSpecificTableInfo = aa.appSpecificTableScript.getAppSpecificTableInfo(capIDModel, tableName, searchConditionMap/** Map<columnName, List<columnValue>> **/);
		var appSpecificTableInfo = aa.appSpecificTableScript.getAppSpecificTableInfo(capId, tableName, searchConditionMap/** Map<columnName, List<columnValue>> **/);
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
					var columnName = fieldObject.getFieldLabel();
					//get the value of column
					var columnValue = fieldObject.getInputValue();
					//get the row ID 
					var rowID = fieldObject.getRowIndex();
					
					setUpdateColumnValue(updateRowsMap, rowID, "Location", "NA");
					setUpdateColumnValue(updateRowsMap, rowID, "Violation", "NA");
					setUpdateColumnValue(updateRowsMap, rowID, "Object", "NA");
				}
				if (!updateRowsMap.isEmpty())
				{
					updateAppSpecificTableInfors(tableName, capId, updateRowsMap);
				}
			}	
		}

		
	
	} catch(err){
		showMessage = true;
		comment("Error on custom function script349_SetColumnValueToNA . Please contact administrator. Err: " + err);
		logDebug("Error on custom function script349_SetColumnValueToNA . Please contact administrator. Err: " + err);
		logDebug("A JavaScript Error occurred: WTUA:Building/Permit/*/* 208: " + err.message);
		logDebug(err.stack)
	}
	logDebug("script349_SetColumnValueToNA  ended.");

}

