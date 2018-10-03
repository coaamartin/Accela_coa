/*Event   WorkflowTaskUpdateAfter   
When License Issuance wf task has a status of "Ready to Pay" and there are fees that are invoiced and not paid then there should be a message that pops up saying 
"Fees are invoiced but not paid, fees need to be paid to continue" then the workflow task should not be allowed to proceed.

Script Type
EMSE

Record Type
Licenses/Contractor/General/Application
Licenses/Contractor/General/Renewal
Licenses/Professional/General/Application
Licenses/Professional/General/Renewal
*/

if ("License Issuance".equals(wfTask))
{
	var bal = getCapBalanceDue();
    var wfStatus = wasTaskStatus("License Issuance", "Ready to Pay")
	if (bal > 0 && wfStatus)
	{
		showMessage = true;
		cancel = true;
		comment("Fees are invoiced but not paid, fees need to be paid to continue then the workflow task should not be allowed to proceed");
	}
}

function wasTaskStatus(task, status) {
    histObj = aa.workflow.getWorkflowHistory(capId,task,null)
    if (!histObj.getSuccess()) {
        logDebug("Could not get Workflow history")
        return false
    }
    history = histObj.getOutput()
    count = 0
    for (x in history) {
        if ( history[x].getDisposition() == status ) count++
        if (count > 0) return true
    }
    return false
}


function getCapBalanceDue() {
    //Optional capId
    itemCap = capId;
    if (arguments.length == 1)
        itemCap = arguments[0];

    var feesArr = loadFees();
    if (!feesArr)
        return 0;

    var tot = 0;
    for (i in feesArr)
    {
    	if ("INVOICED".equals(feesArr[i].status))
    	{
    		tot += (+feesArr[i].amount) - (+feesArr[i].amountPaid);
    	}
        
    }
    return tot;
}