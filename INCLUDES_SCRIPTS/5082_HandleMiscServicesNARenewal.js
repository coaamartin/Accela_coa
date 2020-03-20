// SCRIPTNUMBER: 5082
// SCRIPTFILENAME: 5082_HandleMiscServicesNARenewal.js
// PURPOSE: Called when NA Renewal record has review task updated.  The master record then gets updated.
// DATECREATED: 02/08/2019
// BY: amartin
// CHANGELOG: 4/29/2019,coa,ajm,added update of parent date last updated custom field,
// CHANGELOG: 3/5/2020, COA,RLP,moved it to Associations from MISCSERVICES

logDebug("At start of 5082 outside if");	 
if (wfTask == "Review Application" && wfStatus == "Complete") {
logDebug("5082 inside if");	 

	var vLicenseID;
	var vIDArray;
	var renewalCapProject;
	var vExpDate;
	var vNewExpDate;
	var vLicenseObj;

	var currentDate = sysDateMMDDYYYY;
	
	// Get the parent license
	vLicenseID = getParentLicenseCapID(capId);
	vIDArray = String(vLicenseID).split("-");
	vLicenseID = aa.cap.getCapID(vIDArray[0], vIDArray[1], vIDArray[2]).getOutput();

	if (vLicenseID != null) {
		// Get current expiration date.
		vLicenseObj = new licenseObject(null, vLicenseID);
		vExpDate = convertDate(vLicenseObj.b1ExpDate);
		// Extend expiration by 1 year
		vNewExpDate = new Date(vExpDate.getFullYear() + 1, vExpDate.getMonth(), vExpDate.getDate());

		// Update expiration date
		logDebug("Updating Expiration Date to: " + vNewExpDate);
		vLicenseObj.setExpiration(dateAdd(vNewExpDate, 0));
		// Set record expiration to active
		vLicenseObj.setStatus("Active");
		// set parent record status to Active
		updateAppStatus("Active", "Updated by 5082_HandleMiscServicesNARenewal.js", vLicenseID);
	}
	//Set renewal to Renewed status.
	updateAppStatus("Renewed", "Updated by 5082_HandleMiscServicesNARenewal.js", capId);
	//Set info field Date Last Updated so reports can use it.
	editAppSpecific("Date Last Updated", currentDate, capId);
	
	//Set renewal to complete, used to prevent more than one renewal record for the same cycle
	//renewalCapProject = getRenewalCapByParentCapIDForIncomplete(vLicenseID);
	//if (renewalCapProject != null) {
	//	renewalCapProject.setStatus("Renewed");
	//	aa.cap.updateProject(renewalCapProject);
	//}
	
	// send the email
	//script84_SendRenewalEmailWhenPermitIssuedComplete();
	UpdateMiscNARParent();	

	var envParameters = aa.util.newHashMap();
	envParameters.put("capId", capId);
	envParameters.put("cap", cap);
	envParameters.put("AGENCYID", "AURORACO");
	var vAsyncScript = "SEND_HOA_RENEW_EMAIL";
	aa.runAsyncScript(vAsyncScript, envParameters)
	logDebug("CapID info: " + envParameters);
	logDebug("End of email renewal in 5082_HandleMiscServicesNARenewal");
}

function UpdateMiscNARParent() {
	logDebug("5082_HandleMiscServicesNARenewal.js started.");
	try{
		//if (ifTracer(wfTask == "Permit Issued" && wfStatus == "Complete", 'wfTask == Permit Issued && wfStatus == Complete')) 
		//{
            //get parent
            var childCapScriptModel,
                parentCapScriptModel,
                parentCapTypeString,
                parentCapId = getParentLicenseCapID(capId);

            if(ifTracer(parentCapId, 'parent found')) {
 
                childCapScriptModel = aa.cap.getCap(capId).getOutput();
                parentCapScriptModel = aa.cap.getCap(parentCapId).getOutput();
                parentCapTypeString = parentCapScriptModel.getCapType().toString();
                if(ifTracer(parentCapTypeString == 'Associations/Neighborhood/Association/Master', 'parent = Associations/Neighborhood/Association/Master')) {
                    // copy data from renewal to parent application
					// First, remove existing contacts to prevent doubling them up.
					logDebug("***** Removing Master record contacts *****");
					removeContactsFromCapByType(parentCapId, "President");
					removeContactsFromCapByType(parentCapId, "Board Member");
					removeContactsFromCapByType(parentCapId, "Referral Contact");
					removeContactsFromCapByType(parentCapId, "Property Manager");
					//Now proceed with the update
                    copyContacts(capId,parentCapId);
                    copyAppSpecific(parentCapId);
                    copyASIFields(capId,parentCapId);
                    copyASITables(capId,parentCapId);
                    copyAddresses(capId, parentCapId);
                    copyParcels(capId, parentCapId);
                    editAppName(childCapScriptModel.specialText, parentCapId);
					//closeTask("Review Application", "Complete", "Closed by Script 5082");
                }
            }
 		//}
	}
	catch(err){
		showMessage = true;
		comment("Error on custom function “5082_HandleMiscServicesNARenewal.js. Please contact administrator. Err: " + err);
		logDebug("Error on custom function “5082_HandleMiscServicesNARenewal.js. Please contact administrator. Err: " + err);
	}
}
	logDebug("5082_HandleMiscServicesNARenewal.js ended.");
