/*Script 85
 * Record Types:	Water/Water/SWMP/Renewal
 * Event: 		WorkflowTaskUpdateAfter (WTUA)
 * 
 * Desc:			
 * If the workflow task “Permit Issuance” has a status of “Completed” then automatically 
 * update the parent permit (Water/Water/SWMP/Permit) with data from the current renewal 
 * record(Water/Water/SWMP/Renewal) including contacts, custom fields, application name, 
 * address and parcel.
 * 
*/

function script85_UpdateSwmpParent() {
	logDebug("script85_UpdateSwmpParent() started.");
	try{
		// if wfTask = Permit Issued & wfStatus = Completed”
	//	if ( wfTask == "Permit Issued" && wfStatus == "Completed" ) 
	//	{
            //get parent
            var parentCap,
                parentCapTypeString,
                parentCapid = getParent();

            if(parentCapid) {
                //make sure parent is a permit (Water/Water/SWMP/Permit)
                parentCap = aa.cap.getCap(parentCapid).getOutput();
                parentCapTypeString = parentCap.getCapType().toString();
                logDebug("parentCapTypeString = " + parentCapTypeString);
                if(parentCapTypeString == 'Water/Water/SWMP/Permit') {
                    // copy data from renewal to parent application
                    copyContacts(capId,parentCapid);
                    copyASIFields(capId,parentCapid)
                    copyAddresses(capId, parentCapid);
                    copyParcels(capId, parentCapid);
                    parentCapid.setSpecialText(capId.getSpecialText());
                }
            }
 	//	}
	}
	catch(err){
		showMessage = true;
		comment("Error on custom function “script85_UpdateSwmpParent(). Please contact administrator. Err: " + err);
		logDebug("Error on custom function “script85_UpdateSwmpParent(). Please contact administrator. Err: " + err);
	}
	logDebug("script85_UpdateSwmpParent() ended.");
};//END script85_UpdateSwmpParent();
