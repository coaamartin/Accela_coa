function getContacts(options) {
    var settings = {
        capId: capId,
        contactType: null //if not null, filters by contact type
    };
    for (var attr in options) { settings[attr] = options[attr]; } //optional params - overriding default settings

    
    var contactsByType = [];
	var contactArray = getPeople(settings.capId);

	for (thisContact in contactArray) {
        if (settings.contactType == null || (contactArray[thisContact].getPeople().contactType).toUpperCase() == conType.toUpperCase()) {
            contactsByType.push(contactArray[thisContact].getPeople())
        }
    }
	return contactsByType;
}
