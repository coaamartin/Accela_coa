//created by swakil

autoCreateTempIrrigationPermit("Plan Review", [ "Approved" ], "Water/Water/Lawn Irrigation/Permit", "WAT_IRR_PLAN_RESUB");

function autoCreateTempIrrigationPermit(wfTaskName, workflowStatusArray, appTypeStr, emailTemplate) {
	if (wfTask == wfTaskName) {
		var statusMatch = false;
		for (s in workflowStatusArray) {
			if (wfStatus == workflowStatusArray[s]) {
				statusMatch = true;
				break;
			}
		}

		if (!statusMatch) {
			return false;
		}

		var cTypeArray = appTypeStr.split("/");
		var ctm = aa.proxyInvoker.newInstance("com.accela.aa.aamain.cap.CapTypeModel").getOutput();
		var fullName = "";
		ctm.setGroup(cTypeArray[0]);
		ctm.setType(cTypeArray[1]);
		ctm.setSubType(cTypeArray[2]);
		ctm.setCategory(cTypeArray[3]);
		createChildResult = aa.cap.createSimplePartialRecord(ctm, cap.getSpecialText(), "INCOMPLETE EST");

		if (createChildResult.getSuccess()) {
			createChildResult = createChildResult.getOutput();
			var appHierarchy = aa.cap.createAppHierarchy(capId, createChildResult);
			copyAddresses(capId, createChildResult);
			copyParcels(capId, createChildResult);
			copyOwner(capId, createChildResult);
			copyContacts(capId, createChildResult);

   		   //get contact
		   var aContact = getContactByType("Applicant", capId);
		   if (aContact) fullName = aContact.getFullName() || aContact.getFirstName() + " " + aContact.getLastName();

			var eParams = aa.util.newHashtable();
			addParameter(eParams, "$$altid$$", cap.getCapModel().getAltID());
			addParameter(eParams, "$$capAlias$$", cap.getCapType().getAlias());
			addParameter(eParams, "$$FullName$$", cap.getCapStatus());
			addParameter(eParams, "$$wfComment$$", wfComment);
			addParameter(eParams, "$$todayDate$$", sysDateMMDDYYYY);
		
			var sent = emailContacts("Applicant", emailTemplate, eParams, "", "", "N", "");		

		} else {
			logDebug("**ERROR create record failed, error:" + createChildResult.getErrorMessage());
			return false;
		}
	} else {
		return false;
	}
	return true;
}
