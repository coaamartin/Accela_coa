/* update asit rows based on criteria of one column and one value
 * @updateArray - an array of columns and values to update.
 */
function updateASITRows(tableName, colName, colValue, updateArray){
	logDebug("Updating Asi Rows");
	aa.print("Updating:");
	aa.print("tableName:" + tableName);
	aa.print("colName:" + colName);
	aa.print("colValue:" + colValue);
	var itemCap = capId
    if (arguments.length > 4)
        itemCap = arguments[4]; // use cap ID specified in args
	
	
	aa.print("itemCap:" + itemCap);
	
	var rowsUpdated = 0;
	var tRows = loadASITable(tableName, itemCap);
	
	for(eachRow in tRows){
		var aRow = tRows[eachRow];
		aa.print("aRow[colName]:" + aRow[colName]);
		if(aRow[colName] == colValue){
			for(i in updateArray){
				aRow[i] = updateArray[i];		
			}
			rowsUpdated++;
		}
	}
	
	if(rowsUpdated > 0){
		removeASITable(tableName, itemCap);
		addASITable(tableName, tRows, itemCap);
		return true;
	}
	
	if(rowsUpdated == 0) return false;
}