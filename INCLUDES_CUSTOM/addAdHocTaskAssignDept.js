function addAdHocTaskAssignDept(adHocProcess, adHocTask, adHocNote, vAsgnDept) {
//adHocProcess must be same as one defined in R1SERVER_CONSTANT
//adHocTask must be same as Task Name defined in AdHoc Process
//adHocNote can be variable
//vAsgnDept Assigned to Department must match an AA Department
//Optional 5 parameters = CapID
//Optional 6 parameters = Due Date
	var thisCap = capId;
	var dueDate = aa.util.now();
	if(arguments.length > 4){
		thisCap = arguments[4] != null && arguments[4] != "" ? arguments[4] : capId;
	}
	if (arguments.length > 5) {
		var dateParam = arguments[5];
		if (dateParam != null && dateParam != "") { dueDate = convertDate(dateParam); }
	}

	var departSplits = vAsgnDept.split("/");
	var assignedUser = aa.person.getUser(null,null,null,null,departSplits[0],departSplits[1],departSplits[2],departSplits[3],departSplits[4],departSplits[5]).getOutput();
	assignedUser.setDeptOfUser(aa.getServiceProviderCode() + "/" + vAsgnDept);
	
	var taskObj = aa.workflow.getTasks(thisCap).getOutput()[0].getTaskItem()
	taskObj.setProcessCode(adHocProcess);
	taskObj.setTaskDescription(adHocTask);
	taskObj.setDispositionNote(adHocNote);
	taskObj.setProcessID(0);
	taskObj.setAssignmentDate(aa.util.now());
	taskObj.setDueDate(dueDate);
	taskObj.setAssignedUser(assignedUser);
	wf = aa.proxyInvoker.newInstance("com.accela.aa.workflow.workflow.WorkflowBusiness").getOutput();
	wf.createAdHocTaskItem(taskObj);
	return true;
}