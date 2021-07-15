/*
Script 98
JHS 6/10/2018

update the workflow task "Renewal Intake" with a
status of "Fees Paid" and update the workflow task
"Licensing Issuance" with a status of "Renewed" and
update the License record with a Status of Issued and
new Expiration date (Which is 3 years from the
renewal approval date and set to the last day of the
month

 */

if (balanceDue == 0) {

	closeTask("Renewal Intake", "Fees Paid", "Updated by PRA;Licenses!Professional!General!Renewal", "");

	closeTask("License Issuance", "Renewed", "Updated by PRA;Licenses!Professional!General!Renewal", "");
	include("5114_EMailReadyLicenseIssue");
	include("5144_Lic_QPL_Lic_Issue");
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
		vExpDate = vLicenseObj.b1ExpDate;
		vExpDate = new Date();
		// Extend license expiration by 3 year, last day of next month.
		vNewExpDate = new Date(vExpDate.getFullYear() + 3, vExpDate.getMonth(), vExpDate.getDate());
		vNewExpDate.setDate(1);
		if (vNewExpDate.getMonth() == 11) {
			vNewExpDate.setMonth(0);
			vNewExpDate.setFullYear(vNewExpDate.getFullYear() + 1);
		}
		else {
			vNewExpDate.setMonth(vNewExpDate.getMonth()+1);
		}		
		vNewExpDate = new Date(vNewExpDate - (24*60*60*1000));
		
		// Update license expiration date
		logDebug("Updating Expiration Date to: " + vNewExpDate);
		vLicenseObj.setExpiration(dateAdd(vNewExpDate, 0));
		// Set license record expiration to active
		vLicenseObj.setStatus("Active");
		// set parent record status to Issued
		updateAppStatus("Issued","Updated by PRA;Licenses!Professional!General!Renewal",vLicenseID);
		

		//Set renewal to complete, used to prevent more than one renewal record for the same cycle
		renewalCapProject = getRenewalCapByParentCapIDForIncomplete(vLicenseID);
		if (renewalCapProject != null) {
			renewalCapProject.setStatus("Complete");
			aa.cap.updateProject(renewalCapProject);
		}

	}
}
