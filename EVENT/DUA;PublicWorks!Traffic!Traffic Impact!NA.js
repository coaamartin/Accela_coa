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

ActivateWorkflowTasksBasedOnDocumentUpload("Traffic Impact Study", [ "Resubmittal Requested", "Incomplete Submittal" ], "Resubmittal Received");

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

function updateTaskStatusAndActivate(wfStatusNamesArray, newTaskStatus) {

	var tasks = aa.workflow.getTasks(capId);
	if (!tasks.getSuccess()) {
		logDebug("**WARN failed to get cap tasks, capId=" + capId + " Error:" + tasks.getErrorMessage());
		return false;
	}
	tasks = tasks.getOutput();

	if (tasks == null || tasks.length == 0) {
		logDebug("**WARN tasks list empty or null, capId=" + capId);
		return false;
	}

	for (w in wfStatusNamesArray) {
		for (t in tasks) {
			if (wfStatusNamesArray[w] == tasks[t].getDisposition()) {
				if (tasks[t].getActiveFlag() == "N") {
					activateTask(tasks[t].getTaskDescription());
				}
				updateTask(tasks[t].getTaskDescription(), newTaskStatus, "by script - document uploaded", "by script - document uploaded");
				//NO break; ... we need to check all tasks against each status
			}//status matched
		}//for all wf Tasks
	}//for all wfStatuses
	return true;
}

function setWFStatusAndActivate(sName){
	var workflowResult = aa.workflow.getTaskItems(capId, "", "", null, null, null);
	if (workflowResult.getSuccess())
		wfObj = workflowResult.getOutput();
	   
	else {
		logDebug("**ERROR: Failed to get workflow object: " , s_capResult.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		var fTask = wfObj[i];
		var wStaus="Resubmittal Requested";
		if ((fTask.getDisposition() != null && fTask.getDisposition().toUpperCase().equals(wStaus.toUpperCase())> 0)) {
			var dispositionDate = aa.date.getCurrentDate();
			var stepnumber = fTask.getStepNumber();
			//activate task
			var tResult =aa.workflow.adjustTask(capId, stepnumber, "Y", "N", null, null);
			if (tResult.getSuccess()){
				logDebug("Activated Workflow Task: " , fTask.getTaskDescription());
			}
			// update task status
			var uResult=aa.workflow.handleDisposition(capId, stepnumber,sName, dispositionDate, "", "Updated by Script", systemUserObj, "U");
			if (uResult.getSuccess()){
				logDebug("Set Workflow Task: " + fTask.getTaskDescription(), " Status to : Resubmittal Received");
			}
			
		}
	}
	return true;
}
