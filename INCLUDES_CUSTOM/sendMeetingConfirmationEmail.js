function sendMeetingConfirmationEmail(workFlowTask, workflowStatusArray, emailTemplate) {

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

		//deprecated email functionality
		/*var toEmail = "";
		var responsibleParty = getContactByType("Responsible Party", capId);
		if (!responsibleParty || !responsibleParty.getEmail()) {
			logDebug("**WARN no 'Responsible Party' found or has no email capId=" + capId);
		} else {
			toEmail = responsibleParty.getEmail();
		}

		var consultant = getContactByType("Consultant", capId);
		if (!consultant || !consultant.getEmail()) {
			logDebug("**WARN no 'Consultant' found or has no capId=" + capId);
		} else {
			if (toEmail != "") {
				toEmail += ";";
			}
			toEmail += consultant.getEmail();
		}*/

		var asiValues = new Array();
		if (useAppSpecificGroupName) {
			var olduseAppSpecificGroupName = useAppSpecificGroupName;
			useAppSpecificGroupName = false;
			loadAppSpecific(asiValues);
			useAppSpecificGroupName = olduseAppSpecificGroupName;
		} else {
			asiValues = AInfo;
		}

		//var ccEmail = "";
		
		var vODAProjectCoordinator = getAppSpecific("ODA Project Coordinator");
		
		var vODAPCUserID = lookup("ODA_PC", vODAProjectCoordinator);
		var vODAPCEmail = getUserEmail(vODAPCUserID);
		
		/*var projectCoord = asiValues["ODA Project Coordinator"];
		var projectMan = asiValues["ODA Project Manager"];
		
		if (projectCoord != null && projectCoord != "") {
			var fullName = projectCoord.split(" ");
			var contact = aa.people.getPeopleByFMLName(fullName[0], "", fullName[1]);
			if (contact.getSuccess()) {
				if (contact.getOutput() != null) {
					var peop = contact.getOutput();
					if (peop.length > 0) {
						ccEmail += peop[0].getEmail();
					}
				}
			}
		}
		if (projectMan != null && projectMan != "") {
			if (ccEmail != "") {
				ccEmail += ";";
			}
			var fullName = projectMan.split(" ");
			var contact = aa.people.getPeopleByFMLName(fullName[0], "", fullName[1]);
			if (contact.getSuccess()) {
				if (contact.getOutput() != null) {
					var peop = contact.getOutput();
					if (peop.length > 0) {
						ccEmail += peop[0].getEmail();
					}
				}
			}
		}*/
		
		
		var eParams = aa.util.newHashtable();
		addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(eParams, "$$capAlias$$", cap.getCapType().getAlias());
		addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
		addParameter(eParams, "$$balance$$", feeBalance(""));
		addParameter(eParams, "$$wfTask$$", wfTask);
		addParameter(eParams, "$$wfStatus$$", wfStatus);
		addParameter(eParams, "$$wfDate$$", wfDate);
		addParameter(eParams, "$$wfComment$$", wfComment);
		addParameter(eParams, "$$wfStaffUserID$$", wfStaffUserID);
		addParameter(eParams, "$$wfHours$$", wfHours);
		addParameter(eParams, "$$ODACoordinatorEmail", vODAPCEmail);

		emailWithReportLinkASync("Responsible Party,Consultant", emailTemplate, eParams, "", "", "N", "");
		
		/*var sent = aa.document.sendEmailByTemplateName("", toEmail, ccEmail, emailTemplate, eParams, null);
		if (!sent.getSuccess()) {
			logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
		}*/
	} else {
		return false;
	}

	return true;
}