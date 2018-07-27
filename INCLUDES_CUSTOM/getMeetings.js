    function getMeetings(options) {
        var settings = {
            capId: capId,
            meetingType: null,
            includeHistory: true
        };
        for (var attr in options) { settings[attr] = options[attr]; } //optional params - overriding default settings
    
        var idx,
            filteredMeetings = [],
            allMeetings = aa.meeting.getMeetingsByCAP(settings.capId, settings.includeHistory).getOutput().toArray();
        
        for (idx in allMeetings) {
			if (settings.meetingType == null || allMeetings[idx].getMeeting().getMeetingType() == settings.meetingType) {
                filteredMeetings.push(allMeetings[idx])
			}
        }
        return filteredMeetings;
    }
    