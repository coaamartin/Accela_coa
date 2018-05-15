/*
Title : Certificate of Insurance Expiration Notification (Batch)

Purpose : If the custom field “Certificate of Insurance Expiration Date” is 60 days away then send an email
notification(Email template to be provided by Aurora) to the owner and the Insurance Agency contact on the record letting
them know they need to upload a new Certificate of Insurance.

Author: Yazan Barghouth
 
Functional Area : Records

BATCH Parameters:
	- EMAIL_TEMPLATE (Required): template to be used to send email
	- DAYS_AHEAD (Optional): value to check if n days away, if not set, default 60

Notes:
	- Email to Owner, CC Insurance Agency
	- Email Variables: $$altID$$,$$recordAlias$$,$$recordStatus$$
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
	var emailTemplateName = aa.env.getValue("EMAIL_TEMPLATE");
	if (!emailTemplateName || emailTemplateName == null || emailTemplateName == "") {
		logDebug("**ERROR Parameter 'EMAIL_TEMPLATE' not defined");
	} else {

		var daysAhead = aa.env.getValue("DAYS_AHEAD");
		if (!daysAhead) {
			daysAhead = 60;
		}
		sendCertificateofInsuranceExpirationNotification(emailTemplateName, daysAhead, "Certificate of Insurance Expiration Date");
	}
} catch (ex) {
	logDebug("**ERROR batch failed, error: " + ex);
}

/**
 * sends email to Owner and 'Insurance Agency' contact if asiField value is n days away
 * @param emailTemplateName
 * @param daysAhead
 * @param asiFieldName to get Date value and compare with
 */
function sendCertificateofInsuranceExpirationNotification(emailTemplateName, daysAhead, asiFieldName) {
	var capTypeModel = aa.cap.getCapTypeModel().getOutput();
	capTypeModel.setGroup("PublicWorks");
	capTypeModel.setType("Real Property");
	capTypeModel.setSubType("License Agreement");
	capTypeModel.setCategory("NA");

	var capModel = aa.cap.getCapModel().getOutput();
	capModel.setCapType(capTypeModel);
	var capIdScriptModelList = aa.cap.getCapIDListByCapModel(capModel).getOutput();
	logDebug("**INFO total records=" + capIdScriptModelList.length);
	var olduseAppSpecificGroupName = useAppSpecificGroupName;
	useAppSpecificGroupName = false;
	for (r in capIdScriptModelList) {
		capId = capIdScriptModelList[r].getCapID();
		logDebug("**INFO -------------- " + capId);
		var certInsExpDate = getAppSpecific(asiFieldName);
		if (certInsExpDate == null || certInsExpDate == "") {
			logDebug("**WARN 'Certificate of Insurance Expiration Date' is null, SKIP...");
			continue;
		}

		var expDiff = dateDiff(new Date(), certInsExpDate);
		expDiff = parseInt(expDiff);
		if (expDiff == daysAhead) {
			var owners = aa.owner.getOwnerByCapId(capId);
			if (!owners.getSuccess() || owners.getOutput() == null || owners.getOutput().length == 0) {
				logDebug("**WARN no owners found, SKIP...");
				continue;
			}
			owners = owners.getOutput();
			owners = owners[0];
			var cc = getContactByType("Insurance Agency", capId);
			if (!cc) {
				cc = "";
			} else {
				cc = cc.getEmail();
			}
			var thisCap = aa.cap.getCap(capId).getOutput();
			var eParams = aa.util.newHashtable();
			addParameter(eParams, "$$altID$$", thisCap.getCapModel().getAltID());
			addParameter(eParams, "$$recordAlias$$", thisCap.getCapType().getAlias());
			addParameter(eParams, "$$recordStatus$$", thisCap.getCapStatus());

			var sent = aa.document.sendEmailByTemplateName("", owners.getEmail(), cc, EMAIL_TEMPLATE, eParams, null); 
			if (!sent.getSuccess()) {
				logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
			}
		}//60 days
	}//for all caps
	useAppSpecificGroupName = olduseAppSpecificGroupName;
}