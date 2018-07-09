/*
Title : Inspection Automation (After) 
Purpose : To perform a set of action based on inspection result
Author: Yazan Barghouth 
 
 Functional Area : AV
 
 JSON Example : 
{
  "Marijuana/Combo/Testing Facility/Application": {
    "InspectionResultSubmitAfter": [
      {
        "metadata": {
          "description": "To perform a set of action based on inspection result",
          "operators": {
            "caseFailureStatus":"!="
          }
        },
        "criteria": {
          "inspectionTypePerformed": [
            "Initial Facility Insp"
          ],
          "inspectionResult": [
            "Passed"
          ]
        },
        "action": {
          "costRangeType": "Days",
          "costRange": 0,
          "costFeeType": "",
          "costFeeSchedule": "",
          "costFeeName": "",
          "costFeeAmount": 0,
          "newAppStatus": "In Review",
          "caseCreationType": "Status",
          "caseFailureStatus": [
            "Passed"
          ],
          "caseType": "Marijuana/Combo/Testing Facility/Application",
          "caseCopyComments": false,
          "inspectionType": "Marijuana Inspector",
          "inspectionCopyComment": false,
          "rangeType": "Days",
          "range": "10",
          "sameInspector": false,
          "createCondition": "",
          "createConditionType": "",
          "createConditionSeverity": "",
          "feeSchedule": "",
          "feeName": "",
          "feeAmount": 0,
          "taskName": "Intake",
          "taskStatus": "In Progress",
          "removeCondition": "",
          "removeConditionType": "",
          "expirationTypeUpdate":"Expiration Code",
          "expirationDaysToAdvance":"30"
        },
        "preScript": "",
        "postScript": ""
      }
    ]
  }
}
Notes:
	- new property added 'newAppStatus': update record status if Event criteria matched (set empty to ignore)
	- new property added 'inspectionCopyComment': copy current inspection's result to the new scheduled inspection(if any)
		inspectionCopyComment: true/false
	
	- new property added: 'expirationTypeUpdate' update expiration date of record, options: 'Expiration Code' or 'ASI:asi_filed_name'
		in case of 'ASI', it can be with or without subgroup, example, 'ASI:subgroupName.fieldName' OR 'ASI:asiFieldName'
	- new property added: 'expirationDaysToAdvance' : days to add to current date (now) and update expiration
	
	property 'caseFailureStatus' is supported with operators
 * 
 */
var scriptSuffix = "INSPECTION_AUTOMATION";
eval(getScriptText("CONFIGURABLE_SCRIPTS_COMMON"));

var settingsArray = [];
if (isConfigurableScript(settingsArray, scriptSuffix)) {
	for (s in settingsArray) {

		var rules = settingsArray[s];

		//Execute PreScript
		var preScript = rules.preScript;
		if (!matches(preScript, null, "")) {
			eval(getScriptText(preScript));
		}
		if (cancelCfgExecution) {
			logDebug("**WARN STDBASE Script [" + scriptSuffix + "] canceled by cancelCfgExecution");
			cancelCfgExecution = false;
			continue;
		}

		inspectionAutomation(rules);

		var postScript = rules.postScript;
		//Execute PostScript
		if (!matches(postScript, null, "")) {
			eval(getScriptText(postScript)); // , null, false ???
		}

	}// for all settings
}// isConfigurableScript()

function inspectionAutomation(rules) {

	if (!isEmptyOrNull(rules.action.costRangeType) && !isEmptyOrNull(rules.action.costFeeSchedule) && !isEmptyOrNull(rules.action.costFeeName)
			&& !isEmptyOrNull(rules.action.costFeeType)) {
		var costRangeDays = calculateUnifiedRange(rules.action.costRangeType, rules.action.costRange);
		var totalInspecs = 0;
		var inspecs = aa.inspection.getInspections(capId).getOutput();

		var now = new Date();
		for (i in inspecs) {
			if (inspecs[i].getInspectionDate() == null || inspecs[i].getInspectionDate() == "") {
				continue;
			}

			if (dateDiff(inspecs[i].getInspectionDate(), now) <= costRangeDays) {
				++totalInspecs;
			}
		}//for all inspections

		var calculatedFeeCost = 0;
		if (totalInspecs > 0) {
			if (rules.action.costFeeType.equalsIgnoreCase("once")) {
				calculatedFeeCost = rules.action.costFeeAmount;
			} else if (rules.action.costFeeType.equalsIgnoreCase("each")) {
				calculatedFeeCost = rules.action.costFeeAmount * totalInspecs;
			}
			addFee(rules.action.costFeeName, rules.action.costFeeSchedule, "FINAL", calculatedFeeCost, "Y");
		}
	}//can process cost fee

	if (!isEmptyOrNull(rules.action.newAppStatus)) {
		updateAppStatus(rules.action.newAppStatus, "by script");
	}

	var createCase = false;

	if (!isEmptyOrNull(rules.action.caseCreationType) && !isEmptyOrNull(rules.action.caseFailureStatus)) {
		var failurStats = rules.action.caseFailureStatus;
		if (rules.action.caseCreationType.equalsIgnoreCase("Status")) {
			for (fs in failurStats) {
				if (failurStats[fs].equalsIgnoreCase(inspResult)) {
					createCase = true;
					break;
				}
			}
		} else if (rules.action.caseCreationType.equalsIgnoreCase("Checklist")) {
			var chkListResutArray = loadGuideSheetItems(inspId);
			for (cr in chkListResutArray) {
				for (fs in failurStats) {
					if (failurStats[fs].equalsIgnoreCase(chkListResutArray[cr])) {
						createCase = true;
						break;
					}
				}//for fs
				if (createCase) {
					break;
				}
			}//for chkListResutArray
		}//checklist
	}
	//check if it has operators
	createCase = evaluateBoolean(createCase, getLogicalOp(rules, "caseFailureStatus"));
	if (createCase) {
		var recordTypeArray = rules.action.caseType.split("/");
		var appCreateResult = aa.cap.createApp(recordTypeArray[0], recordTypeArray[1], recordTypeArray[2], recordTypeArray[3], "InspectionAutomation-Failed");

		if (appCreateResult.getSuccess()) {
			var newId = appCreateResult.getOutput();

			//copy inspComments
			if (rules.action.caseCopyComments) {
				createCapComment(inspComment, newId);//inspResultComment
			}
			aa.cap.createAppHierarchy(capId, newId);
		} else {
			logDebug("**WARN: ERROR InspectionAutomationScript Creating App [" + rules.caseType + "] err:" + appCreateResult.getErrorMessage());
		}
	}
	if (!isEmptyOrNull(rules.action.inspectionType) && !isEmptyOrNull(rules.action.sameInspector) && !isEmptyOrNull(rules.action.rangeType) && !isEmptyOrNull(rules.action.range)
			&& !isEmptyOrNull(rules.action.inspectionCopyComment)) {

	var currInspector = null;
		schedInspection(rules.action.inspectionType, rules.action.sameInspector, rules.action.rangeType, rules.action.range, rules.action.inspectionCopyComment);
	}//inspection params validation

	if (!isEmptyOrNull(rules.action.createConditionType) && !isEmptyOrNull(rules.action.createCondition) && !isEmptyOrNull(rules.action.createConditionSeverity)) {
		addAppCondition(rules.action.createConditionType, "Applied", rules.action.createCondition, rules.action.createCondition, rules.action.createConditionSeverity);
	}

	if (!isEmptyOrNull(rules.action.feeName) && !isEmptyOrNull(rules.action.feeSchedule) && !isEmptyOrNull(rules.action.feeAmount)) {
		addFee(rules.action.feeName, rules.action.feeSchedule, "FINAL", rules.action.feeAmount, "Y");
	}

	if (!isEmptyOrNull(rules.action.taskName) && !isEmptyOrNull(rules.action.taskStatus)) {
		updateTaskHandleDisposition(rules.action.taskName, rules.action.taskStatus);
	}

	if (!isEmptyOrNull(rules.action.removeConditionType) && !isEmptyOrNull(rules.action.removeCondition)) {
		removeCapCondition(rules.action.removeConditionType, rules.action.removeCondition);
	}

	if (!isEmptyOrNull(rules.action.expirationTypeUpdate) && !isEmptyOrNull(rules.action.expirationDaysToAdvance)) {
		var newExpDate = dateAdd(new Date(), parseInt(rules.action.expirationDaysToAdvance));

		if (rules.action.expirationTypeUpdate.equalsIgnoreCase("Expiration Code")) {
			var rB1ExpResult = aa.expiration.getLicensesByCapID(capId).getOutput();
			rB1ExpResult.setExpDate(aa.date.parseDate(newExpDate));
			var updated = aa.expiration.editB1Expiration(rB1ExpResult.getB1Expiration());
		} else if (String(rules.action.expirationTypeUpdate).toLowerCase().indexOf("asi") == 0) {
			var asiFieldName = String(rules.action.expirationTypeUpdate);
			asiFieldName = asiFieldName.substring(4, rules.action.expirationTypeUpdate.length);//4 is len of 'asi:'
			var olduseAppSpecificGroupName = useAppSpecificGroupName;
			useAppSpecificGroupName = asiFieldName.indexOf(".") != -1;//support group.field and field
			editAppSpecific(asiFieldName, newExpDate);
			useAppSpecificGroupName = olduseAppSpecificGroupName;
		} else {
			logDebug("**WARN unsupported expirationTypeUpdate " + rules.action.expirationTypeUpdate);
		}
	}//has expirationTypeUpdate
}

/**
 * this is identical to ACCELA_FUNCTIONS version, except we replace all "**ERROR" with "**INFO"
 * from logDebug() because **ERROR causes a rollback, which we don't want.
 * */
function autoAssignInspectionLocal(e) {
	iObjResult = aa.inspection.getInspection(capId, e);
	if (!iObjResult.getSuccess()) {
		logDebug("**INFO retrieving inspection " + e + " : " + iObjResult.getErrorMessage());
		return false
	}
	iObj = iObjResult.getOutput();
	inspTypeResult = aa.inspection.getInspectionType(iObj.getInspection().getInspectionGroup(), iObj.getInspectionType());
	if (!inspTypeResult.getSuccess()) {
		logDebug("**INFO retrieving inspection Type " + inspTypeResult.getErrorMessage());
		return false
	}
	inspTypeArr = inspTypeResult.getOutput();
	if (inspTypeArr == null || inspTypeArr.length == 0) {
		logDebug("**INFO no inspection type found");
		return false
	}
	inspType = inspTypeArr[0];
	inspSeq = inspType.getSequenceNumber();
	inspSchedDate = iObj.getScheduledDate().getYear() + "-" + iObj.getScheduledDate().getMonth() + "-" + iObj.getScheduledDate().getDayOfMonth();
	logDebug(inspSchedDate);
	iout = aa.inspection.autoAssignInspector(capId.getID1(), capId.getID2(), capId.getID3(), inspSeq, inspSchedDate);
	if (!iout.getSuccess()) {
		logDebug("**INFO retrieving auto assign inspector " + iout.getErrorMessage());
		return false
	}
	inspectorArr = iout.getOutput();
	if (inspectorArr == null || inspectorArr.length == 0) {
		logDebug("**INFO no auto-assign inspector found");
		return false
	}
	inspectorObj = inspectorArr[0];
	iObj.setInspector(inspectorObj);
	assignResult = aa.inspection.editInspection(iObj);
	if (!assignResult.getSuccess()) {
		logDebug("**INFO re-assigning inspection " + assignResult.getErrorMessage());
		return false
	} else
		logDebug("Successfully reassigned inspection " + iObj.getInspectionType() + " to user " + inspectorObj.getUserID())
}

function updateTaskHandleDisposition(taskNamee, newStatus) {
	var taskResult = aa.workflow.getTask(capId, taskNamee);
	var currentTask = taskResult.getOutput();
	if (currentTask != null && currentTask != "") {
		currentTask.setDisposition(newStatus);
		var updateResult = aa.workflow.handleDisposition(currentTask.getTaskItem(), capId);
	}
}
function calculateUnifiedRange(costRangeType, costRange) {
	if (costRangeType.equalsIgnoreCase("months")) {
		return 30 * costRange;
	} else if (costRangeType.equalsIgnoreCase("days")) {
		return costRange;
	} else if(costRangeType.equalsIgnoreCase("workingdays")){
		var workingDaysDateStr = dateAdd(null, 7, true);
		var workingDaysDate = aa.util.parseDate(workingDaysDateStr);
		var todaySDT = aa.util.parseDate(dateAdd(null, 0));
		return days_between(workingDaysDate, todaySDT);
	}
	
}

function schedInspection(inspecType, sameInspector, rangeType, rangeValue, inspectionCopyComment) {

	if (typeof inspectionCopyComment === 'undefined' || inspectionCopyComment == null) {
		inspectionCopyComment = false;
	}

	var currInspector = null;
	if (sameInspector) {
		if (inspId != null) {
			var inspResultObj = aa.inspection.getInspection(capId, inspId);
			if (inspResultObj.getSuccess()) {
				var currentInp = inspResultObj.getOutput();
				var inspUserObj = aa.person.getUser(currentInp.getInspector().getFirstName(), currentInp.getInspector().getMiddleName(), currentInp.getInspector().getLastName())
						.getOutput();
				currInspector = inspUserObj.getUserID();
			}
		}
	}

	var now = new Date();
	var inspRangeDays = calculateUnifiedRange(rangeType, rangeValue);

	var newInspComments = null;
	if (inspectionCopyComment && typeof inspComment !== 'undefined' && inspComment != "") {
		newInspComments = inspComment;
	}
	//re-sched inspection
	if (currInspector != null) {
		scheduleInspection(inspecType, parseInt(inspRangeDays), currInspector, null, newInspComments);
	} else {
		scheduleInspection(inspecType, parseInt(inspRangeDays), null, null, newInspComments);

		var inspects = aa.inspection.getInspections(capId);
		if (inspects.getSuccess()) {
			inspects = inspects.getOutput();
			inspects.sort(compareInspDateDesc);

			if (inspects != null && inspects.length > 0 && inspects[0] != null) {
				//assign inspector for last-sched inspection
				try {
					autoAssignInspectionLocal(inspects[inspects.length - 1].getIdNumber());
				} catch (ex) {
					logDebug(ex);
				}
			}//inspects !null
		}//success
	}
}