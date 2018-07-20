
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
							logDebug("Script 200 Starting");
	if (wfTask == workFlowTaskTobechecked && wfStatus == workFlowStatusTobeChecked) {
						logDebug("Script 200 pass task and status " + wfTask + " " + wfStatus);
		var parentTask = aa.workflow.getTask(capId, parentWorkflowTasktoBechecked).getOutput();
		if (parentTask != null && parentTask != "") {
						logDebug("Script 200 pass task and status " + parentTask);
			if (parentTask.getDisposition() == parentworkFlowStatustoBeChecked) {
				logDebug("Script 200 Starting");
				activateTask(workflowTasktobeActivated);
				editAppSpecific(ASIFieldNametoBeUpdated, ASIFieldValue, capId);

			}

		}

	}

}
