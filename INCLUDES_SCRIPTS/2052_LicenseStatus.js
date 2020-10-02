//************************************************ >>  2052_LicenseStatus.js  << ****************************
// SCRIPTNUMBER: 2052
// SCRIPTFILENAME: 2052_LicenseStatus.js
// PURPOSE: When License record has status set as "About to Expire", change record information to allow the record to be "Renewed".
// DATECREATED: 2020-06-30
// BY: Alex Charlton TruePointSolutions

if (wfTask == 'License Status' && wfStatus == 'About to Expire') {
	 lic = new licenseObject(capIDString);
	 lic.setStatus('About to Expire');
	 }