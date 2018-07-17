
/**
 * 
 * @param emailTemplate the email template that need to send to the applicant
 * @param taskToBeUpdated the task to be updated when the validation of the parallel tasks completed 
 * @param taskStatus the status that need to update on the task
 * @returns {Boolean} true if every thing is working fine otherwise will return false
 */
function UpdateTaskAndSendNotification(emailTemplate, taskToBeUpdated, taskStatus) {
	var taskResult = aa.workflow.getTask(capId, taskToBeUpdated);
	var currentTask = taskResult.getOutput();
	if (currentTask != null && currentTask != "") {
		currentTask.setDisposition(taskStatus);
		var updateResult = aa.workflow.handleDisposition(currentTask.getTaskItem(), capId);
		deactivateTask(currentTask);
	}

	var applicantEmail = null;
	var recordApplicant = getContactByType("Applicant", capId);
	if (recordApplicant) {
		applicantEmail = recordApplicant.getEmail();
	}
	if (applicantEmail == null) {
		logDebug("**WARN Applicant on record " + capId + " has no email");
		return false
	}

	var files = new Array();
	var eParams = aa.util.newHashtable();
	addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
	addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
	addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
	addParameter(eParams, "$$wfTask$$", wfTask);
	addParameter(eParams, "$$wfStatus$$", wfStatus);
	addParameter(eParams, "$$wfDate$$", wfDate);

	if (wfComment != null && typeof wfComment !== 'undefined') {
		addParameter(eParams, "$$wfComment$$", wfComment);
	}
	
	var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());

	var sendResult = sendNotification("noreply@aurora.gov",applicantEmail,"",emailTemplate,eParams,files,capID4Email);
	if (!sendResult) 
		{ logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
	else
		{ logDebug("Sent Notification"); }	

}
