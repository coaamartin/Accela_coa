/*
Title : Arborist License About to Expire Renewal Notice (BATCH)

Purpose : On December 1st each year for License/Contractor/Arborist/License records send about to expire renewal
notice for all Active Arborist licenses with email to applicant contact. Add all the license records that do NOT have an email
address for the applicant to a new SET so the Aurora staff can run the renewal report for anyone that will not use email addresses.

Author: Yazan Barghouth
 
Functional Area : Records

BATCH Parameters:
	- EMAIL_TEMPLATE | required | text
		notification template name

	- SET_NAME | optional | text
		name of set to add capIds to, 
		if SET_NAME was not provided a set name will be generated as following: 'YYYY_Arborists_aboutToExpire'
		YYYY will be replaced (automatically) with current year, example:'2018_Arborists_aboutToExpir'
	
Notes:
	- records that falls in criteria are records with auditStatus='A'
	- module name is Licenses not License
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

//Batch Parameters:
var EMAIL_TEMPLATE = aa.env.getValue("EMAIL_TEMPLATE");
var SET_NAME = aa.env.getValue("SET_NAME");

if (SET_NAME == null || SET_NAME == "") {
	SET_NAME = aa.date.getCurrentDate().getYear() + "_Arborists_aboutToExpire";
}

aa.set.createSet(SET_NAME, SET_NAME);
try {
	notifyRecordsForRenewal();
} catch (ex) {
	logDebug("**ERROR batch failed, error: " + ex);
}

/**
 * notify records for renewal
 */
function notifyRecordsForRenewal() {
	var capTypeModel = aa.cap.getCapTypeModel().getOutput();
	capTypeModel.setGroup("Licenses");
	capTypeModel.setType("Contractor");
	capTypeModel.setSubType("Arborist");
	capTypeModel.setCategory("License");

	var capModel = aa.cap.getCapModel().getOutput();
	capModel.setCapType(capTypeModel);
	var capIdScriptModelList = aa.cap.getCapIDListByCapModel(capModel).getOutput();
	logDebug("total records=" + capIdScriptModelList.length);
	for (r in capIdScriptModelList) {
		logDebug("#######################");
		var tmpCapId = capIdScriptModelList[r].getCapID()
		logDebug("Notifying capId=" + tmpCapId);
		var recordCapScriptModel = aa.cap.getCap(tmpCapId).getOutput();

		if (recordCapScriptModel.getAuditStatus() != "A") {
			logDebug("Skipping record, AuditStatus=" + recordCapScriptModel.getAuditStatus());
			continue;
		}

		notifyApplicantOrAddToSet(tmpCapId, recordCapScriptModel);
	}//for all License caps
}

/**
 * sends email to Applicant of record, if not found, it adds the record to a SET
 * @param recordCapId
 * @param recordCap
 */
function notifyApplicantOrAddToSet(recordCapId, recordCap) {
	var applicant = getContactByType("Arborist Applicant", recordCapId);
	if (!applicant || applicant.getEmail() == null || applicant.getEmail() == "") {
		var added = aa.set.addCapSetMember(SET_NAME, recordCapId);
		logDebug("no applicant or no email for applicant, record added to SET .. " + added.getSuccess());
	} else {
		logDebug("sending email to Applicant: " + applicant.getEmail());
		var emailParams = aa.util.newHashtable();
		addParameter(emailParams, "$$altID$$", recordCap.getCapModel().getAltID());
		addParameter(emailParams, "$$recordAlias$$", recordCap.getCapModel().getCapType().getAlias());
		addParameter(emailParams, "$$recordStatus$$", recordCap.getCapModel().getCapStatus());
		aa.document.sendEmailByTemplateName("", applicant.getEmail(), "", EMAIL_TEMPLATE, emailParams, new Array())
	}
}
