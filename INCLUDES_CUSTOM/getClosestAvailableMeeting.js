function getClosestAvailableMeeting(meetingGroupName, targetDate, startDate, endDate, vMeetingType) {
logDebug("************getClosestAvailableMeeting START");
//logDebug("     meetingGroupName:"+meetingGroupName+" and is type:"+typeof (meetingGroupName));
//logDebug("     targetDate:"+targetDate+" and is type:"+typeof (targetDate));
//logDebug("     startDate:"+startDate+" and is type:"+typeof (startDate));
//logDebug("     endDate:"+endDate+" and is type:"+typeof (endDate));
//logDebug("     vMeetingType:"+vMeetingType+" and is type:"+typeof (vMeetingType));


    //With a meeting group name, start date and meeting type, returns first available meeting
    var availOne = false;
    try {
		var availables = aa.meeting.getAvailableMeetings(null, 60, meetingGroupName, startDate, endDate, null, null);
		var availMeets = availables.getOutput();
		var closestDays = null;
		var retMeeting = null;
		for (y in availMeets) {
//			logDebug("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^PRINTING THE availMeets sub ["+y+"] OBJECT");
//			printObjProperties(availMeets[y]);
//			logDebug("			meetingID:"+availMeets[y].meetingId+" which is of  type:"+typeof (availMeets[y].meetingId));
//			logDebug("			meetingType:"+availMeets[y].meetingType+" which is of  type:"+typeof (availMeets[y].meetingType));
//			logDebug("			start date:"+availMeets[y].startDate+" which is of  type:"+typeof (availMeets[y].startDate));
//			logDebug("			end date:"+availMeets[y].endDate+" which is of  type:"+typeof (availMeets[y].endDate));
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
//					logDebug("just updated the retMeetingID and closestDays!");
				}
			}
		}
    } catch (err) {
        logDebug("A JavaScript Error occured: " + err.message);
    }
	logDebug("the closest day is "+closestDays+"from the target date of:"+targetDate);
	logDebug("************getClosestAvailableMeeting END");
    return retMeeting;
}
