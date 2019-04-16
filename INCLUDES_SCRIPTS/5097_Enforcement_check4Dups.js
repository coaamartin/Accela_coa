//function 5097_Enforcement_check4Dups(){
	var sameAddressCapId=getCapByAddressN("Enforcement/Incident/Vacant/Master",capId,"Monitoring");
	AddedAddressList = AddedAddressList.toArray();	
	logDebug("the message was " + AddedAddressList);
	x = 0;
	for (x in AddedAddressList) {
		vAddress = AddedAddressList[x];
	logDebug("the address was " + AddedAddressList);		
	}
    try{
        var checkForDups = AInfo["Check for Duplicates"];
        var possibleDupAltIds = "";
        
        //if(ifTracer(checkForDups == "CHECKED", 'Checking for duplicates')){
            var capAddResult = aa.cap.getCapListByDetailAddress(AddressStreetName,parseInt(AddressHouseNumber),AddressStreetSuffix,AddressZip,AddressStreetDirection,null);
            if(!capAddResult.getSuccess()) {logDebug("the message was no data found. ");};
            
            var capIdArray = capAddResult.getOutput();
            
            for (cappy in capIdArray){
                var relCapId = capIdArray[cappy].getCapID();
                var relCap = aa.cap.getCap(relCapId).getOutput();
                // get cap type
                var relType = relCap.getCapType().toString();
                var relStatus = relCap.getCapStatus();
                
                if(relType.startsWith("Forestry/") && matches(relStatus, "Wait List","Assigned","Submitted","Working","No Plant","Planted","Removed","Complete Not Stake", "Complete Staked","Warranty Failed")){
                    possibleDupAltIds += relCapId.getCustomID() + ",";
                }
            }
            
            if(possibleDupAltIds.length > 0){
                cancel = true;
                showMessage = true;
                comment("Possible duplicates: " + possibleDupAltIds.substring(0, possibleDupAltIds.length -1));
            }
        //}
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function (). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function (). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
//}