/*
* CPOIES CONTACTS

    OPTIONS: ADDITIONAL OPTIONS YOU NEED FOR FILTERING OR COPYING OPTIONS 
    combines functonality of global functions copyContacts() and copyContactsByType()
*/
function copyContacts2(srcCapId, destCapId, options) {
    var settings = {
         contactType: null,  //if not null, filters by contact type
         copyContactAddressList: true
    };
    for (var attr in options) { settings[attr] = options[attr]; } //optional params - overriding default settings

    
	if (destCapId == null)
		var vToCapId = capId;
	else
		var vToCapId = destCapId;

	var capContactResult = aa.people.getCapContactByCapID(srcCapId);
	var copied = 0;
	if (capContactResult.getSuccess()) {
        var contacts = capContactResult.getOutput();

		for (yy in contacts) {

            if(settings.contactType == null || contacts[yy].getCapContactModel().getContactType() == settings.contactType) {
                var newContact = contacts[yy].getCapContactModel();

                if(settings.copyContactAddressList == true) {
                    // Retrieve contact address list and set to related contact
                    var contactAddressrs = aa.address.getContactAddressListByCapContact(newContact);
                    if (contactAddressrs.getSuccess()) {
                        var contactAddressModelArr = convertContactAddressModelArr(contactAddressrs.getOutput());
                        newContact.getPeople().setContactAddressList(contactAddressModelArr);
                    }
                    newContact.setCapID(vToCapId);
                    aa.people.createCapContact(newContact);

                } else {
                    newContact.setCapID(vToCapId);
                    aa.people.createCapContactWithAttribute(newContact);
                }

                // Create cap contact, contact address and contact template
                copied++;
                logDebug("Copied contact from " + srcCapId.getCustomID() + " to " + vToCapId.getCustomID());
            }

		}
	} else {
		logMessage("**ERROR: Failed to get contacts: " + capContactResult.getErrorMessage());
		return false;
	}
	return copied;
}
