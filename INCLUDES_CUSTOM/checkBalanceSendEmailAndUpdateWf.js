
/**
 * 
 * @param emailTemplateName
 * @param wfTaskFees
 * @param wfStatusFees
 * @param wfTaskClose
 * @param wfStatusClose
 * @param newAppStatus
 * @returns {Boolean}
 */
function checkBalanceSendEmailAndUpdateWf(emailTemplateName, wfTaskFees, wfStatusFees, wfTaskClose, wfStatusClose, newAppStatus) {
	if (balanceDue == 0) {
		//process WF tasks
		closeTask(wfTaskFees, wfStatusFees, "by script, PRA balance=0", "by script, PRA balance=0");
		closeTask(wfTaskClose, wfStatusClose, "by script, PRA balance=0", "by script, PRA balance=0");

		//Update app Status:
		updateAppStatus(newAppStatus, "by script, PRA balance=0");

		//send email
		var applicant = getContactByType("Applicant", capId);
		if (!applicant || !applicant.getEmail()) {
			logDebug("**WARN no applicant found on or no email capId=" + capId);
			return false;
		}
		var toEmail = applicant.getEmail();

		var eParams = aa.util.newHashtable();

		//load ASi and ASIT
		var olduseAppSpecificGroupName = useAppSpecificGroupName;
		useAppSpecificGroupName = false;
		var asiValues = new Array();
		var asitSize = loadASITable("SIZE");
		loadAppSpecific(asiValues)
		useAppSpecificGroupName = olduseAppSpecificGroupName;

		var sizes = new Array();
		for (c in asitSize) {
			var size = asitSize[c]["Size"].fieldValue;
			sizes.push(size)
		}

		addParameter(eParams, "$$size$$", sizes.toString());
		addParameter(eParams, "$$amountPaid$$", PaymentTotalPaidAmount);
		addParameter(eParams, "$$utilityPermitNumber$$", asiValues["Utility Permit Number"]);
		addParameter(eParams, "$$civilPlanNumber$$", asiValues["Civil Plan Number"]);

		addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
		addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());

		var reportFile = [];
		var sent = sendNotification("noreply@aurora.gov",toEmail,"",emailTemplateName,eParams,reportFile);
		if (!sent) {
			logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
			return false;
		}
		return true;
	}
	return false;
}