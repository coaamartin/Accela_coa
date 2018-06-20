function sendHearingScheduledEmailAndUpdateASI(workFlowTaskToCheck, workflowStatusArray, meetingType, asiFieldName, emailTemplate) {
	logDebug("sendHearingScheduledEmailAndUpdateASI() started.");
	logDebug("Meeting Type" + meetingType);
	logDebug("workflow " + workFlowTaskToCheck);
    logDebug("ASI " + asiFieldName);

	if (cap.getCapModel().getCapType().getSubType().equalsIgnoreCase("Address")) {
		return false;
	}

	if (wfTask == workFlowTaskToCheck) {

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

		//Update ASI
		var meetings = aa.meeting.getMeetingsByCAP(capId, true);
		if (!meetings.getSuccess()) {
			logDebug("**ERROR could not get meeting capId=" + capId + " error:" + meetings.getErrorMessage());
			return;
		}
		meetings = meetings.getOutput().toArray();
		for (m in meetings) {
			if (meetings[m].getMeeting().getMeetingType() != null && meetings[m].getMeeting().getMeetingType().equalsIgnoreCase(meetingType)) {
				//Edit ASI
				var meetingDate = new Date(meetings[m].getMeeting().getStartDate().getTime());
				meetingDate = dateAdd(meetingDate, 0);
				var olduseAppSpecificGroupName = useAppSpecificGroupName;
				useAppSpecificGroupName = false;
				editAppSpecific(asiFieldName, meetingDate);
				logDebug("ASI " + asiFieldName);
				var noOfSigns = getAppSpecific("Number of Signs");
				useAppSpecificGroupName = olduseAppSpecificGroupName;
				
				if(noOfSigns == undefined || noOfSigns == null || noOfSigns == "") noOfSigns = "";

				//Send email
				var recordApplicant = getContactByType("Applicant", capId);
				var applicantEmail = null;
				if (!recordApplicant || recordApplicant.getEmail() == null || recordApplicant.getEmail() == "") {
					logDebug("**WARN no applicant or applicant has no email, capId=" + capId);
				} else {
					applicantEmail = recordApplicant.getEmail();
					var applicantName = recordApplicant.getFullName();
					logDebug("Applicant Email" + applicantEmail);
					var files = new Array();
					//prepare Deep URL:
				var acaSiteUrl = lookup("ACA_CONFIGS", "ACA_SITE");
				var subStrIndex = acaSiteUrl.toUpperCase().indexOf("/ADMIN");
				var acaCitizenRootUrl = acaSiteUrl.substring(0, subStrIndex);
				var deepUrl = "/urlrouting.ashx?type=1000";
				deepUrl = deepUrl + "&Module=" + cap.getCapModel().getModuleName();
				deepUrl = deepUrl + "&capID1=" + capId.getID1();
				deepUrl = deepUrl + "&capID2=" + capId.getID2();
				deepUrl = deepUrl + "&capID3=" + capId.getID3();
				deepUrl = deepUrl + "&agencyCode=" + aa.getServiceProviderCode();
				deepUrl = deepUrl + "&HideHeader=true";
				var recordDeepUrl = acaCitizenRootUrl + deepUrl;
				var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
				var reportFile = [];

					var eParams = aa.util.newHashtable();
					addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
					addParameter(eParams, "$$ContactEmail$$", applicantEmail);
					addParameter(eParams, "$$ContactFullName$$", applicantName);
					addParameter(eParams, "$$pcDate$$", meetingDate);
					addParameter(eParams, "$$10dayspriortopcDate$$", dateAdd(meetingDate, -10));
					addParameter(eParams, "$$numberofSigns$$", noOfSigns);
					addParameter(eParams, "$$StaffPhone$$", caseManagerPhone);
					addParameter(eParams, "$$StaffEmail$$", caseManagerEmail);
					addParameter(eParams, "$$recordDeepUrl$$", recordDeepUrl);
					if (wfComment != null && typeof wfComment !== 'undefined') {
						addParameter(eParams, "$$wfComment$$", wfComment);
					}
					addParameter(eParams, "$$wfStaffUserID$$", wfStaffUserID);
					addParameter(eParams, "$$wfHours$$", wfHours);

					var sent = sendNotification("noreply@aurora.gov",applicantEmail, "",emailTemplate, eParams,reportFile,capID4Email);
					 if (!sent.getSuccess()) {
						logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
						return false;
					}
				}//applicant OK
				return true;
			}//meetingType match
		}//for all meetings
		logDebug("**WARN no meeting of type=" + meetingType + " capId=" + capId);
		return false;
	} else {
		return false;
	}
}