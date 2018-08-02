//Script 32
function editTaskDatesAndSendEmail(workFlowTask, meetingType, emailTemplateName) {
    logDebug('editTaskDatesAndSendEmail() started.');
    try{
        var calId = aa.env.getValue("CalendarID");
        var meetingId = aa.env.getValue("MeetingID");
        
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
        var applicantName = applicant.getContactName();
        
        var respUserProp = [];
        
        var mgrProp = [];
        var caseMgr = getInspectorID();
        loadUserProperties(mgrProp, caseMgr);
        var eParams = aa.util.newHashtable();
        addParameter(eParams, "$$ContactFullName$$", applicantName);
        addParameter(eParams, "$$fileDate$$", fileDate);
        addParameter(eParams, "$$MeetingDate$$", meetingDate);
        addParameter(eParams, "$$MeetingResponceDate$$", dateAdd(meetingDate, 7, true));
        
        addParameter(eParams, "$$StaffPhone$$", mgrProp["PhoneNumer"]);
        addParameter(eParams, "$$StaffEmail$$", mgrProp["Email"]);
        addParameter(eParams, "$$Meeting.RespName$$", mgrProp["FullName"]);
        addParameter(eParams, "$$Meeting.RespDept$$", mgrProp["Department"]);
        
        var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
        var reportFile = [];
        var sendResult = sendNotification("noreply@aurora.gov",toEmail,"",emailTemplateName,eParams,reportFile,capID4Email);
        if (!sendResult) { logDebug("editTaskDatesAndSendEmail: UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
        else { logDebug("editTaskDatesAndSendEmail: Sent email notification meeting scheduled "+toEmail)}
        
        logDebug('editTaskDatesAndSendEmail() ended.');
        return true;
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function editTaskDatesAndSendEmail(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function editTaskDatesAndSendEmail(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
}//END 