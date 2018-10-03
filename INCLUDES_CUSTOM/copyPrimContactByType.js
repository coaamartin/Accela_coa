function copyPrimContactByType(pFromCapId, pToCapId, pContactType)
{
	//Copies all contacts from pFromCapId to pToCapId
	//where type == pContactType
	if (pToCapId==null)
		var vToCapId = capId;
	else
		var vToCapId = pToCapId;
	
	var capContactResult = aa.people.getCapContactByCapID(pFromCapId);
	var copied = 0;
	if (capContactResult.getSuccess())
	{
		var Contacts = capContactResult.getOutput();
		for (yy in Contacts)
		{   var capContactModel = Contacts[yy].getCapContactModel();
			if(capContactModel.getContactType() == pContactType && capContactModel.getPrimaryFlag() == "Y")
			{
			    var newContact = Contacts[yy].getCapContactModel();
			    newContact.setCapID(vToCapId);
			    aa.people.createCapContact(newContact);
			    copied++;
			    logDebug("Copied primary " + pContactType + " from "+pFromCapId.getCustomID()+" to "+vToCapId.getCustomID());
			}
		}
	}
	else
	{
		logMessage("**ERROR: Failed to get contacts: " + capContactResult.getErrorMessage()); 
		return false; 
	}
	
	if(copied > 0) return true;
	return false;
} 