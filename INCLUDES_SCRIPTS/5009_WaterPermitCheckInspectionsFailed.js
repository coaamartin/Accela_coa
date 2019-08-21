if ("Failed".equals(inspResult)){
	var contact = "Applicant";
	var template = "WAT_UTILITY_PERMIT_FAILED_INSP";
	if(vEventName == "V360InspectionResultSubmitAfter")
		inspectionComment = inspComment;
	else
		inspectionComment = inspResultComment;

		
	var emailParams = aa.util.newHashtable();
	addParameter(emailParams, "$$altID$$", cap.getCapModel().getAltID());
	addParameter(emailParams, "$$recordAlias$$", cap.getCapModel().getCapType().getAlias());
	addParameter(emailParams, "$$recordStatus$$", cap.getCapModel().getCapStatus());
	addParameter(emailParams, "$$inspID$$", inspId);
	addParameter(emailParams, "$$inspResult$$", inspResult);
	addParameter(emailParams, "$$inspComment$$", inspectionComment);
	addParameter(emailParams, "$$inspResultDate$$", inspResultDate);
	addParameter(emailParams, "$$inspGroup$$", inspGroup);
	addParameter(emailParams, "$$inspType$$", inspType);
	if (inspSchedDate) {
		addParameter(emailParams, "$$inspSchedDate$$", inspSchedDate);
	} else {
		addParameter(emailParams, "$$inspSchedDate$$", "N/A");
	}

	emailContacts(contact, template, emailParams, "", "", "N", "");
}
