function createTempWaterWetTapCopyDataAndSendEmail(emailTemplate) {

// Script 401
// 7/16//18 JHS

	var applicantEmail = "";
	var newTempRecordType = ["Water", "Water", "Wet Tap", "Application"];
	//create temp record:

	var ctm = aa.proxyInvoker.newInstance("com.accela.aa.aamain.cap.CapTypeModel").getOutput();
	ctm.setGroup(newTempRecordType[0]);
	ctm.setType(newTempRecordType[1]);
	ctm.setSubType(newTempRecordType[2]);
	ctm.setCategory(newTempRecordType[3]);
	createChildResult = aa.cap.createSimplePartialRecord(ctm, "", "INCOMPLETE EST");
	if (createChildResult.getSuccess()) {
		childCapId = createChildResult.getOutput();
		aa.cap.createAppHierarchy(capId, childCapId);
	}

	if (childCapId != null) {
		var rNewLicIdString = childCapId.getCustomID();
		copyAddress(capId, childCapId);
		copyParcels(capId, childCapId);
		copyOwner(capId, childCapId);
		copyContacts3_0(capId, childCapId);
		copyDetailedDescription(capId,childCapId);
		var recordApplicant = getContactByType("Applicant", capId);
		if (recordApplicant) {
			applicantEmail = recordApplicant.getEmail();
		}
		if (applicantEmail == null || applicantEmail == "") {
			logDebug("**WARN Applicant on record " + capId + " has no email");

		} else {
			acaURL = lookup("ACA_CONFIGS", "ACA_SITE");
			acaURL = acaURL.substr(0, acaURL.toUpperCase().indexOf("/ADMIN"));
			acaURL += "/urlrouting.ashx?type=1005&module=Water&capId1=" + childCapId.getID1() + "&capId2=" + childCapId.getID2() + "&capId3=" + childCapId.getID3() + "&AgencyCode=" + aa.getServiceProviderCode();
			var emailParams = aa.util.newHashtable();
			addParameter(emailParams, "$$deeplink$$", acaURL);
			addParameter(emailParams, "$$childAltID$$", childCapId.getCustomID());
			addParameter(emailParams, "$$AltID$$", capId.getCustomID());
			addParameter(emailParams, "$$asiChoice$$", AInfo["Utility Permit Type"]);
			aa.document.sendEmailByTemplateName("", applicantEmail, "", emailTemplate, emailParams, new Array());
		}

	}

}

