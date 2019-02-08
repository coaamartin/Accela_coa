// SCRIPTNUMBER: 5082
// SCRIPTFILENAME: 5082_HandleMiscServicesNARenewal.js
// PURPOSE: Called when master NA record is renewed on ACA
// DATECREATED: 02/08/2019
// BY: amartin
// CHANGELOG: 

logDebug("At start of 5082 outside if");	 
if (wfTask == "Review Application" && wfStatus == "Complete") {
logDebug("5082 inside if");	 

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
	//script84_SendRenewalEmailWhenPermitIssuedComplete();
	UpdateMiscNARParent();	
}

function UpdateMiscNARParent() {
	logDebug("WTUA;MiscServices!Neighborhood!Association!Renewal.js started.");
	try{
		//if (ifTracer(wfTask == "Permit Issued" && wfStatus == "Complete", 'wfTask == Permit Issued && wfStatus == Complete')) 
		//{
            //get parent
            var childCapScriptModel,
                parentCapScriptModel,
                parentCapTypeString,
                parentCapId = getParentLicenseCapID(capId);

            if(ifTracer(parentCapId, 'parent found')) {
                //make sure parent is a permit (Water/Water/SWMP/Permit)
                childCapScriptModel = aa.cap.getCap(capId).getOutput();
                parentCapScriptModel = aa.cap.getCap(parentCapId).getOutput();
                parentCapTypeString = parentCapScriptModel.getCapType().toString();
                if(ifTracer(parentCapTypeString == 'MiscServices/Neighborhood/Association/Master', 'parent = MiscServices/Neighborhood/Association/Master')) {
                    // copy data from renewal to parent application
                    copyContacts(capId,parentCapId);
                    copyAppSpecific(parentCapId);
                    copyASIFields(capId,parentCapId);
                    copyASITables(capId,parentCapId);
                    copyAddresses(capId, parentCapId);
                    copyParcels(capId, parentCapId);
                    editAppName(childCapScriptModel.specialText, parentCapId);
                }
            }
 		//}
	}
	catch(err){
		showMessage = true;
		comment("Error on custom function “WTUA;MiscServices!Neighborhood!Association!Renewal.js. Please contact administrator. Err: " + err);
		logDebug("Error on custom function “WTUA;MiscServices!Neighborhood!Association!Renewal.js. Please contact administrator. Err: " + err);
	}
}
	logDebug("WTUA;MiscServices!Neighborhood!Association!Renewal.js ended.");
