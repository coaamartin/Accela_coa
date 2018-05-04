/**
 * 
 * @param emailTemplate email template 
 * @param reviewTasksStatuses the task status that need to check
 * @returns {Boolean} return true if the success otherwise will return false
 */
function reactivateTasksAndSendemail(emailTemplate, reviewTasksStatuses) {
	var workflowTasks = aa.workflow.getTasks(capId).getOutput();
	for (i in workflowTasks) {
		var wfTask = workflowTasks[i];
		if (wfTask.getTaskDescription().indexOf("Review") != -1 && checkWFStatus(wfTask.getDisposition(), reviewTasksStatuses)) {
			if (!isTaskActive(wfTask.getTaskDescription())) {
				activateTask(wfTask.getTaskDescription());
			}

		}
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
	if (wfComment != null && typeof wfComment !== 'undefined') {
		addParameter(eParams, "$$wfComment$$", wfComment);
	}
	var sent = aa.document.sendEmailByTemplateName("", applicantEmail, "", emailTemplate, eParams, files);
	if (!sent.getSuccess()) {
		logDebug("**ERROR sending email failed, error:" + sent.getErrorMessage());
		return false;
	}

	return true;

}
