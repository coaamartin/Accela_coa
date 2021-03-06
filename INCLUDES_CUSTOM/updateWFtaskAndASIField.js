
/**
 * 
 * @param parentWorkflowTasktoBechecked the task that need to be checked 
 * @param parentworkFlowStatustoBeChecked the status of the task to be checked 
 * @param workFlowTaskTobechecked current work flow task
 * @param workFlowStatusTobeChecked current work flow status
 * @param workflowTasktobeActivated work flow task to be activated
 * @param ASIFieldNametoBeUpdated asi field name
 * @param ASIFieldValue value
 */
function updateWFtaskAndASIField(parentWorkflowTasktoBechecked, parentworkFlowStatustoBeChecked, workFlowTaskTobechecked, workFlowStatusTobeChecked, workflowTasktobeActivated,
		ASIFieldNametoBeUpdated, ASIFieldValue) {
	if (wfTask == workFlowTaskTobechecked && wfStatus == workFlowStatusTobeChecked) {
		var parentTask = aa.workflow.getTask(capId, parentWorkflowTasktoBechecked).getOutput();
		if (parentTask != null && parentTask != "") {
			if (parentTask.getDisposition() == parentworkFlowStatustoBeChecked) {
				activateTask(workflowTasktobeActivated);
				editAppSpecific(ASIFieldNametoBeUpdated, ASIFieldValue, capId);

			}

		}

	}

}
