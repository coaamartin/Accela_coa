//function 5097_Enforcement_check4Dups(){
var params = aa.env.getParamValues();
var keys = params.keys();
var key = null;
while (keys.hasMoreElements()) {
	key = keys.nextElement();
	eval("var " + key + " = aa.env.getValue(\"" + key + "\");");
	logDebug("Loaded Env Variable: " + key + " = " + aa.env.getValue(key));
}

/*------------------------------------------------------------------------------------------------------/
| END Event Specific Variables
/------------------------------------------------------------------------------------------------------*/

if (preExecute.length)
	doStandardChoiceActions(preExecute, true, 0); // run Pre-execution code

logGlobals(AInfo);

	//var vAddress;
	//AddedAddressList = AddedAddressList.toArray();	
	//logDebug("the message was " + AddedAddressList);
	//x = 0;
	//for (x in AddedAddressList) {
	//	vAddress = AddedAddressList[x];
	//logDebug("the address was " + AddedAddressList);		
	//}
    try{
        var checkForDups = AInfo["Check for Duplicates"];
        var possibleDupAltIds = "";
        
        //if(ifTracer(checkForDups == "CHECKED", 'Checking for duplicates')){
			logDebug("1 " + AddressStreetName);
			logDebug("1 " + AddressHouseNumber);
			logDebug("1 " + AddressStreetSuffix);
			logDebug("1 " + AddressZip);
			logDebug("1 " + AddressStreetDirection);			
            var capAddResult = aa.cap.getCapListByDetailAddress(AddressStreetName,parseInt(AddressHouseNumber),AddressStreetSuffix,AddressZip,AddressStreetDirection,null);
            if(!capAddResult.getSuccess()) {logDebug("the message was no data found. ");};
            logDebug("Found something so moving on. " + capAddResult);
            var capIdArray = capAddResult.getOutput();
              logDebug("Found something so moving on. " + capIdArray); 
y=0;			  
            for (y in capIdArray){
				            logDebug("inside for loop. ");
                var relCapId = capIdArray[y].getCapID();
                var relCap = aa.cap.getCap(relCapId).getOutput();
                // get cap type
                var relType = relCap.getCapType().toString();
                var relStatus = relCap.getCapStatus();
                
                if(relType.startsWith("Enforcement/Incident/Vacant/Master") && matches(relStatus, "Monitoring","Assigned","Submitted","Working","No Plant","Planted","Removed","Complete Not Stake", "Complete Staked","Warranty Failed")){
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