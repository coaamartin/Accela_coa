/*
Script 			81
Record Types:   ​Water/Water/Wet Tap/Application
Event: 			ASA

Desc:          	for each row in Custom List "SIZE" set Complete to unchecked then Add  
				the Fees based on the tap size selections in the custom list “SIZE” as 
				follows(NOTE – Use the custom list column number of Taps as the 
				quantity input for that particular fee). Each row in the Custom List 
				should be a single Fee so that they could be paid separately

Created By: Silver Lining Solutions
*/
logDebug("Script 81 START");

// table name
var tableName = "SIZE";
var columnName ="Complete";

tempASIT = loadASITable(tableName);

for (var ea in tempASIT) 
{
	var row = tempASIT[ea];

	size 		= "" + row["Size"].fieldValue;
	quantity 	= "" + row["Number of Taps"].fieldValue;
	complete  	= "" + row["Complete"].fieldValue;
	
	logDebug("Size = " + size + " | quantity = " + quantity + " | complete = " + complete);
	
	if ( size == 'Tap Size 4" Main Line 6 to 12"')
		{updateFee("WETTAP_01","WAT_WETTAP","FINAL",quantity,"Y");}
	if ( size == 'Tap Size 4" Main Line 16 to 24"')
		{updateFee("WETTAP_02","WAT_WETTAP","FINAL",quantity,"Y");}
	if ( size == 'Tap Size 4" Main Line 30 to 36"')
		{updateFee("WETTAP_03","WAT_WETTAP","FINAL",quantity,"Y");}

	if ( size == 'Tap Size 6" Main Line 6 to 12"')
		{updateFee("WETTAP_04","WAT_WETTAP","FINAL",quantity,"Y");}
	if ( size == 'Tap Size 6" Main Line 16 to 24"')
		{updateFee("WETTAP_05","WAT_WETTAP","FINAL",quantity,"Y");}
	if ( size == 'Tap Size 6" Main Line 30 to 36"')
		{updateFee("WETTAP_06","WAT_WETTAP","FINAL",quantity,"Y");}

	if ( size == 'Tap Size 8" Main Line 8 to 12"')
		{updateFee("WETTAP_07","WAT_WETTAP","FINAL",quantity,"Y");}
	if ( size == 'Tap Size 8" Main Line 16 to 24"')
		{updateFee("WETTAP_08","WAT_WETTAP","FINAL",quantity,"Y");}
	if ( size == 'Tap Size 8" Main Line 30 to 36"')
		{updateFee("WETTAP_09","WAT_WETTAP","FINAL",quantity,"Y");}

	if ( size == 'Tap Size 12" Main Line 12"')
		{updateFee("WETTAP_10","WAT_WETTAP","FINAL",quantity,"Y");}
	if ( size == 'Tap Size 12" Main Line 16"')
		{updateFee("WETTAP_11","WAT_WETTAP","FINAL",quantity,"Y");}
	if ( size == 'Tap Size 12" Main Line 24 to 36"')
		{updateFee("WETTAP_12","WAT_WETTAP","FINAL",quantity,"Y");}

	if ( size == 'Tap Size 16" Main Line 16"')
		{updateFee("WETTAP_13","WAT_WETTAP","FINAL",quantity,"Y");}
	if ( size == 'Tap Size 16" Main Line 24"')
		{updateFee("WETTAP_14","WAT_WETTAP","FINAL",quantity,"Y");}
	if ( size == 'Tap Size 16" Main Line 30"')
		{updateFee("WETTAP_15","WAT_WETTAP","FINAL",quantity,"Y");}
	if ( size == 'Tap Size 16" Main Line 36"')
		{updateFee("WETTAP_16","WAT_WETTAP","FINAL",quantity,"Y");}

	if ( size == 'Tap Size 24" Main Line 16" Weld-on')
		{logDebug("24");updateFee("WETTAP_19","WAT_WETTAP","FINAL",quantity,"Y");}
	if ( size == 'Tap Size 30" Main Line 16" Weld-on')
		{logDebug("30");updateFee("WETTAP_20","WAT_WETTAP","FINAL",quantity,"Y");}
	if ( size == 'Tap Size 36" Main Line 16" Weld-on')
		          
		{logDebug("36");updateFee("WETTAP_21","WAT_WETTAP","FINAL",quantity,"Y");}
	

}
	

// Create a HashMap.
var searchConditionMap = aa.util.newHashMap(); // Map<columnName, List<columnValue>>

// Create a List object to add the value of Column.
var valuesList = aa.util.newArrayList();
valuesList.add("CHECKED");

searchConditionMap.put(columnName, valuesList);
var appSpecificTableInfo = aa.appSpecificTableScript.getAppSpecificTableInfo(capId, tableName, searchConditionMap/** Map<columnName, List<columnValue>> **/);
if (appSpecificTableInfo.getSuccess())
{
	comment("******Found Table");
	var appSpecificTableModel = appSpecificTableInfo.getOutput().getAppSpecificTableModel();
	var tableFields = appSpecificTableModel.getTableFields(); // List<BaseField>
	
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

			setUpdateColumnValue(updateRowsMap, rowID, "Complete", "UNCHECKED");
		}
		if (!updateRowsMap.isEmpty())
			{updateAppSpecificTableInfors(tableName, capId, updateRowsMap);}
	}	
}
	
logDebug("Script 81 END");

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
comment("in updateASTI");
	if (updateRowsMap == null || updateRowsMap.isEmpty())
	{
		return;
	}
	
	var asitTableScriptModel = aa.appSpecificTableScript.createTableScriptModel();
	var asitTableModel = asitTableScriptModel.getTabelModel();
	var rowList = asitTableModel.getRows();
	asitTableModel.setSubGroup(tableName);
	var rowIdArray = updateRowsMap.keySet().toArray();
	comment("rowIdArray.length = " + rowIdArray.length);
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


