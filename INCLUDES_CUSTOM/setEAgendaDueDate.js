function setEAgendaDueDate(workFlowTask, workflowStatusArray, wfTaskToUpdate, meetingType) {

	if (wfTask == workFlowTask) {

		var statusMatch = false;

		for (s in workflowStatusArray) {
			if (wfStatus == workflowStatusArray[s]) {
				statusMatch = true;
				break;
			}
		}//for all status options

		if (!statusMatch) {
			return false;
		}

		activateTask(wfTaskToUpdate);
		
		var meetings = aa.meeting.getMeetingsByCAP(capId, true);
		if (!meetings.getSuccess()) {
			logDebug("**WARN could not get meetings capId=" + capId + " error:" + meetings.getErrorMessage());
			return false;
		}
		meetings = meetings.getOutput().toArray();
		for (m in meetings) {
			if (meetings[m].getMeeting().getMeetingType() != null && meetings[m].getMeeting().getMeetingType().equalsIgnoreCase(meetingType)) {
				var meetingDate = new Date(meetings[m].getMeeting().getStartDate().getTime());
				var prev15 = getPrevWorkingDays(meetingDate, 15);
				var prev20 = getPrevWorkingDays(meetingDate, 20);
				prev15 = aa.util.formatDate(prev15, "MM/dd/YYYY");
				prev20 = aa.util.formatDate(prev20, "MM/dd/YYYY");
				editTaskDueDate(wfTaskToUpdate, prev15);
				updateTaskAssignedDate(wfTaskToUpdate,prev20);
	            //logDebug("Prev 20: " + prev20);
				break;//stop meetings loop
			}//meeting found
		}//for all meetings
	} else {
		return false;
	}
	return true;

	
}
