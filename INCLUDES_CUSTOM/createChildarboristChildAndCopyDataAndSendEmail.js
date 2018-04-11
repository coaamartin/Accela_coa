
/**
 * 
 * @param workflowTask work flow task that need to be checked
 * @param worflowStatus work flow status that need to be checked
 * @param LicenseType 4 levels for the license record to be created 
 * @param emailTemplate email template
 * @param reportName report name	
 * @param rptParams report param if exists
 */
function createChildarboristChildAndCopyDataAndSendEmail(workflowTask, worflowStatus, LicenseType, emailTemplate, reportName, rptParams) {
	if (wfTask == workflowTask && wfStatus == worflowStatus) {
		var applicantEmail = "";
		var licTypeArray = LicenseType.split("/");
		childCapId = null;
		// check if the record has child license
		var childCapList = aa.cap.getChildByMasterID(capId).getOutput();
		if (childCapList != null) {
			for (var i = 0; i < childCapList.length; i++) {
				var childCapID = childCapList[i].getCapID()
				var childCap = aa.cap.getCap(childCapID).getOutput();
				var childAppTypeResult = childCapList[i].getCapType();
				var childAppTypeString = childAppTypeResult.toString();
				if (childAppTypeString == childAppTypeString) {
					childCapId = childCapID;
					break;
				}
			}
		}
		//create temp record:
		if (childCapId == null) {
			var ctm = aa.proxyInvoker.newInstance("com.accela.aa.aamain.cap.CapTypeModel").getOutput();
			ctm.setGroup(licTypeArray[0]);
			ctm.setType(licTypeArray[1]);
			ctm.setSubType(licTypeArray[2]);
			ctm.setCategory(licTypeArray[3]);
			createChildResult = aa.cap.createSimplePartialRecord(ctm, "", "INCOMPLETE EST");
			if (createChildResult.getSuccess()) {
				childCapId = createChildResult.getOutput();
				aa.cap.createAppHierarchy(capId, childCapId);
			}
		}
		if (childCapId != null) {
			var rNewLicIdString = childCapId.getCustomID();
			createRefLP4Lookup(rNewLicIdString, "Business", "Applicant", null);
			var rNewLP = aa.licenseScript.getRefLicensesProfByLicNbr(aa.serviceProvider, rNewLicIdString).getOutput();
			aa.licenseScript.associateLpWithCap(capId, rNewLP[0]);
			copyASIFields(capId, childCapId);
			var recordApplicant = getContactByType("Applicant", capId);
			if (recordApplicant) {
				applicantEmail = recordApplicant.getEmail();
			}
			if (applicantEmail == null || applicantEmail == "") {
				logDebug("**WARN Applicant on record " + capId + " has no email");

			} else {

				var emailParams = aa.util.newHashtable();
				addParameter(emailParams, "$$altID$$", cap.getCapModel().getAltID());
				addParameter(emailParams, "$$recordAlias$$", cap.getCapModel().getCapType().getAlias());
				addParameter(emailParams, "$$recordStatus$$", cap.getCapModel().getCapStatus());
				addParameter(emailParams, "$$wfComment$$", wfComment);
				addParameter(emailParams, "$$wfTask$$", wfTask);
				addParameter(emailParams, "$$wfStatus$$", wfStatus);

				sendEmailWithReport(applicantEmail, "", emailTemplate, reportName, rptParams, emailParams)

			}

		}
	}
}
