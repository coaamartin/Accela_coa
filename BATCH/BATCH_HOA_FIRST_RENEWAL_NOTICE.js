/*
Title : HOA first renewal notice (BATCH)

Purpose : For each registered miscservices/neighborhood/association/NA record with ASI field 'Date Last Updated' within 30 days of equalling the system date, send a notice.

Author: Adrian Martin
 
Functional Area : Records

BATCH Parameters:
	- EMAIL_TEMPLATE | required | text
		notification template name

	- SET_NAME | optional | text
		name of set to add capIds to, 
		if SET_NAME was not provided a set name will be generated as following: 'YYYY_HOA_aboutToExpire'
		YYYY will be replaced (automatically) with current year, example:'2018_HOA_aboutToExpire'
	
Notes:
	- records that fall in criteria are records with auditStatus='A'
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
printDebug("Adrian script starting");

var SCRIPT_VERSION = 3.0;
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));

function LogBatchDebug(etype, edesc, createEventLog) {

	var msg = etype + " : " + edesc;

	if (etype == "ERROR") {
		msg = "<font color='red' size=2>" + msg + "</font><BR>"
	} else {
		msg = "<font color='green' size=2>" + msg + "</font><BR>"
	}
	if (etype == "DEBUG") {

		aa.print(msg);

	} else {
		aa.print(msg);
	}
	debug += msg;
}

//Batch Parameters:
var EMAIL_TEMPLATE = aa.env.getValue("EMAIL_TEMPLATE");
var SET_NAME = aa.env.getValue("SET_NAME");

if (SET_NAME == null || SET_NAME == "") {
	SET_NAME = aa.date.getCurrentDate().getYear() + "_HOA_aboutToExpire";
}

aa.set.createSet(SET_NAME, SET_NAME);
try {
	LogBatchDebug("DEBUG", "Start BATCH_HOA_FIRST_RENEWAL_NOTICE", false);
	LogBatchDebug("DEBUG", scriptTime, false);
	notifyRecordsForRenewal();
} catch (ex) {
	LogBatchDebug("DEBUG", "**ERROR hoa renewal batch failed, error: " + ex);	
	aa.print("**ERROR hoa renewal batch failed, error: " + ex);
}

/**
 * notify records for renewal
 */
function notifyRecordsForRenewal() {
aa.print("Adrian in notifyRecordsForRenewal function");
/*
	var capTypeModel = aa.cap.getCapTypeModel().getOutput();
	capTypeModel.setGroup("MiscServices");
	capTypeModel.setType("Neighborhood");
	capTypeModel.setSubType("Association");
	capTypeModel.setCategory("NA");

	var capModel = aa.cap.getCapModel().getOutput();
	capModel.setCapType(capTypeModel);
	var capIdScriptModelList = aa.cap.getCapIDListByCapModel(capModel).getOutput();
	aa.print("total records=" + capIdScriptModelList.length);
	for (r in capIdScriptModelList) {
		aa.print("#######################");
		var tmpCapId = capIdScriptModelList[r].getCapID()
*/		
	var expDate = aa.date.parseDate(dateAdd(null, 30));
    var expDateString = dateAdd(null, 30);
    //Process Records
    var capListResult = aa.cap.getCapIDsByAppSpecificInfoDateRange("GENERAL INFORMATION", "Date Last Updated", expDate, expDate);
    aa.print("Processing records with 'GENERAL INFORMATION.Date Last Updated' custom field = " + expDateString);
    var capList = capListResult.getOutput();
	aa.print("Adrian ready to parse capList");
    for (xx in capList) {
        var capId = capList[xx].getCapID();
		aa.print("Notifying capId=" + CapId);
		var recordCapScriptModel = aa.cap.getCap(CapId).getOutput();

		if (recordCapScriptModel.getAuditStatus() != "A") {
			aa.print("Skipping record, AuditStatus=" + recordCapScriptModel.getAuditStatus());
			continue;
		}

		notifyApplicantOrAddToSet(CapId, recordCapScriptModel);
	}//for all License caps
}

/**
 * sends email to President of record, if not found it tries the Board Member else it adds the record to a SET
 * @param recordCapId
 * @param recordCap
 */
function notifyApplicantOrAddToSet(recordCapId, recordCap) {
	aa.print("Adrian sending emails");
	var applicant = getContactByType("President", recordCapId);
	if (!applicant || applicant.getEmail() == null || applicant.getEmail() == "") 
	{
		var applicant = getContactByType("Board Member", recordCapId);
		if (!applicant || applicant.getEmail() == null || applicant.getEmail() == "")
		{
		var added = aa.set.addCapSetMember(SET_NAME, recordCapId);
		aa.print("no President or Board Member, or no email for them, record added to SET .. " + added.getSuccess());
		}
	} 
	else {
		aa.print("sending email to HOA contact: " + applicant.getEmail());
		var emailParams = aa.util.newHashtable();
		addParameter(emailParams, "$$altID$$", recordCap.getCapModel().getAltID());
		addParameter(emailParams, "$$recordAlias$$", recordCap.getCapModel().getCapType().getAlias());
		addParameter(emailParams, "$$recordStatus$$", recordCap.getCapModel().getCapStatus());
		//aa.document.sendEmailByTemplateName("", applicant.getEmail(), "", EMAIL_TEMPLATE, emailParams, new Array())
		//sendNotification("",applicant.getEmail(),"",EMAIL_TEMPLATE,emailParams,new Array()); 
		sendNotification("","amartin@auroragov.org","",EMAIL_TEMPLATE,emailParams,new Array()); 		
	}
}
