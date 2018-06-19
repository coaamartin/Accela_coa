script269_GenerateWorkOrderTrafficInvestigation();

function script269_GenerateWorkOrderTrafficInvestigation() {
    var tasks = aa.workflow.getTasks(capId).getOutput();
	for (var t in tasks) {
		var task = tasks[t];
		if (task.getTaskDescription() == 'Traffic Investigation') {
			actionBy = task.getTaskItem().getSysUser();
			aa.print(actionBy);
			var userObj = aa.person.getUser(actionBy.firstName,null,actionBy.lastName).getOutput();
			assignTask("Generate Work Order",userObj.getUserID());
		}
	}
}