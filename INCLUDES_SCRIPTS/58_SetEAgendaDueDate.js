// coded to spec - not needed
script58_SetEAgendaDueDate();

function script58_SetEAgendaDueDate() {        
    var meetings,
        meetingDate,
        meetingDateMinus15,
        meetingDateMinus20,
        wfTaskToUpdate = 'Create E-Agenda';

   // activateTask('Create E-Agenda');
    activateTask('Complete E-Agenda'); 

    meetings = getMeetings ({
        meetingType: 'CITY COUNCIL'
    });

    if(ifTracer(meetings && meetings.length > 0, 'there are meetings')) {
        meetingDate = new Date(meetings[0].getMeeting().getStartDate().getTime());
        meetingDateMinus15 = dateAdd(aa.util.formatDate(meetingDate, "MM/dd/YYYY"), -15);
        meetingDateMinus20 = dateAdd(aa.util.formatDate(meetingDate, "MM/dd/YYYY"), -20);

        editTaskDueDate(wfTaskToUpdate, meetingDateMinus15);
        updateTaskAssignedDate(wfTaskToUpdate, meetingDateMinus20);
    }
}
