
/**
 * Update task status with the assigned user 
 * @param TasksToBeChecked the needed tasks to be updated if its active.
 */
function updateTaskAssignedUserbyCapAssignedUser(TasksToBeChecked) {
	var capAssignedUser = aa.cap.getCapDetail(capId).getOutput().getCapDetailModel().getAsgnStaff();
	if (capAssignedUser != null && capAssignedUser != "") {
		for ( var i in TasksToBeChecked) {
			if (isTaskActive(TasksToBeChecked[i])) {
				assignTask(TasksToBeChecked[i], capAssignedUser);
				break;
			}
		}
	}
}
