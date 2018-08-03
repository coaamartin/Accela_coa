//WTUA:Water/Water/SWMP/Renewal

if (wfTask == "Permit Issued" && wfStatus == "Complete") {
	/*
	Script 84
	JHS 7/31/18
	update the License record with a Status of Active and
	new Expiration date (1 year from the license date.
	 */

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
		vExpDate = convertDate(vLicenseObj.b1ExpDate);
		// Extend license expiration by 1 year
		vNewExpDate = new Date(vExpDate.getFullYear() + 1, vExpDate.getMonth(), vExpDate.getDate());

		// Update license expiration date
		logDebug("Updating Expiration Date to: " + vNewExpDate);
		vLicenseObj.setExpiration(dateAdd(vNewExpDate, 0));
		// Set license record expiration to active
		vLicenseObj.setStatus("Active");
		// set parent record status to Issued
		updateAppStatus("Issued", "Updated by WTUA;Water!Water!SWMP!Renewal.js", vLicenseID);
	}

	//Set renewal to complete, used to prevent more than one renewal record for the same cycle
	renewalCapProject = getRenewalCapByParentCapIDForIncomplete(vLicenseID);
	if (renewalCapProject != null) {
		renewalCapProject.setStatus("Complete");
		aa.cap.updateProject(renewalCapProject);
	}
	
	// send the email
	script84_SendRenewalEmailWhenPermitIssuedComplete();
		
}

script85_UpdateSwmpParent();
