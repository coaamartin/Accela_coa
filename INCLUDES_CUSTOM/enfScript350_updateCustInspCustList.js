function enfScript350_updateCustInspCustList(){
    logDebug("enfScript350_updateCustInspCustList() started");
    try{
		var iType;
		var isDate;
		
		if(ifTracer(matches(vEventName, "InspectionScheduleAfter", "InspectionMultipleScheduleAfter"), 'InspectionScheduleAfter')){
			iType = inspType;
			isDate = inspSchedDate;
		}
		else{
		    iType = arguments[0];
            isDate = arguments[1];			
		}
        
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
                    if(col == "Inspection Type" && (iType + "") == aRow[col]) rowExists = true;
            }
        }
        
        var row = [{colName: 'Inspection Type', colValue: iType},
                   {colName: 'Inspection Date', colValue: formatDteStringToMMDDYYYY(isDate)}];
        
        //if(!updateAsiTableRow(inspsTable, "Inspection Date", formatDteStringToMMDDYYYY(isDate), { 
        //    capId: capId,
        //    colFilters: [
        //        { colName: "Inspection Type", colValue: iType}
        //    ]})
        //) {
        //    addAsiTableRow(inspsTable, row);
        //}
        
        if($iTrc(!rowExists, 'row does not exits, inserting it'))   
            addAsiTableRow(inspsTable, row);
        if($iTrc(rowExists, 'row exists, updating the "Inspection Date"'))
            updateAsiTableRow(inspsTable, "Inspection Date", formatDteStringToMMDDYYYY(isDate), {
                    capId: capId,
                    colFilters: [
                        { colName: "Inspection Type", colValue: iType}
                    ]});
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function enfScript350_updateCustInspCustList(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function enfScript350_updateCustInspCustList(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("enfScript350_updateCustInspCustList() ended");
}//END enfScript350_updateCustInspCustList();