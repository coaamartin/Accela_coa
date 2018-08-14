/**
 * 
 * @param workFLowTasktoBechecked work flow task to be checked
 * @param workFlowStatustoBeChecked work flow status to be checked 
 * @param inspectionType inspection type to be checked 
 * @param inspCheckList inspection check list
 * @param customField custom field
 * @param customFieldValue custom field value
 * @param PlantingRecordType  4 levels type to be created 
 */
/**
 * this function to create the record type and copy the related data
 * @param PlantingRecordType the 4 levels of the record type that needs to be create
 * Updated script to only create child record once and only copy the Applicant and Project Owner.  This is for script 137
 */

function createRecordAndCopyInfo(appType, workflowTaskName, workflowStatus, tsiName, childRecord) {
for ( var i in appType) {
if (appMatch(appType[i])) {
    for ( var j in workflowStatus) {
        if (wfTask == workflowTaskName && wfStatus == workflowStatus[j]) {
            var attributes = {};
            loadTaskSpecific(attributes);
            if (attributes[tsiName] == "Yes") {
                var trafficRecordStructure = childRecord.split("/");
                var childRecs = getChildren(childRecord, capId);
                //if a child of type childRecord exist, then don't create the child record.
                if(childRecs && childRecs.length > 0) return ;
                
                var newId = createChild(trafficRecordStructure[0], trafficRecordStructure[1], trafficRecordStructure[2], trafficRecordStructure[3], "");
				//Remove all contacts
				removeContactsFromCap(newId);
				//Add only contacts required
				copyContactsByType(capId, newId, "Applicant");
				copyContactsByType(capId, newId, "Project Owner");
				
                copyOwner(capId, newId);

                //Set Application Name.
                var capDetails = aa.cap.getCap(capId).getOutput();
                var appName = capDetails.getSpecialText();
                var newCapModel = aa.cap.getCap(newId).getOutput().getCapModel();
                newCapModel.setSpecialText(appName);
                //aa.cap.editCapByPK(newCapModel);

                //Set Description = app name + description.
                var capView = aa.cap.getCapViewByID(capId).getOutput();
                var capDetailsDesc = capView.getCapWorkDesModel().getDescription();
                var workDescResult = aa.cap.getCapWorkDesByPK(newId);
                if (workDescResult.getSuccess()) {
                    var workDesObj = workDescResult.getOutput().getCapWorkDesModel();
                    workDescObj.setDescription(appName + " : " + capDetailsDesc);
                    aa.cap.editCapWorkDesc(workDescObj);
                }
            }
        }
    }
}
}
}

