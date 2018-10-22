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
aa.print("Adrian script starting");

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

var SET_NAME = aa.env.getValue("SET_NAME");

if (SET_NAME == null || SET_NAME == "") {
	SET_NAME = aa.date.getCurrentDate().getYear() + "_HOA_aboutToExpire";
}

aa.set.createSet(SET_NAME, SET_NAME);
try {
	LogBatchDebug("DEBUG", "Start BATCH_HOA_FIRST_RENEWAL_NOTICE", false);
	notifyRecordsForRenewal();	//this one is set up for testing - it grabs all going back a year
	//notifyRecordsForRenewal30();
	//notifyRecordsForRenewal15();
	//notifyRecordsForRenewal5();	
} catch (ex) {
	LogBatchDebug("DEBUG", "**ERROR hoa renewal batch failed, error: " + ex);	
	aa.print("**ERROR hoa renewal batch failed, error: " + ex);
}

/**
 * notify records for renewal
 */
 function notifyRecordsForRenewal() {
	var expDate = aa.date.parseDate(dateAdd(null, 1));
	var expDate2 = aa.date.parseDate(dateAdd(null, -365));
    var expDateString = dateAdd(null, 0);
    //Process Records
    var capListResult = aa.cap.getCapIDsByAppSpecificInfoDateRange("GENERAL INFORMATION", "Date Last Updated", expDate2, expDate);
    aa.print("Processing records with 'GENERAL INFORMATION.Date Last Updated' custom field = " + expDateString);
    var capList = capListResult.getOutput();
	aa.print("Check that HOA in Registered and Expired Status");
    for (xx in capList) {
        var capId = capList[xx].getCapID();
        var cap = aa.cap.getCap(capId).getOutput();
        var appTypeString = cap.getCapType().toString();
        var appTypeAlias = cap.getCapType().getAlias();
		//aa.print("type is " + appTypeString);
        var capStatus = cap.getCapStatus();
        if(capStatus == "Registered and Expired" && appTypeString == "MiscServices/Neighborhood/Association/Renewal") {
			aa.print("Status is: " + capStatus);
			aa.print("Notifying capId=" + capId);
			var recordCapScriptModel = aa.cap.getCap(capId).getOutput();
			notifyApplicantOrAddToSet(capId, recordCapScriptModel);					
		}

	}
}

function notifyRecordsForRenewal30() {
	var expDate = aa.date.parseDate(dateAdd(null, -335));
    var expDateString = dateAdd(null, -335);
    //Process Records
    var capListResult = aa.cap.getCapIDsByAppSpecificInfoDateRange("GENERAL INFORMATION", "Date Last Updated", expDate, expDate);
    aa.print("Processing records with 'GENERAL INFORMATION.Date Last Updated' custom field = " + expDateString);
    var capList = capListResult.getOutput();
	aa.print("Check that HOA in Registered and Expired Status");
    for (xx in capList) {
        var capId = capList[xx].getCapID();
        var cap = aa.cap.getCap(capId).getOutput();
        var appTypeString = cap.getCapType().toString();
        var appTypeAlias = cap.getCapType().getAlias();
        var capStatus = cap.getCapStatus();
        if(capStatus = "Registered and Expired") {
			aa.print("Status is: " + capStatus);
			aa.print("Notifying capId=" + capId);
			var recordCapScriptModel = aa.cap.getCap(capId).getOutput();

			if (recordCapScriptModel.getAuditStatus() != "A") {
				aa.print("Skipping record, AuditStatus=" + recordCapScriptModel.getAuditStatus());
			continue;
			}
		}

		notifyApplicantOrAddToSet(capId, recordCapScriptModel);
	}
}

function notifyRecordsForRenewal15() {
	var expDate = aa.date.parseDate(dateAdd(null, -350));
    var expDateString = dateAdd(null, -350);
    //Process Records
    var capListResult = aa.cap.getCapIDsByAppSpecificInfoDateRange("GENERAL INFORMATION", "Date Last Updated", expDate, expDate);
    aa.print("Processing records with 'GENERAL INFORMATION.Date Last Updated' custom field = " + expDateString);
    var capList = capListResult.getOutput();
	aa.print("Adrian ready to parse capList");
    for (xx in capList) {
        var capId = capList[xx].getCapID();
        var cap = aa.cap.getCap(capId).getOutput();
        var appTypeString = cap.getCapType().toString();
        var appTypeAlias = cap.getCapType().getAlias();
        var capStatus = cap.getCapStatus();
        if(capStatus = "Registered and Expired") {
			aa.print("Status is: " + capStatus);
			aa.print("Notifying capId=" + capId);
			var recordCapScriptModel = aa.cap.getCap(capId).getOutput();

			if (recordCapScriptModel.getAuditStatus() != "A") {
				aa.print("Skipping record, AuditStatus=" + recordCapScriptModel.getAuditStatus());
			continue;
			}
		}

		notifyApplicantOrAddToSet(capId, recordCapScriptModel);
	}
}

function notifyRecordsForRenewal5() {
	var expDate = aa.date.parseDate(dateAdd(null, -360));
    var expDateString = dateAdd(null, -360);
    //Process Records
    var capListResult = aa.cap.getCapIDsByAppSpecificInfoDateRange("GENERAL INFORMATION", "Date Last Updated", expDate, expDate);
    aa.print("Processing records with 'GENERAL INFORMATION.Date Last Updated' custom field = " + expDateString);
    var capList = capListResult.getOutput();
	aa.print("Adrian ready to parse capList");
    for (xx in capList) {
        var capId = capList[xx].getCapID();
        var cap = aa.cap.getCap(capId).getOutput();
        var appTypeString = cap.getCapType().toString();
        var appTypeAlias = cap.getCapType().getAlias();
        var capStatus = cap.getCapStatus();
        if(capStatus = "Registered and Expired") {
			aa.print("Status is: " + capStatus);
			aa.print("Notifying capId=" + capId);
			var recordCapScriptModel = aa.cap.getCap(capId).getOutput();

			if (recordCapScriptModel.getAuditStatus() != "A") {
				aa.print("Skipping record, AuditStatus=" + recordCapScriptModel.getAuditStatus());
			continue;
			}
		}

		notifyApplicantOrAddToSet(capId, recordCapScriptModel);
	}
}

/**
 * sends email to President of record, if not found it tries the Board Member else it adds the record to a SET
 * @param recordCapId
 * @param recordCap
 */
function notifyApplicantOrAddToSet(recordCapId, recordCap) {
	aa.print("Adrian sending emails");
	var applicant = getContactByType("President", recordCapId);
	var altId = recordCapId.getCustomID();
	var cap = aa.cap.getCap(recordCapId).getOutput();
	var appTypeAlias = cap.getCapType().getAlias();
	var capStatus = cap.getCapStatus();
	//var EMAIL_TEMPLATE = aa.env.getValue("EMAIL_TEMPLATE");
	//aa.print(EMAIL_TEMPLATE);
	var EMAIL_TEMPLATE = "BLD LIC EXPIRED # 97";
	var EMAIL_TEMPLATE = "MISC HOA RENEWAL NOTICE";	

	aa.print("The template is " + EMAIL_TEMPLATE);
	aa.print("that was the email template");
	
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
		var expDateString = dateAdd(null, 30);		
		addParameter(emailParams, "$$altID$$", altId);
        addParameter(emailParams, "$$ContactFullName$$", "Dear HOA Representative");		
		aa.print("the alias is: " + altId);
		var reportFile = [];
		var capID4Email = aa.cap.createCapIDScriptModel(recordCapId.getID1(),recordCapId.getID2(),recordCapId.getID3());	

		var sent = sendNotification("noreply@auroragov.org",applicant.getEmail(),"",EMAIL_TEMPLATE,emailParams,reportFile,capID4Email); 
        if (!sent) {
            aa.print("**WARN sending the HOA renewal email failed, error:" + sent.getErrorMessage());
            return false;
        }
		aa.print("Email Sent to: " + applicant.getEmail());		
	}
}
