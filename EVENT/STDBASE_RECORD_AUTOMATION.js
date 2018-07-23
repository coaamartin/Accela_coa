/*Title : Record Automation
Purpose : TO apply these actions on record type based on the provided JSON (activateTask,daysOut,deactivateTask,deleteTask,updateTask,updateStatus,invoiceFees,createChild,createParent,addCondition,removeCondition,addComment,newStatus)
Author: Haetham Eleisah
Functional Area : ACA,AV Events
Description : JSON Example :
{
  "Building/Commercial/New Construction/NA": {
    "DocumentUploadAfter/BLD-S-DOCS/Site Plan": [
      {
        "preScript": " ",
        "customLists": {
          "CUSTOM LIST/Item Numer": "12345",
          "CUSTOM LIST/Item Description": "haetham",
          
        },
        "contactFields": {
          "contactType": "Applicant"
        },
        "workFlow": {
          "Intake": "In Progress|Rejected|Accepted",
          "Reviews": "Approved"
        },
        "isCreatedByACA": true,
        "balanceAllowed": true,
        "lpFields": {
          "licType": "Engineer",
          
        },
        "customFields": {
          "Job Value": "100",
          "Code": "KBC 2012"
        },
        "addressFields": {
          "zip": "12345",
          
        },
        "parcelFields": {
          "ParcelNumber": "00800"
        },
        "recordStatus": "Open",
        "activateTask": "Started Successfull|Started with issues|Failed To Start",
        "daysOut": "10",
        "deactivateTask": "Application Start",
        "deleteTask": "Failed To Start",
        "updateTask": "Started Successfull",
        "updateStatus": "Success",
        "invoiceFees": "true",
        "createChild": "Building/Commercial/Amman/amman55",
        "createParent": "Building/Commercial/Company/Amman04",
        "addCondition": "Test Condition",
        "addConditionSeverity": "Notice",
        "conditionType": "Notice",
        "removeCondition": "Test Condition",
        "addComment": "Test Comment",
        "newStatus": "Application Started",
        "assignToUserID": "AMMAN04",
        "assessFees": [
          {
            "feeSchedule": "FEEHAETHAMTEST",
            "feeCode": "P_FEE_010",
            "feeQuantity": 1,
            "feeInvoice": "Y",
            "feePeriod": "FINAL"
          },
          {
            "feeSchedule": "FEEHAETHAMTEST",
            "feeCode": "P_FEE_010",
            "feeQuantity": 1,
            "feeInvoice": "N",
            "feePeriod": "FINAL"
          }
        ],
        "postScript": ""
      }
    ]
  }
}
Available Types: contactFields, customFields, customLists, parcelFields, addressFields, lpFields,Appstatus
Available Attributes for each type:
- Custom Fields and Custom Lists: ALL
- Address: All Custom Attributes, (primaryFlag,houseNumberStart,streetDirection,streetName,streetSuffix,city,state,zip,addressStatus,county,country,addressDescription,xCoordinate,yCoordinate)
- Parcel: All Custom Attributes, (ParcelNumber,Section,Block,LegalDesc,GisSeqNo,SourceSeqNumber,Page,I18NSubdivision,CouncilDistrict,RefAddressTypes,ParcelStatus,ExemptValue,PublicSourceSeqNBR,CensusTract,InspectionDistrict,NoticeConditions,ImprovedValue,PlanArea,Lot,ParcelArea,Township,LandValue)
- Licensed Professional: All Custom Attributes, (licType,lastName,firstName,businessName,address1,city,state,zip,country,email,phone1,phone2,lastRenewalDate,licExpirationDate,FEIN,gender,birthDate)
- Contact: All Custom Attributes, (firstName,lastName,middleName,businessName,contactSeqNumber,contactType,relation,phone1,phone2,email,addressLine1,addressLine2,city,state,zip,fax,notes,country,fullName,peopleModel)

- assignToUserID: can be a userID, ex AMMAN04, 
or a constant with format $....$ that will be resolved during script execution, available types:
	- $CurrentUser$ : current back-office user
 */

try {
	// This should be included in all Configurable Scripts
	eval(getScriptText("CONFIGURABLE_SCRIPTS_COMMON"));

	eval(getScriptText("RUNAPPLICATIONSUBMITAFTEREVENT"));
	var settingsArray = [];
	isConfigurableScript(settingsArray, "RECORD_AUTOMATION");

	for (s in settingsArray) {
		var rules = settingsArray[s];
		var recordStatus = rules.recordStatus;
		var preScript = rules.preScript;
		var postScript = rules.postScript;
		var daysOut = rules.daysOut;
		var activateTasks = rules.activateTask;
		var deactivateTasks = rules.deactivateTask;
		var deleteTasks = rules.deleteTask;
		var updateTasks = rules.updateTask;
		var updateStatus = rules.updateStatus;
		var invoiceFees = rules.invoiceFees;
		var createChild = rules.createChild;
		var createParentOfType = rules.createParent;
		var addConditions = rules.addCondition;
		var removeCondition = rules.removeCondition;
		var addComment = rules.addComment;
		var newStatus = rules.newStatus;
		var conditionType = rules.addConditionType;
		var removeConditionType = rules.removeConditionType;
		var addConditionSeverity = rules.addConditionSeverity;
		var assignToUserID = rules.assignToUserID;
		var assessFeesArray = rules.assessFees;
		var isCreatedByACA = rules.isCreatedByACA;
		var wfRules = rules.workFlow;
		var balanceAllowed = rules.balanceAllowed;
		// run preScript
		if (!matches(preScript, null, "")) {
			eval(getScriptText(preScript, null, false));
		}

		// / this to check if all Rules if is matched.
		if (isJsonRulesMatchRecordData(rules) && isCapStatusMatchRules(recordStatus) && CheckCreatedByACA(isCreatedByACA) && wfTaskCheck(wfRules) && balanceCheck(balanceAllowed)) {
			RecordAutomation();
		}

		if (cap.isCreatedByACA() == isCreatedByACA && workflowResult && balanceCheck(balanceAllowed) && checkIsAcaEvent(isACAEvent)) {

		}

	}

} catch (ex) {

	logDebug("**ERROR:Exception while verificaiton the rules" + ex);
}

function CheckCreatedByACA(isCreatedByACA) {

	if (isCreatedByACA == 'true') {
		return cap.isCreatedByACA();
	} else if (isCreatedByACA == 'false') {
		return !cap.isCreatedByACA();
	} else {
		return true;
	}

}

function balanceCheck(balanceAllowed) {
	var capDetails = aa.cap.getCapDetail(capId).getOutput();

	if (balanceAllowed == "false") {
		if (capDetails.getBalance() == 0) {
			return true;
		} else {
			return false;
		}
	} else {
		return true;
	}

}

function wfTaskCheck(wfRules) {
	var status = true;
	var results = [];

	for (i in wfRules) {
		/*
		 * aa.print("i " + i); aa.print("wfRules[i] " + wfRules[i]);
		 */
		var currentTask = i;
		var splitedStatus = {};
		splitedStatus = wfRules[i].split("|");

		for (x in splitedStatus) {
			if (!isTaskStatus(currentTask, splitedStatus[x])) {
				results[currentTask] = false;
			} else {
				results[currentTask] = true;
				break;
			}
		}
	}

	for (y in results) {
		if (results[y] == false) {
			status = false;
		}
	}
	return status;

}

// / this function to change the record based on the actions on the JSON.
function RecordAutomation() {
	// this when rules is matched;
	if (activateTasks != "" && activateTasks != null) {
		var TasksToActivateArray = activateTasks.split("|");
		for ( var t in TasksToActivateArray) {
			// this to check if task is exists.
			var taskResult = aa.workflow.getTask(capId, TasksToActivateArray[t]);
			var currentTask = taskResult.getOutput();
			if (currentTask != null && currentTask != "") {
				activateTask(TasksToActivateArray[t]);
				// this to check if daysOut is exists or not.
				if (daysOut != null && daysOut != "" && parseInt(daysOut) > 0) {
					editTaskDueDate(TasksToActivateArray[t], getDueDate());
				}
			}
		}
	}

	if (deactivateTasks != "" && deactivateTasks != null) {
		var TasksToDeActivateArray = deactivateTasks.split("|");
		for ( var t in TasksToDeActivateArray) {
			//this to check if task is exists.
			var taskResult = aa.workflow.getTask(capId, String(TasksToDeActivateArray[t]));
			if (taskResult.getSuccess()) {
				var currentTask = taskResult.getOutput();
				if (currentTask != null && currentTask != "") {
					if (isTaskActive(TasksToDeActivateArray[t]))
						deactivateTask(TasksToDeActivateArray[t]);
				}
			}

		}
	}

	if (deleteTasks != "" && deleteTasks != null) {
		var TasksToDeleteArray = deleteTasks.split("|");
		for ( var t in TasksToDeleteArray) {
			// this to check if task is exists.
			var taskResult = aa.workflow.getTask(capId, TasksToDeleteArray[t]);
			var currentTask = taskResult.getOutput();
			if (currentTask != null && currentTask != "")
				deleteTask(capId, TasksToDeleteArray[t]);
		}
	}
	if (updateTasks != "" && updateTasks != null) {
		var TasksToUpdateArray = updateTasks.split("|");
		var StatusToUpdateArray = updateStatus.split("|");
		for ( var t in TasksToUpdateArray) {
			if (isTaskActive(TasksToUpdateArray[t])) {
				// this to check if task is exists.
				var taskResult = aa.workflow.getTask(capId, TasksToUpdateArray[t]);
				var currentTask = taskResult.getOutput();
				if (currentTask != null && currentTask != "") {
					currentTask.setSysUser(aa.person.getCurrentUser().getOutput());
					currentTask.setDisposition(StatusToUpdateArray[t]);
					var updateResult = aa.workflow.handleDisposition(currentTask.getTaskItem(), capId);
				}
			}
		}
	}
	// this to check if there is new app status or not.
	if (newStatus != "" && newStatus != null)
		updateAppStatus(newStatus, 'by script');
	// this to check if there is new condition to be added or not.
	if (addConditions != "" && addConditions != null && cap.isCompleteCap()) {
		addAppCondition(conditionType, "Applied", addConditions, addConditions, addConditionSeverity);
	}
	// this to check if there is condition to be removed or not.
	if (removeCondition != "" && removeCondition != null && cap.isCompleteCap()) {
		removeCapCondition(removeConditionType, removeCondition);
	}
	// this to check if there is comment to be added or not.
	if (addComment != "" && addComment != null && cap.isCompleteCap())
		createCapComment(addComment);

	// this to check if there is parent record to be added or not.
	if (createParentOfType != "" && createParentOfType != null && cap.isCompleteCap()) {
		var parentRecordStucture = createParentOfType.split("/");
		if (parentRecordStucture.length == 4) {
			var appCreateResult = aa.cap.createApp(parentRecordStucture[0], parentRecordStucture[1], parentRecordStucture[2], parentRecordStucture[3], "");
			if (appCreateResult.getSuccess()) {
				var newId = appCreateResult.getOutput();
				aa.cap.createAppHierarchy(newId, capId);
				RunApplicationSubmitAfterEvent(newId);

			}
		}
	}
	// this to check if there is child record to be added or not.
	if (createChild != "" && createChild != null) {
		var childRecordStucture = createChild.split("/");
		if (childRecordStucture.length == 4) {
			var appCreateResult = aa.cap.createApp(childRecordStucture[0], childRecordStucture[1], childRecordStucture[2], childRecordStucture[3], "");
			if (appCreateResult.getSuccess()) {
				var newId = appCreateResult.getOutput();
				var newCap = aa.cap.getCap(newId).getOutput();
				aa.cap.createAppHierarchy(capId, newId);
				RunApplicationSubmitAfterEvent(newId);

			}
		}
	}
	// this to check if there is fees to be invoiced or not.
	if (invoiceFees) {
		var feesArray = loadFees();
		for ( var i in feesArray) {
			invoiceFeeCustom(feesArray[i].code, feesArray[i].period);
		}
	}

	// // this to assign the provided user to the record
	if (assignToUserID != null && assignToUserID != "") {

		//check if ($___$ Constant user)
		var idx1 = assignToUserID.indexOf("$");//startsWith
		var idx2 = assignToUserID.indexOf("$", idx1 + 1);//endsWith
		if (idx1 == 0 && idx2 == assignToUserID.length - 1) {

			//Add more 'else if(assignToUserID.equalsIgnoreCase...)' for other constants $$ (if needed) 
			if (assignToUserID.equalsIgnoreCase("$CurrentUser$")) {
				assignToUserID = aa.getAuditID();
			}
		}//startsWith$ && endsWith$

		var capDetails = aa.cap.getCapDetail(capId).getOutput();
		if (capDetails != null) {
			capDetails = capDetails.getCapDetailModel();
			var assignedUser = aa.person.getUser(assignToUserID).getOutput();
			capDetails.setAsgnDept(assignedUser.getDeptOfUser());
			capDetails.setAsgnStaff(assignToUserID);
			var updateCapDetailsResult = aa.cap.editCapDetail(capDetails);
		}
	}

	if (assessFeesArray != null && assessFeesArray != "") {
		for ( var i in assessFeesArray) {
			var feeCode = assessFeesArray[i]["feeCode"];
			var feeSchedule = assessFeesArray[i]["feeSchedule"];
			var feeQuantity = parseInt(assessFeesArray[i]["feeQuantity"]);
			var feeInvoice = assessFeesArray[i]["feeInvoice"];
			var feePeriod = assessFeesArray[i]["feePeriod"];
			var feeSchduleList = aa.finance.getFeeScheduleList("").getOutput();
			for ( var i in feeSchduleList) {
				if (feeSchduleList[i].getFeeSchedule() == feeSchedule) {
					addFee(feeCode, feeSchedule, feePeriod, feeQuantity, feeInvoice, capId);
				}
			}

		}
	}
	// / run post script
	if (!matches(postScript, null, "")) {
		eval(getScriptText(postScript, null, false));
	}
}

// / this function to take the current date and add the days out days and format
// the result as MM/dd/yyyy
function getDueDate() {
	var today = new Date();
	today.setDate(today.getDate() + parseInt(daysOut));
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	var yy = today.getFullYear();
	var formatedDate = mm + '/' + dd + '/' + yy;
	return formatedDate;
}
