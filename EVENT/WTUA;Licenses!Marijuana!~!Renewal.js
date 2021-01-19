
// Code moved from PRA:Licenses/Marijuana/*/Renewal
if (balanceDue == 0 && wfTask == "Renewal Review" && wfStatus == "Complete") {
	
	closeTask("License Issuance", "Renewed - Pending Notification", "Updated by WTUA;Licenses!Professional!General!Renewal", "");
	updateAppStatus("Renewed - Pending Notification","Updated by Script",capId);
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
		var licExpObj = aa.expiration.getLicensesByCapID(vLicenseID).getOutput().getExpDate();
        var licExpDate = dateFormatted(licExpObj.getMonth(),licExpObj.getDayOfMonth(),licExpObj.getYear(),"");
		//Activate the license records expiration cycle
		vLicenseObj = new licenseObject(null, vLicenseID);
		vLicenseObj.setStatus("Active");
		thisLicExpOb = vLicenseObj.b1Exp
		expUnit = thisLicExpOb.getExpUnit()
		expInt = thisLicExpOb.getExpInterval()
		if (expUnit == "MONTHS") {
			newExpDate = dateAddMonths(licExpDate, expInt);
			} 
		vLicenseObj.setExpiration(newExpDate);
		updateAppStatus("Active","Updated by Script",vLicenseID);
		
		//Set renewal to complete, used to prevent more than one renewal record for the same cycle
		renewalCapProject = getRenewalCapByParentCapIDForIncomplete(vLicenseID);
		if (renewalCapProject != null) {
			renewalCapProject.setStatus("Complete");
			aa.cap.updateProject(renewalCapProject);
		}

		/*
		//This logic is in BATCH JOB
        var vAsyncScript = "SEND_MJ_LICENSE_ASYNC";
        var envParameters = aa.util.newHashMap();
        envParameters.put("CapId", vLicenseID.getCustomID());
        aa.runAsyncScript(vAsyncScript, envParameters);
		*/
	}
}



//SW Script 436
include("436_cancelScheduledInpsectionsRenew");
//SW Script 432
include("432_deactivateMJTasks");

include("432_closeLicenseMJ");

if (wfTask=="Renewal Review" && wfStatus=="Additional Info Required")
{
    include("210_SendMJEmail");
}