//************************************************ >>  2059_TmpPermitExpirationDate.js  << ****************************
// SCRIPTNUMBER: 2059
// SCRIPTFILENAME: 2059_TmpPermitExpirationDate.js
// PURPOSE: When the Seasonal License is submitted, set its initial expiration date.
// DATECREATED: 2020-11-20
// BY: Alex Charlton TruePointSolutions

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
thisLic = new licenseObject(capIDString,capId); thisLic.setStatus("Active"); thisLic.setExpiration(tmpNewDate);	
logDebug("New expiration date for " +capID "will be set to " +tmpNewDate);