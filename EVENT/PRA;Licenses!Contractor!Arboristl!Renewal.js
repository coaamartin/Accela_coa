/*
Script xx
JHS 8/12/2018

update the workflow task "Renewal Intake" with a
status of "Fees Paid" and update the workflow task
"Licensing Issuance" with a status of "Renewed" and
update the License record with a Status of Issued and
new Expiration date (12/31 of current year)

 */

if (balanceDue == 0) {

	closeTask("Renewal Intake", "Fees Paid", "Updated by PRA;Licenses!Arborist!General!Renewal", "");

	closeTask("License Issuance", "Renewed", "Updated by PRA;Licenses!Arborist!General!Renewal", "");

	// Begin script to complete the renewal and send notifications
	var vLicenseID;
	var vIDArray;
	var renewalCapProject;
	var vExpDate;
	var vNewExpDate;
	var vLicenseObj;

	// Get the parent license
	vLicenseID = getParentLicenseCapID(capId);
	vIDArray = String(vLicenseID).split("-");
	vLicenseID = aa.cap.getCapID(vIDArray[0], vIDArray[1], vIDArray[2]).getOutput();

	if (vLicenseID != null) {
		// Get current expiration date.
		vLicenseObj = new licenseObject(null, vLicenseID);
		vExpDate = new Date();
		// All licenses expire on 12/31, if after march assume next year
		vNewExpDate = new Date(vExpDate.getFullYear() + (vExpDate.getMonth > 2 ? 1 : 0), 11, 31);

		// Update license expiration date
		logDebug("Updating Expiration Date to: " + vNewExpDate);
		vLicenseObj.setExpiration(dateAdd(vNewExpDate, 0));
		// Set license record expiration to active
		vLicenseObj.setStatus("Active");
		// set parent record status to Issued
		updateAppStatus("Issued", "Updated by PRA;Licenses!Contractor!Arborist!Renewal", vLicenseID);

		//Set renewal to complete, used to prevent more than one renewal record for the same cycle
		renewalCapProject = getRenewalCapByParentCapIDForIncomplete(vLicenseID);
		if (renewalCapProject != null) {
			renewalCapProject.setStatus("Complete");
			aa.cap.updateProject(renewalCapProject);
		}

		var vEmailTemplate = "FT ARBORIST LICENSE ISSUANCE #146";
		var vEParams = aa.util.newHashtable();
		addParameter(vEParams, "$$LicenseType$$", "Arborist Contractor License");
		addParameter(vEParams, "$$ExpirationDate$$", dateAdd(vNewExpDate, 0));
		addParameter(vEParams, "$$ApplicationID$$", vLicenseID.getCustomID());
		addParameter(vEParams, "$$altID$$", vLicenseID.getCustomID());

		emailContacts("All", vEmailTemplate, vEParams, null, null);

	}
}
