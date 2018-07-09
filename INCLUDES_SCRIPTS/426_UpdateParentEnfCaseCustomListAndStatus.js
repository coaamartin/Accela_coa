script426_UpdateParentEnfCaseCustomListAndStatus();

function script426_UpdateParentEnfCaseCustomListAndStatus() {
    var row,
        tableName,
        amt,
        parentCapId,
        parentCapScriptModel,
        parentCapTypeString,
        paymentDateArr,
        yyyy,
        mm,
        dd,
        dte,
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
                updateOrCreateValueInASITable(tableName, 'Request Date', inspResultDate, 'N');
            }  else if(ifTracer(inspType== "Abatement Approval" && inspResult == "Invoice Approval", "inspType== Abatement Approval && inspResult == Invoice Approval")) {
                // inspType== Abatement Approval && inspResult == Invoice Approval (update row if exists, else create row)
                updateOrCreateValueInASITable(tableName, 'Completed Date', Info['Abatement Completed Date'], 'N');
           }
        } else if(ifTracer(eventName == "WorkflowTaskUpdateAfter", "EventName == WorkflowTaskUpdateAfter")) {
            //WTUA
            if(ifTracer(wfTask == "Invoicing" && (wfStatus =="Invoiced" || wfStatus =="Invoiced - City Paid"), "wfTask == Invoicing && wfStatus == Invoiced OR Invoiced City Paid")) {
                // wfTask == "Invoicing" && wfStatus =="Invoiced"
                updateOrCreateValueInASITable(tableName, 'Invoiced Date', wfDateMMDDYYYY, 'N');
                updateOrCreateValueInASITable(tableName, 'Bill Amount', feesInvoicedTotal, 'N');
            } else if(ifTracer(wfTask == "Recordation" && (wfStatus =="Submit Recording"), "wfTask == Recordation && wfStatus == Submit Recording")) {
                // wfTask == "Recordation" && wfStatus =="Submit Recording"
                parentCapId = getParent();
                if(ifTracer(parentCapId, 'parent found')) { 
                    parentCapScriptModel = aa.cap.getCap(parentCapId).getOutput();
                    parentCapTypeString = parentCapScriptModel.getCapType().toString();
                    if(ifTracer(parentCapTypeString.indexOf('Enforcement\Incident\Zoning') > -1, 'parent = Zoning Violation Charge')) {
                        //parent is Zoning Violation Charge
                         amt = feeAmount("ENF_ABT_01") + feeAmount("ENF_ABT_02") + feeAmount("ENF_ABT_05") + feeAmount("ENF_ABT_06") 
                         updateOrCreateValueInASITable(tableName, 'Admin Charge', amt, 'N');
                    } else if(ifTracer(parentCapTypeString.indexOf('Enforcment\Incident\Snow') > -1, 'parent = Snow Violation Case')) {
                        //parent is Snow Violation Case
                         amt = feeAmount("ENF_ABT_01") + feeAmount("ENF_ABT_02")
                         updateOrCreateValueInASITable(tableName, 'Admin Charge', amt, 'N');
                    }
                } 
            } else if(ifTracer(wfTask == "Recordation" && (wfStatus =="Record Reception"), "wfTask == Recordation && wfStatus == Record Reception")) {
                // wfTask == "Recordation" && wfStatus =="Record Reception"
                updateOrCreateValueInASITable(tableName, 'Lien Amount', feesInvoicedTotal, 'N');
            }            
        } else if(ifTracer(eventName == "PaymentReceiveAfter", "EventName == PaymentReceiveAfter")) {
            //PRA
            if(ifTracer(balanceDue == 0,'balanceDue = 0')) {
                paymentDateArr = PaymentDate.split('-');
                yyyy = paymentDateArr[0].toString();
                mm = paymentDateArr[1].toString();
                dd = paymentDateArr[2].toString();
                dte = new Date(mm + '/' + dd + '/' + yyyy);

                updateOrCreateValueInASITable(tableName, 'Paid Date', dte, 'N');
            }
        }
        

    }
    
}

function updateOrCreateValueInASITable(tableName, fieldName, value, readonly) {
    if(!updateAsiTableRows(tableName, fieldName, value, {})) {
        var row = createAsiTableValObjs([
            { columnName: fieldName, fieldValue: value, readOnly: readonly }
        ]);
        addToASITable(tableName, row);
    }
}

