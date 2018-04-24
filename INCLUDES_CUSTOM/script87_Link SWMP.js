//script87_Link SWMP
//Record Types:	Water/Water/SWMP/Transfer
//Event: ASA- ApplicationSubmitAfter
//Desc: Automatically link the SWMP Permit record to the transfer request record 
//		by taking the value entered in the custom field SWMP Permit Number and adding the record as the parent. 

function script87_LinkSWMP() {
	
	logDebug("script87_Link SWMP started.");
	try{
		
		var gp = AInfo['SWMP Permit Number'];
		var gpc = null;
		gpc = aa.cap.getCapID(AInfo['SWMP Permit Number']).getOutput();
	
		if (!publicUser && !partialCap) {
		addParent(gpc.getCustomID());
		}

		
		
	} catch(err){
		showMessage = true;
		comment("Error on custom function script87_Link SWMP. Please contact administrator. Err: " + err);
		logDebug("script87: Error on custom function script87_Link SWMP. Please contact administrator. Err: " + err);
		logDebug("script87: A JavaScript Error occurred: ASA:Water/Water/SWMP/Transfer 133: " + err.message);
		logDebug(err.stack)
	}
	logDebug("script87_Link SWMP ended.");
//	if function is used        };//END ASA:Water/Water/SWMP/Transfer;

}

