/*
Script 98
JHS 6/10/2018

update the workflow task "Renewal Intake" with a
status of "Fees Paid" and update the workflow task
"Licensing Issuance" with a status of "Renewed" and
update the License record with a Status of Issued and
new Expiration date (1 year from the
renewal approval date and set to the first day of the
next month.

 */

if (balanceDue == 0) {

	closeTask("Renewal Intake", "Fees Paid", "Updated by PRA;Licenses!Contractor!General!Renewal", "");

	closeTask("License Issuance", "Renewed", "Updated by PRA;Licenses!Contractor!General!Renewal", "");

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
		// Extend license expiration by 1 year, first day of next month.
		vNewExpDate = new Date(vExpDate.getFullYear() + 1, vExpDate.getMonth(), vExpDate.getDate());
		vNewExpDate.setDate(1);
		if (vNewExpDate.getMonth() == 11) {
			vNewExpDate.setMonth(0);
			vNewExpDate.setFullYear(vNewExpDate.getFullYear() + 1);
		} else {
			vNewExpDate.setMonth(vNewExpDate.getMonth() + 1);
		}

		// Update license expiration date
		logDebug("Updating Expiration Date to: " + vNewExpDate);
		vLicenseObj.setExpiration(dateAdd(vNewExpDate, 0));
		// Set license record expiration to active
		vLicenseObj.setStatus("Active");
		// set parent record status to Issued
		updateAppStatus("Issued", "Updated by PRA;Licenses!Contractor!General!Renewal", vLicenseID);

		//Set renewal to complete, used to prevent more than one renewal record for the same cycle
		renewalCapProject = getRenewalCapByParentCapIDForIncomplete(vLicenseID);
		if (renewalCapProject != null) {
			renewalCapProject.setStatus("Complete");
			aa.cap.updateProject(renewalCapProject);
		}

		//var vEmailTemplate = "TBD LICENSE RENEWAL EMAIL";
		// var vEParams = aa.util.newHashtable();
		// addParameter(vEParams, "$$LicenseType$$", "Contractor License");
		// addParameter(vEParams, "$$ExpirationDate$$", dateAdd(vNewExpDate, 0));
		// addParameter(vEParams, "$$ApplicationID$$", vLicenseID.getCustomID());
		// addParameter(vEParams, "$$altID$$", vLicenseID.getCustomID());

		// emailContacts("All", vEmailTemplate, vEParams, null, null);


		//Going to need to run an async as we will have send two emails. One for the Reciept and one for the license report
		//Reciept code
		//var altID = capId.getCustomID();
		appType = cap.getCapType().toString();
		var invoiceNbrObj = getLastInvoice({});
		var invNbr = invoiceNbrObj.getInvNbr();
		var vAsyncScript = "SEND_EMAIL_BLD_ASYNC";
		var envParameters = aa.util.newHashMap();
		envParameters.put("$$LicenseType$$", "Contractor License");
		envParameters.put("$$ExpirationDate$$", dateAdd(vNewExpDate, 0));
		envParameters.put("$$altID$$", vLicenseID.getCustomID());
		envParameters.put("cap", cap);
		envParameters.put("INVOICEID", String(invNbr));
		logDebug("Starting to kick off ASYNC event for Licenses receipt. Params being passed: " + envParameters);
		aa.runAsyncScript(vAsyncScript, envParameters);
		logDebug("---------------------> End of the Receipt code. Starting to send Licnese report to parent record");

		//License Report Code
		var vAsyncScript = "SEND_EMAIL_BLD_OTC";
		var envParameters2 = aa.util.newHashMap();
		envParameters2.put("$$altID$$", vLicenseID.getCustomID());
		envParameters2.put("capId", capId);
		envParameters2.put("cap", cap);
		logDebug("Starting to kick off ASYNC event for License Contractor. Params being passed: " + envParameters);
		aa.runAsyncScript(vAsyncScript, envParameters);
		logDebug("---------------------> PRA;Licenses!Contractor!Generral!Renewal.js ended.");
	}
}
