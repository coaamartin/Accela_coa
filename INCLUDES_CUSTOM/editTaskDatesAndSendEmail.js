/*
Title : Update Workflow Due Date with Zoning Inquiry Meeting Date and send email (MeetingScheduleAfter) 
Purpose : If certain meeting type was scheduled, update a Task status and due date, and send an email
Author: Yazan Barghouth 
Functional Area : Records
Notes:
	make sure meeting type "Tuesday Zoning Inquiry" Meeting exist (configured), you can pass any type as parameter 'meetingType'
*/


function editTaskDatesAndSendEmail(workFlowTask, meetingType, emailTemplateName) {
logDebug("start Script32");
	var calId = aa.env.getValue("CalendarID");
	var meetingId = aa.env.getValue("MeetingID");
	var result = aa.meeting.getMeetingCalendar(CalendarID);
	var meetingGroupName  = result.output.getMeetingGroupName();
	var meetingGroupType = result.output.getMeetingGroupType();
	


	if (calId == null || calId == "" || meetingId == null || meetingId == "") {
		logDebug("**WARN no calendarId or MeetingId in session!, capId=" + capId);
		return false;
	}

	var meeting = aa.meeting.getMeetingByMeetingID(calId, meetingId)
	if (!meeting.getSuccess()) {
		logDebug("**WARN getMeetingByMeetingID failed capId=" + capId + "calendarId/MeetingId: " + calId + "/" + meetingId);
		return false;
	}
	meeting = meeting.getOutput();
	logDebug("Meeting: "+ meeting);
	var startDate = meeting.getStartDate();
	if (!String(meeting.getMeetingType()).equalsIgnoreCase(meetingType)) {
		return false;
	}
	var meetingDate = aa.util.formatDate(startDate, "MM/dd/YYYY");

	var task = aa.workflow.getTask(capId, workFlowTask).getOutput();
	task.getTaskItem().setStatusDate(convertDate(meetingDate));
	task.getTaskItem().setDueDate(convertDate(meetingDate));
	var edit = aa.workflow.editTask(task);

	var applicant = getContactByType("Applicant", capId);
	if (!applicant || !applicant.getEmail()) {
		logDebug("**WARN no applicant found on or no email capId=" + capId);
		return false;
	}
	var cap = aa.cap.getCap(capId).getOutput();
	cap = cap.getCapModel();
	var toEmail = applicant.getEmail();
	var eParams = aa.util.newHashtable();
	addParameter(eParams, "$$altID$$", cap.getAltID());
	addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
	addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
	var sent = aa.document.sendEmailByTemplateName("", toEmail, "", emailTemplateName, eParams, null);
	if (!sent.getSuccess()) {
		logDebug("**WARN send email failed, Error: " + sent.getErrorMessage());
	}
	return true;
	logDebug("end Script32");
}