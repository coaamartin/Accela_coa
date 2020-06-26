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
	if (wfStatus == 'Issue License'){
		if (exists(appTypeArray[2],["General"],["Class 2"],["Common Consumption"])) {
			newChildID = createChildLic(appTypeArray[0], appTypeArray[1], appTypeArray[2], 'License', capName);
			//default to 12 months from today
			comment("Checking on what the renewal date should be set to");
			numberOfMonths = 12;
			tmpNewDate = dateAddMonths(null, numberOfMonths);
			comment("TMP NEW Date Default = "+tmpNewDate);
		} else if (exists(appTypeArray[2],["Cabaret"],["Liquor License"], ["Tasting License"], ["Tasting Permit"]))  {
			newChildID = createChildLic(appTypeArray[0], appTypeArray[1], appTypeArray[2], 'License', capName);
			//default to 12 months from today
			comment("Checking on what the renewal date should be set to");
			numberOfMonths = 12;
			tmpNewDate = AInfo['State License Expiration Date'];	
		} else if (exists(appTypeArray[2],["Class 1"])){
			var licType = AInfo['Type of License'];
			newChildID = createChildLic(appTypeArray[0], appTypeArray[1], appTypeArray[2], 'License', capName);
			//default to 12 months from today
			comment("Checking on what the renewal date should be set to");
			if (matches(licType,"Trash Haulers License","Amusement Device Distributor")) {
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
			if (matches(licType,"Door Sellers License","Manufactured Home Park License","Stable License")) {
			numberOfMonths = 12;
			tmpNewDate = dateAddMonths(null, numberOfMonths);
			}
		} else if (exists(appTypeArray[2],["Temporary Permit"])){
			var licType = AInfo['Type of License'];
			//default to 12 months from today
			comment("Checking on what the renewal date should be set to");
			if (matches(licType,"Christmas Tree Lot")) {
			numberOfMonths = 12;
			today = new Date(); comment('Today = ' + today);
			theMonth = today.getMonth(); comment('the month = ' + theMonth);
			theYear = today.getFullYear(); comment('The Year = ' + theYear);
			nextYear = theYear + 1; comment('Next Year = ' + nextYear);
			tmpNewDate = '12/31/'+ theYear;
			logDebug("New Date 12/31 will be: " + tmpNewDate);
			}
			if (matches(licType,"Fireworks Stand License","Carnival/Circus (Amusement Enterprise)")) {
			numberOfMonths = 12;
			today = new Date(); comment('Today = ' + today);
			theMonth = today.getMonth(); comment('the month = ' + theMonth);
			theYear = today.getFullYear(); comment('The Year = ' + theYear);
			nextYear = theYear + 1; comment('Next Year = ' + nextYear);
			tmpNewDate = '12/31/'+ theYear;
			logDebug("New Date 12/31 will be: " + tmpNewDate);
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
//	editAppSpecific("Defunct Date", dateAdd(tmpNewDate, defunctDays));
	capId = saveId;

	if (newChildID){
		newChildIdString = newChildID.getCustomID();
		editIdString = capIDString.substr(0,10)+'L'; 
		aa.cap.updateCapAltID(newChildID,editIdString); 
	}
}
} catch (err) {
	logDebug("A JavaScript Error occured: " + err.message + " In Line " + err.lineNumber);
}