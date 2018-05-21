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
            var childCapModel,
                parentCapModel,
                parentCapTypeString,
                parentCapId = getParent();

            if(ifTracer(parentCapId, 'parent found')) {
                //make sure parent is a permit (Water/Water/SWMP/Permit)
                childCapModel = capId.getCapModel();
                parentCapModel = parentCapId.getCapModel();
                parentCapTypeString = parentCapModel.getCapType().toString();
                logDebug("parentCapTypeString = " + parentCapTypeString);
                if(ifTracer(parentCapTypeString == 'Water/Water/SWMP/Permit', 'parent = Water/Water/SWMP/Permit')) {
                    // copy data from renewal to parent application
                    copyContacts(capId,parentCapId);
                    copyAppSpecific(capId,parentCapId)
                    copyASITables(capId,parentCapId)
                    copyAddresses(capId, parentCapId);
                    copyParcels(capId, parentCapId);
                    parentCapModel.setSpecialText(childCapModel.getSpecialText());
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
