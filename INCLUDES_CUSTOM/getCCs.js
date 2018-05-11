function getCCs(recipientEmail) {
    var contactList = getPeople(capId);
    var ownersList = getOwner(capId);
    var cc = new Array();

    for (i in contactList) {
        var contact = contactList[i];
        var contactEmail = contact.getEmail();
        if (!isEmpty(contactEmail) && contactEmail != recipientEmail) {
            cc.push(contactEmail);
        }
    }

    for (i in ownersList) {
        var owner = ownersList[i];
        var ownerEmail = owner.getEmail();
        if (!isEmpty(ownerEmail) && ownerEmail != recipientEmail) {
            cc.push(ownerEmail);
        }
    }

    return cc.join(";");
}

