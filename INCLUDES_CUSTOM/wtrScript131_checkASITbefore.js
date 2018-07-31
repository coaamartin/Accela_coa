function wtrScript131_checkASITbefore(){
    logDebug("wtrScript131_checkASITbefore() started");
    var permitType = AInfo["Utility Permit Type"];
    if(permitType == "Water Main Utility Permit"){
        try{
            var watMatRows = 0;
            var minRows = 1;
            var doCancel = false;
            loadASITablesBefore();
            
            watMatRows = WATERMATERIAL.length;
            for(x in EMPLOYEEINFORMATION){
                var col1 = WATERMATERIAL[x]["Size of Pipe"];
                var col2 = WATERMATERIAL[x]["Pipe Material"];       
                var col3 = WATERMATERIAL[x]["Length in Lineal Feet"];
				
				aa.print("col1:" + col1 + ";col1.length():" + col1.length());
				aa.print("col2:" + col2 + ";col2.length():" + col2.length());
				aa.print("col3:" + col3 + ";col3.length():" + col3.length());
                if((col1.length() != 0) || (col2.length()!=0) || (col3.length()!=0)){
                   doCancel = false;
                }
                else
                    doCancel = true;
            }
            
        }
        catch(err){
            if(watMatRows < minRows) doCancel = true;
        }
        
        if(doCancel){
            cancel = true;
            showMessage = true;
            comment("You must add at least 1 row in  WATER MATERIAL.");
        }
    }
    logDebug("wtrScript131_checkASITbefore() ended");
}//END wtrScript131_checkASITbefore()