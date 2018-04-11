
function sendEmail(emailTemplate) {
    //Get the Applicant
    var recordApplicant = getContactByType("Applicant", capId);

    if (!recordApplicant || recordApplicant.getEmail() == null || recordApplicant.getEmail() == "") {
        logDebug("**WARN no applicant or applicant has no email, capId=" + capId);
    } else {
        applicantEmail = recordApplicant.getEmail();
        var files = new Array();
        var eParams = aa.util.newHashtable();
        addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
        addParameter(eParams, "$$recordAlias$$", cap.getCapModel().getCapType().getAlias());
        addParameter(eParams, "$$recordStatus$$", cap.getCapModel().getCapStatus());
        addParameter(eParams, "$$balance$$", feeBalance(""));
        addParameter(eParams, "$$PaymentDate$$", PaymentDate);
        addParameter(eParams, "$$PaymentTotalPaidAmount$$", PaymentTotalPaidAmount);
        addParameter(eParams, "$$balanceDue$$", balanceDue);
        var sent = aa.document.sendEmailByTemplateName("", applicantEmail, "", emailTemplate, eParams, files);
        if (!sent.getSuccess()) {
            logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
        }
    }
}