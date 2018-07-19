//script83_TapAppFees
//Record Types: Water/Water/Tap/Application
//Event: ASA- ApplicationSubmitAfter, ASIUA- AppSpecificInfoUpdateAfter
//Desc: Add fees with ASI is updated.
//Created By: Silver Lining Solutions

function script83_TapAppFees() {
    
    logDebug("script83_TapAppFees started.");
    try{
        var wtrMetrSize = AInfo["Size of Water Meter"];
        var type = AInfo["Type"];
        
        if(AInfo["Water Closets"]){
            if (type == "Single Family Detached" && (AInfo["Water Closets"] >= "1" && AInfo["Water Closets"] <= "2")) {
                updateFee("WAT_TA_01","WAT_TA","FINAL",1,"Y");
            }
            if (type == "Single Family Detached" && (AInfo["Water Closets"] >= "3" && AInfo["Water Closets"] <= "4")) {
                updateFee("WAT_TA_02","WAT_TA","FINAL",1,"Y");
            }
            if (type == "Single Family Detached" && AInfo["Water Closets"] >= "5" ) {
                updateFee("WAT_TA_03","WAT_TA","FINAL",1,"Y");
            }
        }
        if (type == "Single Family Detached") {
            updateFee("WAT_TA_04","WAT_TA","FINAL",AInfo["Total Lot Size"],"Y");
            updateFee("WAT_TA_05","WAT_TA","FINAL",1,"Y"); //SF Sanitary Sewer Connection - City of Aurora
            updateFee("WAT_TA_06","WAT_TA","FINAL",1,"Y"); //SF Sanitary Sewer Connection - Metro Wastewater District - 5/8" Meter
        }
        if (type == "Single Family Attached") {
            updateFee("WAT_TA_09","WAT_TA","FINAL",1,"Y");
            updateFee("WAT_TA_10","WAT_TA","FINAL",AInfo["Total Lot Size"],"Y");
            updateFee("WAT_TA_13","WAT_TA","FINAL",1,"Y");
            updateFee("WAT_TA_11","WAT_TA","FINAL",1,"Y");//SFA Sanitary Sewer Connection - City of Aurora
            updateFee("WAT_TA_12","WAT_TA","FINAL",1,"Y");//SFA Sanitary Sewer Connection - Metro Wastewater District - 5/8" Meter
        }
        if (type == "Multi Family") {
            if(AInfo["Number of Residential Units"]){
                updateFee("WAT_TA_16","WAT_TA","FINAL",AInfo["Number of Residential Units"],"Y");
                updateFee("WAT_TA_17","WAT_TA","FINAL",AInfo["Number of Residential Units"],"Y"); //MFR Sanitary Sewer Connection - City of Aurora
            }
            if(wtrMetrSize == '3/4"')   updateFee("WAT_TA_18","WAT_TA","FINAL",1,"Y"); //MFR Sanitary Sewer Connection - Metro Wastewater District - 3/4" Meter
            if(wtrMetrSize == '1"')     updateFee("WAT_TA_19","WAT_TA","FINAL",1,"Y"); //MFR Sanitary Sewer Connection - Metro Wastewater District - 1" Meter
            if(wtrMetrSize == '1 1/2"') updateFee("WAT_TA_20","WAT_TA","FINAL",1,"Y"); //MFR Sanitary Sewer Connection - Metro Wastewater District - 1 1/2" Meter
            if(wtrMetrSize == '2"')     updateFee("WAT_TA_21","WAT_TA","FINAL",1,"Y"); //MFR Sanitary Sewer Connection - Metro Wastewater District - 2" Meter
        }
        if (type == "Commercial"){
            if(wtrMetrSize == '3/4"') {
                updateFee("WAT_TA_22","WAT_TA","FINAL",1,"Y");
                updateFee("WAT_TA_26","WAT_TA","FINAL",1,"Y");//Com Sanitary Sewer Connection - City of Aurora 3/4"
                updateFee("WAT_TA_30","WAT_TA","FINAL",1,"Y");//Com Sanitary Sewer Connection - Metro Wastewater District - 3/4" Meter
            }
            
            if(wtrMetrSize == '1"') {
                updateFee("WAT_TA_23","WAT_TA","FINAL",1,"Y");
                updateFee("WAT_TA_27","WAT_TA","FINAL",1,"Y");//Com Sanitary Sewer Connection - City of Aurora 1"
                updateFee("WAT_TA_31","WAT_TA","FINAL",1,"Y");//Com Sanitary Sewer Connection - Metro Wastewater District - 1" Meter
            }
            
            if(wtrMetrSize == '1 1/2"') {
                updateFee("WAT_TA_24","WAT_TA","FINAL",1,"Y");
                updateFee("WAT_TA_28","WAT_TA","FINAL",1,"Y");//Com Sanitary Sewer Connection - City of Aurora 1 1/2"
                updateFee("WAT_TA_32","","FINAL",1,"Y");//Com Sanitary Sewer Connection - Metro Wastewater District - 1 1/2" Meter
            }
            
            if(wtrMetrSize == '2"') {
                updateFee("WAT_TA_25","WAT_TA","FINAL",1,"Y");
                updateFee("WAT_TA_29","WAT_TA","FINAL",1,"Y");//Com Sanitary Sewer Connection - City of Aurora 2"
                updateFee("WAT_TA_33","WAT_TA","FINAL",1,"Y");//Com Sanitary Sewer Connection - Metro Wastewater District - 2" Meter
            }
            
            if(matches(wtrMetrSize,'2 1/2"','3"','4"','5"','6"','7"','8"','9"','10"','11"','12"') ) {
                updateFee("WAT_TA_39","WAT_TA","FINAL",1,"Y");
                if(AInfo["Average Daily Demand(In GPD)"]) updateFee("WAT_TA_34","WAT_TA","FINAL",AInfo["Average Daily Demand(In GPD)"],"Y");//Com Sanitary Sewer Connection - City of Aurora +2"
                updateFee("WAT_TA_35","WAT_TA","FINAL",1,"Y");//com Sanitary Sewer Connection - Metro Wastewater District - +2" Meter
            }
        }
        
        if(type == "Irrigation"){
            var wtrConserving = AInfo["Water conserving sq ft"];
            var nonWtrConserving = AInfo["Non-water conserving sq ft"];
            var zZone = AInfo["Z zone sq ft"];
            
            if(wtrConserving) updateFee("WAT_TA_37","WAT_TA","FINAL",wtrConserving,"Y");//water Conserving
            if(nonWtrConserving) updateFee("WAT_TA_36","WAT_TA","FINAL",nonWtrConserving,"Y");//Non-water Conserving
            if(zZone) updateFee("WAT_TA_38","WAT_TA","FINAL",zZone,"Y");//Non-water Conserving
        }
        
        //TODO : update the correct fee when configured.
        if(AInfo["Construction Water"] == "Yes") ;
        if(AInfo["Cherry Creek Basin"] == "Yes") ;
    } catch(err){
        showMessage = true;
        comment("Error on custom function script83_TapAppFees. Please contact administrator. Err: " + err);
        logDebug("Error on custom function script83_TapAppFees. Please contact administrator. Err: " + err);
        logDebug("A JavaScript Error occurred: ASA:Water/Water/Tap/Application 83: " + err.message);
        logDebug(err.stack)
    }
    logDebug("script83_TapAppFees ended.");
//  if function is used         };//END ASA:Water/Water/Tap/Application;

}
