/*Event   WorkflowTaskUpdateAfter   
Criteria   wf step "Fee Processing" = "Ready to Pay" 
Action email the applicant with any invoiced fees on the record.
created by swakil
*/

if ("Fee Processing".equals(wfTask) && "Ready to Pay".equals(wfStatus))
{
	//Get all invoiced fees
	var iFees = new Array();
	var feesString = "";
	iFees = getInvoicedFees();
	var feesTotal = 0;

	if (iFees.length > 0)
	{
		for (var f in iFees)
		{
			//Create string to include in email
			feesString += iFees[f].getFeeCod() + " " + iFees[f].getFeeDescription() + ": " + iFees[f].getFee() + "\n";
			feesTotal += parseInt(iFees[f].getFee());

		}
		var contact = "Applicant";
		var template = "TAP_FFES";
		//get contact
		var aContact = getContactByType(contact, capId);
		if (aContact) fullName = aContact.getFullName() || aContact.getFirstName() + " " + aContact.getLastName();

		//build ACA URL
		var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
		acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));  
		var recURL = acaSite + getACAUrl();		

		var emailparams = aa.util.newHashtable();
		emailparams.put("$$date$$", sysDateMMDDYYYY);
		emailparams.put("$$altID$$", capId.getCustomID());
		emailparams.put("$$recAlias$$", appTypeString);
		emailparams.put("$$contactName$$", fullName);
		emailparams.put("$$feesTotal$$", feesTotal);
		emailparams.put("$$balDue$$", balanceDue);
		emailparams.put("$$recLink$$", recURL);
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