/*Event   WorkflowTaskUpdateAfter   
Criteria   wf step "Fee Processing" = "Ready to Pay" 
Action email the applicant with any invoiced fees on the record. 
SW
*/

if ("Fee Processing".equals(wfTask) && "Ready to Pay".equals(wfStatus))
{
	//Get all invoiced fees
	var iFees = new Array();
	var feesString = "";
	iFees = getInvoicedFees();

	if (iFees.length > 0)
	{
		for (var f in iFees)
		{
			//Create string to include in email
			feesString += iFees[f].getFeeCod() + " " + iFees[f].getFeeDescription() + ": " + iFees[f].getFee() + "\n";

		}
		var contact = "Applicant";
		var template = "JD_TEST_TEMPLATE";
		var emailparams = aa.util.newHashtable();
		emailparams.put("$$invoideFees$$", feesString);
		emailContacts(contact, template, emailparams, "", "", "N", "");
	}
}


function getInvoicedFees()
{
	var result = new Array();
	var itemCap = capId;
	if (arguments.length > 0) itemCap = arguments[1];

	var feeItemsArray = aa.finance.getFeeItemByCapID(itemCap)
	if (!feeItemsArray.getSuccess())
	{
		logDebug("Problem retrieving fee items from $record$ ".replace("$record$", capId.getCustomID()) + feeItemsArray.getErrorMessage());
		return result;
	}
	var feeItems = feeItemsArray.getOutput();
	for (var x in feeItems)
	{
		if ("INVOICED".equals(feeItems[x].getFeeitemStatus()))
		{
			result.push(feeItems[x]);
		}
	}
	return result;	
}