function addReferenceContactByBusinessName(busName, itemCap){
    var peopleResult = aa.people.getPeopleByBusinessName(busName);
    
    if (peopleResult.getSuccess()){
        var peopleObj = peopleResult.getOutput();
        //logDebug("peopleObj is "+peopleObj.getClass());
        if (peopleObj==null){
            logDebug("No reference user found.");
            return false;
        }
        logDebug("No. of reference contacts found: "+peopleObj.length);
    }
    else{
        logDebug("**ERROR: Failed to get reference contact record: " + peopleResult.getErrorMessage());
        return false;
    }
    
    //Add the reference contact record to the current CAP
    var contactAddResult = aa.people.createCapContactWithRefPeopleModel(itemCap, peopleObj[0]);
    if (contactAddResult.getSuccess()){
        logDebug("Contact successfully added to CAP.");
        var capContactResult = aa.people.getCapContactByCapID(itemCap);
        if (capContactResult.getSuccess()){
            var Contacts = capContactResult.getOutput();
            var idx = Contacts.length;
            var contactNbr = Contacts[idx-1].getCapContactModel().getPeople().getContactSeqNumber();
            logDebug ("Contact Nbr = "+contactNbr);
            return contactNbr;
        }
        else{
            logDebug("**ERROR: Failed to get Contact Nbr: "+capContactResult.getErrorMessage());
            return false;
        }
    }
    else{
        logDebug("**ERROR: Cannot add contact: " + contactAddResult.getErrorMessage());
        return false;
    }
}//END addReferenceContactByBusinessName()