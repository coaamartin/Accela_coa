//************************************************ >>  2051_CreateChildLicense.js  << ****************************
// SCRIPTNUMBER: 2051
// SCRIPTFILENAME: 2051_CreateChildLicense.js
// PURPOSE: ​When Application record is approved, and Issue License is selected, create Child Record and copy relevant information.
// DATECREATED: 2020-05-25
// BY: Alex Charlton TruePointSolutions

// create child license
if(matches(currentUserID,"ACHARLTO")){
showDebug =3;
}

try {
	newChildID = null;
	// Replaced
numberOfMonths = 12;
tmpNewDate = dateAddMonths(null, numberOfMonths);

	if (wfStatus == 'Issue License'){
		if (exists(appTypeArray[2],["Common Consumption"])) {
			newChildID = createChildLic(appTypeArray[0], appTypeArray[1], appTypeArray[2], 'License', capName);
			//default to 12 months from today
			comment("Checking on what the renewal date should be set to");
			numberOfMonths = 12;
			tmpNewDate = dateAddMonths(null, numberOfMonths);
			comment("TMP NEW Date Default = "+tmpNewDate);
		}
		if (matches(appTypeArray[2],"Manufactured Home Park","Stable","Amusement Device","After Hours","Escort","Massage Facility","Second Hand Dealer","Sexually Oriented Business","Teen Club")){//(exists(appTypeArray[2],["Door Seller","Manufactured Home Park","Stable","Amusement Device","After Hours","Escort","Massage Facility","Massage Solo Practitioner","Pawnbroker","Second Hand Dealer","Sexually Oriented Business","Teen Club"])) {
			newChildID = createChildLic(appTypeArray[0], appTypeArray[1], appTypeArray[2], 'License', capName);
			//default to 12 months from today
			comment("Checking on what the renewal date should be set to");
			numberOfMonths = 12;
			tmpNewDate = dateAddMonths(null, numberOfMonths);
			logDebug("TMP NEW Date Default = "+tmpNewDate);
		}
		if (matches(appTypeArray[2],"Massage Solo Practitioner")){
			newChildID = createChildLic(appTypeArray[0], appTypeArray[1], appTypeArray[2], 'License', capName);
			//default to 12 months from today
			comment("Checking on what the renewal date should be set to");
			numberOfMonths = 12;
			tmpNewDate = dateAddMonths(null, numberOfMonths);
			logDebug("TMP NEW Date Default = "+tmpNewDate);
		}
		if (matches(appTypeArray[2],"Door Seller","Pawnbroker")){
			newChildID = createChildLic(appTypeArray[0], appTypeArray[1], appTypeArray[2], 'License', capName);
			//default to 12 months from today
			comment("Checking on what the renewal date should be set to");
			numberOfMonths = 12;
			tmpNewDate = dateAddMonths(null, numberOfMonths);
			logDebug("TMP NEW Date Default = "+tmpNewDate);
		}
		if (exists(appTypeArray[2],["Cabaret","Tasting License","Tasting Permit"]))  {
			newChildID = createChildLic(appTypeArray[0], appTypeArray[1], appTypeArray[2], 'License', capName);
			//default to 12 months from today
			comment("Checking on what the renewal date should be set to");
			numberOfMonths = 12;
			tmpNewDate = AInfo['State License Expiration Date'];
			logDebug("Tmp Date from ASI = "+tmpNewDate);
		} 
		if (appMatch('Licenses/Liquor/Liquor License/Application')) {
			newChildID = createChildLic(appTypeArray[0], appTypeArray[1], appTypeArray[2], 'License', capName);
			//default to 12 months from today
			comment("Checking on what the renewal date should be set to");
			numberOfMonths = 12;
			tmpNewDate = AInfo['State License Expiration Date'];
			logDebug("Tmp Date from ASI = "+tmpNewDate);
		}
		if (exists(appTypeArray[2],["Trash Hauler","Amusement Device Distributor"])){
			var licType = AInfo['Type of License'];
			newChildID = createChildLic(appTypeArray[0], appTypeArray[1], appTypeArray[2], 'License', capName);
			//default to 12 months from today
			comment("Checking on what the renewal date should be set to");
			numberOfMonths = 12;
			today = new Date(); comment('Today = ' + today);
			theMonth = today.getMonth(); comment('the month = ' + theMonth);
			theYear = today.getFullYear(); comment('The Year = ' + theYear);
			nextYear = theYear + 1; comment('Next Year = ' + nextYear);
			if (matches(theMonth, '11')) {
				tmpNewDate = '12/31/'+ nextYear;
			} else {
				tmpNewDate = '12/31/'+ theYear;
			}
			logDebug("New Date 12/31 will be: " + tmpNewDate);
		}
		if (exists(appTypeArray[2],["Seasonal Licenses"])){
			var licType = AInfo['Type of License'];
			//default to 12 months from today
			comment("Checking on what the renewal date should be set to");
			if (matches(licType,"Christmas Tree Lot","Carnival/Circus (Amusement Enterprise)")) {
			numberOfMonths = 12;
			today = new Date(); comment('Today = ' + today);
			theMonth = today.getMonth(); comment('the month = ' + theMonth);
			theYear = today.getFullYear(); comment('The Year = ' + theYear);
			nextYear = theYear + 1; comment('Next Year = ' + nextYear);
			tmpNewDate = '12/31/'+ theYear;
			logDebug("New Date 12/31 will be: " + tmpNewDate);
			}
			if (matches(licType,"Fireworks Stand License")) {
			numberOfMonths = 12;
			today = new Date(); comment('Today = ' + today);
			theMonth = today.getMonth(); comment('the month = ' + theMonth);
			theYear = today.getFullYear(); comment('The Year = ' + theYear);
			nextYear = theYear + 1; comment('Next Year = ' + nextYear);
			tmpNewDate = '07/04/'+ theYear;
			logDebug("New Date 07/04 will be: " + tmpNewDate);
			}
		}

	
	if (newChildID){	
		copyAppSpecific(newChildID); comment('Copying ASI - New License id = ' + newChildID);
		copyASITables(capId,newChildID); comment('Copying ASIT - New License id = ' + newChildID);
		updateAppStatus('Active', 'Created from Application', newChildID);
		editAppName(capName, newChildID);
	    theShortNotes = getShortNotes(capId);
	    updateShortNotes(theShortNotes, newChildID);
	}
         
	saveId = capId;
	if (newChildID){
		capId = newChildID;
	}

	// set the expiratipon date
	comment("TMP NEW Date after checks = "+tmpNewDate);

	thisLic = new licenseObject(capIDString,capId) ; thisLic.setStatus("Active");  thisLic.setExpiration(dateAdd(tmpNewDate,0));
	capId = saveId;

	if (newChildID){
		newChildIdString = newChildID.getCustomID();
		logDebug("new child ID string = "+newChildIdString);
		editIdString = capIDString.substr(0,10)+'L'; 
		var s_result = aa.cap.updateCapAltID(newChildID,editIdString);
		if (!s_result.getSuccess()){
			logDebug("Error updating CAP ID" +s_result.getErrorMessage())
		}
		logDebug("New CAP ID is going to be " +editIdString);
		logDebug("Starting SEND_ISSUEDLICENSE_EMAIL script");
		appType = cap.getCapType().toString();
		var vAsyncScript = "SEND_EMAIL_TAXLIC_LICENSE_ASYNC";
		var envParameters = aa.util.newHashMap();
		envParameters.put("altID", editIdString);
		logDebug("ALTID is " +editIdString);
		envParameters.put("capId", newChildID);
		logDebug("CAP ID is " +newChildID);
		envParameters.put("cap", cap);
		logDebug("Starting to kick off ASYNC event for Invoice. Params being passed: " + envParameters);
		//aa.runAsyncScript(vAsyncScript, envParameters);
		aa.env.setValue("capId",newChildID);
		aa.env.setValue("cap",cap);
		aa.env.setValue("altID",editIdString);
		aa.runScript(vAsyncScript);
	}
}
} catch (err) {
	logDebug("A JavaScript Error occured: " + err.message + " In Line " + err.lineNumber);
	logDebug("Stack: " + err.stack);
}

