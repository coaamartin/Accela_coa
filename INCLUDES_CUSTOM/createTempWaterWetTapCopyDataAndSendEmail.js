
function createTempWaterWetTapCopyDataAndSendEmail(emailTemplate) {

// Script 401
// 7/16//18 JHS

// 07/26/2018 SLS Chad - added ignore array, copyASITables, and removed ref to sendEmailByTemplateName and replaced with sendNotification

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
		
		var igArr = ["LIST OF SUBCONTRACTORS", "PRIVATE FIRE LINE MATERIAL", "PRIVATE STORM MATERIAL", "PUBLIC STORM MATERIAL", "SANITARY SEWER MATERIAL", "WATER MATERIAL"];
		copyASITables( capId, childCapId, igArr );
		
		var recordApplicant = getContactByType("Applicant", capId);
		if (recordApplicant) {
			applicantEmail = recordApplicant.getEmail();
		}
		if (applicantEmail == null || applicantEmail == "") {
			logDebug("**WARN Applicant on record " + capId + " has no email");

		} else {
			var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
			var reportFile = [];
			acaURL = lookup("ACA_CONFIGS", "ACA_SITE");
			acaURL = acaURL.substr(0, acaURL.toUpperCase().indexOf("/ADMIN"));
			acaURL += "/urlrouting.ashx?type=1005&module=Water&capId1=" + childCapId.getID1() + "&capId2=" + childCapId.getID2() + "&capId3=" + childCapId.getID3() + "&AgencyCode=" + aa.getServiceProviderCode();
			var emailParams = aa.util.newHashtable();
			addParameter(emailParams, "$$deeplink$$", acaURL);
			addParameter(emailParams, "$$childAltID$$", childCapId.getCustomID());
			addParameter(emailParams, "$$AltID$$", capId.getCustomID());
			addParameter(emailParams, "$$asiChoice$$", AInfo["Utility Permit Type"]);
// took out ref to sendEmailByTemplateName per request on script 401 from Don Bates			
//			aa.document.sendEmailByTemplateName("", applicantEmail, "", emailTemplate, emailParams, new Array());
			var sendResult = sendNotification("noreply@aurora.gov",applicantEmail,"",emailTemplate, emailParams, reportFile, capID4Email);
			if (!sendResult) { logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
			else { logDebug("Sent Notification"); }
		}

	}

}

