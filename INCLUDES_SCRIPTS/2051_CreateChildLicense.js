//************************************************ >>  2051_CreateChildLicense.js  << ****************************
// SCRIPTNUMBER: 2051
// SCRIPTFILENAME: 2051_CreateChildLicense.js
// PURPOSE: ​When Application record is approved, and Issue License is selected, create Child Record and copy relevant information.
// DATECREATED: 2020-05-25
// BY: Alex Charlton TruePointSolutions

// create child license
if(matches(currentUserID,"ACHARLTON")){
showDebug =3;
}

try {
	newChildID = null;
	// Replaced
	if (wfStatus == 'Issue License'){
		if (exists(appTypeArray[2],["General"])) {
			newChildID = createChildLic(appTypeArray[0], appTypeArray[1], appTypeArray[2], 'License', capName);
			//default to 12 months from today
			comment("Checking on what the renewal date should be set to");
			numberOfMonths = 12;
			tmpNewDate = dateAddMonths(null, numberOfMonths);
			comment("TMP NEW Date Default = "+tmpNewDate);
		} else if (appMatch('*/Liquor/Liquor License/Application')) {
			newChildID = createChildLic(appTypeArray[0], appTypeArray[1], appTypeArray[2], 'License', capName);
			//default to 12 months from today
			comment("Checking on what the renewal date should be set to");
			numberOfMonths = 12;
			tmpNewDate = dateAddMonths(null, numberOfMonths);
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
//	editAppSpecific("Defunct Date", dateAdd(tmpNewDate, defunctDays));
	capId = saveId;

	if (newChildID){
		newChildIdString = newChildID.getCustomID();
		editIdString = capIDString.substr(0,9)+'L'; 
		aa.cap.updateCapAltID(newChildID,editIdString); 
	}
}
} catch (err) {
	logDebug("A JavaScript Error occured: " + err.message + " In Line " + err.lineNumber);
}