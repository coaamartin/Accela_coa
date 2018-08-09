
/**
 * 
 * 
 */
function sendEmailReceipt_MJApplication(){
	
		//send email
		var applicant = getContactByType("Applicant", capId);
		if (!applicant || !applicant.getEmail()) {
			logDebug("**WARN no applicant found on or no email capId=" + capId);
			return false;
		}
        var toEmail = applicant.getEmail();
       // var emailTemplateName = "LIC MJ ADDITIONAL INFO # 210"
        var emailTemplateName = "LIC MJ STATE FEE RECEIPT"
logDebug("Email: " + toEmail);
logDebug("EmailTemplateName: " + emailTemplateName);
logDebug("Amount: " + PaymentTotalPaidAmount);
		var eParams = aa.util.newHashtable();

		//load ASi and ASIT
		var olduseAppSpecificGroupName = useAppSpecificGroupName;
		useAppSpecificGroupName = false;
		var asiValues = new Array();
		loadAppSpecific(asiValues)
		useAppSpecificGroupName = olduseAppSpecificGroupName;
        logDebug("State License Number: " + asiValues["State License Number"]);
        
        

        addParameter(eParams, "$$date$$", sysDateMMDDYYYY);
        addParameter(eParams, "$$amountPaid$$", PaymentTotalPaidAmount);
		addParameter(eParams, "$$StateLicenseNumber$$", asiValues["State License Number"]);
		addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
		addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());

		var files = new Array();
        var sent = sendNotification("noreply@aurora.gov",toEmail,"",emailTemplateName,eParams,files);
       //var sent = aa.document.sendEmailByTemplateName("", toEmail, "", emailTemplateName, eParams, files);
		if (!sent) {
			logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
			return false;
		}
	
}