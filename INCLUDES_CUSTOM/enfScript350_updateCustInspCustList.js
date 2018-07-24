function enfScript350_updateCustInspCustList(){
    logDebug("enfScript350_updateCustInspCustList() started");
    try{
        var $iTrc = ifTracer;
        var inspsTable = "INSPECTION INFORMATION";
        var iTypeColValue = "";
        var tableArr = [];
        var rowExists = false;
        
        tableArr = loadASITable(inspsTable);
        
        if($iTrc(tableArr, 'tableArrx')){
            for(eachRow in tableArr){
                var aRow = tableArr[eachRow];
                for(col in aRow){
					aa.print("col: " + col + ":" + aRow[col]);
					aa.print(col == "Inspection Type");
					aa.print(inspType.equals(aRow[col]));
                    if(col == "Inspection Type" && inspType.equals(aRow[col])) rowExists = true;
				}
            }
        }
        
        var row = [{colName: 'Inspection Type', colValue: inspType},
                   {colName: 'Inspection Date', colValue: formatDteStringToMMDDYYYY(inspSchedDate)}];
        
        if($iTrc(!rowExists, 'row does not exits, inserting it'))   
            addAsiTableRow(inspsTable, row);
        if($iTrc(rowExists, 'row exists, updating the "Inspection Date"'))
            updateAsiTableRow(inspsTable, 'Inspection Date', formatDteStringToMMDDYYYY(inspSchedDate))
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function enfScript350_updateCustInspCustList(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function enfScript350_updateCustInspCustList(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("enfScript350_updateCustInspCustList() ended");
}//END enfScript350_updateCustInspCustList();