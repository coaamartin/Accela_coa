/*
Title : Arborist License About to Expire Final Renewal Notice (BATCH)

Purpose : On January 30th each year for License/Contractor/Arborist/License records that do not have renewal
completed or pending within the last 3 months then send about to expire final renewal notice for all Active Arborist licenses
with email to applicant contact. Add all the license records that do NOT have an email address for the applicant to a new
SET so the Aurora staff can run the renewal report for anyone that will not use email addresses.

Author: Yazan Barghouth
 
Functional Area : Records

BATCH Parameters:
	- EMAIL_TEMPLATE | required | text
		notification template name

	- RENEW_STARTED_WITHIN_DAYS | optional | number
		max days since renewal record was started (default is 90)
		
	- SET_NAME | optional | text
		name of set to add capIds to, 
		if SET_NAME was not provided a set name will be generated as following: 'YYYY_ArboristsLicense_noRenewal'
		YYYY will be replaced (automatically) with current year, example:'2018_ArboristsLicense_noRenewal'
	
Notes:
	- Valid Renewal record should be:
		auditStatus='A', isComplete=true, capStatus one of ACCEPTED_STATUSES array, cap.fileDate < WITHIN_DAYS
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
var RENEW_STARTED_WITHIN_DAYS = aa.env.getValue("RENEW_STARTED_WITHIN_DAYS");

if (SET_NAME == null || SET_NAME == "") {
	SET_NAME = aa.date.getCurrentDate().getYear() + "_ArboristsLicense_noRenewal";
}
if (RENEW_STARTED_WITHIN_DAYS == null || RENEW_STARTED_WITHIN_DAYS == "") {
	RENEW_STARTED_WITHIN_DAYS = 90;
}

//statues for renewal record to be considered valid (represents Completed or Pending)
var ACCEPTED_STATUSES = [ "Fees Paid", "In Progress", "Additonal Info Needed", "Approved for Renewal", "Renewed" ];

aa.set.createSet(SET_NAME, SET_NAME);
try {
	checkRecordsForRenewal();
} catch (ex) {
	logDebug("**ERROR batch failed, error: " + ex);
}

/**
 * check if records have a valid renewal records
 */
function checkRecordsForRenewal() {
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
		logDebug("Checking capId=" + tmpCapId);

		var recordCapScriptModel = aa.cap.getCap(tmpCapId).getOutput();
		if (recordCapScriptModel.getAuditStatus() != "A") {
			logDebug("Skipping record, AuditStatus=" + recordCapScriptModel.getAuditStatus());
			continue;
		}

		var children = getChildren("Licenses/Contractor/Arborist/Renewal", tmpCapId);
		if (children == null || children.length == 0) {
			notifyApplicantOrAddToSet(tmpCapId, recordCapScriptModel);
		} else {
			logDebug("Checking children ...");
			var validChild = false;
			for (c in children) {
				var childCapScriptModel = aa.cap.getCap(children[c]).getOutput();
				var fileDate = convertDate(childCapScriptModel.getFileDate());
				var now = convertDate(new Date());
				var diff = dateDiff(fileDate, now);

				var capStatus = childCapScriptModel.getCapStatus();
				if (capStatus == null) {
					capStatus = "";
				}
				var isCompleted = childCapScriptModel.isCompleteCap();
				logDebug("isCompleteCap=" + isCompleted + " /// dateDiff=" + diff + " /// capStatus=" + capStatus);
				if (isCompleted && diff <= RENEW_STARTED_WITHIN_DAYS && isAcceptedStatus(capStatus)) {
					logDebug("has a valid child... PASSED");
					validChild = true;
					break;
				}
			}//for all children

			//all children are (not completed, not pending)
			if (!validChild) {
				notifyApplicantOrAddToSet(tmpCapId, recordCapScriptModel);
			}

		}//has Children
	}//for all License caps
}

/**
 * sends email to Applicant of record, if not found, it adds the record to a SET
 * @param recordCapId
 * @param recordCap
 */
function notifyApplicantOrAddToSet(recordCapId, recordCap) {
	var applicant = getContactByType("Applicant", recordCapId);
	if (!applicant || applicant.getEmail() == null || applicant.getEmail() == "") {
		var added = aa.set.addCapSetMember(SET_NAME, recordCapId);
		logDebug("no applicant or no email for applicant, record added to SET .. " + added.getSuccess());
	} else {
		logDebug("sending email to Applicant: " + applicant.getEmail());
		var emailParams = aa.util.newHashtable();
		addParameter(emailParams, "$$altID$$", recordCap.getCapModel().getAltID());
		addParameter(emailParams, "$$recordAlias$$", recordCap.getCapModel().getCapType().getAlias());
		addParameter(emailParams, "$$recordStatus$$", recordCap.getCapModel().getCapStatus());
		//aa.document.sendEmailByTemplateName("", applicant.getEmail(), "", EMAIL_TEMPLATE, emailParams, new Array())
		sendNotification("",applicant.getEmail(),"",EMAIL_TEMPLATE,emailParams,new Array()); 
	}
}

/**
 * validate if the status is one of the ACCEPTED_STATUSES
 * @param status
 * @returns {Boolean}
 */
function isAcceptedStatus(status) {
	for (a in ACCEPTED_STATUSES) {
		if (status.equalsIgnoreCase(ACCEPTED_STATUSES[a]))
			return true;
	}
	return false;
}