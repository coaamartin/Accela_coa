//removeContactsFromCapByType()
function removeContactsFromCapByType(itemCapId, conType){
    var cons = aa.people.getCapContactByCapID(itemCapId).getOutput();
    for (x in cons){
        var conSeqNum = cons[x].getPeople().getContactSeqNumber();
		var thisConType = cons[x].getPeople().getContacType();
	    if (conSeqNum && thisConType == conType){	
		    aa.people.removeCapContact(itemCapId, conSeqNum);
	    }
    }
}