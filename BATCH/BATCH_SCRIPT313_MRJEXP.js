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
eval(getScriptText("INCLUDES_CUSTOM"));
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
		capIDString = aa.cap.getCapID(capId.getID1(), capId.getID2(), capId.getID3()).getOutput().getCustomID()
		logDebug2("<Font Color=BLUE> <br> Processing record " + capIDString + "<Font Color=BLACK>");

		var expResult = aa.expiration.getLicensesByCapID(capId);
		if (!expResult.getSuccess()) {
			logDebug2("<br>****WARN failed to get expiration of capId " + capIDString);
			continue;
		}
		expResult = expResult.getOutput();

		var thisCap = null;
		
		//check if delinquent record is outside 7-day grace period
		var expSince = dateDiff(expResult.getExpDate(), new Date());
		if (expSince > expiredSinceDays) {
			var renewalCapIDString = null;
			var renewalCapID = getRenewalByParentCapIDForPending(capId);
			if (renewalCapID) {
				renewalCapIDString = aa.cap.getCapID(renewalCapID.getID1(), renewalCapID.getID2(), renewalCapID.getID3()).getOutput().getCustomID();
			}
			
			logDebug2("<br>Checking for incomplete renewals... ");
			
			//check for incomplete renewals, assess late fee
			if (renewalCapIDString) {
				logDebug2("<br>Found incomplete renewal on license. Record ID: " + renewalCapIDString);
				if (assessMJLateFee(renewalCapID)) {
					logDebug2("<br>Assessed late fee on Renewal Record ID " + renewalCapIDString);
				}
			} else {
				logDebug2("No renewals found.");
			}
			
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

			var applicant = false;
			applicant = getContactByType("Applicant", capId);
			if (!applicant || !applicant.getEmail()) {
				logDebug2("<br>**WARN no applicant found or no email capId=" + capIDString);
				continue;
			}

			var eParams = aa.util.newHashtable();
			addParameter(eParams, "$$altID$$", thisCap.getCapModel().getAltID());
			addParameter(eParams, "$$recordAlias$$", thisCap.getCapType().getAlias());
			addParameter(eParams, "$$recordStatus$$", thisCap.getCapStatus());

			emailContactsWithReportLinkASync("Applicant", emailTemplate, eParams, "", "", "N", "");
			//var sent = aa.document.sendEmailByTemplateName("", applicant.getEmail(), "", emailTemplate, eParams, null);
			//if (!sent.getSuccess()) {
			//	logDebug2("<br>**WARN sending email to (" + applicant.getEmail() + ") failed, error:" + sent.getErrorMessage());
			//}
		} else {
			logDebug2("<br> Skipping record; still within 7-day grace period");
		}
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

function getRenewalByParentCapIDForPending(parentCapid) {	
	if (parentCapid == null || aa.util.instanceOfString(parentCapid)) {
		return null;
	}
	
	//1. Get parent license for analysis
	var result = aa.cap.getProjectByMasterID(parentCapid, "Renewal", "Incomplete");	
	if (result.getSuccess()) {
		projectScriptModels = result.getOutput();
		if (projectScriptModels == null || projectScriptModels.length == 0) {
			return null;
		}
		//2. return number of completed renewals
		 for (i in projectScriptModels) {
			renewalCapID = projectScriptModels[i].getCapID();
		 }
		return renewalCapID;
	} else {
		return null;
	}
}

function assessMJLateFee(renewalCapID) {
	if (appMatch("Licenses/Marijuana/Retail Cultivation/Renewal", renewalCapID)) {
		addFee("LIC_MJRC_03", "LIC_MJ_RC", "FINAL", 1, "Y", renewalCapID);
		return true;
	} else if (appMatch("Licenses/Marijuana/Retail Product Manufacturer/Renewal", renewalCapID)) {
		addFee("LIC_MJRPM_03", "LIC_MJ_RPM", "FINAL", 1, "Y", renewalCapID);
		return true;
	} else if (appMatch("Licenses/Marijuana/Retail Store/Renewal", renewalCapID)) {
		addFee("LIC_MJST_02", "LIC_MJ_STORE", "FINAL", 1, "Y", renewalCapID);	
		return true;
	} else if (appMatch("Licenses/Marijuana/Retail Transporter/Renewal", renewalCapID)) {
		addFee("LIC_MJTR_03", "LIC_MJ_TRANS", "FINAL", 1, "Y", renewalCapID);	
		return true;
	} else if (appMatch("Licenses/Marijuana/Testing Facility/Renewal", renewalCapID)) {
		addFee("LIC_MJTST_03", "LIC_MJ_TEST", "FINAL", 1, "Y", renewalCapID);	
		return true;
	} else {
		logDebug2("<br>Invalid renewal record type");
		return false;
	}	
}