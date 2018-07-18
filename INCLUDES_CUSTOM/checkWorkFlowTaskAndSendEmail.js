
/**
 * 
 * @param ParentParallelTask task name that will open the parallel tasks
 * @param workFlowParentTaskStatus task status that will open the parallel tasks
 * @param workflowParallelTasks Parallel Tasks That need to be checked
 * @param taskToBeUpdated  the task to be updated when the validation of the parallel tasks completed 
 * @param taskStatus the status that need to update on the task
 * @param statusToBeChecked status to be checked on the parallel tasks
 * @param emailTemplate the email template that need to send to the applicant
 */
function checkWorkFlowTaskAndSendEmail(ParentParallelTask, workFlowParentTaskStatus, workflowParallelTasks, taskToBeUpdated, taskStatus, statusToBeChecked, emailTemplate) {
	var isLastParallelTask = true;
	var parentTask = aa.workflow.getTask(capId, ParentParallelTask).getOutput();
	if (parentTask != null) {
		for ( var t in workflowParallelTasks) {
			if (isTaskActive(workflowParallelTasks[t]) || parentTask.getDisposition() != workFlowParentTaskStatus) {
				isLastParallelTask = false;
				break;
			}

		}
	}
	if (isLastParallelTask) {
		for (t in workflowParallelTasks) {
			var task = aa.workflow.getTask(capId, workflowParallelTasks[t]).getOutput();
			if (task.getDisposition() != statusToBeChecked) {
				UpdateTaskAndSendNotification(emailTemplate, taskToBeUpdated, taskStatus);
				deactivateTask("Completeness Check #2");
				break;
			}
		}
	}
}
