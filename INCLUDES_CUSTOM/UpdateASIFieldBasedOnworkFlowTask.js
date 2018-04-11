/**
 * @param workflowTask work flow task that need to be checked
 * @param workflowStatus work flow status to be checked
 * @param ASIFieldName ASI field that need to be updated
 * @param daysOut number of days that need to be shifted
 */
function UpdateASIFieldBasedOnworkFlowTask(workflowTask, workflowStatus, ASIFieldName, daysOut) {
	if (wfTask == workflowTask && wfStatus == workflowStatus) {
		editAppSpecific(ASIFieldName, getCalculatedDate(wfDateMMDDYYYY, daysOut), capId);
	}

}
