//script83_TapAppFees
//Record Types:	Water/Water/Tap/Application
//Event: ASA- ApplicationSubmitAfter, ASIUA- AppSpecificInfoUpdateAfter
//Desc: Add fees with ASI is updated.
//Created By: Silver Lining Solutions
//Updated 07/27/2018 (evontrapp@etechconsultingllc.com) - Added logic to check for pre/post 2017 fee schedule

function script83_TapAppFees() {
	logDebug("script83_TapAppFees started.");
	
	//use WAT_TA fee schedule if platted after 2017
	if (AInfo["Platted after 2017"] == "Yes") {	
		try{
			if (AInfo["Type"] == "Single Family Detached" && (AInfo["Water Closets"] >= "1" && AInfo["Water Closets"] <= "2")) {
				updateFee("WAT_TA_01","WAT_TA","FINAL",1,"Y");
			}
			if (AInfo["Type"] == "Single Family Detached" && (AInfo["Water Closets"] >= "3" && AInfo["Water Closets"] <= "4")) {
				updateFee("WAT_TA_02","WAT_TA","FINAL",1,"Y");
			}
			if (AInfo["Type"] == "Single Family Detached" && AInfo["Water Closets"] >= "5" ) {
				updateFee("WAT_TA_03","WAT_TA","FINAL",1,"Y");
			}
			if (AInfo["Type"] == "Single Family Detached") {
				updateFee("WAT_TA_04","WAT_TA","FINAL",AInfo["Total Lot Size"],"Y");
			}
			if (AInfo["Type"] == "Single Family Attached") {
				updateFee("WAT_TA_09","WAT_TA","FINAL",1,"Y");
				updateFee("WAT_TA_10","WAT_TA","FINAL",AInfo["Total Lot Size"],"Y");
				updateFee("WAT_TA_13","WAT_TA","FINAL",1,"Y");
			}
			if (AInfo["Type"] == "Multi Family") {
				updateFee("WAT_TA_16","WAT_TA","FINAL",AInfo["Number of Residential Units"],"Y");
			}
			if (AInfo["Type"] == "Commercial" && AInfo["Size of Water Meter"] == '3/4"' ) {
				updateFee("WAT_TA_22","WAT_TA","FINAL",1,"Y");
			}
			if (AInfo["Type"] == "Commercial" && AInfo["Size of Water Meter"] == '1"' ) {
				updateFee("WAT_TA_23","WAT_TA","FINAL",1,"Y");
			}
			if (AInfo["Type"] == "Commercial" && AInfo["Size of Water Meter"] == '1 1/2"' ) {
				updateFee("WAT_TA_24","WAT_TA","FINAL",1,"Y");
			}
			if (AInfo["Type"] == "Commercial" && AInfo["Size of Water Meter"] == '2"' ) {
				updateFee("WAT_TA_25","WAT_TA","FINAL",1,"Y");
			}
			if (AInfo["Type"] == "Commercial" && (AInfo["Size of Water Meter"] == '2 1/2"' || AInfo["Size of Water Meter"] == '3"' || AInfo["Size of Water Meter"] == '4"' || AInfo["Size of Water Meter"] =='5"' || AInfo["Size of Water Meter"] =='6"' || AInfo["Size of Water Meter"] =='7"' || AInfo["Size of Water Meter"] =='8"' || AInfo["Size of Water Meter"] =='9"' || AInfo["Size of Water Meter"] =='10"' || AInfo["Size of Water Meter"] =='11"' || AInfo["Size of Water Meter"] =='12"') ) {
				updateFee("WAT_TA_39","WAT_TA","FINAL",1,"Y");
			}
		} catch(err){
			showMessage = true;
			comment("Error on custom function script83_TapAppFees. Please contact administrator. Err: " + err);
			logDebug("Error on custom function script83_TapAppFees. Please contact administrator. Err: " + err);
			logDebug("A JavaScript Error occurred: ASA:Water/Water/Tap/Application 83: " + err.message);
			logDebug(err.stack)
		}
	} else if (AInfo["Platted after 2017"] == "No"){ //use WAT_TA2 fee schedule if platted before 2017
		try{
			if (AInfo["Type"] == "Single Family Detached" && (AInfo["Water Closets"] >= "1" && AInfo["Water Closets"] <= "2")) {
				updateFee("WAT_TA2_01","WAT_TA2","FINAL",1,"Y");
			}
			if (AInfo["Type"] == "Single Family Detached" && (AInfo["Water Closets"] >= "3" && AInfo["Water Closets"] <= "4")) {
				updateFee("WAT_TA2_02","WAT_TA2","FINAL",1,"Y");
			}
			if (AInfo["Type"] == "Single Family Detached" && AInfo["Water Closets"] >= "5" ) {
				updateFee("WAT_TA2_03","WAT_TA2","FINAL",1,"Y");
			}
			if (AInfo["Type"] == "Single Family Detached") {
				updateFee("WAT_TA2_04","WAT_TA2","FINAL",AInfo["Total Lot Size"],"Y");
			}
			if (AInfo["Type"] == "Single Family Attached") {
				updateFee("WAT_TA2_09","WAT_TA2","FINAL",1,"Y");
				updateFee("WAT_TA2_10","WAT_TA2","FINAL",AInfo["Total Lot Size"],"Y");
				updateFee("WAT_TA2_13","WAT_TA2","FINAL",1,"Y");
			}
			if (AInfo["Type"] == "Multi Family") {
				updateFee("WAT_TA2_16","WAT_TA2","FINAL",AInfo["Number of Residential Units"],"Y");
			}
			if (AInfo["Type"] == "Commercial" && AInfo["Size of Water Meter"] == '3/4"' ) {
				updateFee("WAT_TA2_22","WAT_TA2","FINAL",1,"Y");
			}
			if (AInfo["Type"] == "Commercial" && AInfo["Size of Water Meter"] == '1"' ) {
				updateFee("WAT_TA2_23","WAT_TA2","FINAL",1,"Y");
			}
			if (AInfo["Type"] == "Commercial" && AInfo["Size of Water Meter"] == '1 1/2"' ) {
				updateFee("WAT_TA2_24","WAT_TA2","FINAL",1,"Y");
			}
			if (AInfo["Type"] == "Commercial" && AInfo["Size of Water Meter"] == '2"' ) {
				updateFee("WAT_TA2_25","WAT_TA2","FINAL",1,"Y");
			}
			if (AInfo["Type"] == "Commercial" && (AInfo["Size of Water Meter"] == '2 1/2"' || AInfo["Size of Water Meter"] == '3"' || AInfo["Size of Water Meter"] == '4"' || AInfo["Size of Water Meter"] =='5"' || AInfo["Size of Water Meter"] =='6"' || AInfo["Size of Water Meter"] =='7"' || AInfo["Size of Water Meter"] =='8"' || AInfo["Size of Water Meter"] =='9"' || AInfo["Size of Water Meter"] =='10"' || AInfo["Size of Water Meter"] =='11"' || AInfo["Size of Water Meter"] =='12"') ) {
				updateFee("WAT_TA2_39","WAT_TA2","FINAL",1,"Y");
			}
		} catch(err){
			showMessage = true;
			comment("Error on custom function script83_TapAppFees. Please contact administrator. Err: " + err);
			logDebug("Error on custom function script83_TapAppFees. Please contact administrator. Err: " + err);
			logDebug("A JavaScript Error occurred: ASA:Water/Water/Tap/Application 83: " + err.message);
			logDebug(err.stack)
		}
	} else {
		logDebug("Missing AInfo: Platted after 2017");
	}
	
	logDebug("script83_TapAppFees ended.");
//	if function is used        	};//END ASA:Water/Water/Tap/Application;

}