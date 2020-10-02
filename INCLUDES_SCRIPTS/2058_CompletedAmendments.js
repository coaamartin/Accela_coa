//************************************************ >>  2052_LicenseStatus.js  << ****************************
// SCRIPTNUMBER: 2058
// SCRIPTFILENAME: 2058_completedamendments.js
// PURPOSE: When Amendment record has status set as "Issue License", close record and copy all record details to the parent License record.
// DATECREATED: 2020-08-01
// BY: Alex Charlton TruePointSolutions

if (wfStatus == "Issue License" && parentCapId != null) {
	copyRecordInfo(capId, parentCapId, "CONTACTS;ASI;ASIT;RECORDDETAILS;ADDRESS;PARCEL;OWNER");
}