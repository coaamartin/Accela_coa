/*
Title : Activate workflow tasks based on document upload (DocumentUploadAfter) 

Purpose : If the document type “Traffic Impact Study” is uploaded and a workflow task has a status = “Resubmittal Requested” or
“Incomplete Submittal” then update that workflow task that has that status to the status “In Progress” and make sure that
task is active.

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	ActivateWorkflowTasksBasedOnDocumentUpload("Traffic Impact Study", [ "Resubmittal Requested", "Incomplete Submittal" ], "In Progress");

*/

ActivateWorkflowTasksBasedOnDocumentUpload("Traffic Impact Study", [ "Resubmittal Requested", "Incomplete Submittal" ], "In Progress");

/* Title :  Activate Workflow tasks based on documents(DocumentUploadAfter)

Purpose :   When a document type Traffic Impact Study is uploaded then update any workflow task with the status “resubmittal requested” with a scripted status
of resubmittal received and activate that task.

Author :   Israa Ismail

Functional Area : Records

Parameters: DocumentType,newStatus : New Workflow Status

Sample Call : checkIfDocUploadedAndUpdateWfTask("Drainage Plans","SS Requested");

*/

checkIfDocUploadedAndUpdateWfTask("Traffic Impact Study","Resubmittal Received");

function ActivateWorkflowTasksBasedOnDocumentUpload(documentTypeUploaded, wfStatusNamesArray, newTaskStatus) {
	if (typeof documentModelArray !== 'undefined' && documentModelArray == null || documentModelArray.length == 0) {
		return false;
	}
	for (var d = 0; d < documentModelArray.size(); d++) {
		if (documentModelArray.get(d).getDocCategory().equalsIgnoreCase(documentTypeUploaded)) {
			//if docType matched, no need to complete the loop
			return updateTaskStatusAndActivate(wfStatusNamesArray, newTaskStatus);
		}
	}
	return false;
} 

function checkIfDocUploadedAndUpdateWfTask(DocumentType,newStatus){
	for (var i = 0; i < documentModelArray.size(); i++) {
		var documentModel = documentModelArray.get(i);
		var documentCategory = documentModel.getDocCategory();
		if (documentCategory!=null && documentCategory.equals(DocumentType)){
			 setWFStatusAndActivate(newStatus);
			 break;
	      }
	}
}
