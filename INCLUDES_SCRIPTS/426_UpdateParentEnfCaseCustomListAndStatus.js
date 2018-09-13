script426_UpdateParentEnfCaseCustomListAndStatus();

function script426_UpdateParentEnfCaseCustomListAndStatus() {
    var row,
        tableName,
        colKeyName,
        paymentDateArr,
        yyyy,
        mm,
        dd,
        dte,
        maxInsp,
        eventName = aa.env.getValue("EventName"),
        parentCapId = getParent();

    if(parentCapId == false) {
        logDebug('ERROR: :The record does not have an associated parent record.')
        return;
    }
    logDebug('parentCapId: ' + parentCapId);

    if (matchARecordType([
        "Enforcement/Incident/Abatement/NA"
    ], appTypeString)) {
		logDebug("Abatement Record");
        tableName = 'ABATEMENT INFORMATION';
        colKeyName = 'Abatement #';
        if(ifTracer(eventName.indexOf("InspectionResultSubmitAfter") > -1, "EventName == InspectionResultSubmitAfter")) {
            //IRSA
            if(ifTracer(inspType!= "Post Abatement Inspection" && inspResult == "Taken and Stored", 'inspType!= "Post Abatement Inspection" && inspResult == "Taken and Stored"')) {
                // inspResult == Taken and Stored (create row)
                addAsiTableRow(tableName, [
                    { colName: 'Abatement #', colValue: capIDString },
                    { colName: 'Type', colValue: AInfo['Abatement Type'] },
                    { colName: 'Request Date', colValue: inspResultDate }
                ], { capId: parentCapId });
            //  } else if(ifTracer(inspResult == "Called In Service Request" || inspResult == "Completed Service Request", "inspResult == Called in Service Request OR Completed Service Request")) {
            //     // inspResult == Called in Service Request OR Completed Service Request (update row if exists, else create row)
            //     updateOrCreateValueInASITable(tableName, colKeyName, 'Request Date', inspResultDate, 'N');
            } else if(ifTracer(inspType== "Abatement Approval" && inspResult == "Invoice Approved", "inspType== Abatement Approval && inspResult == Invoice Approved")) {
                // inspType== Abatement Approval && inspResult == Invoice Approval (update row if exists, else create row)
                updateOrCreateValueInASITable(tableName, colKeyName, 'Completed Date',AInfo['Abatement Completed Date'], 'N');
            } else if(ifTracer(inspType.indexOf("Post Abatement Inspection") > -1 && inspResult == "Cancelled", "inspType Like Abatement Approval && inspResult == Cancelled")) {
                // inspType LIKE Post Abatement Inspection && inspResult == Cancelled
                updateAbatementUponCompletion();
            }
        } else if(ifTracer(eventName == "WorkflowTaskUpdateAfter", "EventName == WorkflowTaskUpdateAfter")) {
            //WTUA
            if(ifTracer(wfTask == "Invoicing" && (wfStatus =="Invoiced" || wfStatus =="Invoiced - City Paid"), "wfTask == Invoicing && wfStatus == Invoiced OR Invoiced City Paid")) {
                // wfTask == "Invoicing" && wfStatus =="Invoiced"
                updateOrCreateValueInASITable(tableName, colKeyName, 'Invoiced Date', wfDateMMDDYYYY, 'N');
                
                var feeG = feeW = feeS = feeT = feeB = 0;
                if(AInfo["Contractor Fee - Graffiti"] != null) feeG = parseFloat(AInfo["Contractor Fee - Graffiti"]);
                if(AInfo["Contractor Fee - Weeds"] != null) feeW = parseFloat(AInfo["Contractor Fee - Weeds"]);
                if(AInfo["Contractor Fee - Snow"] != null) feeS = parseFloat(AInfo["Contractor Fee - Snow"]);
                if(AInfo["Contractor Fee - Trash"] != null) feeT = parseFloat(AInfo["Contractor Fee - Trash"]);
                if(AInfo["Contractor Fee - Board-Up"] != null) feeB = parseFloat(AInfo["Contractor Fee - Board-Up"]);
                				
                var feeTotal = feeG + feeW + feeS + feeT + feeB;
				logDebug("feeTotal:" + feeTotal);
                
                //updateOrCreateValueInASITable(tableName, colKeyName, 'Bill Amount', feesInvoicedTotal.toString(), 'N');
                updateOrCreateValueInASITable(tableName, colKeyName, 'Bill Amount', parseFloat(feeTotal), 'N');
            } else if(ifTracer(wfTask == "Recordation" && (wfStatus =="Submit Recording"), "wfTask == Recordation && wfStatus == Submit Recording")) {
                // wfTask == "Recordation" && wfStatus =="Submit Recording"
                updateAbatementAdminCharge();
            } else if(ifTracer(wfTask == "Recordation" && wfStatus =="Record Reception", "wfTask == Recordation && wfStatus == Record Reception")) {
                // wfTask == "Recordation" && wfStatus =="Record Reception"
                updateOrCreateValueInASITable(tableName, colKeyName, 'Lien Amount', feesInvoicedTotal.toString(), 'N');
            } else if(ifTracer(wfTask == "Release Lien" && wfStatus =="Record Reception", "wfTask == Release Lien && wfStatus == Record Reception")) {
                // wfTask == "Release Lien" && wfStatus =="Record Reception"
                updateOrCreateValueInASITable(tableName, colKeyName, 'Release Date', AInfo["Release Reception Date"], 'N');
            } else if(ifTracer(wfTask == "Recordation" && wfStatus =="Released to County", "wfTask == Recordation && wfStatus == Released to County")) {
                // wfTask == "Recordation" && wfStatus =="Released to County"
                updateOrCreateValueInASITable(tableName, colKeyName, 'Released to County Date', AInfo["Released to County Date"], 'N');
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

                updateOrCreateValueInASITable(tableName, colKeyName, 'Paid Date', aa.util.formatDate(dte, "MM/dd/YYYY"), 'N');
            }
        }
    } else if (matchARecordType([
        "Enforcement/Incident/Summons/NA"
    ], appTypeString)) {
        tableName = 'SUMMONS TO COURT INFORMATION';
        colKeyName = 'Case #';
        if(ifTracer(eventName.indexOf("InspectionResultSubmitAfter") > -1, "EventName == InspectionResultSubmitAfter")) {
            //IRSA
            if(ifTracer(inspType== "Summons Issuance" && (inspResult == "Letter to be Sent" || inspResult == "Personal Service"), 'inspType== "Summons Issuance" && (inspResult == "Letter to be Sent" || inspResult == "Personal Service")')) {
                // inspType== "Summons Issuance" && (inspResult == "Letter to be Sent" && inspResult == "Personal Service")
                row = [
                    { colName: 'Case #', colValue: capIDString },
                    { colName: 'Summons #', colValue: AInfo['Court Z-Number'] },
                    { colName: 'Issue Date', colValue: inspResultDate }
                ];
                var respPeople = getContacts( { contactType: "Responsible Party" });
                if(respPeople.length > 0) {
                    for(var rp in respPeople) {
                        if(respPeople[rp].getFlag() == "Y") {
                            row.push({ colName: 'Defendant', colValue: respPeople[rp].getFullName() });
                        }
                    }
                }
                addAsiTableRow(tableName, row, { capId: parentCapId });
            } else if(ifTracer(inspType == 'Pre Court Action' && (inspResult == "Summons File to CA" || inspResult == "Citation File to CA"), 'inspType == "Pre Court Action" && (inspResult == "Summons File to CA" || inspResult == "Citation File to CA")')) {
                // inspType == 'Pre Court Action' && (inspResult == "Summons File to CA" || inspResult == "Citation File to CA")
                updateOrCreateValueInASITable(tableName, colKeyName, 'Arraign Date', AInfo['Arraignment Date'], 'N');
                if(nspResult == "Summons File to CA") {
                    updateOrCreateValueInASITable(tableName, colKeyName, 'Notice of Hearing', AInfo['Notice of Hearing'], 'N');                    
                }
            } else if(ifTracer(inspType == "Legal Resolution" && inspResult == "Complete", 'inspType == "Legal Resolution" && inspResult == "Complete"')) {
                // inspType == "Legal Resolution" && inspResult == "Complete"
                updateSummonsUponCompletion();
            } 
        } else if(ifTracer(eventName == "WorkflowTaskUpdateAfter", "EventName == WorkflowTaskUpdateAfter")) {
            //WTUA
            if(ifTracer(wfTask == "Legal Hearing" && wfStatus == "Court Ordered Re-Inspect", 'wfTask == "Legal Hearing" && wfStatus == "Court Ordered Re-Inspect"')) {
                // wfTask == "Legal Hearing" && wfStatus == "Court Ordered Re-Inspect"
                updateOrCreateValueInASITable(tableName, colKeyName, 'Court Re-Insp Date', AInfo['Court Reinspection Date'], 'N');
            } else if(ifTracer(wfTask == "Legal Hearing" && wfStatus =="Pre-Trial", 'wfTask == "Legal Hearing" && wfStatus =="Pre-Trial"')) {
                // wfTask == "Legal Hearing" && wfStatus =="Pre-Trial"
                updateOrCreateValueInASITable(tableName, colKeyName, 'Pre-Trial Date', AInfo["Pre-Trial Date"], 'N');
            } else if(ifTracer(wfTask == "Legal Hearing" && wfStatus =="Trial", 'wfTask == "Legal Hearing" && wfStatus =="Trial"')) {
                // wfTask == "Legal Hearing" && wfStatus =="Trial"
                updateOrCreateValueInASITable(tableName, colKeyName, 'Trial Date', AInfo["Trial Date"], 'N');
            } else if(ifTracer(wfTask == "Legal Hearing" && wfStatus =="NFZV - 1 Year", 'wfTask == "Legal Hearing" && wfStatus =="NFZV - 1 Year')) {
                // wfTask == "Legal Hearing" && wfStatus =="NFZV - 1 Year"
                updateOrCreateValueInASITable(tableName, colKeyName, 'NFZV Date', AInfo["NFZV - 1 Year Date"], 'N');
            } else if(ifTracer(wfTask == "Legal Hearing" && 
                        (wfStatus == "NFZV - 1 Year" || wfStatus == "Compliance"
                        || wfStatus == "Dismissed" || wfStatus == "Dismissed - Lack of Service"
                        || wfStatus == "Non-Compliance New Summons" || wfStatus == "Non-Compliance"
                        || wfStatus == "FTA"
                        ), 'wfTask == "Legal Hearing" && (wfStatus == "NFZV - 1 Year" || wfStatus == "Compliance"|| wfStatus == "Dismissed" || wfStatus == "Dismissed - Lack of Service"|| wfStatus == "Non-Compliance New Summons" || wfStatus == "Non-Compliance"|| wfStatus == "FTA"')) {
                // wfTask == "Legal Hearing" && (wfStatus == "NFZV - 1 Year" || wfStatus == "Compliance"|| wfStatus == "Dismissed" || wfStatus == "Dismissed - Lack of Service"|| wfStatus == "Non-Compliance New Summons" || wfStatus == "Non-Compliance"|| wfStatus == "FTA"
                updateOrCreateValueInASITable(tableName, colKeyName, 'Disposition', wfStatus, 'N');
            }
        }         
    } else if (matchARecordType([
        "Enforcement/Incident/Record with County/NA"
    ], appTypeString)) {
        tableName = 'NOV RECORDATION INFORMATION';
        colKeyName = 'NOV Record #';
        if(ifTracer(eventName.indexOf("InspectionResultSubmitAfter") > -1, "EventName == InspectionResultSubmitAfter")) {
            //IRSA
            if(ifTracer(inspType == "NOV Release Inspection", 'inspType == "NOV Release Inspection"')) {
                // inspType == "NOV Inspection"
                updateOrCreateValueInASITable(tableName, colKeyName, 'Last Inspection Date', inspResultDate, 'N');
                if(inspResult == "Failed") {
                    maxInsp = getLastInspection({ inspType: "NOV Release Inspection" });
                    if(maxInsp) {
                        dte = maxInsp.getScheduledDate().getMonth() + "/" + maxInsp.getScheduledDate().getDayOfMonth() + "/" + maxInsp.getScheduledDate().getYear();
                        updateOrCreateValueInASITable(tableName, colKeyName, 'Next Inspection Date', aa.util.formatDate(dte, "MM/dd/YYYY"), 'N');
                    }
                } else {
                    updateOrCreateValueInASITable(tableName, colKeyName, 'Next Inspection Date', inspSchedDate, 'N');
                }
                updateOrCreateValueInASITable(tableName, colKeyName, 'Completed Inspections', getCompletedInspections({}), 'N');
                maxInsp = getLastInspection({ inspType: "NOV Release Inspection", inspResult: "Compliance" });
                if(maxInsp) {
                    dte = maxInsp.getInspectionStatusDate().getMonth() + "/" + maxInsp.getInspectionStatusDate().getDayOfMonth() + "/" + maxInsp.getInspectionStatusDate().getYear();
                    updateOrCreateValueInASITable(tableName, colKeyName, 'Compliance Date', aa.util.formatDate(dte, "MM/dd/YYYY"), 'N');
                }
             }
        }  else if(ifTracer(eventName == "WorkflowTaskUpdateAfter", "EventName == WorkflowTaskUpdateAfter")) {
            //WTUA
            if(ifTracer(wfTask == "Record NOV" && wfStatus == "Record Reception", 'wfTask == "Record NOV" && wfStatus == "Record Reception"')) {
                // wfTask == "Record NOV" && wfStatus == "Record Reception"
                addAsiTableRow(tableName, [
                    { colName: 'NOV Record #', colValue: capIDString },
                    { colName: 'Recordation Date', colValue: AInfo['Record Reception Date'] },
                    { colName: 'Recordation #', colValue: AInfo['Record Reception #'] },
                    { colName: 'Release Date', colValue: AInfo['Release Reception Date'] },
                    { colName: 'Release #', colValue: AInfo['Release Reception #'] }
                ], { capId: parentCapId });
            } else if(ifTracer(wfTask == "Release NOV" && wfStatus == "Record Reception", 'wfTask == "Release NOV" && wfStatus == "Record Reception"')) {
                // wfTask == "Release NOV" && wfStatus == "Record Reception"
                updateRecordWithCountyUponCompletion();
            }
        }
    }

    function updateAbatementUponCompletion() {
        updateOrCreateValueInASITable(tableName, colKeyName, 'Type', AInfo['Abatement Type'], 'N');
        updateOrCreateValueInASITable(tableName, colKeyName, 'Request Date', inspResultDate, 'N');
        updateOrCreateValueInASITable(tableName, colKeyName, 'Completed Date', AInfo['Abatement Completed Date'], 'N');
   //    updateOrCreateValueInASITable(tableName, colKeyName, 'Invoiced Date', wfDateMMDDYYYY, 'N');
        updateOrCreateValueInASITable(tableName, colKeyName, 'Bill Amount', feesInvoicedTotal.toString(), 'N');
        updateAbatementAdminCharge();
        updateOrCreateValueInASITable(tableName, colKeyName, 'Lien Amount', feesInvoicedTotal.toString(), 'N');
        updateOrCreateValueInASITable(tableName, colKeyName, 'Release Date', AInfo["Release Reception Date"], 'N');
        updateOrCreateValueInASITable(tableName, colKeyName, 'Released to County Date', AInfo["Released to County Date"], 'N');
    
        var childrenWithActiveTasks = getChildrenWithActiveTasks();
        if(ifTracer(childrenWithActiveTasks.length == 1, 'childrenWithActiveTasks && childrenWithActiveTasks.length == 1')) {
            //if current record is the only record open, close parent
            var parentCapId = getParent();
            closeAllTasks(parentCapId, 'closed by script 426');
            updateAppStatus('Compliance','Status set by script 426', parentCapId);
        }
    }
    
    function updateSummonsUponCompletion() {
        updateOrCreateValueInASITable(tableName, colKeyName, 'Arraign Date', AInfo['Arraignment Date'], 'N');
        updateOrCreateValueInASITable(tableName, colKeyName, 'Notice of Hearing', AInfo['Notice of Hearing'], 'N');
        updateOrCreateValueInASITable(tableName, colKeyName, 'Court Re-Insp Date', AInfo['Court Reinspection Date'], 'N');
        updateOrCreateValueInASITable(tableName, colKeyName, 'Pre-Trial Date', AInfo["Pre-Trial Date"], 'N');
        updateOrCreateValueInASITable(tableName, colKeyName, 'Trial Date', AInfo["Trial Date"], 'N');
        updateOrCreateValueInASITable(tableName, colKeyName, 'NFZV Date', AInfo["NFZV - 1 Year Date"], 'N');
        updateOrCreateValueInASITable(tableName, colKeyName, 'Summons #', AInfo['Court Z-Number'], 'N');
        updateOrCreateValueInASITable(tableName, colKeyName, 'Issue Date', AInfo['Court Z-Number'], 'N');
    
        var childrenWithActiveTasks = getChildrenWithActiveTasks();
        if(ifTracer(childrenWithActiveTasks.length == 1, 'childrenWithActiveTasks && childrenWithActiveTasks.length == 1')) {
            //if current record is the only record open, close parent
            var parentCapId = getParent();
            var parentCap = aa.cap.getCap(parentCapId).getOutput();
            var parentCapStatus = parentCap.getStatus();
            var parentAppString = parentCap.getCapType().toString();
            if(parentCapStatus == "NFZV - 1 Year Date" || parentCapStatus =="Compliance") {
                closeAllTasks(parentCapId, 'closed by script 426');
                if(parentAppString == "Enforcement/Housing/Inspection/NA") {
                    updateAppStatus(capStatus,'Status set by script 426', parentCapId);
                } else {
                    updateAppStatus('Pending Housing Inspection','Status set by script 426', parentCapId);
                }
            }
       }
    }
    
    function updateRecordWithCountyUponCompletion() {
        //THIS IS INSANE MAKING ME DO EVERYTHING OVER AGAIN AT THE END - GHEZ!
        var dteSched,
            dteStatus;
    
        maxInsp = getLastInspection({ inspType: "NOV Release Inspection" });
        if(maxInsp) {
            dteStatus = maxInsp.getInspectionStatusDate().getMonth() + "/" + maxInsp.getInspectionStatusDate().getDayOfMonth() + "/" + maxInsp.getInspectionStatusDate().getYear();
            dteSched = maxInsp.getScheduledDate().getMonth() + "/" + maxInsp.getScheduledDate().getDayOfMonth() + "/" + maxInsp.getScheduledDate().getYear();
            updateOrCreateValueInASITable(tableName, colKeyName, 'Last Inspection Date', dteStatus, 'N');
            updateOrCreateValueInASITable(tableName, colKeyName, 'Next Inspection Date', dteSched, 'N');
        }
        maxInsp = getLastInspection({ inspType: "NOV Release Inspection", inspResult: "Compliance" });
        if(maxInsp) {
            dteStatus = maxInsp.getInspectionStatusDate().getMonth() + "/" + maxInsp.getInspectionStatusDate().getDayOfMonth() + "/" + maxInsp.getInspectionStatusDate().getYear();
            updateOrCreateValueInASITable(tableName, colKeyName, 'Compliance Date', dteStatus, 'N');
        }
        updateOrCreateValueInASITable(tableName, colKeyName, 'Recordation Date', AInfo['Record Reception Date'], 'N');
        updateOrCreateValueInASITable(tableName, colKeyName, 'Recordation #', AInfo['Record Reception #'], 'N');
        updateOrCreateValueInASITable(tableName, colKeyName, 'Release Date', AInfo['Release Reception Date'], 'N');
        updateOrCreateValueInASITable(tableName, colKeyName, 'Release #', AInfo['Release Reception #'], 'N');
    
        var childrenWithActiveTasks = getChildrenWithActiveTasks();
        if(ifTracer(childrenWithActiveTasks.length == 1, 'childrenWithActiveTasks && childrenWithActiveTasks.length == 1')) {
            //if current record is the only record open, close parent
            var parentCapId = getParent();
            var parentCap = aa.cap.getCap(parentCapId).getOutput();
            var parentCapStatus = parentCap.getStatus();
            var parentAppString = parentCap.getCapType().toString();
    
            if (matchARecordType([
                "Enforcement/Housing/Inspection/NA",
                "Enforcement/Incident/Zoning/NA"
            ], appTypeString)) {
                closeAllTasks(parentCapId, 'closed by script 426');
                if(parentAppString == "Enforcement/Housing/Inspection/NA") {
                    updateAppStatus("Pending Housing Inspection",'Status set by script 426', parentCapId);
                } else {
                    updateAppStatus('Compliance','Status set by script 426', parentCapId);
                }
            }
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
            if(ifTracer(parentCapTypeString.indexOf('Enforcement/Incident/Zoning') > -1, 'parent = Zoning Violation Charge')) {
                //parent is Zoning Violation Charge
                 amt = feeAmount("ENF_ABT_01") + feeAmount("ENF_ABT_02") + feeAmount("ENF_ABT_05") + feeAmount("ENF_ABT_06") 
                 updateOrCreateValueInASITable(tableName, colKeyName, 'Admin Charge', amt.toString(), 'N');
            } else if(ifTracer(parentCapTypeString.indexOf('Enforcement/Incident/Snow') > -1, 'parent = Snow Violation Case')) {
                //parent is Snow Violation Case
                 amt = feeAmount2("ENF_ABT_01", { capId: parentCapId }) + feeAmount2("ENF_ABT_02", { capId: parentCapId })
                 updateOrCreateValueInASITable(tableName, colKeyName, 'Admin Charge', amt.toString(), 'N');
            }
        } 
    }   
    
    
}



function updateOrCreateValueInASITable(tableName, colKeyName,fieldName, value, readonly) {
    if(!updateAsiTableRow(tableName, fieldName, value, { 
        capId: parentCapId,
        colFilters: [
            { colName: colKeyName, colValue: capIDString}
        ]}) 
    ) {
        addAsiTableRow(tableName, [
            { colName: fieldName, colValue: value }
        ], { capId: parentCapId });
    }
}

function getChildrenWithActiveTasks() {
  //  var parentCapId = getParent(),
    var children,
    childrenWithActiveTasks = [],
    childCapId;

    if(ifTracer(parentCapId, 'Parent found.')) {  
        children = getChildren("*/*/*/*", parentCapId);
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
    return childrenWithActiveTasks;
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
           if (ifTracer(fTask.getActiveFlag().equals("Y"), 'child is active'))
                  return true;
    }

    return false;
}


