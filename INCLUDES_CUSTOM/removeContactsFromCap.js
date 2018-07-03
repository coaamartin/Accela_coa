//removeContactsFromCap()
function removeContactsFromCap(itemCapId){
    var cons = aa.people.getCapContactByCapID(itemCapId).getOutput();
    for (x in cons){
        conSeqNum = cons[x].getPeople().getContactSeqNumber();
	    if (conSeqNum){	
		    aa.people.removeCapContact(itemCapId, conSeqNum);
	    }
    }
}