function 5097_Enforcement_check4Dups(){
    try{
        //var checkForDups = AInfo["Check for Duplicates"];
        //var possibleDupAltIds = "";
        
        //if(ifTracer(checkForDups == "CHECKED", 'Checking for duplicates')){
            var capAddResult = aa.cap.getCapListByDetailAddress(AddressStreetName,parseInt(AddressHouseNumber),AddressStreetSuffix,AddressZip,AddressStreetDirection,null);
            if(!capAddResult.getSuccess()) return;
            
            var capIdArray = capAddResult.getOutput();
            
            for (cappy in capIdArray){
                var relCapId = capIdArray[cappy].getCapID();
                var relCap = aa.cap.getCap(relCapId).getOutput();
                // get cap type
                var relType = relCap.getCapType().toString();
                var relStatus = relCap.getCapStatus();
                //Add new blocks here for other records.
                if(relType.startsWith("Enforcement/Incident/Vacant/Master") && matches(relStatus, "Application","Monitoring","Recorded","Recorded and Assessed","Recorded and Expired","Registered","Registered and Expired","Registered and Recorded")){
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
}
logDebug("---------------------> 5097_Enforcement_check4Dups.js ended.");

//Script Tester footer.  Comment this out when deploying.
//}	

//catch (err) 
//{
//	logDebug("A JavaScript Error occured: " + err.message);
//}
//aa.env.setValue("ScriptReturnCode", "0");
//aa.env.setValue("ScriptReturnMessage", debug)