// Renewal script
if (balanceDue == 0) {

	closeTask("License Issuance", "Renewed", "Updated by PRA;Licenses!Professional!General!Renewal", "");

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
		//Activate the license records expiration cycle
		vLicenseObj = new licenseObject(null, vLicenseID);
		vLicenseObj.setStatus("Active");
		thisLicExpOb = vLicenseObj.b1Exp
		expUnit = thisLicExpOb.getExpUnit()
		expInt = thisLicExpOb.getExpInterval()
		if (expUnit == "MONTHS") {
			newExpDate = dateAddMonths(null, expInt);
			} 
		vLicenseObj.setExpiration(newExpDate);
		updateAppStatus("Issued","Updated by Script",vLicenseID);
		
		//Set renewal to complete, used to prevent more than one renewal record for the same cycle
		renewalCapProject = getRenewalCapByParentCapIDForIncomplete(vLicenseID);
		if (renewalCapProject != null) {
			renewalCapProject.setStatus("Complete");
			aa.cap.updateProject(renewalCapProject);
		}

	}
}
