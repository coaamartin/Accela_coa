/* update asit rows based on criteria of one column and one value
 * @updateArray - an array of columns and values to update.
 */
function updateASITRows(tableName, colName, colValue, updateArray){
	logDebug("Updating Asi Rows");
	var itemCap = capId
    if (arguments.length > 4)
        itemCap = arguments[4]; // use cap ID specified in args
	
	var rowsUpdated = 0;
	var tRows = loadASITable(tableName, itemCap);
	
	for(eachRow in tRows){
		var aRow = tRows[eachRow];
		
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