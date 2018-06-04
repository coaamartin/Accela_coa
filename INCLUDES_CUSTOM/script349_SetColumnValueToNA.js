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

function script349_SetColumnValueToNA() {
	
	logDebug("script349_SetColumnValueToNA  started.");
	try{
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

		var appSpecificTableInfo = aa.appSpecificTableScript.getAppSpecificTableInfo(capIDModel, tableName, searchConditionMap/** Map<columnName, List<columnValue>> **/);
		if (appSpecificTableInfo.getSuccess())
		{
			comment("******Found Table");
			var appSpecificTableModel = appSpecificTableInfo.getOutput().getAppSpecificTableModel();
			var tableFields = appSpecificTableModel.getTableFields(); // List<BaseField>
			comment("tableField size = " + tableFields.size());
			if (tableFields != null && tableFields.size() > 0)
			{
				var updateRowsMap = aa.util.newHashMap(); // Map<rowID, Map<columnName, columnValue>>
				for (var i=0; i < tableFields.size(); i++)
				{
					comment ("on line --- i = " + i);
					var fieldObject = tableFields.get(i); // BaseField
					comment("fieldObject = " + fieldObject);
					
					//get the column name.
					var columnName = fieldObject.getFieldLabel();
					//get the value of column
					var columnValue = fieldObject.getInputValue();
					//get the row ID 
					var rowID = fieldObject.getRowIndex();
					comment(columnName + ": " + columnValue + "   rowID: " + rowID);
					
				//	setUpdateColumnValue(updateRowsMap, rowID, "Location", "NA");
				}
				if (!updateRowsMap.isEmpty())
				{
					//updateAppSpecificTableInfors(tableName, capIDModel, updateRowsMap);
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

