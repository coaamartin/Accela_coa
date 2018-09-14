/*
Title : Update App Status 'Expired' (Batch)

Purpose : If the expiration date on the record is in the past and the license has not been renewed (License status is Expired)
then update record status to 'Delinquent'

Author: Yazan Barghouth
 
Functional Area : Records

BATCH Parameters: 
	- EMAIL_TEMPLATE_NAME / Optional , if not set, send email functionality will be disabled

Notes:
	supported email variables: $$altID$$, $$recordAlias$$, $$recordStatus$$
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
var emailText = "";		
var capId = null;
var emailTemplate = "LIC MJ INACTIVE LICENSE # 313";
showDebug = true;

checkExpiredUpdateAppStatus("Delinquent", 7, "Expired", emailTemplate);

/**
 * if license is app has a certain status, and record is expired for certain number of days, update record status and email Applicant
 * @param currentAppStatus app must have this status
 * @param expiredSinceDays expired since
 * @param newAppStatus if app matched, set this status
 * @param emailTemplate used to send email
 */
function checkExpiredUpdateAppStatus(currentAppStatus, expiredSinceDays, newAppStatus, emailTemplate) {

	var capTypeModel = aa.cap.getCapTypeModel().getOutput();
	capTypeModel.setGroup("Licenses");
	capTypeModel.setType("Marijuana");
	capTypeModel.setSubType(null);
	capTypeModel.setCategory("License");

	var capModel = aa.cap.getCapModel().getOutput();
	capModel.setCapType(capTypeModel);
	capModel.setCapStatus(currentAppStatus);

	var capIdScriptModelList = aa.cap.getCapIDListByCapModel(capModel).getOutput();
	logDebug2("<br><Font Color=RED> Processing " + capIdScriptModelList.length + " " + currentAppStatus + " records <br>");
	
	for (r in capIdScriptModelList) {
		capId = capIdScriptModelList[r].getCapID();
		logDebug2("<Font Color=BLUE> <br> Processing record " + capId + "<Font Color=BLACK>");

		var expResult = aa.expiration.getLicensesByCapID(capId);
		if (!expResult.getSuccess()) {
			logDebug2("<br>****WARN failed to get expiration of capId " + capId);
			continue;
		}
		expResult = expResult.getOutput();

		var thisCap = null;
		
		//new Date() is 2nd param --> result is positive number, more common to compare > expiredSinceDays
		var expSince = dateDiff(expResult.getExpDate(), new Date());
		if (expSince > expiredSinceDays) {
			thisCap = aa.cap.getCap(capId).getOutput();

			thisCap.getCapModel().setCapStatus(newAppStatus);
			var edit = aa.cap.editCapByPK(thisCap.getCapModel());
			if (!edit.getSuccess()) {
				logDebug2("<br>**WARN Update app status failed, error:" + edit.getErrorMessage());
			} else {
				logDebug2("<br>Successfully updated record status to " + newAppStatus);
			}

			if (!emailTemplate || emailTemplate == null || emailTemplate == "") {
				logDebug2("<br>**WARN EMAIL_TEMPLATE_NAME parameter not set, batch will skip sending email");
				continue;
			}

			var applicant = getContactByType("Applicant", capId);
			applicant = false;
			if (!applicant || !applicant.getEmail()) {
				logDebug2("<br>**WARN no applicant found or no email capId=" + capId);
				continue;
			}

			var eParams = aa.util.newHashtable();
			addParameter(eParams, "$$altID$$", thisCap.getCapModel().getAltID());
			addParameter(eParams, "$$recordAlias$$", thisCap.getCapType().getAlias());
			addParameter(eParams, "$$recordStatus$$", thisCap.getCapStatus());

			var sent = aa.document.sendEmailByTemplateName("", applicant.getEmail(), "", emailTemplate, eParams, null);
			if (!sent.getSuccess()) {
				logDebug2("<br>**WARN sending email to (" + applicant.getEmail() + ") failed, error:" + sent.getErrorMessage());
			}
		} else {
			logDebug2("<br> Skipping record, still within 7 day grace period");
		logDebug2("<br>#######################");
	}//for all caps
}

function logDebug2(dstr) {
	
	// function of the same name in ACCELA_FUNCTIONS creates multi lines in the Batch debug log. Use this one instead
	if(showDebug) {
		aa.print(dstr)
		emailText+= dstr + "<br>";
		aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"),dstr)
	}
}
