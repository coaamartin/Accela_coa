script426_UpdateParentEnfCaseCustomListAndStatus();

function script426_UpdateParentEnfCaseCustomListAndStatus() {
    var row,
        tableName,
        eventName = aa.env.getValue("EventName");

    if (matchARecordType([
        "Enforcement/Incident/Abatement/NA"
    ], appTypeString)) {
        tableName = 'ABATEMENT INFORMATION';
        if(ifTracer(eventName.indexOf("InspectionResultSubmitAfter") > -1, "EventName == InspectionResultSubmitAfter")) {
            //IRSA
            if(ifTracer(inspResult == "Taken and Stored", "inspResult == Taken and Stored")) {
                // inspResult == Taken and Stored (create row)
                row = createAsiTableValObjs([
                    { columnName: 'Abatement #', fieldValue: capIDString, readOnly: 'N' },
                    { columnName: 'Type', fieldValue: AInfo['Abatement Type'], readOnly: 'N' }
                ]);
                addToASITable(tableName, row);
            } else if(ifTracer(inspResult == "Called in Service Request" || inspResult == "Completed Service Request", "inspResult == Called in Service Request OR Completed Service Request")) {
                // inspResult == Called in Service Request OR Completed Service Request (update row if exists, else create row)
                if(!updateAsitRows(tableName, 'Request Date', inspResultDate, {})) {
                    row = createAsiTableValObjs([
                        { columnName: 'Request Date', fieldValue: inspResultDate, readOnly: 'N' }
                    ]);
                    addToASITable(tableName, row);
                }
            }  else if(ifTracer(inspType== "Abatement Approval" && inspResult == "Invoice Approval", "inspType== Abatement Approval && inspResult == Invoice Approval")) {
                // inspType== Abatement Approval && inspResult == Invoice Approval (update row if exists, else create row)
                if(!updateAsitRows(tableName, 'Completed Date', Info['Abatement Completed Date'], {})) {
                    row = createAsiTableValObjs([
                        { columnName: 'Completed Date', fieldValue: Info['Abatement Completed Date'], readOnly: 'N' }
                    ]);
                    addToASITable(tableName, row);
                }
           }

        } else if(ifTracer(eventName == "WorkflowTaskUpdateAfter", "EventName == WorkflowTaskUpdateAfter")) {
            //WTUA
            if(ifTracer(wfTask == "Invoicing" && (wfStatus =="Invoiced" || wfStatus =="Invoiced City Paid"), "wfTask == Invoicing && wfStatus == Invoiced OR Invoiced City Paid")) {
                // inspResult == Taken and Stored
                row = createAsiTableValObjs([
                        { columnName: 'Invoiced Date', fieldValue: wfDateMMDDYYYY , readOnly: 'N' },
                        { columnName: 'Bill Amount', fieldValue: wfDateMMDDYYYY , readOnly: 'N' }
                    ]
                );
                addToASITable(tableName, row);
            }
        }
    }
    
//  	// Create a HashMap.
//      var searchConditionMap = aa.util.newHashMap(); // Map<columnName, List<columnValue>>

//      // Create a List object to add the value of Column.
//      var valuesList = aa.util.newArrayList();
//      valuesList.add("12345");
     
//      searchConditionMap.put('Abatement #', valuesList);
//      updateAsitRows()

// , table

    
}

// function updateCreateAsitRow(capId, tableName, columnArray) {
//     var asitTable = getCustomListRows(tableName, capId);

//     if (asitTable == undefined || asitTable == null || asitTable.length == 0 ) {
//         //new row
//         row = createAsiTableValObjs(columnArray);
//         addToASITable('ABATEMENT INFORMATION', row);        
//     } else {
//         //update rows(s)
//         for (var cRow in tempASIT) {
//             row = tempASIT[cRow];
//             for(var col in columnArray) {
//                 row[columnArray[col].columnName] = columnArray[col].fieldValue
//             }
//         }
//     }
//     addToASITable('ABATEMENT INFORMATION', row);        
// }

// function getCustomListRows(tableName, capId) {
//     return loadASITable(tableName, capId);
// }

function createAsiTableValObjs(columnArray) {
    /*
        columnArray = [
            { columnName: '', fieldValue: '', readOnly: '' },
            { columnName: '', fieldValue: '', readOnly: '' }
        ]
    */
    var asiCols = [];
    for(var idx in columnArray) {
        asiCols[columnArray[idx].columnName] = new asiTableValObj(
            columnArray[idx].columnName, 
            columnArray[idx].fieldValue, 
            columnArray[idx].readOnly
        ); 
    }
    return asiCols
}

function getAsiTableRows(tableName, options) {
    var settings = {
        capID: capId,
    };
    //optional params - overriding default settings
    for (var attr in options) { settings[attr] = options[attr]; }

    var asitArray = loadASITable(tableName, capId);
    if (asitArray == undefined || asitArray == null) return false;
    return asitArray;
}

function updateAsitRows(tableName, columnName, newValue, options) {
    var settings = {
        capId: capId,
        rowIndex: null //0 based row index - null means update all rows
    };
    for (var attr in options) { settings[attr] = options[attr]; } //optional params - overriding default settings

    var row,
        val,
        rtn = false;

    //first get existing rows - if available
    var asitTable = getAsiTableRows(tableName, {
        capID: settings.capId,
    })

    if(asitTable) { //found table
        if(settings.rowIndex != null && asitTable[settings.rowIndex] != null) { //update specific row
            row = asitTable[settings.rowIndex];
            val = row[columnName] ? row[columnName] : null;
            rtn = updateAsitRow(tableName, columnName, val, newValue, settings.rowIndex, settings)
        } else {    //update all rows
            for (var ea in asitTable) {
                row = asitTable[ea];
                val = row[columnName] ? row[columnName] : null;
                rtn = updateAsitRow(tableName, columnName, val, newValue, ea, settings)
            }
        }
     }
    return rtn;
}

function updateAsitRow(tableName, columnName, curValue, newValue, rowIndex, options) {
    var settings = {
        capId: capId,
    };
    for (var attr in options) { settings[attr] = options[attr]; } //optional params - overriding default settings

    var searchConditionMap = aa.util.newHashMap(); // Map<columnName, List<columnValue>>
    // Create a List object to add the value of Column.
    var valuesList = aa.util.newArrayList();
    valuesList.add(curValue);
    searchConditionMap.put(columnName, valuesList);

    var appSpecificTableInfo = aa.appSpecificTableScript.getAppSpecificTableInfo(settings.capId, tableName, searchConditionMap/** Map<columnName, List<columnValue>> **/);
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
                var foColumnName = fieldObject.getFieldLabel();
                //get the value of column
                var foColumnValue = fieldObject.getInputValue();
                //get the row ID 
                var foRowIndex = fieldObject.getRowIndex();
                aa.print(columnName + ": " + foColumnName + "   rowIndex: " + foRowIndex);
                if(columnName == foColumnName && rowIndex == foRowIndex) {
                    setUpdateColumnValue(updateRowsMap, foRowIndex, columnName, newValue);
                }
             }
            if (!updateRowsMap.isEmpty())
            {
                updateAppSpecificTableInfors(tableName, settings.capId, updateRowsMap);
            }
        }
        return true;	
    }
    return false;
}



//     var appSpecificTableInfo = aa.appSpecificTableScript.getAppSpecificTableInfo(capId, tableName, searchConditionMap/** Map<columnName, List<columnValue>> **/);
//     if (appSpecificTableInfo.getSuccess())
//     {
//         logDebug("******Found Table");
//         var appSpecificTableModel = appSpecificTableInfo.getOutput().getAppSpecificTableModel();
//         var tableFields = appSpecificTableModel.getTableFields(); // List<BaseField>
//         logDebug("tableField size = " + tableFields.size());
//         if (tableFields != null && tableFields.size() > 0)
//         {
//             var updateRowsMap = aa.util.newHashMap(); // Map<rowID, Map<columnName, columnValue>>
//             for (var i=0; i < tableFields.size(); i++)
//             {
//                 logDebug ("on line --- i = " + i);
//                 var fieldObject = tableFields.get(i); // BaseField
//                 logDebug("fieldObject = " + fieldObject);
                
//                 //get the column name.
//                 var columnName = fieldObject.getFieldLabel();
//                 //get the value of column
//                 var columnValue = fieldObject.getInputValue();
//                 //get the row ID 
//                 var rowID = fieldObject.getRowIndex();
//                 logDebug(columnName + ": " + columnValue + "   rowID: " + rowID);
                
//                 setUpdateColumnValue(updateRowsMap, rowID, "Location", "NA");
//             }
//             if (!updateRowsMap.isEmpty())
//             {
//                 updateAppSpecificTableInfors(tableName, capId, updateRowsMap);
//             }
//             return true;
//         }
//         return false;	
//     }

//     if (asitTable == undefined || asitTable == null || asitTable.length == 0 ) {
//         //new row
//         row = createAsiTableValObjs(columnArray);
//         addToASITable('ABATEMENT INFORMATION', row);        
//     } else {
//         //update rows(s)
//         for (var cRow in tempASIT) {
//             row = tempASIT[cRow];
//             for(var col in columnArray) {
//                 row[columnArray[col].columnName] = columnArray[col].fieldValue
//             }
//         }
//     }
//     addToASITable('ABATEMENT INFORMATION', row);        
// }



/** 
/* Set update column value. format: Map<rowID, Map<columnName, columnValue>>
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
logDebug("in updateA STI");
	if (updateRowsMap == null || updateRowsMap.isEmpty())
	{
		return;
	}
	
	var asitTableScriptModel = aa.appSpecificTableScript.createTableScriptModel();
	var asitTableModel = asitTableScriptModel.getTabelModel();
	var rowList = asitTableModel.getRows();
	asitTableModel.setSubGroup(tableName);
	var rowIdArray = updateRowsMap.keySet().toArray();
	logDebug("rowIdArray.length = " + rowIdArray.length);
	for (var i = 0; i < rowIdArray.length; i++)
	{
		var rowScriptModel = aa.appSpecificTableScript.createRowScriptModel();
		var rowModel = rowScriptModel.getRow();
		logDebug("rowIdArray[i] = " + rowIdArray[i]);
		rowModel.setFields(updateRowsMap.get(rowIdArray[i]));
		rowModel.setId(rowIdArray[i]);
		rowList.add(rowModel);
	}
	return aa.appSpecificTableScript.updateAppSpecificTableInfors(capId, asitTableModel);
}


