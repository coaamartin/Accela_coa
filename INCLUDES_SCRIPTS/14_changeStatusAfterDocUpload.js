// SCRIPTNUMBER: 14
// SCRIPTFILENAME: 14_changeStatusAfterDocUpload.js
// PURPOSE: When either the MJ Application (Licenses/Marijuana/*/Application) or
// MJ Renewal (Licenses/Marijuana/*/Renewal) is in the record status "Waiting on Documents" 
// then update the record status to "Pending" when documents are uploaded to the record via AA or ACA
// DATECREATED: 05/18/2019
// BY: SWAKIL
// CHANGELOG: 05/18/2019 , SWAKIL Created this file.

if (capStatus.equals("Waiting on Documents")) {
	updateAppStatus("Pending", "Updated by DUA", capId);
}