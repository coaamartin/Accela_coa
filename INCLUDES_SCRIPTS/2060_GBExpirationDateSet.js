//************************************************ >>  2060_GBExpirationDateSet.js  << ****************************
// SCRIPTNUMBER: 2060
// SCRIPTFILENAME: 2060_GBExpirationDateSet.js
// PURPOSE: ​When General Business record is approved, and Issue License is selected, Set expiration date until gentax import is complete.
// DATECREATED: 2020-07-25
// BY: Alex Charlton TruePointSolutions

// create child license
numberOfMonths = 24;
tmpNewDate = dateAddMonths(null, numberOfMonths);

	if (wfStatus == 'Issue License'){
		lic = new licenseObject(capIDString);
		thisLic.setStatus("Active");  thisLic.setExpiration(dateAdd(tmpNewDate,0));
	}