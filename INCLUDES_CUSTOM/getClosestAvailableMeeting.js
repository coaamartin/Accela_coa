function getClosestAvailableMeeting(meetingGroupName, targetDate, startDate, endDate, vMeetingType) {
logDebug("************getClosestAvailableMeeting START");
    try {
	var availables = aa.meeting.getAvailableMeetings(null, 60, meetingGroupName, startDate, endDate, null, null);
	var availMeets = availables.getOutput();
	var closestDays = null;
	var retMeeting = null;
	for (y in availMeets) {
		if ( availMeets[y].meetingType == vMeetingType ) {
			var meetingStartDate = aa.util.formatDate(availMeets[y].startDate, "MM/dd/yyyy");
			var dMSD = new Date(meetingStartDate.toString());
			var tmpTarget = ("0" + targetDate.getMonth()).slice(-2) + "/" 
							+ ("0" + targetDate.getDayOfMonth()).slice(-2) + "/" 
							+ targetDate.getYear();
			tmpTarget = new Date(tmpTarget);
			var daysDiff = Math.abs(dMSD - tmpTarget);
			daysDiff = Math.floor((daysDiff) / (1000*60*60*24));
			if ( (daysDiff < closestDays) || (closestDays ==  null ) ) {
				retMeeting = availMeets[y];
				closestDays = daysDiff;
			}
		}
	}
    } catch (err) {
        logDebug("getClosestAvailableMeeting: A JavaScript Error occured: " + err.message);
    }
	logDebug("getClosestAvailableMeeting: the closest day is "+closestDays+"from the target date of:"+targetDate);
	logDebug("************getClosestAvailableMeeting END");
    return retMeeting;
}
