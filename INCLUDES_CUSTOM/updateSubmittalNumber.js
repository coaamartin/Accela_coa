function updateSubmittalNumber(workFlowTask, workflowStatusArray, customFieldName) {
    if (wfTask == workFlowTask) {
        var statusMatch = false;

        for (s in workflowStatusArray) {
            if (wfStatus == workflowStatusArray[s]) {
                statusMatch = true;
                break;
            }
        }

        if (!statusMatch) {
            return false;
        }

        var customFieldValue = getAppSpecific(customFieldName, capId);
        if (typeof (customFieldValue) != "undefined" && customFieldValue != null && customFieldValue != "")
            customFieldValue = parseInt(customFieldValue) + 1;
        else
            customFieldValue = 0;

        editAppSpecific(customFieldName, customFieldValue);


    } else {
        return false;
    }

    return true;
}