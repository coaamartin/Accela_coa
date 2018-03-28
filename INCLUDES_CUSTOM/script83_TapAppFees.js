//script83_TapAppFees
//Record Types:	Water/Water/Tap/Application
//Event: ASA- ApplicationSubmitAfter, ASIUA- AppSpecificInfoUpdateAfter
//Desc: Add fees with ASI is updated.
//Created By: Silver Lining Solutions

function script83_TapAppFees() {
	
	logDebug("script83_TapAppFees started.");
	try{
		if (AInfo["Type"] == "Single Family Detached" && (AInfo["Water Closets"] >= "1" && AInfo["Water Closets"] <= "2")) {
			updateFee("WAT_TA_01","WAT_TA","FINAL",null,"Y");
		}
		if (AInfo["Type"] == "Single Family Detached" && (AInfo["Water Closets"] >= "3" && AInfo["Water Closets"] <= "4")) {
			updateFee("WAT_TA_02","WAT_TA","FINAL",null,"Y");
		}
		if (AInfo["Type"] == "Single Family Detached" && AInfo["Water Closets"] >= "5" ) {
			updateFee("WAT_TA_03","WAT_TA","FINAL",null,"Y");
		}
		if (AInfo["Type"] == "Single Family Detached") {
			updateFee("WAT_TA_04","WAT_TA","FINAL",null,"Y");
		}
		if (AInfo["Type"] == "Single Family Attached") {
			updateFee("WAT_TA_09","WAT_TA","FINAL",null,"Y");
			updateFee("WAT_TA_10","WAT_TA","FINAL",null,"Y");
			updateFee("WAT_TA_13","WAT_TA","FINAL",null,"Y");
		}
		if (AInfo["Type"] == "Multi Family") {
			updateFee("WAT_TA_16","WAT_TA","FINAL",null,"Y");
		}
		if (AInfo["Type"] == "Commercial" && AInfo["Size of Water Meter"] == "3/4" ) {
			updateFee("WAT_TA_22","WAT_TA","FINAL",null,"Y");
		}
		if (AInfo["Type"] == "Commercial" && AInfo["Size of Water Meter"] == "1" ) {
			updateFee("WAT_TA_23","WAT_TA","FINAL",null,"Y");
		}
		if (AInfo["Type"] == "Commercial" && AInfo["Size of Water Meter"] == "1 1/2" ) {
			updateFee("WAT_TA_24","WAT_TA","FINAL",null,"Y");
		}
		if (AInfo["Type"] == "Commercial" && AInfo["Size of Water Meter"] == "2" ) {
			updateFee("WAT_TA_25","WAT_TA","FINAL",null,"Y");
		}
		if (AInfo["Type"] == "Commercial" && AInfo["Size of Water Meter"] > "2" ) {
			updateFee("WAT_TA_39","WAT_TA","FINAL",null,"Y");
		}
	} catch(err){
		showMessage = true;
		comment("Error on custom function script83_TapAppFees. Please contact administrator. Err: " + err);
		logDebug("Error on custom function script83_TapAppFees. Please contact administrator. Err: " + err);
		logDebug("A JavaScript Error occurred: ASA:Water/Water/Tap/Application 83: " + err.message);
		logDebug(err.stack)
	}
	logDebug("script83_TapAppFees ended.");
//	if function is used        	};//END ASA:Water/Water/Tap/Application;

}
