script58_SetEAgendaDueDate();

function script58_SetEAgendaDueDate() {        
    var meetings,
        meetingDate,
        meetingDateMinus15,
        meetingDateMinus20,
        wfTaskToUpdate = 'Create E-Agenda';

    activateTask('Create E-Agenda');

    meetings = getMeetings ({
        meetingType: wfTaskToUpdate 
    });

    if(meetings && meetings.length > 0) {
        meetingDate = new Date(meetings[0].getMeeting().getStartDate().getTime());
        meetingDateMinus15 = dateAdd(aa.util.formatDate(meetingDate, "MM/dd/YYYY"), -15);
        meetingDateMinus20 = dateAdd(aa.util.formatDate(meetingDate, "MM/dd/YYYY"), -20);

        editTaskDueDate(wfTaskToUpdate, aa.util.formatDate(meetingDateMinus15));
        updateTaskAssignedDate(wfTaskToUpdate, aa.util.formatDate(meetingDateMinus20));
    }
}
