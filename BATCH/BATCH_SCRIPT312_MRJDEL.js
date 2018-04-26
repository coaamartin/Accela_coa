/*
Title : Update App Status 'Delinquent' (Batch)

Purpose : If the expiration date on the record is in the past and the license has not been renewed (License status is Expired)
then update record status to 'Delinquent'

Author: Yazan Barghouth
 
Functional Area : Records

BATCH Parameters:
	- EMAIL_TEMPLATE_NAME, Optional, Text : the notification Template to use in email
		Default Value: 'LIC MJ FINAL NOTICE - DELINQUENT ACCOUNT # 312'

*/

function getScriptText(e) {
	var t = aa.getServiceProviderCode();
	if (arguments.length > 1)
		t = arguments[1];
	e = e.toUpperCase();
	var n = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var r = n.getScriptByPK(t, e, "ADMIN");
		return r.getScriptText() + ""
	} catch (i) {
		return ""
	}
}

var SCRIPT_VERSION = 3.0;
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));

var capId = null;

try {
	var emailTemplateName = aa.env.getValue("EMAIL_TEMPLATE_NAME");
	if (emailTemplateName == null || emailTemplateName == "") {
		emailTemplateName = "LIC MJ FINAL NOTICE - DELINQUENT ACCOUNT # 312";
	}
	checkExpiredUpdateAppStatus("Delinquent", emailTemplateName);
} catch (ex) {
	logDebug("**ERROR batch failed, error: " + ex);
}

/**
 * if license is expired, update record status
 */
function checkExpiredUpdateAppStatus(newAppStatus, emailTemplateName) {
	var capTypeModel = aa.cap.getCapTypeModel().getOutput();
	capTypeModel.setGroup("Licenses");
	capTypeModel.setType("Marijuana");
	capTypeModel.setSubType(null);
	capTypeModel.setCategory("License");

	var capModel = aa.cap.getCapModel().getOutput();
	capModel.setCapType(capTypeModel);
	var capIdScriptModelList = aa.cap.getCapIDListByCapModel(capModel).getOutput();
	logDebug("**INFO Total records=" + capIdScriptModelList.length);

	for (r in capIdScriptModelList) {
		capId = capIdScriptModelList[r].getCapID();
		logDebug("**INFO -------- capID=" + capId);
		var thisCap = aa.cap.getCap(capId).getOutput();

		//skip if not expired, or already updated
		if (!isReadyRenew(capId) || thisCap.getCapModel().getCapStatus() == newAppStatus) {
			continue;
		}
		thisCap.getCapModel().setCapStatus(newAppStatus);
		var edit = aa.cap.editCapByPK(thisCap.getCapModel());
		if (!edit.getSuccess()) {
			logDebug("**WARN Update app status failed, error:" + edit.getErrorMessage());
		}

		//Send the email
		var applicant = getContactByType("Applicant", capId);
		if (!applicant || applicant.getEmail() == null || applicant.getEmail() == "") {
			logDebug("**WARN no Applicant on cap, or no valid email " + capId);
			continue;
		}
		var eParams = aa.util.newHashtable();
		addParameter(eParams, "$$altID$$", thisCap.getCapModel().getAltID());
		addParameter(eParams, "$$recordAlias$$", thisCap.getCapType().getAlias());
		addParameter(eParams, "$$recordStatus$$", thisCap.getCapStatus());
		var sent = aa.document.sendEmailByTemplateName("", applicant.getEmail(), "", emailTemplateName, eParams, null);
		if (!sent.getSuccess()) {
			logDebug("**ERROR sending email to " + applicant.getEmail() + " failed, error:" + sent.getErrorMessage());
		}

		logDebug("#######################");
	}//for all caps
}