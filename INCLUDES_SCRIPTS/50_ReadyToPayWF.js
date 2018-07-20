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

if ("License Issuance".equals(wfTask) && "Ready to Pay".equals(wfStatus))
{
	var bal = getCapBalanceDue();
	if (bal > 0)
	{
		showMessage = true;
		cancel = true;
		comment("Fees are invoiced but not paid, fees need to be paid to continue then the workflow task should not be allowed to proceed");
	}
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