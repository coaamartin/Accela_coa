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
            } else if(ifTracer(inspResult == "Called In Service Request" || inspResult == "Completed Service Request", "inspResult == Called in Service Request OR Completed Service Request")) {
                // inspResult == Called in Service Request OR Completed Service Request (update row if exists, else create row)
                if(!updateAsiTableRows(tableName, 'Request Date', inspResultDate, {})) {
                    row = createAsiTableValObjs([
                        { columnName: 'Request Date', fieldValue: inspResultDate, readOnly: 'N' }
                    ]);
                    addToASITable(tableName, row);
                }
            }  else if(ifTracer(inspType== "Abatement Approval" && inspResult == "Invoice Approval", "inspType== Abatement Approval && inspResult == Invoice Approval")) {
                // inspType== Abatement Approval && inspResult == Invoice Approval (update row if exists, else create row)
                if(!updateAsiTableRows(tableName, 'Completed Date', Info['Abatement Completed Date'], {})) {
                    row = createAsiTableValObjs([
                        { columnName: 'Completed Date', fieldValue: Info['Abatement Completed Date'], readOnly: 'N' }
                    ]);
                    addToASITable(tableName, row);
                }
           }

        } else if(ifTracer(eventName == "WorkflowTaskUpdateAfter", "EventName == WorkflowTaskUpdateAfter")) {
            //WTUA
            if(ifTracer(wfTask == "Invoicing" && (wfStatus =="Invoiced" || wfStatus =="Invoiced - City Paid"), "wfTask == Invoicing && wfStatus == Invoiced OR Invoiced City Paid")) {
                // wfTask == "Invoicing" && wfStatus =="Invoiced"
                if(!updateAsiTableRows(tableName, 'Invoiced Date', wfDateMMDDYYYY, {})) {
                    row = createAsiTableValObjs([
                        { columnName: 'Invoiced Date', fieldValue: wfDateMMDDYYYY , readOnly: 'N' }
                    ]);
                    addToASITable(tableName, row);
                }

                if(!updateAsiTableRows(tableName, 'Bill Amount', feesInvoicedTotal, {})) {
                    row = createAsiTableValObjs([
                        { columnName: 'Bill Amount', fieldValue: feesInvoicedTotal, readOnly: 'N' }
                    ]);
                    addToASITable(tableName, row);
                }
            }
        }
    }
    
}

