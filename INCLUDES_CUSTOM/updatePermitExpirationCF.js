function updatePermitExpirationCF(workflowTaskName, workflowStatus,cfName) {
	for ( var i in workflowTaskName) {
		var wft = workflowTaskName[i];
		if (wfTask == wft && wfStatus == workflowStatus) {
			var statusDate = dateAdd(wfDateMMDDYYYY,180);
			useAppSpecificGroupName = false;
			editAppSpecific(cfName,statusDate);
		}
	}
}