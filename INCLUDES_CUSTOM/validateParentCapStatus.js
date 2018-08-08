/**
 * check if parent of certain type exists, and has a certain capStatus, block workflow submit 
 * @param workflowStatusArray
 * @param parentType
 * @param parentStatus
 * @returns {Boolean}
 */
function validateParentCapStatus(workflowStatusArray, parentType, parentStatus) {

    var statusMatch = false;

    if(ifTracer(vEventName == "WorkflowTaskUpdateBefore", 'WTUB')){
    
        for (s in workflowStatusArray) {
            if (wfStatus == workflowStatusArray[s]) {
                statusMatch = true;
                break;
            }
        }//for all status options

        if (!statusMatch) {
            return false;
        }
	
        var parents = getParents(parentType);
        for (p in parents) {
            var parentCap = aa.cap.getCap(parents[p]).getOutput();
            if (parentCap.getCapStatus() == parentStatus) {
                cancel = true;
                showMessage = true;
                comment("Master is previous code year cannot issue permit.");
                return false;
            }
        }
        return true;
	}
	
	if(ifTracer(vEventName == "PaymentReceiveAfter", 'PRA')){
		var parents = getParents(parentType);
        for (p in parents) {
            var parentCap = aa.cap.getCap(parents[p]).getOutput();
            if (parentCap.getCapStatus() == parentStatus) {
                showMessage = true;
                comment("<B><Font Color=RED>Master is previous code year cannot issue permit.</Font></B>");
                return false;
            }
        }
        return true;
	}
}