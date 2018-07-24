function enfScript350_updateCustInspCustList(iType){
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
                for(col in aRow)
                    if(col == "Inspection Type" && aRow[col] == iType) rowExists = true;
            }
        }
        
        if($iTrc(inspType == iType, 'inspType matches')){
            var row = [{colName: 'Inspection Type', colValue: inspType},
                       {colName: 'Inspection Date', colValue: formatDteStringToMMDDYYYY(inspSchedDate)}];
            
            if($iTrc(!rowExists, 'row does not exits, inserting it'))   
                addAsiTableRow(inspsTable, row);
            if($iTrc(rowExists, 'row exists, updating the "Inspection Date"'))
                updateAsiTableRow(inspsTable, 'Inspection Date', formatDteStringToMMDDYYYY(inspSchedDate))
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function enfScript350_updateCustInspCustList(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function enfScript350_updateCustInspCustList(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("enfScript350_updateCustInspCustList() ended");
}//END enfScript350_updateCustInspCustList();