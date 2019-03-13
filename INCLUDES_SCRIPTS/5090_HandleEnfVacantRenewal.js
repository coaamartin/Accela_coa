// SCRIPTNUMBER: 5090
// SCRIPTFILENAME: 5090_HandleEnfVacantRenewal.js
// PURPOSE: Called when Enforcement Vacant Property Renewal record has review task updated.  The master record then gets updated.
// DATECREATED: 02/27/2019
// BY: amartin
// CHANGELOG: 

logDebug("At start of 5090");	 
if (wfTask == "Review Application" && wfStatus == "Complete") {
logDebug("5090 Review Application - Complete");	 

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
		// Extend expiration by 1 year
		vNewExpDate = new Date(vExpDate.getFullYear() + 1, vExpDate.getMonth(), vExpDate.getDate());

		// Update expiration date
		logDebug("Updating Expiration Date to: " + vNewExpDate);
		vLicenseObj.setExpiration(dateAdd(vNewExpDate, 0));
		// Set record expiration to active
		vLicenseObj.setStatus("Active");
		// set parent record status to Active
		updateAppStatus("Active", "Updated by 5090_HandleEnfVacantRenewal.js", vLicenseID);
	}
	//Set renewal to Renewed status.
	updateAppStatus("Renewed", "Updated by 5090_HandleEnfVacantRenewal.js", capId);
	
	//Set renewal to complete, used to prevent more than one renewal record for the same cycle
	//renewalCapProject = getRenewalCapByParentCapIDForIncomplete(vLicenseID);
	//if (renewalCapProject != null) {
	//	renewalCapProject.setStatus("Renewed");
	//	aa.cap.updateProject(renewalCapProject);
	//}
	
	// send the email
	//script84_SendRenewalEmailWhenPermitIssuedComplete();
	UpdateEnfVacParent();	
}

function UpdateEnfVacParent() {
	logDebug("5090_HandleEnfVacantRenewal.js started.");
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
                if(ifTracer(parentCapTypeString == 'Enforcement/Incident/Vacant/Master', 'parent = Enforcement/Incident/Vacant/Master')) {
                    // copy data from renewal to parent application
					// First, remove existing contacts to prevent doubling them up.
					logDebug("***** Removing Master record contacts *****");
					removeContactsFromCapByType(parentCapId, "Property Manager");
					removeContactsFromCapByType(parentCapId, "Contact");
					//removeContactsFromCapByType(parentCapId, "Referral Contact");
					//removeContactsFromCapByType(parentCapId, "Property Manager");
					//Now proceed with the update
                    copyContacts(capId,parentCapId);
                    copyAppSpecific(parentCapId);
                    copyASIFields(capId,parentCapId);
                    copyASITables(capId,parentCapId);
                    copyAddresses(capId, parentCapId);
                    copyParcels(capId, parentCapId);
                    editAppName(childCapScriptModel.specialText, parentCapId);
					//closeTask("Review Application", "Complete", "Closed by Script 5090");
					if (ifTracer(AInfo["Unregister"] == "Yes"))
						{
							logDebug("Within code block to check date");
							closeAllTasks(parentCapId, "Script 5086");
							updateAppStatus(parentCapId,"Closed", "Script 5086");	
							cancelInspections(parentCapId);
						}
                }
            }
 		//}
	}
	catch(err){
		showMessage = true;
		comment("Error on custom function 5090_HandleEnfVacantRenewal.js. Please contact administrator. Err: " + err);
		logDebug("Error on custom function 5090_HandleEnfVacantRenewal.js. Please contact administrator. Err: " + err);
	}
}
	logDebug("5090_HandleEnfVacantRenewal.js ended.");
