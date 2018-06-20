script171_UpdateWorkFlowAdCreateChildRecs();

function script171_UpdateWorkFlowAdCreateChildRecs() {
    var childCapId,
        capScriptModel = aa.cap.getCap(capId).getOutput();
        tasks = aa.workflow.getTasks(capId).getOutput();

    for (var t in tasks) {
        var task = tasks[t];
        if (ifTracer(task.getTaskDescription() == '“Traffic Investigation', 'Task is “Traffic Investigation')) {
            if(ifTracer(task.disposition == 'Refer to Forestry', 'task.disposition == Refer to Forestry')) {
                closeParent("Refer to Forestry");
                childCapId = createChild('Forestry', 'Request', 'Citizen', 'NA', 'Tree Citizen Request', capId);

            } else if(ifTracer(task.disposition == 'Refer to Code Enforcement', 'task.disposition == Refer to Code Enforcement')) {
                closeParent("“Refer to Code Enforcement");
                childCapId = createChild('Enforcement', 'Incident', 'Informational', 'NA', 'Informational', capId);

            }
        //    printObjProps(task);  
        }
    }

    function closeParent(newStatus) {
        closeAllTasks(capId, 'Closed per script 171');
        updateAppStatus(newStatus, "Updated per script 171", capId);
    }

    function copyParentInfoToChild() {
       // copyAddresses(capId, childCapId));
       // copyParcels(capId, childCapId));
        copyOwner(capId, childCapId);
        editAppName(capScriptModel.specialText, childCapId);
       // copyContacts(capId, childCapId));
     //   editAppName(childCapScriptModel.specialText, parentCapId);
    }

}