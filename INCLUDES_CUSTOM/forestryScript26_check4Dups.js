function forestryScript26_check4Dups(){
    try{
        var sourceOfRequest = AInfo["Source of Request"];
        var checkForDups = AInfo["Check for Duplicates"];
        var possibleDupAltIds = "";
        
        if(ifTracer(checkForDups == "CHECKED", 'Checking for duplicates')){
            var capAddResult = aa.cap.getCapListByDetailAddress(AddressStreetName,parseInt(AddressHouseNumber),AddressStreetSuffix,AddressZip,AddressStreetDirection,null);
            if(!capAddResult.getSuccess()) return;
            
            var capIdArray = capAddResult.getOutput();
            
            for (cappy in capIdArray){
                var relCapId = capIdArray[cappy].getCapID();
                var relCap = aa.cap.getCap(relCapId).getOutput();
                // get cap type
                var relType = relCap.getCapType().toString();
                var relStatus = relCap.getCapStatus();
                var relSoR = getAppSpecific("Source of Request",relCapId);
                
                if(relType.startsWith("Forestry/Request") && matches(relStatus, "Wait List", "Assigned", "Submitted", "Working") && relSoR == sourceOfRequest){
                    possibleDupAltIds += relCapId.getCustomID() + ",";
                }
            }
            
            if(possibleDupAltIds.length > 0){
                cancel = true;
                showMessage = true;
                comment("Possible duplicates: " + + possibleDupAltIds.substring(0, possibleDupAltIds.length -1););
            }
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function (). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function (). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
}