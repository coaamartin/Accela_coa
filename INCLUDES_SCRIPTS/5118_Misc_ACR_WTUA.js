// SCRIPTNUMBER: 5118
// SCRIPTFILENAME: 5118_Misc_ACR_WTUA.js
// PURPOSE: Called when Misc Services ACR record has task updated.
// DATECREATED: 12/6/2019
// BY: amartin
// CHANGELOG: 
//Script Tester header.  Comment this out when deploying.
var myCapId = "19-000039-ACR";
var myUserId = "AMARTIN";
var eventName = "";
var wfTask = "IT Review";
var wfStatus = "Approved";
var wfComment = "";

var useProductScript = true; // set to true to use the "productized" master scripts (events->master scripts), false to use scripts from (events->scripts)
var runEvent = true; // set to true to simulate the event and run all std choices/scripts for the record type.  

/* master script code don't touch */
aa.env.setValue("EventName", eventName);
var vEventName = eventName;
var controlString = eventName;
var tmpID = aa.cap.getCapID(myCapId).getOutput();
if (tmpID != null) {
	aa.env.setValue("PermitId1", tmpID.getID1());
	aa.env.setValue("PermitId2", tmpID.getID2());
	aa.env.setValue("PermitId3", tmpID.getID3());
}
aa.env.setValue("CurrentUserID", myUserId);
var preExecute = "PreExecuteForAfterEvents";
var documentOnly = false;
var SCRIPT_VERSION = 3.0;
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
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA, useProductScript));
	eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA, useProductScript)); /* force for script test*/
	showDebug = true;
	eval(getScriptText(SAScript, SA, useProductScript));
} else {
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useProductScript));
	eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, useProductScript));
}
eval(getScriptText("INCLUDES_CUSTOM", null, useProductScript));
if (documentOnly) {
	doStandardChoiceActions2(controlString, false, 0);
	aa.env.setValue("ScriptReturnCode", "0");
	aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");
	aa.abortScript();
}
var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX", vEventName);
var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS";
var doStdChoices = true;
var doScripts = false;
var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice).getOutput().size() > 0;
if (bzr) {
	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "STD_CHOICE");
	doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";
	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "SCRIPT");
	doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";
}

function getScriptText(vScriptName, servProvCode, useProductScripts) {
	if (!servProvCode) servProvCode = aa.getServiceProviderCode();
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		if (useProductScripts) {
			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
		} else {
			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
		}
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}
logGlobals(AInfo);
if (runEvent && typeof (doStandardChoiceActions) == "function" && doStdChoices) try {
	doStandardChoiceActions(controlString, true, 0);
} catch (err) {
	logDebug(err.message)
}
if (runEvent && typeof (doScriptActions) == "function" && doScripts) doScriptActions();
var z = debug.replace(/<BR>/g, "\r");
aa.print(z);

/*
User code generally goes inside the try block below.
*/



try {
	//your code here
	//End script Tester header 
	logDebug("---------------------> At start of 5118 WTUA");
	//I cannot get the async to work so using non-async by forcing env variable.
	aa.env.setValue("eventType", "Batch Process");







	// if (wfTask == "Foreclosure Information") {
	//     //update Renewal status and date
	// 	logDebug("---------------------> Started setting renewal date and status ");		
	//         var vExpDate = new Date();
	//         var vNewExpDate = new Date(vExpDate.getFullYear() + 0, vExpDate.getMonth(), vExpDate.getDate());
	//         var rB1ExpResult = aa.expiration.getLicensesByCapID(capId).getOutput();
	//         rB1ExpResult.setExpDate(aa.date.getScriptDateTime(vNewExpDate));
	//         rB1ExpResult.setExpStatus("About to Expire");
	//         aa.expiration.editB1Expiration(rB1ExpResult.getB1Expiration());	
	// }
	if (wfTask == "Submit Change Request" && wfStatus == "Complete") {
		logDebug("---------------------> Submit Change Request - Complete");
		updateAppStatus("Withdrawn", "Script 5118");
		//	if ((AInfo["Dwelling Units"] != "5+ MF")) {
		//		//insert inspection and assign to inspOfficer
		//	    if(codeDistrict && codeDistrict.length > 0){
		//			var inspOfficer = assignOfficer(codeDistrict);
		//		}
		//		if (inspOfficer) {
		//			var inspRes = aa.person.getUser(inspOfficer);
		//			if (inspRes.getSuccess())
		//				{var inspectorObj = inspRes.getOutput();}
		//			}			
		//		scheduleInspection("Vacant Property Pictures", 1,inspectorObj); //, inspector, null, newInspReqComments);	
		//	}
	}
	if (wfTask == "IT Review" && (wfStatus == "Approved" || wfStatus == "Approved with Conditions")) {
		logDebug("---------------------> IT Review - Approved or with Conditions");
		//		updateAppStatus("Withdrawn", "Script 5118");	
		var reqDeptManager = AInfo["Requesting Department Manager"];
		logDebug('Attempting to send email: ' + reqDeptManager);
		//Send a notification email YOU HAVE A CHANGE REQUEST
		var emailTemplate = "ENF VAC REGISTRATION LETTER";
		var todayDate = new Date();
		if (emailTemplate != null && emailTemplate != "") {
			logDebug("5118 sending Check Change Request letter.");
			eParams = aa.util.newHashtable();
			eParams.put("$$ContactEmail$$", "");
			eParams.put("$$todayDate$$", todayDate);
			eParams.put("$$altid$$", capId.getCustomID());
			eParams.put("$$capAlias$$", cap.getCapType().getAlias());
			logDebug('Attempting to send email: ' + emailTemplate + " : " + capId.getCustomID());
			emailContacts("Applicant", emailTemplate, eParams, null, null, "Y");
		}
	}
	// This is the start of Prioritizaton meeting section.
	// Need to have approved and approved with conditions
	// What will these tasks do?
	if (wfTask == "Manager Review" && (wfStatus == "Approved") {
			logDebug("---------------------> Prioritization Meeting - Approved or Approved with Conditions");
			//switch statement to hit each task that is being made
			var taskInfo = "";
			switch (taskInfo) {
				case '':
					logDebug("Checking first checkbox");
					//do something here
					activateTask("Task Name");
				case '':
					logDebug("Checking second checkbox")
					//do something here
					updateAppStatus("Task Name", "Script 5118");
				case '':
					logDebug("Checking third checkbox");
					//do something here
					editTaskDueDate("Task name", newDatePlus30);
				case '':
					logDebug("Checking third checkbox");
					//do something here
					var capStatus = cap.getCapStatus();
					if (capStatus != 'Withdrawn') {
						closeAllTasks(capId, "Closed Via Script 5118");
						updateAppStatus("Closed", "Closed Via Script 5118");
						cancelInspections();
						var rB1ExpResult = aa.expiration.getLicensesByCapID(capId).getOutput();
						rB1ExpResult.setExpStatus("Inactive");
					}
			}

		}

		if (wfTask == "Foreclosure Information" && wfStatus == "Registration Only") {
			logDebug("---------------------> Foreclosure Information - Registration Only");
			updateFee("ENF_VAC_REG", "ENF_VAC_REGPEN", "FINAL", 1, "N");
			//addFee('ENF_VAC_REG', 'ENF_VAC_REGPEN', 'FINAL', '', 'Y');
			var capStatus = cap.getCapStatus();
			if (capStatus == 'Recorded') {
				updateAppStatus("Registered and Recorded", "Script 5118");
			} else {
				updateAppStatus("Registered", "Script 5118");
			}
		}
		if (wfTask == "Foreclosure Information" && (wfStatus == "Abandon No NED" || wfStatus == "Investor/Owner No NED")) {
			logDebug("---------------------> Foreclosure Information - Abandon No NED or Investor/Owner No NED");
			var taskDueDate = getTaskDueDate("Foreclosure Information");
			newDatePlus30 = dateAdd(null, 30);
			editTaskDueDate("Foreclosure Information", newDatePlus30);
		}
		if (wfTask == "Foreclosure Information" && wfStatus == "Closed Info Only") {
			logDebug("---------------------> Foreclosure Information - Closed Info Only");
			var capStatus = cap.getCapStatus();
			if (capStatus != 'Recorded') {
				closeAllTasks(capId, "Closed Via Script 5118");
				updateAppStatus("Closed", "Closed Via Script 5118");
				logDebug("---------------------> Foreclosure Information - Cancelling Inspections");
				cancelInspections();
				var rB1ExpResult = aa.expiration.getLicensesByCapID(capId).getOutput();
				rB1ExpResult.setExpStatus("Inactive");
			}
		}

		if (wfTask == "Send Registration" && wfStatus == "No Further Action") {
			logDebug("---------------------> Send Registration - No Further Action");
			var capStatus = cap.getCapStatus();
			if (capStatus != 'Recorded') {
				closeAllTasks(capId, "Closed Via Script 5118");
				updateAppStatus("Closed", "Closed Via Script 5118");
				cancelInspections();
				var rB1ExpResult = aa.expiration.getLicensesByCapID(capId).getOutput();
				rB1ExpResult.setExpStatus("Inactive");
			}
		}
		if (wfTask == "Send Registration" && wfStatus == "Registration Sent") {
			logDebug("---------------------> Send Registration - Registration Sent");

			//Send a registration email ENF VAC REGISTRATION LETTER
			var emailTemplate = "ENF VAC REGISTRATION LETTER";
			var todayDate = new Date();
			if (emailTemplate != null && emailTemplate != "") {
				logDebug("5118 sending Registration letter.  Defaulting to contact Property Manager.");
				eParams = aa.util.newHashtable();
				eParams.put("$$ContactEmail$$", "");
				eParams.put("$$todayDate$$", todayDate);
				eParams.put("$$altid$$", capId.getCustomID());
				eParams.put("$$capAlias$$", cap.getCapType().getAlias());
				logDebug('Attempting to send email: ' + emailTemplate + " : " + capId.getCustomID());
				emailContacts("Property Manager", emailTemplate, eParams, null, null, "Y");
			}
			newDatePlus30 = dateAdd(null, 30);
			//activateTask("Apply Delinquent Registration");
			editTaskDueDate("Apply Delinquent Registration", newDatePlus30);
		}

		if (wfTask == "Foreclosure Sale Result" && wfStatus == "Withdrawn") {
			logDebug("---------------------> Foreclosure Sale Result - Withdrawn");
			closeTask("Send Registration", "Closed", "Updated by script COA #5118");

			//insert inspection and assign to inspOfficer
			if (codeDistrict && codeDistrict.length > 0) {
				var inspOfficer = assignOfficer(codeDistrict);
			}
			if (inspOfficer) {
				var inspRes = aa.person.getUser(inspOfficer);
				if (inspRes.getSuccess()) {
					var inspectorObj = inspRes.getOutput();
				}
			}
			//scheduleInspection("Check Ownership", 3,inspectorObj); //, inspector, null, newInspReqComments);	
		}

		//if (wfTask == "Foreclosure Sale Result" && wfStatus == "Non-Bank Owner") {
		//	logDebug("---------------------> Foreclosure Sale Result - Non-Bank Owner");	
		//	closeAllTasks(capId, "Closed Via Script 5118");	
		//    updateAppStatus("Closed", "Closed Via Script 5118");
		//	cancelInspections();	
		//	var rB1ExpResult = aa.expiration.getLicensesByCapID(capId).getOutput();
		//	rB1ExpResult.setExpStatus("Inactive");			
		//}

		if (wfTask == "Foreclosure Sale Result" && wfStatus == "New Ownership") {
			logDebug("---------------------> Foreclosure Sale Result - New Ownership");
			closeAllTasks(capId, "Closed Via Script 5118");
			updateAppStatus("Closed", "Closed Via Script 5118");
			cancelInspections();
			var rB1ExpResult = aa.expiration.getLicensesByCapID(capId).getOutput();
			rB1ExpResult.setExpStatus("Inactive");
		}

		if (wfTask == "Foreclosure Sale Result" && wfStatus == "Unregistered REO") {
			logDebug("--------------------->Foreclosure Sale Result - Unregistered REO");
			if (!isTaskStatus("Send Registration", "Registration Sent")) {
				//assign task to rtorres.
				assignTask("Send Registration", "rtorres");
			} else {
				//insert another one for rtorres.
				activateTask("Send Registration");
				assignTask("Send Registration", "rtorres");
			}
			updateAppStatus("Recorded", "Script 5118");
		}

		if (wfTask == "Apply Delinquent Registration" && wfStatus == "Registering") {
			logDebug("---------------------> Apply Delinquent Registration - Registering");
			var capStatus = cap.getCapStatus();
			if (capStatus == 'Recorded') {
				updateAppStatus("Registered", "Script 5118");
			}
		}
		if (wfTask == "Apply Delinquent Registration" && wfStatus == "Fee + Record County") {
			logDebug("---------------------> Apply Delinquent Registration - Fee + Record County");
			updateFee("ENF_VAC_DEL1", "ENF_VAC_REGPEN", "FINAL", 1, "N");
			var taskDueDate = getTaskDueDate("Apply Delinquent Registration");
			newDatePlus90 = dateAdd(null, 90);
			activateTask("Apply Delinquent Registration");
			editTaskDueDate("Apply Delinquent Registration", newDatePlus90);
			assignTask("Apply Delinquent Registration", "rtorres");
		}
		if (wfTask == "Apply Delinquent Registration" && wfStatus == "New REO") {
			logDebug("---------------------> Apply Delinquent Registration - New REO");
			var capStatus = cap.getCapStatus();
			if (capStatus == 'Registered and Recorded' || capStatus == 'Recorded and Expired') {
				updateAppStatus("Recorded", "Script 5118");
			}
		}
		if (wfTask == "Apply Delinquent Registration" && wfStatus == "Cancelled") {
			logDebug("---------------------> Apply Delinquent Registration - Cancelled");
			//close all tasks and the record
			closeAllTasks(capId, "Script 5118");
			cancelInspections();
		}
		if (wfTask == "Apply Delinquent Registration" && wfStatus == "New Ownership") {
			logDebug("---------------------> Apply Delinquent Registration - New Ownership");
			var capStatus = cap.getCapStatus();
			if (capStatus != 'Registered and Recorded' || capStatus != 'Recorded and Expired') {
				//check for open Assess to County or Notice of Assessment
				if (!isTaskStatus("Notice of Assessment", "Record Reception")) {
					if (!isTaskStatus("Notice of Assessment", "Submitted")) {
						if (!isTaskStatus("Assess to County", "Complete")) {
							//close all tasks and the record
							closeAllTasks(capId, "Script 5118");
							updateAppStatus("Closed", "Script 5118");
							cancelInspections();
							var rB1ExpResult = aa.expiration.getLicensesByCapID(capId).getOutput();
							rB1ExpResult.setExpStatus("Inactive");
						}
					}

				}
				updateAppStatus("Recorded", "Script 5118");
			}
		}
		if (wfTask == "Apply Delinquent Registration" && wfStatus == "Dispatch CEO") {
			logDebug("---------------------> Apply Delinquent Registration - Dispatch CEO");
			//insert inspection and assign to inspOfficer
			if (codeDistrict && codeDistrict.length > 0) {
				var inspOfficer = assignOfficer(codeDistrict);
			}
			if (inspOfficer) {
				var inspRes = aa.person.getUser(inspOfficer);
				if (inspRes.getSuccess()) {
					var inspectorObj = inspRes.getOutput();
				}
			}
			scheduleInspection("Vacant Property Pictures", 1, inspectorObj); //, inspector, null, newInspReqComments);	
		}
		if (wfTask == "Renewal Registration" && wfStatus == "Sent Renewal") {
			logDebug("---------------------> Renewal Registration - Sent Renewal");
			var sysDate = aa.date.getCurrentDate();
			renewalDate = dateFormatted('2', '1', sysDate.getYear(), "");
			if (sysDate > renewalDate) {
				renewalDate = dateFormatted('2', '1', sysDate.getYear() + 1, "");
			}
			//reopen task 91820 and set new due date
			activateTask("Apply Delinquent Registration");
			editTaskDueDate("Apply Delinquent Registration", renewalDate);
			assignTask("Apply Delinquent Registration", "rtorres");
			//update Renewal status and date
			//logDebug("---------------------> Started setting renewal date and status ");		
			//    var vExpDate = new Date();
			//    var vNewExpDate = new Date(vExpDate.getFullYear() + 0, vExpDate.getMonth(), vExpDate.getDate());
			//    var rB1ExpResult = aa.expiration.getLicensesByCapID(capId).getOutput();
			//    rB1ExpResult.setExpDate(aa.date.getScriptDateTime(vNewExpDate));
			//    rB1ExpResult.setExpStatus("About to Expire");
			//    aa.expiration.editB1Expiration(rB1ExpResult.getB1Expiration());	
			//Send a registration email ENF VAC REGISTRATION LETTER
			//generate email notices
			var emailTemplate = "ENF VAC REGISTRATION LETTER";
			var todayDate = new Date();
			if (emailTemplate != null && emailTemplate != "") {
				logDebug("5118 sending Registration letter.  Defaulting to contact Property Manager.");
				eParams = aa.util.newHashtable();
				eParams.put("$$ContactEmail$$", "");
				eParams.put("$$todayDate$$", todayDate);
				eParams.put("$$altid$$", capId.getCustomID());
				eParams.put("$$capAlias$$", cap.getCapType().getAlias());
				logDebug('Attempting to send email: ' + emailTemplate + " : " + capId.getCustomID());
				emailContacts("Property Manager", emailTemplate, eParams, null, null, "Y");
			}
			logDebug("---------------------> Completed setting renewal date and status ");
		}
		if (wfTask == "Renewal Registration" && wfStatus == "New Ownership") {
			logDebug("---------------------> Renewal Registration - New Ownership");
			var capStatus = cap.getCapStatus();
			if (capStatus != 'Registered and Recorded' || capStatus != 'Recorded') {
				closeAllTasks(capId, "");
				updateAppStatus("Closed", "Script 5118");
				cancelInspections();
				var rB1ExpResult = aa.expiration.getLicensesByCapID(capId).getOutput();
				rB1ExpResult.setExpStatus("Inactive");
			}
		}

		if (wfTask == "Notice of Assessment" && wfStatus == "Not Recorded") {
			logDebug("---------------------> Notice of Assessment - Not Recorded");
			closeAllTasks(capId, "Script 5118");
			var rB1ExpResult = aa.expiration.getLicensesByCapID(capId).getOutput();
			rB1ExpResult.setExpStatus("Inactive");
		}
		if (wfTask == "Notice of Assessment" && wfStatus == "Record Reception") {
			logDebug("---------------------> Notice of Assessment - Record Reception");
			var sysDate = aa.date.getCurrentDate();
			dueDate = dateFormatted('10', '31', sysDate.getYear(), "");
			//reopen task Assess to County and set new due date
			//activateTask("Assess to County ");
			editTaskDueDate("Assess to County", dueDate);
		}

		if (wfTask == "Notice of Assessment" && wfStatus == "Submitted") {
			logDebug("---------------------> Notice of Assessment - Submitted");
			newDatePlus1 = dateAdd(null, 1);
			editTaskDueDate("Notice of Assessment", newDatePlus1);
		}

		if (wfTask == "Record Release of Assessment" && wfStatus == "Not Recorded") {
			logDebug("---------------------> Record Release of Assessment - Not Recorded");
			closeAllTasks(capId, "Script 5118");
			var rB1ExpResult = aa.expiration.getLicensesByCapID(capId).getOutput();
			rB1ExpResult.setExpStatus("Inactive");
		}
		if (wfTask == "Record Release of Assessment" && wfStatus == "Record Reception") {
			logDebug("---------------------> Record Release of Assessment - Record Reception");
			updateAppStatus("Recorded", "Script 5118");
		}
		if (wfTask == "Record Release of Assessment" && wfStatus == "Release All-Reception") {
			logDebug("---------------------> Record Release of Assessment - Release All-Reception");
			closeAllTasks(capId, "Script 5118");
			cancelInspections();
			var rB1ExpResult = aa.expiration.getLicensesByCapID(capId).getOutput();
			rB1ExpResult.setExpStatus("Inactive");
			updateAppStatus("Closed", "Script 5118");

		}
		if (wfTask == "Record Release of Assessmentt" && wfStatus == "Submitted") {
			logDebug("---------------------> Record Release of Assessment - Submitted");
			updateTask("Record Release of Assessment", "Submitted", "Updated by script COA #5118", "Updated by script COA #5118");
		}
		/* Turns out this is simply not used in Amanda
		if (wfTask == "New Ownership/Sale of Property" && wfStatus == "New REO") {
			logDebug("---------------------> New Ownership/Sale of Property - New REO");	
			//Send a registration email ENF VAC REGISTRATION LETTER
				//generate email notices
				var emailTemplate = "ENF VAC REGISTRATION LETTER";		
				var todayDate = new Date();
				if (emailTemplate != null && emailTemplate != "") {
					logDebug("5118 sending Registration letter.  Defaulting to contact Property Manager.");	
					eParams = aa.util.newHashtable();
					eParams.put("$$ContactEmail$$", "amartin@auroragov.org");			
					eParams.put("$$todayDate$$", todayDate);
					eParams.put("$$altid$$",capId.getCustomID());
					eParams.put("$$capAlias$$",cap.getCapType().getAlias());
					logDebug('Attempting to send email: ' + emailTemplate + " : " + capId.getCustomID());
					emailContacts("Property Manager", emailTemplate, eParams, null, null, "Y");
				}			
		}
		if (wfTask == "New Ownership/Sale of Property" && wfStatus == "New Ownership") {
			logDebug("---------------------> New Ownership/Sale of Property - New Ownership");	
			closeAllTasks(capId, "Script 5118");
			updateAppStatus("Closed", "Script 5118");	
			cancelInspections();		
		}
		if (wfTask == "New Ownership/Sale of Property" && wfStatus == "No County Info") {
			logDebug("---------------------> New Ownership/Sale of Property - No County Info");	
			var taskDueDate = getTaskDueDate("New Ownership/Sale of Property");
		    newDatePlus30 = dateAdd(null,30);
		    editTaskDueDate("New Ownership/Sale of Property", newDatePlus30);
		}
		*/
		if (wfTask == "Check Ownership" && wfStatus == "Verify Vacant") {
			logDebug("---------------------> Check Ownership - Verify Vacant");
			scheduleInspection("Vacant Property Pictures", 1, inspectorObj); //, inspector, null, newInspReqComments);		
			//scheduleInspection("Check Ownership", 3,inspectorObj); //, inspector, null, newInspReqComments);		
		}
		if (wfTask == "Check Ownership" && wfStatus == "New REO") {
			logDebug("---------------------> Check Ownership - New REO");
			if (!isTaskActive("Send Registration")) {
				activateTask('Send Registration');
				assignTask("Send Registration", "rtorres");
			}
		}
		if (wfTask == "Check Ownership" && wfStatus == "Withdrawn") {
			logDebug("---------------------> Check Ownership - Withdrawn");
			if (!isTaskActive("Check Ownership")) {
				activateTask('Check Ownership');
				assignTask("Check Ownership", "rtorres");
			}
		}
		if (wfTask == "Check Ownership" && wfStatus == "New Ownership") {
			logDebug("---------------------> Check Ownership - New Ownership");
			closeAllTasks(capId, "Script 5089");
			updateAppStatus("Closed", "Script 5089");
			cancelInspections();
			var rB1ExpResult = aa.expiration.getLicensesByCapID(capId).getOutput();
			rB1ExpResult.setExpStatus("Inactive");
			//Try to force close these known tasks that pop open even after all the others close.
			closeTask("Registration Payment Receipt", "Closed", "Updated by script COA #5118");
			closeTask("Mail Receipt", "Closed", "Updated by script COA #5118");
		}
		if (wfTask == "Check Ownership" && wfStatus == "Reschedule") {
			logDebug("---------------------> Check Ownership - Reschedule");
			var taskDueDate = getTaskDueDate("Check Ownership");
			newDatePlus30 = dateAdd(null, 30);
			editTaskDueDate("Check Ownership", newDatePlus30);
		}
		if (wfTask == "Check Ownership" && wfStatus == "No Further Action") {
			logDebug("---------------------> Check Ownership - No Further Action");
			var capStatus = cap.getCapStatus();
			if (capStatus != 'Recorded') {
				closeAllTasks(capId, "Script 5089");
				updateAppStatus("Closed", "Script 5089");
				cancelInspections();
				var rB1ExpResult = aa.expiration.getLicensesByCapID(capId).getOutput();
				rB1ExpResult.setExpStatus("Inactive");
			}
		}

		logDebug("---------------------> 5118_Misc_ACR_WTUA.js ended.");
		//Script Tester footer.  Comment this out when deploying.
	}

	catch (err) {
		logDebug("A JavaScript Error occured: " + err.message);
	}
	aa.env.setValue("ScriptReturnCode", "0");
	aa.env.setValue("ScriptReturnMessage", debug)