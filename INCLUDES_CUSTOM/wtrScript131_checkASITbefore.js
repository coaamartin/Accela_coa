function wtrScript131_checkASITbefore(){
    logDebug("wtrScript131_checkASITbefore() started");
    try{
        var permitType = AInfo["Utility Permit Type"];
        var WATERMATERIAL = []
        loadASITablesBefore();
        
        if(permitType == "Water Main Utility Permit"){
            if(!WATERMATERIAL || WATERMATERIAL.length <= 0){
                cancel = true;
                showMessage = true;
                comment("WATER MATERIAL custom list cannot be empty when permit type is 'Water Main Utility Permit'");
            }
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function wtrScript131_checkASITbefore(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function wtrScript131_checkASITbefore(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("wtrScript131_checkASITbefore() ended");
}//END wtrScript131_checkASITbefore()