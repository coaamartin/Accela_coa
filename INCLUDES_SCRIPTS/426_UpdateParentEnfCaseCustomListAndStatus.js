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
                // inspResult == Taken and Stored
                row = createAsiTableValObjs([
                        { columnName: 'Abatement #', fieldValue: capIDString, readOnly: 'N' },
                        { columnName: 'Type', fieldValue: AInfo['Abatement Type'], readOnly: 'N' }
                    ]
                );
                addToASITable(tableName, row);
            } else if(ifTracer(inspResult == "Called in Service Request" || inspResult == "Completed Service Request", "inspResult == Called in Service Request OR Completed Service Request")) {
                // inspResult == Called in Service Request OR Completed Service Request
                row = updateCreateAsitRow(
                    capId, 
                    tableName, 
                    [
                        { columnName: 'Request Date', fieldValue: inspResultDate, readOnly: 'N' }
                    ]
                );
                addToASITable(tableName, row);
            }  else if(ifTracer(inspType== "Abatement Approval" && inspResult == "Invoice Approval", "inspType== Abatement Approval && inspResult == Invoice Approval")) {
                // inspType== Abatement Approval && inspResult == Invoice Approval
                row = updateCreateAsitRow(
                    capId, 
                    tableName, 
                    [
                        { columnName: 'Completed Date', fieldValue: Info['Abatement Completed Date'], readOnly: 'N' }
                    ]
                );
                addToASITable(tableName, row);
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
    



    
}

function updateCreateAsitRow(capId, tableName, columnArray) {
    var asitTable = getCustomListRows(tableName, capId);

    if (asitTable == undefined || asitTable == null || asitTable.length == 0 ) {
        //new row
        row = createAsiTableValObjs(columnArray);
        addToASITable('ABATEMENT INFORMATION', row);        
    } else {
        //update rows(s)
        for (var ea in tempASIT) {
            var row = tempASIT[ea];
            row[columnArray.columnName] = columnArray.fieldValue
        }
    }
    addToASITable('ABATEMENT INFORMATION', row);        
}

function getCustomListRows(tableName, capId) {
    return loadASITable(tableName, capId);
}

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
            asiCols[columnArray[idx].columnName], 
            asiCols[columnArray[idx].fieldValue], 
            asiCols[columnArray[idx].readOnly]
        ); 
    }
    return asiCols
}

