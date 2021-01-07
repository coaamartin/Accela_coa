//************************************************ >>  2062_LicenseStatus.js  << ****************************
// SCRIPTNUMBER: 2062
// SCRIPTFILENAME: 2062_LicenseStatus.js
// PURPOSE: When Liquor License record workflow is processed and a status of Temp License Issued. Set Expiration Date. If Temp License Issued Extended, then set extended date.
// DATECREATED: 2021-01-05
// BY: Alex Charlton TruePointSolutions

if (wfStatus == 'Temp License Issued') {
	permit = AInfo['Temporary Permit Issue Date'];
	editAppSpecific("Temporary Permit Expiration Date", dateAdd(permit, 120))
}

if (wfStatus == 'Temp Permit Extended') {
	permit = AInfo['Temporary Permit Issue Date'];
	editAppSpecific("Temporary Permit Expiration Date", dateAdd(permit, 180))
}