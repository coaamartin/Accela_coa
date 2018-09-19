//script83_TapAppFees
//Record Types: Water/Water/Tap/Application
//Event: ASA- ApplicationSubmitAfter, ASIUA- AppSpecificInfoUpdateAfter
//Desc: Add fees with ASI is updated.
//Created By: Silver Lining Solutions
//Updated 07/27/2018 (evontrapp@etechconsultingllc.com) - Added logic to check for pre/post 2017 fee schedule
//Updated 07/30/2018 (evontrapp@etechconsultingllc.com) - Added fee logic for Cherry Creek Basin, Commercial Water fee, and updated Z-Zone fee assessment

function script83_TapAppFees() {
    logDebug("script83_TapAppFees started.");
    try{
        var type = AInfo["Type"];
        var plattedAfter = AInfo["Platted after 2017"];
        var feeItem = "";
        var feeSched = "";
        var feePeriod = "FINAL";
        var feeQty = 0;
        var feeInv = "N";
        
        //Variables used for calculating amount
        var waterClosets = AInfo["Water Closets"];
        var lotSize      = AInfo["Total Lot Size"];
        var stubOut      = AInfo["Stub out Paid with Building Permit"];
        var constWtr     = AInfo["Construction Water"];
        var cherryCreek  = AInfo["Cherry Creek Basin"];
        var resUnits     = AInfo["Number of Residential Units"];
        var sizeWtrMeter = AInfo["Size of Water Meter"];
        var hardSfSqFt   = AInfo["Hard Surface Sq Ft"];
        var bldgSqFt     = AInfo["Building Sq Ft"];
        var avrDailyDemd = AInfo["Average Daily Demand(In GPD)"];
        var nonWtrSqFt   = AInfo["Non-water conserving sq ft"];
        var wtrSqFt      = AInfo["Water conserving sq ft"];
        
		var feeArray = ["WAT_TA_01","WAT_TA_02","WAT_TA_03","WAT_TA_04","WAT_TA_05","WAT_TA_06","WAT_TA_09","WAT_TA_10","WAT_TA_11","WAT_TA_12","WAT_TA_16","WAT_TA_17","WAT_TA_18","WAT_TA_19","WAT_TA_20","WAT_TA_21","WAT_TA_22","WAT_TA_23","WAT_TA_24","WAT_TA_25","WAT_TA_26","WAT_TA_27","WAT_TA_28","WAT_TA_29","WAT_TA_30","WAT_TA_31","WAT_TA_32","WAT_TA_33","WAT_TA_36","WAT_TA_37","WAT_TA_39","WAT_TA_40","WAT_TA_41","WAT_TA_42","WAT_TA_44"];
        var feeArray2 = ["WAT_TA2_01","WAT_TA2_02","WAT_TA2_03","WAT_TA2_04","WAT_TA2_05","WAT_TA2_06","WAT_TA2_09","WAT_TA2_10","WAT_TA2_11","WAT_TA2_12","WAT_TA2_16","WAT_TA2_17","WAT_TA2_18","WAT_TA2_19","WAT_TA2_20","WAT_TA2_21","WAT_TA2_22","WAT_TA2_23","WAT_TA2_24","WAT_TA2_25","WAT_TA2_26","WAT_TA2_27","WAT_TA2_28","WAT_TA2_29","WAT_TA2_30","WAT_TA2_31","WAT_TA2_32","WAT_TA2_33","WAT_TA2_36","WAT_TA2_37","WAT_TA2_39","WAT_TA2_40","WAT_TA2_41","WAT_TA2_42","WAT_TA2_44"];
        
		for(j in feeArray){
            var aFee = feeArray[j];
            if(feeExists(aFee)) removeFee(aFee, feePeriod);
        }
		
		for(j in feeArray2){
            var aFee = feeArray2[j];
            if(feeExists(aFee)) removeFee(aFee, feePeriod);
        }
		
        //use WAT_TA fee schedule if platted after 2017
        if (ifTracer(plattedAfter == "Yes", 'Platted Prior 2017')) {
            feeSched = "WAT_TA";
            
            
            
            if(ifTracer(type == "Single Family Detached", "Single Family Detached")){
                if(waterClosets){
                    waterClosets = parseFloat(waterClosets);
                    if(waterClosets < 3) feeItem = "WAT_TA_01";
                    if(waterClosets >= 3 && waterClosets < 5) feeItem = "WAT_TA_02";
                    if(waterClosets >= 5) feeItem = "WAT_TA_03";
                    
                    if(feeItem != "") {
                        updateFee(feeItem, feeSched, feePeriod, 1, feeInv);
                        feeItem = ""; 
                    }
                }
                
                if(lotSize) updateFee("WAT_TA_04", feeSched, feePeriod, parseFloat(lotSize), feeInv);
                if(stubOut == "Yes") updateFee("WAT_TA_44", feeSched, feePeriod, 1, feeInv);
                
                updateFee("WAT_TA_05", feeSched, feePeriod, 1, feeInv);
                updateFee("WAT_TA_06", feeSched, feePeriod, 1, feeInv);
                
                if(constWtr == "Yes") updateFee("WAT_TA_42", feeSched, feePeriod, 1, feeInv);
                if(cherryCreek == "Yes") updateFee("WAT_TA_40", feeSched, feePeriod, 1, feeInv);
            }
                
            if(ifTracer(type == "Single Family Attached", "Single Family Attached")){
                if(resUnits) updateFee("WAT_TA_09", feeSched, feePeriod, parseFloat(resUnits), feeInv);
                if(lotSize) updateFee("WAT_TA_10", feeSched, feePeriod, parseFloat(lotSize), feeInv);
                if(stubOut == "Yes") updateFee("WAT_TA_44", feeSched, feePeriod, 1, feeInv);
                   
                updateFee("WAT_TA_11", feeSched, feePeriod, 1, feeInv);
                updateFee("WAT_TA_12", feeSched, feePeriod, 1, feeInv);
                
                if(constWtr == "Yes") updateFee("WAT_TA_42", feeSched, feePeriod, 1, feeInv);
                if(cherryCreek == "Yes") updateFee("WAT_TA_40", feeSched, feePeriod, 1, feeInv);
            }
            
            if(ifTracer(type == "Multi Family", "Multi Family")){
                if(resUnits) updateFee("WAT_TA_16", feeSched, feePeriod, parseFloat(resUnits), feeInv);
                if(stubOut == "Yes") updateFee("WAT_TA_44", feeSched, feePeriod, 1, feeInv);
                
                if(resUnits) updateFee("WAT_TA_17", feeSched, feePeriod, parseFloat(resUnits), feeInv);
                
                if(sizeWtrMeter == '3/4"') updateFee("WAT_TA_18", feeSched, feePeriod, 1, feeInv);
                if(sizeWtrMeter == '1"') updateFee("WAT_TA_19", feeSched, feePeriod, 1, feeInv);
                if(sizeWtrMeter == '1 1/2"') updateFee("WAT_TA_20", feeSched, feePeriod, 1, feeInv);
                if(sizeWtrMeter == '2"') updateFee("WAT_TA_21", feeSched, feePeriod, 1, feeInv);
                
                if(constWtr == "Yes") updateFee("WAT_TA_42", feeSched, feePeriod, 1, feeInv);
                if(cherryCreek == "Yes") {
                    if(hardSfSqFt) hardSfSqFt = parseFloat(hardSfSqFt); else hardSfSqFt = 0;
                    if(bldgSqFt) bldgSqFt = parseFloat(bldgSqFt); else bldgSqFt = 0;
                    updateFee("WAT_TA_41", feeSched, feePeriod, hardSfSqFt + bldgSqFt, feeInv);
                }
            }
                
            if(ifTracer(type == "Commercial", "Commercial")){
                if(sizeWtrMeter == '3/4"')   {
                    updateFee("WAT_TA_22", feeSched, feePeriod, 1, feeInv);
                    updateFee("WAT_TA_26", feeSched, feePeriod, 1, feeInv);
                    updateFee("WAT_TA_30", feeSched, feePeriod, 1, feeInv);
                }
                if(sizeWtrMeter == '1"')     {
                    updateFee("WAT_TA_23", feeSched, feePeriod, 1, feeInv);
                    updateFee("WAT_TA_27", feeSched, feePeriod, 1, feeInv);
                    updateFee("WAT_TA_31", feeSched, feePeriod, 1, feeInv);
                }
                if(sizeWtrMeter == '1 1/2"') {
                    updateFee("WAT_TA_24", feeSched, feePeriod, 1, feeInv);
                    updateFee("WAT_TA_28", feeSched, feePeriod, 1, feeInv);
                    updateFee("WAT_TA_32", feeSched, feePeriod, 1, feeInv);
                }
                if(sizeWtrMeter == '2"')     {
                    updateFee("WAT_TA_25", feeSched, feePeriod, 1, feeInv);
                    updateFee("WAT_TA_29", feeSched, feePeriod, 1, feeInv);
                    updateFee("WAT_TA_33", feeSched, feePeriod, 1, feeInv);
                }
                
                if(matches(sizeWtrMeter, '3"', '4"', '6"', '8"', '10"', '12"','Other')){
                    if(avrDailyDemd) {
                        avrDailyDemd = parseFloat(avrDailyDemd);
                        updateFee("WAT_TA_39", feeSched, feePeriod, avrDailyDemd, feeInv)
                    }
                }
                
                if(stubOut == "Yes") updateFee("WAT_TA_44", feeSched, feePeriod, 1, feeInv);
                
                if(constWtr == "Yes") updateFee("WAT_TA_42", feeSched, feePeriod, 1, feeInv);
                if(cherryCreek == "Yes") {
                    if(hardSfSqFt) hardSfSqFt = parseFloat(hardSfSqFt); else hardSfSqFt = 0;
                    if(bldgSqFt) bldgSqFt = parseFloat(bldgSqFt); else bldgSqFt = 0;
                    updateFee("WAT_TA_41", feeSched, feePeriod, hardSfSqFt + bldgSqFt, feeInv);
                }
            }
            
            if(ifTracer(type == "Irrigation", "Irrigation")){
                if(nonWtrSqFt) {
                    nonWtrSqFt = parseFloat(nonWtrSqFt);
                    updateFee("WAT_TA_36", feeSched, feePeriod, nonWtrSqFt, feeInv)
                }
                
                if(wtrSqFt) {
                    wtrSqFt = parseFloat(wtrSqFt);
                    updateFee("WAT_TA_37", feeSched, feePeriod, wtrSqFt, feeInv)
                }
            }
        } else if (ifTracer(plattedAfter == "No", 'Platted After 2017')) { //use WAT_TA2 fee schedule if platted before 2017
                feeSched = "WAT_TA2";
                
                if(ifTracer(type == "Single Family Detached", "Single Family Detached")){
                    if(waterClosets){
                        waterClosets = parseFloat(waterClosets);
                        if(waterClosets < 3) feeItem = "WAT_TA2_01";
                        if(waterClosets >= 3 && waterClosets < 5) feeItem = "WAT_TA2_02";
                        if(waterClosets >= 5) feeItem = "WAT_TA2_03";
                        
                        if(feeItem != "") { updateFee(feeItem, feeSched, feePeriod, 1, feeInv); feeItem = "";}
                    }
                
                    if(lotSize) updateFee("WAT_TA2_04", feeSched, feePeriod, parseFloat(lotSize), feeInv);
                    if(stubOut == "Yes") updateFee("WAT_TA2_44", feeSched, feePeriod, 1, feeInv);
                    
                    updateFee("WAT_TA2_05", feeSched, feePeriod, 1, feeInv);
                    updateFee("WAT_TA2_06", feeSched, feePeriod, 1, feeInv);
                
                    if(constWtr == "Yes") updateFee("WAT_TA2_42", feeSched, feePeriod, 1, feeInv);
                    if(cherryCreek == "Yes") updateFee("WAT_TA2_40", feeSched, feePeriod, 1, feeInv);
                }
                
                if(ifTracer(type == "Single Family Attached", "Single Family Attached")){
                    if(resUnits) updateFee("WAT_TA2_09", feeSched, feePeriod, parseFloat(resUnits), feeInv);
                    if(lotSize) updateFee("WAT_TA2_10", feeSched, feePeriod, parseFloat(lotSize), feeInv);
                    if(stubOut == "Yes") updateFee("WAT_TA2_44", feeSched, feePeriod, 1, feeInv);
                    
                    updateFee("WAT_TA2_11", feeSched, feePeriod, 1, feeInv);
                    updateFee("WAT_TA2_12", feeSched, feePeriod, 1, feeInv);
                
                    if(constWtr == "Yes") updateFee("WAT_TA2_42", feeSched, feePeriod, 1, feeInv);
                    if(cherryCreek == "Yes") updateFee("WAT_TA2_40", feeSched, feePeriod, 1, feeInv);
                }
            
                if(ifTracer(type == "Multi Family", "Multi Family")){
                    if(resUnits) updateFee("WAT_TA2_16", feeSched, feePeriod, parseFloat(resUnits), feeInv);
                    if(stubOut == "Yes") updateFee("WAT_TA2_44", feeSched, feePeriod, 1, feeInv);
                    
                    if(resUnits) updateFee("WAT_TA2_17", feeSched, feePeriod, parseFloat(resUnits), feeInv);
                    
                    if(sizeWtrMeter == '3/4"')   updateFee("WAT_TA2_18", feeSched, feePeriod, 1, feeInv);
                    if(sizeWtrMeter == '1"')     updateFee("WAT_TA2_19", feeSched, feePeriod, 1, feeInv);
                    if(sizeWtrMeter == '1 1/2"') updateFee("WAT_TA2_20", feeSched, feePeriod, 1, feeInv);
                    if(sizeWtrMeter == '2"')     updateFee("WAT_TA2_21", feeSched, feePeriod, 1, feeInv);
                
                    if(constWtr == "Yes") updateFee("WAT_TA2_42", feeSched, feePeriod, 1, feeInv);
                    if(cherryCreek == "Yes") {
                        if(hardSfSqFt) hardSfSqFt = parseFloat(hardSfSqFt); else hardSfSqFt = 0;
                        if(bldgSqFt) bldgSqFt = parseFloat(bldgSqFt); else bldgSqFt = 0;
                        updateFee("WAT_TA2_41", feeSched, feePeriod, hardSfSqFt + bldgSqFt, feeInv);
                    }
                }
                
                if(ifTracer(type == "Commercial", "Commercial")){
                    if(sizeWtrMeter == '3/4"')   {
                        updateFee("WAT_TA2_22", feeSched, feePeriod, 1, feeInv);
                        updateFee("WAT_TA2_26", feeSched, feePeriod, 1, feeInv);
                        updateFee("WAT_TA2_30", feeSched, feePeriod, 1, feeInv);
                    }
                    if(sizeWtrMeter == '1"')     {
                        updateFee("WAT_TA2_23", feeSched, feePeriod, 1, feeInv);
                        updateFee("WAT_TA2_27", feeSched, feePeriod, 1, feeInv);
                        updateFee("WAT_TA2_31", feeSched, feePeriod, 1, feeInv);
                    }
                    if(sizeWtrMeter == '1 1/2"') {
                        updateFee("WAT_TA2_24", feeSched, feePeriod, 1, feeInv);
                        updateFee("WAT_TA2_28", feeSched, feePeriod, 1, feeInv);
                        updateFee("WAT_TA2_32", feeSched, feePeriod, 1, feeInv);
                    }
                    if(sizeWtrMeter == '2"')     {
                        updateFee("WAT_TA2_25", feeSched, feePeriod, 1, feeInv);
                        updateFee("WAT_TA2_29", feeSched, feePeriod, 1, feeInv);
                        updateFee("WAT_TA2_33", feeSched, feePeriod, 1, feeInv);
                    }
                    
                    if(matches(sizeWtrMeter, '3"', '4"', '6"', '8"', '10"', '12"','Other')){
                        if(avrDailyDemd) {
                            avrDailyDemd = parseFloat(avrDailyDemd);
                            updateFee("WAT_TA2_39", feeSched, feePeriod, avrDailyDemd, feeInv)
                        }
                    }
                    
                    if(stubOut == "Yes") updateFee("WAT_TA2_44", feeSched, feePeriod, 1, feeInv);
                    
                    if(constWtr == "Yes") updateFee("WAT_TA2_42", feeSched, feePeriod, 1, feeInv);
                    if(cherryCreek == "Yes") {
                        if(hardSfSqFt) hardSfSqFt = parseFloat(hardSfSqFt); else hardSfSqFt = 0;
                        if(bldgSqFt) bldgSqFt = parseFloat(bldgSqFt); else bldgSqFt = 0;
                        updateFee("WAT_TA2_41", feeSched, feePeriod, hardSfSqFt + bldgSqFt, feeInv);
                    }
                }
            
                if(ifTracer(type == "Irrigation", "Irrigation")){
                    if(nonWtrSqFt) {
                        nonWtrSqFt = parseFloat(nonWtrSqFt);
                        updateFee("WAT_TA2_36", feeSched, feePeriod, nonWtrSqFt, feeInv)
                    }
                    
                    if(wtrSqFt) {
                        wtrSqFt = parseFloat(wtrSqFt);
                        updateFee("WAT_TA2_37", feeSched, feePeriod, wtrSqFt, feeInv)
                    }
                }
        } 
        else {
            logDebug("Missing AInfo: Platted after 2017");
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function script83_TapAppFees. Please contact administrator. Err: " + err);
        logDebug("Error on custom function script83_TapAppFees. Please contact administrator. Err: " + err);
        logDebug("A JavaScript Error occurred: ASA:Water/Water/Tap/Application 83: " + err.message);
        logDebug(err.stack)
    }
    
    logDebug("script83_TapAppFees ended.");
}//END script83_TapAppFees