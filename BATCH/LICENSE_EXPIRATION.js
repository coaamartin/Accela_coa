/*------------------------------------------------------------------------------------------------------/
| TESTING PARAMETERS (Uncomment to use in the script tester)
/------------------------------------------------------------------------------------------------------*/
//aa.env.setValue("paramStdChoice","COA_LIC_EXPIRE");
//aa.env.setValue("eventType","Batch Process");
/*------------------------------------------------------------------------------------------------------/
| Program: Batch Expiration Template.js  Trigger: Batch
| Client: COA
|
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| USER CONFIGURABLE PARAMETERS
/------------------------------------------------------------------------------------------------------*/
currentUserID = "ADMIN";
useAppSpecificGroupName = false;
/*------------------------------------------------------------------------------------------------------/
| GLOBAL VARIABLES
/------------------------------------------------------------------------------------------------------*/
message = "";
br = "<br>";
debug = "";
systemUserObj = aa.person.getUser(currentUserID).getOutput();
publicUser = false;
/*------------------------------------------------------------------------------------------------------/
| INCLUDE SCRIPTS (Core functions, batch includes, custom functions)
/------------------------------------------------------------------------------------------------------*/
SCRIPT_VERSION = 3.0;
var useSA = false;
var SA = null;
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_FOR_EMSE");
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") {
	useSA = true;
	SA = bzr.getOutput().getDescription();
	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_INCLUDE_SCRIPT");
	if (bzr.getSuccess()) {
		SAScript = bzr.getOutput().getDescription();
	}
}

if (SA) {
	eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS", SA));
	eval(getMasterScriptText(SAScript, SA));
} else {
	eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS"));
}

eval(getScriptText("INCLUDES_BATCH"));
eval(getMasterScriptText("INCLUDES_CUSTOM"));

function getMasterScriptText(vScriptName) {
	var servProvCode = aa.getServiceProviderCode();
	if (arguments.length > 1)
		servProvCode = arguments[1]; // use different serv prov code
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}

function getScriptText(vScriptName) {
	var servProvCode = aa.getServiceProviderCode();
	if (arguments.length > 1)
		servProvCode = arguments[1]; // use different serv prov code
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var emseScript = emseBiz.getScriptByPK(servProvCode, vScriptName, "ADMIN");
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}
/*------------------------------------------------------------------------------------------------------/
| CORE EXPIRATION BATCH FUNCTIONALITY
/------------------------------------------------------------------------------------------------------*/
try {
	showMessage = false;
	showDebug = true;
	if (String(aa.env.getValue("showDebug")).length > 0) {
		showDebug = aa.env.getValue("showDebug").substring(0, 1).toUpperCase().equals("Y");
	}

	sysDate = aa.date.getCurrentDate();
	var startDate = new Date();
	var startTime = startDate.getTime(); // Start timer
	var systemUserObj = aa.person.getUser("ADMIN").getOutput();

	sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "");
	batchJobResult = aa.batchJob.getJobID();
	batchJobName = "" + aa.env.getValue("BatchJobName");
	batchJobID = 0;

	if (batchJobResult.getSuccess()) {
		batchJobID = batchJobResult.getOutput();
		logDebug("Batch Job " + batchJobName + " Job ID is " + batchJobID);
	} else {
		logDebug("Batch job ID not found " + batchJobResult.getErrorMessage());
	}
	
	var vEmailFrom = ""; //Testing Only
	var vEmailTo = ""; //Testing Only
	var vEmailCC = ""; //Testing Only
	vEmailFrom = "noreply@accela.com"; //Testing Only
	vEmailTo = "noreply@accela.com"; //Testing Only
	vEmailCC = ""; //Testing Only

	if (aa.env.getValue("FromEmail") != null && aa.env.getValue("FromEmail") != "") {
		vEmailFrom = aa.env.getValue("FromEmail");
	}
	if (aa.env.getValue("ToEmail") != null && aa.env.getValue("ToEmail") != "") {
		vEmailTo = aa.env.getValue("ToEmail");
	}
	if (aa.env.getValue("CCEmail") != null && aa.env.getValue("CCEmail") != "") {
		vEmailCC = aa.env.getValue("CCEmail");
	}

	/*------------------------------------------------------------------------------------------------------/
	| <===========Main=Loop================>
	/-----------------------------------------------------------------------------------------------------*/

	logDebug("Start of Job");

	mainProcess();

	logDebug("End of Job: Elapsed Time : " + elapsed() + " Seconds");
	
	/*------------------------------------------------------------------------------------------------------/
	| <===========END=Main=Loop================>
	/-----------------------------------------------------------------------------------------------------*/	
} catch (err) {
	handleError(err,"Batch Job:" + batchJobName + " Job ID:" + batchJobID);
}

/*------------------------------------------------------------------------------------------------------/
| <=========== Errors and Reporting
/------------------------------------------------------------------------------------------------------*/
if (debug.indexOf("**ERROR") > 0) {
	aa.env.setValue("ScriptReturnCode", "1");
	aa.env.setValue("ScriptReturnMessage", debug);
	aa.sendMail(vEmailFrom, vEmailTo, vEmailCC, batchJobName + " - Error", debug);
} else {
	aa.env.setValue("ScriptReturnCode", "0");
	if (showMessage) {
		aa.env.setValue("ScriptReturnMessage", message);
		aa.sendMail(vEmailFrom, vEmailTo, vEmailCC, batchJobName + " Results", message);
	}
	if (showDebug) {
		aa.env.setValue("ScriptReturnMessage", debug);
		aa.sendMail(vEmailFrom, vEmailTo, vEmailCC, batchJobName + " Results - Debug", debug);
	}
}
/*------------------------------------------------------------------------------------------------------/
| FUNCTIONS (mainProcess is the core function for processing expiration records)
/------------------------------------------------------------------------------------------------------*/
function mainProcess() {
	/*----------------------------------------------------------------------------------------------------/
	| BATCH PARAMETERS
	/------------------------------------------------------------------------------------------------------*/
	var paramStdChoice = aa.env.getValue("paramStdChoice");	// use this standard choice for parameters instead of batch jobs
	var fromDate = getJobParam("fromDate"); // Hardcoded dates.   Use for testing only
	var toDate = getJobParam("toDate"); // ""
	var dFromDate = aa.date.parseDate(fromDate); //
	var dToDate = aa.date.parseDate(toDate); //
	var ama = getJobParam("appMatchArray");
	var appMatchArray = ( ama != "" ? ama.split(",") : null); // Comma separated appmatches, overrides separate values
	var lookAheadDays = getJobParam("lookAheadDays"); // Number of days from today
	var daySpan = getJobParam("daySpan"); // Days to search (6 if run weekly, 0 if daily, etc.)
	var appGroup = getJobParam("appGroup"); //   app Group to process {Licenses}
	var appTypeType = getJobParam("appTypeType"); //   app type to process {Rental License}
	var appSubtype = getJobParam("appSubtype"); //   app subtype to process {NA}
	var appCategory = getJobParam("appCategory"); //   app category to process {NA}
	var expStatus = getJobParam("expirationStatus"); //   test for Active
	var newExpStatus = getJobParam("newExpirationStatus"); //   update to this expiration status
	var newAppStatus = getJobParam("newApplicationStatus"); //   update the CAP to this status
	var gracePeriodDays = getJobParam("gracePeriodDays"); //	bump up expiration date by this many days
	var setPrefix = getJobParam("setPrefix"); //   Prefix for set ID
	var skipAppStatusArray = getJobParam("skipAppStatus").split(","); //   Skip records with one of these application statuses
	var emailAddress = getJobParam("emailAddress"); // email to send report
	var sendEmailToContactTypes = getJobParam("sendEmailToContactTypes"); // ALL,PRIMARY, or comma separated values
	var emailTemplate = getJobParam("emailTemplate"); // email Template
	var createNotifySets = getJobParam("createNotifySets").substring(0, 1).toUpperCase().equals("Y"); // create of set of records without email addresses
	var setType = getJobParam("setType"); // Sets will be created with this type
	var setStatus = getJobParam("setStatus"); // Sets will be created with this initial status
	var createRenewalRecord = getJobParam("createTempRenewalRecord").substring(0, 1).toUpperCase().equals("Y"); // create a temporary record
	var taskName = getJobParam("taskName");
	var vTaskStatus = getJobParam("taskStatus");
	var taskStatusAction = getJobParam("taskStatusAction");
	var permitStatus = getJobParam("permitStatus");
	var newPermitStatus = getJobParam("newPermitStatus");
	var reportName = getJobParam("reportName");
	var reportType = getJobParam("reportType");
	var filterExpression = getJobParam("filterExpression"); // JavaScript used to filter records.   Evaluating to false will skip the record, for example:   getAppSpecific("FieldName").toUpperCase() == "TEST"
	var actionExpression = getJobParam("actionExpression"); // JavaScript used to perform custom action, for example:   addStdCondition(...)


	//Non-parameter variables
	if (!fromDate.length) { // no "from" date, assume today + number of days to look ahead
		fromDate = dateAdd(null, parseInt(lookAheadDays));
	}
	if (!toDate.length) { // no "to" date, assume today + number of look ahead days + span
		toDate = dateAdd(null, parseInt(lookAheadDays) + parseInt(daySpan))
	}
	
	var mailFrom = lookup("ACA_EMAIL_TO_AND_FROM_SETTING", "RENEW_LICENSE_AUTO_ISSUANCE_MAILFROM");
	var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
	acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));

	if (!appMatchArray) {
		appGroup = appGroup == "" ? "*" : appGroup;
		appTypeType = appTypeType == "" ? "*" : appTypeType;
		appSubtype = appSubtype == "" ? "*" : appSubtype;
		appCategory = appCategory == "" ? "*" : appCategory;
		var appType = appGroup + "/" + appTypeType + "/" + appSubtype + "/" + appCategory;
		appMatchArray = [appType];
	}

	for (var ama in appMatchArray) {
		logDebug("Searching for Record Type: " + appMatchArray[ama]);
	}
	
	var capFilterType = 0;
	var capFilterInactive = 0;
	var capFilterError = 0;
	var capFilterStatus = 0;
	var capFilterExpression = 0;
	var capDeactivated = 0;
	var capCount = 0;
	var setName;
	var setDescription;
	var curDate = new Date();
	var recWithoutEmail = 0;

	// prep the set prefix for all sets
	if (setPrefix != "") {
		var yyyy = startDate.getFullYear().toString();
		var mm = (startDate.getMonth() + 1).toString();
		if (mm.length < 2)
			mm = "0" + mm;
		var dd = startDate.getDate().toString();
		if (dd.length < 2)
			dd = "0" + dd;
		var hh = startDate.getHours().toString();
		if (hh.length < 2)
			hh = "0" + hh;
		var mi = startDate.getMinutes().toString();
		if (mi.length < 2)
			mi = "0" + mi;
		setPrefix += ":" + yyyy + mm + dd;
	}

	// create Set of Sets if we are using notify sets
	var masterSet;
	if (setPrefix != "" && createNotifySets) {
		var masterSet = setPrefix + ":MASTER";
		new setSet(masterSet, masterSet, null, "Contains all sets created by Batch Job " + batchJobName + " Job ID " + batchJobID);
	}

	// Obtain the array of records to loop through.   This can be changed as needed based on the business rules
	logDebug("Retrieving Records from " + fromDate + " to " + toDate);
	var expResult = aa.expiration.getLicensesByDate(expStatus, fromDate, toDate);
	if (expResult.getSuccess()) {
		myExp = expResult.getOutput();
		logDebug("Processing " + myExp.length + " active expiration records");
	}

	// Process each expiration records. (effectively, each license app)
	for (thisExp in myExp)
	{
		b1Exp = myExp[thisExp]; //b1expiration record
		var expDate = b1Exp.getExpDate();
		if (expDate) {
			var b1ExpDate = expDate.getMonth() + "/" + expDate.getDayOfMonth() + "/" + expDate.getYear();
		}
		var b1Status = b1Exp.getExpStatus();
		var renewalCapId = null;

		capId = aa.cap.getCapID(b1Exp.getCapID().getID1(), b1Exp.getCapID().getID2(), b1Exp.getCapID().getID3()).getOutput();

		if (!capId) {
			logDebug("Could not get a Cap ID for " + b1Exp.getCapID().getID1() + "-" + b1Exp.getCapID().getID2() + "-" + b1Exp.getCapID().getID3());
			continue;
		}

		altId = capId.getCustomID();

		logDebug("==========: " + altId + " :==========");
		logDebug("     " + "Renewal Status : " + b1Status + ", Expires on " + b1ExpDate);

		var capResult = aa.cap.getCap(capId);

		if (!capResult.getSuccess()) {
			logDebug("     " + "skipping, Record is deactivated");
			capDeactivated++;
			continue;
		} else {
			var cap = capResult.getOutput();
		}

		var capStatus = cap.getCapStatus();

		appTypeResult = cap.getCapType(); //create CapTypeModel object
		appTypeString = appTypeResult.toString();
		appTypeArray = appTypeString.split("/");

		// Filter by CAP Type
		var match = false;
		for (var ama in appMatchArray) {
			if (appMatch(appMatchArray[ama])) {
				match = true;
			}
		}
		if (!match) {
			capFilterType++;
			logDebug("     " + "skipping, Application Type does not match")
			continue;
		}

		// Filter by CAP Status
		if (exists(capStatus, skipAppStatusArray)) {
			capFilterStatus++;
			logDebug("     " + "skipping, due to application status of " + capStatus)
			continue;
		}

		// done filtering, so increase the record count to include this record.
		capCount++;

		logDebug("==========: " + altId + " :==========");
		logDebug("Renewal Status : " + b1Status + ", Expires on " + b1ExpDate);

		// Actions start here:

		// execute custom expression
		
		if (actionExpression.length > 0) {
			logDebug("Executing action expression : " + actionExpression);
			var result = eval(filterExpression);
		}

		// update expiration status
		if (newExpStatus.length > 0) {
			b1Exp.setExpStatus(newExpStatus);
			aa.expiration.editB1Expiration(b1Exp.getB1Expiration());
			logDebug("Update expiration status: " + newExpStatus);
		}

		// update Workflow
		if (taskName && taskName != "" && vTaskStatus && vTaskStatus != "") {
			resultWorkflowTask(taskName, vTaskStatus, "Updated by batch " + batchJobName + ".", "Updated by batch " + batchJobName + ".")
		}

		// update App Status
		if (newAppStatus && newAppStatus != "") {
			updateAppStatus(String(newAppStatus), "Updated by batch " + batchJobName)
		}

		// Create the renewal record. Fires the ASA event for the renewal record.
		if (createRenewalRecord) {
			createResult = aa.cap.createRenewalRecord(capId);

			if (!createResult.getSuccess() || !createResult.getOutput()) {
				logDebug("Could not create renewal record.   This could be due to EMSE errors on record creation : " + createResult.getErrorMessage());
			} else {
				renewalCapId = createResult.getOutput();
				renewalCap = aa.cap.getCap(renewalCapId).getOutput();
				if (renewalCap.isCompleteCap()) {
					logDebug("Renewal Record already exists : " + renewalCapId.getCustomID());
				} else {
					logDebug("created Renewal Record " + renewalCapId.getCustomID());

					//run the ApplicationSubmitAfter event actions for the new renewal. this will assess fees
					//runASAForCapID(renewalCapId); no longer needed, system will run ASA for the record OOB
				}
			}
		}

		//generate email notices
		if (emailTemplate != null && emailTemplate != "" && sendEmailToContactTypes && sendEmailToContactTypes != "") {
			eParams = aa.util.newHashtable();
			eParams.put("$$expirationDate$$", b1ExpDate);
			eParams.put("$$altID$$",capId.getCustomID());
			eParams.put("$$acaRecordUrl$$",getACARecordURL(""));
			if (reportName != null && reportName != "") {
				var rParams = aa.util.newHashtable();
				addParameter(rParams, "prmRecordID", altId);
				addParameter(rParams, "prmReportType", reportType);
				addParameter(rParams, "prmFromDate", "");
				addParameter(rParams, "prmToDate", "");

				logDebug('Attempting to send email with report: ' + emailTemplate + " : " + reportName + " : " + capId.getCustomID());
				//logDebug('Attempting to send email with report: ' + emailTemplate + " : " + reportName + " : " + capId.getCustomID());
				emailContacts(sendEmailToContactTypes, emailTemplate, eParams, reportName, rParams, "Y");
			} else {
				logDebug('Attempting to send email: ' + emailTemplate + " : " + capId.getCustomID());
				//logDebug('Attempting to send email: ' + emailTemplate + " : " + capId.getCustomID());
				emailContacts(sendEmailToContactTypes, emailTemplate, eParams, null, null, "Y");
			}
		}

		//remove fees added above. this is required to prevent ACA users from paying for fees when application cannot be approved. fees will re-assess in ACA if auto-approved
		//removeAllFees(renewalCapId);

		// Add to the overall Set
		// This need some work still.

		// Create Set
		if (setPrefix != "") {
			if (capCount == 1) {
				var yy = startDate.getFullYear().toString().substr(2, 2);
				var mm = (startDate.getMonth() + 1).toString();
				if (mm.length < 2)
					mm = "0" + mm;
				var dd = startDate.getDate().toString();
				if (dd.length < 2)
					dd = "0" + dd;
				var hh = startDate.getHours().toString();
				if (hh.length < 2)
					hh = "0" + hh;
				var mi = startDate.getMinutes().toString();
				if (mi.length < 2)
					mi = "0" + mi;

				var setID = setPrefix.substr(0, 5) + yy + mm + dd + hh + mi;

				var s = new capSet(setID,batchJobName + " Job ID " + batchJobID, setType, "Created by " + batchJobName + " Job ID " + batchJobID);
				s.type = setType;
				s.status = setStatus;
				s.update();
			}
			s.add(capId);
		}
		
		if (setPrefix != "" && createNotifySets && !doAllContactsHaveEmail(capId)) {
			if (recWithoutEmail == 0) {
				var s = new capSet(setPrefix, setType, "Records without email Processed by Batch Job " + batchJobName + " Job ID " + batchJobID);
				s.type = setType;
				s.update();
			}
			s.add(capId);
			recWithoutEmail++;
		}

	}

	logDebug("=================================================");
	logDebug("=================================================");
	logDebug("Total CAPS qualified date range: " + myExp.length);
	logDebug("Ignored due to application type: " + capFilterType);
	logDebug("Ignored due to CAP Status: " + capFilterStatus);
	logDebug("Ignored due to Deactivated CAP: " + capDeactivated);
	logDebug("Total CAPS processed: " + capCount);
}
