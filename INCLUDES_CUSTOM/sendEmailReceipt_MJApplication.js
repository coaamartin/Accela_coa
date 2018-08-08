
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
function sendEmailReceipt_MJApplication(emailTemplateName) {
	
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
		loadAppSpecific(asiValues)
		useAppSpecificGroupName = olduseAppSpecificGroupName;


        addParameter(eParams, "$$date$$", sysDateMMDDYYYY);
        addParameter(eParams, "$$amountPaid$$", PaymentTotalPaidAmount);
		addParameter(eParams, "$$StateLicenseNumber$$", asiValues["State License Number"]);
		addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
		addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());

		var reportFile = [];
		var sent = sendNotification("noreply@aurora.gov",toEmail,"",emailTemplateName,eParams,reportFile);
		if (!sent) {
			logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
			return false;
		}
	
}