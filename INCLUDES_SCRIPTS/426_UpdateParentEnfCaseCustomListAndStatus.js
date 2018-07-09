script426_UpdateParentEnfCaseCustomListAndStatus();

function script426_UpdateParentEnfCaseCustomListAndStatus() {
    var row,
        tableName,
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
            } else if(ifTracer(instr(inspType, "Post Abatement Inspection") > -1 && inspResult == "Cancelled", "inspType Like Abatement Approval && inspResult == Cancelled")) {
                // inspType LIKE Post Abatement Inspection && inspResult == Cancelled
                updateAbatementUponCompletion();
            }
        } else if(ifTracer(eventName == "WorkflowTaskUpdateAfter", "EventName == WorkflowTaskUpdateAfter")) {
            //WTUA
            if(ifTracer(wfTask == "Invoicing" && (wfStatus =="Invoiced" || wfStatus =="Invoiced - City Paid"), "wfTask == Invoicing && wfStatus == Invoiced OR Invoiced City Paid")) {
                // wfTask == "Invoicing" && wfStatus =="Invoiced"
                updateOrCreateValueInASITable(tableName, 'Invoiced Date', wfDateMMDDYYYY, 'N');
                updateOrCreateValueInASITable(tableName, 'Bill Amount', feesInvoicedTotal, 'N');
            } else if(ifTracer(wfTask == "Recordation" && (wfStatus =="Submit Recording"), "wfTask == Recordation && wfStatus == Submit Recording")) {
                // wfTask == "Recordation" && wfStatus =="Submit Recording"
                updateAbatementAdminCharge();
            } else if(ifTracer(wfTask == "Recordation" && wfStatus =="Record Reception", "wfTask == Recordation && wfStatus == Record Reception")) {
                // wfTask == "Recordation" && wfStatus =="Record Reception"
                updateOrCreateValueInASITable(tableName, 'Lien Amount', feesInvoicedTotal, 'N');
            } else if(ifTracer(wfTask == "Release Lien" && wfStatus =="Record Reception", "wfTask == Release Lien && wfStatus == Record Reception")) {
                // wfTask == "Release Lien" && wfStatus =="Record Reception"
                updateOrCreateValueInASITable(tableName, 'Release Date', AInfo["Release Reception Date"], 'N');
            } else if(ifTracer(wfTask == "Recordation" && wfStatus =="Released to County", "wfTask == Recordation && wfStatus == Released to County")) {
                // wfTask == "Recordation" && wfStatus =="Released to County"
                updateOrCreateValueInASITable(tableName, 'Released to County Date', AInfo["Released to County Date"], 'N');
            } else if(ifTracer((wfTask == "Recordation" && wfStatus =="Released to County") || (wfTask == "Invoicing" && wfStatus =="Invoiced - City Paid"), '(wfTask == "Recordation" && wfStatus =="Released to County") || (wfTask == "Invoicing" && wfStatus =="Invoiced - City Paid")')) {
                // wfTask == "Recordation" && wfStatus =="Released to County"
                updateAbatementUponCompletion();
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
    } if (matchARecordType([
        "Enforcement/Incident/Summons/NA"
    ], appTypeString)) {
        tableName = 'SUMMONS TO COURT INFORMATION';
        if(ifTracer(eventName.indexOf("InspectionResultSubmitAfter") > -1, "EventName == InspectionResultSubmitAfter")) {
            //IRSA
            if(ifTracer(inspType== "Summons Issuance" && (inspResult == "Letter to be Sent" && inspResult == "Personal Service"), 'inspType== "Summons Issuance" && (inspResult == "Letter to be Sent" && inspResult == "Personal Service")')) {
                // inspType== "Summons Issuance" && (inspResult == "Letter to be Sent" && inspResult == "Personal Service")
                row = createAsiTableValObjs([
                    { columnName: 'Case #', fieldValue: capIDString, readOnly: 'N' },
                    { columnName: 'Summons #', fieldValue: AInfo['Court Z-Number'], readOnly: 'N' },
                    { columnName: 'Issue Date', fieldValue: AInfo['Court Z-Number'], readOnly: 'N' }
                ]);
                var respPeople = getContactsByType("Responsible Party", capId);
                if(respPeople && respPeople.length > 0) {
                    for(var rp in respPeople) {
                        if(respPeople[rp].getPrimaryFlag() == 'Y') {
                            row.push({ columnName: 'Defendant', fieldValue: respPeople[rp].getFullName(), readOnly: 'N' });
                        }
                    }
                }
                addToASITable(tableName, row);
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

function updateAbatementAdminCharge() {
    var parentCapId,
        parentCapScriptModel,
        parentCapTypeString,
        amt;

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
}

function getChildrenWithActiveTasks() {
    var parentCapId = getParent(),
    children,
    childrenWithActiveTasks = [],
    childCapId;

    if(ifTracer(parentCapId, 'Parent found.')) {  
        children = getChildren("*/*/*/*", capId);
        if (ifTracer(children && children.length > 0, 'Children found.'))
        {
            for (var c in children)
        	{
        		childCapId = children[c];
        		{
                    if(activeTasksCheck({capId: childCapId})) {
                        childrenWithActiveTasks.push(childCapId);
                    }
                }
        	}
            
        }
    }
}

function getContactsByType(conType, capId) {
    var contactsByType = [];
	var contactArray = getPeople(capId);

	for (thisContact in contactArray) {
        if ((contactArray[thisContact].getPeople().contactType).toUpperCase() == conType.toUpperCase()) {
            contactsByType.push(contactArray[thisContact].getPeople())
        }
    }
    if(contactsByType.length > 0) {
        return contactsByType;
    }

	return false;

}

function activeTasksCheck(options) {
    var settings = {
        capId: capId,
    };
    for (var attr in options) { settings[attr] = options[attr]; } //optional params - overriding default settings

    var workflowResult = aa.workflow.getTasks(settings.capId);
    if (workflowResult.getSuccess())
           wfObj = workflowResult.getOutput();
    else {
           logDebug("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage());
           return false;
    }

    for (i in wfObj) {
           fTask = wfObj[i];
           if (fTask.getActiveFlag().equals("Y"))
                  return true;
    }

    return false;
}

function updateAbatementUponCompletion() {
    updateOrCreateValueInASITable(tableName, 'Type', AInfo['Abatement Type'], 'N');
    updateOrCreateValueInASITable(tableName, 'Request Date', inspResultDate, 'N');
    updateOrCreateValueInASITable(tableName, 'Completed Date', Info['Abatement Completed Date'], 'N');
    updateOrCreateValueInASITable(tableName, 'Invoiced Date', wfDateMMDDYYYY, 'N');
    updateOrCreateValueInASITable(tableName, 'Bill Amount', feesInvoicedTotal, 'N');
    updateAbatementAdminCharge();
    updateOrCreateValueInASITable(tableName, 'Lien Amount', feesInvoicedTotal, 'N');
    updateOrCreateValueInASITable(tableName, 'Release Date', AInfo["Release Reception Date"], 'N');
    updateOrCreateValueInASITable(tableName, 'Released to County Date', AInfo["Released to County Date"], 'N');

    var childrenWithActiveTasks = getChildrenWithActiveTasks();
    if(childrenWithActiveTasks && childrenWithActiveTasks.length == 1) {
        //if current record is the only record open, close parent
        var parentCapId = getParent();
        closeAllTasks(parentCapId, 'closed by script 426');
        updateAppStatus('Compliance','Status set by script 426', parentCapId);
    }
}