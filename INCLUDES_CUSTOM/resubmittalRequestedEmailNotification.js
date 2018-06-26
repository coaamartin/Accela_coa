function resubmittalRequestedEmailNotification(workFlowTask, workflowStatusArray, emailTemplate) {

	if (workFlowTask == null || wfTask == workFlowTask) {

		var statusMatch = false;

		for (s in workflowStatusArray) {
			if (wfStatus == workflowStatusArray[s]) {
				statusMatch = true;
				break;
			}
		}
		//for all status options
		if (!statusMatch) {
			return false;
		}

		var contacts = getContactArray();
		if (!contacts) {
			logDebug("**WARN no contacts found on cap " + capId);
			return false;
		}

		var toEmails = new Array();
		for (c in contacts) {
			if (contacts[c]["email"] && contacts[c]["email"] != null && contacts[c]["email"] != "") {
				toEmails.push(contacts[c]["email"]);
			}
		}

		if (toEmails.length == 0) {
			logDebug("**WARN no contacts with valid email on cap " + capId);
			return false;
		}
// set up parameters for template
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
		addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
		addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
		addParameter(eParams, "$$balance$$", feeBalance(""));
		addParameter(eParams, "$$wfTask$$", wfTask);
		addParameter(eParams, "$$wfStatus$$", wfStatus);
		addParameter(eParams, "$$wfDate$$", wfDate);
		addParameter(eParams, "$$wfComment$$", wfComment);
		addParameter(eParams, "$$wfStaffUserID$$", wfStaffUserID);
		addParameter(eParams, "$$wfHours$$", wfHours);
		addParameter(eParams, "$$recordDeepUrl$$", recordDeepUrl);
		/*for (t in toEmails) {
			aa.document.sendEmailByTemplateName("", toEmails[t], "", emailTemplate, eParams, null);
		}*/
        for (t in toEmails) {
		var sendResult = sendNotification("noreply@aurora.gov",toEmails[t],"",emailTemplate,eParams,reportFile,capID4Email);
		}
	} else {
		return false;
	}

	return true;
}