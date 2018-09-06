function wtrScript131_checkASITbefore(){
    logDebug("wtrScript131_checkASITbefore() started");
    try{
        var permitType = AInfo["Utility Permit Type"];
        var doCancel = false;
            try{
                var watMatRows = 0;
                var sizeRows = 0;
                var swpRows = 0;
                var psspRows = 0;
                var privSspRows = 0;
                var privFireRows = 0;
                
                var minRows = 1;
                var rowsNeededInTable = "";
                loadASITablesBefore4CoA();
				logDebug("SIZE.length:" + SIZE.length);
                if(ifTracer(permitType == "Water Main Utility Permit", 'permitType == "Water Main Utility Permit"')){
                    watMatRows = WATERMATERIAL.length;
                    for(x in WATERMATERIAL){
                        var col1 = WATERMATERIAL[x]["Size of Pipe"];
                        var col2 = WATERMATERIAL[x]["Pipe Material"];       
                        var col3 = WATERMATERIAL[x]["Length in Lineal Feet"];
                        
                        logDebug("col1:" + col1 + ";col1.length():" + col1.length());
                        logDebug("col2:" + col2 + ";col2.length():" + col2.length());
                        logDebug("col3:" + col3 + ";col3.length():" + col3.length());
                        if((col1 != null) || (col2 != null) || (col3 != null)){
                           doCancel = false;
                        }
                        else
                            doCancel = true;
                    }
                    
                    sizeRows = SIZE.length;
                    for(x in SIZE){
                        var col1 = SIZE[x]["Size"];
                        var col2 = SIZE[x]["Number of Taps"];       
                        var col3 = SIZE[x]["Location Description"];
                        var col4 = SIZE[X]["Complete"];
                        
                        logDebug("col1:" + col1 + ";col1.length():" + col1.length());
                        logDebug("col2:" + col2 + ";col2.length():" + col2.length());
                        logDebug("col3:" + col3 + ";col3.length():" + col3.length());
                        logDebug("col4:" + col4 + ";col4.length():" + col4.length());
                        if((col1 != null) || (col2 != null) || (col3 != null) || (col4 != null)){
                           doCancel = false;
                        }
                        else
                            doCancel = true;
                    }
                }
                if(ifTracer(permitType == "Sanitary Sewer Permit", 'permitType == "Sanitary Sewer Permit"')){//SANITARYSEWERMATERIAL
                    swpRows = SANITARYSEWERMATERIAL.length;
                    for(x in SANITARYSEWERMATERIAL){
                        var col1 = SANITARYSEWERMATERIAL[x]["Size of Pipe"];
                        var col2 = SANITARYSEWERMATERIAL[x]["Pipe Material"];       
                        var col3 = SANITARYSEWERMATERIAL[x]["Length in Lineal Feet"];
                        
                        logDebug("col1:" + col1 + ";col1.length():" + col1.length());
                        logDebug("col2:" + col2 + ";col2.length():" + col2.length());
                        logDebug("col3:" + col3 + ";col3.length():" + col3.length());
                        if((col1 != null) || (col2 != null) || (col3 != null)){
                           doCancel = false;
                        }
                        else
                            doCancel = true;
                    }
                }
                if(ifTracer(permitType == "Public Storm Sewer Permit", 'permitType == "Public Storm Sewer Permit"')){//PUBLICSTORMMATERIAL
                    psspRows = PUBLICSTORMMATERIAL.length;
                    for(x in PUBLICSTORMMATERIAL){
                        var col1 = PUBLICSTORMMATERIAL[x]["Size of Pipe"];
                        var col2 = PUBLICSTORMMATERIAL[x]["Pipe Material"];       
                        var col3 = PUBLICSTORMMATERIAL[x]["Length in Lineal Feet"];
                        
                        logDebug("col1:" + col1 + ";col1.length():" + col1.length());
                        logDebug("col2:" + col2 + ";col2.length():" + col2.length());
                        logDebug("col3:" + col3 + ";col3.length():" + col3.length());
                        if((col1 != null) || (col2 != null) || (col3 != null)){
                           doCancel = false;
                        }
                        else
                            doCancel = true;
                    }
                }
                if(ifTracer(permitType == "Private Storm Sewer Permit", 'permitType == "Private Storm Sewer Permit"')){//PRIVATESTORMMATERIAL
                    privSspRows = PRIVATESTORMMATERIAL.length;
                    for(x in PRIVATESTORMMATERIAL){
                        var col1 = PRIVATESTORMMATERIAL[x]["Size of Pipe"];
                        var col2 = PRIVATESTORMMATERIAL[x]["Pipe Material"];       
                        var col3 = PRIVATESTORMMATERIAL[x]["Length in Lineal Feet"];
                        
                        logDebug("col1:" + col1 + ";col1.length():" + col1.length());
                        logDebug("col2:" + col2 + ";col2.length():" + col2.length());
                        logDebug("col3:" + col3 + ";col3.length():" + col3.length());
                        if((col1 != null) || (col2 != null) || (col3 != null)){
                           doCancel = false;
                        }
                        else
                            doCancel = true;
                    }
                }
                if(ifTracer(permitType == "Private Fire Line Permit", 'permitType == "Private Fire Line Permit"')){//PRIVATEFIRELINEMATERIAL
                    privFireRows = PRIVATEFIRELINEMATERIAL.length;
                    for(x in PRIVATEFIRELINEMATERIAL){
                        var col1 = PRIVATEFIRELINEMATERIAL[x]["Size of Pipe"];
                        var col2 = PRIVATEFIRELINEMATERIAL[x]["Pipe Material"];       
                        var col3 = PRIVATEFIRELINEMATERIAL[x]["Length in Lineal Feet"];
                        
                        logDebug("col1:" + col1 + ";col1.length():" + col1.length());
                        logDebug("col2:" + col2 + ";col2.length():" + col2.length());
                        logDebug("col3:" + col3 + ";col3.length():" + col3.length());
                        if((col1 != null) || (col2 != null) || (col3 != null)){
                           doCancel = false;
                        }
                        else
                            doCancel = true;
                    }
                }
                
            }
            catch(err2){
                if(watMatRows   < minRows && sizeRows >= minRows && permitType == "Water Main Utility Permit")  { doCancel = true; rowsNeededInTable = "WATER MATERIAL"; }
                if(sizeRows     < minRows && watMatRows >= minRows && permitType == "Water Main Utility Permit")  { doCancel = true; rowsNeededInTable = "SIZE"; }
                if(sizeRows     < minRows && watMatRows < minRows && permitType == "Water Main Utility Permit")  { doCancel = true; rowsNeededInTable = "SIZE and WATER MATERIAL"; }
                if(swpRows      < minRows && permitType == "Sanitary Sewer Permit")      { doCancel = true; rowsNeededInTable = "SANITARY SEWER MATERIAL"; }
                if(psspRows     < minRows && permitType == "Public Storm Sewer Permit")  { doCancel = true; rowsNeededInTable = "PUBLIC STORM MATERIAL"; }
                if(privSspRows  < minRows && permitType == "Private Storm Sewer Permit") { doCancel = true; rowsNeededInTable = "PRIVATE STORM MATERIAL"; }
                if(privFireRows < minRows && permitType == "Private Fire Line Permit")   { doCancel = true; rowsNeededInTable = "PRIVATE FIRE LINE MATERIAL"; }
				
				logDebug("Error on wtrScript131_checkASITbefore(). Err: " + err2);
            }
            logDebug("watMatRows:" + watMatRows);
			logDebug("sizeRows:" + sizeRows)
			if(watMatRows   < minRows && sizeRows >= minRows && permitType == "Water Main Utility Permit")  { doCancel = true; rowsNeededInTable = "WATER MATERIAL"; }
            if(sizeRows     < minRows && watMatRows >= minRows && permitType == "Water Main Utility Permit")  { doCancel = true; rowsNeededInTable = "SIZE"; }
            if(sizeRows     < minRows && watMatRows < minRows && permitType == "Water Main Utility Permit")  { doCancel = true; rowsNeededInTable = "SIZE and WATER MATERIAL"; }
            if(swpRows      < minRows && permitType == "Sanitary Sewer Permit")      { doCancel = true; rowsNeededInTable = "SANITARY SEWER MATERIAL"; }
            if(psspRows     < minRows && permitType == "Public Storm Sewer Permit")  { doCancel = true; rowsNeededInTable = "PUBLIC STORM MATERIAL"; }
            if(privSspRows  < minRows && permitType == "Private Storm Sewer Permit") { doCancel = true; rowsNeededInTable = "PRIVATE STORM MATERIAL"; }
            if(privFireRows < minRows && permitType == "Private Fire Line Permit")   { doCancel = true; rowsNeededInTable = "PRIVATE FIRE LINE MATERIAL"; }
			
            if(doCancel){
                cancel = true;
                showMessage = true;
                comment("You must add at least 1 row in " + rowsNeededInTable);
            }
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function wtrScript131_checkASITbefore(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function wtrScript131_checkASITbefore(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("wtrScript131_checkASITbefore() ended");
}//END wtrScript131_checkASITbefore()