var ENVIRON = "DEV";
var EMAILREPLIES = "noreply@auroragov.org";
var SENDEMAILS = true;
var ACAURL = "https://awebdev.aurora.city/CitizenAccess/";


//set Debug
var vDebugUsers = ['EWYLAM','ADMIN','JSCHILLO','EVONTRAPP'];
if (exists(currentUserID,vDebugUsers)) {
	showDebug = 3;
	showMessage = true;
}

/**
 * Activate a Task, set Complete=N, and assign cap staff to the Task
 * @param workFlowTaskArray {Array}
 * @param workflowStatusArray {Array}
 * @param taskNameToActivate
 * @returns {Boolean} true if wfTask and status matched, and if updates succeeded, false otherwise 
 */
function activateAndAssignWfTask(workFlowTaskArray, workflowStatusArray, taskNameToActivate) {

	var statusMatch = false;

	//check Tasks
	for (w in workFlowTaskArray) {
		if (wfTask == workFlowTaskArray[w]) {
			statusMatch = true;
			break;
		}
	}//for all workFlowTaskArray
	if (!statusMatch) {
		return false;
	}

	//check Status
	for (s in workflowStatusArray) {
		if (wfStatus == workflowStatusArray[s]) {
			statusMatch = true;
			break;
		}
	}//for all status options
	if (!statusMatch) {
		return false;
	}

	var task = aa.workflow.getTask(capId, taskNameToActivate);
	if (task.getSuccess())
		task = task.getOutput();

	task.setActiveFlag("Y");
	task.setCompleteFlag("N");
	task.setDisposition(null);//makes Status = In Progress
	var edited = aa.workflow.editTask(task);
	if (!edited.getSuccess()) {
		logDebug("**WARN editTask failed, error:" + edited.getErrorMessage());
	}//edit success?

	var capDetails = aa.cap.getCapDetail(capId).getOutput();
	var recordStaff = capDetails.getAsgnStaff();

	if (recordStaff == null || recordStaff == "") {
		logDebug("**WARN No staff assigned on record:");
		return false;
	}
	recordStaff = aa.person.getUser(recordStaff);
	if (!recordStaff.getSuccess()) {
		logDebug("**WARN failed to getUser for Staff:" + recordStaff);
		return false;
	}
	recordStaff = recordStaff.getOutput();

	task.getTaskItem().setAssignedUser(recordStaff);
	edited = aa.workflow.assignTask(task.getTaskItem());
	if (!edited.getSuccess()) {
		logDebug("**WARN assignTask failed, error:" + edited.getErrorMessage());
		return false;
	}//edit success?
	return true;
}

// Activate a value in an SC or add if it doesn't exits
function activateSCRow(stdChoiceName, stdChoiceValue){
	var bizDomainResult = aa.bizDomain.getBizDomainByValue(stdChoiceName, stdChoiceValue);

	if (bizDomainResult.getSuccess()) {
	    bizDomainResult = bizDomainResult.getOutput();
	    if (bizDomainResult != null && bizDomainResult.getBizDomain().getAuditStatus() == "I") {//exist and active
	    	var bizModel = bizDomainResult.getBizDomain();
	    	bizModel.setAuditStatus("A");
	    	var edit = aa.bizDomain.editBizDomain(bizModel, "en_US");
	    	if (!edit.getSuccess()) {
	    		logDebug("SD edit failed, Error: " + edit.getErrorMessage());
	    		return false;
	    	}
	    }
	    return true;
	}
	else{//It doesn't exist add it
		editLookup(stdChoiceName,stdChoiceValue,"used when there is nothing in the list - made inactive or deleted once 1 items is added to the list via script");
	}
}
function activateWFTask(wfstr,ItemCapId) 
{
	var workflowResult = aa.workflow.getTaskItems(ItemCapId, wfstr, null, null, null, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase())) {
			var stepnumber = fTask.getStepNumber();
			aa.workflow.adjustTask(ItemCapId, stepnumber, "Y", "N", null, null)
			logMessage("Activating Workflow Task: " + wfstr);
			logDebug("Activating Workflow Task: " + wfstr);
		}
	}
}
 

/**
 * Activate workflow tasks based on the Status of other Tasks
 * @returns {Boolean}
 */
function activateWorkflowTasks() {
    logDebug("activateWorkflowTasks() started");
    var $iTrc = ifTracer;
    var reviewTasksAry = [ "Structural Plan Review", "Electrical Plan Review", "Mechanical Plan Review", "Plumbing Plan Review", "Bldg Life Safety Review", "Fire Life Safety Review",
            "Structural Engineering Review" ];

    var activeReviewTasksAry = [ "Real Property Review", "Water Review", "Zoning Review", "Traffic Review", "Forestry Review" ];

    var wfTasks = aa.workflow.getTaskItems(capId, null, null, null, null, null);
    if (!wfTasks.getSuccess()) {
        logDebug("WARNING: Unable to get tasks.");
        return false;
    }
    wfTasks = wfTasks.getOutput();

    var allMatched = true;

    for (r in reviewTasksAry) {
        for (w in wfTasks) {
            var task = wfTasks[w];
            if (task.getTaskDescription() != reviewTasksAry[r]) {
                continue;
            }
            allMatched = allMatched && (task.getDisposition() == "Approved" || task.getDisposition() == "Not Required");
            break;
        }//for all cap tasks

        if (!allMatched) {
            break;
        }
    }//for reviewTasksAry

    //Check if taskStatus of Quality Check is not Approved, if it is then no need to activate it again.
    //If the current task being activated is Quality Check, then no need check if needs to be activated.
    if($iTrc(wfTask != "Quality Check", 'wfTask != "Quality Check"'))
        if ($iTrc(allMatched && !isTaskStatus("Quality Check", "Approved"), 'allTasks && Quality Check not resulted as Approved')) {
            activateTask("Quality Check");
        }

    allMatched = true;
    for (r in activeReviewTasksAry) {
        for (w in wfTasks) {
            var task = wfTasks[w];
            if (task.getTaskDescription() != activeReviewTasksAry[r]) {
                continue;
            }
            allMatched = allMatched && (task.getDisposition() == "Approved" || task.getDisposition() == "Not Required");
            break;
        }//for all cap tasks

        if (!allMatched) {
            break;
        }
    }//for reviewTasksAry

    var engineeringReviewMatched = true;
    var wasteWaterReviewMatched = true;
    var qualityCheckMatched = true;

    if (allMatched) {
        //stage 2, check other tasks:
        for (w in wfTasks) {
            var task = wfTasks[w];
            if (task.getTaskDescription() == "Engineering Review") {
                engineeringReviewMatched = engineeringReviewMatched
                        && (task.getDisposition() == "Approved" || task.getDisposition() == "Approved with FEMA Cert Required" || task.getDisposition() == "Not Required");
            }

            if (task.getTaskDescription() == "Waste Water Review") {
                wasteWaterReviewMatched = wasteWaterReviewMatched
                        && (task.getDisposition() == "Approved" || task.getDisposition() == "Approved Inspection Required" || task.getDisposition() == "Not Required");
            }

            if (task.getTaskDescription() == "Quality Check") {
                qualityCheckMatched = qualityCheckMatched && task.getDisposition() == "Approved";
            }
        }//for all cap tasks

        if($iTrc(wfTask != "Fee Processing", 'wfTask != "Fee Processing"'))
            if ($iTrc(engineeringReviewMatched && wasteWaterReviewMatched && qualityCheckMatched && !isTaskComplete("Fee Processing"), 'engineeringReviewMatched && wasteWaterReviewMatched && qualityCheckMatched && !isTaskComplete("Fee Processing")')) {
                activateTask("Fee Processing");
            }

    }//allMatched

    logDebug("activateWorkflowTasks() ended");
    return true;
}
/**
 * if a document uploaded with type equals documentTypeUploaded, update all tasks that have status wfStatusNamesArray to newTaskStatus and activate
 * @param documentTypeUploaded
 * @param wfStatusNamesArray
 * @param newTaskStatus
 * @returns {Boolean}
 */
function ActivateWorkflowTasksBasedOnDocumentUpload(documentTypeUploaded, wfStatusNamesArray, newTaskStatus) {
	if (typeof documentModelArray !== 'undefined' && documentModelArray == null || documentModelArray.length == 0) {
		return false;
	}
	for (var d = 0; d < documentModelArray.size(); d++) {
		if (documentModelArray.get(d).getDocCategory().equalsIgnoreCase(documentTypeUploaded)) {
			//if docType matched, no need to complete the loop
			return updateTaskStatusAndActivate(wfStatusNamesArray, newTaskStatus);
		}
	}
	return false;
} 

// return true or false.
// Check if there active records on the given standard choice
function activeRecsOnBizDomain(stdChoiceName){
	var actRecs = false;
	var bizDomainResult = aa.bizDomain.getBizDomain(stdChoiceName);
	
	if (!bizDomainResult.getSuccess()) {
		aa.print("bizDomainResult failed in activeRecsOnBizDomain()" + bizDomainResult.getErrorMessage());
		return false;
	}
	
	bizDomain = bizDomainResult.getOutput().toArray();
	if(bizDomain != null){
		if(bizDomain.length > 0) actRecs = true;
	}
	
	return actRecs;
}
function addACAUrlsVarToEmail(vEParams) {
	//Get base ACA site from standard choices
	var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
	acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));

	//Save Base ACA URL
	addParameter(vEParams,"$$acaURL$$",acaSite);

	//Save Record Direct URL
	addParameter(vEParams,"$$acaRecordURL$$",acaSite + getACAUrl());
}
function addACAUrlsVarToEmail(vEParams) {
	//Get base ACA site from standard choices
	var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
	acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));

	//Save Base ACA URL
	addParameter(vEParams,"$$acaURL$$",acaSite);

	//Save Record Direct URL
	addParameter(vEParams,"$$acaRecordURL$$",acaSite + getACAUrl());
}
function addAddressByParcel(){
	var capParcelResult = aa.parcel.getParcelandAttribute(capId, null);
	if (capParcelResult.getSuccess()){
		var fcapParcelObj = capParcelResult.getOutput().toArray();
	}
		
	else
		{ logDebug("**ERROR: Failed to get Parcel object: " + capParcelResult.getErrorType() + ":" + capParcelResult.getErrorMessage()); return false; }

	var serviceProviderCode = aa.getServiceProviderCode();
	var currentUserID = aa.getAuditID();
	
	for (i in fcapParcelObj)
	{
		parcelNum = fcapParcelObj[i].getParcelNumber();
		var addResult=aa.address.getAddressListForAdmin(parcelNum,"","","","","","","","","","","","","");
		if (addResult.getSuccess()){
			addressList=addResult.getOutput();
			
			for (add in addressList){
				refAddressModel=addressList[add].getRefAddressModel();
				primFlag=refAddressModel.getPrimaryFlag();		
				var newAddressModel = refAddressModel.toAddressModel();
				newAddressModel.setCapID(capId);
				newAddressModel.setServiceProviderCode(serviceProviderCode);
				newAddressModel.setAuditID(currentUserID);
				newAddressModel.setPrimaryFlag(primFlag);
		        
				//Create new address for cap.
				var result=aa.address.createAddress(newAddressModel);
				
		}
			
		}
	}
	
}

function addAdHocTaskAssignDept(adHocProcess, adHocTask, adHocNote, vAsgnDept) {
//adHocProcess must be same as one defined in R1SERVER_CONSTANT
//adHocTask must be same as Task Name defined in AdHoc Process
//adHocNote can be variable
//vAsgnDept Assigned to Department must match an AA Department
//Optional 5 parameters = CapID
//Optional 6 parameters = Due Date
	var thisCap = capId;
	var dueDate = aa.util.now();
	if(arguments.length > 4){
		thisCap = arguments[4] != null && arguments[4] != "" ? arguments[4] : capId;
	}
	if (arguments.length > 5) {
		var dateParam = arguments[5];
		if (dateParam != null && dateParam != "") { dueDate = convertDate(dateParam); }
	}

	var departSplits = vAsgnDept.split("/");
	var assignedUser = aa.person.getUser(null,null,null,null,departSplits[0],departSplits[1],departSplits[2],departSplits[3],departSplits[4],departSplits[5]).getOutput();
	assignedUser.setDeptOfUser(aa.getServiceProviderCode() + "/" + vAsgnDept);
	
	var taskObj = aa.workflow.getTasks(thisCap).getOutput()[0].getTaskItem()
	taskObj.setProcessCode(adHocProcess);
	taskObj.setTaskDescription(adHocTask);
	taskObj.setDispositionNote(adHocNote);
	taskObj.setProcessID(0);
	taskObj.setAssignmentDate(aa.util.now());
	taskObj.setDueDate(dueDate);
	taskObj.setAssignedUser(assignedUser);
	wf = aa.proxyInvoker.newInstance("com.accela.aa.workflow.workflow.WorkflowBusiness").getOutput();
	wf.createAdHocTaskItem(taskObj);
	return true;
}
function addAdHocTaskAssignDept_COA(adHocProcess, adHocTask, adHocNote, vAsgnDept) {
//adHocProcess must be same as one defined in R1SERVER_CONSTANT
//adHocTask must be same as Task Name defined in AdHoc Process
//adHocNote can be variable
//vAsgnDept Assigned to Department must match an AA Department
//Optional 5 parameters = CapID
//Optional 6 parameters = Due Date
	var thisCap = capId;
	var dueDate = aa.util.now();
	if(arguments.length > 4){
		thisCap = arguments[4] != null && arguments[4] != "" ? arguments[4] : capId;
	}
	if (arguments.length > 5) {
		var dateParam = arguments[5];
		if (dateParam != null && dateParam != "") { dueDate = convertDate(dateParam); }
	}

	var departSplits = vAsgnDept.split("/");
	var assignedUser = aa.person.getUser(null,null,null,null,departSplits[0],departSplits[1],departSplits[2],departSplits[3],departSplits[4],departSplits[5]).getOutput();
	assignedUser.setDeptOfUser("AURORACO/" + vAsgnDept);
	
	var taskObj = aa.workflow.getTasks(thisCap).getOutput()[0].getTaskItem()
	taskObj.setProcessCode(adHocProcess);
	taskObj.setTaskDescription(adHocTask);
	taskObj.setDispositionNote(adHocNote);
	taskObj.setProcessID(0);
	taskObj.setAssignmentDate(aa.util.now());
	taskObj.setDueDate(dueDate);
	taskObj.setAssignedUser(assignedUser);
	wf = aa.proxyInvoker.newInstance("com.accela.aa.workflow.workflow.WorkflowBusiness").getOutput();
	wf.createAdHocTaskItem(taskObj);
	return true;
}

/**
* Add ASIT rows data, format: Array[Map<columnName, columnValue>]
**/
function addAppSpecificTableInforsCustom(tableName, capIDModel, asitFieldArray/** Array[Map<columnName, columnValue>] **/)
{
    if (asitFieldArray == null || asitFieldArray.length == 0)
    {
        return;
    }

    var asitTableScriptModel = aa.appSpecificTableScript.createTableScriptModel();
    var asitTableModel = asitTableScriptModel.getTabelModel();
    var rowList = asitTableModel.getRows();
    asitTableModel.setSubGroup(tableName);
    for (var i = 0; i < asitFieldArray.length; i++)
    {
        var rowScriptModel = aa.appSpecificTableScript.createRowScriptModel();
        var rowModel = rowScriptModel.getRow();
        rowModel.setFields(asitFieldArray[i]);
        rowList.add(rowModel);
    }
    return aa.appSpecificTableScript.addAppSpecificTableInfors(capIDModel, asitTableModel);
}
/*
* ADDS ASIT ROW TO EXISTING TABLE 
    columnArray = [
        { colName: 'Abatement #', colValue: capIDString },
        { colName: 'Type', colValue: 'Snow' }
    ]
*/
function addAsiTableRow(tableName, columnArray, options) {
    var settings = {
        capId: capId,
    };
    for (var attr in options) { settings[attr] = options[attr]; } //optional params - overriding default settings
  
    var asitFieldArray = [],
        colsMapping = aa.util.newHashMap();;

    for(var idx in columnArray) {
        colsMapping.put(columnArray[idx].colName, columnArray[idx].colValue);
    }
    logDebug('addAsiTableRow(): inserting ASIT Row');
    asitFieldArray.push(colsMapping);
    addAppSpecificTableInfors();


    function addAppSpecificTableInfors() {
        var asitTableScriptModel = aa.appSpecificTableScript.createTableScriptModel();
        var asitTableModel = asitTableScriptModel.getTabelModel();
        var rowList = asitTableModel.getRows();
        asitTableModel.setSubGroup(tableName);
        for (var i = 0; i < asitFieldArray.length; i++) {
            var rowScriptModel = aa.appSpecificTableScript.createRowScriptModel();
            var rowModel = rowScriptModel.getRow();
            rowModel.setFields(asitFieldArray[i]);
            rowList.add(rowModel);
        }
        logDebug('addAppSpecificTableInfors(): inserting ASIT Row');
        return aa.appSpecificTableScript.addAppSpecificTableInfors(settings.capId, asitTableModel);
    }

}


function addInspectionFeeAndSendEmail(workFlowTask, workflowStatusArray, asiFieldName, emailTemplateName, reportName, rptParams) {

	if (wfTask == workFlowTask) {

		var statusMatch = false;

		for (s in workflowStatusArray) {
			if (wfStatus == workflowStatusArray[s]) {
				statusMatch = true;
				break;
			}
		}//for all status options

		if (!statusMatch) {
			return false;
		}

		//Get ASI value:
		var olduseAppSpecificGroupName = useAppSpecificGroupName;
		useAppSpecificGroupName = false;
		var asiValue = getAppSpecific(asiFieldName);
		useAppSpecificGroupName = olduseAppSpecificGroupName;

		//Add Fees
		var feeAmt = 0;
		if (asiValue == "Commercial") {
			feeAmt = 138;
		} else if (asiValue == "Residential") {
			feeAmt = 30.75;
		}

		// disabled see comments in script 191
		//addFee("WAT_IPLAN_01", "WAT_IPLAN", "FINAL", feeAmt, "Y");

		var ownerEmail = null, applicantEmail = null, pOwnerEmail = null;
		var owners = aa.owner.getOwnerByCapId(capId);
		if (owners.getSuccess()) {
			owners = owners.getOutput();
			if (owners == null || owners.length == 0) {
				logDebug("**WARN no owners on record " + capId);
				ownerEmail = "";
			} else {
				ownerEmail = owners[0].getEmail();
			}//len=0

		} else {
			logDebug("**Failed to get owners on record " + capId + " Error: " + owners.getErrorMessage());
			return false;
		}
		var recordApplicant = getContactByType("Applicant", capId);
		if (recordApplicant) {
			applicantEmail = recordApplicant.getEmail();
		} else {
			applicantEmail = "";
			logDebug("**WARN no Applicant on record " + capId);
		}

		var pOwner = getContactByType("Project Owner", capId);
		if (pOwner) {
			pOwnerEmail = pOwner.getEmail();
		} else {
			pOwnerEmail = "";
			logDebug("**WARN no Project Owner on record " + capId);
		}		

		if ((ownerEmail == null || ownerEmail == "") && (applicantEmail == null || applicantEmail == "")) {
			logDebug("**WARN owner and applicant has no emails, capId=" + capId);
			return false;
		}

		var eParams = aa.util.newHashtable();
		addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(eParams, "$$recordAlias$$", cap.getCapModel().getCapType().getAlias());
		addParameter(eParams, "$$recordStatus$$", cap.getCapModel().getCapStatus());
		addParameter(eParams, "$$balance$$", feeBalance(""));
		addParameter(eParams, "$$wfTask$$", wfTask);
		addParameter(eParams, "$$wfStatus$$", wfStatus);
		addParameter(eParams, "$$wfDate$$", wfDate);
		if (wfComment != null && typeof wfComment !== 'undefined') {
			addParameter(eParams, "$$wfComment$$", wfComment);
		}
		addParameter(eParams, "$$wfStaffUserID$$", wfStaffUserID);
		addParameter(eParams, "$$wfHours$$", wfHours);

		//send to applicant
		//sendEmailWithReport(applicantEmail, ownerEmail, emailTemplateName, reportName, rptParams, eParams);
		//send to Project Owner
		sendEmailWithReport(pOwnerEmail, ownerEmail, emailTemplateName, reportName, rptParams, eParams);

	} else {
		return false;
	}

	return true;
}
function addMasterPlanDataToShrdDDList(asiFieldName, recordReqStatus, inactivateRowValue) {
    logDebug("addMasterPlanDataToShrdDDList() started");
    var updateShrdDDList = false;
    if(ifTracer(vEventName == "ApplicationStatusUpdateAfter", 'ASUA')){
        if (appStatus != recordReqStatus) {
            logDebug("**WARN no match capStatus: " + cap.getCapStatus());
            return false;
        }
        else
            updateShrdDDList = true;
    }
        
    if(ifTracer(vEventName == "WorkflowTaskUpdateAfter", 'WTUA'))
        if((wfTask == "Final Review" && wfStatus == "Complete No Fee") || (wfTask == "Fee Processing" && wfStatus == "Complete"))
            updateShrdDDList = true;
        
    if(ifTracer(vEventName == "PaymentReceiveAfter", 'PRA')) updateShrdDDList = true;
    
    if(!updateShrdDDList) return false;

    var sharedDDL_asiValue_MAP = new Array();
    sharedDDL_asiValue_MAP["Single Family"] = "BLD SINGLE FAMILY MASTER";
    sharedDDL_asiValue_MAP["Multi Family"] = "BLD MULTI FAMILY MASTER";
    sharedDDL_asiValue_MAP["Other"] = "BLD OTHER MASTER";

    //check if AInfo is loaded with useAppSpecificGroupName=true,
    //we need it useAppSpecificGroupName=false, most of time we don't have subgroup name
    var asiValue = null;
    if (useAppSpecificGroupName) {
        var olduseAppSpecificGroupName = useAppSpecificGroupName;
        useAppSpecificGroupName = false;
        asiValue = getAppSpecific(asiFieldName);
        useAppSpecificGroupName = olduseAppSpecificGroupName;
    } else {
        asiValue = AInfo[asiFieldName];
    }

    if (!asiValue || asiValue == null || asiValue == "") {
        logDebug("**WARN '" + asiFieldName + "' is null or empty, capId=" + capId);
        return false;
    }

    var sharedDDLName = sharedDDL_asiValue_MAP[asiValue];

    var bizDomainResult = aa.bizDomain.getBizDomainByValue(sharedDDLName, inactivateRowValue);
    if (bizDomainResult.getSuccess()) {
        bizDomainResult = bizDomainResult.getOutput();
        if (bizDomainResult != null && bizDomainResult.getBizDomain().getAuditStatus() == "A") {
            //in-activate:
            var bizModel = bizDomainResult.getBizDomain();
            bizModel.setAuditStatus("I");
            var edit = aa.bizDomain.editBizDomain(bizModel, "en_US");
            if (!edit.getSuccess()) {
                logDebug("**WARN DDL '" + sharedDDLName + "' - Edit failed, Error: " + edit.getErrorMessage());
            }
        }//active
    }//DDL row exist

    var appName = cap.getSpecialText();
    if (appName == null || appName == "") {
        logDebug("**WARN application name is null or empty, capId=" + capId);
        return false;
    }

    var added = aa.bizDomain.createBizDomain(sharedDDLName, appName, "A", "");
    if (!added.getSuccess()) {
        logDebug("**WARN DDL '" + sharedDDLName + "' - Add Row failed, Error: " + added.getErrorMessage());
    }
	clearBizDomainCache();
    logDebug("addMasterPlanDataToShrdDDList() ended");
}
function addNotProvidedAPOData(){
	try{
		isAddress=addressExistsOnCap();
		isParcel=parcelExistsOnCap();
		isOwner=ownerExistsOnCap();
					   	
		if (isAddress){
			if (isParcel){
				if (!isOwner) GetOwnersByParcel(); 			
			}else{ // no Parcel Provided
				if (!isOwner)createParcelesAndOwners(); //add the parcel and Owner
				if (isOwner) addParcelByOwner();//no parcel but there is owner
			}
		}else{// no Address , then get the Parcel and add the Owner and the Address
			if (isParcel){ //no Address, parcel exist
				if (!isOwner)GetOwnersByParcel();
				addAddressByParcel();
			}else{ // no Address , no Parcel ,owner exist
				if (isOwner){
					addParcelByOwner();
					addAddressByParcel();
				}
			}
		}	
	}catch(e){
		logDebug("Error In Adding Not Provided APO Data " + e);
	}
}
function addParcelByOwner(){
	capOwnerResult = aa.owner.getOwnerByCapId(capId);
	if (capOwnerResult.getSuccess()) {
		owner = capOwnerResult.getOutput();
		for (o in owner) {
			var oNumber=owner[o].getL1OwnerNumber();
			parcelResult=aa.parcel.getParceListForAdmin("", "","", "", "", "", "", "", "", owner[o].getOwnerFullName());
			
			if (parcelResult.getSuccess()){
				parcelList=parcelResult.getOutput();
				for (p in parcelList){	
					var ow=parcelList[p].getOwnerModel();
					var num=ow.getOwnerNumber();
					if (oNumber==num){ // double check if the parcel's owner is the same as the cap owner
						// add the parcel
						var capParModel = aa.parcel.warpCapIdParcelModel2CapParcelModel(capId, parcelList[p].getParcelModel()).getOutput()
						var createPMResult = aa.parcel.createCapParcel(capParModel);
						if (createPMResult.getSuccess())
							logDebug("created CAP Parcel");
						else {
							logDebug("**WARNING: Failed to create the cap Parcel " + createPMResult.getErrorMessage());
						}
					}		
				}
			}
		}
		
	}
}


/*

Title : addParcelDistrict

Purpose : Add District value passed to function to a specific Parcel or All Parcels on a Record 

Author : Paul Rose

Functional Area : Inspections/APO/GIS

Description : This function, along with calls to GIS or other script lookups, can be used to add a

              District value to the Record's Parcel District tab. Example below shows getting the

              Inspection District from GIS and associating that District to all Parcels on a Record.

Reviewed By : 

Script Type : EMSE

General Purpose/Client Specific : General

Client developed for : 

Parameters : 

	parcelNum: Text:  Parcel Number of CAP or ""/null for All CAP Parcels

	districtValue: Text: Value of District to be added, normally comes from GIS layer attribute



Example: 

	//Parcel District for auto assign inspections

	try {

	var inspectionDistrict = getGISInfo2("SANDIEGO", "Inspection Districts", "INSPECTDST", -1, "feet");

	if (!matches(inspectionDistrict, null, "", "undefined")) {

		// logDebug("Inspection District: " + inspectionDistrict);

		addParcelDistrict("", inspectionDistrict);

	}

	} catch (err) {

		logDebug("A JavaScript Error occurred: (script name) - Parcel District for auto assign inspections" + err.message);

		logDebug(err.stack);

	};

*/



function addParcelDistrict(parcelNum, districtValue){

try{

if ("" + districtValue == "undefined") return;

//if parcelNum is null, district is is added to all parcels on CAP



if (!parcelNum) {

	var capParcelResult = aa.parcel.getParcelandAttribute(capId,null);

	if (capParcelResult.getSuccess())	{

		var Parcels = capParcelResult.getOutput().toArray();

		for (zz in Parcels) {

			apdResult = aa.parcel.addParceDistrictForDaily(capId.getID1(),capId.getID2(),capId.getID3(),Parcels[zz].getParcelNumber(),districtValue);

			

			//if (!apdResult.getSuccess())

			//	{ logDebug("**ERROR Adding District " + districtValue + " to parcel #" + Parcels[zz].getParcelNumber() + " : " + apdResult.getErrorMessage()) ; return false ; }

			//else

			//	logDebug("Successfully added district " + districtValue + " to parcel #" + Parcels[zz].getParcelNumber());



			//}

		}

	}

}

else	{

	apdResult = aa.parcel.addParceDistrictForDaily(capId.getID1(),capId.getID2(),capId.getID3(),parcelNum,districtValue);



	//if (!apdResult.getSuccess())

	//	{ logDebug("**ERROR Adding District " + districtValue + " to parcel #" + parcelNum + " : " + apdResult.getErrorMessage()) ; return false ; }

	//else

	//	logDebug("Successfully added district " + districtValue + " to parcel #" + parcelNum);

	//}

}

}

catch (err) {

	logDebug("A JavaScript Error occurred: function addParcelDistrict: " + err.message);

	logDebug(err.stack);	

}

}

/*
Title : addParcelDistrict
Purpose : Add District value passed to function to a specific Parcel or All Parcels on a Record 
Author : Paul Rose
Functional Area : Inspections/APO/GIS
Description : This function, along with calls to GIS or other script lookups, can be used to add a
              District value to the Record's Parcel District tab. Example below shows getting the
              Inspection District from GIS and associating that District to all Parcels on a Record.
Reviewed By : 
Script Type : EMSE
General Purpose/Client Specific : General
Client developed for : 
Parameters : 
	parcelNum: Text:  Parcel Number of CAP or ""/null for All CAP Parcels
	districtValue: Text: Value of District to be added, normally comes from GIS layer attribute

Example: 
	//Parcel District for auto assign inspections
	try {
	var inspectionDistrict = getGISInfo2("SANDIEGO", "Inspection Districts", "INSPECTDST", -1, "feet");
	if (!matches(inspectionDistrict, null, "", "undefined")) {
		// logDebug("Inspection District: " + inspectionDistrict);
		addParcelDistrict("", inspectionDistrict);
	}
	} catch (err) {
		logDebug("A JavaScript Error occurred: (script name) - Parcel District for auto assign inspections" + err.message);
		logDebug(err.stack);
	};
*/

function addParcelDistrict(parcelNum, districtValue){
try{
if ("" + districtValue == "undefined") return;
//if parcelNum is null, district is is added to all parcels on CAP

if (!parcelNum) {
	var capParcelResult = aa.parcel.getParcelandAttribute(capId,null);
	if (capParcelResult.getSuccess())	{
		var Parcels = capParcelResult.getOutput().toArray();
		for (zz in Parcels) {
			apdResult = aa.parcel.addParceDistrictForDaily(capId.getID1(),capId.getID2(),capId.getID3(),Parcels[zz].getParcelNumber(),districtValue);
			
			//if (!apdResult.getSuccess())
			//	{ logDebug("**ERROR Adding District " + districtValue + " to parcel #" + Parcels[zz].getParcelNumber() + " : " + apdResult.getErrorMessage()) ; return false ; }
			//else
			//	logDebug("Successfully added district " + districtValue + " to parcel #" + Parcels[zz].getParcelNumber());

			//}
		}
	}
}
else	{
	apdResult = aa.parcel.addParceDistrictForDaily(capId.getID1(),capId.getID2(),capId.getID3(),parcelNum,districtValue);

	//if (!apdResult.getSuccess())
	//	{ logDebug("**ERROR Adding District " + districtValue + " to parcel #" + parcelNum + " : " + apdResult.getErrorMessage()) ; return false ; }
	//else
	//	logDebug("Successfully added district " + districtValue + " to parcel #" + parcelNum);
	//}
}
}
catch (err) {
	logDebug("A JavaScript Error occurred: function addParcelDistrict: " + err.message);
	logDebug(err.stack);	
}
}
function addParcelFromRef(parParcel)  // optional capID
{
//modified function addParcelAndOwnerFromRefAddress()
	try{
		var itemCap = capId
		if (arguments.length > 1)
			itemCap = arguments[1]; // use cap ID specified in args

		var prclObj = aa.parcel.getParceListForAdmin(parParcel, null, null, null, null, null, null, null, null, null);
		if (prclObj.getSuccess() )
		{
			//comment("Got past prclObj...");

			var prclArr = prclObj.getOutput();
			if (prclArr.length > 0)
			{
				//aa.print("Got past prclArr in addParcelFromRef()");

				var prcl = prclArr[0].getParcelModel();
				var refParcelNumber = prcl.getParcelNumber();

				//set to not primary
				prcl.setPrimaryParcelFlag("N");

				// first add the parcel
				var capParModel = aa.parcel.warpCapIdParcelModel2CapParcelModel(itemCap,prcl);

				var createPMResult = aa.parcel.createCapParcel(capParModel.getOutput());
				if (createPMResult.getSuccess())
				{
					logDebug("created CAP Parcel");
					//aa.print("created CAP Parcel");
				}
				else
				{ 
					logDebug("**WARNING: Failed to create the cap Parcel " + createPMResult.getErrorMessage()); 
					//aa.print("**WARNING: Failed to create the cap Parcel " + createPMResult.getErrorMessage()); 
				}
			}
		}

		return true;
	}
	catch (err){
	comment("A JavaScript Error occurred:  Custom Function: addParcelFromRef: " + err.message);
	}
}

function addParcelStdCondition(prclNum,cType,cDesc){
    var foundCondition = false;
    
    cStatus = "Applied";
    if (arguments.length > 3)
        cStatus = arguments[3]; // use condition status in args
        
    if (!aa.capCondition.getStandardConditions){
        logDebug("addAddressStdCondition function is not available in this version of Accela Automation.");
    }
    else{
        standardConditions = aa.capCondition.getStandardConditions(cType,cDesc).getOutput();
        for(i = 0; i<standardConditions.length;i++)
            if(standardConditions[i].getConditionType().toUpperCase() == cType.toUpperCase() && standardConditions[i].getConditionDesc().toUpperCase() == cDesc.toUpperCase()) //EMSE Dom function does like search, needed for exact match
            {
                standardCondition = standardConditions[i]; // add the last one found
            
                foundCondition = true;
        
                if (!prclNum) // add to all reference address on the current capId
                {
                    var capPrclResult = aa.parcel.getParcelByCapId(capId, null);
                    if (capPrclResult.getSuccess()){
                        var Prcl = capPrclResult.getOutput().toArray();
                        for (zz in Prcl){
                            var parcel = Prcl[zz]
                            var parcelNumber = parcel.getParcelNumber();
                            if (parcelNumber){
                                var addPrclCondResult = aa.parcelCondition.addParcelCondition(parcelNumber,standardCondition.getConditionType(), standardCondition.getConditionDesc(), standardCondition.getConditionComment(), null,null, standardCondition.getImpactCode(),cStatus,sysDate, null, sysDate, null, systemUserObj, systemUserObj)
                        
                                if (addPrclCondResult.getSuccess()){
                                    logDebug("Successfully added condition to reference Parcel " + parcelNumber + " " + cDesc);
                                }
                                else{
                                    logDebug( "**ERROR: adding condition to reference Parcel " + parcelNumber + " " + addPrclCondResult.getErrorMessage());
                                }
                            }
                        }
                    }
                }
                else{
                    var addPrclCondResult = aa.parcelCondition.addParcelCondition(prclNum,standardCondition.getConditionType(), standardCondition.getConditionDesc(), standardCondition.getConditionComment(), null,null, standardCondition.getImpactCode(),cStatus,sysDate, null, sysDate, null, systemUserObj, systemUserObj)

                    if (addPrclCondResult.getSuccess()){
                        logDebug("Successfully added condition to Parcel " + prclNum + " " + cDesc);
                    }
                    else{
                        logDebug( "**ERROR: adding condition to Parcel " + prclNum + " " + addPrclCondResult.getErrorMessage());
                    }
                }
            }
    }
        
    if (!foundCondition) logDebug( "**WARNING: couldn't find standard condition for " + cType + " / " + cDesc);
}
function addReferenceContactByBusinessName(busName, itemCap){
    var peopleResult = aa.people.getPeopleByBusinessName(busName);
    
    if (peopleResult.getSuccess()){
        var peopleObj = peopleResult.getOutput();
        //logDebug("peopleObj is "+peopleObj.getClass());
        if (peopleObj==null){
            logDebug("No reference user found.");
            return false;
        }
        logDebug("No. of reference contacts found: "+peopleObj.length);
    }
    else{
        logDebug("**ERROR: Failed to get reference contact record: " + peopleResult.getErrorMessage());
        return false;
    }
    
    //Add the reference contact record to the current CAP
    var contactAddResult = aa.people.createCapContactWithRefPeopleModel(itemCap, peopleObj[0]);
    if (contactAddResult.getSuccess()){
        logDebug("Contact successfully added to CAP.");
        var capContactResult = aa.people.getCapContactByCapID(itemCap);
        if (capContactResult.getSuccess()){
            var Contacts = capContactResult.getOutput();
            var idx = Contacts.length;
            var contactNbr = Contacts[idx-1].getCapContactModel().getPeople().getContactSeqNumber();
            logDebug ("Contact Nbr = "+contactNbr);
            return contactNbr;
        }
        else{
            logDebug("**ERROR: Failed to get Contact Nbr: "+capContactResult.getErrorMessage());
            return false;
        }
    }
    else{
        logDebug("**ERROR: Cannot add contact: " + contactAddResult.getErrorMessage());
        return false;
    }
}//END addReferenceContactByBusinessName()
function addStdConditionwithComment(cType, cDesc, cComment) // optional cap ID
{
	var itemCap = capId;
	if (arguments.length == 4)
	{
		itemCap = arguments[3]; // use cap ID specified in args
	}
	if (!aa.capCondition.getStandardConditions)
	{
		logDebug("addStdCondition function is not available in this version of Accela Automation.");
	}
	else
	{
		standardConditions = aa.capCondition.getStandardConditions(cType, cDesc).getOutput();
		for (i = 0; i < standardConditions.length; i++)
		{
			standardCondition = standardConditions[i];
			var addCapCondResult = aa.capCondition.addCapCondition(itemCap, standardCondition.getConditionType(), standardCondition.getConditionDesc(), 
				cComment, sysDate, null, sysDate, null, null, standardCondition.getImpactCode(), systemUserObj, systemUserObj, "Applied", currentUserID, "A", 
				null, standardCondition.getDisplayConditionNotice(), standardCondition.getIncludeInConditionName(), standardCondition.getIncludeInShortDescription(), 
				standardCondition.getInheritable(), standardCondition.getLongDescripton(), standardCondition.getPublicDisplayMessage(), 
				standardCondition.getResolutionAction(), null, null, standardCondition.getConditionNbr(), standardCondition.getConditionGroup(), 
				standardCondition.getDisplayNoticeOnACA(), standardCondition.getDisplayNoticeOnACAFee(), standardCondition.getPriority(), 
				standardCondition.getConditionOfApproval());
			if (addCapCondResult.getSuccess())
			{
				//debugObject(addCapCondResult);
				logDebug("Successfully added condition (" + standardCondition.getConditionDesc() + ")");
			}
			else
			{
				logDebug("**ERROR: adding condition (" + standardCondition.getConditionDesc() + "): " + addCapCondResult.getErrorMessage());
			}
		}
	}
}
function addStdVarsToEmail(vEParams, vCapId) {
	//Define variables
	var servProvCode;
	var cap;
	var capId;
	var capIDString;
	var currentUserID;
	var currentUserGroup;
	var appTypeResult;
	var appTypeString;
	var appTypeArray;
	var capTypeAlias;
	var capName;
	var fileDateObj;
	var fileDate;
	var fileDateYYYYMMDD;
	var parcelArea;
	var valobj;
	var estValue;
	var calcValue;
	var feeFactor;
	var capDetailObjResult;
	var capDetail;
	var houseCount;
	var feesInvoicedTotal;
	var balanceDue;
	var parentCapString;
	var parentArray;
	var parentCapId;
	var addressLine;
	
	//get standard variables for the record provided
	if(vCapId != null){
		capId = vCapId;
		servProvCode = capId.getServiceProviderCode();
		capIDString = capId.getCustomID();
		cap = aa.cap.getCap(capId).getOutput();	
		appTypeResult = cap.getCapType();
		appTypeString = appTypeResult.toString();
		capTypeAlias = cap.getCapType().getAlias();
		capName = cap.getSpecialText();
		capStatus = cap.getCapStatus();
		fileDateObj = cap.getFileDate();
		fileDate = "" + fileDateObj.getMonth() + "/" + fileDateObj.getDayOfMonth() + "/" + fileDateObj.getYear();
		fileDateYYYYMMDD = dateFormatted(fileDateObj.getMonth(),fileDateObj.getDayOfMonth(),fileDateObj.getYear(),"YYYY-MM-DD");
		valobj = aa.finance.getContractorSuppliedValuation(vCapId,null).getOutput();	
		if (valobj.length) {
			estValue = valobj[0].getEstimatedValue();
			calcValue = valobj[0].getCalculatedValue();
			feeFactor = valobj[0].getbValuatn().getFeeFactorFlag();
		}
		
		var capDetailObjResult = aa.cap.getCapDetail(vCapId);		
		if (capDetailObjResult.getSuccess())
		{
			capDetail = capDetailObjResult.getOutput();
			houseCount = capDetail.getHouseCount();
			feesInvoicedTotal = capDetail.getTotalFee();
			balanceDue = capDetail.getBalance();
			if (Number(balanceDue) != 'NaN') {
				balanceDue = Number(balanceDue).toFixed(2);
			}
		}
		parentCapString = "" + aa.env.getValue("ParentCapID");
		if (parentCapString.length > 0) {
			parentArray = parentCapString.split("-"); 
			parentCapId = aa.cap.getCapID(parentArray[0], parentArray[1], parentArray[2]).getOutput(); 
		}
		if (!parentCapId) {
			parentCapId = getParent(); 
		}
		if (!parentCapId) {
			parentCapId = getParentLicenseCapID(vCapId); 
		}		
		addressLine = getAddressInALine();
		currentUserID = aa.env.getValue("CurrentUserID");
		appTypeArray = appTypeString.split("/");
		if(appTypeArray[0].substr(0,1) !="_") 
		{
			var currentUserGroupObj = aa.userright.getUserRight(appTypeArray[0],currentUserID).getOutput()
			if (currentUserGroupObj) currentUserGroup = currentUserGroupObj.getGroupName();
		}
		parcelArea = 0;;

		//save variables to email paramater hashtable
		addParameter(vEParams,"$$altid$$",capIDString);	
		addParameter(vEParams,"$$capIDString$$",capIDString);
		addParameter(vEParams,"$$currentUserID$$",currentUserID); // seems to cause the issue
		addParameter(vEParams,"$$currentUserGroup$$",currentUserGroup); // seems to cause the issue
		addParameter(vEParams,"$$appTypeString$$",appTypeString);
		addParameter(vEParams,"$$capAlias$$",capTypeAlias);
		addParameter(vEParams,"$$capName$$",capName);
		addParameter(vEParams,"$$capStatus$$",capStatus);
		addParameter(vEParams,"$$fileDate$$",fileDate);
		addParameter(vEParams,"$$fileDateYYYYMMDD$$",fileDateYYYYMMDD);
		addParameter(vEParams,"$$parcelArea$$",parcelArea); // seems to cause the issue
		addParameter(vEParams,"$$estValue$$",estValue);
		addParameter(vEParams,"$$calcValue$$",calcValue);
		addParameter(vEParams,"$$feeFactor$$",feeFactor);
		addParameter(vEParams,"$$houseCount$$",houseCount);
		addParameter(vEParams,"$$feesInvoicedTotal$$",feesInvoicedTotal);
		addParameter(vEParams,"$$balanceDue$$",balanceDue);	
		if (parentCapId) {
			addParameter(vEParams,"$$parentCapId$$",parentCapId.getCustomID());
		}
		//Add ACA Urls to Email Variables
		addACAUrlsVarToEmail(vEParams);
		//Add address information
		if (addressLine != null) {
			addParameter(vEParams,"$$capAddress$$",addressLine);
		}
	}
	return vEParams;
}
function addStdVarsToEmail(vEParams, vCapId) {
	//Define variables
	var servProvCode;
	var cap;
	var capId;
	var capIDString;
	var currentUserID;
	var currentUserGroup;
	var appTypeResult;
	var appTypeString;
	var appTypeArray;
	var capTypeAlias;
	var capName;
	var fileDateObj;
	var fileDate;
	var fileDateYYYYMMDD;
	var parcelArea;
	var valobj;
	var estValue;
	var calcValue;
	var feeFactor;
	var capDetailObjResult;
	var capDetail;
	var houseCount;
	var feesInvoicedTotal;
	var balanceDue;
	var parentCapString;
	var parentArray;
	var parentCapId;
	var addressLine;
	
	//compute the longform date...
	var now = new Date();
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var todayDateLongForm = months[now.getMonth()] + " " + now.getDate() + ", " + now.getFullYear()
	
	//get standard variables for the record provided
	if(vCapId != null){
		capId = vCapId;
		servProvCode = capId.getServiceProviderCode();
		capIDString = capId.getCustomID();
		cap = aa.cap.getCap(capId).getOutput();	
		appTypeResult = cap.getCapType();
		appTypeString = appTypeResult.toString();
		capTypeAlias = cap.getCapType().getAlias();
		capName = cap.getSpecialText();
		capStatus = cap.getCapStatus();
		fileDateObj = cap.getFileDate();
		fileDate = "" + fileDateObj.getMonth() + "/" + fileDateObj.getDayOfMonth() + "/" + fileDateObj.getYear();
		fileDateYYYYMMDD = dateFormatted(fileDateObj.getMonth(),fileDateObj.getDayOfMonth(),fileDateObj.getYear(),"YYYY-MM-DD");
		valobj = aa.finance.getContractorSuppliedValuation(vCapId,null).getOutput();	
		if (valobj.length) {
			estValue = valobj[0].getEstimatedValue();
			calcValue = valobj[0].getCalculatedValue();
			feeFactor = valobj[0].getbValuatn().getFeeFactorFlag();
		}
		
		var capDetailObjResult = aa.cap.getCapDetail(vCapId);		
		if (capDetailObjResult.getSuccess())
		{
			capDetail = capDetailObjResult.getOutput();
			houseCount = capDetail.getHouseCount();
			feesInvoicedTotal = capDetail.getTotalFee();
			balanceDue = capDetail.getBalance();
			if (Number(balanceDue) != 'NaN') {
				balanceDue = Number(balanceDue).toFixed(2);
			}
		}
		parentCapString = "" + aa.env.getValue("ParentCapID");
		if (parentCapString.length > 0) {
			parentArray = parentCapString.split("-"); 
			parentCapId = aa.cap.getCapID(parentArray[0], parentArray[1], parentArray[2]).getOutput(); 
		}
		if (!parentCapId) {
			parentCapId = getParent(); 
		}
		if (!parentCapId) {
			parentCapId = getParentLicenseCapID(vCapId); 
		}		
		addressLine = getAddressInALine();
		currentUserID = aa.env.getValue("CurrentUserID");
		appTypeArray = appTypeString.split("/");
		if(appTypeArray[0].substr(0,1) !="_") 
		{
			var currentUserGroupObj = aa.userright.getUserRight(appTypeArray[0],currentUserID).getOutput()
			if (currentUserGroupObj) currentUserGroup = currentUserGroupObj.getGroupName();
		}
		parcelArea = 0;;

		//save variables to email paramater hashtable
		addParameter(vEParams,"$$todayDate$$",todayDateLongForm);
		addParameter(vEParams,"$$altid$$",capIDString);	
		addParameter(vEParams,"$$capIDString$$",capIDString);
		addParameter(vEParams,"$$currentUserID$$",currentUserID); // seems to cause the issue
		addParameter(vEParams,"$$currentUserGroup$$",currentUserGroup); // seems to cause the issue
		addParameter(vEParams,"$$appTypeString$$",appTypeString);
		addParameter(vEParams,"$$capAlias$$",capTypeAlias);
		addParameter(vEParams,"$$capName$$",capName);
		addParameter(vEParams,"$$capStatus$$",capStatus);
		addParameter(vEParams,"$$fileDate$$",fileDate);
		addParameter(vEParams,"$$fileDateYYYYMMDD$$",fileDateYYYYMMDD);
		addParameter(vEParams,"$$parcelArea$$",parcelArea); // seems to cause the issue
		addParameter(vEParams,"$$estValue$$",estValue);
		addParameter(vEParams,"$$calcValue$$",calcValue);
		addParameter(vEParams,"$$feeFactor$$",feeFactor);
		addParameter(vEParams,"$$houseCount$$",houseCount);
		addParameter(vEParams,"$$feesInvoicedTotal$$",feesInvoicedTotal);
		addParameter(vEParams,"$$balanceDue$$",balanceDue);	
		if (parentCapId) {
			addParameter(vEParams,"$$parentCapId$$",parentCapId.getCustomID());
		}
		//Add ACA Urls to Email Variables
		addACAUrlsVarToEmail(vEParams);
		//Add address information
		if (addressLine != null) {
			addParameter(vEParams,"$$capAddress$$",addressLine);
		}
	}
	return vEParams;
}

/**
 * check record if all inspections were completed
 * @param recordCapId record capId to check
 * @returns {Boolean} true if all inspections were completed, false otherwise
 */
function allInspectionsCompleted(recordCapId) {
	var t = aa.inspection.getInspections(recordCapId);
	if (t.getSuccess()) {
		var n = t.getOutput();
		for (xx in n)
			if (n[xx].getInspectionStatus().toUpperCase().equals("SCHEDULED"))
				return false;
	} else {
		logDebug("**ERROR failed to get inspections, error: " + t.getErrorMessage());
		return false;
	}
	return true;
}
function allInspectionsResulted(typeArray, statusArray) {
    logDebug("---------------------> In the allInspectionsResulted function"); 
    var inspResultObj = aa.inspection.getInspections(capId);
    if (inspResultObj.getSuccess()) {
        inspList = inspResultObj.getOutput();
        var processedInspTypes = [];

        for (xx in inspList) {
            if(exists(inspList[xx].getInspectionType(), typeArray) && exists(inspList[xx].getInspectionStatus(), statusArray)){
                    processedInspTypes.push(inspList[xx].getInspectionType());      
            }
        }

        for(kk in typeArray){
            if(!exists(typeArray[kk], processedInspTypes)){
                return false;
            }
        }
        return true;
    }
}
function allwfTasksComplete(capId) {
	var ignoreArray = new Array();
	
	for (var i=1; i<arguments.length;i++)  {
		ignoreArray.push(arguments[i])
	}

	// returns true if any of the subtasks are active
	var taskResult = aa.workflow.getTasks(capId);
	
	if (taskResult.getSuccess()) { 
		taskArr = taskResult.getOutput(); 
	} else { 
		logDebug( "**ERROR: getting tasks : " + taskResult.getErrorMessage()); 
		return false 
	}
		
	for (xx in taskArr) {
		if (taskArr[xx].getActiveFlag().equals("Y") && !exists(taskArr[xx].getTaskDescription(),ignoreArray)) {
			return false;
		}
		return true;
	}
}
function areFeesInvoiced(fcode, fperiod) {
    var feeFound = false;
	getFeeResult = aa.finance.getFeeItemsByFeeCodeAndPeriod(capId, fcode, fperiod, "NEW");
	if (getFeeResult.getSuccess()) {
		var feeList = getFeeResult.getOutput();
		for (feeNum in feeList)
			if (feeList[feeNum].getFeeitemStatus().equals("NEW")) {
				var feeSeq = feeList[feeNum].getFeeSeqNbr();
				feeFound = true;
                if (feeFound) {
                    return true;
                }
//				logDebug("Fees not invoiced");
			}
    }
}

//Assign Task to TSI user
function assignTaskToTSIUser(wfTaskStr, assignedTo){
	if(assignedTo != false) {
		var userName=assignedTo.split(" ");
		var userObj = aa.person.getUser(userName[0],null,userName[1]).getOutput();
		if(userObj){
		    assignTask(wfTaskStr,userObj.getUserID());
		    updateTaskDepartment(wfTaskStr,userObj.getDeptOfUser());		
		}
	}
}
function assignWfTask(username){
	try{
		var taskUserResult = aa.person.getUser(username);
	if (taskUserResult.getSuccess()){
		taskUserObj = taskUserResult.getOutput();
		
		//  User Object
	}
	else
		{ aa.debug("**ERROR: Failed to get user object: " , taskUserResult.getErrorMessage()); return false; }
	
	var workflowResult = aa.workflow.getTaskItems(capId, null, null, null, null, "Y");
	
	if (workflowResult.getSuccess()){
  	 	var wfObj = workflowResult.getOutput(); 
  	 	
	}
	  	else
  	  	{ aa.debug("**ERROR: Failed to get workflow object: " , workflowResult.getErrorMessage()); return false; }
	
	for (i in wfObj)
		{
   		var fTask = wfObj[i];
   		
   		var dept = fTask.getTaskItem().getAssignedUser().getDeptOfUser();
   		if (String(dept).equals("AURORACO/PLANNING/NA/NA/NA/NA/NA")){
   			fTask.setAssignedUser(taskUserObj);
			var taskItem = fTask.getTaskItem();
			var adjustResult = aa.workflow.assignTask(taskItem);
			if (adjustResult.getSuccess()){aa.debug("Sucssfull assign task " , fTask.getTaskDescription()) ;}
			}
		}
		
	}catch(e){
		aa.debug("getAssignedStaff " , e);
		return false;
	}	
}

function autoAssignInspectionCoA(iNumber){
	// updates the inspection and assigns to a new user
	// requires the inspection id
	//

	iObjResult = aa.inspection.getInspection(capId,iNumber);
	if (!iObjResult.getSuccess()) {
		logDebug("**ERROR retrieving inspection " + iNumber + " : " + iObjResult.getErrorMessage()) ;
		return false ;
	}
	
	iObj = iObjResult.getOutput();

	inspTypeResult = aa.inspection.getInspectionType(iObj.getInspection().getInspectionGroup(), iObj.getInspectionType())

	if (!inspTypeResult.getSuccess()){
		logDebug("**ERROR retrieving inspection Type " + inspTypeResult.getErrorMessage()) ;
		return false ;
	}
	
	inspTypeArr = inspTypeResult.getOutput();

    if (inspTypeArr == null || inspTypeArr.length == 0) {
		logDebug("ERROR no inspection type found using inspection group. Trying with no inspection group") ;
		inspTypeResult = aa.inspection.getInspectionType("", iObj.getInspectionType())

	    if (!inspTypeResult.getSuccess()){
	    	logDebug("**ERROR retrieving inspection Type " + inspTypeResult.getErrorMessage()) ;
	    	return false ;
	    }
		
		inspTypeArr = inspTypeResult.getOutput();
	}

	if (inspTypeArr == null || inspTypeArr.length == 0)
		{ logDebug("**ERROR no inspection type found") ; return false ; }
	
	thisInspType = inspTypeArr[0]; // assume first

	inspSeq = thisInspType.getSequenceNumber();

	inspSchedDate = iObj.getScheduledDate().getYear() + "-" + iObj.getScheduledDate().getMonth() + "-" + iObj.getScheduledDate().getDayOfMonth()

 	logDebug(inspSchedDate)

	iout =  aa.inspection.autoAssignInspector(capId.getID1(),capId.getID2(),capId.getID3(), inspSeq, inspSchedDate)

	if (!iout.getSuccess()){
		logDebug("**ERROR retrieving auto assign inspector " + iout.getErrorMessage()) ;
		return false ;
	}

	inspectorArr = iout.getOutput();

	if (inspectorArr == null || inspectorArr.length == 0){
		logDebug("**WARNING no auto-assign inspector found") ;
		return false ;
	}
	
	inspectorObj = inspectorArr[0];  // assume first
	
	iObj.setInspector(inspectorObj);

	assignResult = aa.inspection.editInspection(iObj)

	if (!assignResult.getSuccess()){
		logDebug("**ERROR re-assigning inspection " + assignResult.getErrorMessage()) ;
		return false ;
	}
	else
		logDebug("Successfully reassigned inspection " + iObj.getInspectionType() + " to user " + inspectorObj.getUserID());
}

/**
 * prepare parameters and calls the method that will do the actual work
 */
function autoCloseWorkflow() {
    logDebug("autoCloseWorkflow() started")
    var recTypesAry = new Array();
    var matched = false;
    var applicant = getContactByType("Applicant", capId);
    var applicantEmail = getContactEmailAddress("Applicant", capId);
    var issuedEmlTemplate = "BLD PERMIT ISSUED # 35";
    
    var reportTemplate = "Building Permit";
    var reportParams = aa.util.newHashtable();
    addParameter(reportParams, "RecordID", capIDString);
    
    var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
    acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
    var recordURL = getACARecordURL(acaURLDefault);
    
    var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
    var reportFile = [];
    
    var eParams = aa.util.newHashtable();
    addParameter(eParams, "$$altID$$", capIDString);
    addParameter(eParams, "$$ContactFullName$$", applicant.getFullName());
    addParameter(eParams, "$$recordAlias$$", appTypeAlias);
    addParameter(eParams, "$$acaRecordUrl$$", recordURL);
    
    var deacSpecInspCheck = false;//To use for script 205
    var autoCreateInsp = false;//To use for script 202
    
    //Script #35
    recTypesAry = [ "Building/Permit/Plans/Amendment", "Building/Permit/New Building/Amendment", "Building/Permit/Master/Amendment", "Building/Permit/Master/NA" ];
    matched = checkBalanceAndStatusUpdateRecord(recTypesAry, "Payment Pending", "Fee Processing", "Complete", "Approved");
    if(matched){
        logDebug("matched #1");
        setCodeReference("Complete");
        //Send email for case #1
        var emailTemplate = "BLD PLANS APPROVED # 35";
        var lpEmail = getPrimLPEmailByCapId(capId);
        addParameter(eParams, "$$LicenseProfessionalEmail$$", lpEmail);
        var sendResult = sendNotification("noreply@aurora.gov",applicantEmail,"",emailTemplate,eParams,reportFile,capID4Email);
        if (!sendResult) { logDebug("autoCloseWorkflow: UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
			else { logDebug("autoCloseWorkflow: Sent email to applicant "+applicantEmail)}  
        var sendResult2 = sendNotification("noreply@aurora.gov",lpEmail,"",emailTemplate,eParams,reportFile,capID4Email);
        if (!sendResult2) { logDebug("autoCloseWorkflow: UNABLE TO SEND NOTICE!  ERROR: "+sendResult2); }
			else { logDebug("autoCloseWorkflow: Sent email to applicant "+lpEmail)}         
        //Script 324
        if(appMatch("Building/Permit/Master/NA")){
            logDebug("Calling Script 324 from PRA");
            addMasterPlanDataToShrdDDList("Master Plan Type", "Approved", "Code Change");
        }
        
        deacSpecInspCheck = true;//Script 205
    }
    
    if (!matched) {
        logDebug("match #2");
        recTypesAry = new Array();
        recTypesAry = [ "Building/Permit/New Building/NA", "Building/Permit/Plans/NA" ];
		//validateParentCapStatus() is part of script 2.  Permit cannot be issued if Parent Master is Unapproved
        if(validateParentCapStatus([ "Issued" ], "Building/Permit/Master/NA", "Unapproved") && bldScript2_noContractorCheck())
            matched = checkBalanceAndStatusUpdateRecord(recTypesAry, "Payment Pending", "Permit Issuance", "Issued", "Issued");
        else
            logDebug("No LP on file.  Not issuing permit")
        //Specs don't mention anything for Ready to Issuematched = checkBalanceAndStatusUpdateRecord(recTypesAry, "Ready to Issue", "Permit Issuance", "Issued", "Issued");
        
        //extra steps for #2
        //2.1
        if (matched) {
            if (appMatch("Building/Permit/New Building/NA")) {
                activateTask("Water Meter");
                activateTask("Inspection Phase");
                if(isTaskStatus("Waste Water Review", "Approved Inspection Required")){
                    activateTask("Waste Water", "BLD_NEWCON_INSPSUB");
                    activateTask("Waste Water", "BLD_MASTER_INSPSUB");
                }
                if(AInfo["Special Inspections"] == "Yes") {
                    activateTask("Special Inspections Check","BLD_NEWCON_INSPSUB");
                    activateTask("Special Inspections Check","BLD_MASTER_INSPSUB");
                }
                if(isTaskStatus("Engineering Review", "Approved with FEMA Cert Required")) {
                    activateTask("FEMA Elevation Certification","BLD_NEWCON_INSPSUB");
                    activateTask("FEMA Elevation Certification","BLD_MASTER_INSPSUB");
                }
            }//2.1

            //2.2
            if (appMatch("Building/Permit/Plans/NA")) {
                if(isTaskStatus("Waste Water Review", "Approved Inspection Required")) {
                    activateTask("Waste Water", "BLD_NEWCON_INSPSUB");
                    activateTask("Waste Water", "BLD_MASTER_INSPSUB");
                }
                activateTask("Inspection Phase");
                if(AInfo["Special Inspections"] == "Yes") {
                    activateTask("Special Inspections Check","BLD_NEWCON_INSPSUB");
                    activateTask("Special Inspections Check","BLD_MASTER_INSPSUB");
                }
            }//2.2
            
            setCodeReference("Issued");
            //send email()
            var lpEmail = getPrimLPEmailByCapId(capId);
            addParameter(eParams, "$$LicenseProfessionalEmail$$", lpEmail);
            emailContacts("Applicant", issuedEmlTemplate, eParams, reportTemplate, reportParams);
            if(lpEmail != null)
			{
				emailContactsIncludesLP("PRIMARYLP", issuedEmlTemplate, eParams, reportTemplate, reportParams);
			}
		
            autoCreateInsp = true;//Script 202
            deacSpecInspCheck = true;//Script 205
        }//matched
    }

    //#3
    if (ifTracer(!matched, '!matched')) {
        logDebug("match #3");
        recTypesAry = new Array();
        //  4-10-19 Keith added OTC permits to Array
        recTypesAry = [ "Building/Permit/No Plans/NA","Building/Permit/OTC/AC Only","Building/Permit/OTC/Commercial Roof","Building/Permit/OTC/Furnace","Building/Permit/OTC/Furnace AC and Water Heater","Building/Permit/OTC/Furnace and AC","Building/Permit/OTC/Gas Pipe","Building/Permit/OTC/Residential Electrical Service","Building/Permit/OTC/Residential Roof","Building/Permit/OTC/Siding","Building/Permit/OTC/Tankless Water Heater","Building/Permit/OTC/Water Heater","Building/Permit/OTC/Water Heater and AC","Building/Permit/OTC/Water Heater and Furnace" ];
        if((appMatch("Building/Permit/No Plans/NA") || appMatch("Building/Permit/OTC/*")) && bldScript2_noContractorCheck() && validateParentCapStatus([ "Issued" ], "Building/Permit/Master/NA", "Unapproved"))
            matched = checkBalanceAndStatusUpdateRecord(recTypesAry, "Submitted", "Permit Issuance", "Issued", "Issued");
        else logDebug("No LP on file.  Not issuing permit");
        
        if(ifTracer(matched, 'match #3 inner criteria')) {
            //send email()
            var lpEmail = getPrimLPEmailByCapId(capId);
            addParameter(eParams, "$$LicenseProfessionalEmail$$", lpEmail);
            emailContacts("Applicant", issuedEmlTemplate, eParams, reportTemplate, reportParams);
            if(lpEmail != null)
			{
				emailContactsIncludesLP("PRIMARYLP", issuedEmlTemplate, eParams, reportTemplate, reportParams);
			}            
            setCodeReference("Issued");
            logDebug('Going to activate Inspection Phase')
            activateTask("Inspection Phase");
            autoCreateInsp = true;//Script 202
            deacSpecInspCheck = true;//Script 205
            
            
        }
    }
    
    //Script 202
    if(deacSpecInspCheck){
        logDebug("Script 202: autoCreateInspections");
        var tasksToCheck = [ "Mechanical Plan Review", "Electrical Plan Review", "Plumbing Plan Review", "Structural Plan Review" ];
        createAutoInspection(tasksToCheck);
    }
    
    //Script 205, 206 being
    if(deacSpecInspCheck){
        logDebug("Script 205: Deactivating Special Inspections Check, FEMA Elevation Certification, Waste Water")
        if(AInfo["Special Inspections"] != "Yes")
        {
            deactivateTask("Special Inspections Check","BLD_NEWCON_INSPSUB");
            deactivateTask("Special Inspections Check","BLD_MASTER_INSPSUB");
        }//END Script 205
        
        //Script 206
        if(!isTaskStatus("Engineering Review","Approved with FEMA Cert Required"))
        {
            deactivateTask("FEMA Elevation Certification","BLD_NEWCON_INSPSUB");
            deactivateTask("FEMA Elevation Certification","BLD_MASTER_INSPSUB");
        }
        
        if(!isTaskStatus("Waste Water Review","Approved Inspection Required"))
        {
            deactivateTask("Waste Water","BLD_NEWCON_INSPSUB");
            deactivateTask("Waste Water","BLD_MASTER_INSPSUB");
        }//END Script 206
    }//END Script 205, 206
    
    logDebug("autoCloseWorkflow() ended");
}

function AutoCreateIrrigationPlanRecord(){
if (wfTask == "Water Review" && wfStatus == "SS Requested") {
	var tsiArray = new Array(); 
    loadTaskSpecific(tsiArray);
	var Irrigation_Plan_Required = tsiArray["Irrigation Plan Required"];
	if (Irrigation_Plan_Required == "Yes") {
		createChild("Water", "Water", "Irrigation Plan Review", "NA", "Water Irrigation Plan", capId);
		}
	}

}


/**
 * check wfTask/status an TSI if matched, creates a child record
 * @param wfTaskName task name to check match
 * @param workflowStatusArray array of statuses to check match
 * @param tsiFieldName name of TSI field
 * @param tsiTaskname name of task TSI exists on
 * @param appTypeStr child app to create
 * @returns {Boolean}
 */
function autoCreateMasterUtilStudyApplication(wfTaskName, workflowStatusArray, tsiFieldName, tsiTaskname, appTypeStr) {

	if (wfTask == wfTaskName) {

		var statusMatch = false;

		for (s in workflowStatusArray) {
			if (wfStatus == workflowStatusArray[s]) {
				statusMatch = true;
				break;
			}
		}//for all status options

		if (!statusMatch) {
			return false;
		}

		var olduseTaskSpecificGroupName = useTaskSpecificGroupName;
		useTaskSpecificGroupName = true;
		var tsiValuesArray = new Array();
		loadTaskSpecific(tsiValuesArray);
		useTaskSpecificGroupName = olduseTaskSpecificGroupName;

		var tsiFieldValue = null;
		for (t in tsiValuesArray) {
			if (String(t).indexOf(tsiTaskname + "." + tsiFieldName) != -1) {
				tsiFieldValue = tsiValuesArray[t];
				break;
			}
		}//for all TSIs

		if (tsiFieldValue == null || !tsiFieldValue.equalsIgnoreCase("yes")) {
			return false;
		}

		var cTypeArray = appTypeStr.split("/");
		var childRecs = getChildren(appTypeStr, capId);
        //if a child of type appTypeStr exist, then don't create the child record.
        if(childRecs && childRecs.length > 0) { logDebug("Child of type " + appTypeStr + " already exists."); return true; }
		
		var createChildResult = aa.cap.createApp(cTypeArray[0], cTypeArray[1], cTypeArray[2], cTypeArray[3], "");

		if (createChildResult.getSuccess()) {
			createChildResult = createChildResult.getOutput();
			//createAppHierarchy and copy data
			var appHierarchy = aa.cap.createAppHierarchy(capId, createChildResult);
			copyRecordDetailsLocal(capId, createChildResult);
			copyContacts(capId, createChildResult);
			copyAddresses(capId, createChildResult);
			copyParcels(capId, createChildResult);
			copyOwner(capId, createChildResult);
		} else {
			aa.print("**ERROR create record failed, error:" + createChildResult.getErrorMessage());
			return false;
		}
	} else {
		return false;
	}
	return true;
}

/**
 * this function will create child record based on TSIs field values.
 * @param workflowTasktoCheck work flow task to check
 * @param workflowStatustoCheck work flow status to check
 * @param tsiIsTAPrecordrequired TSI field to check
 * @param tsiNumberOfTaprecords TSI field to check
 * @param childRecordToCreated child record to create
 * @param ofResidentialUnitsASI  ASI to be updated
 * @param BuildingSqFt ASI to be updated
 * @param parentofResidentialUnitsASI 
 * @param parentBuildingSqFt
 */
function autoCreateTapApplicationRecord(workflowTasktoCheck, workflowStatustoCheck, tsiIsTAPrecordrequired, tsiNumberOfTaprecords, childRecordToCreated, ofResidentialUnitsASI,
		BuildingSqFt, parentofResidentialUnitsASI, parentBuildingSqFt) {
	if (wfTask == workflowTasktoCheck && wfStatus == workflowStatustoCheck) {
		var TAPRecordsRequiredflag = false;
		var tsiNumberOfTaprecordsNumber = 0
		var TSIArray = new Array();
		loadTaskSpecific(TSIArray);
		for (tsi in TSIArray) {
			if (tsi == tsiIsTAPrecordrequired && TSIArray[tsi] == "Yes") {
				TAPRecordsRequiredflag = true;
			}

			if (tsi == tsiNumberOfTaprecords && Number(TSIArray[tsi]) > 0) {
				tsiNumberOfTaprecordsNumber = Number(TSIArray[tsi]);
			}
		}

		if (TAPRecordsRequiredflag && tsiNumberOfTaprecordsNumber > 0) {
			for (var i = 0; i < tsiNumberOfTaprecordsNumber; i++) {
				var childRecordToCreatedStructure = childRecordToCreated.split("/");
				//var utilityServiceRecordStructure = utilityServiceRecord.split("/");
				
				
				var childCapId = createChildGeneric(
					childRecordToCreatedStructure[0], 
					childRecordToCreatedStructure[1], 
					childRecordToCreatedStructure[2],
					childRecordToCreatedStructure[3],
					{
						createAsTempRecord: true,
						accessByACA: true,
						copyParcels: true,
						copyAddresses: true,   
						copyOwner: true,
						copyContacts: false,
						customFields: [
							{ key: ofResidentialUnitsASI, val: AInfo[parentofResidentialUnitsASI] },
							{ key: BuildingSqFt, val: AInfo[parentBuildingSqFt] }
						] 					
					}
				)
				
				if(childCapId){
				    logDebug("Created child record: " + childCapId.getCustomID() + " with capId " + childCapId);
				    if(copyPrimContactByType(capId, childCapId, "Applicant")) ;
				    else copyContactsByType(capId, childCapId, "Applicant");
				}
				
				//var appCreateResult = aa.cap.createApp(childRecordToCreatedStructure[0], childRecordToCreatedStructure[1], childRecordToCreatedStructure[2],
				// 		childRecordToCreatedStructure[3], "");

				// if (appCreateResult.getSuccess()) {
				// 	var newId = appCreateResult.getOutput();
				// 	aa.cap.createAppHierarchy(capId, newId);
				// 	copyAddresses(capId, newId);
				// 	copyParcels(capId, newId);
				// 	copyOwner(capId, newId);
				// 	copyContacts(capId, newId);
				// 	editAppSpecific(ofResidentialUnitsASI, AInfo[parentofResidentialUnitsASI], newId);
				// 	editAppSpecific(BuildingSqFt, AInfo[parentBuildingSqFt], newId);
				// 	logDebug("child cap has been created and copy the data : " + newId);
				// } else {
				// 	logDebug("Unable to create planting record ex. : " + appCreateResult.getErrorMessage());
				//}

				//Removed the creation of the Utility Service record per latest specs.
			}
		}
	}
}

/**
 * check wfTaskName, workflowStatusArray and ASIfield value, if matched<br/>a temporary record is created and data copied from current record to new record
 * @param wfTaskName
 * @param workflowStatusArray
 * @param asiFieldName to check if it's values matches 'yes'
 * @param appTypeStr 4 levels application type to create
 * @returns {Boolean}
 */
function autoCreateTempSWMPApplication(wfTaskName, workflowStatusArray, asiFieldName, appTypeStr, emailTemplate) {

    logDebug('autoCreateTempSWMPApplication() started');
    if (wfTask == wfTaskName) {

        var statusMatch = false;

        for (s in workflowStatusArray) {
            if (wfStatus == workflowStatusArray[s]) {
                statusMatch = true;
                break;
            }
        }//for all status options

        if (!statusMatch) {
            return false;
        }
        logDebug('autoCreateTempSWMPApplication() wf status & task match');

        useAppSpecificGroupName = false;
        //var asiFieldValue = getAppSpecific(asiFieldName);
		var thisTSIArr = [];
	    loadTaskSpecific(thisTSIArr);
		var tsiValue = thisTSIArr[asiFieldName]

        
        if (tsiValue == null || !tsiValue.equalsIgnoreCase("yes")) {
            return false;
        }

        var cTypeArray = appTypeStr.split("/");
        var ctm = aa.proxyInvoker.newInstance("com.accela.aa.aamain.cap.CapTypeModel").getOutput();
        ctm.setGroup(cTypeArray[0]);
        ctm.setType(cTypeArray[1]);
        ctm.setSubType(cTypeArray[2]);
        ctm.setCategory(cTypeArray[3]);
        createChildResult = aa.cap.createSimplePartialRecord(ctm, cap.getSpecialText(), "INCOMPLETE EST");

        if (createChildResult.getSuccess()) {
            createChildResult = createChildResult.getOutput();

            //createAppHierarchy and copy data
            var appHierarchy = aa.cap.createAppHierarchy(capId, createChildResult);
            copyRecordDetailsLocal(capId, createChildResult);
            copyAddresses(capId, createChildResult);
            copyParcels(capId, createChildResult);
   //         copyOwner(capId, createChildResult);
            logDebug('calling copyContacts2()');
            copyContacts2(capId, createChildResult, { contactType: 'Project Owner' });
            copyContacts2(capId, createChildResult, { contactType: 'Applicant' });
            copyContacts2(capId, createChildResult, { contactType: 'Developer' });
            copyASITableByTName("POND TYPES", capId, createChildResult);
			
			
             editAppSpecific("Civil Plan Number", capIDString, createChildResult);
            //copyContactsByType(capId, createChildResult, "Applicant");
           // copyContacts(capId, createChildResult);
          //  removeContactsFromCapByType(createChildResult, "Outside Agency");

            var projectOwner = getContactByType("Project Owner", capId);
            if (projectOwner && projectOwner.getEmail() != null && projectOwner.getEmail() != "") {
				//Get ACA Url
	            acaURL = lookup("ACA_CONFIGS", "ACA_SITE");
	            acaURL = acaURL.substr(0, acaURL.toUpperCase().indexOf("/ADMIN"));
				
                var files = new Array();
                var eParams = aa.util.newHashtable();
                addParameter(eParams, "$$altID$$", createChildResult.getCustomID());
                addParameter(eParams, "$$appTypeString$$", cap.getCapType().getAlias());
                addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
                addParameter(eParams, "$$balance$$", feeBalance(""));
                addParameter(eParams, "$$wfTask$$", wfTask);
                addParameter(eParams, "$$wfStatus$$", wfStatus);
                addParameter(eParams, "$$wfDate$$", wfDate);
                if (wfComment != null && typeof wfComment !== 'undefined') {
                    addParameter(eParams, "$$wfComment$$", wfComment);
                }
                addParameter(eParams, "$$wfStaffUserID$$", wfStaffUserID);
                addParameter(eParams, "$$wfHours$$", wfHours);
				
				addParameter(eParams, "$$acaDocDownloadUrl$$", acaURL);


            //  var sent = aa.document.sendEmailByTemplateName("", projectOwner.getEmail(), "", emailTemplate, eParams, files);         
            logDebug('autoCreateTempSWMPApplication() sending email to ' + projectOwner.getEmail());
            var sent = sendNotification("noreply@auroragov.org", projectOwner.getEmail(), "", emailTemplate, eParams, files);
            if (!sent) {
                    logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
                    return false;
                }
            } else {
                logDebug("**WARN Project Owner not found or has no email, capId=" + capId);
            }
        } else {
            logDebug("**ERROR create record failed, error:" + createChildResult.getErrorMessage());
            return false;
        }
    } else {
        return false;
    }
    return true;
}

/**
 * reschedule same inspection, n days after original schedule date, if inspection type/result matches
 * @param inspectionTypesAry
 * @param inspReqResult
 * @param daysToAdd
 * @param emailTemplateName
 * @param reportName
 * @param rptParams
 * @returns {Boolean}
 *
 * 07/25/2018 (evontrapp) - Updated newInspSchedDate to add 7 days from date of result (inspResultDate), rather than date of scheduled inspection (inspSchedDate)
 * 07/25/2018 (evontrpap) - Removed reference to sendEmailWithReport() function, and replaced with sendNotification function
 */
function autoScheduleFailedInspectionsOrgScheduleDatePlusDays(inspectionTypesAry, inspReqResult, daysToAdd, emailTemplateName, reportName, rptParams) {

	for (s in inspectionTypesAry) {
		if (inspType == inspectionTypesAry[s] && inspResult == inspReqResult) {
			
			//schedule new inspection
			var newInspSchedDate = dateAdd(inspResultDate, daysToAdd);
			scheduleInspectDate(inspType, newInspSchedDate);

			//get applicant
			var applicant = getContactByType("Applicant", capId);
			if (!applicant || !applicant.getEmail()) {
				logDebug("**WARN no applicant found on or no email capId=" + capId);
				return false;
			}

			var eParams = aa.util.newHashtable();
			addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
			addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
			addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());

			if (inspId) {
				addParameter(eParams, "$$inspId$$", inspId);
				rptParams.put("inspId", inspId);
			}
			if (inspResult)
				addParameter(eParams, "$$inspResult$$", inspResult);
			if (inspComment)
				addParameter(eParams, "$$inspComment$$", inspComment);
			if (inspResultDate)
				addParameter(eParams, "$$inspResultDate$$", inspResultDate);
			if (inspGroup)
				addParameter(eParams, "$$inspGroup$$", inspGroup);
			if (inspType)
				addParameter(eParams, "$$inspType$$", inspType);
			if (inspSchedDate)
				addParameter(eParams, "$$inspSchedDate$$", inspSchedDate);
			
			//send email with report attachment
			sendNotification("noreply@aurora.gov",applicant.getEmail(),"",emailTemplateName,eParams,"",capID);
			return true;
		}//inspType/Result matched
	}//for all inspection types

	return false;
}

function bldScript25_addCaptialNParkFees(){
    logDebug("bldScript25_addCaptialNParkFees() started");
    try{
        var $iTrc = ifTracer,
            sinFamDet = AInfo["Single Family Detached Home"],
            projCatry = AInfo["Project Category"],
            numResUntStr = AInfo["# of Residential Units"],
            numRetWalls = AInfo["# of Retaining Walls"],
            numResUnt = 0,
            valuation = AInfo["Valuation"],
            valAmt = 0,
            county = getCountyFromAddrOrParcel(),
            feeSched = "BLD_NEW_CON",
            feeItem12 = "BLD_NEW_12",
            feeQty12 = 0,
            feeItem14 = "BLD_NEW_14",
            feeQty14 = 0,
            feeItemPermit = "BLD_NEW_01",
            feeItemIrr = "WAT_IP_01",
            feeQtyIrr = 0,
            feeItemIrrOther = "WAT_IP_02",
            feeQtyIrrOther = 0,
            feeAraCty1 = "BLD_NEW_06",
            feeAraCty2 = "BLD_NEW_07",
            feeQtyCty = 0,
            feeBldUseTxFee = "BLD_NEW_05",
            feeQtyBldUse = 0,
            feeRetWals = "BLD_NEW_13",
            feeQtyRetW = 0,
            feePeriod = "FINAL",
            invFee = "N";
        
        if($iTrc(!isNaN(parseFloat(numResUntStr)), '!isNaN(numResUntStr)'))
            numResUnt = parseFloat(numResUntStr);
        
        if($iTrc(!isNaN(parseFloat(valuation)), '!isNaN(valuation)'))
            valAmt = parseFloat(valuation);
        
        if($iTrc(!isNaN(parseFloat(numRetWalls)), '!isNaN(numRetWalls)'))
            feeQtyRetW = parseFloat(numRetWalls);
        
        if($iTrc(projCatry && sinFamDet == "Yes" && matches(projCatry, "Custom Home", "Single Family From Master"), 'sinFamDet == "Yes" && matches(projCatry, "Custom Home", "Single Family From Master")')){
            feeQty12 = 1327;
            feeQty14 = 497.50;
        }
        
        if($iTrc(sinFamDet == "No" && numResUnt > 0 && projCatry && projCatry != "", 'sinFamDet == "No" && numResUnt > 0 && projCatry')){
            if($iTrc(matches(projCatry, "Custom Home", "Single Family From Master"), 'matches(projCatry, "Multi-Family Building", "Multi-Family From Master")')){
                feeQty12 = 1127.50 * numResUnt;
                feeQty14 = 497.50 * numResUnt;
            }
            
            if($iTrc(matches(projCatry, "Multi-Family Building", "Multi-Family From Master"), 'matches(projCatry, "Multi-Family Building", "Multi-Family From Master")')){
                feeQty12 = 932.00 * numResUnt;
                feeQty14 = 469.67 * numResUnt;
            }
        }
        
        //Irrigation fee
        if($iTrc(matches(projCatry, "Custom Home", "Single Family From Master"), 'matches(projCatry, "Custom Home", "Single Family From Master")'))
            feeQtyIrr = 1;
        else feeQtyIrrOther = 1;
        
        //Calculate materials cost valuation for Tax use fee and county fee
        var materialsCost = AInfo["Materials Cost"];
        var valuation = AInfo["Valuation"];
        if (materialsCost && materialsCost != null && materialsCost != "" && valuation && valuation != null && valuation != ""
                && parseFloat(materialsCost) <= (parseFloat(valuation) / 2)) {
            feeQtyCty = feeQtyBldUse = parseFloat(valuation)/2;
        } else if (materialsCost && materialsCost != null && materialsCost != "" && valuation && valuation != null && valuation != ""
                && parseFloat(materialsCost) > (parseFloat(valuation) / 2)) {
            feeQtyCty = feeQtyBldUse = parseFloat(materialsCost);
        } 
        
        if($iTrc(feeQty12 > 0, feeQty12 + '> 0')) updateFee(feeItem12, feeSched, feePeriod, feeQty12, invFee);
        if($iTrc(feeQty14 > 0, feeQty14 + '> 0')) updateFee(feeItem14, feeSched, feePeriod, feeQty14, invFee);
        if($iTrc(valAmt > 0, valAmt + '> 0')) updateFee(feeItemPermit, feeSched, feePeriod, valAmt, invFee);
        if($iTrc(feeQtyIrr > 0, feeQtyIrr + '> 0')) updateFee(feeItemIrr, feeSched, feePeriod, feeQtyIrr, invFee);
        if($iTrc(feeQtyIrrOther > 0, feeQtyIrrOther + '> 0')) updateFee(feeItemIrrOther, feeSched, feePeriod, feeQtyIrrOther, invFee);
        
        if($iTrc(county == "ARAPAHOE" && feeQtyCty > 0, 'county fee > 0')) {
            updateFee(feeAraCty1, feeSched, feePeriod, feeQtyCty, invFee);
            updateFee(feeAraCty2, feeSched, feePeriod, feeQtyCty, invFee);
        }
        
        if($iTrc(feeQtyBldUse > 0, 'Building Tax fee valuation > 0')) updateFee(feeBldUseTxFee, feeSched, feePeriod, feeQtyBldUse, invFee);
        if($iTrc(feeQtyRetW > 0, 'Number of Retaing Walls > 0')) updateFee(feeRetWals, feeSched, feePeriod, feeQtyRetW, invFee);
        
    }
    catch(err){
        showDebug = true;
        comment("Error on custom function bldScript25_addCaptialNParkFees(). Err: " + err);
        logDebug("Error on custom function bldScript25_addCaptialNParkFees(). Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("bldScript25_addCaptialNParkFees() ended");
}//END bldScript25_addCaptialNParkFees()

function bldScript25_invoiceCaptialNParkFees(){
    logDebug("bldScript25_invoiceCaptialNParkFees() started");
    try{
        var $iTrc = ifTracer,
            feePeriod = "FINAL",
            feeItemArry = ["BLD_NEW_12", "BLD_NEW_14", "BLD_NEW_01", "WAT_IP_01", "WAT_IP_02", "BLD_NEW_06", "BLD_NEW_07", "BLD_NEW_05", "BLD_NEW_13"];
        
        for(aFee in feeItemArry){
            var feeItem = feeItemArry[aFee];
            if($iTrc(feeExists(feeItem), feeItem + ' exists')) invoiceFee(feeItem, feePeriod);
        }
    }
    catch(err){
        showDebug = true;
        comment("Error on custom function bldScript25_invoiceCaptialNParkFees(). Err: " + err);
        logDebug("Error on custom function bldScript25_invoiceCaptialNParkFees(). Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("bldScript25_invoiceCaptialNParkFees() ended");
}//END bldScript25_invoiceCaptialNParkFees()
//Check if owner is doing the work, if not and there is no contractor in the record prevent issuance. 
//Script 2 part2
//By: Tony Ledezma
function bldScript2_noContractorCheck(){
    logDebug("bldScript2_noContractorCheck() started");
    try{
        var $iTrc = ifTracer,
            ownerIsContractor = AInfo["Homeowner acting as Contractor"] == "Yes" ? true : false,
            lpOnFile = lpExistsOnCap(capId),
            ownerApplicantMatch = false,
            cancelMsg = "",
            applicant = getContactByType("Applicant",capId);
            
        if($iTrc(vEventName == "WorkflowTaskUpdateBefore", 'WTUB')){
            //if(getPrimaryOwnerFullName().toUpperCase() == applicantName.toUpperCase()) ownerApplicantMatch = true;
            
            //if($iTrc((!ownerIsContractor && !lpOnFile) || (ownerIsContractor && !ownerApplicantMatch), '(!ownerIsContractor && !lpOnFile) || (ownerIsContractor && !ownerApplicantMatch)'))
            if($iTrc(!ownerIsContractor && !lpOnFile, '!ownerIsContractor && !lpOnFile'))
                cancelMsg = "Contractor is not attached to Permit. Please send an email through Communications tab to the Applicant that the Permit cannot be issued without a Licensed Contractor";
            
            cancel = showMessage = cancelMsg.length > 0;
            
            if(cancel) comment(cancelMsg);
        }
        
        if($iTrc(vEventName == "PaymentReceiveAfter", 'PRA')){
            var applicantName = applicant.getFullName();
            var applicantEmailAddrs = applicant.getEmail();
            
            if(!ownerIsContractor && !lpOnFile){
        
                var applicantEmailAddrs = applicant.getEmail();
                if(applicantEmailAddrs){
                    adResult = aa.address.getAddressByCapId(capId).getOutput(); 
                    for(x in adResult)
                    {
                        var adType = adResult[x].getAddressType(); 
                        var stNum = adResult[x].getHouseNumberStart();
                        var preDir =adResult[x].getStreetDirection();
                        var stName = adResult[x].getStreetName(); 
                        var stType = adResult[x].getStreetSuffix();
                        var city = adResult[x].getCity();
                        var state = adResult[x].getState();
                        var zip = adResult[x].getZip();
                    }
                    
                    var primaryAddress = stNum + " " + preDir + " " + stName + " " + stType + " " + "," + city + " " + state + " " + zip;
                    
                    var emailTemplate = 'BLD PERMIT REQUIRES LP # 2',
                    contactTypes = 'Applicant',
                    emailparams = aa.util.newHashtable();
                    emailparams.put("$$altID$$", capId.getCustomID());
                    emailparams.put("$$FullAddress$$", primaryAddress);
                    emailparams.put("$$ContactEmail$$", applicantEmailAddrs);
                    
                    emailContacts(contactTypes, emailTemplate, emailparams, "", "", "N", "");
					
					return false;
                }
				else{
					logDebug("WARNING: No email address on applicant.  Not issuing permit")
				}
				
				return false;
            }
			
			return true;
        }
    }
    catch(err){
        showMessage = true;
        logDebug("Error on custom function bldScript2_noContractorCheck(). Err: " + err);
        comment();
    }
    logDebug("bldScript2_noContractorCheck() ended");
}//END bldScript2_noContractorCheck()
//Check if owner is doing the work, if not and there is no contractor in the record prevent issuance. 
//Script 2 part2
//By: Tony Ledezma
function bldScript2_noContractorCheck4WTUA(){
    logDebug("bldScript2_noContractorCheck4WTUA() started");
    try{
        var $iTrc = ifTracer,
            ownerIsContractor = AInfo["Homeowner acting as Contractor"] == "Yes" ? true : false,
            lpOnFile = false,
            ownerApplicantMatch = false,
            cancelMsg = "",
            applicant = getContactByType("Applicant",capId);
        
        if($iTrc(wfTask == "Permit Issuance" && wfStatus == "Issued", 'wf:Permit Issuance/Issued')){
            var licProfResult = aa.licenseScript.getLicenseProf(capId);
            if (!licProfResult.getSuccess()){
                logDebug("Error getting CAP's license professional: " +licProfResult.getErrorMessage());
                //return false;
            }
            else{
                var licProfList = licProfResult.getOutput();
                if(licProfList && licProfList.length > 0) lpOnFile = true;
            }
            
            var applicantName = applicant.getFullName();
            var applicantEmailAddrs = applicant.getEmail();
            if(getPrimaryOwnerFullName().toUpperCase() == applicantName.toUpperCase()) ownerApplicantMatch = true;
            
            if($iTrc((!ownerIsContractor && !lpOnFile) || (ownerIsContractor && !ownerApplicantMatch), '(!ownerIsContractor && !lpOnFile) || (ownerIsContractor && !ownerApplicantMatch)'))
                cancelMsg = "UNABLE to issue permit without a Contractor attached.  Email has been sent to applicant. Task has been updated to In Progress";
            
            cancel = showMessage = cancelMsg.length > 0;
            
            if(cancel) {
				comment(cancelMsg);
				updateTask("Permit Issuance", "In Progress", "Updated via script.", "Updated via script 2. A contractor is needed before issuing permit.");
				updateAppStatus("In Progress","");
				
				if(applicantEmailAddrs){
				    adResult = aa.address.getAddressByCapId(capId).getOutput(); 
			        for(x in adResult)
			        {
			        	var adType = adResult[x].getAddressType(); 
			        	var stNum = adResult[x].getHouseNumberStart();
			        	var preDir =adResult[x].getStreetDirection();
			        	var stName = adResult[x].getStreetName(); 
			        	var stType = adResult[x].getStreetSuffix();
			        	var city = adResult[x].getCity();
			        	var state = adResult[x].getState();
			        	var zip = adResult[x].getZip();
			        }
	                
	                var primaryAddress = stNum + " " + preDir + " " + stName + " " + stType + " " + "," + city + " " + state + " " + zip;
				    
				    var emailTemplate = 'BLD PERMIT REQUIRES LP # 2',
                    contactTypes = 'Applicant',
                    emailparams = aa.util.newHashtable();
				    emailparams.put("$$altID$$", capId.getCustomID());
	                emailparams.put("$$FullAddress$$", primaryAddress);
				    emailparams.put("$$ContactEmail$$", applicantEmailAddrs);
				    
                    emailContacts(contactTypes, emailTemplate, emailparams, "", "", "N", "");
				}
			}
            
        }
    }
    catch(err){
        showMessage = true;
        logDebug("Error on custom function bldScript2_noContractorCheck4WTUA(). Err: " + err);
        comment();
    }
    logDebug("bldScript2_noContractorCheck4WTUA() ended");
}//END bldScript2_noContractorCheck4WTUA()
/* For Building/Permit/New Building/NA 
     If workflow task = "Fee Processing" and Status = "Ready to Pay" check Custom Field "Single Family Residential Detached Home" = Yes 
     if so then insert Irrigation Fee (Fee schedule = WAT_IP, fee item = WAT_IP_01 amount is CONSTANT at
     $30.75 
     Also Mark the Irrigation Inspection as Pending. 
     
     If Custom Field "Single Family Residential Detached Home" = No
     just mark the Irrigation Inspection as Pending and do not insert the Irrigation Fee.
*/
function bldScript390_addSinFamFee(){
    logDebug("bldScript390_addSinFamFee() started");
    try{
        var $iTrc = ifTracer,
            sinFamDet = AInfo["Single Family Detached Home"],
            feeSched = "WAT_IP",
            feeItem = "WAT_IP_01",
            feePeriod = "FINAL",
            invFee = "N",
            feeQty = 1;
        
        if($iTrc(sinFamDet == "Yes", 'sinFamDet == "Yes"')){
            updateFee(feeItem, feeSched, feePeriod, feeQty, invFee);
            createPendingInspection("BLD_NEW_CON", "Irrigation Inspection");
        }
        
        if($iTrc(sinFamDet == "No", 'sinFamDet == "No"'))
            createPendingInspection("BLD_NEW_CON", "Irrigation Inspection");
    }
    catch(err){
        showDebug = true;
        comment("Error on custom function bldScript390_addSinFamFee(). Err: " + err);
        logDebug("Error on custom function bldScript390_addSinFamFee(). Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("bldScript390_addSinFamFee() ended");
}//END bldScript390_addSinFamFee()
function bldScript418SetTskDueDate(){
    logDebug("bldScript418SetTskDueDate() started");
    try{
        var taskToUpdateDueDte = [];
        var daysForDueDate = 0;
        
        if(appMatch("Building/Permit/New Building/NA")){
            var projCat = AInfo["Project Category"];
            
            if(projCat == "Custom Home"){
                taskToUpdateDueDte.push("Structural Plan Review","Electrical Plan Review","Mechanical Plan Review","Plumbing Plan Review","Structural Engineering Review","Bldg Life Safety Review","Fire Life Safety Review");
                daysForDueDate = 21;
            }
            
            if(matches(projCat, "Assembly Building","Business Use Building","Factory Use Building","Group E Building","Group U Building",
                                "Hotel Building","Institutional Use Building","Mercantile Use Building","Non-Res Addition",
                                "Storage Use Building","Multi-Family Building")){
                taskToUpdateDueDte.push("Structural Plan Review","Electrical Plan Review","Mechanical Plan Review","Plumbing Plan Review","Structural Engineering Review","Bldg Life Safety Review","Fire Life Safety Review")
                daysForDueDate = 26;
            }
            
            if(projCat == "Single Family From Master"){
                taskToUpdateDueDte.push("Structural Plan Review");
                daysForDueDate = 7;
            }
        }
        
        if(appMatch("Building/Permit/Master/NA")){
            var masterPlnTyp = AInfo["Master Plan Type"];
            
            if(masterPlnTyp != "Other"){
                taskToUpdateDueDte.push("Structural Plan Review","Electrical Plan Review","Mechanical Plan Review","Plumbing Plan Review","Structural Engineering Review","Bldg Life Safety Review","Fire Life Safety Review");
                daysForDueDate = 21;
            }
        }
        
        if(taskToUpdateDueDte.length > 0)
            for(tsk in taskToUpdateDueDte)
                editTaskDueDate(taskToUpdateDueDte[tsk], dateAdd(wfDateMMDDYYYY, daysForDueDate, true))
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function bldScript418SetTskDueDate(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function bldScript418SetTskDueDate(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("bldScript418SetTskDueDate() ended");
}//END bldScript418SetTskDueDate()
/* For Building/Permit/New Building/NA 
     where property abuts publicly dedicated street, except major arterials. 
     a Forestry fee is required. When Forestry Review task has a status = Approved and
       Custom Field "Forestry Fee Non Arterial Frontage" is greater than 0 or not null (Subgroup: PROJECT FEE INFORMATION).
       Add fee in the amount of Custom Field "Forestry Fee Non Arterial Frontage",
       select what fee item to add based on
       If Custom Field "Single Family Detached Home" = Yes then
        add fee (Fee Schedule BLD_NEW_CON - feecode BLD_NEW_16 - Fee Amount = Value in Custom Field * 6.80 in Custom Field "Forestry Fee Non Arterial Frontage")
       
       If Custom Field "Single Family Detached Home" = No
        then add fee (Fee Schedule BLD_NEW_CON - feecode BLD_NEW_17 - Fee Amount = Value in Custom Field * 3.40 in Custom Field "Forestry Fee Non Arterial Frontage")
*/
function bldScript48_addForestryFee(){
    logDebug("bldScript48_addForestryFee() started");
    try{
        var $iTrc = ifTracer,
            forFeeNonArtFront = AInfo["Forestry Fee Non Arterial Frontage"],
            sinFamDet = AInfo["Single Family Detached Home"],
            feeSched = "BLD_NEW_CON",
            feeItem = "",
            feePeriod = "FINAL",
            invFee = "N",
            feeQty = 0;
        
        if($iTrc(forFeeNonArtFront == null || forFeeNonArtFront == undefined || forFeeNonArtFront == "" || (parseFloat(forFeeNonArtFront)) <= 0, 'AInfo["Forestry Fee Non Arterial Frontage"] not valid')) return;
        
        if($iTrc(wfTask == "Forestry Review" && wfStatus == "Approved", 'wf:Forestry Review/Approved')){
            feeQty = parseFloat(forFeeNonArtFront);
            
            if($iTrc(sinFamDet == "Yes", 'sinFamDet == "Yes"')){
                feeItem = "BLD_NEW_16"; feeQty = 6.80;
            }
            if($iTrc(sinFamDet == "No", 'sinFamDet == "No"')){
                feeItem = "BLD_NEW_17"; feeQty = 3.40;
            }
                    
            if($iTrc(feeItem != "" && feeQty > 0, feeItem + ' != "" && ' + feeQty + ' > 0')) updateFee(feeItem, feeSched, feePeriod, feeQty, invFee);
        }
    }
    catch(err){
        showDebug = true;
        comment("Error on custom function bldScript48_addForestryFee(). Err: " + err);
        logDebug("Error on custom function bldScript48_addForestryFee(). Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("bldScript48_addForestryFee() ended");
}//END bldScript48_addForestryFee()
function bldScript6_FinalInspComplete(){
    logDebug("bldScript6_FinalInspComplete() started")
    try{
        var $iTrc = ifTracer,
            pendOrSched = inspectionsByStatus(capId, "scheduled") || inspectionsByStatus(capId, "pending"),
            lettersReceived = checkReqLettersReceived(capId),
            certOfOccup = AInfo["Certificate of Occupancy"] == "CHECKED";
            
        if($iTrc(inspResult == "Final" && !pendOrSched, 'New Building && inspResult == "Final" AND no pending or scheduled inspections')){
            if($iTrc(appTypeString == "Building/Permit/New Building/NA", 'New Building'))
                if($iTrc(lettersReceived && !certOfOccup, 'lettersReceived && !certOfOccup')) {
                    closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
				}
            
            if($iTrc(appTypeString == "Building/Permit/Plans/NA" && !certOfOccup, 'appTypeString == "Building/Permit/Plans/NA" && !certOfOccup')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}
            
            if($iTrc(appTypeString == "Building/Permit/No Plans/NA", 'appTypeString == "Building/Permit/No Plans/NA"')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}

			if($iTrc(appTypeString == "Building/Permit/OTC/AC Only", 'appTypeString == "Building/Permit/OTC/AC Only"')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}

			if($iTrc(appTypeString == "Building/Permit/OTC/Furnace", 'appTypeString == "Building/Permit/OTC/Furnace"')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}

			if($iTrc(appTypeString == "Building/Permit/OTC/Furnace and AC", 'appTypeString == "Building/Permit/OTC/Furnace and AC"')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}

			if($iTrc(appTypeString == "Building/Permit/OTC/Furnace AC and Water Heater", 'appTypeString == "Building/Permit/OTC/Furnace AC and Water Heater"')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}

			if($iTrc(appTypeString == "Building/Permit/OTC/Commercial Roof", 'appTypeString == "Building/Permit/OTC/Commercial Roof"')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}

            if($iTrc(appTypeString == "Building/Permit/OTC/Gas Pipe", 'appTypeString == "Building/Permit/OTC/Gas Pipe"')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}			

			if($iTrc(appTypeString == "Building/Permit/OTC/Residential Electrical Service", 'appTypeString == "Building/Permit/OTC/Residential Electrical Service"')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}

			if($iTrc(appTypeString == "Building/Permit/OTC/Residential Roof", 'appTypeString == "Building/Permit/OTC/Residential Roof"')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}

			if($iTrc(appTypeString == "Building/Permit/OTC/Siding", 'appTypeString == "Building/Permit/OTC/Siding"')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}

			if($iTrc(appTypeString == "Building/Permit/OTC/Tankless Water Heater", 'appTypeString == "Building/Permit/OTC/Tankless Water Heater"')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}

			if($iTrc(appTypeString == "Building/Permit/OTC/Water Heater", 'appTypeString == "Building/Permit/OTC/Water Heater"')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}

			if($iTrc(appTypeString == "Building/Permit/OTC/Water Heater and AC", 'appTypeString == "Building/Permit/OTC/Water Heater and AC"')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}

			if($iTrc(appTypeString == "Building/Permit/OTC/Water Heater and Furnace", 'appTypeString == "Building/Permit/OTC/Water Heater and Furnace"')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}

			if ((allTasksComplete("BLD_NEWCON") == false) || (allTasksComplete("BLD_MASTER") == false)){
					updateAppStatus("Issued","Status updated via script 6");				
			}
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function bldScript6_FinalInspComplete(). Err: " + err);
    }
    logDebug("bldScript6_FinalInspComplete() ended")
}//END bldScript6_FinalInspComplete()
function buildFullName(firstName,middleName,lastName) 
{   var fullName = "";  
 if(firstName && firstName != null)   {   fullName +=firstName;   } 
  if(middleName && middleName != null)   {   fullName += " "+ middleName   }  
   if(lastName && lastName != null)   {   fullName += " "+ lastName   }  
    return fullName; 
   }

function calcExpDate(issueDate) {
    // issueDate + 3
    var date = new Date(dateAdd(issueDate, 1095));
    // Set to the last day of that month 
    expDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    // If February, and its a leap year, then use 28th
    if ((expDate.getMonth() + 1) == 2) {
        if (expDate.getDate() == 29) {
            expDate.setDate(28);
        }
    }

    return aa.date.parseDate(((date.getMonth() + 1) + "/" + expDate.getDate() + "/" + date.getFullYear()));
}


/**
 * check workflow task/status and either add or invoice Fees
 * 
 * @param feeSchedName fee schedule name
 * @param {array} feeCodesAry fee codes to add or invoice
 * @param addFeesWfTaskName wfTask name, when matched - add fee related
 * @param addFeesWfStatusAry wfStatus name, when matched - add fee related
 * @param invoiceFeesWfTaskName wfTask name, when matched - invoice fee related
 * @param invoiceFeesWfStatusAry wfStatus name, when matched - invoice fee related
 * @returns {Boolean}
 */
function calculateAndAssessConstructionBuildingFees(feeSchedName, feeCodesAry, addFeesWfTaskName, addFeesWfStatusAry, invoiceFeesWfTaskName, invoiceFeesWfStatusAry) {

	if (wfTask == addFeesWfTaskName) {
		var statusMatch = false;
		for (s in addFeesWfStatusAry) {
			if (wfStatus == addFeesWfStatusAry[s]) {
				statusMatch = true;
				break;
			}
		}//for all status options

		if (statusMatch) {
			//Add Fees:
			for (fc in feeCodesAry) {
				addFee(feeCodesAry[fc], feeSchedName, "FINAL", 1, "N");
			}
		}

	}

	if (wfTask == invoiceFeesWfTaskName) {
		var statusMatch = false;
		for (s in invoiceFeesWfStatusAry) {
			if (wfStatus == invoiceFeesWfStatusAry[s]) {
				statusMatch = true;
				break;
			}
		}//for all status options

		if (statusMatch) {
			//Invoice Fees:
			for (fc in feeCodesAry) {
				invoiceFee(feeCodesAry[fc], "FINAL");
			}
		}
	}
	return true;
}

/**
 * check wfTask and status, if matched asiField value is updated (now + expireAfterYears)
 * @param workFlowTask
 * @param workflowStatusArray
 * @param asiFieldName
 * @param expireAfterYears number of years to add to NOW date
 * @returns {Boolean}
 */
function calculateAndUpdateRezoningExpirationDate(workFlowTask, workflowStatusArray, asiFieldName, expireAfterYears) {

	if (wfTask == workFlowTask) {

		var statusMatch = false;

		for (s in workflowStatusArray) {
			if (wfStatus == workflowStatusArray[s]) {
				statusMatch = true;
				break;
			}
		}//for all status options

		if (!statusMatch) {
			return false;
		}

		var newExpDate = new Date();
		newExpDate = dateAddMonths(newExpDate, (expireAfterYears * 12));

		var olduseAppSpecificGroupName = useAppSpecificGroupName;
		useAppSpecificGroupName = false;
		editAppSpecific(asiFieldName, newExpDate);
		useAppSpecificGroupName = olduseAppSpecificGroupName;
	} else {
		return false;
	}
	return true;
}
function cancelForestryInsp(){
	try {
		var treeInvList=loadASITable("TREE INFORMATION",capId);
		if (treeInvList != "undefined") {
			cancelInspections(treeInvList);
		}
		
	}catch(e){
		aa.debug("****Error in Canceling Inspection",e);
	}
}

function cancelForestryInspection(workFlowTask, workflowStatusArray, inspTypeToCancel) {
	logDebug("Begin Script 377");
	if (wfTask == workFlowTask) {

		var statusMatch = false;

		for (s in workflowStatusArray) {
			if (wfStatus == workflowStatusArray[s]) {
				statusMatch = true;
				break;
			}
		}//for all status options

		if (!statusMatch) {
			return false;
		}

		var inspections = aa.inspection.getInspections(capId);
		if (!inspections.getSuccess()) {
			logDebug("**WARN get inspection failed capId=" + capId + " Error:" + inspections.getErrorMessage());
			return false;
		}

		inspections = inspections.getOutput();
		for (i in inspections) {
			if (inspections[i].getInspectionType() == inspTypeToCancel && inspections[i].getInspectionStatus() == "Scheduled") {
				var canceled = aa.inspection.cancelInspection(capId, inspections[i].getIdNumber());
				if (!canceled.getSuccess()) {
					logDebug("**WARN cancelInspection failed capId=" + capId + " InspectionId=" + inspections[i].getIdNumber() + " Error:" + inspections.getErrorMessage());
				}
				logDebug("Canceled Foresty Site Review Inspection");
				logDebug("End Script 377");
				return canceled.getSuccess();
			}//Scheduled inspection found
		}//for all inspections
	} else {
		logDebug("Wrong workflow status: End Script 377");
		return false;
		
	}

	return false;
}
function cancelInspections(treeInvList) {
	var inspResultObj = aa.inspection.getInspections(capId);
	if (inspResultObj.getSuccess()) {
		inspList = inspResultObj.getOutput();
		for (xx in inspList) {
			var isMatch = false;
			var inspId = inspList[xx].getIdNumber();
			var act = inspList[xx].getInspection().getActivity();
			var unitNbr = act.getUnitNBR();
			for (row in treeInvList) {
				var treeId = treeInvList[row]["Tree ID"].fieldValue;
				if (unitNbr != null) {
					if (unitNbr.equals(treeId)) {
						isMatch = true;
						break;
					}

				}

			}
			if (!isMatch){
				var res=aa.inspection.cancelInspection(capId, inspId);
				if (res.getSuccess()){
					aa.debug("Inspection Canceled" , inspId);
				}
			}
				

		}
	}
}

function checkAddressOnCap(){
	// if all address required fields are empty , then no address provided
	if (!isBlankOrNull(AddressHouseNumber) || !isBlankOrNull(AddressStreetName) || !isBlankOrNull(AddressValidatedNumber)){
		return true;
	}	
	return false ;
}
function checkAndScheduleInspectionPerTreeId(inspType, guideSheetType, asitFieldName) {

	//get ref on ASIT array object [from event variables]
	var tn = String(asitFieldName).replace(/[^a-zA-Z0-9]+/g, '');
	if (!isNaN(tn.substring(0, 1)))
		tn = "TBL" + tn
	var assignExpr = 'asitValues=' + tn;

	var asitValues = null;
	eval(assignExpr);

	if (asitValues == null || asitValues.length == 0) {
		logDebug("**WARN no rows in ASIT " + asitFieldName);
		return false;
	}

	//load current inspections once
	var inspections = aa.inspection.getInspections(capId).getOutput();

	//collect new inspection/treeId for one-shot update
	var inspectionIdTreeIdMap = new Array();
	var inspectionIdExistingDiameterMap = new Array();

	for (i in asitValues) {
		var treeId = asitValues[i]["Tree ID"].fieldValue;
		var existingDiameter = asitValues[i]["Existing Diameter"].fieldValue;
		if (!hasInspection(inspections, treeId, existingDiameter, inspType)) {
			var capDetails = aa.cap.getCapDetail(capId).getOutput();
			var asgnUserID = capDetails.getAsgnStaff();
			var capView = aa.cap.getCapViewByID(capId).getOutput();
			var capDetailsDesc = capView.getCapWorkDesModel().getDescription();
			var inspectorUser = aa.person.getUser(asgnUserID).getOutput();

			var schedRes = aa.inspection.scheduleInspection(capId, inspectorUser, aa.date.parseDate(nextWorkDay(new Date())), null, inspType, capDetailsDesc);
			if (schedRes.getSuccess()) {
				inspectionId = schedRes.getOutput();
				inspectionIdTreeIdMap[inspectionId] = treeId;
				inspectionIdExistingDiameterMap[inspectionId] = existingDiameter;
				
			} else {
				logDebug("ERROR: scheduling inspection for TreeID (" + treeId + "): " + schedRes.getErrorMessage());
				continue;
			}
		
		}//treeId matched
	}//for all asitValues
	updateInspectionInfo(inspectionIdTreeIdMap, inspectionIdExistingDiameterMap, guideSheetType);
	
	return true;
}


/**
 * check all completed inspections on record if result matches inspResult
 * @param inspResult
 * @returns {Boolean} return true if any of inspections has Result = inspResult, false otherwise
 */
function checkAnyInspectionPassed(recordCapId) {
	var n = aa.inspection.getInspections(recordCapId);
	if (n.getSuccess()) {
		var r = n.getOutput();
		for (xx in r)
			if (String("Complete").equals(r[xx].getInspectionStatus()))
				return true;
	}
	return false;
}

/**
 * check wfTask and wfStatus match, and check if no invoiced fees, block submit
 * @param workFlowTask
 * @param workflowStatusArray
 * @returns {Boolean}
 */
function checkApplicatoinSubmittalRequiredFees(workFlowTask, workflowStatusArray) {

	if (wfTask == workFlowTask) {

		var statusMatch = false;

		for (s in workflowStatusArray) {
			if (wfStatus == workflowStatusArray[s]) {
				statusMatch = true;
				break;
			}
		}//for all status options

		if (!statusMatch) {
			return false;
		}

		if (!hasInvoicedFees(capId, "")) {
			cancel = true;
			showMessage = true;
			comment("Fees must be added and Invoiced to Accept the Application Submittal");
			return true;
		}
		return false;
	} else {
		return false;
	}
}


/**
 * Check if Balance=0, record has certain status, record type matches certain type, then update wfTask and App Status
 * 
 * @param recordTypesArray {Array} record types to check if matches (4 levels)
 * @param recordStatusToCheck Cap Status to match with
 * @param wfTaskUpdate wfTask to update then deactivate
 * @param wfStatusUpdate wfStatus to use in wfTask update
 * @param newAppStatus new cap status
 * @returns {Boolean}
 */
function checkBalanceAndStatusUpdateRecord(recordTypesArray, recordStatusToCheck, wfTaskUpdate, wfStatusUpdate, newAppStatus) {
    logDebug("checkBalanceAndStatusUpdateRecord() started");
    for (r in recordTypesArray) {
        if (appMatch(recordTypesArray[r]) && balanceDue == 0) {
            if (recordStatusToCheck != null && recordStatusToCheck == cap.getCapStatus()) {
                if (wfTaskUpdate != null && wfStatusUpdate != null) {
                    closeTask(wfTaskUpdate, wfStatusUpdate, "by script", "by script");
                    deactivateTask(wfTaskUpdate);
                }
                if (newAppStatus != null) {
                    updateAppStatus(newAppStatus, "by script");
                }
                
                logDebug("checkBalanceAndStatusUpdateRecord() ended with true");
                return true;
            }//capStatus
        }//type and balance
    }//for all record types
    logDebug("checkBalanceAndStatusUpdateRecord() ended with false");
    return false;
}

/**
 * 
 * @param emailTemplateName
 * @param wfTaskFees
 * @param wfStatusFees
 * @param wfTaskClose
 * @param wfStatusClose
 * @param newAppStatus
 * @returns {Boolean}
 */
function checkBalanceSendEmailAndUpdateWf(emailTemplateName, wfTaskFees, wfStatusFees, wfTaskClose, wfStatusClose, newAppStatus) {
	if (balanceDue == 0) {
		//process WF tasks
		closeTask(wfTaskFees, wfStatusFees, "by script, PRA balance=0", "by script, PRA balance=0");
		closeTask(wfTaskClose, wfStatusClose, "by script, PRA balance=0", "by script, PRA balance=0");

		//Update app Status:
		updateAppStatus(newAppStatus, "by script, PRA balance=0");

		//send email
		var applicant = getContactByType("Applicant", capId);
		if (!applicant || !applicant.getEmail()) {
			logDebug("**WARN no applicant found on or no email capId=" + capId);
			return false;
		}
		var toEmail = applicant.getEmail();

		var eParams = aa.util.newHashtable();

		//load ASi and ASIT
		var olduseAppSpecificGroupName = useAppSpecificGroupName;
		useAppSpecificGroupName = false;
		var asiValues = new Array();
		var asitSize = loadASITable("SIZE");
		loadAppSpecific(asiValues)
		useAppSpecificGroupName = olduseAppSpecificGroupName;

		var sizes = new Array();
		for (c in asitSize) {
			var size = asitSize[c]["Size"].fieldValue;
			sizes.push(size)
		}

		addParameter(eParams, "$$size$$", sizes.toString());
		addParameter(eParams, "$$amountPaid$$", PaymentTotalPaidAmount);
		addParameter(eParams, "$$utilityPermitNumber$$", asiValues["Utility Permit Number"]);
		addParameter(eParams, "$$civilPlanNumber$$", asiValues["Civil Plan Number"]);

		addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
		addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());

		var reportFile = [];
		var sent = sendNotification("noreply@aurora.gov",toEmail,"",emailTemplateName,eParams,reportFile);
		if (!sent) {
			logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
			return false;
		}
		return true;
	}
	return false;
}
/* check if at least one document is not of document type */
function checkDocNotOfType(DocumentType){
	for (var i = 0; i < documentModelArray.size(); i++) {
		var documentModel = documentModelArray.get(i);
		var documentCategory = documentModel.getDocCategory();
		if (documentCategory != null && !documentCategory.equals(DocumentType)){
			//logDebug("DocumentType " + documentCategory);
			 return true;
	    }
		else 
		    return false;
	}
}
function checkDocumentsActivateTask(workFlowTask, workflowStatusArray, activateAndTsiTaskName, recordStatus) {
	logDebug("DONB x1")
	if (cap.getCapStatus() != recordStatus) {
		return false;
	}
	logDebug("DONB x2")
	var matched = false;
	for (s in workflowStatusArray) {
		if (isTaskStatus(workFlowTask, workflowStatusArray[s])) {
			matched = true;
			break;
		}
	}//for all statuses

	if (!matched) {
		return false;
	}
	logDebug("DONB x3")	
	var olduseTaskSpecificGroupName = useTaskSpecificGroupName;
	useTaskSpecificGroupName = true;
	var tsiValues = new Array();
	loadTaskSpecific(tsiValues);
	useTaskSpecificGroupName = olduseTaskSpecificGroupName;

	var totalUploaded = 0, totalChecked = 0;

	if (!tsiValues) {
		logDebug("**WARN no TSI found workflow, capId=" + capId);
		return false;
	}

	for (t in tsiValues) {
		if (t.indexOf(activateAndTsiTaskName) != -1 && tsiValues[t] == "CHECKED") {
			var uploaded = checkDocumentUploaded(t);
			++totalChecked;
			logDebug("DONB1 totalChecked" + totalChecked)
			if (uploaded) {
				++totalUploaded;
				logDebug("DONB2 totalUploaded" + totalUploaded)
			}
		}//checked TSI for required task
	}//for all TSIs

	if (totalChecked == totalUploaded) {
		var task = aa.workflow.getTask(capId, activateAndTsiTaskName);
		if (task.getSuccess()) {
			task = task.getOutput();
		}
		task.setActiveFlag("Y");
		task.setStatusDate(aa.date.getScriptDateTime(new Date()));
		task.setDueDate(aa.date.getScriptDateTime(convertDate(dateAdd(new Date(), 1))));
		var edited = aa.workflow.editTask(task);
		if (!edited.getSuccess()) {
			logDebug("**WARN Task Update Failed, Err:" + edited.getErrorMessage());
		}
	}
	return true;
}


//documentModelArray contains only uploaded docs, not already uploaded
var docs = null;//to load it once

function checkDocumentUploaded(documentType) {
	var lastIndex = documentType.lastIndexOf(".");
	if (lastIndex <= 0) {
		return false;
	}
	documentType = documentType.substring(lastIndex + 1);
	if (docs == null) {
		//documentModelArray contains only uploaded docs, not already uploaded
		docs = aa.document.getCapDocumentList(capId, aa.getAuditID()).getOutput();
	}
	for (d in docs) {
		if (documentType == docs[d].getDocCategory().toString()) {
			return true;
		}
	}
	return false;
}
function checkForDuplicateForestryReqRecord(){
try{
	if(!publicUser){ //if CTRCA ,use publicUser
		var appType="Forestry/Request/*/*";
		useAppSpecificGroupName=false;
		var sOfReq=getAppSpecific("Source of Request",capId);
		var sameAddressCapId=getCapByAddressN(appType,capId,sOfReq);
		if (sameAddressCapId==false){//no matching record with the same address
			// check parcel matching
			var sameParcelCapId=getCapByParcel(appType,capId,sOfReq);
			if (sameParcelCapId!=false && sameParcelCapId!=null){
				var detailedDesc= workDescGet(capId) != null ? workDescGet(capId) + '-' : '';
				updateWorkDesc(String(detailedDesc) + "Possible duplicate of record " + sameAddressCapId.getCustomID() ,capId);    
			}
		}else if(sameAddressCapId!=null){
			 // get the detail description and append the record id to it
			  var detailedDesc= workDescGet(capId) != null ? workDescGet(capId) + '-' : '';
			  updateWorkDesc(String(detailedDesc) + "Possible duplicate of record " + sameAddressCapId.getCustomID() ,capId);    
		}
		
	}
}catch(e){
	logDebug("****ERROR IN ASA:FORESTRY/REQUEST/*/*:**** "+ e);
}
}

/*
* Checks all agency holiday calendars for an event on the specified date
* Returns true if there is an event, else false
* date - javascript date object
*/
function checkHolidayCalendar(date){
	try{
	//check if this is a weekend and return true if yes
	var dayOfWeek = date.getDay();
 	if (dayOfWeek == 0 || dayOfWeek == 6) return true;
 	//now check the calendar
	var holiday = false;
	var calArr = new Array();
	var agency = aa.getServiceProviderCode()
	//get the holiday calendars
	var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
	var ds = initialContext.lookup("java:/AA");
	var conn = ds.getConnection();
	var selectString = "select * from CALENDAR WHERE SERV_PROV_CODE = ? AND CALENDAR_TYPE='AGENCY HOLIDAY' AND  REC_STATUS='A'";
	var sStmt = conn.prepareStatement(selectString);
	sStmt.setString(1, agency);
	var rSet = sStmt.executeQuery();
	while (rSet.next()) {
		calArr.push(rSet.getString("CALENDAR_ID"));
	}
	sStmt.close();
	for (var c in calArr){
		var cal = aa.calendar.getCalendar(calArr[c]).getOutput();
		var events = aa.calendar.getEventSeriesByCalendarID(calArr[c], date.getYear()+1900, date.getMonth()+1).getOutput();
		for (var e in events){
			var event = events[e];
			var startDate = new Date(event.getStartDate().getTime());
			var startTime = event.getStartTime();
			var endDate = event.getEndDate();
			var allDay = event.isAllDayEvent();
			var duration = event.getEventDuration();
			if (dateDiff(startDate,date) >= 0  && dateDiff(startDate,date) < 1){
				holiday = true;
			}
		}
	}
	return holiday;
	}
	catch(r){aa.print(r);}
}

/*
* Checks all agency holiday calendars for an event on the specified date
* Returns true if there is an event, else false
* date - javascript date object
*/
function checkHolidayCalendarIgnoreWeekends(date){
	try{
	//check if this is a weekend and return true if yes
	//var dayOfWeek = date.getDay();
 	//if (dayOfWeek == 0 || dayOfWeek == 6) return true;
 	//now check the calendar
	var holiday = false;
	var calArr = new Array();
	var agency = aa.getServiceProviderCode()
	//get the holiday calendars
	var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
	var ds = initialContext.lookup("java:/AA");
	var conn = ds.getConnection();
	var selectString = "select * from CALENDAR WHERE SERV_PROV_CODE = ? AND CALENDAR_TYPE='AGENCY HOLIDAY' AND  REC_STATUS='A'";
	var sStmt = conn.prepareStatement(selectString);
	sStmt.setString(1, agency);
	var rSet = sStmt.executeQuery();
	while (rSet.next()) {
		calArr.push(rSet.getString("CALENDAR_ID"));
	}
	sStmt.close();
	for (var c in calArr){
		var cal = aa.calendar.getCalendar(calArr[c]).getOutput();
		var events = aa.calendar.getEventSeriesByCalendarID(calArr[c], date.getYear()+1900, date.getMonth()+1).getOutput();
		for (var e in events){
			var event = events[e];
			var startDate = new Date(event.getStartDate().getTime());
			var startTime = event.getStartTime();
			var endDate = event.getEndDate();
			var allDay = event.isAllDayEvent();
			var duration = event.getEventDuration();
			if (dateDiff(startDate,date) >= 0  && dateDiff(startDate,date) < 1){
				holiday = true;
			}
		}
	}
	return holiday;
	}
	catch(r){aa.print(r);}
}

function checkIfAddressOrParcelExists(){
try{
	if (!(checkAddressOnCap() || checkParcelOnCap())){
		throw "Address or Parcel is required" ;
	}
}catch(e){
	cancel = true;
	showMessage = true;
	comment(e);
}
}
function checkIfAddressParcelExistOnCap(){
	try{
		var addressP =checkAddressOnCap();
		var ParcelP= checkParcelOnCap();
			
		if (addressP==false && ParcelP==false){
			throw "You must supply an address, intersection or a parcel before proceeding" ;
		}	
		
	}catch(e){
		cancel = true;
		showMessage = true;
		comment(e);
	}
}

function checkIfAllFeesPaid() {
	try {
		if (wfTask == "Signatures" && wfStatus == "Routed for Signatures") {
			// check balance & fees of status New
			if (balanceDue > 0) {
				throw "Route for Signatures requires all fees to be paid";
			}else {
				// check fees status
				var fees = loadFees();
				for ( var i in fees) {
					var feeStatus = fees[i].status;
					if (feeStatus == "NEW") {
						throw "Route for Signatures requires all fees to be paid";
					}

				}

			}
		}
		
	} catch (e) {
		cancel = true;
		showMessage = true;
		comment(e);
	}
}

function checkIfDocUploaded(DocumentType){
	for (var i = 0; i < documentModelArray.size(); i++) {
		var documentModel = documentModelArray.get(i);
		var documentCategory = documentModel.getDocCategory();
		if (documentCategory!=null && documentCategory.equals(DocumentType)){
			//logDebug("DocumentType " + documentCategory);
			 return documentCategory;
	      }
		  else 
		  return false;
	}
}
/**
 * checks if the document of type @DocumentType is uploaded and then updates the wf tasks with Status "Resubmittal Requested" to the new status @newStatus and activate it
 * @Param DocumentType {string}
 * @Param newStatus {string}
 */
function checkIfDocUploadedAndUpdateWfTask(DocumentType,newStatus){
	for (var i = 0; i < documentModelArray.size(); i++) {
		var documentModel = documentModelArray.get(i);
		var documentCategory = documentModel.getDocCategory();
		if (documentCategory!=null && documentCategory.equals(DocumentType)){
			 setWFStatusAndActivate(newStatus);
			 break;
	      }
	}
}
function checkIfPassedInspections(InspectionType){
	try{
		if (InspectionType != "Reroof Final"){
			if (String(InspectionType).indexOf("Final")>0){
				var result=checkInspectionType(InspectionType);
				if (result==null) {
					throw "There must be an initial inspection of status 'Final' for the inspection type " + InspectionType ;
				}else if (result!=""){
					throw result + " is not in status of 'Final'" ;
				}		
			}
		}
	}catch(e){
		cancel = true;
		showDebug = false;
		showMessage = true;
		comment(e);
	}
}

function checkInspectionsAndPreventLicenseIssuance(workFlowTask, workflowStatusArray) {

	if (wfTask == workFlowTask) {

		var statusMatch = false;

		for (s in workflowStatusArray) {
			if (wfStatus == workflowStatusArray[s]) {
				statusMatch = true;
				break;
			}
		}//for all status options

		if (!statusMatch) {
			return false;
		}

		if (!allInspectionsCompleted(capId)) {
			cancel = true;
			showMessage = true;
			comment("All Inspections not done so can not Issue License");
			return true;
		}
		return false;
	} else {
		return false;
	}
}

/**
 * check if any inspection was finished with result 'Complete', it sends email to owner and applicant and updates an ASI field
 * @param emailTemplateName
 * @param reportName
 * @param rptParams
 * @param asiFieldName
 * @returns {Boolean}
 */
function checkInspectionsResultAndSendEmail(emailTemplateName, reportName, rptParams, asiFieldName) {
	var anyPassedInsp = checkAnyInspectionPassed(capId);
	if (anyPassedInsp) {

		//Update ASI
		var newDate = dateAdd(new Date(), 1095);//1095 = 3 years
		editAppSpecific(asiFieldName, newDate);

		//Send the email
		var ownerEmail = null, applicantEmail = null;
		var owners = aa.owner.getOwnerByCapId(capId);
		if (owners.getSuccess()) {
			owners = owners.getOutput();
			if (owners == null || owners.length == 0) {
				logDebug("**WARN no owners on record " + capId);
				return false;
			}//len=0

			ownerEmail = owners[0].getEmail();
		} else {
			logDebug("**Failed to get owners on record " + capId + " Error: " + owners.getErrorMessage());
			return false;
		}
		var recordApplicant = getContactByType("Applicant", capId);
		if (recordApplicant) {
			applicantEmail = recordApplicant.getEmail();
		}

		if (ownerEmail == null || ownerEmail == "") {
			logDebug("**WARN Owner on record " + capId + " has no email");
			return false
		}

		var emailParams = aa.util.newHashtable();
		addParameter(emailParams, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(emailParams, "$$recordAlias$$", cap.getCapModel().getCapType().getAlias());
		addParameter(emailParams, "$$recordStatus$$", cap.getCapModel().getCapStatus());
		addParameter(emailParams, "$$balance$$", feeBalance(""));

		addParameter(emailParams, "$$inspID$$", inspId);
		addParameter(emailParams, "$$inspResult$$", inspResult);
		addParameter(emailParams, "$$inspComment$$", inspComment);
		addParameter(emailParams, "$$inspResultDate$$", inspResultDate);
		addParameter(emailParams, "$$inspGroup$$", inspGroup);
		addParameter(emailParams, "$$inspType$$", inspType);
		if (inspSchedDate) {
			addParameter(emailParams, "$$inspSchedDate$$", inspSchedDate);
		} else {
			addParameter(emailParams, "$$inspSchedDate$$", "N/A");
		}

		sendEmailWithReport(ownerEmail, applicantEmail, emailTemplateName, reportName, rptParams, emailParams);

	}//anyPassedInsp
	return true;
}

/**
 * check if any inspection was finished with result 'Complete', it sends email to owner and applicant and updates an ASI field
 * @param emailTemplateName
 * @param reportName
 * @param rptParams
 * @param asiFieldName
 * @returns {Boolean}
 * 07/26/2018 (evontrapp) - added developer and project owner emails to CC list
 */
function checkInspectionsResultAndSendEmail4PPBMP(emailTemplateName, asiFieldName) {
    logDebug("checkInspectionsResultAndSendEmail() started");



    //Update ASI
    var newDate = dateAddMonths(null, 36);//36 months = 3 years
    editAppSpecific(asiFieldName, newDate);

    //Send the email  -- owners don't have emails all the time so making applicant the Toemail and adding owner email to cc email
    var ownerEmail = null, applicantEmail = null, developerEmail = null, projectOwnerEmail = null;
    var owners = aa.owner.getOwnerByCapId(capId);
    if (owners.getSuccess()) {
        owners = owners.getOutput();
        if (owners == null || owners.length == 0) {
            logDebug("**WARN no owners on record " + capId);
            return false;
        }//len=0

        ownerEmail = owners[0].getEmail();
    } else {
        logDebug("**Failed to get owners on record " + capId + " Error: " + owners.getErrorMessage());
        return false;
    }
	
	//find applicant email
    var recordApplicant = getContactByType("Applicant", capId);
    if (recordApplicant) {
        applicantEmail = recordApplicant.getEmail();
		logDebug("Applicant Email " + applicantEmail);
    }

	
	//find developer email
	var recordDeveloper = getContactByType("Developer", capId);
    if (recordDeveloper) {
        developerEmail = recordDeveloper.getEmail();
		logDebug("Developer Email " + developerEmail);
    }
	
	//find project owner email
	var recordProjectOwner = getContactByType("Project Owner", capId);
    if (recordProjectOwner) {
        projectOwnerEmail = recordProjectOwner.getEmail();
		logDebug("Project Owner Email " + projectOwnerEmail);
    }

    /*if (ownerEmail == null || ownerEmail == "") {
        logDebug("**WARN Owner on record " + capId + " has no email");
        return false
    }*/

	//build CC email list
	var ccEmail = "";
	// sending email to applicant as the owner doesn't have email
	if (ownerEmail != null && ownerEmail != "") {
		ccEmail = ownerEmail;
	}
	//
	if (developerEmail != null && developerEmail != "") {
		if (ccEmail != "") {
			ccEmail += ";" +developerEmail;
		} else {
			ccEmail = developerEmail;
		}
	}
	
	if (projectOwnerEmail != null && projectOwnerEmail != "") {
		if (ccEmail != "") {
			ccEmail += ";" +projectOwnerEmail;
		} else {
			ccEmail = projectOwnerEmail;
		}
	}
	
    // do not need this, applicant name is being used --var ownerName = getOnwertName();  //this is not a spelling mistake
    
    //var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
    var reportFile = [];
    var reportTemplate = "JD_TEST_SSRS";
    var vRParams = aa.util.newHashtable();
    addParameter(vRParams, "Record_ID", capIDString);
    //var vAsyncScript = "SEND_INSPECTION_REPORT_TO_OWNER_ASYNC";
    var vAsyncScript = "SEND_EMAIL_TO_CONTACTS_ASYNC_WITH_CC";

    var acaURL = lookup("ACA_CONFIGS", "ACA_SITE");
    acaURL = acaURL.substr(0, acaURL.toUpperCase().indexOf("/ADMIN"));
    
    var emailParams = aa.util.newHashtable();
    addParameter(emailParams, "$$ContactEmail$$", applicantEmail);
    addParameter(emailParams, "$$reportName$$", reportTemplate);
    addParameter(emailParams, "$$applicantFirstName$$", recordApplicant.getFirstName());
	addParameter(emailParams, "$$applicantLastName$$", recordApplicant.getLastName());
    //addParameter(emailParams, "$$acaDocDownloadUrl$$", acaURL);
    
    var envParameters = aa.util.newHashMap();
    envParameters.put("emailParameters", emailParams);
    envParameters.put("CapId", capId);
    envParameters.put("emailTemplate", emailTemplateName);
    envParameters.put("reportTemplate", reportTemplate);
    envParameters.put("vRParams", vRParams);
    envParameters.put("toEmail", applicantEmail);
    envParameters.put("ccEmail", ccEmail);
    logDebug("Attempting to run Async: " + vAsyncScript);
    aa.runAsyncScript(vAsyncScript, envParameters);
            
    var sendResult = sendNotification("noreply@aurora.gov",applicantEmail,ccEmail,emailTemplateName,emailParams,reportFile,capId);
    if (!sendResult) { logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }

    return true;
}
function checkInspectionType(insp2Check){
    var inspResultObj = aa.inspection.getInspections(capId);
    var finalLocation
    var resultInspType="";
    var isMatch=false;
    var status2check = "Final";
    if (inspResultObj.getSuccess())
        {
        
        var insp2CheckArray=insp2Check.split(" ");
        var insp2checkLength=insp2CheckArray.length;
        for (i in insp2CheckArray){
            if (insp2CheckArray[i]=="Final"){
                finalLocation=i;
            }
        }
        
        inspList = inspResultObj.getOutput();
        for (xx in inspList){
            var inspType=inspList[xx].getInspectionType();
            var inspTypeArray=inspType.split(" ");
            
            var inspTypeLength=inspTypeArray.length;    
            if (insp2Check!=inspList[xx].getInspectionType() && inspTypeLength==insp2checkLength){
                var newInspType=inspType.replace(inspTypeArray[finalLocation],"Final");
                if (newInspType==insp2Check){
                    isMatch=true;
                    if (!inspList[xx].getInspectionStatus().equals(status2check)){
                        resultInspType=inspList[xx].getInspectionType();
                        if(checkInspectionResult(resultInspType, status2check)){
							resultInspType = "";
                            break;
                        }
                    }
                }
            }
            
            
            }
            
        }
        // no inspection exist of the same type but not final
        if (!isMatch) return null;
        
        return resultInspType;
}


function checkInspResultsAndUpdateWF(inpectionType, inspResultArr, updateTaskName, updateStatusName, activateTaskName) {
	if (inspType == inpectionType) {
		var statusMatch = false;
		for (s in inspResultArr) {
			var inspectionResult = inspResultArr[s];
			if (inspResult == inspectionResult) {
				statusMatch = true;
				break;
			}
		}
		if (statusMatch) {
			closeTask(updateTaskName, updateStatusName, "", ""); 
			activateTask(activateTaskName);
		}
	}
}
/**
 * check and throw an exception if balance = 0
 */
function checkInvoiced() {
	var TASK_NAME = "Completeness Check";
	var TASK_STATUS = "Ready to Pay";

	if (wfTask == TASK_NAME && wfStatus == TASK_STATUS) {
		var myBalance = feeBalance("");// no fee sched passed, method will get all
		if (myBalance == 0) {
			cancel = true;
			showMessage = true;
			comment("Please apply fees and invoice to update status.");
		}
	}
}


/**
 * Check Check if workflow status and workflow task matches arguments, then updates: a task, appStatus, and send email to Applicant
 * @param recordCapId
 * @param workFlowTask
 * @param workflowStatusArray
 * @param emailTemplate
 * @param updateWfTaskName
 * @param updateTaskToStatus
 * @param newAppStatus
 * @returns {Boolean} true if task name and status matches, false if error
 */
function checkNoFeeAndUpdateTask(recordCapId, workFlowTask, workflowStatusArray, emailTemplate, updateWfTaskName, updateTaskToStatus, newAppStatus) {
	if (wfTask == workFlowTask) {

		var statusMatch = false;

		for (s in workflowStatusArray) {
			if (wfStatus == workflowStatusArray[s]) {
				statusMatch = true;
				break;
			}
		}//for all status options

		if (!statusMatch) {
			return false;
		}

		//closeTask() will not promote (activate) next task
		branchTask(updateWfTaskName, updateTaskToStatus, "by script No-Fees", "by script No-Fees");

		//update app status
		updateAppStatus(newAppStatus, "by script No-Fees");

		//send email
		var applicant = getContactByType("Applicant", recordCapId);
		if (!applicant || !applicant.getEmail()) {
			logDebug("**WARN no applicant found on or no email capId=" + recordCapId);
			return false;
		}
		var toEmail = applicant.getEmail();
		var files = new Array();

		var eParams = aa.util.newHashtable();
		addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
		addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
		addParameter(eParams, "$$balance$$", feeBalance(""));
		addParameter(eParams, "$$wfTask$$", wfTask);
		addParameter(eParams, "$$wfStatus$$", wfStatus);
		addParameter(eParams, "$$wfDate$$", wfDate);
		addParameter(eParams, "$$wfComment$$", wfComment);
		addParameter(eParams, "$$wfStaffUserID$$", wfStaffUserID);
		addParameter(eParams, "$$wfHours$$", wfHours);

		var sent = aa.document.sendEmailByTemplateName("", toEmail, "", emailTemplate, eParams, files);
		if (!sent.getSuccess()) {
			logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
			return false;
		}
		return true;
	} else {
		return false;
	}
}
function checkParcelOnCap(){
			return  !isBlankOrNull(ParcelArea) || !isBlankOrNull(ParcelBook)
		||  !isBlankOrNull(ParcelExcemptValue) || !isBlankOrNull(ParcelImprovedValue) || !isBlankOrNull(ParcelLandValue)
    || !isBlankOrNull(ParcelLegalDescription) || !isBlankOrNull(ParcelLot) || !isBlankOrNull(ParcelPage) || !isBlankOrNull(ParcelParcel) ||
    !isBlankOrNull(ParcelValidatedNumber) || !isBlankOrNull(ParcelTract)
}

/**
 * Check insp type and result, when matched, check if prev required result exists
 * 
 * @param inspectionType type to match with current
 * @param reqInspResults {Array} result to match with current
 * @param preReqInspResult {Array} pre-required resuls for each reqInspResults (index must be same in each array, arrays should be same length)
 * @returns {Boolean} true if current result can be selected (has the pre-required or not within reqInspResults), false otherwise
 */
function checkPrevInspResultAndPreventSubmit(inspectionType, reqInspResults, preReqInspResult) {

	if (reqInspResults == null || preReqInspResult == null || reqInspResults.length != preReqInspResult.length) {
		cancel = true;
		showMessage = true;
		comment("checkPrevInspResultAndPreventSubmit: invalid method parameters");
		return false;
	}

	var prevResultExist = false;
	var inspections = null;
	var resultMatched = false;

	if (inspectionType == inspType) {
		for (s in reqInspResults) {
			if (inspResult == reqInspResults[s]) {
				resultMatched = true;
				//Load it once
				if (inspections == null) {
					inspections = aa.inspection.getInspections(capId);
					if (inspections.getSuccess()) {
						inspections = inspections.getOutput();
						if (inspections == null || inspections.length == 0) {
							logDebug("**INFO record inspections empty or null");
							prevResultExist = false;
							break;
						}
					} else {
						logDebug("**ERROR getInspections failed, " + inspections.getErrorMessage());
						prevResultExist = false;
						break;
					}
				}//not loaded before

				//find if older inspections has result of preReqInspResult[s]
				for (i in inspections) {
					var thisInsp = inspections[i];
					if (thisInsp.getInspectionType() == inspectionType && thisInsp.getInspectionStatus() == preReqInspResult[s]) {
						prevResultExist = true;
						break;
					}//type match
				}//for all inspections

				if (prevResultExist) {
					break;
				}
			}//inspResult matched
		}//for all insp results
	} else {
		return false;
	}

	if (!resultMatched) {
		//current result is not reqResult to check
		return true;
	}

	if (!prevResultExist) {
		cancel = true;
		showMessage = true;
		comment("Notices must be selected in ascending order to proceed.");
	}
	return prevResultExist;
}
/**
 * this function will check the current work flow task if the task  Assign Complaint or Assign Inspection
 * and the status is Complete will check the record assigned user if null will stop the update of the task.
 */
function checkRecordAssignedUser() {
	var checkTask = "Assign Complaint";
	var checkTask2 = "Assign Inspection";
	var checkStatus = "Complete";
	if ((wfTask == checkTask || wfTask == checkTask2) && wfStatus == checkStatus) {
		var capAssignedUser = aa.cap.getCapDetail(capId).getOutput().getCapDetailModel().getAsgnStaff();
		if (capAssignedUser == "" || capAssignedUser == null) {
			showMessage = true;
			cancel = true;
			comment("Fire Case requires Assigned user in Record detail");
		}
	}
}

/* 
 * Check if all required letters for building have been received
 * @returns {Boolean} true if all required letters have been received
 */
function checkReqLettersReceived(){
	var drainLtrReq = AInfo["Drain Letter Required"] == "CHECKED",
		footgLtrReq = AInfo["Footing - Pier - Cassion Letter Required"] == "CHECKED",
		foundLtrReq = AInfo["Foundation Letter Required"] == "CHECKED",
		ilcLtrReq   = AInfo["ILC Letter Required"] == "CHECKED",
		waterLtrReq = AInfo["Waterproofing Letter Required"] == "CHECKED",
		drainLtrRec = AInfo["Drain Letter Received"] == "CHECKED",
		footgLtrRec = AInfo["Footing - Pier - Cassion Letter Received"] == "CHECKED",
		foundLtrRec = AInfo["Foundation Letter Received"] == "CHECKED",
		ilcLtrRec   = AInfo["ILC Letter Received"] == "CHECKED",
		waterLtrRec = AInfo["Waterproofing Letter Received"] == "CHECKED";
		
	if(drainLtrReq && !drainLtrRec) return false;
	if(footgLtrReq && !footgLtrRec) return false;
	if(foundLtrReq && !foundLtrRec) return false;
	if(ilcLtrReq   && !ilcLtrRec)   return false;
	if(waterLtrReq && !waterLtrRec) return false;
		
	return true;	
}

function checkScheduledInspSameDate(beingScheduledType, beingScheduledDate) {
	var inspections = aa.inspection.getInspections(capId);
	if (inspections.getSuccess()) {
		inspections = inspections.getOutput();
		for (i in inspections) {
			var thisInspection = inspections[i];
			if (String(beingScheduledType).equals(thisInspection.getInspectionType()) && thisInspection.getInspectionStatus().equals("Scheduled")) {
				var paramDate = aa.date.parseDate(beingScheduledDate);
				var insDate = thisInspection.getScheduledDate();
				if (paramDate.getYear() == insDate.getYear() && paramDate.getMonth() == insDate.getMonth() && paramDate.getDayOfMonth() == insDate.getDayOfMonth()) {
					cancel = true;
					showMessage = true;
					comment("Inspection with this skill set already scheduled");
					return true;
				}//same date
			}//same type
		}//for all inspections
	}//success
	return false;
}
function checkSpecialInspections() {
	logDebug("checkSpecialInspections() started");
    try {
		  var specialInspections = getASIgroup("SPECIAL INSPECTIONS", capId);
            if (specialInspections != null) {
                var missingData = "";
                for (xx in specialInspections) {

                    //check if ___Required field and filled
                    var asiFieldName = specialInspections[xx].getCheckboxDesc();
                    if (new java.lang.String(asiFieldName).endsWith("Required") && typeof (specialInspections[xx].getChecklistComment()) != "undefined"
                            && !isBlankOrNull(specialInspections[xx].getChecklistComment())) {

                        asiFieldName = asiFieldName.trim();

                        //validate it's __Received field
                        var asiFieldReceived = asiFieldName.substring(0, asiFieldName.lastIndexOf(" ")) + " Received";
                        if (!validateField(asiFieldReceived, specialInspections)) {
                            missingData += asiFieldName + ", ";
                        }

                    }//need validation
                }//for all ASIs

                if (!isBlankOrNull(missingData)) {//remove last ,
                    missingData = missingData.substring(0, missingData.length - 2);
                    //throw ("The following data is required : " + missingData);
                     showMessage = true;
                   cancel = true;
                   comment("The following Inspection(s) have not been received and are required : " + missingData);
                }
            }//specialInspections
        
    } catch (e) {
        cancel = true;
        showMessage = true;
        comment(e);
    }
	logDebug("checkSpecialInspections() ended");
}//END checkSpecialInspections()
function checkTrigger(tasksArray,statusesArray){
	 var isTask=false;
	 var isStatus=false;
	 
	 for (t in tasksArray){
		 if (wfTask==tasksArray[t]){
			 isTask=true;
			 break;
		 }
	 }
	 
	 for (s in statusesArray){
		 if (wfStatus==statusesArray[s]){
			 isStatus=true;
			 break;
		 }
	 }
	 return isTask && isStatus;
}
function checkWfAndParentBlockSubmit(workFlowTask, workflowStatusArray, parentType, parentStatus) {
	if (wfTask == workFlowTask) {
		var statusMatch = false;
		for (s in workflowStatusArray) {
			if (wfStatus == workflowStatusArray[s]) {
				statusMatch = true;
				break;
			}
		}//for all status options

		if (!statusMatch) {
			return false;
		}

		//get parent of type parentType
		var parentsAry = getParents(parentType);
		if (parentsAry == null || parentsAry.length == 0) {
			return false;
		}

		//check parent status
		for (p in parentsAry) {
			var tmpCap = aa.cap.getCap(parentsAry[p]).getOutput();
			if (tmpCap.getCapStatus() == parentStatus) {
				cancel = true;
				showMessage = true;
				comment("Master is previous code year, cannot issue permit");
				return true;
			}//parent with matched status found
		}//for all paretns
	}//wfTask matched
	return false;
}
/**
 * check if the provided status in the provided array
 * @param workflowStatus status to be checked
 * @param statusesArray array to be checked
 * @returns {Boolean} true if exists else will return false
 */
function checkWFStatus(workflowStatus, statusesArray) {

	for ( var i in statusesArray) {
		if (statusesArray[i] == workflowStatus)
			return true;
	}
	return false;
}


/**
 * check if wfTaskToCheck status equals statusToCheck, method will activate wfTaskToActivate
 * @param wfTaskToCheck task name to check status
 * @param statusToCheck status value to check if match match
 * @param wfTaskToActivate task name to activate
 * @returns {Boolean} true if criteria matched, and task activated, false otherwise
 */
function checkWfTaskToActivateAnother(wfTaskToCheck, statusToCheck, wfTaskToActivate) {
	if (isTaskStatus(wfTaskToCheck, statusToCheck)) {
		activateTask(wfTaskToActivate);
		return true;
	}
	return false;
}
function checkWorkflowDeactivateTaskAndSendEmail(workFlowTask, workflowStatusArray, wfTaskDeactivate, emailTemplateName) {

	if (wfTask == workFlowTask) {

		var statusMatch = false;

		for (s in workflowStatusArray) {
			if (wfStatus == workflowStatusArray[s]) {
				statusMatch = true;
				break;
			}
		}//for all status options

		if (!statusMatch) {
			return false;
		}

		deactivateTask(wfTaskDeactivate);

		var applicant = getContactByType("Applicant", capId);
		if (!applicant || !applicant.getEmail()) {
			logDebug("**WARN no applicant found on or no email capId=" + capId);
			return false;
		}
		var toEmail = applicant.getEmail();
		var firstName = applicant.getFirstName();   
		var middleName =applicant.getMiddleName();   
		var lastName = applicant.getLastName(); 
		var fullName = buildFullName(firstName, middleName,lastName);
		
		
		//var iNameResult = aa.person.getUser(currentUserID);
		var iNameResult = aa.person.getUser(wfStaffUserID);
		var iName = iNameResult.getOutput();
		var userEmail=iName.getEmail();
		var userName = iName.getFullName();
	    var userPhone = iName.getPhoneNumber();
	    var userTitle = iName.getTitle(); 
	   
	   //prepare Deep URL:
		var acaSiteUrl = lookup("ACA_CONFIGS", "ACA_SITE");
		var subStrIndex = acaSiteUrl.toUpperCase().indexOf("/ADMIN");
		var acaCitizenRootUrl = acaSiteUrl.substring(0, subStrIndex);
		var deepUrl = "/urlrouting.ashx?type=1000";
		deepUrl = deepUrl + "&Module=" + cap.getCapModel().getModuleName();
		deepUrl = deepUrl + "&capID1=" + capId.getID1();
		deepUrl = deepUrl + "&capID2=" + capId.getID2();
		deepUrl = deepUrl + "&capID3=" + capId.getID3();
		deepUrl = deepUrl + "&agencyCode=" + aa.getServiceProviderCode();
		deepUrl = deepUrl + "&HideHeader=true";

		var recordDeepUrl = acaCitizenRootUrl + deepUrl;
        var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
		var eParams = aa.util.newHashtable();
		addParameter(eParams, "$$recordDeepUrl$$", recordDeepUrl);
		addParameter(eParams, "$$ContactFullName$$",fullName); 
		addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
		addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
		addParameter(eParams, "$$StaffFullName$$", userName);
		addParameter(eParams, "$$StaffEmail$$", userEmail);
		addParameter(eParams, "$$StaffTitle$$", userTitle);
		addParameter(eParams, "$$StaffPhone$$", userPhone);
		addParameter(eParams, "$$wfComment$$", wfComment);
        var reportFile = [];
		var sendResult = sendNotification("noreply@aurora.gov",toEmail,"",emailTemplateName,eParams,reportFile,capID4Email);
		if (!sendResult) 
			{ logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
	}
	else
		{ logDebug("Sent Notification");
			return false;
		}

	/*	var sent = aa.document.sendEmailByTemplateName("", toEmail, "", emailTemplateName, eParams, null);
		if (!sent.getSuccess()) {
			logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
			return false;
		}
	} else {
		return false;
	}
	*/
	return true;
}

function checkWorkFlowStatusAndSendEmail(workflowTask, workflowStatus, emailTemplateName, reportName, rptParams) {
	var applicantEmail = null;
	var recordApplicant = getContactByType("Applicant", capId);
	if (recordApplicant) {
		applicantEmail = recordApplicant.getEmail();
	}
	if (applicantEmail == null) {
		logDebug("**WARN Applicant on record " + capId + " has no email");
		return false
	}
	if (wfTask == workflowTask && wfStatus == workflowStatus) {

		var emailParams = aa.util.newHashtable();
		addParameter(emailParams, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(emailParams, "$$recordAlias$$", cap.getCapModel().getCapType().getAlias());
		addParameter(emailParams, "$$recordStatus$$", cap.getCapModel().getCapStatus());
		addParameter(emailParams, "$$wfComment$$", wfComment);
		addParameter(emailParams, "$$wfTask$$", wfTask);
		addParameter(emailParams, "$$wfStatus$$", wfStatus);
		sendEmailWithReport(applicantEmail, "", emailTemplateName, reportName, rptParams, emailParams);

	}
	return true;
}


/**
 * 
 * @param ParentParallelTask task name that will open the parallel tasks
 * @param workFlowParentTaskStatus task status that will open the parallel tasks
 * @param workflowParallelTasks Parallel Tasks That need to be checked
 * @param taskToBeUpdated  the task to be updated when the validation of the parallel tasks completed 
 * @param taskStatus the status that need to update on the task
 * @param statusToBeChecked status to be checked on the parallel tasks
 * @param emailTemplate the email template that need to send to the applicant
 */
function checkWorkFlowTaskAndSendEmail(ParentParallelTask, workFlowParentTaskStatus, workflowParallelTasks, taskToBeUpdated, taskStatus, statusToBeChecked, emailTemplate) {
	var isLastParallelTask = true;
	var parentTask = aa.workflow.getTask(capId, ParentParallelTask).getOutput();
	if (ifTracer(parentTask != null, 'parentTask != null')) {
		for ( var t in workflowParallelTasks) {
			if (ifTracer(isTaskActive(workflowParallelTasks[t]) || parentTask.getDisposition() != workFlowParentTaskStatus, 'isTaskActive(workflowParallelTasks[t]) || parentTask.getDisposition() != workFlowParentTaskStatus')) {
				isLastParallelTask = false;
				break;
			}

		}
	}
	if (ifTracer(isLastParallelTask, 'isLastParallelTask')) {
		for (t in workflowParallelTasks) {
			var task = aa.workflow.getTask(capId, workflowParallelTasks[t]).getOutput();
			if (ifTracer(task.getDisposition() != statusToBeChecked, 'task.getDisposition() != statusToBeChecked')) {
				UpdateTaskAndSendNotification(emailTemplate, taskToBeUpdated, taskStatus);
				deactivateTask("Completeness Check #2");
				return;
			}
		}
		deactivateTask("Completeness Check");
	}
}

function civPlnsScript10_addReviewerContact(){
    logDebug("civPlnsScript10_addReviewerContact() started");
    try{
        var stdChoice = "AGENCY REVIEWER";
        var outsideReviews = getASIgroup("OUTSIDE AGENCY REVIEWS", capId);
        
        if(outsideReviews == null || outsideReviews == undefined) return;
        
        for(eachRev in outsideReviews){
            var reviewObj = outsideReviews[eachRev];
            var review = reviewObj.getCheckboxDesc();
            var reviewValue = reviewObj.getChecklistComment();
            
            if(reviewValue == "CHECKED"){
                var contact = lookup(stdChoice, review);
                if(contactByBusNameExistsOnCap(contact, capId, "Outside Agency")){ 
                    logDebug("Contact " + contact + " already exists as 'Outside Agency' contact type.  Skipping");
                    continue;
                }
                
                logDebug("Trying to add contact " + contact);
                var contactAdded = addReferenceContactByBusinessName(contact, capId);
                if(!contactAdded) { logDebug("Unable to add contact."); return false; }
                logDebug("Contact added " + contactAdded);
                
                var peopResult = aa.people.getCapContactByContactID(contactAdded);
                if (peopResult.getSuccess()) {
                    var peop = peopResult.getOutput();
                    var capConObj = peop[0];
                    var capConEml = capConObj.getEmail();
                    
                    if(capConEml){
                        var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
                        var reportFile = [];
                        var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
                        acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
                        var recordURL = getACARecordURL(acaURLDefault);
                        var eParams = aa.util.newHashtable();
                        addParameter(eParams, "$$altID$$", capIDString);
                        addParameter(eParams, "$$fileDate$$", fileDate);
                        addParameter(eParams, "$$acaRecordUrl$$", recordURL);
                        addParameter(eParams, "$$ApplicationName$$", cap.getSpecialText());
                        addParameter(eParams, "$$workDesc$$", workDescGet(capId));
                        addParameter(eParams, "$$ReviewDueDate$$", dateAdd(getTaskDueDate("Engineering Review"), -2, true));
                        
                        var sendResult = sendNotification("noreply@aurora.gov",capConEml,"","PW OUTSIDE REVIEWER EMAIL #10",eParams,reportFile,capID4Email);
                        if (!sendResult) { logDebug("civPlnsScript10_addReviewerContact: UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
                        else { logDebug("civPlnsScript10_addReviewerContact: Sent email to outside reviewer "+capConEml)}
                    }
                }
                else {
                    logDebug("WARNING: Unable to get cap contact to send email. Message: " + peopResult.getErrorMessage());
                }
            }
        }
    }
    catch(err){
        showMessage = true;
        errorMessage = "Error on civPlnsScript10_addReviewerContact(). Err: " + err + ". Line Number: " + err.lineNumber + ". stack: " + err.stack;
        comment(errorMessage);
        logDebug(errorMessage);
    }
    logDebug("civPlnsScript10_addReviewerContact() ended");
}//END civPlnsScript10_addReviewerContact()
function clearBizDomainCache(){
    logDebug("clearBizDomainCache() started");
    var bizdbResult = aa.proxyInvoker.newInstance("com.accela.aa.aamain.systemConfig.BizDomainBusiness");
    if(bizdbResult.getSuccess()){
        var bizdb = bizdbResult.getOutput();
        bizdb.clearBizdomainCache();
    }
    else logDebug("ERROR Clearing Cache: " + bizdbResult.getErrorMessage());
    logDebug("clearBizDomainCache() ended");
}

function closeAllTasks(capId, wfComment) {
    var wfstat = "NA",
        task,
        dispositionDate,
        stepnumber;

        var tasks = aa.workflow.getTaskItems(capId, null, null,"N", null, "Y").getOutput();
    
    for (i in tasks) {
        task = tasks[i];
        dispositionDate = aa.date.getCurrentDate();
        stepnumber = task.getStepNumber();

        aa.workflow.handleDisposition(capId, stepnumber, wfstat, dispositionDate, '', wfComment, systemUserObj, "Y");

        logMessage("Closing Workflow Task: " + task.getTaskDescription() + " with status " + wfstat);
        logDebug("Closing Workflow Task: " + task.getTaskDescription() + " with status " + wfstat);
    }

}
/*
 * Helper
 * 
 * Desc:            
 * Close Task by capId.  
 * 
 */
function closeTaskByCapId(wfstr,wfstat,wfcomment,wfnote, itemCap) // optional process name
    {
    var useProcess = false;
    var processName = "";
    if (arguments.length == 6) 
        {
        processName = arguments[5]; // subprocess
        useProcess = true;
        }

    var workflowResult = aa.workflow.getTaskItems(itemCap, wfstr, processName, null, null, null);
    if (workflowResult.getSuccess())
        var wfObj = workflowResult.getOutput();
    else
        { logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage()); return false; }
    
    if (!wfstat) wfstat = "NA";
    
    for (i in wfObj)
        {
        var fTask = wfObj[i];
        if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase())  && (!useProcess || fTask.getProcessCode().equals(processName)))
            {
            var dispositionDate = aa.date.getCurrentDate();
            var stepnumber = fTask.getStepNumber();
            var processID = fTask.getProcessID();

            if (useProcess)
                aa.workflow.handleDisposition(itemCap,stepnumber,processID,wfstat,dispositionDate, wfnote,wfcomment,systemUserObj ,"Y");
            else
                aa.workflow.handleDisposition(itemCap,stepnumber,wfstat,dispositionDate, wfnote,wfcomment,systemUserObj ,"Y");
            
            logMessage("Closing Workflow Task : " + wfstr + " with status " + wfstat + " for record number " + itemCap.getCustomID());
            logDebug("Closing Workflow Task: " + wfstr + " with status " + wfstat + " for record number " + itemCap.getCustomID());
            }           
        }
    }
/*
Title : Forestry Record Application Submission Actions (ApplicationSubmitAfter,ConvertToRealCapAfter)

Purpose : Actions that need to occur upon submission of a Forestry record of any kind. - Script 60 - User Story 2

Author: Ali Othman
 
Functional Area : Parcel, Inspections, Custom Fields, Address, Records

Sample Call:
   closeTreeRequestIntakeTask("Source of Request", "Tree Request Intake", ["Assigned"], "Proactive", "Inspection Phase");
   
Notes:
	
*/
function closeTreePlantingIntakeTask(workflowTask, workflowStatusArray, workflowComment, activateTaskName) {
    if (workflowStatusArray != null && workflowStatusArray.length > 0) {
        var workflowStatus;
        workflowStatus = workflowStatusArray[0];
        closeTask(workflowTask, workflowStatus, workflowComment, "");
        activateTask(activateTaskName);
    }
}
/*
Title : Forestry Record Application Submission Actions (ApplicationSubmitAfter,ConvertToRealCapAfter)

Purpose : Actions that need to occur upon submission of a Forestry record of any kind. - Script 60 - User Story 5

Author: Ali Othman
 
Functional Area : Parcel, Inspections, Custom Fields, Address, Records

Sample Call:
   closeTreeRequestIntakeTask("Source of Request", "Tree Request Intake", ["Assigned"], "Proactive", "Inspection Phase");
   
Notes:
	
*/
function closeTreeRequestIntakeTask(customFieldName, workflowTask, workflowStatusArray, workflowComment, activateTaskName) {
    var sourceOfRequest = getAppSpecific(customFieldName, capId);
    if (typeof (sourceOfRequest) != "undefined" && sourceOfRequest != null && sourceOfRequest != "") {
        if (sourceOfRequest.toLowerCase() == "staff") {
            if (workflowStatusArray != null && workflowStatusArray.length > 0) {
                var workflowStatus;
                workflowStatus = workflowStatusArray[0];
                closeTask(workflowTask, workflowStatus, workflowComment, "");
                activateTask(activateTaskName);
            }
        }
    }
}
function closeWfTaskCertificateOfOccupancy(){
    logDebug("closeWfTaskCertificateOfOccupancy() started");
    try{
        var $iTrc = ifTracer;
        var caps= capIdsGetByAddr();
        
        if($iTrc(caps, 'caps')){
            for(each in caps){
                var vCapID = caps[each]
                var vCap = aa.cap.getCap(vCapID).getOutput();
                var vAppTypeString = vCap.getCapType().toString();
                
                if($iTrc(vAppTypeString.startsWith("Licenses/Marijuana/") && vAppTypeString.endsWith("/Application"), 'Licenses/Marijuana/*/Application')){
                    closeTaskByCapId("Certificate of Occupancy","Complete", "Closed by script closeWfTaskCertificateOfOccupancy()", "Closed by script closeWfTaskCertificateOfOccupancy()", vCapID);
                }
            }
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function closeWfTaskCertificateOfOccupancy(). Err: " + err);
    }
    logDebug("closeWfTaskCertificateOfOccupancy() ended");
}

//Emails the license professionals of a certain type in a record
//written by jmain and using the async email functions provided by Emmett.

/*
lptypes = comma separated string of LP types (e.g. "Contractor,Architect,Barber")
emailtemplate = exact string of the email template we're using
emailparams = a hash table of necessary email params - remember, the Emmett email
			  function has a bunch of "built-ins" which do not need to be specifically included.
			  use "" if there are no email params.
report = the exact string of the report name.  use "" if there is no report to include a link to.
reportparams = a hash table of the necessary report parameters.  use "" if irrelevant.
capId = the capId of the current record
*/

function coa_emailLicenseProfessionals(lptypes,emailtemplate,emailparams,report,reportparams,capId)
{
	logDebug("Entering coa_emailLicenseProfessionals");
	
	//split and trim the lptypes
	var lptypesarray = lptypes.split(",").map(function(item) {return item.trim();});
	
	//get array of all LPs in the record
	var lparray = getLicenseProfessional(capId);
	
	//send an email to all the LPs requested
	for (var i in lparray)
	{
		lp = lparray[i];
		lpemail = lp.getEmail() + ""; //force string
		lptype = lp.licenseType + ""; //force string
		logDebug(lptype + " : " + lpemail);
		
		//if the lptype is in the lptypesarray, send an email...
		if (lptypesarray.indexOf(lptype) != -1)
		{
			logDebug("Sending email to " + lpemail);
			//aa.env.setValue("eventType","Batch Process");
			emailWithReportLinkASync(lpemail, emailtemplate, emailparams, report, reportparams, "N", "");
		}
	}
	return;
}
	
function contactByBusNameExistsOnCap(busName, itemCapId){
	// optional typeToCheck
    var typeToCheck = false;
    if (arguments.length == 3) {
		typeToCheck = arguments[2];
	}
	var capContactArray = null;
	
	var capContactResult = aa.people.getCapContactByCapID(itemCapId);
    if (capContactResult.getSuccess()) {
        capContactArray = capContactResult.getOutput();
    }
	
	if(!capContactArray) return false;
	
	for(each in capContactArray) {
		capCon = capContactArray[each];
		var capPeople = capCon.getPeople();
		var conType = capPeople.getContactType();
		var conBusName = capPeople.getBusinessName();
		
		if((typeToCheck && busName == conBusName && typeToCheck == conType) || (!typeToCheck && busName == conBusName)) return true;
	}
	
	return false;
}//END contactByBusNameExistsOnCap();
/**
* Contact Object 
* <p>
* Properties: 
*	people - PeopleModel Object
*   capContact - CapContactModel Object
*	capContactScript - CapContactScriptModel Object
*	capId - capID Object
*	type - Contact Type
*	seqNumber - Transactional Seqence Number
*	asi - associative array of people template attributes
*	customFields - associative array of custom template fields
*	customTables - Not yet implemented
*	primary - Contact is Primary
*	relation - Contact Relation
*	addresses - associative array of address
*	validAttrs - Boolean indicating people template attributes
*	validCustomFields - Boolean indicating custom template fields
*	validCustomTables - Not implemented yet
*	infoTables - Table Array ex infoTables[name][row][column].getValue()
*	attribs - Array of LP Attributes ex attribs[name]
*	valid - Get the Attributes for LP
*	validTables - true if LP has infoTables
*	validAttrs - true if LP has attributes
* </p>
* <p>
* Methods:
*	toString() - Outputs a string of key contact fields 
*	getEmailTemplateParams(params,[vContactType]) - Contact Parameters for use in Notification Templates
*	replace(targetCapId) - send this contact to another record, optional new contact type
*	equals(contactObj) - Compares this contact to another contact by comparing key elements
*	saveBase() - Saves base information such as contact type, primary flag, relation
*	save() - Saves all current information to the transactional contact
*	syncCapContactToReference() - Synchronize the contact data from the record with the reference contact by pushing data from the record into reference.
*	syncCapContactFromReference() - Synchronize the reference contact data with the contact on the record by pulling data from reference into the record.
*	getAttribute(vAttributeName) - Get method for people template attributes
*	setAttribute(vAttributeName, vAttributeValue) - Set method for people template attributes
*	getCustomField(vFieldName) - Get method for Custom Template Fields
*	setCustomField(vFieldName,vFieldValue) - Set method for Custom Template Fields
*	remove() - Removes this contact from the transactional record
*	isSingleAddressPerType() - Boolean indicating if this contact has a Single Addresss Per Type
*	getAddressTypeCounts() - returns an associative array of how many adddresses are attached
*	createPublicUser() - For individual contact types, this function checkes to see if public user exists already based on email address then creates a public user and activates it for the agency. It also sends an Activate email and sends a Password Email. If there is a reference contact, it will assocated it with the newly created public user.
*	getCaps([record type filter]) - Returns an array of records related to the reference contact
*	getRelatedContactObjs([record type filter]) - Returns an array of contact objects related to the reference contact
*	getRelatedRefLicProfObjs() - Returns an array of Reference License Professional objects related to the reference contact
*	createRefLicProf(licNum,rlpType,addressType,licenseState, [servProvCode]) - Creates a Reference License Professional based on the contact information. If this contact is linked to a Reference Contact, it will link the new Reference License Professional to the Reference Contact.
*	linkRefContactWithRefLicProf(licnumber, [lictype]) - Link a Reference License Professional to the Reference Contact.
*	getAKA() - Returns an array of AKA Names for the assocated reference contact
*	addAKA(firstName,middleName,lastName,fullName,startDate,endDate) - Adds an AKA Name to the assocated reference contact
*	removeAKA(firstName,middleName,lastName) - Removes an AKA Name from the assocated reference contact
*	hasPublicUser() - Boolean indicating if the contact has an assocated public user account
*	linkToPublicUser(pUserId) - Links the assocated reference contact to the public user account
*	sendCreateAndLinkNotification() - Sends a Create and Link Notification using the PUBLICUSER CREATE AND LINK notification template to the contact for the scenario in AA where a paper application has been submitted
*	getRelatedRefContacts([relConsArray]) - Returns an array of related reference contacts. An optional relationship types array can be used
* </p>
* <p>
* Call Example:
* 	var vContactObj = new contactObj(vCCSM);
*	var contactRecordArray = vContactObj.getAssociatedRecords();
*	var cParams = aa.util.newHashtable();
*	vContactObj.getEmailTemplateParams(cParams);
* </p>
* @param ccsm {CapContactScriptModel}
* @return {contactObj}
*/

function contactObj(ccsm)  {
    this.people = null;         // for access to the underlying data
    this.capContact = null;     // for access to the underlying data
    this.capContactScript = null;   // for access to the underlying data
    this.capId = null;
    this.type = null;
    this.seqNumber = null;
    this.refSeqNumber = null;
    this.asiObj = null;
    this.asi = new Array();    // associative array of attributes
	this.customFieldsObj = null;
	this.customFields = new Array();
	this.customTablesObj = null;
	this.customTables = new Array();
    this.primary = null;
    this.relation = null;
    this.addresses = null;  // array of addresses
    this.validAttrs = false;
	this.validCustomFields = false;
	this.validCustomTables = false;
        
    this.capContactScript = ccsm;
    if (ccsm)  {
        if (ccsm.getCapContactModel == undefined) {  // page flow
            this.people = this.capContactScript.getPeople();
            this.refSeqNumber = this.capContactScript.getRefContactNumber();
            }
        else {
            this.capContact = ccsm.getCapContactModel();
            this.people = this.capContact.getPeople();
            this.refSeqNumber = this.capContact.getRefContactNumber();

			// contact attributes
			// Load People Template Fields
            if (this.people.getAttributes() != null) {
                this.asiObj = this.people.getAttributes().toArray();
                if (this.asiObj != null) {
                    for (var xx1 in this.asiObj) this.asi[this.asiObj[xx1].attributeName] = this.asiObj[xx1];
                    this.validAttrs = true; 
                }   
            }
			// Load Custom Template Fields
			if (this.capContact.getTemplate() != null && this.capContact.getTemplate().getTemplateForms() != null) {
				var customTemplate = this.capContact.getTemplate();
				this.customFieldsObj = customTemplate.getTemplateForms();
				if (!(this.customFieldsObj == null || this.customFieldsObj.size() == 0)) {
					for (var i = 0; i < this.customFieldsObj.size(); i++) {
						var eachForm = this.customFieldsObj.get(i);
						//Sub Group
						var subGroup = eachForm.subgroups;
						if (subGroup == null) {
							continue;
						}
						for (var j = 0; j < subGroup.size(); j++) {
							var eachSubGroup = subGroup.get(j);
							if (eachSubGroup == null || eachSubGroup.fields == null) {
								continue;
							}
							var allFields = eachSubGroup.fields;
							if (!(allFields == null || allFields.size() == 0)) {
								for (var k = 0; k < allFields.size(); k++) {
									var eachField = allFields.get(k);
									this.customFields[eachField.displayFieldName] = eachField.defaultValue;
									logDebug("(contactObj) {" + eachField.displayFieldName + "} = " +  eachField.defaultValue);
									this.validCustomFields = true;
								}
							}
						}
					}
				}
			}
        }  

		// contact ASI
		var tm = this.people.getTemplate();
		if (tm)	{
			var templateGroups = tm.getTemplateForms();
			var gArray = new Array();
			if (!(templateGroups == null || templateGroups.size() == 0)) {
				var subGroups = templateGroups.get(0).getSubgroups();
				if (!(subGroups == null || subGroups.size() == 0)) {
					for (var subGroupIndex = 0; subGroupIndex < subGroups.size(); subGroupIndex++) {
						var subGroup = subGroups.get(subGroupIndex);
						var fields = subGroup.getFields();
						if (!(fields == null || fields.size() == 0)) {
							for (var fieldIndex = 0; fieldIndex < fields.size(); fieldIndex++) {
								var field = fields.get(fieldIndex);
								this.asi[field.getDisplayFieldName()] = field.getDefaultValue();
							}
						}
					}
				}
			}
		}

        //this.primary = this.capContact.getPrimaryFlag().equals("Y");
        this.relation = this.people.relation;
        this.seqNumber = this.people.contactSeqNumber;
        this.type = this.people.getContactType();
        this.capId = this.capContactScript.getCapID();
        var contactAddressrs = aa.address.getContactAddressListByCapContact(this.capContact);
        if (contactAddressrs.getSuccess()) {
            this.addresses = contactAddressrs.getOutput();
            var contactAddressModelArr = convertContactAddressModelArr(contactAddressrs.getOutput());
            this.people.setContactAddressList(contactAddressModelArr);
            }
        else {
            pmcal = this.people.getContactAddressList();
            if (pmcal) {
                this.addresses = pmcal.toArray();
            }
        }
    }       
        this.toString = function() { return this.capId + " : " + this.type + " " + this.people.getLastName() + "," + this.people.getFirstName() + " (id:" + this.seqNumber + "/" + this.refSeqNumber + ") #ofAddr=" + this.addresses.length + " primary=" + this.primary;  }
        
        this.getEmailTemplateParams = function (params, vContactType) {
			var contactType = "";
			if (arguments.length == 2) contactType = arguments[1];
			
            addParameter(params, "$$" + contactType + "LastName$$", this.people.getLastName());
            addParameter(params, "$$" + contactType + "FirstName$$", this.people.getFirstName());
            addParameter(params, "$$" + contactType + "MiddleName$$", this.people.getMiddleName());
            addParameter(params, "$$" + contactType + "BusinesName$$", this.people.getBusinessName());
            addParameter(params, "$$" + contactType + "ContactSeqNumber$$", this.seqNumber);
            addParameter(params, "$$ContactType$$", this.type);
            addParameter(params, "$$" + contactType + "Relation$$", this.relation);
            addParameter(params, "$$" + contactType + "Phone1$$", this.people.getPhone1());
            addParameter(params, "$$" + contactType + "Phone2$$", this.people.getPhone2());
            addParameter(params, "$$" + contactType + "Email$$", this.people.getEmail());
            addParameter(params, "$$" + contactType + "AddressLine1$$", this.people.getCompactAddress().getAddressLine1());
            addParameter(params, "$$" + contactType + "AddressLine2$$", this.people.getCompactAddress().getAddressLine2());
            addParameter(params, "$$" + contactType + "City$$", this.people.getCompactAddress().getCity());
            addParameter(params, "$$" + contactType + "State$$", this.people.getCompactAddress().getState());
            addParameter(params, "$$" + contactType + "Zip$$", this.people.getCompactAddress().getZip());
            addParameter(params, "$$" + contactType + "Fax$$", this.people.getFax());
            addParameter(params, "$$" + contactType + "Country$$", this.people.getCompactAddress().getCountry());
            addParameter(params, "$$" + contactType + "FullName$$", this.people.getFullName());
            return params;
            }
        
        this.replace = function(targetCapId) { // send to another record, optional new contact type
        
            var newType = this.type;
            if (arguments.length == 2) newType = arguments[1];
            //2. Get people with target CAPID.
            var targetPeoples = getContactObjs(targetCapId,[String(newType)]);
            //3. Check to see which people is matched in both source and target.
            for (var loopk in targetPeoples)  {
                var targetContact = targetPeoples[loopk];
                if (this.equals(targetPeoples[loopk])) {
                    targetContact.people.setContactType(newType);
                    aa.people.copyCapContactModel(this.capContact, targetContact.capContact);
                    targetContact.people.setContactAddressList(this.people.getContactAddressList());
                    overwriteResult = aa.people.editCapContactWithAttribute(targetContact.capContact);
                    if (overwriteResult.getSuccess())
                        logDebug("overwrite contact " + targetContact + " with " + this);
                    else
                        logDebug("error overwriting contact : " + this + " : " + overwriteResult.getErrorMessage());
                    return true;
                    }
                }

                var tmpCapId = this.capContact.getCapID();
                var tmpType = this.type;
                this.people.setContactType(newType);
                this.capContact.setCapID(targetCapId);
                createResult = aa.people.createCapContactWithAttribute(this.capContact);
                if (createResult.getSuccess())
                    logDebug("(contactObj) contact created : " + this);
                else
                    logDebug("(contactObj) error creating contact : " + this + " : " + createResult.getErrorMessage());
                this.capContact.setCapID(tmpCapId);
                this.type = tmpType;
                return true;
        }

        this.equals = function(t) {
            if (t == null) return false;
            if (!String(this.people.type).equals(String(t.people.type))) { return false; }
            if (!String(this.people.getFirstName()).equals(String(t.people.getFirstName()))) { return false; }
            if (!String(this.people.getLastName()).equals(String(t.people.getLastName()))) { return false; }
            if (!String(this.people.getFullName()).equals(String(t.people.getFullName()))) { return false; }
            if (!String(this.people.getBusinessName()).equals(String(t.people.getBusinessName()))) { return false; }
            return  true;
        }
        
        this.saveBase = function() {
            // set the values we store outside of the models.
            this.people.setContactType(this.type);
            this.capContact.setPrimaryFlag(this.primary ? "Y" : "N");
            this.people.setRelation(this.relation);
            saveResult = aa.people.editCapContact(this.capContact);
            if (saveResult.getSuccess())
                logDebug("(contactObj) base contact saved : " + this);
            else
                logDebug("(contactObj) error saving base contact : " + this + " : " + saveResult.getErrorMessage());
            }               
        
        this.save = function() {
            // set the values we store outside of the models
            this.people.setContactType(this.type);
            this.capContact.setPrimaryFlag(this.primary ? "Y" : "N");
            this.people.setRelation(this.relation);
            this.capContact.setPeople(this.people);
            saveResult = aa.people.editCapContactWithAttribute(this.capContact);
            if (saveResult.getSuccess())
                logDebug("(contactObj) contact saved : " + this);
            else
                logDebug("(contactObj) error saving contact : " + this + " : " + saveResult.getErrorMessage());
            }
			
		this.syncCapContactToReference = function() {
			
			if(this.refSeqNumber){
				var vRefContPeopleObj = aa.people.getPeople(this.refSeqNumber).getOutput();
				var saveResult = aa.people.syncCapContactToReference(this.capContact,vRefContPeopleObj);
				if (saveResult.getSuccess())
					logDebug("(contactObj) syncCapContactToReference : " + this);
				else
					logDebug("(contactObj) error syncCapContactToReference : " + this + " : " + saveResult.getErrorMessage());
			}
			else{
				logDebug("(contactObj) error syncCapContactToReference : No Reference Contact to Syncronize With");
			}
            
		}
		this.syncCapContactFromReference = function() {
			
			if(this.refSeqNumber){
				var vRefContPeopleObj = aa.people.getPeople(this.refSeqNumber).getOutput();
				var saveResult = aa.people.syncCapContactFromReference(this.capContact,vRefContPeopleObj);
				if (saveResult.getSuccess())
					logDebug("(contactObj) syncCapContactFromReference : " + this);
				else
					logDebug("(contactObj) error syncCapContactFromReference : " + this + " : " + saveResult.getErrorMessage());
			}
			else{
				logDebug("(contactObj) error syncCapContactFromReference : No Reference Contact to Syncronize With");
			}
            
		}

        //get method for Attributes
        this.getAttribute = function (vAttributeName){
            var retVal = null;
            if(this.validAttrs){
                var tmpVal = this.asi[vAttributeName.toString().toUpperCase()];
                if(tmpVal != null)
                    retVal = tmpVal.getAttributeValue();
            }
            return retVal;
        }
        
        //Set method for Attributes
        this.setAttribute = function(vAttributeName,vAttributeValue){
			var retVal = false;
            if(this.validAttrs){
                var tmpVal = this.asi[vAttributeName.toString().toUpperCase()];
                if(tmpVal != null){
                    tmpVal.setAttributeValue(vAttributeValue);
                    retVal = true;
                }
            }
            return retVal;
        }
		
		//get method for Custom Template Fields
        this.getCustomField = function(vFieldName){
            var retVal = null;
            if(this.validCustomFields){
                var tmpVal = this.customFields[vFieldName.toString()];
                if(!matches(tmpVal,undefined,null,"")){
                    retVal = tmpVal;
				}
            }
            return retVal;
        }
		
		//Set method for Custom Template Fields
        this.setCustomField = function(vFieldName,vFieldValue){
            
            var retVal = false;
            if(this.validCustomFields){
				if (!(this.customFieldsObj == null || this.customFieldsObj.size() == 0)) {
					for (var i = 0; i < this.customFieldsObj.size(); i++) {
						var eachForm = this.customFieldsObj.get(i);
						//Sub Group
						var subGroup = eachForm.subgroups;
						if (subGroup == null) {
							continue;
						}
						for (var j = 0; j < subGroup.size(); j++) {
							var eachSubGroup = subGroup.get(j);
							if (eachSubGroup == null || eachSubGroup.fields == null) {
								continue;
							}
							var allFields = eachSubGroup.fields;
							for (var k = 0; k < allFields.size(); k++) {
								var eachField = allFields.get(k);
								if(eachField.displayFieldName == vFieldName){
								logDebug("(contactObj) updating custom field {" + eachField.displayFieldName + "} = " +  eachField.defaultValue + " to " + vFieldValue);
								eachField.setDefaultValue(vFieldValue);
								retVal = true;
								}
							}
						}
					}
				}
            }
            return retVal;
        }

        this.remove = function() {
            var removeResult = aa.people.removeCapContact(this.capId, this.seqNumber)
            if (removeResult.getSuccess())
                logDebug("(contactObj) contact removed : " + this + " from record " + this.capId.getCustomID());
            else
                logDebug("(contactObj) error removing contact : " + this + " : from record " + this.capId.getCustomID() + " : " + removeResult.getErrorMessage());
            }

        this.isSingleAddressPerType = function() {
            if (this.addresses.length > 1) 
                {
                
                var addrTypeCount = new Array();
                for (y in this.addresses) 
                    {
                    thisAddr = this.addresses[y];
                    addrTypeCount[thisAddr.addressType] = 0;
                    }

                for (yy in this.addresses) 
                    {
                    thisAddr = this.addresses[yy];
                    addrTypeCount[thisAddr.addressType] += 1;
                    }

                for (z in addrTypeCount) 
                    {
                    if (addrTypeCount[z] > 1) 
                        return false;
                    }
                }
            else
                {
                return true;    
                }

            return true;

            }

        this.getAddressTypeCounts = function() { //returns an associative array of how many adddresses are attached.
           
            var addrTypeCount = new Array();
            
            for (y in this.addresses) 
                {
                thisAddr = this.addresses[y];
                addrTypeCount[thisAddr.addressType] = 0;
                }

            for (yy in this.addresses) 
                {
                thisAddr = this.addresses[yy];
                addrTypeCount[thisAddr.addressType] += 1;
                }

            return addrTypeCount;

            }

        this.createPublicUser = function() {

            if (!this.capContact.getEmail())
            { logDebug("(contactObj) Couldn't create public user for : " + this +  ", no email address"); return false; }

            if (String(this.people.getContactTypeFlag()).equals("organization"))
            { logDebug("(contactObj) Couldn't create public user for " + this + ", the contact is an organization"); return false; }
            
            // check to see if public user exists already based on email address
            var getUserResult = aa.publicUser.getPublicUserByEmail(this.capContact.getEmail())
            if (getUserResult.getSuccess() && getUserResult.getOutput()) {
                userModel = getUserResult.getOutput();
                logDebug("(contactObj) createPublicUserFromContact: Found an existing public user: " + userModel.getUserID());
            }

            if (!userModel) // create one
                {
                logDebug("(contactObj) CreatePublicUserFromContact: creating new user based on email address: " + this.capContact.getEmail()); 
                var publicUser = aa.publicUser.getPublicUserModel();
                publicUser.setFirstName(this.capContact.getFirstName());
                publicUser.setLastName(this.capContact.getLastName());
                publicUser.setEmail(this.capContact.getEmail());
                publicUser.setUserID(this.capContact.getEmail());
                publicUser.setPassword("e8248cbe79a288ffec75d7300ad2e07172f487f6"); //password : 1111111111
                publicUser.setAuditID("PublicUser");
                publicUser.setAuditStatus("A");
                publicUser.setCellPhone(this.people.getPhone2());

                var result = aa.publicUser.createPublicUser(publicUser);
                if (result.getSuccess()) {

                logDebug("(contactObj) Created public user " + this.capContact.getEmail() + "  sucessfully.");
                var userSeqNum = result.getOutput();
                var userModel = aa.publicUser.getPublicUser(userSeqNum).getOutput()

                // create for agency
                aa.publicUser.createPublicUserForAgency(userModel);

                // activate for agency
                var userPinBiz = aa.proxyInvoker.newInstance("com.accela.pa.pin.UserPINBusiness").getOutput()
                userPinBiz.updateActiveStatusAndLicenseIssueDate4PublicUser(aa.getServiceProviderCode(),userSeqNum,"ADMIN");

                // reset password
                var resetPasswordResult = aa.publicUser.resetPassword(this.capContact.getEmail());
                if (resetPasswordResult.getSuccess()) {
                    var resetPassword = resetPasswordResult.getOutput();
                    userModel.setPassword(resetPassword);
                    logDebug("(contactObj) Reset password for " + this.capContact.getEmail() + "  sucessfully.");
                } else {
                    logDebug("(contactObj **WARNING: Reset password for  " + this.capContact.getEmail() + "  failure:" + resetPasswordResult.getErrorMessage());
                }

                // send Activate email
                aa.publicUser.sendActivateEmail(userModel, true, true);

                // send another email
                aa.publicUser.sendPasswordEmail(userModel);
                }
                else {
                    logDebug("(contactObj) **WARNIJNG creating public user " + this.capContact.getEmail() + "  failure: " + result.getErrorMessage()); return null;
                }
            }

        //  Now that we have a public user let's connect to the reference contact       
            
        if (this.refSeqNumber)
            {
            logDebug("(contactObj) CreatePublicUserFromContact: Linking this public user with reference contact : " + this.refSeqNumber);
            aa.licenseScript.associateContactWithPublicUser(userModel.getUserSeqNum(), this.refSeqNumber);
            }
            

        return userModel; // send back the new or existing public user
        }

        this.getCaps = function() { // option record type filter

        
            if (this.refSeqNumber) {
                aa.print("ref seq : " + this.refSeqNumber);
                var capTypes = "*/*/*/*";
                var resultArray = new Array();
                if (arguments.length == 1) capTypes = arguments[0];

                var pm = aa.people.createPeopleModel().getOutput().getPeopleModel(); 
                var ccb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.CapContactDAOOracle").getOutput(); 
                pm.setServiceProviderCode(aa.getServiceProviderCode()) ; 
                pm.setContactSeqNumber(this.refSeqNumber); 

                var cList = ccb.getCapContactsByRefContactModel(pm).toArray();
                
                for (var j in cList) {
                    var thisCapId = aa.cap.getCapID(cList[j].getCapID().getID1(),cList[j].getCapID().getID2(),cList[j].getCapID().getID3()).getOutput();
                    if (appMatch(capTypes,thisCapId)) {
                        resultArray.push(thisCapId)
                        }
                    }
				} 
            
        return resultArray;
        }

        this.getRelatedContactObjs = function() { // option record type filter
        
            if (this.refSeqNumber) {
                var capTypes = null;
                var resultArray = new Array();
                if (arguments.length == 1) capTypes = arguments[0];

                var pm = aa.people.createPeopleModel().getOutput().getPeopleModel(); 
                var ccb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.CapContactDAOOracle").getOutput(); 
                pm.setServiceProviderCode(aa.getServiceProviderCode()) ; 
                pm.setContactSeqNumber(this.refSeqNumber); 

                var cList = ccb.getCapContactsByRefContactModel(pm).toArray();
                
                for (var j in cList) {
                    var thisCapId = aa.cap.getCapID(cList[j].getCapID().getID1(),cList[j].getCapID().getID2(),cList[j].getCapID().getID3()).getOutput();
                    if (capTypes && appMatch(capTypes,thisCapId)) {
                        var ccsm = aa.people.getCapContactByPK(thisCapId, cList[j].getPeople().contactSeqNumber).getOutput();
                        var newContactObj = new contactObj(ccsm);
                        resultArray.push(newContactObj)
                        }
                    }
            }
            
        return resultArray;
        }
        
		this.getRelatedRefLicProfObjs = function(){
			
			var refLicProfObjArray = new Array();
			
			// optional 2rd parameter serv_prov_code
				var updating = false;
				var serv_prov_code_4_lp = aa.getServiceProviderCode();
				if (arguments.length == 1) {
					serv_prov_code_4_lp = arguments[0];
					}
		
			if(this.refSeqNumber && serv_prov_code_4_lp)
			{
			  var xRefContactEntity = aa.people.getXRefContactEntityModel().getOutput();
			  xRefContactEntity.setServiceProviderCode(serv_prov_code_4_lp);
			  xRefContactEntity.setContactSeqNumber(parseInt(this.refSeqNumber));
			  xRefContactEntity.setEntityType("PROFESSIONAL");
			  //xRefContactEntity.setEntityID1(parseInt(refLicProfSeq));
			  var auditModel = xRefContactEntity.getAuditModel();
			  auditModel.setAuditDate(new Date());
			  auditModel.setAuditID(currentUserID);
			  auditModel.setAuditStatus("A")
			  xRefContactEntity.setAuditModel(auditModel);
			  var xRefContactEntityBusiness = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.XRefContactEntityBusiness").getOutput();
			  var xRefContactEntList = xRefContactEntityBusiness.getXRefContactEntityList(xRefContactEntity);
			  var xRefContactEntArray = xRefContactEntList.toArray();
			  if(xRefContactEntArray)
			  {
				 for(iLP in xRefContactEntArray){
					 var xRefContactEnt = xRefContactEntArray[iLP];
					 var lpSeqNbr = xRefContactEnt.getEntityID1();
					 var lpObjResult = aa.licenseScript.getRefLicenseProfBySeqNbr(aa.getServiceProviderCode(),lpSeqNbr);
					 var refLicNum = lpObjResult.getOutput().getStateLicense();
					 
					 refLicProfObjArray.push(new licenseProfObject1(refLicNum));
				 
				 }
				
			  }
			  else
			  {
				  logDebug("(contactObj.getRelatedRefLicProfObjs) - No Related Reference License License Professionals");
			  }
			  
			  return refLicProfObjArray;
			}
			else
			{
			  logDebug("**ERROR:Some Parameters are empty");
			}

		}
		
		this.linkRefContactWithRefLicProf = function(licnumber, lictype){
			
			var lpObj = new licenseProfObject(licnumber,lictype);
			var refLicProfSeq = lpObj.refLicModel.getLicSeqNbr();
			// optional 2rd parameter serv_prov_code
				var updating = false;
				var serv_prov_code_4_lp = aa.getServiceProviderCode();
				if (arguments.length == 3) {
					serv_prov_code_4_lp = arguments[2];
					}
		
			if(this.refSeqNumber && refLicProfSeq && serv_prov_code_4_lp)
			{
			  var xRefContactEntity = aa.people.getXRefContactEntityModel().getOutput();
			  xRefContactEntity.setServiceProviderCode(serv_prov_code_4_lp);
			  xRefContactEntity.setContactSeqNumber(parseInt(this.refSeqNumber));
			  xRefContactEntity.setEntityType("PROFESSIONAL");
			  xRefContactEntity.setEntityID1(parseInt(refLicProfSeq));
			  var auditModel = xRefContactEntity.getAuditModel();
			  auditModel.setAuditDate(new Date());
			  auditModel.setAuditID(currentUserID);
			  auditModel.setAuditStatus("A")
			  xRefContactEntity.setAuditModel(auditModel);
			  var xRefContactEntityBusiness = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.XRefContactEntityBusiness").getOutput();
			  var existedModel = xRefContactEntityBusiness.getXRefContactEntityByUIX(xRefContactEntity);
			  if(existedModel.getContactSeqNumber())
			  {
				logDebug("(contactObj) The License Professional has been linked to the Reference Contact.");
			  }
			  else
			  {
				var XRefContactEntityCreatedResult = xRefContactEntityBusiness.createXRefContactEntity(xRefContactEntity);
				if (XRefContactEntityCreatedResult)
				{
				  logDebug("(contactObj) The License Professional has been linked to the Reference Contact.");
				}
				else
				{
				  logDebug("(contactObj) **ERROR:License professional failed to link to reference contact.  Reason: " +  XRefContactEntityCreatedResult.getErrorMessage());
				}
			  }
			}
			else
			{
			  logDebug("**ERROR:Some Parameters are empty");
			}

		}
        
        this.createRefLicProf = function(licNum,rlpType,addressType,licenseState) {
            
            // optional 3rd parameter serv_prov_code
            var updating = false;
            var serv_prov_code_4_lp = aa.getServiceProviderCode();
            if (arguments.length == 5) {
                serv_prov_code_4_lp = arguments[4];
                aa.setDelegateAgencyCode(serv_prov_code_4_lp);
                }
            
            // addressType = one of the contact address types, or null to pull from the standard contact fields.
            var newLic = getRefLicenseProf(licNum,rlpType);

            if (newLic) {
                updating = true;
                logDebug("(contactObj) Updating existing Ref Lic Prof : " + licNum);
                }
            else {
                var newLic = aa.licenseScript.createLicenseScriptModel();
                }

            peop = this.people;
            cont = this.capContact;
            if (cont.getFirstName() != null) newLic.setContactFirstName(cont.getFirstName());
            if (peop.getMiddleName() != null) newLic.setContactMiddleName(peop.getMiddleName()); // use people for this
            if (cont.getLastName() != null) if (peop.getNamesuffix() != null) newLic.setContactLastName(cont.getLastName() + " " + peop.getNamesuffix()); else newLic.setContactLastName(cont.getLastName());
            if (peop.getBusinessName() != null) newLic.setBusinessName(peop.getBusinessName());
            if (peop.getPhone1() != null) newLic.setPhone1(peop.getPhone1());
            if (peop.getPhone2() != null) newLic.setPhone2(peop.getPhone2());
            if (peop.getEmail() != null) newLic.setEMailAddress(peop.getEmail());
            if (peop.getFax() != null) newLic.setFax(peop.getFax());
            newLic.setAgencyCode(serv_prov_code_4_lp);
            newLic.setAuditDate(sysDate);
            newLic.setAuditID(currentUserID);
            newLic.setAuditStatus("A");
            newLic.setLicenseType(rlpType);
            newLic.setStateLicense(licNum);
            newLic.setLicState(licenseState);
            //setting this field for a future enhancement to filter license types by the licensing board field. (this will be populated with agency names)
            var agencyLong = lookup("CONTACT_ACROSS_AGENCIES",servProvCode);
            if (!matches(agencyLong,undefined,null,"")) newLic.setLicenseBoard(agencyLong); else newLic.setLicenseBoard("");
 
            var addr = null;

            if (addressType) {
                for (var i in this.addresses) {
                    var cAddr = this.addresses[i];
                    if (addressType.equals(cAddr.getAddressType())) {
                        addr = cAddr;
                    }
                }
            }
            
            if (!addr) addr = peop.getCompactAddress();   //  only used on non-multiple addresses or if we can't find the right multi-address
            
            if (addr.getAddressLine1() != null) newLic.setAddress1(addr.getAddressLine1());
            if (addr.getAddressLine2() != null) newLic.setAddress2(addr.getAddressLine2());
            if (addr.getAddressLine3() != null) newLic.getLicenseModel().setTitle(addr.getAddressLine3());
            if (addr.getCity() != null) newLic.setCity(addr.getCity());
            if (addr.getState() != null) newLic.setState(addr.getState());
            if (addr.getZip() != null) newLic.setZip(addr.getZip());
            if (addr.getCountryCode() != null) newLic.getLicenseModel().setCountryCode(addr.getCountryCode());
            
            if (updating){
                myResult = aa.licenseScript.editRefLicenseProf(newLic);
				
			}
            else{
                myResult = aa.licenseScript.createRefLicenseProf(newLic);
				if (myResult.getSuccess())
                {
					var newRefLicSeqNbr = parseInt(myResult.getOutput());
					this.linkRefContactWithRefLicProf(licNum,rlpType,serv_prov_code_4_lp);
				}
			}

            if (arguments.length == 5) {
                aa.resetDelegateAgencyCode();
            }
                
            if (myResult.getSuccess())
                {
                logDebug("Successfully added/updated License No. " + licNum + ", Type: " + rlpType + " From Contact " + this);
                return true;
                }
            else
                {
                logDebug("**WARNING: can't create ref lic prof: " + myResult.getErrorMessage());
                return false;
                }
        }
        
        this.getAKA = function() {
            var aka = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.PeopleAKABusiness").getOutput();
            if (this.refSeqNumber) {
                return aka.getPeopleAKAListByContactNbr(aa.getServiceProviderCode(),String(this.refSeqNumber)).toArray();
                }
            else {
                logDebug("contactObj: Cannot get AKA names for a non-reference contact");
                return false;
                }
            }
            
        this.addAKA = function(firstName,middleName,lastName,fullName,startDate,endDate) {
            if (!this.refSeqNumber) {
                logDebug("contactObj: Cannot add AKA name for non-reference contact");
                return false;
                }
                
            var aka = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.PeopleAKABusiness").getOutput();
            var args = new Array();
            var akaModel = aa.proxyInvoker.newInstance("com.accela.orm.model.contact.PeopleAKAModel",args).getOutput();
            var auditModel = aa.proxyInvoker.newInstance("com.accela.orm.model.common.AuditModel",args).getOutput();

            var a = aka.getPeopleAKAListByContactNbr(aa.getServiceProviderCode(),String(this.refSeqNumber));
            akaModel.setServiceProviderCode(aa.getServiceProviderCode());
            akaModel.setContactNumber(parseInt(this.refSeqNumber));
            akaModel.setFirstName(firstName);
            akaModel.setMiddleName(middleName);
            akaModel.setLastName(lastName);
            akaModel.setFullName(fullName);
            akaModel.setStartDate(startDate);
            akaModel.setEndDate(endDate);
            auditModel.setAuditDate(new Date());
            auditModel.setAuditStatus("A");
            auditModel.setAuditID("ADMIN");
            akaModel.setAuditModel(auditModel);
            a.add(akaModel);

            aka.saveModels(aa.getServiceProviderCode(), this.refSeqNumber, a);
            }

        this.removeAKA = function(firstName,middleName,lastName) {
            if (!this.refSeqNumber) {
                logDebug("contactObj: Cannot remove AKA name for non-reference contact");
                return false;
                }
            
            var removed = false;
            var aka = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.PeopleAKABusiness").getOutput();
            var l = aka.getPeopleAKAListByContactNbr(aa.getServiceProviderCode(),String(this.refSeqNumber));
            
            var i = l.iterator();
            while (i.hasNext()) {
                var thisAKA = i.next();
                if ((!thisAKA.getFirstName() || thisAKA.getFirstName().equals(firstName)) && (!thisAKA.getMiddleName() || thisAKA.getMiddleName().equals(middleName)) && (!thisAKA.getLastName() || thisAKA.getLastName().equals(lastName))) {
                    i.remove();
                    logDebug("contactObj: removed AKA Name : " + firstName + " " + middleName + " " + lastName);
                    removed = true;
                    }
                }   
                    
            if (removed)
                aka.saveModels(aa.getServiceProviderCode(), this.refSeqNumber, l);
            }

        this.hasPublicUser = function() { 
            if (this.refSeqNumber == null) return false;
            var s_publicUserResult = aa.publicUser.getPublicUserListByContactNBR(aa.util.parseLong(this.refSeqNumber));
            
            if (s_publicUserResult.getSuccess()) {
                var fpublicUsers = s_publicUserResult.getOutput();
                if (fpublicUsers == null || fpublicUsers.size() == 0) {
                    logDebug("The contact("+this.refSeqNumber+") is not associated with any public user.");
                    return false;
                } else {
                    logDebug("The contact("+this.refSeqNumber+") is associated with "+fpublicUsers.size()+" public users.");
                    return true;
                }
            } else { logMessage("**ERROR: Failed to get public user by contact number: " + s_publicUserResult.getErrorMessage()); return false; }
        }

        this.linkToPublicUser = function(pUserId) { 
           
            if (pUserId != null) {
                var pSeqNumber = pUserId.replace('PUBLICUSER','');
                
                var s_publicUserResult = aa.publicUser.getPublicUser(aa.util.parseLong(pSeqNumber));

                if (s_publicUserResult.getSuccess()) {
                    var linkResult = aa.licenseScript.associateContactWithPublicUser(pSeqNumber, this.refSeqNumber);

                    if (linkResult.getSuccess()) {
                        logDebug("Successfully linked public user " + pSeqNumber + " to contact " + this.refSeqNumber);
                    } else {
                        logDebug("Failed to link contact to public user");
                        return false;
                    }
                } else {
                    logDebug("Could not find a public user with the seq number: " + pSeqNumber);
                    return false;
                }


            } else {
                logDebug("No public user id provided");
                return false;
            }
        }

        this.sendCreateAndLinkNotification = function() {
            //for the scenario in AA where a paper application has been submitted
            var toEmail = this.people.getEmail();

            if (toEmail) {
                var params = aa.util.newHashtable();
                getACARecordParam4Notification(params,acaUrl);
                addParameter(params, "$$licenseType$$", cap.getCapType().getAlias());
                addParameter(params,"$$altID$$",capIDString);
                var notificationName;

                if (this.people.getContactTypeFlag() == "individual") {
                    notificationName = this.people.getFirstName() + " " + this.people.getLastName();
                } else {
                    notificationName = this.people.getBusinessName();
                }

                if (notificationName)
                    addParameter(params,"$$notificationName$$",notificationName);
                if (this.refSeqNumber) {
                    var v = new verhoeff();
                    var pinCode = v.compute(String(this.refSeqNumber));
                    addParameter(params,"$$pinCode$$",pinCode);

                    sendNotification(sysFromEmail,toEmail,"","PUBLICUSER CREATE AND LINK",params,null);                    
                }

                               
            }

        }

        this.getRelatedRefContacts = function() { //Optional relationship types array 
            
            var relTypes;
            if (arguments.length > 0) relTypes = arguments[0];
            
            var relConsArray = new Array();

            if (matches(this.refSeqNumber,null,undefined,"")) return relConsArray;

            //check as the source
            var xrb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.XRefContactEntityBusiness").getOutput();
            xRefContactEntityModel = aa.people.getXRefContactEntityModel().getOutput();
            xRefContactEntityModel.setContactSeqNumber(parseInt(this.refSeqNumber));
            x = xrb.getXRefContactEntityList(xRefContactEntityModel);


            if (x.size() > 0) {
                var relConList = x.toArray();

                for (var zz in relConList) {
                    var thisRelCon = relConList[zz];
                    var addThisCon = true;
                    if (relTypes) {
                        addThisCon = exists(thisRelCon.getEntityID4(),relTypes);
                    }

                    if (addThisCon) {
                        var peopResult = aa.people.getPeople(thisRelCon.getEntityID1());
                        if (peopResult.getSuccess()) {
                            var peop = peopResult.getOutput();
                            relConsArray.push(peop);
                        }
                    }

                }
            }

            //check as the target
            var xrb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.XRefContactEntityBusiness").getOutput();
            xRefContactEntityModel = aa.people.getXRefContactEntityModel().getOutput();
            xRefContactEntityModel.setEntityID1(parseInt(this.refSeqNumber));
            x = xrb.getXRefContactEntityList(xRefContactEntityModel);

            if (x.size() > 0) {
                var relConList = x.toArray();

                for (var zz in relConList) {
                    var thisRelCon = relConList[zz];
                    var addThisCon = true;
                    if (relTypes) {
                        addThisCon = exists(thisRelCon.getEntityID4(),relTypes);
                    }

                    if (addThisCon) {
                        var peopResult = aa.people.getPeople(thisRelCon.getContactSeqNumber());
                        if (peopResult.getSuccess()) {
                            var peop = peopResult.getOutput();
                            relConsArray.push(peop);
                        }
                    }

                }
            }           

            return relConsArray;
        }
    }

// Check array whether contains object
function contains(arr, obj) {
    var i = arr.length;
    while (i--) {
       if (arr[i] === obj) {
           return true;
       }
    }
    return false;
}   
function copyAddress(srcCapId, targetCapId)
{
	//1. Get address with source CAPID.
	var capAddresses = getAddress(srcCapId);
	if (capAddresses == null || capAddresses.length == 0)
	{
		return;
	}
	//2. Get addresses with target CAPID.
	var targetAddresses = getAddress(targetCapId);
	//3. Check to see which address is matched in both source and target.
	for (loopk in capAddresses)
	{
		sourceAddressfModel = capAddresses[loopk];
		//3.1 Set target CAPID to source address.
		sourceAddressfModel.setCapID(targetCapId);
		targetAddressfModel = null;
		//3.2 Check to see if sourceAddress exist.
		if (targetAddresses != null && targetAddresses.length > 0)
		{
			for (loop2 in targetAddresses)
			{
				if (isMatchAddress(sourceAddressfModel, targetAddresses[loop2]))
				{
					targetAddressfModel = targetAddresses[loop2];
					break;
				}
			}
		}
		//3.3 It is a matched address model.
		if (targetAddressfModel != null)
		{
		
			//3.3.1 Copy information from source to target.
			aa.address.copyAddressModel(sourceAddressfModel, targetAddressfModel);
			//3.3.2 Edit address with source address information. 
			aa.address.editAddressWithAPOAttribute(targetCapId, targetAddressfModel);
			logDebug("Copying address");
		}
		//3.4 It is new address model.
		else
		{	
			//3.4.1 Create new address.
			logDebug("Copying address");
			aa.address.createAddressWithAPOAttribute(targetCapId, sourceAddressfModel);
		}
	}
}
function copyAppName(srcCapId, targetCapId){
    logDebug("copyAppName() started");
    try{
        var parCapResult = aa.cap.getCap(srcCapId);
        if(!parCapResult.getSuccess()) { logDebug("WARNING: Unable to get application name from source cap id " + srcCapId); return false; }
        
        var parAppName = getAppName(srcCapId);
        
        if(parAppName == null || parAppName == "" || parAppName == undefined) { logDebug("Parent Record " + srcCapId.getCustomID() + " has no Application Name to copy"); return false; }
        
        return editAppName(parAppName, targetCapId);
    }
    catch(err){
        showMessage = true;
        comment("Error on copyAppName(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
        logDebug("Error on copyAppName(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
    }    
}//END copyAppName()
function copyAppSpecificRenewal(AInfo,newCap) // copy all App Specific info into new Cap, 1 optional parameter for ignoreArr
{
	var ignoreArr = new Array();
	var limitCopy = false;
	if (arguments.length > 2) 
	{
		ignoreArr = arguments[2];
		limitCopy = true;
	}
	
	for (asi in AInfo){
		//Check list
		if(limitCopy){
			var ignore=false;
		  	for(var i = 0; i < ignoreArr.length; i++)
		  		if(ignoreArr[i] == asi){
		  			ignore=true;
					logDebug("Skipping ASI Field: " + ignoreArr[i]);
		  			break;
		  		}
		  	if(ignore)
		  		continue;
		}
		//logDebug("Copying ASI Field: " + asi);
		editAppSpecific(asi,AInfo[asi],newCap);
	}
}
function copyASIInfo(srcCapId, targetCapId)
{
	//copy ASI infomation
	var AppSpecInfo = new Array();
	loadAppSpecific(AppSpecInfo,srcCapId);
	var recordType = "";
	
	var targetCapResult = aa.cap.getCap(targetCapId);

	if (!targetCapResult.getSuccess()) {
			logDebug("Could not get target cap object: " + targetCapId);
		}
	else	{
		var targetCap = targetCapResult.getOutput();
			targetAppType = targetCap.getCapType();		//create CapTypeModel object
			targetAppTypeString = targetAppType.toString();
			logDebug(targetAppTypeString);
		}

	var ignore = lookup("EMSE:ASI Copy Exceptions",targetAppTypeString); 
	var ignoreArr = new Array(); 
	if(ignore != null) 
	{
		ignoreArr = ignore.split("|");
		copyAppSpecificRenewal(AppSpecInfo,targetCapId, ignoreArr);
	}
	else
	{
		aa.print("something");
		copyAppSpecificRenewal(AppSpecInfo,targetCapId);

	}
}
function copyASITableByTName(tableName, pFromCapId, pToCapId) {
	// Function dependencies on addASITable()
	// par3 is optional 0 based string array of table to ignore
	var itemCap = pFromCapId;

	var gm = aa.appSpecificTableScript.getAppSpecificTableGroupModel(itemCap).getOutput();
	var ta = gm.getTablesArray()
		var tai = ta.iterator();
	var tableArr = new Array();
	var ignoreArr = new Array();
	var limitCopy = false;
	if (arguments.length > 3) {
		ignoreArr = arguments[3];
		limitCopy = true;
	}
	while (tai.hasNext()) {
		var tsm = tai.next();

		var tempObject = new Array();
		var tempArray = new Array();
		var tn = tsm.getTableName() + "";
		var numrows = 0;

		//Check list
		if (limitCopy) {
			var ignore = false;
			for (var i = 0; i < ignoreArr.length; i++)
				if (ignoreArr[i] == tn) {
					ignore = true;
					break;
				}
			if (ignore)
				continue;
		}
		
		//If first parameter is not null
		if(tableName != null && tableName != tn) continue
		
		if (!tsm.rowIndex.isEmpty()) {
			var tsmfldi = tsm.getTableField().iterator();
			var tsmcoli = tsm.getColumns().iterator();
			var readOnlyi = tsm.getAppSpecificTableModel().getReadonlyField().iterator(); // get Readonly filed
			var numrows = 1;
			while (tsmfldi.hasNext()) // cycle through fields
			{
				if (!tsmcoli.hasNext()) // cycle through columns
				{
					var tsmcoli = tsm.getColumns().iterator();
					tempArray.push(tempObject); // end of record
					var tempObject = new Array(); // clear the temp obj
					numrows++;
				}
				var tcol = tsmcoli.next();
				var tval = tsmfldi.next();

				var readOnly = 'N';
				if (readOnlyi.hasNext()) {
					readOnly = readOnlyi.next();
				}

				var fieldInfo = new asiTableValObj(tcol.getColumnName(), tval, readOnly);
				tempObject[tcol.getColumnName()] = fieldInfo;
				//tempObject[tcol.getColumnName()] = tval;
			}

			tempArray.push(tempObject); // end of record
		}

		addASITable(tn, tempArray, pToCapId);
		logDebug("ASI Table Array : " + tn + " (" + numrows + " Rows)");
	}
}
function copyASITables(pFromCapId, pToCapId) {
	// Function dependencies on addASITable()
	// par3 is optional 0 based string array of table to ignore
	var itemCap = pFromCapId;

	var gm = aa.appSpecificTableScript.getAppSpecificTableGroupModel(itemCap).getOutput();
	var ta = gm.getTablesArray()
		var tai = ta.iterator();
	var tableArr = new Array();
	var ignoreArr = new Array();
	var limitCopy = false;
	if (arguments.length > 2) {
		ignoreArr = arguments[2];
		limitCopy = true;
	}
	while (tai.hasNext()) {
		var tsm = tai.next();

		var tempObject = new Array();
		var tempArray = new Array();
		var tn = tsm.getTableName() + "";
		var numrows = 0;

		//Check list
		if (limitCopy) {
			var ignore = false;
			for (var i = 0; i < ignoreArr.length; i++)
				if (ignoreArr[i] == tn) {
					ignore = true;
					break;
				}
			if (ignore)
				continue;
		}
		if (!tsm.rowIndex.isEmpty()) {
			var tsmfldi = tsm.getTableField().iterator();
			var tsmcoli = tsm.getColumns().iterator();
			var readOnlyi = tsm.getAppSpecificTableModel().getReadonlyField().iterator(); // get Readonly filed
			var numrows = 1;
			while (tsmfldi.hasNext()) // cycle through fields
			{
				if (!tsmcoli.hasNext()) // cycle through columns
				{
					var tsmcoli = tsm.getColumns().iterator();
					tempArray.push(tempObject); // end of record
					var tempObject = new Array(); // clear the temp obj
					numrows++;
				}
				var tcol = tsmcoli.next();
				var tval = tsmfldi.next();

				var readOnly = 'N';
				if (readOnlyi.hasNext()) {
					readOnly = readOnlyi.next();
				}

				var fieldInfo = new asiTableValObj(tcol.getColumnName(), tval, readOnly);
				tempObject[tcol.getColumnName()] = fieldInfo;
				//tempObject[tcol.getColumnName()] = tval;
			}

			tempArray.push(tempObject); // end of record
		}

		addASITable(tn, tempArray, pToCapId);
		logDebug("ASI Table Array : " + tn + " (" + numrows + " Rows)");
	}
}
function CopyCheckList(inspId) {
	try {
		var sourceGuideSheetsList = getSourceGuideSheetList();
		if (sourceGuideSheetsList.size() > 0)
			var copyResult = copyGuideSheetsFromSourceInspection(sourceGuideSheetsList, inspId);

	} catch (e) {
		logDebug("Error in SchedInsp " + e.message);
		return false;
	}
}

function copyCheckListByItemStatus(fromInspId, toInspId, itemStatus){ //OPTIONAL: fromCap, toCap
    try{
		logDebug("Copying checklist(s) items with status of " + itemStatus);
        //use capId by default
        var fromCap = capId;
		var toCap = capId;
        //previous inspection and current inspection
        var pInsp, cInsp;
        
        //optional capId
        if (arguments.length > 3) fromCap = arguments[3];
		if (arguments.length > 4) toCap = arguments[4];
        
		logDebug("Copying from record: " + fromCap.getCustomID() + " to " + toCap.getCustomID()); 
		
        //Get inspections
        var insps = aa.inspection.getInspections(fromCap).getOutput();
        if (!insps || insps.length == 0) return false;
        
        for (var i in insps)
            if (insps[i].getIdNumber() == fromInspId)
                pInsp = insps[i].getInspection();
		
        var inspsTo = aa.inspection.getInspections(toCap).getOutput();
		for(var i in inspsTo)
			if (inspsTo[i].getIdNumber() == toInspId)
                cInsp = inspsTo[i].getInspection();
		
        
        //If cannot find inspections then return false
        if (!pInsp || !cInsp) return false;
        
        for (var i in insps)
        {
            if (insps[i].getIdNumber() == fromInspId)
            {
                pInsp = insps[i].getInspection();
            }
        }
		
        var gsArr = pInsp.getGuideSheets().toArray();
        var guideSheetList = aa.util.newArrayList();
        
        for (gsIdx in gsArr) {
            var gGuideSheetModel = gsArr[gsIdx];
            var guideSheetItemList = aa.util.newArrayList();
            var gGuideSheetItemModels = gGuideSheetModel.getItems();
            if (gGuideSheetItemModels) {
                for (var j = 0; j < gGuideSheetItemModels.size(); j++) {
                    var gGuideSheetItemModel = gGuideSheetItemModels.get(j);
                    var gGuideSheetType = gGuideSheetItemModel.getGuideType();
                    var gGuideSheetItemStatus = gGuideSheetItemModel.getGuideItemStatus(); 
					for(idxStatus in itemStatus)
					    if(gGuideSheetItemStatus == itemStatus[idxStatus])
                            guideSheetItemList.add(gGuideSheetItemModel);
                }
            }
        
            if (guideSheetItemList.size() > 0) {
                var gGuideSheet = gGuideSheetModel.clone();
                gGuideSheet.setItems(guideSheetItemList);
                guideSheetList.add(gGuideSheet);
            }
        }
			
			
            if (guideSheetList.size() > 0) {
                
                var copyResult = aa.guidesheet.copyGGuideSheetItems(guideSheetList, toCap, parseInt(toInspId), aa.getAuditID());
                if (copyResult.getSuccess()) {
                    logDebug("Successfully copy guideSheet items");
                } else {
                    logDebug("Failed copy guideSheet items. Error: " + copyResult.getErrorMessage());
                }
            }
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function copyGSItemsByStatus(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function copyGSItemsByStatus(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
}//END copyGSItemsByStatus()
/*
* CPOIES CONTACTS

    OPTIONS: ADDITIONAL OPTIONS YOU NEED FOR FILTERING OR COPYING OPTIONS 
    combines functonality of global functions copyContacts() and copyContactsByType()
*/
function copyContacts2(srcCapId, destCapId, options) {
    var settings = {
         contactType: null,  //if not null, filters by contact type
         copyContactAddressList: true
    };
    for (var attr in options) { settings[attr] = options[attr]; } //optional params - overriding default settings

    
	if (destCapId == null)
		var vToCapId = capId;
	else
		var vToCapId = destCapId;

	var capContactResult = aa.people.getCapContactByCapID(srcCapId);
	var copied = 0;
	if (capContactResult.getSuccess()) {
        var contacts = capContactResult.getOutput();

		for (yy in contacts) {

            if(settings.contactType == null || contacts[yy].getCapContactModel().getContactType() == settings.contactType) {
                var newContact = contacts[yy].getCapContactModel();

                if(settings.copyContactAddressList == true) {
                    // Retrieve contact address list and set to related contact
                    var contactAddressrs = aa.address.getContactAddressListByCapContact(newContact);
                    if (contactAddressrs.getSuccess()) {
                        var contactAddressModelArr = convertContactAddressModelArr(contactAddressrs.getOutput());
                        newContact.getPeople().setContactAddressList(contactAddressModelArr);
                    }
                    newContact.setCapID(vToCapId);
                    aa.people.createCapContact(newContact);

                } else {
                    newContact.setCapID(vToCapId);
                    aa.people.createCapContactWithAttribute(newContact);
                }

                // Create cap contact, contact address and contact template
                copied++;
                logDebug("Copied contact from " + srcCapId.getCustomID() + " to " + vToCapId.getCustomID());
            }

		}
	} else {
		logMessage("**ERROR: Failed to get contacts: " + capContactResult.getErrorMessage());
		return false;
	}
	return copied;
}

/*--------------------------------------------------------------------------------------------------------------------/
| Start ETW 12/3/14 copyContacts3_0
/--------------------------------------------------------------------------------------------------------------------*/
function copyContacts3_0(srcCapId, targetCapId) {
    //1. Get people with source CAPID.
    var capPeoples = getPeople3_0(srcCapId);
    if (capPeoples == null || capPeoples.length == 0) {
        return;
    }
    //2. Get people with target CAPID.
    var targetPeople = getPeople3_0(targetCapId);
    //3. Check to see which people is matched in both source and target.
    for (loopk in capPeoples) {
        sourcePeopleModel = capPeoples[loopk];
        //3.1 Set target CAPID to source people.
        sourcePeopleModel.getCapContactModel().setCapID(targetCapId);
        targetPeopleModel = null;
        //3.2 Check to see if sourcePeople exist.
        if (targetPeople != null && targetPeople.length > 0) {
            for (loop2 in targetPeople) {
                if (isMatchPeople3_0(sourcePeopleModel, targetPeople[loop2])) {
                    targetPeopleModel = targetPeople[loop2];
                    break;
                }
            }
        }
        //3.3 It is a matched people model.
        if (targetPeopleModel != null) {
            //3.3.1 Copy information from source to target.
            aa.people.copyCapContactModel(sourcePeopleModel.getCapContactModel(), targetPeopleModel.getCapContactModel());
            //3.3.2 Copy contact address from source to target.
            if (targetPeopleModel.getCapContactModel().getPeople() != null && sourcePeopleModel.getCapContactModel().getPeople()) {
                targetPeopleModel.getCapContactModel().getPeople().setContactAddressList(sourcePeopleModel.getCapContactModel().getPeople().getContactAddressList());
            }
            //3.3.3 Edit People with source People information.
            aa.people.editCapContactWithAttribute(targetPeopleModel.getCapContactModel());
        }
            //3.4 It is new People model.
        else {
            //3.4.1 Create new people.
            aa.people.createCapContactWithAttribute(sourcePeopleModel.getCapContactModel());
        }
    }
}
/*--------------------------------------------------------------------------------------------------------------------/
| End ETW 12/3/14 copyContacts3_0
/--------------------------------------------------------------------------------------------------------------------*/


function copyCRMComments(){


//Start the copying of the CRM URL to the child record comments; 
 var recID = getAppSpecific("Core Request ID");
  var crmURL = getAppSpecific("CRM URL");
	var childRec = getChildren("*/*/*/*", capId);
	var urlFlag = false;
	var orgId = capId;  
	for(x in childRec){
		

					cRec = childRec[x];
					
					capId = cRec; 


					ccsm = aa.cap.createCapCommentScriptModel();
	ccsm.setCapIDModel(capId);
	ccm = ccsm.getCapCommentModel();
	getResult = aa.cap.getCapComment(ccm);
	if (getResult.getSuccess()) {
		commentArray = getResult.getOutput();
		if (commentArray != null) {
			for (cIndex in commentArray) {
				
				thisComment = commentArray[cIndex];
				thisText = thisComment.getText();
				logDebug("ThisText" + thisText);
				var stringMatch; 
				stringMatch = thisText.search("publicstuff.com")
				logDebug("StringMatch" + stringMatch);
				var noMatch = -1;
				if(stringMatch != noMatch){
					
					logDebug("Match Found");
                    urlFlag = true;
					break;
					
				}
				
				
				
				}
			}
		}
		        logDebug("URL FLAG IS" + " " + urlFlag);
				if(!urlFlag){
				createCapComment(crmURL,cRec);
				}
		
		}
		capId = orgId;

//End copying 
//Start Copying Subsequent CRM Comments; 

	ccsm = aa.cap.createCapCommentScriptModel();
	ccsm.setCapIDModel(capId);
	ccm = ccsm.getCapCommentModel();
	getResult = aa.cap.getCapComment(ccm);
	if (getResult.getSuccess()) {
		commentArray = getResult.getOutput();
		if (commentArray != null) {
			for (cIndex in commentArray) {
				
				thisComment = commentArray[cIndex];
				thisText = thisComment.getText();
				//logDebug("Shadow Record comment" + thisComment);
				logDebug("Shadow Record comment" + thisText);
												
				for(x in childRec){
					
					cRec = childRec[x];
					createCapComment(thisText,cRec);
					
					
				}

				
				break;	
				}
			}
		}
}	 
function copyDetailedDescription(srcCapId, targetCapId)
{
	newWorkDes = workDescGet(srcCapId);
	if (newWorkDes != null && newWorkDes != "")
		updateWorkDesc(newWorkDes, targetCapId);
}
//copy failed guidesheet (checklist) items from one inspection to another in the same record 
function copyFailedGSItems(sInspId, tInspId){
	var currInspGSObj = aa.guidesheet.getFailGGuideSheetItemsByCapIDAndInspID(capId, sInspId, false);
	
    if(!currInspGSObj.getSuccess()) { logDebug("WARNING: Unable to load failed guidesheet items."); }
    var currInspGS = currInspGSObj.getOutput();
    
    var copyResult = aa.inspection.saveCarryOverItems(currInspGS, capId, tInspId);
    
    if (copyResult.getSuccess()) {
    	logDebug("Successfully copied failed guideSheet items to new inspection ID : " + tInspId);
    } else {
    	logDebug("Failed copied failed guideSheet items to cap: " + copyResult.getErrorMessage());
    }
}
//copyGSItemsByStatusAndSheeType()
// copy guidesheet items by type and item status
function copyGSItemsByStatusAndSheeType(fromInspId, toInspId, gsType, itemStatus){ //OPTIONAL: fromCap, toCap
    try{
        logDebug("Copying checklist items with status of " + itemStatus + " from checklist " + gsType);
        //use capId by default
        var fromCap = capId;
        var toCap = capId;
        //previous inspection and current inspection
        var pInsp, cInsp;
        
        //optional capId
        if (arguments.length > 4) fromCap = arguments[4];
        if (arguments.length > 5) toCap = arguments[5];
        
        logDebug("Copying from record: " + fromCap.getCustomID() + " to " + toCap.getCustomID()); 
        
        //Get inspections
        var insps = aa.inspection.getInspections(fromCap).getOutput();
        if (!insps || insps.length == 0) { logDebug("No inspections in " + fromCap.getCustomID()); return false;}
        
        for (var i in insps)
            if (insps[i].getIdNumber() == fromInspId)
                pInsp = insps[i].getInspection();
        
        var inspsTo = aa.inspection.getInspections(toCap).getOutput();
        for(var i in inspsTo)
            if (inspsTo[i].getIdNumber() == toInspId)
                cInsp = inspsTo[i].getInspection();
        
        
        //If cannot find inspections then return false
        if (!pInsp || !cInsp) { logDebug("No inspections found."); return false; }
        
        for (var i in insps)
        {
            if (insps[i].getIdNumber() == fromInspId)
            {
                pInsp = insps[i].getInspection();
            }
        }
        
        var gsArr = pInsp.getGuideSheets().toArray();
        var guideSheetList = aa.util.newArrayList();
        
        for (gsIdx in gsArr) {
            var gGuideSheetModel = gsArr[gsIdx];
            var guideSheetItemList = aa.util.newArrayList();
            var gGuideSheetItemModels = gGuideSheetModel.getItems();
            if (gGuideSheetItemModels) {
                for (var j = 0; j < gGuideSheetItemModels.size(); j++) {
                    var gGuideSheetItemModel = gGuideSheetItemModels.get(j);
                    var gGuideSheetType = gGuideSheetItemModel.getGuideType();
                    var gGuideSheetItemStatus = gGuideSheetItemModel.getGuideItemStatus();
                    if(gGuideSheetType == gsType){ 
                        for(idxStatus in itemStatus)
                            if(gGuideSheetItemStatus == itemStatus[idxStatus])
                                guideSheetItemList.add(gGuideSheetItemModel);
                    }
                }
            }
        
            if (guideSheetItemList.size() > 0) {
                var gGuideSheet = gGuideSheetModel.clone();
                gGuideSheet.setItems(guideSheetItemList);
                guideSheetList.add(gGuideSheet);
            }
        }       
        if (guideSheetList.size() > 0) {
            
            var copyResult = aa.guidesheet.copyGGuideSheetItems(guideSheetList, toCap, parseInt(toInspId), aa.getAuditID());
            if (copyResult.getSuccess()) {
                logDebug("Successfully copy guideSheet items");
                return true;
            } else {
                logDebug("Failed copy guideSheet items. Error: " + copyResult.getErrorMessage());
                return false;
            }
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function copyGSItemsByStatus(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function copyGSItemsByStatus(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
}//END copyGSItemsByStatus()
function copyGuideSheetItemsByStatus(fromInspId, toInspId)
{
	try 
		{
			//use capId by default
			var itemCap = capId;
			//previous inspection and current inspection
			var pInsp, cInsp;

			//optional capId
			if (arguments.length > 2) itemCap = arguments[2];

			//Get inspections
			var insps = aa.inspection.getInspections(itemCap).getOutput();
			if (!insps || insps.length == 0) return false;

			for (var i in insps)
			{
				if (insps[i].getIdNumber() == fromInspId)
				{
					pInsp = insps[i].getInspection();
				}
				else if (insps[i].getIdNumber() == toInspId)
				{
					cInsp = insps[i].getInspection();
				}
			}

			//If cannot find inspections then return false
			if (!pInsp || !cInsp) return false;

			//Clear the guidesheet items on current inspection before copying
			var gGuideSheetBusiness = aa.proxyInvoker.newInstance("com.accela.aa.inspection.guidesheet.GGuideSheetBusiness").getOutput();
			if (!gGuideSheetBusiness) {
				throw "Could not invoke GGuideSheetBusiness";
			}
			gGuideSheetBusiness.removeGGuideSheetByCap(itemCap, toInspId, aa.getAuditID());

			//if previous inspection has no guidesheet then theres nothing to copy
			if (!pInsp.getGuideSheets() || pInsp.getGuideSheets().size() == 0) return false;

			// Copy prev guidesheets
			var gsArr = pInsp.getGuideSheets().toArray();
			var guideSheetList = aa.util.newArrayList();			
			for (gsIdx in gsArr) {
				var gGuideSheetModel = gsArr[gsIdx];
				var guideSheetItemList = aa.util.newArrayList();
				var gGuideSheetItemModels = gGuideSheetModel.getItems();
				if (gGuideSheetItemModels) {
					for (var j = 0; j < gGuideSheetItemModels.size(); j++) {
						var gGuideSheetItemModel = gGuideSheetItemModels.get(j);
						guideSheetItemList.add(gGuideSheetItemModel);
					}
				}

				if (guideSheetItemList.size() > 0) {
					var gGuideSheet = gGuideSheetModel.clone();
					gGuideSheet.setItems(guideSheetItemList);
					guideSheetList.add(gGuideSheet);
				}
			}
			if (guideSheetList.size() > 0) {
				
				var copyResult = aa.guidesheet.copyGGuideSheetItems(guideSheetList, itemCap, parseInt(toInspId), aa.getAuditID());
				if (copyResult.getSuccess()) {
					logDebug("Successfully copy guideSheet items");
					return true;
				} else {
					logDebug("Failed copy guideSheet items. Error: " + copyResult.getErrorMessage());
					return false;
				}
			}			
		}
	catch (e) 
		{
			showDebug = true;
			showMessage = true;
			logDebug(e);
		}
}
function copyGuideSheetsFromSourceInspection(sourceGuideSheetList, targetInspectionId) {
	var copyResult = aa.guidesheet.copyGGuideSheetItems(sourceGuideSheetList, capId, parseFloat(targetInspectionId), aa.getAuditID());

	if (copyResult.getSuccess()) {
		logDebug("Successfully copy guideSheet items to cap : " + capId);
	} else {
		logDebug("Failed copy guideSheet items to cap: " + copyResult.getErrorMessage());
	}

}
/**
 * Copies all important information from one Cap to another Cap
 * 
 * @requires copyAppSpecificInfoForLic(CapIDModel, CapIDModel),
 *           copyAddressForLic(CapIDModel, CapIDModel),
 *           copyAppSpecificTableForLic(CapIDModel, CapIDModel),
 *           copyParcelForLic(CapIDModel, CapIDModel),
 *           copyPeopleForLic(CapIDModel, CapIDModel),
 *           copyLicenseProfessionalForLic(CapIDModel, CapIDModel),
 *           copyOwnerForLic(CapIDModel, CapIDModel),
 *           copyCapConditionForLic(CapIDModel, CapIDModel),
 *           copyAdditionalInfoForLic(CapIDModel, CapIDModel),
 *           copyEducation(CapIDModel, CapIDModel),
 *           copyContEducation(CapIDModel, CapIDModel),
 *           copyExamination(CapIDModel, CapIDModel),
 *           copyRenewCapDocument(CapIDModel, CapIDModel)
 * @example copyKeyInfo(CapIDModel, CapIDModel);
 * @memberof INCLUDES_CUSTOM
 * @param {CapIDModel}
 *            srcCapId
 * @param {CapIDModel}
 *            targetCapId
 */

function copyKeyInfo(srcCapId, targetCapId) {
	copyAppSpecificInfoForLic(srcCapId, targetCapId);
	copyAddressForLic(srcCapId, targetCapId);
	copyAppSpecificTableForLic(srcCapId, targetCapId);
	copyParcelForLic(srcCapId, targetCapId);
	copyPeopleForLic(srcCapId, targetCapId);
	copyLicenseProfessionalForLic(srcCapId, targetCapId);
	copyOwnerForLic(srcCapId, targetCapId);
	copyCapConditionForLic(srcCapId, targetCapId);
	copyAdditionalInfoForLic(srcCapId, targetCapId);
	if (vEventName == "ConvertToRealCapAfter") {
		copyEducation(srcCapId, targetCapId);
		copyContEducation(srcCapId, targetCapId);
		copyExamination(srcCapId, targetCapId);
		var currentUserID = aa.env.getValue("CurrentUserID");
		copyRenewCapDocument(srcCapId, targetCapId, currentUserID);
	}
}

function copyPrimContactByType(pFromCapId, pToCapId, pContactType)
{
	//Copies all contacts from pFromCapId to pToCapId
	//where type == pContactType
	if (pToCapId==null)
		var vToCapId = capId;
	else
		var vToCapId = pToCapId;
	
	var capContactResult = aa.people.getCapContactByCapID(pFromCapId);
	var copied = 0;
	if (capContactResult.getSuccess())
	{
		var Contacts = capContactResult.getOutput();
		for (yy in Contacts)
		{   var capContactModel = Contacts[yy].getCapContactModel();
			if(capContactModel.getContactType() == pContactType && capContactModel.getPrimaryFlag() == "Y")
			{
			    var newContact = Contacts[yy].getCapContactModel();
			    newContact.setCapID(vToCapId);
			    aa.people.createCapContact(newContact);
			    copied++;
			    logDebug("Copied primary " + pContactType + " from "+pFromCapId.getCustomID()+" to "+vToCapId.getCustomID());
			}
		}
	}
	else
	{
		logMessage("**ERROR: Failed to get contacts: " + capContactResult.getErrorMessage()); 
		return false; 
	}
	
	if(copied > 0) return true;
	return false;
} 

/**
 * copy record details from capIdFrom to capIdTo
 * @param capIdFrom copy from
 * @param capIdTo copy to
 * @returns {Boolean}
 */
function copyRecordDetailsLocal(capIdFrom, capIdTo) {
	aa.cap.copyCapDetailInfo(capIdFrom, capIdTo);
	aa.cap.copyCapWorkDesInfo(capIdFrom, capIdTo);
	return true;
}
//Returns how many times a task was resulted with the same status
function countOfTaskStatus(wfTask, wfTaskStatus) {
	var count = 0;
	
	itemCap = capId;
	if (arguments.length == 3) itemCap = arguments[2];
	
    wfObj = aa.workflow.getHistory(itemCap).getOutput();

    for (var x = 0; x < wfObj.length; x++) {
        if (wfObj[x].disposition == wfTaskStatus && wfObj[x].getTaskDescription() == wfTask) {
            count++;
        }
    }
    return count;
}

function createAndAssignPendingInspection(inspectionGroupCode, inspectionTypeForestryInspection) {
    createPendingInspection(inspectionGroupCode, inspectionTypeForestryInspection);
    var assignedStaff = getAssignedStaff();
    var inspectionID = getPendingInspectionID();

    if (inspectionID != null && inspectionID != "" && assignedStaff != null && assignedStaff != "")
        assignInspection(inspectionID, assignedStaff);
}
function createAPOfromMultipleParcelsTable() {
	//Get parcels from ASIT and add to record APO
	//Adds associated addresses and owner(s), sets all to Primary="No"
	//Call from CTRCA for ACA
	try {
		//aa.print("Inside createAPOfromMultipleParcelsTable1");
		var boolFound = false;
		var currentAddresses = new Array();
		var newLength = 0;
		var addrFound = false;

		loadASITables();
		if (typeof (MULTIPLEPARCELS) == "object") {
			var primeParcel = getPrimaryParcel();

			for (xxx in MULTIPLEPARCELS) {
				var myParcelId = MULTIPLEPARCELS[xxx]["Parcel"];
				myParcelId = String(myParcelId).trim();
				logDebug("1) Adding from MULTIPLE PARCELS #" + myParcelId);
				//aa.print("Adding from MULTIPLE PARCELS #" + myParcelId);

				if (String(myParcelId) != String(primeParcel)) {
logDebug("2) Adding from MULTIPLE PARCELS #" + myParcelId);
					// Add Parcel from reference
					addParcelFromRef(myParcelId);
					boolFound = true;
					addrFound = false;

					//Get Address based on Parcel
					var addrObj = aa.address.getAddressListForAdmin(myParcelId, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
							null, null);
					if (addrObj.getSuccess()) {
						var addrArr = addrObj.getOutput();

						//grab first address (changing from addrArr.length==1)
						if (addrArr != null && addrArr.length > 0) {
							var addr = addrArr[0].getRefAddressModel();

							// check for duplicates
							var refAddressId = addr.getRefAddressId();
							//aa.print( "getRefAddressId = " + refAddressId);

							if (newLength > 0) // not first time around
							{
								// check if ref address already added
								for (i = 0; i < newLength; i++) {
									if (currentAddresses[i] == refAddressId) {
										addrFound = true;
										//aa.print("Found previous address: " + refAddressId);
									}
								}
							}
							if (!addrFound) //if not duplicate, add to record
							{
								newLength = currentAddresses.push(refAddressId);

								//Set to not primary
								addr.setPrimaryFlag("N");

								//Add reference Address to record
								//aa.print("Adding Address to record");
								aa.address.createAddressWithRefAddressModel(capId, addr);
							}
						} else {
							logDebug("Not found address for parcel Id: " + myParcelId);
							//aa.print("Not found address for parcel Id: " + myParcelId);
						}
					}
				}
			} //end for

			// Now the Owners
			//copyUniqueOwnersByParcel();
			updateCapOwnersByParcel();
		}
		return boolFound;
	} catch (err) {
		comment("A JavaScript Error occurred:  Custom Function: createAPOfromMultipleParcelsTable: " + err.message);
	}
}
/*
* EASY WAY TO CREATE AsiTableValObjs
    row = createAsiTableValObjs([
        { columnName: 'Abatement #', fieldValue: capIDString, readOnly: 'N' },
        { columnName: 'Type', fieldValue: AInfo['Abatement Type'], readOnly: 'N' }
    ]);)
*/
function createAsiTableValObjs(columnArray) {
    var asiCols = [];
    for(var idx in columnArray) {
        asiCols[columnArray[idx].columnName] = new asiTableValObj(
            columnArray[idx].columnName, 
            columnArray[idx].fieldValue, 
            columnArray[idx].readOnly
        ); 
    }
    return asiCols
}


function createAutoInspection(tasksToCheck) {
	logDebug("createAutoInspection() started");
	var taskResult = aa.workflow.getTaskItems(capId, null, null, "Y", null, null);
	if (taskResult.getSuccess()) {
		var taskArr = taskResult.getOutput();
	} else {
		logDebug("**ERROR: getting tasks : " + taskResult.getErrorMessage());
		return false;
	}

	var inspGroup = "BLD_NEW_CON";
	var inspArray = [];
	getPendingInspections(inspArray);

	var taskNameInspectionTypeMap = new Array();
	taskNameInspectionTypeMap["Mechanical Plan Review"] = "Mechanical Final,Mechanical Rough";
	taskNameInspectionTypeMap["Electrical Plan Review"] = "Electrical Final,Electrical Rough";
	taskNameInspectionTypeMap["Plumbing Plan Review"] = "Plumbing Final,Plumbing Rough";
	taskNameInspectionTypeMap["Structural Plan Review"] = "Framing Final,Framing Rough";

	for (xx in taskArr) {
		if (taskArr[xx].getCompleteFlag().equals("Y") && String(taskArr[xx].getDisposition()).equalsIgnoreCase("Approved")) {
			//if taskArr[x] is required to be checked 
			for (t in tasksToCheck) {
				if (String(taskArr[xx].getTaskDescription()).equalsIgnoreCase(tasksToCheck[t])) {
					//get the inspection types to check exist (Pending)
					var inspectionsToCheck = taskNameInspectionTypeMap[tasksToCheck[t]];
					inspectionsToCheck = inspectionsToCheck.split(",");

					//check both types if has pending and add one if not
					if (inspArray[inspectionsToCheck[0]] == 0) {
						createPendingInspection(inspGroup, inspectionsToCheck[0]);
					}
					if (inspArray[inspectionsToCheck[1]] == 0) {
						createPendingInspection(inspGroup, inspectionsToCheck[1]);
					}
					break;
				}//task is one of required
			}//for all tasks to check
		}//Approved task
	}//for all tasks on cap
	logDebug("createAutoInspection() ended");
}

function createChildAbatement(iType, iResult, schedIType, setFieldValue)
{
    if (inspType == iType && inspResult == iResult)
    {
        logDebug("function createChildAbatement criteria met:  inspection type = " + iType + " and result = " + iResult);
        
        var currentCapId = capId;
        var appName = "Abatement created for Record Number " + capId.customID;
        var newChildCapId = createChild('Enforcement','Incident','Abatement','NA',appName);
        var appHierarchy = aa.cap.createAppHierarchy(capId, newChildCapId);
        copyRecordDetailsLocal(capId, newChildCapId);
        copyContacts(capId, newChildCapId);
        copyAddresses(capId, newChildCapId);
        copyParcels(capId, newChildCapId);
        copyOwner(capId, newChildCapId);
        
        // get the inspector from GIS and assign the rec to this user
        inspUserObj = null;
        x = getGISBufferInfo("AURORACO","Code Enforcement Areas","0.01","OFFICER_NAME");
		if(x[0]){
            logDebug(x[0]["OFFICER_NAME"]);
            
            var offFullName = x[0]["OFFICER_NAME"];
            
            var offFname = offFullName.substr(0,offFullName.indexOf(' '));
            logDebug(offFname);
            
            var offLname = offFullName.substr(offFullName.indexOf(' ')+1);
            logDebug(offLname);
            
            inspUserObj = aa.person.getUser(offFname,null,offLname).getOutput();
		}
		
        if(inspUserObj != null)
        { assignCap(inspUserObj.getUserID(), newChildCapId); }

		var newInspId = scheduleInspectionCustom4CapId(newChildCapId, schedIType,0, currentUserID);
		
		if(newInspId){
            var clItemStatus2Copy = ["Abate/Record", "Abate/Summons", "Abate"];
		
            if(clItemStatus2Copy.length > 0) copyCheckListByItemStatus(inspId, newInspId, clItemStatus2Copy, capId, newChildCapId);
		}
    
        editAppSpecific("Abatement Type", setFieldValue, newChildCapId); 

    }
}

/**
 * 
 * @param workflowTask work flow task that need to be checked
 * @param worflowStatus work flow status that need to be checked
 * @param LicenseType 4 levels for the license record to be created 
 * @param emailTemplate email template
 * @param reportName report name    
 * @param rptParams report param if exists
 */
function createArboristLicenseAndCopyDataAndSendEmail(LicenseType, emailTemplate, reportName, rptParams) {
    logDebug("createArboristLicenseAndCopyDataAndSendEmail() Started");
    try{
        var applicantEmail = "";
        var licTypeArray = LicenseType.split("/");
        var appName = cap.getSpecialText();
        var createdApp = aa.cap.createApp(licTypeArray[0], licTypeArray[1], licTypeArray[2], licTypeArray[3], appName);
        
        if (!createdApp.getSuccess()) {
            logDebug("**ERROR creating app failed, error: " + createdApp.getErrorMessage());
        }
        
        createdApp = createdApp.getOutput();
        logDebug("Creating Parent License : " + createdApp.getCustomID());
        //add as parent:
        var related = aa.cap.createAppHierarchy(createdApp, capId);
        if (!related.getSuccess()) {
            logDebug("**ERROR createAppHierarchy failed, error: " + related.getErrorMessage());
        }
        if (createdApp != null) {
            copyContacts(capId, createdApp);
            copyAppSpecific(createdApp);
            var rNewLicIdString = createdApp.getCustomID();
            
            updateAppStatus("Issued", "Issued via script", createdApp);
            
            vExpDate = new Date();
            vNewExpDate = new Date(vExpDate.getFullYear(), 11, 31);
            
            createRefLP4Lookup(rNewLicIdString, "Arborist", "Arborist Applicant", null);
            var rNewLP = aa.licenseScript.getRefLicensesProfByLicNbr(aa.serviceProvider, rNewLicIdString).getOutput();
            if(rNewLP) {
                var theRefLP = rNewLP[0];
                aa.licenseScript.associateLpWithCap(createdApp, theRefLP);
                theRefLP.setLicenseExpirationDate(aa.date.getScriptDateTime(vNewExpDate));
                var editRefResult = aa.licenseScript.editRefLicenseProf(theRefLP);
            }
                
                var rB1ExpResult = aa.expiration.getLicensesByCapID(createdApp).getOutput();
                rB1ExpResult.setExpDate(aa.date.getScriptDateTime(vNewExpDate));
                rB1ExpResult.setExpStatus("Active");
                aa.expiration.editB1Expiration(rB1ExpResult.getB1Expiration());
            
            var recordApplicant = getContactByType("Arborist Applicant", capId);
            if (recordApplicant) {
                applicantEmail = recordApplicant.getEmail();
            }
            if (applicantEmail == null || applicantEmail == "") {
                logDebug("**WARN Applicant on record " + capId + " has no email");
        
            } else {
        
                var emailParams = aa.util.newHashtable();
                addParameter(emailParams, "$$altID$$", rNewLicIdString);
                //addParameter(emailParams, "$$recordAlias$$", cap.getCapModel().getCapType().getAlias());
                //addParameter(emailParams, "$$recordStatus$$", cap.getCapModel().getCapStatus());
                //addParameter(emailParams, "$$wfComment$$", wfComment);
                //addParameter(emailParams, "$$wfTask$$", wfTask);
                //addParameter(emailParams, "$$wfStatus$$", wfStatus);
        
                //sendEmailWithReport(applicantEmail, "", emailTemplate, reportName, rptParams, emailParams)
                emailContacts("Arborist Applicant",emailTemplate, emailParams, reportName,rptParams);
        
            }
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function createArboristLicenseAndCopyDataAndSendEmail(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function createArboristLicenseAndCopyDataAndSendEmail(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("createArboristLicenseAndCopyDataAndSendEmail() ended");
}//END

/*
* CREATES CHILD RECORDS

    OPTIONS: TONS OF OPTIONS AVAILABLE FOR MAKING THE CHILD RECORD 
*/
function createChildGeneric(grp, type, stype, cat, options) { 
    var settings = {
        parentCapID: capId,
        appName: null,
        capClass: "INCOMPLETE CAP",
        createAsTempRecord: false,
        accessByACA: false,
        copyParcels: false,
        copyAddresses: false,   
        copyOwner: false,
        copyContacts: false,
        customFields: []    // array of key/val objects { key: "Awesome_Guy", val: "Charlie" }
    };
    //optional params - overriding default settings
    for (var attr in options) { settings[attr] = options[attr]; }

    var childCapId;
    
    if(settings.createAsTempRecord) {
        var emptyCm = aa.cap.getCapModel().getOutput();
        var emptyCt = emptyCm.getCapType();
        emptyCt.setGroup(grp); 
        emptyCt.setType(type); 
        emptyCt.setSubType(stype);
        emptyCt.setCategory(cat);
        emptyCm.setCapType(emptyCt);
        childCapId = aa.cap.createSimplePartialRecord(emptyCt, settings.appName, settings.capClass).getOutput();
    } else {
        childCapId = createChild(grp, type, stype, cat, settings.appName); 
    }
    
    aa.cap.createAppHierarchy(settings.parentCapID, childCapId);

    if(settings.accessByACA) {
        aa.cap.updateAccessByACA(childCapId, "Y");
    }

    if(settings.copyParcels) {
        copyParcels(settings.parentCapID, childCapId);
    }

    if(settings.copyAddresses) {
        copyAddresses(settings.parentCapID, childCapId);
    }

    if(settings.copyOwner) {
        copyOwner(settings.parentCapID, childCapId);
    }

    if(settings.copyContacts) {
        copyContacts(settings.parentCapID, childCapId);
    }

    for(var idxCF in settings.customFields) {
        var objCF = settings.customFields[idxCF];
        editAppSpecific(objCF.key, objCF.val, childCapId);
    }

    return childCapId;  

 }
 
/* Script 337 
 *
 * Create water permit child.
 *
 */
function createChildWaterUtilityPermitRecords() {
    logDebug("createChildWaterUtilityPermitRecords() started");
    try {
        var $iTrc = ifTracer;
        if ($iTrc(wfTask == "Fire Life Safety Review" && wfStatus == "Approved", 'wfTask == "Fire Life Safety Review" && wfStatus == "Approved"')) {
            var tsiArray = new Array();
            loadTaskSpecific(tsiArray);
            var pFireLine = tsiArray["Is there a private fire line?"];
            var NoOfFireLines = tsiArray["Number of Fire Lines"];
            logDebug("pFireLine: "+ pFireLine);
            logDebug("NoOfFireLines: " + NoOfFireLines);
            
            if ($iTrc(pFireLine == "Yes" && (NoOfFireLines != null && parseInt(NoOfFireLines) > 0), 'pFireLine == "Yes" && (NoOfFireLines != null && parseInt(NoOfFireLines) > 0)')) {

                for (var i = 0; i < parseInt(NoOfFireLines); i++) {
                    var cCapId = createChild("Water", "Utility", "Permit","NA", "Water Utility Permit"); // this function
                                                            // copies address,
                                                            // parcel,and
                                                            // contact
                                                            // information
                    if ($iTrc(cCapId, 'cCapId')) {
                        logDebug("Created Child " + cCapId.getCustomID());
                        // copy Owner
                        copyOwner(capId, cCapId);
                        editAppSpecific("Utility Permit Type", "Private Fire Lines",cCapId);
                    }
                }
            }
        }
    } catch (e) {
        logDebug("****ERROR IN WTUA:BUILDING/PERMIT/NEW BUILDING/NA:**** " + e);
    }
    logDebug("createChildWaterUtilityPermitRecords() ended");
}//END createChildWaterUtilityPermitRecords()
function createLicenseCoA(initStatus, copyASI, licWfTask, licWfStatus){
    logDebug("createLicenseCoA() started.");
    try{
        var vParentArry;
        var vLicenseCapID;
        var tmpCap;
        var vParentLicType;
        var vParentLicTypeString;
        var vLicenseObj;

        vParentLicTypeString = appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/" + "License";
        vParentLicType = "License";

        //Check if the record already has a parent of the correct type.
        //The correct type has the same top three levels of the record type
        //hierarchy as the current record but the fourth level is
        //'License' instead of 'Application'.
        //If no license exists create one.
        //
        vParentArry = getParents(vParentLicTypeString);
        if (vParentArry != null && vParentArry != "") {
            vLicenseCapID = vParentArry[0];
        } else if (appTypeArray[3] == "Application") {
            vLicenseCapID = createParent(appTypeArray[0], appTypeArray[1], appTypeArray[2], vParentLicType, getAppName(capId));
        }

        //If the current record is an application record and the parent license
        //record does not exist or the current record is a renewal record and
        //the parent license does exist then update the license records info
        if (appTypeArray[3] == "Application" && (vParentArry == null || vParentArry == "")) {
            //Copy Parcels from child to license
            copyParcels(capId, vLicenseCapID);

            //Copy addresses from child to license
            copyAddress(capId, vLicenseCapID);

            //Copy ASI from child to license
            copyASIInfo(capId, vLicenseCapID);

            //Copy ASIT from child to license
            copyASITables(capId, vLicenseCapID);

            //Copy Contacts from child to license
            copyContacts3_0(capId, vLicenseCapID);

            //Copy Work Description from child to license
            aa.cap.copyCapWorkDesInfo(capId, vLicenseCapID);

            //Copy application name from child to license
            editAppName(getAppName(capId), vLicenseCapID);

            //Activate the license records expiration cycle
            vLicenseObj = new licenseObject(null, vLicenseCapID);
            vLicenseObj.setStatus("Active");
            thisLicExpOb = vLicenseObj.b1Exp
            expUnit = thisLicExpOb.getExpUnit()
            expInt = thisLicExpOb.getExpInterval()
            if (expUnit == "MONTHS") {
                newExpDate = dateAddMonths(null, expInt);
                }
            vLicenseObj.setExpiration(newExpDate);

            var processCode = getWfProcessCodeByCapId(vLicenseCapID);
            updateTask(licWfTask, licWfStatus, "Issued via EMSE", "Issued via EMSE", processCode, vLicenseCapID);

            logDebug("createLicenseCoA() ended. Created lic: " + vLicenseCapID.getCustomID());
            return vLicenseCapID;
        }
        else{
            logDebug("createLicenseCoA() ended. A parent license was found. Lic Already exists: " + vLicenseCapID.getCustomID())
            return vLicenseCapID;
        }
        logDebug("createLicenseCoA() ended with false.");
        return false;
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function createLicenseCoA(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function createLicenseCoA(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("createLicenseCoA() ended.");
}//END createLicenseCoA()
function createMPTableFromParcels() {
	try {
		myDebug = false;
		if (myDebug)
			aa.print("Starting createTableFromParcels()...");
		var tableName = "MULTIPLE PARCELS";
		var col1 = "Parcel";
		var readOnlyFlag = "Y"

			// build table arrays
			var parcelTable = new Array();

		// add row for each parcel
		var parcels = aa.parcel.getParcelDailyByCapID(capId, null);
		if (parcels.getSuccess()) {
			parcels = parcels.getOutput();
			if (parcels == null || parcels.length == 0) {
				logDebug("No parcels available for this record");
				if (myDebug)
					aa.print("No parcels available for this record");
			} else {
				for (cnt in parcels) {
					if (parcels[cnt].getPrimaryParcelFlag() == "N") //do not include the primary parcel fro ACA display
					{
						if (myDebug)
							aa.print("Adding parcel: " + parcels[cnt].getParcelNumber());
						var columnRow = new Array();
						columnRow[col1] = new asiTableValObj(col1, parcels[cnt].getParcelNumber(), readOnlyFlag);
						parcelTable.push(columnRow);
					}
				}
			}
		}

		//  verify out table arrays

		if (myDebug) {
			for (x in parcelTable) {
				for (y in parcelTable[x])
					aa.print("test Output: Table[" + x + "]: " + y + " = " + parcelTable[x][y]);
			}
		}

		// replace table with new table arrays
		if (myDebug)
			aa.print("** Updating ASI Table");
		removeASITable(tableName);
		addASITable(tableName, parcelTable);
	} catch (err) {
		if (myDebug)
			aa.print("A JavaScript Error occurred: function createMPTableFromParcels: " + err.message);
		logDebug("A JavaScript Error occurred: function createMPTableFromParcels: " + err.message);
	}
}

function createParcelesAndOwners(){
	// add Parcel and Owner data	
	var primaryAddress=aa.address.getPrimaryAddressByCapID(capId,"Y");
		if (primaryAddress.getSuccess()){
			var refAddress=primaryAddress.getOutput();
			var refID=refAddress.getRefAddressId();
			addParcelAndOwnerFromRefAddress(refID,capId);
			
		}
}

/**
 * * If paid in full, Create a parent license, copy the ASI's, and email the applicant
 * @param emailTemplate
 * @returns {void} 
 */

function createParentLicenseOnPRA(emailTemplate) {
    if (balanceDue == 0) {
        // Create a parent license, and copy ASI's
        var newLicId = createParent(appTypeArray[0], appTypeArray[1], "License", appTypeArray[3], null, capId);
        if (newLicId != null) {
            copyASIFields(capId, newLicId);
            // Set expiration date
            var expDate = calcExpDate(new Date());
            var expResult = aa.expiration.getLicensesByCapID(newLicId).getOutput();
            expResult.setExpDate(expDate);
            expResult.setExpStatus("Active");
            aa.expiration.editB1Expiration(expResult.getB1Expiration());

            // Send Email
            sendEmail(emailTemplate);
        }
    }
}

/**
 * create parent record, copy data from child, and create/update refLicense using Contact, then associate it to parent record
 * @param workFlowTask
 * @param workflowStatusArray
 * @param contactType contact to use in LP create/update
 * @param addressType address to use in LP create/update
 * @param licenseType LP type to create/update
 * @param seqType sequence type
 * @param seqName sequence name
 * @param maskName mask name
 * @returns {Boolean}
 */
function createParentLicenseRecord(workFlowTask, workflowStatusArray, contactType, addressType, licenseType, seqType, seqName, maskName) {
	if (wfTask == workFlowTask) {

		var statusMatch = false;

		for (s in workflowStatusArray) {
			if (wfStatus == workflowStatusArray[s]) {
				statusMatch = true;
				break;
			}
		}//for all status options

		if (!statusMatch) {
			return false;
		}

		//create parent app:
		var appName = cap.getSpecialText();
		var createdApp = aa.cap.createApp("Licenses", "Professional", "License", "NA", appName);
		if (!createdApp.getSuccess()) {
			logDebug("**ERROR creating app failed, error: " + createdApp.getErrorMEssage());
			return false;
		}
		createdApp = createdApp.getOutput();

		//add as parent:
		var related = aa.cap.createAppHierarchy(createdApp, capId);
		if (!related.getSuccess()) {
			logDebug("**ERROR createAppHierarchy failed, error: " + related.getErrorMEssage());
			return false;
		}

		//copy data:
		copyContacts(capId, createdApp);
		copyAppSpecific(createdApp);

		var licenseNbr = null;
		var contact = getContactByType(contactType, capId);
		aa.print(contactType + " " + contact);

		//contact required exist on child (current) record
		if (contact) {
			//Calculate Expiration Date = date of issuance + 3 years...
			var expirationDate = dateAddMonths(wfDateMMDDYYYY, 36);
			expDateArray = expirationDate.split("/");
			if (expDateArray[0] == "02") {
				expirationDate = leftPadding(expDateArray[0]) + "/28/" + expDateArray[2];
			} else {
				expirationDate = leftPadding(expDateArray[0]) + "/" + leftPadding(new Date(expDateArray[2], expDateArray[0], 0).getDate()) + "/" + expDateArray[2];
			}

			var licensesByName = aa.licenseScript.getRefLicensesProfByName(aa.serviceProvider, contact.getFirstName(), contact.getMiddleName(), contact.getLastName());

			if (licensesByName.getSuccess()) {
				licensesByName = licensesByName.getOutput();

				if (licensesByName != null && licensesByName.length > 0) {
					licenseNbr = licensesByName[0].getStateLicense();
				}
			}

			if (licenseNbr == null) {
				licenseNbr = getNextSequence(seqType, seqName, maskName);
			}

			//this edits or adds Ref-LP
			createRefLP4Lookup(licenseNbr, licenseType, contactType, addressType);
			var theRefLP = aa.licenseScript.getRefLicensesProfByLicNbr(aa.serviceProvider, licenseNbr).getOutput();

			if (theRefLP != null && theRefLP.length > 0) {
				theRefLP = theRefLP[0];
				aa.licenseScript.associateLpWithCap(createdApp, theRefLP);
				theRefLP.setLicenseExpirationDate(aa.date.parseDate(expirationDate));
				var editRefResult = aa.licenseScript.editRefLicenseProf(theRefLP);

				rB1ExpResult = aa.expiration.getLicensesByCapID(rNewLicId).getOutput();
				rB1ExpResult.setExpDate(aa.date.parseDate(expirationDate));
				aa.expiration.editB1Expiration(rB1ExpResult.getB1Expiration());
			}
		} else {//contact required exist on child (current) record
			logDebug("**WARN contact of type : " + contactType + " not found on record");
		}
	} else {
		return false;
	}
	return true;
}

/**
returns next value of mask/sequence provided
* @param seqType from system Sequence generator (type of seq/mask)
*/

function createPendingInspBuilding() {
	var asiValues = new Array();
	   if (useAppSpecificGroupName) {
		   var olduseAppSpecificGroupName = useAppSpecificGroupName;
		   useAppSpecificGroupName = false;
		   loadAppSpecific(asiValues);
		   useAppSpecificGroupName = olduseAppSpecificGroupName;
	   } else {
		   asiValues = AInfo;
	   }
	   
	  
   var permitType = asiValues["Permit Fee Type"];
    
   logDebug ("Permit Type" + permitType );
   
   if (permitType == "Gas Pipe Installation or Modification" || permitType == "Furnace Replacement" || permitType == "Furnace and Water Heater Replacement"
      || permitType == "Air Conditioner Replacement" || permitType == "Evaporative Cooler Replacement" || permitType == "Boiler Replacement" 
      || permitType == "Furnace and Air Conditioner" || permitType == "Rooftop Unit Replacement"
      || permitType == "Air Conditioner Furnace and Water Heater Replacement" || permitType == "Air Conditioner and Water Heater Replacement"
     )
   {
   createPendingInspection("BLD_NEW_CON", "Mechanical Final")
   }
   
   if (permitType == "Air Conditioner Replacement" || permitType == "Evaporative Cooler Replacement" || permitType == "Boiler Replacement" 
      || permitType == "Furnace and Air Conditioner" || permitType == "Rooftop Unit Replacement"
      || permitType == "Air Conditioner Furnace and Water Heater Replacement" || permitType == "Air Conditioner and Water Heater Replacement"
     )
   {
   createPendingInspection("BLD_NEW_CON", "ELectrical Final")
    } 
       
   if (permitType == "Water Heater Replacement" || permitType == "Boiler Replacement" || permitType == "Furnace and Water Heater Replacement"  
      || permitType == "Air Conditioner Furnace and Water Heater Replacement" || permitType == "Air Conditioner and Water Heater Replacement"
     )
   {
   createPendingInspection("BLD_NEW_CON", "Plumbing Final")
   } 
      
   if (permitType == "Siding Replacement")
   {
   createPendingInspection("BLD_NEW_CON", "Framing Final")
   } 
  
   if (permitType == "Commercial Roof Replacement" || permitType == "Single-Family Residential Roof Replacement")
   {
   createPendingInspection("BLD_NEW_CON", "Reroof Final")
   } 
  
   }
   

function createPPBMPRecord(workFlowTask, workflowStatusArray, asitNames) {
    logDebug("createPPBMPRecord() started");
    try{
        //In case the permit is issued from other event, we hard code the task and status.
        if(vEventName != "WorkflowTaskUpdateAfter"){
            logDebug("Event name is not WTUA");
            wfTask = "Permit Issud";
            wfStatus = "Complete";
        }
        //Print the condition to the debug to see if it's true;
        if (ifTracer(wfTask == workFlowTask, wfTask + " == " + workFlowTask)) {
        
            var statusMatch = false;
        
            for (s in workflowStatusArray) {
                if (wfStatus == workflowStatusArray[s]) {
                    statusMatch = true;
                    break;
                }
            }//for all status options
        
            if (!statusMatch) {
                logDebug("createPPBMPRecord() ended: no match");
                return false;
            }
        
            var childCapId = createChild("Water", "Water", "SWMP", "Permit", "");
            
            if(childCapId){
                copyOwner(capId, childCapId);
                copyAppSpecific(childCapId);
				editAppName(getAppName(capId), childCapId);
				aa.cap.copyCapWorkDesInfo(capId, childCapId);
				
				
                updateAppStatus("Issued", "", childCapId);
                var thirtyDaysAhead = nextWorkDay(dateAdd(null, 30));
                var days4Insp = days_between(aa.util.parseDate(dateAdd(null, 0)), aa.util.parseDate(thirtyDaysAhead));
        
                scheduleInspectionCustom4CapId(childCapId, "Routine Inspections", days4Insp);
                
                //update Renewal status and date
                var vExpDate = new Date();
                var vNewExpDate = new Date(vExpDate.getFullYear() + 1, vExpDate.getMonth(), vExpDate.getDate());
                var rB1ExpResult = aa.expiration.getLicensesByCapID(childCapId).getOutput();
                rB1ExpResult.setExpDate(aa.date.getScriptDateTime(vNewExpDate));
                rB1ExpResult.setExpStatus("Active");
                aa.expiration.editB1Expiration(rB1ExpResult.getB1Expiration());
                
                // var parents = getParents("PublicWorks/Civil Plan/Review/NA")
                // if(!parents || parents.length == 0){
                //     logDebug("**WARN no parents found for record, capId=" + capId + ", altId=" + capIDString);
                //     logDebug("createPPBMPRecord() ended: no parent");
                //     return ;
                // }
                // recordParentCapId = parents[0];
                for(var idx in asitNames) {
                    var tbl = loadASITable(asitNames[idx], capId);
                    if (!tbl) {
                        logDebug("Parent " + capId.getCustomID() + " has no " + asitNames[idx] + " table");
                        logDebug("createPPBMPRecord() ended: no ASIT On parent");
                        return ;
                    }
                    
                    addASITable(asitNames[idx], tbl, childCapId);
                }
           
            }
        } else {
            logDebug("createPPBMPRecord() ended: wfTask No Match");
            return false;
        }
        logDebug("createPPBMPRecord() ended");
        return true;
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function (). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function (). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
}
//Bld Script 332
function createPreCourtInvestigationInsp(){
	var $iTrc = ifTracer;
	logDebug("createPreCourtInvestigationInsp() started");
	var tsis = [];
    loadTaskSpecific(tsis);
    var preHearInspDte = tsis["Pre hearing inspection date"];
	var inspector = getInspectorID();
	
	if($iTrc(preHearInspDte, 'preHearInspDt')){
		var inspDaysAhead = days_between(aa.util.parseDate(dateAdd(null, 0)), aa.util.parseDate(preHearInspDte));
		scheduleInspection("Pre Court Investigation", inspDaysAhead, inspector, null, "Issue Summons");
	}
	
	logDebug("createPreCourtInvestigationInsp() ended");
}//END createPreCourtInvestigationInsp();
/**
 * 
 * @param workFLowTasktoBechecked work flow task to be checked
 * @param workFlowStatustoBeChecked work flow status to be checked 
 * @param inspectionType inspection type to be checked 
 * @param inspCheckList inspection check list
 * @param customField custom field
 * @param customFieldValue custom field value
 * @param PlantingRecordType  4 levels type to be created 
 */
/**
 * this function to create the record type and copy the related data
 * @param PlantingRecordType the 4 levels of the record type that needs to be create
 */
function createRecordAndCopyData(PlantingRecordType) {
	var plantingRecordStructure = PlantingRecordType.split("/");
	var appCreateResult = aa.cap.createApp(plantingRecordStructure[0], plantingRecordStructure[1], plantingRecordStructure[2], plantingRecordStructure[3], "");

	if (appCreateResult.getSuccess()) {
		var newId = appCreateResult.getOutput();
		copyAddresses(capId, newId);
		copyParcels(capId, newId);
		copyOwner(capId, newId);
		copyContacts(capId, newId);
	} else {
		logDebug("Unable to create planting record ex. : " + appCreateResult.getErrorMessage());
	}
}

/**
 * 
 * @param workFLowTasktoBechecked work flow task to be checked
 * @param workFlowStatustoBeChecked work flow status to be checked 
 * @param inspectionType inspection type to be checked 
 * @param inspCheckList inspection check list
 * @param customField custom field
 * @param customFieldValue custom field value
 * @param PlantingRecordType  4 levels type to be created 
 */
/**
 * this function to create the record type and copy the related data
 * @param PlantingRecordType the 4 levels of the record type that needs to be create
 * Updated script to only create child record once and only copy the Applicant and Project Owner.  This is for script 137
 */

function createRecordAndCopyInfo(appType, workflowTaskName, workflowStatus, tsiName, childRecord) {
for ( var i in appType) {
if (appMatch(appType[i])) {
    for ( var j in workflowStatus) {
        if (wfTask == workflowTaskName && wfStatus == workflowStatus[j]) {
            var attributes = {};
            loadTaskSpecific(attributes);
            if (attributes[tsiName] == "Yes") {
                var trafficRecordStructure = childRecord.split("/");
                var childRecs = getChildren(childRecord, capId);
                //if a child of type childRecord exist, then don't create the child record.
                if(childRecs && childRecs.length > 0) return ;
                
                var newId = createChild(trafficRecordStructure[0], trafficRecordStructure[1], trafficRecordStructure[2], trafficRecordStructure[3], "");
				//Remove all contacts
				removeContactsFromCap(newId);
				//Add only contacts required
				copyContactsByType(capId, newId, "Applicant");
				copyContactsByType(capId, newId, "Project Owner");
				
                copyOwner(capId, newId);

                //Set Application Name.
                var capDetails = aa.cap.getCap(capId).getOutput();
                var appName = capDetails.getSpecialText();
                var newCapModel = aa.cap.getCap(newId).getOutput().getCapModel();
                newCapModel.setSpecialText(appName);
                //aa.cap.editCapByPK(newCapModel);

                //Set Description = app name + description.
                var capView = aa.cap.getCapViewByID(capId).getOutput();
                var capDetailsDesc = capView.getCapWorkDesModel().getDescription();
                var workDescResult = aa.cap.getCapWorkDesByPK(newId);
                if (workDescResult.getSuccess()) {
                    var workDesObj = workDescResult.getOutput().getCapWorkDesModel();
                    workDesObj.setDescription(appName + " : " + capDetailsDesc);
                    aa.cap.editCapWorkDes(workDesObj);
                }
				
				//If Application Type is Traffic Impact, populate "Development Name" ASI field
				if (appMatch("PublicWorks/Traffic/Traffic Impact/NA",newId)) {
				    editAppSpecific("Development Name", appName,newId);
				}
				//If Application Type is Drainage, populate "Review Type" ASI field
				if (appMatch("PublicWorks/Drainage/NA/NA",newId)) {
					var revType = null;
					if (tsiName == "Is a Preliminary Drainage Letter required?"){
						var revType = "Preliminary Drainage Letter";
					}
					if (tsiName == "Is a Preliminary Drainage Report required?"){
						var revType = "Preliminary Drainage Report";
					}
					if (tsiName == "Is a Master Drainage Report required?"){
						var revType = "Master Drainage Report";
					}
				
					if (revType != null) {
						editAppSpecific("Review Type", revType,newId);
					}
				}
            }
        }
    }
}
}
}


/**
 * 
 * @param workFLowTasktoBechecked work flow task to be checked
 * @param workFlowStatustoBeChecked work flow status to be checked 
 * @param inspectionType inspection type to be checked 
 * @param inspCheckList inspection check list
 * @param customField custom field
 * @param customFieldValue custom field value
 * @param PlantingRecordType  4 levels type to be created 
 */
function createRecordbasedOnInspandWorkflow(workFLowTasktoBechecked, workFlowStatustoBeChecked, inspectionType, inspCheckList, customField, customFieldValue, PlantingRecordType) {
	if (wfTask == workFLowTasktoBechecked && wfStatus == workFlowStatustoBeChecked) {
		var inspectionList = aa.inspection.getInspections(capId).getOutput();
		for ( var i in inspectionList) {
			var inspObj = inspectionList[i];
			if (inspObj.getInspectionType().equalsIgnoreCase(inspectionType)) {
				var Insp = inspectionList[i].getIdNumber();
				var objeclist = getGuideSheetObjects(Insp);
				for ( var ob in objeclist) {

					if (objeclist[ob].gsType.equalsIgnoreCase(inspCheckList)) {
						objeclist[ob].loadInfo();
						if (objeclist[ob].info[customField] == customFieldValue) {
							createRecordAndCopyData(PlantingRecordType);

						}
					}
				}
			}

		}

	}
}

function createTempChild(appNameAppendix, utilityPermitType, emailTemplate) {
    var appName = cap.getSpecialText() + "-" + appNameAppendix;
    var ctm = aa.proxyInvoker.newInstance("com.accela.aa.aamain.cap.CapTypeModel").getOutput();
    ctm.setGroup("Water");
    ctm.setType("Utility");
    ctm.setSubType("Permit");
    ctm.setCategory("NA");

    createChildResult = aa.cap.createSimplePartialRecord(ctm, appName, "INCOMPLETE EST");
    if (createChildResult.getSuccess()) {
        childCapId = createChildResult.getOutput();
        aa.cap.createAppHierarchy(capId, childCapId);
        // Copy APO
        copyAddresses(capId, childCapId);
        copyParcels(capId, childCapId);
        copyOwner(capId, childCapId);
        // Copy contacts
        copyContacts(capId, childCapId);
        removeContactsFromCapByType(childCapId, "Agency Reviewer");
        // Update the child Utility Permit Type ASI
        editAppSpecific("Utility Permit Type", utilityPermitType, childCapId);
        editAppSpecific("Civil Plan number", capIDString, childCapId);
        // Send an email
        //sendEmail(emailTemplate);
        var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
        var reportFile = [];
        var emailCC = "";//Rest of contacts
        var emailTo = "";//Applicant
        var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
        acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
        var recordURL = getACARecordURL(acaURLDefault);
        var emailParams = aa.util.newHashtable();
        addParameter(emailParams, "$$altID$$", capId.getCustomID());
        addParameter(emailParams, "$$acaRecordUrl$$", recordURL);
        
        //Email All contacts except agency reviewer
        var contactArray = getPeople(capId);
        for(thisContact in contactArray) {
            var cont = contactArray[thisContact].getPeople();
            
            if(cont.contactType == "Applicant") emailTo = cont.getEmail();
            if(cont.contactType != "Applicant" && cont.contactType != "Agency Reviewer") emailCC += cont.getEmail() + ";";
        }

        if(emailTo && emailTo != null && emailTo != "" && emailTo != undefined){
            var sendResult = sendNotification("noreply@aurora.gov",emailTo,emailCC,emailTemplate,emailParams,reportFile,capID4Email);
            if (!sendResult) { logDebug("createTempChild: UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
            else { logDebug("createTempChild: Sent email notification to "+emailTo)}
        }
		
    } else {
        logDebug("**WARN creating a temporary child failed, error:" + sent.getErrorMessage());
    }
}





function createTempWaterChild(emailTemplate) {
    if (wfTask == "Plans Coordination" && wfStatus == "Approved") {
        var waterReviewTask = aa.workflow.getTask(capId, "Water Review").getOutput();
        var processID = waterReviewTask.getProcessID();
        var stepNumber = waterReviewTask.getStepNumber();

        var waterMainUtilityPermitTsiVal;
        var sanitarySewerUtilityPermitTsiVal;
        var publicStormSewerUtilityPermitTsiVal;
        var privateStormSewerUtilityPermitTsiVal;
        var stormWaterUtilityPermitRequiredTsiVal;
        var privateFireLineUtilityPermitTsiVal;

        // Get the "Water Review" TSI's
        var valDef = aa.taskSpecificInfo.getTaskSpecifiInfoByDesc(capId, processID, stepNumber, "Water Main Utility Permit").getOutput();
        if (valDef != null) waterMainUtilityPermitTsiVal = valDef.getChecklistComment();

        valDef = aa.taskSpecificInfo.getTaskSpecifiInfoByDesc(capId, processID, stepNumber, "Sanitary Sewer Permit").getOutput();
        if (valDef != null) sanitarySewerUtilityPermitTsiVal = valDef.getChecklistComment();

        valDef = aa.taskSpecificInfo.getTaskSpecifiInfoByDesc(capId, processID, stepNumber, "Public Storm Sewer Permit").getOutput();
        if (valDef != null) publicStormSewerUtilityPermitTsiVal = valDef.getChecklistComment();

        valDef = aa.taskSpecificInfo.getTaskSpecifiInfoByDesc(capId, processID, stepNumber, "Private Storm Sewer Permit").getOutput();
        if (valDef != null) privateStormSewerUtilityPermitTsiVal = valDef.getChecklistComment();

        valDef = aa.taskSpecificInfo.getTaskSpecifiInfoByDesc(capId, processID, stepNumber, "Storm Water Permit Required").getOutput();
        if (valDef != null) stormWaterUtilityPermitRequiredTsiVal = valDef.getChecklistComment();

        valDef = aa.taskSpecificInfo.getTaskSpecifiInfoByDesc(capId, processID, stepNumber, "Private Fire Line").getOutput();
        if (valDef != null) privateFireLineUtilityPermitTsiVal = valDef.getChecklistComment();

        // Create a child record based on the selected utility permit
        if (waterMainUtilityPermitTsiVal == "Yes") {
            createTempChild("Water Utility Main Permit", "Water Main Utility Permit", emailTemplate);
        }
        if (sanitarySewerUtilityPermitTsiVal == "Yes") {
            createTempChild("Sanitary Sewer Utility Permit", "Sanitary Sewer Permit", emailTemplate);
        }
        if (publicStormSewerUtilityPermitTsiVal == "Yes") {
            createTempChild("Public Storm Sewer Utility Permit", "Public Storm Sewer Permit", emailTemplate);
        }
        if (privateStormSewerUtilityPermitTsiVal == "Yes") {
            createTempChild("Private Storm Sewer Utility Permit", "Private Storm Sewer Permit", emailTemplate);
        }
      //  if (stormWaterUtilityPermitRequiredTsiVal == "Yes") {
        //    createTempChild("Storm Water Utility Permit", "Storm Water Permit", emailTemplate);
        //}   Storm water not icluded in script tracker 219
		
        if (privateFireLineUtilityPermitTsiVal == "Yes") {
            // For private fire line utility permit, create a child record for each fire line
            var privateFireLinesCount = 0;
            valDef = aa.taskSpecificInfo.getTaskSpecifiInfoByDesc(capId, processID, stepNumber, "Number of Private Fire Lines").getOutput();
            if (valDef != null) privateFireLinesCount = valDef.getChecklistComment();

            if (privateFireLinesCount > 0) {
                for (var i = 0; i < privateFireLinesCount; i++) {
                    createTempChild("Private Fire Line Utility Permit", "Private Fire Line Permit", emailTemplate);
                }
            }
        }
    }
}


function createTempWaterWetTapCopyDataAndSendEmail(emailTemplate) {

// Script 401
// 7/16//18 JHS

// 07/26/2018 SLS Chad - added ignore array, copyASITables, and removed ref to sendEmailByTemplateName and replaced with sendNotification

    var applicantEmail = "";
    var newTempRecordType = ["Water", "Water", "Wet Tap", "Application"];
    //create temp record:

    var ctm = aa.proxyInvoker.newInstance("com.accela.aa.aamain.cap.CapTypeModel").getOutput();
    ctm.setGroup(newTempRecordType[0]);
    ctm.setType(newTempRecordType[1]);
    ctm.setSubType(newTempRecordType[2]);
    ctm.setCategory(newTempRecordType[3]);
    createChildResult = aa.cap.createSimplePartialRecord(ctm, "", "INCOMPLETE EST");
    if (createChildResult.getSuccess()) {
        childCapId = createChildResult.getOutput();
        aa.cap.createAppHierarchy(capId, childCapId);
    }
    editAppSpecific("Application ID",capId.getCustomID());
    editAppSpecific("Utility Permit Number",capId.getCustomID(), childCapId);
    editAppSpecific("Civil Plan Number", AInfo["Civil Plan number"], childCapId);

    if (childCapId != null) {
        var rNewLicIdString = childCapId.getCustomID();
        copyAddress(capId, childCapId);
        copyParcels(capId, childCapId);
        copyOwner(capId, childCapId);
        copyContacts3_0(capId, childCapId);
        //copyDetailedDescription(capId,childCapId);
        editAppName(AInfo["Utility Permit Type"], childCapId);
        
        //var igArr = ["LIST OF SUBCONTRACTORS", "PRIVATE FIRE LINE MATERIAL", "PRIVATE STORM MATERIAL", "PUBLIC STORM MATERIAL", "SANITARY SEWER MATERIAL", "WATER MATERIAL"];
        //copyASITables( capId, childCapId, igArr );
        copyASITableByTName("SIZE", capId, childCapId);
        
        if(AInfo["Utility Permit Type"] == "Private Fire Line Permit") 
            copyASITableByTName("PRIVATE FIRE LINE MATERIAL", capId, childCapId);
        if(AInfo["Utility Permit Type"] == "Water Main Utility Permit") 
            copyASITableByTName("WATER MATERIAL", capId, childCapId);
        
        var recordApplicant = getContactByType("Developer", capId);
        if (recordApplicant) {
            applicantEmail = recordApplicant.getEmail();
        }
        if (applicantEmail == null || applicantEmail == "") {
            logDebug("**WARN Developer on record " + capId + " has no email");

        } else {
            var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
            var reportFile = [];
            acaURL = lookup("ACA_CONFIGS", "ACA_SITE");
            acaURL = acaURL.substr(0, acaURL.toUpperCase().indexOf("/ADMIN"));
            //acaURL += "/urlrouting.ashx?type=1005&module=Water&capId1=" + childCapId.getID1() + "&capId2=" + childCapId.getID2() + "&capId3=" + childCapId.getID3() + "&AgencyCode=" + aa.getServiceProviderCode();
            acaURL += "/urlrouting.ashx?type=1000&module=Water&capId1=" + childCapId.getID1() + "&capId2=" + childCapId.getID2() + "&capId3=" + childCapId.getID3() + "&AgencyCode=" + aa.getServiceProviderCode();
            var emailParams = aa.util.newHashtable();
            addParameter(emailParams, "$$deeplink$$", acaURL);
            addParameter(emailParams, "$$childAltID$$", childCapId.getCustomID());
            addParameter(emailParams, "$$AltID$$", capId.getCustomID());
            addParameter(emailParams, "$$asiChoice$$", AInfo["Utility Permit Type"]);
// took out ref to sendEmailByTemplateName per request on script 401 from Don Bates         
//          aa.document.sendEmailByTemplateName("", applicantEmail, "", emailTemplate, emailParams, new Array());
            var sendResult = sendNotification("noreply@aurora.gov",applicantEmail,"",emailTemplate, emailParams, reportFile, capID4Email);
            if (!sendResult) { logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
            else { logDebug("Sent Notification"); }
        }

    }

}


function dateAddHC(td, amt)
// perform date arithmetic on a string; uses the agency holiday calendar to test for business days
// td can be "mm/dd/yyyy" (or any string that will convert to JS date)
// amt can be positive or negative (5, -3) days
// if optional parameter #3 is present, use working days only
{

	var useWorking = false;
	if (arguments.length == 3)
		useWorking = true;

	if (!td) {
		dDate = new Date();
	}
	else {
		logDebug("trying to convert date...");
		dDate = convertDate(td);
	}
	logDebug("date: " + dDate);
	var i = 0;
	var failsafe = 0;
	if (useWorking){
		while (i < Math.abs(amt) && failsafe < 200) {
			if (amt > 0) {
				if (!checkHolidayCalendar(dDate)){
					dDate = convertDate(dateAdd(dDate,1));
					i++;
					failsafe++;
				}
				else {
					dDate = convertDate(dateAdd(dDate,1));
					failsafe++;
				}				
			} 
			else {
				if (!checkHolidayCalendar(dDate)){
					dDate = convertDate(dateAdd(dDate,-1));
					i++;
					failsafe++;
				}
				else {
					dDate = convertDate(dateAdd(dDate,-1));
					failsafe++;
				}
			}
		}
	}
	else{
		dDate.setDate(dDate.getDate() + parseInt(amt, 10));
	}
	return (dDate.getMonth() + 1) + "/" + dDate.getDate() + "/" + dDate.getFullYear();
}

function dateAddHC2(td, amt)
// perform date arithmetic on a string; uses the agency holiday calendar to test for business days
// td can be "mm/dd/yyyy" (or any string that will convert to JS date)
// amt can be positive or negative (5, -3) days
// if optional parameter #3 is present, use working days only
// 
// function corrected by SLS Eric Koontz
//     correctly adjust the target date to ensure that the date returned is a workind day
//     correctly handle a zero date adjustment 
{
   	var useWorking = false;
	if (arguments.length == 3)
		useWorking = true;

	if (!td) {
		dDate = new Date();
	}
	else {
		dDate = convertDate(td);
	}
	var i = 0;
	var nonWorking = false;
	var failsafe = 0;

	// incorporate logic that will increment the date without counting non-working days
	if (useWorking){
		while (i < Math.abs(amt) && failsafe < 600) {
			// handle positive date changes
			if (amt >= 0) {
				nonWorking = checkHolidayCalendar(dDate);
				if (!nonWorking){
					i++;
					failsafe++;
					dDate = convertDate(dateAdd(dDate,1));
				}
				else {
					failsafe++;
					dDate = convertDate(dateAdd(dDate,1));
				}				
			} 
			// handle negative date changes
			else {
				if (!checkHolidayCalendar(dDate)){
					dDate = convertDate(dateAdd(dDate,-1));
					i++;
					failsafe++;
				}
				else {
					dDate = convertDate(dateAdd(dDate,-1));
					failsafe++;
				}
			}
		}
		
		// we have identified the target date using the working calendar, now we need
		// to confirm that the target date is a working day
		nonWorking = checkHolidayCalendar(dDate);
		while (nonWorking) 
		{
			i++;
			failsafe++
			if (amt >= 0 ) {
				dDate = convertDate(dateAdd(dDate,1));
			}
			else{
				dDate = convertDate(dateAdd(dDate,-1));
			}
				nonWorking = checkHolidayCalendar(dDate);
		}
	}
	// ignore non-working days and simply use calendar days increment
	else{
		dDate.setDate(dDate.getDate() + parseInt(amt, 10));
	}
	return (dDate.getMonth() + 1) + "/" + dDate.getDate() + "/" + dDate.getFullYear();
}

function dateAddHC3(td, amt)
// perform date arithmetic on a string; uses the agency holiday calendar to test for business days
// td can be "mm/dd/yyyy" (or any string that will convert to JS date)
// amt can be positive or negative (5, -3) days
// if optional parameter #3 is present, use working days only
// 
// function corrected by SLS Eric Koontz
//     correctly adjust the target date to ensure that the date returned is a working day
//     correctly handle a zero date adjustment 
//
// chabged checkHolidayCalendar to checkHolidayCalendarIgnoreWeekends
{
   	var useWorking = false;
	if (arguments.length == 3)
		useWorking = true;

	if (!td) {
		dDate = new Date();
	}
	else {
		dDate = convertDate(td);
	}
	var i = 0;
	var nonWorking = false;
	var failsafe = 0;

	// incorporate logic that will increment the date without counting non-working days
	if (useWorking){
		while (i < Math.abs(amt) && failsafe < 600) {
			// handle positive date changes
			if (amt >= 0) {
				//skip this check, we want to schedule based on calendar days first
				//nonWorking = checkHolidayCalendarIgnoreWeekends(dDate);
				if (!nonWorking){
					i++;
					failsafe++;
					dDate = convertDate(dateAdd(dDate,1));
				}
				else {
					failsafe++;
					dDate = convertDate(dateAdd(dDate,1));
				}				
			} 
			// handle negative date changes
			else {
				if (!checkHolidayCalendarIgnoreWeekends(dDate)){
					dDate = convertDate(dateAdd(dDate,-1));
					i++;
					failsafe++;
				}
				else {
					dDate = convertDate(dateAdd(dDate,-1));
					failsafe++;
				}
			}
		}

		// we have identified the target date using the working calendar, now we need
		// to confirm that the target date is a working day
		nonWorking = checkHolidayCalendar(dDate);
		while (nonWorking) 
		{
			i++;
			failsafe++
			if (amt >= 0 ) {
				dDate = convertDate(dateAdd(dDate,1));
			}
			else{
				dDate = convertDate(dateAdd(dDate,-1));
			}
				nonWorking = checkHolidayCalendar(dDate);
		}
	}
	// ignore non-working days and simply use calendar days increment
	else{
		dDate.setDate(dDate.getDate() + parseInt(amt, 10));
	}
	return (dDate.getMonth() + 1) + "/" + dDate.getDate() + "/" + dDate.getFullYear();
}

// Deactivate task 'Certificate of Occupancy' if custom field, 'Certificate of Occupancy' is not checked
// Also, deativate it if Water Meter task is active
function deactCoOIfNotChecked(){
	var tmpUASGN = useAppSpecificGroupName;
    useAppSpecificGroupName=false;
    var cOO=getAppSpecific("Certificate of Occupancy",capId);
    useAppSpecificGroupName = tmpUASGN;
    if (cOO!="CHECKED" || isTaskActive("Water Meter")){
    	deactivateTask("Certificate of Occupancy");
    }
}

/**
 * deactivate a SD item
 * @param stdChoiceName
 * @param stdChoiceValue
 * @returns {Boolean}
 */
function deactivateSD(stdChoiceName, stdChoiceValue) {
	var bizDomainResult = aa.bizDomain.getBizDomainByValue(stdChoiceName, stdChoiceValue);

	if (!bizDomainResult.getSuccess()) {
		logDebug("bizDomainResult failed " + bizDomainResult.getErrorMessage());
		return false;
	}

	bizDomainResult = bizDomainResult.getOutput();
	if (bizDomainResult != null && bizDomainResult.getBizDomain().getAuditStatus() != "I") {//exist and active
		var bizModel = bizDomainResult.getBizDomain();
		bizModel.setAuditStatus("I");
		var edit = aa.bizDomain.editBizDomain(bizModel, "en_US");
		if (!edit.getSuccess()) {
			logDebug("SD edit failed, Error: " + edit.getErrorMessage());
			return false;
		}
		
		if(!activeRecsOnBizDomain(stdChoiceName)){
			activateSCRow(stdChoiceName, "Code Change");
		}
	}
	return true;
}

/**
* Delete ASIT rows data by rowID, format: Array[rowID]
**/
function deletedAppSpecificTableInfors(tableName, capIDModel, deleteIDsArray/** Array[rowID] **/)
{
	if (deleteIDsArray == null || deleteIDsArray.length == 0)
	{
		return;
	}
	
	var asitTableScriptModel = aa.appSpecificTableScript.createTableScriptModel();
	var asitTableModel = asitTableScriptModel.getTabelModel();
	var rowList = asitTableModel.getRows();
	asitTableModel.setSubGroup(tableName);
	for (var i = 0; i < deleteIDsArray.length; i++)
	{
		var rowScriptModel = aa.appSpecificTableScript.createRowScriptModel();
		var rowModel = rowScriptModel.getRow();
		rowModel.setId(deleteIDsArray[i]);
		rowList.add(rowModel);
	}
	return aa.appSpecificTableScript.deletedAppSpecificTableInfors(capIDModel, asitTableModel);
}	
/*
 This function finds the JSON file associated to the module of the record running. 
 The naming convention for the JSON is CONFIGURABLE_RULESET_[solution/module name], 
	for instance CONFIGURABLE_RULESET_LICENSES
 The JSON includes the scripts to be called by event for that solution/module, as an array.
 This function is called from every event Master Script. 
 Sample JSON:
 {
  "WorkflowTaskUpdateAfter": {
    "StandardScripts": [
      "STDBASE_RECORD_AUTOMATION",
      "STDBASE_INSPECTION_SCHEDULING",
      "STDBASE_SEND_CONTACT_EMAILS"
    ]
  },
  "ApplicationSubmitBefore": {
    "StandardScripts": [
      "STDBASE_RECORD_VALIDATION",
      "STDBASE_ADDRESS_VALIDATION",
      "STDBASE_PARCEL_VALIDATION"
    ]
  },
  "ApplicationSubmitAfter": {
    "StandardScripts": [
      "STDBASE_RECORD_AUTOMATION",
      "STDBASE_SEND_CONTACT_EMAILS"
    ]
  }
}
 */
 
function doConfigurableScriptActions(){
	var module = appTypeArray[0];
	
	rulesetName = "CONFIGURABLE_RULESET_" + module;
	rulesetName = rulesetName.toUpperCase();
	logDebug("rulesetName: " + rulesetName);
	
	 var configRuleset = getScriptText(rulesetName);
	 if (configRuleset == ""){
		 logDebug("No JSON file exists for this module.");
	 }else{
		var configJSON = JSON.parse(configRuleset);

	// match event, run appropriate configurable scripts
		settingsArray = [];
		if(configJSON[controlString]) {
			var ruleSetArray = configJSON[controlString];
			var scriptsToRun = ruleSetArray.StandardScripts;
			
			for (s in scriptsToRun){
				logDebug("doConfigurableScriptActions scriptsToRun[s]: " + scriptsToRun[s]);
				var script = scriptsToRun[s];
				var validScript = getScriptText(script);
				if (validScript == ""){
					logDebug("Configurable script " + script + " does not exist.");
				}else{
					eval(getScriptText(scriptsToRun[s]));
				}
			}
		}
	}
}
/*===========================================

Title : doesASITRowExist

Purpose : checks to see if a row exists with a specified column having a specified value

Author: Deanna Hoops		

Functional Area : ASIT,  custom list

Description : returns true if an ASIT exists of the given name that has a row with a 
	a column of the specified name having a value equal to the specified value

Reviewed By: DMH

Script Type : (EMSE, EB, Pageflow, Batch): EMSE

General Purpose/Client Specific : General

Client developed for : 

Parameters:
	tName - string. Name of table
	cName - string. Name of column
	cValue - string. Value that column should have 

=========================================== */
function doesASITRowExist(tName, cName, cValue) {
	//return false;
	// optional : capId
	itemCap = capId;
	if (arguments.length > 3)
		itemCap = arguments[3];
	try {
		tempASIT = loadASITable(tName, itemCap);
		if (tempASIT == undefined || tempASIT == null) return false;
		var rowFound = false;
		for (var ea in tempASIT) {
	 		var row = tempASIT[ea];
	                fv = "" + row[cName].fieldValue;
	                cValue = "" + cValue;
	                r = new RegExp("^" + cValue + "(.)*"); 
	
			if ((String(fv).match(r)) || (fv == cValue)) {
	 				return true;
	                                
	                }
		}
		return rowFound;
	}
	catch (err) { logDebug(err); return false; }
}
/*
Title : Forestry Record Application Submission Actions (ApplicationSubmitAfter,ConvertToRealCapAfter)

Purpose : Actions that need to occur upon submission of a Forestry record of any kind.

Author: Ali Othman
 
Functional Area : Parcel, Inspections, Custom Fields, Address, Records

Sample Call:
   doForestryPlantingRecordsApplicationSubmitActions("Forestry Site Review", "Tree Planting Intake", ["Add to List"], "Assigned status Plus Proactive", "Site Review","TREE INFORMATION");
   
Notes:
	
*/

function doForestryPlantingRecordsApplicationSubmitActions(inspectionTypeForestrySiteReview, workflowTask, workflowStatusArray, workflowComment, activateTaskName,treeInformaionCustomListName) {
   // scheduleForestryRequestPlantingSiteReview(inspectionTypeForestrySiteReview);
    closeTreePlantingIntakeTask(workflowTask, workflowStatusArray, workflowComment, activateTaskName);
    ////TODO:
    ///populateTreeInformationCustomList(treeInformaionCustomListName);
}





/*
Title : Forestry Record Application Submission Actions (ApplicationSubmitAfter,ConvertToRealCapAfter)

Purpose : Actions that need to occur upon submission of a Forestry record of any kind.

Author: Ali Othman
 
Functional Area : Parcel, Inspections, Custom Fields, Address, Records

Sample Call:
   doForestryRecordsApplicationSubmitActions("Forestry_Inspector_Assignments", "Tree Inspect", "Forestry Inspection");
   
Notes:
	
*/


function doForestryRecordsApplicationSubmitActions(stdForestryInspectorAssignments, inspectionGroupCode, inspectionTypeForestryInspection) {
    getPrimaryParcelAttributesAndUpdateCustomField(stdForestryInspectorAssignments);
    updateApplicationNameWithAddressInfo();
    //commented out due to duplicate functionality from Script 60
	//createAndAssignPendingInspection(inspectionGroupCode, inspectionTypeForestryInspection);
}











//Edit document name locally
function editDocumentName(vOrgDocumentName, vNewDocumentName) {
	var vDocumentList;
	var y;
	var vDocumentModel;
	var vDocumentName;
	var vSaveResult;
	
	vDocumentList = aa.document.getDocumentListByEntity(capId, "CAP");
	if (vDocumentList != null) {
		vDocumentList = vDocumentList.getOutput();
	}
	else {
		return false;
	}

	if (vDocumentList != null) {
		for (y = 0; y < vDocumentList.size(); y++) {
			vDocumentModel = vDocumentList.get(y);
			vDocumentName = vDocumentModel.getFileName();
			if (vDocumentName == vOrgDocumentName) {
				//edit document name in accela
				vDocumentModel.setFileName(vNewDocumentName);
				vSaveResult = aa.document.updateDocument(vDocumentModel);
				if (vSaveResult.getSuccess()) {
					logDebug("Renamed document " + vDocumentName + " to " + vNewDocumentName + vFileExtension);					
					return true;
				} else {
					logDebug("Failed to update report name");
					logDebug("Error: " + vSaveResult.getErrorMessage());
					return false;
				}
			}
		}
	}
	return false;
}
//Script 32
function editTaskDatesAndSendEmail(workFlowTask, meetingType, emailTemplateName) {
    logDebug('editTaskDatesAndSendEmail() started.');
    try{
        var calId = aa.env.getValue("CalendarID");
        var meetingId = aa.env.getValue("MeetingID");
        
        if (calId == null || calId == "" || meetingId == null || meetingId == "") {
            logDebug("**WARN no calendarId or MeetingId in session!, capId=" + capId);
            return false;
        }
        
        var meeting = aa.meeting.getMeetingByMeetingID(calId, meetingId)
        if (!meeting.getSuccess()) {
            logDebug("**WARN getMeetingByMeetingID failed capId=" + capId + "calendarId/MeetingId: " + calId + "/" + meetingId);
            return false;
        }
        meeting = meeting.getOutput();
        var startDate = meeting.getStartDate();
        if (!String(meeting.getMeetingType()).equalsIgnoreCase(meetingType)) {
            return false;
        }
        var meetingDate = aa.util.formatDate(startDate, "MM/dd/YYYY");
        
        var task = aa.workflow.getTask(capId, workFlowTask).getOutput();
        task.getTaskItem().setStatusDate(convertDate(meetingDate));
        task.getTaskItem().setDueDate(convertDate(meetingDate));
        var edit = aa.workflow.editTask(task);
        
        var applicant = getContactByType("Applicant", capId);
        if (!applicant || !applicant.getEmail()) {
            logDebug("**WARN no applicant found on or no email capId=" + capId);
            return false;
        }
        var cap = aa.cap.getCap(capId).getOutput();
        cap = cap.getCapModel();
        var toEmail = applicant.getEmail();
        var applicantName = applicant.getContactName();
        
        var respUserProp = [];
        
        var mgrProp = [];
        var caseMgr = getInspectorID();
        loadUserProperties(mgrProp, caseMgr);
        var eParams = aa.util.newHashtable();
        addParameter(eParams, "$$ContactFullName$$", applicantName);
        addParameter(eParams, "$$fileDate$$", fileDate);
        addParameter(eParams, "$$MeetingDate$$", meetingDate);
        addParameter(eParams, "$$MeetingResponceDate$$", dateAdd(meetingDate, 7, true));
        
        addParameter(eParams, "$$StaffPhone$$", mgrProp["PhoneNumer"]);
        addParameter(eParams, "$$StaffEmail$$", mgrProp["Email"]);
        addParameter(eParams, "$$Meeting.RespName$$", mgrProp["FullName"]);
        addParameter(eParams, "$$Meeting.RespDept$$", mgrProp["Department"]);
        
        var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
        var reportFile = [];
        var sendResult = sendNotification("noreply@aurora.gov",toEmail,"",emailTemplateName,eParams,reportFile,capID4Email);
        if (!sendResult) { logDebug("editTaskDatesAndSendEmail: UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
        else { logDebug("editTaskDatesAndSendEmail: Sent email notification meeting scheduled "+toEmail)}
        
        logDebug('editTaskDatesAndSendEmail() ended.');
        return true;
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function editTaskDatesAndSendEmail(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function editTaskDatesAndSendEmail(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
}//END 
function editWFTaskDueDatebyName(sName,stdTimeline, workingDays){
		var workflowResult = aa.workflow.getTaskItems(capId, "", "", null, null, null);
		if (workflowResult.getSuccess())
			wfObj = workflowResult.getOutput();
		else {
			logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage());
			return false;
		}

		var dueDate = "";
		if(workingDays) dueDate = dateAdd(null,stdTimeline, true);
		else dueDate = dateAdd(null,stdTimeline);
		
		for (i in wfObj) {
			var fTask = wfObj[i];
			if ((fTask.getTaskDescription().toUpperCase().indexOf(sName.toUpperCase())> 0)) {
				// the new due date value could be changed according to the returned value from the standard choice, for now assuming the value type "Date"
				wfObj[i].setDueDate(aa.date.parseDate(dueDate));
				var fTaskModel = wfObj[i].getTaskItem();
				var tResult = aa.workflow.adjustTaskWithNoAudit(fTaskModel);
				if (tResult.getSuccess())
					logDebug("Set Workflow Task: " + fTask.getTaskDescription() + " due Date " + aa.date.parseDate(dueDate));
				else {
					logMessage("**ERROR: Failed to update due date on workflow: " + tResult.getErrorMessage());
					return false;
				}
			}
		}
		return true;
}
function editWFTaskDueDateOnPlanReviewTimelines() {
    //Set workflow due date based on plan review timelines {
    var stdTimeline = 0;
    var civilPlanSheets = AInfo["Civil Plan Sheets"];
    var submittalNum = AInfo["Submittal Number"];
    var sigPlanSheets = AInfo["Signature Plan Sheets"];
    var verticalConst = AInfo["Vertical Construction/Short Review"];
    
    if(civilPlanSheets) civilPlanSheets = parseInt(civilPlanSheets);
    else civilPlanSheets = 0;
        
    if(sigPlanSheets) sigPlanSheets = parseInt(sigPlanSheets);
    else sigPlanSheets = 0;
    
    if(ifTracer(appMatch("PublicWorks/Civil Plan/Review/NA"), 'Civil Plan Review')){
        if(submittalNum){
            submittalNum = parseInt(submittalNum);
            if(ifTracer(submittalNum == 1, 'submittalNum == 1')){
                if(ifTracer(civilPlanSheets <= 39, 'civilPlanSheets <= 39')) stdTimeline = 15;
                if(ifTracer(civilPlanSheets >= 40 && civilPlanSheets <= 59, 'civilPlanSheets >= 40 && civilPlanSheets <= 59')) stdTimeline = 20;
                if(ifTracer(civilPlanSheets >= 60, 'civilPlanSheets >= 60')) stdTimeline = 25;
                
                if(ifTracer(AInfo["ASAP Project?"] == "Yes", 'ASAP Project')) stdTimeline = 10;
            }
            if(ifTracer(submittalNum == 2, 'submittalNum == 2')){
                if(ifTracer(civilPlanSheets <= 39, 'civilPlanSheets <= 39')) stdTimeline = 10;
                if(ifTracer(civilPlanSheets >= 40 && civilPlanSheets <= 59, 'civilPlanSheets >= 40 && civilPlanSheets <= 59')) stdTimeline = 15;
                if(ifTracer(civilPlanSheets >= 60, 'civilPlanSheets >= 60')) stdTimeline = 20;
            
            }
            if(ifTracer(submittalNum >= 3, 'submittalNum == 3')){
                if(ifTracer(sigPlanSheets <= 39, 'sigPlanSheets <= 39')) stdTimeline = 5;
                if(ifTracer(sigPlanSheets >= 40 && sigPlanSheets <= 59, 'sigPlanSheets >= 40 && sigPlanSheets <= 59')) stdTimeline = 10;
                if(ifTracer(sigPlanSheets >= 60, 'sigPlanSheets >= 60')) stdTimeline = 10;
            }
            if(ifTracer(submittalNum >= 2 && AInfo["ASAP Project?"] == "Yes", 'submittalNum >= 2 && AInfo["ASAP Project?"] == "Yes"')) stdTimeline = 5;
        }
        
        if(verticalConst == "Yes") stdTimeline = 5;
    }
    
    if(ifTracer(appMatch("PublicWorks/Civil Plan/Revision/NA"), 'Civil Plan Revision'))
        stdTimeline = 5;
    
    if(ifTracer(appMatch("PublicWorks/Drainage/NA/NA"), 'Drainage Record')){
        if(submittalNum){
            submittalNum = parseInt(submittalNum);
            if(ifTracer(submittalNum == 1, 'submittalNum == 1')) stdTimeline = 15;
            if(ifTracer(submittalNum == 2, 'submittalNum == 2')) stdTimeline = 10;
            if(ifTracer(submittalNum >= 3, 'submittalNum == 3')) stdTimeline = 5;
        }
    }

    if(stdTimeline > 0) editWFTaskDueDatebyName("review", stdTimeline, true); 
}

function findCivilConstructionPlanReviewTimeline(num, sheets) {
    logDebug("findCivilConstructionPlanReviewTimeline(" + num + "," + sheets + ")");
    var timeLineSC = "Civil Construction Plan Review Timelines";
    var bizDomScriptResult = aa.bizDomain.getBizDomain(timeLineSC);

    if (bizDomScriptResult.getSuccess()) {
        bizDomScriptArray = bizDomScriptResult.getOutput().toArray()
            for (var i in bizDomScriptArray) {
                var thisNum = bizDomScriptArray[i].getBizdomainValue().split(",")[0];
                if (num != thisNum) {
                    continue;
                }
                var rangeLow = bizDomScriptArray[i].getBizdomainValue().split(",")[1].split("-")[0];
                var rangeHigh = bizDomScriptArray[i].getBizdomainValue().split(",")[1].split("-")[1];

                if (sheets >= rangeLow && sheets <= rangeHigh) {
                    return parseInt(bizDomScriptArray[i].getDescription());
                }
            }
    }
}

/*
emailAsync - parallel function for emailContacts when you have actual email addresses instead of contact types
  Required Params:
     sendEmailToAddresses = comma-separated list of email addresses, no spaces
     emailTemplate = notification template name
  Optional Params: (use blank string, not null, if missing!)
     vEParams = parameters to be filled in notification template
     reportTemplate = if provided, will run report and attach to record and include a link to it in the email
     vRParams  = report parameters
     manualNotificationList = comma-separated list of contact names without email to be listed in Manual Notification adhoc task
     changeReportName = if using reportTemplate, will change the title of the document produced by the report from its default

Sample: emailAsync('gephartj@seattle.gov', 'DPD_WAITING_FOR_PAYMENT'); //minimal
        emailAsync('gephartj@seattle.gov,joe@smith.com', 'DPD_PERMIT_ISSUED', "", 'Construction Permit', paramHashtable, 'Jane Doe-Applicant,Adam West-Batman', 'This is Your Permit'); //full
 */
function emailAsync(sendEmailToAddresses, emailTemplate, vEParams, reportTemplate, vRParams, manualNotificationList, changeReportName) {
	var vAsyncScript = "SEND_EMAIL_ASYNC";
	
	//Start modification to support batch script
	var vEvntTyp = aa.env.getValue("eventType");
	if (vEvntTyp == "Batch Process") {
		aa.env.setValue("sendEmailToAddresses", sendEmailToAddresses);
		aa.env.setValue("emailTemplate", emailTemplate);
		aa.env.setValue("vEParams", vEParams);
		aa.env.setValue("reportTemplate", reportTemplate);
		aa.env.setValue("vRParams", vRParams);
		aa.env.setValue("vChangeReportName", changeReportName);
		aa.env.setValue("CapId", capId);
		aa.env.setValue("adHocTaskContactsList", manualNotificationList);		
		//call sendEmailASync script
		logDebug("Attempting to run Non-Async: " + vAsyncScript);
		aa.includeScript(vAsyncScript);
	}
	else {
		//Can't store nulls in a hashmap, so check optional params just in case
		if (vEParams == null || vEParams == "") { vEParams = aa.util.newHashtable(); }
		if (vRParams == null || vRParams == "") { vRParams = aa.util.newHashtable(); }
		if (reportTemplate == null) { reportTemplate = ""; }
		if (changeReportName == null) { changeReportName = ""; }
		if (manualNotificationList == null) { manualNotificationList = ""; }
		
		//Save variables to the hash table and call sendEmailASync script. This allows for the email to contain an ACA deep link for the document
		var envParameters = aa.util.newHashMap();
		envParameters.put("sendEmailToAddresses", sendEmailToAddresses);
		envParameters.put("emailTemplate", emailTemplate);
		envParameters.put("vEParams", vEParams);
		envParameters.put("reportTemplate", reportTemplate);
		envParameters.put("vRParams", vRParams);
		envParameters.put("vChangeReportName", changeReportName);
		envParameters.put("CapId", capId);
		envParameters.put("adHocTaskContactsList", manualNotificationList);
		
		//call sendEmailASync script
		logDebug("Attempting to run Async: " + vAsyncScript);
		aa.runAsyncScript(vAsyncScript, envParameters);
	}
	//End modification to support batch script
	
	return true;
}
/*
emailAsync - parallel function for emailContacts when you have actual email addresses instead of contact types
  Required Params:
     sendEmailToAddresses = comma-separated list of email addresses, no spaces
     emailTemplate = notification template name
  Optional Params: (use blank string, not null, if missing!)
     vEParams = parameters to be filled in notification template
     reportTemplate = if provided, will run report and attach to record and include a link to it in the email
     vRParams  = report parameters
     manualNotificationList = comma-separated list of contact names without email to be listed in Manual Notification adhoc task
     changeReportName = if using reportTemplate, will change the title of the document produced by the report from its default

Sample: emailAsync('gephartj@seattle.gov', 'DPD_WAITING_FOR_PAYMENT'); //minimal
        emailAsync('gephartj@seattle.gov,joe@smith.com', 'DPD_PERMIT_ISSUED', "", 'Construction Permit', paramHashtable, 'Jane Doe-Applicant,Adam West-Batman', 'This is Your Permit'); //full
 */

//SAME AS emailAsync2 - EXCEPT CALLS SEND_EMAIL_ASYNC2 
function emailAsync2(sendEmailToAddresses, emailTemplate, vEParams, reportTemplate, vRParams, manualNotificationList, changeReportName) {
	var vAsyncScript = "SEND_EMAIL_ASYNC2";
	
	//Start modification to support batch script
	var vEvntTyp = aa.env.getValue("eventType");
	if (vEvntTyp == "Batch Process") {
		aa.env.setValue("sendEmailToAddresses", sendEmailToAddresses);
		aa.env.setValue("emailTemplate", emailTemplate);
		aa.env.setValue("vEParams", vEParams);
		aa.env.setValue("reportTemplate", reportTemplate);
		aa.env.setValue("vRParams", vRParams);
		aa.env.setValue("vChangeReportName", changeReportName);
		aa.env.setValue("CapId", capId);
		aa.env.setValue("adHocTaskContactsList", manualNotificationList);		
		//call sendEmailASync script
		logDebug("Attempting to run Non-Async: " + vAsyncScript);
		aa.includeScript(vAsyncScript);
	}
	else {
		//Can't store nulls in a hashmap, so check optional params just in case
		if (vEParams == null || vEParams == "") { vEParams = aa.util.newHashtable(); }
		if (vRParams == null || vRParams == "") { vRParams = aa.util.newHashtable(); }
		if (reportTemplate == null) { reportTemplate = ""; }
		if (changeReportName == null) { changeReportName = ""; }
		if (manualNotificationList == null) { manualNotificationList = ""; }
		
		//Save variables to the hash table and call sendEmailASync script. This allows for the email to contain an ACA deep link for the document
		var envParameters = aa.util.newHashMap();
		envParameters.put("sendEmailToAddresses", sendEmailToAddresses);
		envParameters.put("emailTemplate", emailTemplate);
		envParameters.put("vEParams", vEParams);
		envParameters.put("reportTemplate", reportTemplate);
		envParameters.put("vRParams", vRParams);
		envParameters.put("vChangeReportName", changeReportName);
		envParameters.put("CapId", capId);
		envParameters.put("adHocTaskContactsList", manualNotificationList);
		
		//call sendEmailASync script
		logDebug("Attempting to run Async: " + vAsyncScript);
        aa.runAsyncScript(vAsyncScript, envParameters); 
    }
	//End modification to support batch script
	
	return true;
}
/*
emailContacts
  Required Params:
     sendEmailToContactTypes = comma-separated list of contact types to send to, no spaces
     emailTemplate = notification template name
  Optional Params: (use blank string, not null, if missing!)
     vEParams = parameters to be filled in notification template
     reportTemplate = if provided, will run report and attach to record and include a link to it in the email
     vRParams  = report parameters
	 vAddAdHocTask = Y/N for adding manual notification task when no email exists
     changeReportName = if using reportTemplate, will change the title of the document produced by the report from its default
Sample: emailContacts('OWNER APPLICANT', 'DPD_WAITING_FOR_PAYMENT'); //minimal
        emailContacts('OWNER APPLICANT,BUSINESS OWNER', 'DPD_PERMIT_ISSUED', eParamHashtable, 'Construction Permit', rParamHashtable, 'Y', 'New Report Name'); //full
 */
function emailContactsIncludesLP(sendEmailToContactTypes, emailTemplate, vEParams, reportTemplate, vRParams) {
	var vChangeReportName = "";
	var conTypeArray = [];
	var validConTypes = getContactTypes();
	var x = 0;
	var vConType;
	var vAsyncScript = "SEND_EMAIL_TO_CONTACTS_ASYNC_INCLUDESLP";
	var envParameters = aa.util.newHashMap();
	var vAddAdHocTask = true;

	//Ad-hoc Task Requested
	if (arguments.length > 5) {
		vAddAdHocTask = arguments[5]; // use provided prefrence for adding an ad-hoc task for manual notification
		if (vAddAdHocTask == "N") {
logDebug("No adhoc task");			
			vAddAdHocTask = false;
		}
	}
	
	//Change Report Name Requested
	if (arguments.length > 6) {
		vChangeReportName = arguments[6]; // use provided report name
	}

logDebug("Provided contact types to send to: " + sendEmailToContactTypes);
	
	//Check to see if provided contact type(s) is/are valid
	if (sendEmailToContactTypes != "All" && sendEmailToContactTypes != null && sendEmailToContactTypes != '') {
		conTypeArray = sendEmailToContactTypes.split(",");
	}
	for (x in conTypeArray) {
		//check all that are not "Primary"
		vConType = conTypeArray[x];
		if (vConType != "Primary" && !exists(vConType, validConTypes)) {
			logDebug(vConType + " is not a valid contact type. No actions will be taken for this type.");
			conTypeArray.splice(x, (x+1));
		}
	}
	//Check if any types remain. If not, don't continue processing
	if ((sendEmailToContactTypes != "All" && sendEmailToContactTypes != null && sendEmailToContactTypes != '') && conTypeArray.length <= 0) {
		logDebug(vConType + " is not a valid contact type. No actions will be taken for this type.");
		return false;	
	}
	else if((sendEmailToContactTypes != "All" && sendEmailToContactTypes != null && sendEmailToContactTypes != '') && conTypeArray.length > 0) {
		sendEmailToContactTypes = conTypeArray.toString();
	}
	else if((sendEmailToContactTypes != "PRIMARYLP" && sendEmailToContactTypes != null && sendEmailToContactTypes != '') && conTypeArray.length > 0) {
		sendEmailToContactTypes = "PRIMARYLP";
	}
	

	
logDebug("Validated contact types to send to: " + sendEmailToContactTypes);	
	//Save variables to the hash table and call sendEmailASync script. This allows for the email to contain an ACA deep link for the document
	envParameters.put("sendEmailToContactTypes", sendEmailToContactTypes);
	envParameters.put("emailTemplate", emailTemplate);
	envParameters.put("vEParams", vEParams);
	envParameters.put("reportTemplate", reportTemplate);
	envParameters.put("vRParams", vRParams);
	envParameters.put("vChangeReportName", vChangeReportName);
	envParameters.put("CapId", capId);
	envParameters.put("vAddAdHocTask", vAddAdHocTask);

	//Start modification to support batch script
	var vEvntTyp = aa.env.getValue("eventType");
	if (vEvntTyp == "Batch Process") {
		aa.env.setValue("sendEmailToContactTypes", sendEmailToContactTypes);
		aa.env.setValue("emailTemplate", emailTemplate);
		aa.env.setValue("vEParams", vEParams);
		aa.env.setValue("reportTemplate", reportTemplate);
		aa.env.setValue("vRParams", vRParams);
		aa.env.setValue("vChangeReportName", vChangeReportName);
		aa.env.setValue("CapId", capId);
		aa.env.setValue("vAddAdHocTask", vAddAdHocTask);		
		//call sendEmailASync script
		logDebug("Attempting to run Non-Async: " + vAsyncScript);
		aa.includeScript(vAsyncScript);
	}
	else {
		//call sendEmailASync script
		logDebug("Attempting to run Async: " + vAsyncScript);
		aa.runAsyncScript(vAsyncScript, envParameters);
	}
	//End modification to support batch script
	
	return true;
}
/*
emailContactsWithCCs
  Required Params:
     sendEmailToContactTypes = comma-separated list of contact types to send to, no spaces
     emailTemplate = notification template name
  Optional Params: (use blank string, not null, if missing!)
     vEParams = parameters to be filled in notification template
     reportTemplate = if provided, will run report and attach to record and include a link to it in the email
     vRParams  = report parameters
	 vAddAdHocTask = Y/N for adding manual notification task when no email exists
     changeReportName = if using reportTemplate, will change the title of the document produced by the report from its default
	 ccEmailToContactTypes = comma-separated list of contact types to cc to, no spaces
Sample: emailContactsWithCCs('OWNER APPLICANT', 'DPD_WAITING_FOR_PAYMENT'); //minimal
        emailContactsWithCCs('OWNER APPLICANT,BUSINESS OWNER', 'DPD_PERMIT_ISSUED', eParamHashtable, 'Construction Permit', rParamHashtable, 'Y', 'New Report Name'); //full
 */
function emailContactsWithCCs(sendEmailToContactTypes, emailTemplate, vEParams, reportTemplate, vRParams) {//, vAddAdHocTask, changeReportName, ccEmailToContactTypes) {
	logDebug("emailContactsWithCCs() started");
	var vChangeReportName = "";
	var validConTypes = getContactTypes();
	var x = 0;
	var vConType;
	var vAsyncScript = "SEND_EMAIL_TO_CONTACTS_ASYNC_WITH_CC";
	var envParameters = aa.util.newHashMap();
	var vAddAdHocTask = true;
	var ccEmailToContactTypes = [];

	//Ad-hoc Task Requested
	if (arguments.length > 5) {
		vAddAdHocTask = arguments[5]; // use provided prefrence for adding an ad-hoc task for manual notification
		if (vAddAdHocTask == "N") {
			logDebug("No adhoc task");			
			vAddAdHocTask = false;
		}
	}
	
	//Change Report Name Requested
	if (arguments.length > 6) {
		vChangeReportName = arguments[6]; // use provided report name
	}

	//ccEmailToContactTypes
	if (arguments.length > 7) {
		ccEmailToContactTypes = arguments[7]; // array of cc addresses
	}

	//clean contact types
	logDebug("Provided contact types to send to: " + sendEmailToContactTypes);
	// for SEND = "All", null & '' means everyone
	if (sendEmailToContactTypes != "All" && sendEmailToContactTypes != null && sendEmailToContactTypes != '') {
		sendEmailToContactTypes = cleanContactTypes(sendEmailToContactTypes);
		if(!sendEmailToContactTypes) {
			//only invalid contact types were sent. If so, don't continue processing
			logDebug(vConType + " is not a valid contact type. No actions will be taken for this type.");
			return false;
		}	
	}

	logDebug("Provided contact types to CC to: " + ccEmailToContactTypes);
	// for CC = only "All" means everyone
	ccEmailToContactTypes = cleanContactTypes(ccEmailToContactTypes);
	
	
	logDebug("Validated contact types to send to: " + sendEmailToContactTypes);	
	//Save variables to the hash table and call sendEmailASync script. This allows for the email to contain an ACA deep link for the document
	envParameters.put("sendEmailToContactTypes", sendEmailToContactTypes);
	envParameters.put("ccEmailToContactTypes", ccEmailToContactTypes);
	envParameters.put("emailTemplate", emailTemplate);
	envParameters.put("vEParams", vEParams);
	envParameters.put("reportTemplate", reportTemplate);
	envParameters.put("vRParams", vRParams);
	envParameters.put("vChangeReportName", vChangeReportName);
	envParameters.put("CapId", capId);
	envParameters.put("vAddAdHocTask", vAddAdHocTask);
	
	//Start modification to support batch script
	var vEvntTyp = aa.env.getValue("eventType");
	if (vEvntTyp == "Batch Process") {
		aa.env.setValue("sendEmailToContactTypes", sendEmailToContactTypes);
		aa.env.setValue("ccEmailToContactTypes", ccEmailToContactTypes);
		aa.env.setValue("emailTemplate", emailTemplate);
		aa.env.setValue("vEParams", vEParams);
		aa.env.setValue("reportTemplate", reportTemplate);
		aa.env.setValue("vRParams", vRParams);
		aa.env.setValue("vChangeReportName", vChangeReportName);
		aa.env.setValue("CapId", capId);
		aa.env.setValue("vAddAdHocTask", vAddAdHocTask);		
		//call sendEmailASync script
		logDebug("Attempting to run Non-Async: " + vAsyncScript);
		aa.includeScript(vAsyncScript);
	}
	else {
		//call sendEmailASync script
		logDebug("Attempting to run Async: " + vAsyncScript);
		aa.runAsyncScript(vAsyncScript, envParameters);
	}
	//End modification to support batch script
	
	return true;

	function cleanContactTypes(contactTypes) {
		var cleanContactTypes = null,
			contactTypeArray = [];

		if(contactTypes == "All" || contactTypes == null || contactTypes == '') {
			return contactTypes;	
		} else {
			contactTypeArray = contactTypes.split(",");

			for (x in contactTypeArray) {
				//check all that are not "Primary"
				vConType = contactTypeArray[x];
				if (vConType != "Primary" && !exists(vConType, validConTypes)) {
					logDebug(vConType + " is not a valid contact type. No actions will be taken for this type.");
					contactTypeArray.splice(x, (x+1));
				}
			}

			if(contactTypeArray.length > 0) {
				cleanContactTypes = contactTypeArray.toString();
			} 
	
			return cleanContactTypes;	

		}

	}
}
/*
emailContactsWithReportAttachASync
Required Params:
	pSendEmailToContactTypes = comma-separated list of contact types to send to, no spaces. "All" will send to all contacts. "Primary" will send to the contact with the primary flag enabled.
	pEmailTemplate = notification template name
Optional Params:
	vEParams = parameters to be filled in notification template
	reportTemplate = if provided, will run report and attach (per report manager settings) and include as an attachment in the email
	vRParams  = report parameters
	vAddAdHocTask = Y/N for adding manual notification task when no email exists (Assigns the task to the department configured by module in the "Manual_Notification_Assign_Dept" standard choice)
	changeReportName = if using reportTemplate, will change the title of the document produced by the report from its default

Sample: 
	emailContactsWithReportAttachASync('OWNER APPLICANT', 'DPD_WAITING_FOR_PAYMENT'); //minimal
	emailContactsWithReportAttachASync('OWNER APPLICANT,BUSINESS OWNER', 'DPD_PERMIT_ISSUED', eParamHashtable, 'Construction Permit', rParamHashtable, 'Y', 'New Report Name'); //full
*/
function emailContactsWithReportAttachASync(pSendEmailToContactTypes, pEmailTemplate, pEParams, pReportTemplate, pRParams, pAddAdHocTask, pChangeReportName) {
	var conTypeArray = [];
	var validConTypes = getConfiguredContactTypes();
	var x = 0;
	var vConType;
	var vAsyncScript = "SEND_EMAIL_TO_CONTACTS_ATTACH_ASYNC_ETECH";
	var envParameters = aa.util.newHashMap();
		
	//Initialize optional parameters	
	var vEParams = aa.util.newHashtable();
	var vReportTemplate = "";
	var vRParams = aa.util.newHashtable();
	var vAddAdHocTask = true;
	var vChangeReportName = "";	

	if (pEParams != undefined && pEParams != null && pEParams != "") {
		logDebug("pEParams is defined");
		vEParams = pEParams;
	}
	
	if (pReportTemplate != undefined && pReportTemplate != null && pReportTemplate != "") {
		logDebug("pReportTemplate is defined");
		vReportTemplate = pReportTemplate;
	}

	if (pRParams != undefined && pRParams != null && pRParams != "") {
		logDebug("pRParams is defined");
		vRParams = pRParams;
	}
	
	if (pAddAdHocTask != undefined && pAddAdHocTask != null && pAddAdHocTask != "") {
		logDebug("pAddAdHocTask is defined");
		if (pAddAdHocTask == "N") {
			vAddAdHocTask = false;
		} else if (pAddAdHocTask == false) {
			vAddAdHocTask = false;
		}
	}
	
	if (pChangeReportName != undefined && pChangeReportName != null && pChangeReportName != "") {
		logDebug("pChangeReportName is defined");
		vChangeReportName = pChangeReportName;
	}
	
	
	logDebug("Provided contact types to send to: " + pSendEmailToContactTypes);

	//Check to see if provided contact type(s) is/are valid
	if (pSendEmailToContactTypes != "All" && pSendEmailToContactTypes != null && pSendEmailToContactTypes != '') {
		conTypeArray = pSendEmailToContactTypes.split(",");
	}
	for (x in conTypeArray) {
		//check all that are not "Primary"
		vConType = conTypeArray[x];
		if (vConType != "Primary" && !exists(vConType, validConTypes)) {
			logDebug(vConType + " is not a valid contact type. No actions will be taken for this type.");
			conTypeArray.splice(x, (x + 1));
		}
	}
	//Check if any types remain. If not, don't continue processing
	if ((pSendEmailToContactTypes != "All" && pSendEmailToContactTypes != null && pSendEmailToContactTypes != '') && conTypeArray.length <= 0) {
		logDebug(vConType + " is not a valid contact type. No actions will be taken for this type.");
		return false;
	} else if ((pSendEmailToContactTypes != "All" && pSendEmailToContactTypes != null && pSendEmailToContactTypes != '') && conTypeArray.length > 0) {
		pSendEmailToContactTypes = conTypeArray.toString();
	}

	logDebug("Validated contact types to send to: " + pSendEmailToContactTypes);
	
	//Save variables to the hash table and call sendEmailASync script. This allows for the email to contain an ACA deep link for the document
	envParameters.put("sendEmailToContactTypes", pSendEmailToContactTypes);
	envParameters.put("emailTemplate", pEmailTemplate);
	envParameters.put("vEParams", vEParams);
	envParameters.put("reportTemplate", vReportTemplate);
	envParameters.put("vRParams", vRParams);
	envParameters.put("vChangeReportName", vChangeReportName);
	envParameters.put("CapId", capId);
	envParameters.put("vAddAdHocTask", vAddAdHocTask);

	//Start modification to support batch script
	var vEvntTyp = aa.env.getValue("eventType");
	if (vEvntTyp == "Batch Process") {
		aa.env.setValue("sendEmailToContactTypes", pSendEmailToContactTypes);
		aa.env.setValue("emailTemplate", pEmailTemplate);
		aa.env.setValue("vEParams", vEParams);
		aa.env.setValue("reportTemplate", vReportTemplate);
		aa.env.setValue("vRParams", vRParams);
		aa.env.setValue("vChangeReportName", vChangeReportName);
		aa.env.setValue("CapId", capId);
		aa.env.setValue("vAddAdHocTask", vAddAdHocTask);
		//call sendEmailASync script
		logDebug("Attempting to run Non-Async: " + vAsyncScript);
		aa.includeScript(vAsyncScript);
	} else {
		//call sendEmailASync script
		logDebug("Attempting to run Async: " + vAsyncScript);
		aa.runAsyncScript(vAsyncScript, envParameters);
	}
	//End modification to support batch script

	return true;
}

/*
emailContactsWithReportLinkASync
Required Params:
	pSendEmailToContactTypes = comma-separated list of contact types to send to, no spaces. "All" will send to all contacts. "Primary" will send to the contact with the primary flag enabled.
	pEmailTemplate = notification template name
Optional Params:
	vEParams = parameters to be filled in notification template
	reportTemplate = if provided, will run report and attach (per report manager settings) and include a link to it in the email
	vRParams  = report parameters
	vAddAdHocTask = Y/N for adding manual notification task when no email exists (Assigns the task to the department configured by module in the "Manual_Notification_Assign_Dept" standard choice)
	changeReportName = if using reportTemplate, will change the title of the document produced by the report from its default

Sample: 
	emailContactsWithReportLinkASync('OWNER APPLICANT', 'DPD_WAITING_FOR_PAYMENT'); //minimal
	emailContactsWithReportLinkASync('OWNER APPLICANT,BUSINESS OWNER', 'DPD_PERMIT_ISSUED', eParamHashtable, 'Construction Permit', rParamHashtable, 'Y', 'New Report Name'); //full
*/
function emailContactsWithReportLinkASync(pSendEmailToContactTypes, pEmailTemplate, pEParams, pReportTemplate, pRParams, pAddAdHocTask, pChangeReportName) {
	var conTypeArray = [];
	var validConTypes = getConfiguredContactTypes();
	var x = 0;
	var vConType;
	var vAsyncScript = "SEND_EMAIL_TO_CONTACTS_ASYNC_ETECH";
	var envParameters = aa.util.newHashMap();
		
	//Initialize optional parameters	
	var vEParams = aa.util.newHashtable();
	var vReportTemplate = "";
	var vRParams = aa.util.newHashtable();
	var vAddAdHocTask = true;
	var vChangeReportName = "";	

	if (pEParams != undefined && pEParams != null && pEParams != "") {
		logDebug("pEParams is defined");
		vEParams = pEParams;
	}
	
	if (pReportTemplate != undefined && pReportTemplate != null && pReportTemplate != "") {
		logDebug("pReportTemplate is defined");
		vReportTemplate = pReportTemplate;
	}

	if (pRParams != undefined && pRParams != null && pRParams != "") {
		logDebug("pRParams is defined");
		vRParams = pRParams;
	}
	
	if (pAddAdHocTask != undefined && pAddAdHocTask != null && pAddAdHocTask != "") {
		logDebug("pAddAdHocTask is defined");
		if (pAddAdHocTask == "N") {
			vAddAdHocTask = false;
		} else if (pAddAdHocTask == false) {
			vAddAdHocTask = false;
		}
	}
	
	if (pChangeReportName != undefined && pChangeReportName != null && pChangeReportName != "") {
		logDebug("pChangeReportName is defined");
		vChangeReportName = pChangeReportName;
	}
    
    var itemCap = capId;
    if (arguments.length == 8){
        if (arguments[7] != null){
            logDebug("Using capId: " + arguments[7]);
            itemCap = arguments[7];
        }
    }	
	
	logDebug("Provided contact types to send to: " + pSendEmailToContactTypes);

	//Check to see if provided contact type(s) is/are valid
	if (pSendEmailToContactTypes != "All" && pSendEmailToContactTypes != null && pSendEmailToContactTypes != '') {
		conTypeArray = pSendEmailToContactTypes.split(",");
	}
	for (x in conTypeArray) {
		//check all that are not "Primary"
		vConType = conTypeArray[x];
		if (vConType != "Primary" && !exists(vConType, validConTypes)) {
			logDebug(vConType + " is not a valid contact type. No actions will be taken for this type.");
			conTypeArray.splice(x, (x + 1));
		}
	}
	//Check if any types remain. If not, don't continue processing
	if ((pSendEmailToContactTypes != "All" && pSendEmailToContactTypes != null && pSendEmailToContactTypes != '') && conTypeArray.length <= 0) {
		logDebug(vConType + " is not a valid contact type. No actions will be taken for this type.");
		return false;
	} else if ((pSendEmailToContactTypes != "All" && pSendEmailToContactTypes != null && pSendEmailToContactTypes != '') && conTypeArray.length > 0) {
		pSendEmailToContactTypes = conTypeArray.toString();
	}

	logDebug("Validated contact types to send to: " + pSendEmailToContactTypes);
	
	//Save variables to the hash table and call sendEmailASync script. This allows for the email to contain an ACA deep link for the document
	envParameters.put("sendEmailToContactTypes", pSendEmailToContactTypes);
	envParameters.put("emailTemplate", pEmailTemplate);
	envParameters.put("vEParams", vEParams);
	envParameters.put("reportTemplate", vReportTemplate);
	envParameters.put("vRParams", vRParams);
	envParameters.put("vChangeReportName", vChangeReportName);
	envParameters.put("CapId", itemCap);
	envParameters.put("vAddAdHocTask", vAddAdHocTask);

	//Start modification to support batch script
	var vEvntTyp = aa.env.getValue("eventType");
	if (vEvntTyp == "Batch Process") {
		aa.env.setValue("sendEmailToContactTypes", pSendEmailToContactTypes);
		aa.env.setValue("emailTemplate", pEmailTemplate);
		aa.env.setValue("vEParams", vEParams);
		aa.env.setValue("reportTemplate", vReportTemplate);
		aa.env.setValue("vRParams", vRParams);
		aa.env.setValue("vChangeReportName", vChangeReportName);
		aa.env.setValue("CapId", itemCap);
		aa.env.setValue("vAddAdHocTask", vAddAdHocTask);
		//call sendEmailASync script
		logDebug("Attempting to run Non-Async: " + vAsyncScript);
		aa.includeScript(vAsyncScript);
	} else {
		//call sendEmailASync script
		logDebug("Attempting to run Async: " + vAsyncScript);
		aa.runAsyncScript(vAsyncScript, envParameters);
	}
	//End modification to support batch script

	return true;
}

/*
emailContacts
  Required Params:
     sendEmailToContactTypes = comma-separated list of contact types to send to, no spaces
     emailTemplate = notification template name
  Optional Params: (use blank string, not null, if missing!)
     vEParams = parameters to be filled in notification template
     reportTemplate = if provided, will run report and attach to record and include a link to it in the email
     vRParams  = report parameters
	 vAddAdHocTask = Y/N for adding manual notification task when no email exists
     changeReportName = if using reportTemplate, will change the title of the document produced by the report from its default
Sample: emailContacts('OWNER APPLICANT', 'DPD_WAITING_FOR_PAYMENT'); //minimal
        emailContacts('OWNER APPLICANT,BUSINESS OWNER', 'DPD_PERMIT_ISSUED', eParamHashtable, 'Construction Permit', rParamHashtable, 'Y', 'New Report Name'); //full
 */
function emailContacts(sendEmailToContactTypes, emailTemplate, vEParams, reportTemplate, vRParams) {
	var vChangeReportName = "";
	var conTypeArray = [];
	var validConTypes = getContactTypes();
	var x = 0;
	var vConType;
	var vAsyncScript = "SEND_EMAIL_TO_CONTACTS_ASYNC";
	var envParameters = aa.util.newHashMap();
	var vAddAdHocTask = true;

	//Ad-hoc Task Requested
	if (arguments.length > 5) {
		vAddAdHocTask = arguments[5]; // use provided prefrence for adding an ad-hoc task for manual notification
		if (vAddAdHocTask == "N") {
logDebug("No adhoc task");			
			vAddAdHocTask = false;
		}
	}
	
	//Change Report Name Requested
	if (arguments.length > 6) {
		vChangeReportName = arguments[6]; // use provided report name
	}

logDebug("Provided contact types to send to: " + sendEmailToContactTypes);
	
	//Check to see if provided contact type(s) is/are valid
	if (sendEmailToContactTypes != "All" && sendEmailToContactTypes != null && sendEmailToContactTypes != '') {
		conTypeArray = sendEmailToContactTypes.split(",");
	}
	for (x in conTypeArray) {
		//check all that are not "Primary"
		vConType = conTypeArray[x];
		if (vConType != "Primary" && !exists(vConType, validConTypes)) {
			logDebug(vConType + " is not a valid contact type. No actions will be taken for this type.");
			conTypeArray.splice(x, (x+1));
		}
	}
	//Check if any types remain. If not, don't continue processing
	if ((sendEmailToContactTypes != "All" && sendEmailToContactTypes != null && sendEmailToContactTypes != '') && conTypeArray.length <= 0) {
		logDebug(vConType + " is not a valid contact type. No actions will be taken for this type.");
		return false;	
	}
	else if((sendEmailToContactTypes != "All" && sendEmailToContactTypes != null && sendEmailToContactTypes != '') && conTypeArray.length > 0) {
		sendEmailToContactTypes = conTypeArray.toString();
	}
	
logDebug("Validated contact types to send to: " + sendEmailToContactTypes);	
	//Save variables to the hash table and call sendEmailASync script. This allows for the email to contain an ACA deep link for the document
	envParameters.put("sendEmailToContactTypes", sendEmailToContactTypes);
	envParameters.put("emailTemplate", emailTemplate);
	envParameters.put("vEParams", vEParams);
	envParameters.put("reportTemplate", reportTemplate);
	envParameters.put("vRParams", vRParams);
	envParameters.put("vChangeReportName", vChangeReportName);
	envParameters.put("CapId", capId);
	envParameters.put("vAddAdHocTask", vAddAdHocTask);
	
	//Start modification to support batch script
	var vEvntTyp = aa.env.getValue("eventType");
	if (vEvntTyp == "Batch Process") {
		aa.env.setValue("sendEmailToContactTypes", sendEmailToContactTypes);
		aa.env.setValue("emailTemplate", emailTemplate);
		aa.env.setValue("vEParams", vEParams);
		aa.env.setValue("reportTemplate", reportTemplate);
		aa.env.setValue("vRParams", vRParams);
		aa.env.setValue("vChangeReportName", vChangeReportName);
		aa.env.setValue("CapId", capId);
		aa.env.setValue("vAddAdHocTask", vAddAdHocTask);		
		//call sendEmailASync script
		logDebug("Attempting to run Non-Async: " + vAsyncScript);
		aa.includeScript(vAsyncScript);
	}
	else {
		//call sendEmailASync script
		logDebug("Attempting to run Async: " + vAsyncScript);
		aa.runAsyncScript(vAsyncScript, envParameters);
	}
	//End modification to support batch script
	
	return true;
}
/*
emailWithReportAttachASync
Required Params:
	pSendToEmailAddresses = comma-separated list of email addresses to send to, no spaces.
	pEmailTemplate = notification template name
Optional Params:
	vEParams = parameters to be filled in notification template
	reportTemplate = if provided, will run report and attach (per report manager settings) and include a link to it in the email
	vRParams  = report parameters
	changeReportName = if using reportTemplate, will change the title of the document produced by the report from its default

Sample: 
	emailWithReportAttachASync('ewylam@etechconsultingllc.com', 'DPD_WAITING_FOR_PAYMENT'); //minimal
	emailWithReportAttachASync('ewylam@etechconsultingllc.com, jschillo@etechconsultingllc.com', 'DPD_PERMIT_ISSUED', eParamHashtable, 'Construction Permit', rParamHashtable, 'New Report Name'); //full
*/
function emailWithReportAttachASync(pSendToEmailAddresses, pEmailTemplate, pEParams, pReportTemplate, pRParams, pAddAdHocTask, pChangeReportName) {
	var x = 0;
	var vAsyncScript = "SEND_EMAIL_ATTACH_ASYNC_ETECH";
	var envParameters = aa.util.newHashMap();
		
	//Initialize optional parameters	
	var vEParams = aa.util.newHashtable();
	var vReportTemplate = "";
	var vRParams = aa.util.newHashtable();
	var vAddAdHocTask = true;
	var vChangeReportName = "";	

	if (pEParams != undefined) {
		logDebug("pEParams is defined");
		vEParams = pEParams;
	}
	
	if (pReportTemplate != undefined) {
		logDebug("pReportTemplate is defined");
		vReportTemplate = pReportTemplate;
	}

	if (pRParams != undefined) {
		logDebug("pRParams is defined");
		vRParams = pRParams;
	}
	
	if (pAddAdHocTask != undefined) {
		logDebug("pAddAdHocTask is defined");
		if (pAddAdHocTask == "N") {
			vAddAdHocTask = false;
		} else if (pAddAdHocTask == false) {
			vAddAdHocTask = false;
		}
	}
	
	if (pChangeReportName != undefined) {
		logDebug("pChangeReportName is defined");
		vChangeReportName = pChangeReportName;
	}

	//Save variables to the hash table and call sendEmailASync script. This allows for the email to contain an ACA deep link for the document
	envParameters.put("sendToEmailAddresses", pSendToEmailAddresses);
	envParameters.put("emailTemplate", pEmailTemplate);
	envParameters.put("vEParams", vEParams);
	envParameters.put("reportTemplate", vReportTemplate);
	envParameters.put("vRParams", vRParams);
	envParameters.put("vChangeReportName", vChangeReportName);
	envParameters.put("CapId", capId);

	//Start modification to support batch script
	var vEvntTyp = aa.env.getValue("eventType");
	if (vEvntTyp == "Batch Process") {
		aa.env.setValue("sendToEmailAddresses", pSendToEmailAddresses);
		aa.env.setValue("emailTemplate", pEmailTemplate);
		aa.env.setValue("vEParams", vEParams);
		aa.env.setValue("reportTemplate", vReportTemplate);
		aa.env.setValue("vRParams", vRParams);
		aa.env.setValue("vChangeReportName", vChangeReportName);
		aa.env.setValue("CapId", capId);
		//call sendEmailASync script
		logDebug("Attempting to run Non-Async: " + vAsyncScript);
		aa.includeScript(vAsyncScript);
	} else {
		//call sendEmailASync script
		logDebug("Attempting to run Async: " + vAsyncScript);
		aa.runAsyncScript(vAsyncScript, envParameters);
	}
	//End modification to support batch script

	return true;
}

/*
emailWithReportLinkASync
Required Params:
	pSendToEmailAddresses = comma-separated list of email addresses to send to, no spaces.
	pEmailTemplate = notification template name
Optional Params:
	vEParams = parameters to be filled in notification template
	reportTemplate = if provided, will run report and attach (per report manager settings) and include a link to it in the email
	vRParams  = report parameters
	changeReportName = if using reportTemplate, will change the title of the document produced by the report from its default

Sample: 
	emailWithReportLinkASync('ewylam@etechconsultingllc.com', 'DPD_WAITING_FOR_PAYMENT'); //minimal
	emailWithReportLinkASync('ewylam@etechconsultingllc.com, jschillo@etechconsultingllc.com', 'DPD_PERMIT_ISSUED', eParamHashtable, 'Construction Permit', rParamHashtable, 'New Report Name'); //full
*/
function emailWithReportLinkASync(pSendToEmailAddresses, pEmailTemplate, pEParams, pReportTemplate, pRParams, pAddAdHocTask, pChangeReportName) {
	var x = 0;
	var vAsyncScript = "SEND_EMAIL_ASYNC_ETECH";
	var envParameters = aa.util.newHashMap();
		
	//Initialize optional parameters	
	var vEParams = aa.util.newHashtable();
	var vReportTemplate = "";
	var vRParams = aa.util.newHashtable();
	var vAddAdHocTask = true;
	var vChangeReportName = "";	

	if (pEParams != undefined && pEParams != null && pEParams != "") {
		logDebug("pEParams is defined");
		vEParams = pEParams;
	}
	
	if (pReportTemplate != undefined && pReportTemplate != null && pReportTemplate != "") {
		logDebug("pReportTemplate is defined");
		vReportTemplate = pReportTemplate;
	}

	if (pRParams != undefined && pRParams != null && pRParams != "") {
		logDebug("pRParams is defined");
		vRParams = pRParams;
	}
	
	if (pAddAdHocTask != undefined && pAddAdHocTask != null && pAddAdHocTask != "") {
		logDebug("pAddAdHocTask is defined");
		if (pAddAdHocTask == "N") {
			vAddAdHocTask = false;
		} else if (pAddAdHocTask == false) {
			vAddAdHocTask = false;
		}
	}
	
	if (pChangeReportName != undefined && pChangeReportName != null && pChangeReportName != "") {
		logDebug("pChangeReportName is defined");
		vChangeReportName = pChangeReportName;
	}
	
	var itemCap = capId;
    if (arguments.length == 8){
        if (arguments[7] != null){
            logDebug("Using capId: " + arguments[7]);
            itemCap = arguments[7];
        }
    }

	//Save variables to the hash table and call sendEmailASync script. This allows for the email to contain an ACA deep link for the document
	envParameters.put("sendToEmailAddresses", pSendToEmailAddresses);
	envParameters.put("emailTemplate", pEmailTemplate);
	envParameters.put("vEParams", vEParams);
	envParameters.put("reportTemplate", vReportTemplate);
	envParameters.put("vRParams", vRParams);
	envParameters.put("vChangeReportName", vChangeReportName);
	envParameters.put("CapId", itemCap);
	envParameters.put("vAddAdHocTask", vAddAdHocTask);

	//Start modification to support batch script
	var vEvntTyp = aa.env.getValue("eventType");
	if (vEvntTyp == "Batch Process") {
		aa.env.setValue("sendToEmailAddresses", pSendToEmailAddresses);
		aa.env.setValue("emailTemplate", pEmailTemplate);
		aa.env.setValue("vEParams", vEParams);
		aa.env.setValue("reportTemplate", vReportTemplate);
		aa.env.setValue("vRParams", vRParams);
		aa.env.setValue("vChangeReportName", vChangeReportName);
		aa.env.setValue("CapId", itemCap);
		aa.env.setValue("vAddAdHocTask", vAddAdHocTask);
		//call sendEmailASync script
		logDebug("Attempting to run Non-Async: " + vAsyncScript);
		aa.includeScript(vAsyncScript);
	} else {
		//call sendEmailASync script
		logDebug("Attempting to run Async: " + vAsyncScript);
		aa.runAsyncScript(vAsyncScript, envParameters);
	}
	//End modification to support batch script

	return true;
}

/**
 * Update workflow, create new inspection
 * @param (String) iType: inspection type to check for 
 * @param (String) iResult: inspection result to check for
 * @param (String) newInsp: new Inspection to create. if null it will not create a new inspection
 * @param (String or number) newInspDateOrDays: A custom field used to create the inspection on the given date or number of days ahead
 * @param (boolean) carryOverFailedCheckList: Carry over the failed Checklist items to the new inspection
 * @param (String) wfTsk: workflow task to update
 * @param (String) wfSts: workflow task status to update wfTsk to
 * @returns {void}
 */
function enfProcessInspResult(iType, iResult, newInsp, newInspDateOrDays, carryOverFailedCheckList, wfTsk, wfSts){
    logDebug("enfProcessInspResult() started");
    try{
        var $iTrc = ifTracer;
        if($iTrc(inspType == iType && iResult == inspResult, 'inspType/inspResult matches')){
            //If newInsp is valid, then try to create inspection
            if($iTrc(newInsp, 'create new inspection')){
                //Get the custom field value
                var custField = null;
                var currDate = aa.util.parseDate(dateAdd(null, 0));
                var numOfDays4Insp = 1; //If unable to parse the custom field, then default inspection to one day ahead.
                if($iTrc(!isNaN(newInspDateOrDays), 'newInspDateOrDays is a number, use this as inspection days'))
                    numOfDays4Insp = parseInt(newInspDateOrDays);
                else if($iTrc(newInspDateOrDays.equalsIgnoreCase("nextWorkDay"), 'nextWorkDay == ' + newInspDateOrDays)){
                    var nextWorkDayDate = dateAddHC2(null, 1, true);
                    numOfDays4Insp = days_between(currDate, aa.util.parseDate(nextWorkDayDate));
                }
                else custField = AInfo[newInspDateOrDays];
                //If the custom field value is valid, then try to parse it to get the number of days
                if($iTrc(custField, custField)){
                    //If custom field is not a number, then it's date, use it to calculat the number of days between today and the date
                    if($iTrc(isNaN(custField), 'custom field ' + newInspDateOrDays + ' is not a number'))
                        numOfDays4Insp = days_between(currDate, aa.util.parseDate(custField));
                    else //the custom field is a number
                        numOfDays4Insp = parseInt(custField);
                }
                
                var nextWD = nextWorkDay(dateAdd(null, numOfDays4Insp - 1));
                numOfDays4Insp = days_between(currDate, aa.util.parseDate(nextWD));
                
                var newInspId = scheduleInspectionCustom(newInsp, numOfDays4Insp);
				
                autoAssignInspectionCoA(newInspId);
				
                if($iTrc(carryOverFailedCheckList && newInspId, 'copy failed checklist items to inspId: ' + newInspId)) {
                    if($iTrc(inspType == "Snow Initial Inspection" && inspResult == "Skip to Summons"))
                        copyCheckListByItemStatus(inspId, newInspId, ["Summons"]);
                    else if($iTrc(inspType == "Snow Initial Inspection" && inspResult == "Skip to City Abatement"))
                        copyCheckListByItemStatus(inspId, newInspId, ["Abate"]);
                    else
                        copyFailedGSItems(inspId, newInspId);
                }
            }
            
            //If workflow task and task status are passed on the parameter, do the update here
            if($iTrc(wfTsk && wfSts, wfTsk + ' && ' + wfSts)){
                if(!isTaskActive(wfTsk)) activateTask(wfTsk);
                
                resultWorkflowTask(wfTsk, wfSts, "Updated via enfProcessInspResult()", "Updated via enfProcessInspResult()");
            }
            
            var irComment = "";
			if(vEventName == "InspectionResultModifyAfter") irComment = inspResultComment;
			else irComment = inspComment
			
            //Add a cap comment to the record
            //Get inspector from inspection
            var inspector = getInspectorByInspID(inspId) == false ? "" : getInspectorByInspID(inspId);
            //Prepare comment text
            var vComment = inspector + " - " + inspResult + " - " + (irComment == null ? "" : irComment);
            var comDate = aa.date.parseDate(inspResultDate);
            var capCommentScriptModel = aa.cap.createCapCommentScriptModel();
            capCommentScriptModel.setCapIDModel(capId);
            capCommentScriptModel.setCommentType("APP LEVEL COMMENT");
            capCommentScriptModel.setSynopsis("");
            capCommentScriptModel.setText(vComment);
            capCommentScriptModel.setAuditUser(currentUserID);
            capCommentScriptModel.setAuditStatus("A");
            capCommentScriptModel.setAuditDate(comDate);
            var capCommentModel = capCommentScriptModel.getCapCommentModel();
            capCommentModel.setDisplayOnInsp("Y"); //Set Apply to Inspection to yes
            aa.cap.createCapComment(capCommentModel);
            logDebug("Comment Added");
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function enfProcessInspResult(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function enfProcessInspResult(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("enfProcessInspResult() ended");
}//END enfProcessInspResult()
// For Housing Incident 
function enfScript350_archiveInspInformation(){
    logDebug("enfScript350_archiveInspInformation() started.");
    try{
        var inspInfoTable = loadASITable("INSPECTION INFORMATION");
        var inspInfoTArchive = "INSP INFORMATION ARCHIVE";
        var rowFieldArray = [];
        
        logDebug("Moving everything from INSPECTION INFORMATION to INSP INSPECTION ARCHIVE");
        for(each in inspInfoTable) {
            
            var aRow = inspInfoTable[each];
            var fieldRow = aa.util.newHashMap();
            
            for(colName in aRow) fieldRow.put(colName, aRow[colName] + "");
            
            rowFieldArray.push(fieldRow);
            
        }
        
        var updateRes = addAppSpecificTableInforsCustom(inspInfoTArchive, capId, rowFieldArray);
        
        removeASITable("INSPECTION INFORMATION");   
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function enfScript350_archiveInspInformation(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function enfScript350_archiveInspInformation(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("enfScript350_archiveInspInformation() ended.");
}//END enfScript350_archiveInspInformation()

// Script 350
function enfScript350_archiveLists(){
    logDebug("enfScript350_archiveLists() started");
    try{
        var bldgIv = loadASITable("BUILDING INSPECTION VIOLATIONS");
        var unitIv = loadASITable("UNIT INSPECTION VIOLATIONS");
        var archiveTable = "BDG INSP VIOLATIONS ARCHIVE";
        var unitArchTable = "UNIT INSP VIOLATIONS ARCHIVE";
        var col2Check = "Corrected";
        var col2Check4Bld = "Area";
        var col2Chk4Tenant = "Room";
        var val2Check = "CHECKED";
        var capIdModel = aa.cap.getCapIDModel(capId.getID1(), capId.getID2(), capId.getID3()).getOutput();
        
        /*****************************************************************************************/
        /* BUILDING INSPECTION VIOLATIONS                                                        */
        /*****************************************************************************************/
        
        logDebug("Copying from BUILDING INSPECTION VIOLATIONS to archive table");
        for(each in bldgIv) {
            var aRow = bldgIv[each];
            
            if(aRow[col2Check] == val2Check || aRow[col2Check4Bld] == "No Violation"){
                var rowFieldArray = [];
                var fieldRow = aa.util.newHashMap();
                fieldRow.put("Inspection Type", inspType);
                fieldRow.put("Inspection Result Date", formatToMMDDYYYY(new Date(inspResultDate)));
                fieldRow.put("Bldg #", aRow["Bldg #"] + "");
                fieldRow.put("Area", aRow["Area"] + "");
                fieldRow.put("Object", aRow["Object"] + "");
                fieldRow.put("Location", aRow["Location"] + "");
                fieldRow.put("Location 2", aRow["Location 2"] + "");
                fieldRow.put("Violation", aRow["Violation"] + "");
                fieldRow.put("24 Hour", aRow["24 Hour"] + "");
                fieldRow.put("Notes", aRow["Notes"] + "");
                fieldRow.put("Corrected", aRow["Corrected"] + "");
                fieldRow.put("Charged?", aRow["Charged?"] + "");
                rowFieldArray.push(fieldRow);
                
                addAppSpecificTableInforsCustom(archiveTable, capId, rowFieldArray);    
            }
        }
        
        var tableName = "BUILDING INSPECTION VIOLATIONS";
        
        var searchConditionMap1 = aa.util.newHashMap(); // Map<columnName, List<columnValue>>
        // Create a List object to add the value of Column.
        var columnName = col2Check;
        var valuesList = aa.util.newArrayList();
        valuesList.add(val2Check);
        searchConditionMap1.put(columnName, valuesList);
        var vl2 = aa.util.newArrayList();
        vl2.add("No Violation");
        searchConditionMap1.put(col2Check4Bld, vl2);
        
        var appSpecificTableInfo = aa.appSpecificTableScript.getAppSpecificTableInfo(capIdModel, tableName, searchConditionMap1/** Map<columnName, List<columnValue>> **/);
        if (appSpecificTableInfo.getSuccess())
        {
            var appSpecificTableModel = appSpecificTableInfo.getOutput().getAppSpecificTableModel();
            var tableFields = appSpecificTableModel.getTableFields(); // List
            if (tableFields != null && tableFields.size() > 0)
            {
                var deleteIDsArray = []; // delete ASIT data rows ID
                for(var i=0; i < tableFields.size(); i++)
                {
                    var fieldObject = tableFields.get(i); // BaseField
                    // get the column name.
                    var columnName = fieldObject.getFieldLabel();
                    // get the value of column
                    var columnValue = fieldObject.getInputValue();
                    // get the row ID 
                    var rowID = fieldObject.getRowIndex();
                    logDebug(columnName + ": " + columnValue + "   rowID: " + rowID);
                    if (!contains(deleteIDsArray, rowID))
                    {
                        deleteIDsArray.push(rowID);
                    }
                }
                deletedAppSpecificTableInfors(tableName, capIdModel, deleteIDsArray);
            }   
        }
        
        /*****************************************************************************************/
        /* UNIT INPSPECTION VIOLATIONS                                                           */
        /*****************************************************************************************/
        
        logDebug("Copying from UNIT INPSPECTION VIOLATIONS to archive table");
        for(each in unitIv) {
            var aRow = unitIv[each];
            
            if(aRow[col2Check] == val2Check || matches(aRow[col2Chk4Tenant], "Tenant Refusal","R. B. R.","Tenant Ill - Pass", "No Violation")){
                var rowFieldArray = [];
                var fieldRow = aa.util.newHashMap();
                fieldRow.put("Inspection Type", inspType);
                fieldRow.put("Inspection Result Date", formatToMMDDYYYY(new Date(inspResultDate)));
                fieldRow.put("Bldg #", aRow["Bldg #"] + "");
                fieldRow.put("Unit #", aRow["Unit #"] + "");
                fieldRow.put("Room", aRow["Room"] + "");
                fieldRow.put("Object", aRow["Object"] + "");
                fieldRow.put("Location", aRow["Location"] + "");
                fieldRow.put("Violation", aRow["Violation"] + "");
				fieldRow.put("24 Hour", aRow["24 Hour"] + "");
                fieldRow.put("Notes", aRow["Notes"] + "");
                fieldRow.put("Corrected", aRow["Corrected"] + "");
                rowFieldArray.push(fieldRow);
                
                addAppSpecificTableInforsCustom(unitArchTable, capId, rowFieldArray);    
            }
        }
        
        var unitViolTn = "UNIT INSPECTION VIOLATIONS";
        
        var searchConditionMap2 = aa.util.newHashMap(); // Map<columnName, List<columnValue>>
        // Create a List object to add the value of Column.
        var columnName = col2Check;
        var valuesList = aa.util.newArrayList();
        valuesList.add(val2Check);
        searchConditionMap2.put(columnName, valuesList);
        var vl3 = aa.util.newArrayList();
        vl3.add("Tenant Refusal");
        vl3.add("R. B. R.");
        vl3.add("Tenant Ill - Pass");
        vl3.add("No Violation");
        searchConditionMap2.put(col2Chk4Tenant, vl3);
        
        var appSpecificTableInfo = aa.appSpecificTableScript.getAppSpecificTableInfo(capIdModel, unitViolTn, searchConditionMap2/** Map<columnName, List<columnValue>> **/);
        if (appSpecificTableInfo.getSuccess())
        {
            var appSpecificTableModel = appSpecificTableInfo.getOutput().getAppSpecificTableModel();
            var tableFields = appSpecificTableModel.getTableFields(); // List
            if (tableFields != null && tableFields.size() > 0)
            {
                var deleteIDsArray4Unit = []; // delete ASIT data rows ID
                for(var i=0; i < tableFields.size(); i++)
                {
                    var fieldObject = tableFields.get(i); // BaseField
                    // get the column name.
                    var columnName = fieldObject.getFieldLabel();
                    // get the value of column
                    var columnValue = fieldObject.getInputValue();
                    // get the row ID 
                    var rowID = fieldObject.getRowIndex();
                    logDebug(columnName + ": " + columnValue + "   rowID: " + rowID);
                    if (!contains(deleteIDsArray4Unit, rowID))
                    {
                        deleteIDsArray4Unit.push(rowID);
                    }
                }
                deletedAppSpecificTableInfors(unitViolTn, capIdModel, deleteIDsArray4Unit);
            }   
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function enfScript350_archiveLists(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function enfScript350_archiveLists(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("enfScript350_archiveLists() ended");
}//END enfScript350_archiveLists()
function enfScript350_inpsCustListBldgInfo(){
    logDebug("enfScript350_inpsCustListBldgInfo() started.");
    try{
        var $iTrc = ifTracer;
        var bldgInspViolsTname = "BUILDING INSPECTION VIOLATIONS";
        var inspectionsTable = "INSPECTION INFORMATION";
        var unitInspViolsTname = "UNIT INSPECTION VIOLATIONS";
        var bldgInspViolTable = [];
        var unitInspViolTable = [];
        var inspectionInfoTblArr = [];
        var bldgNumbers = [];
        var unitNumbers = [];
        var unitsFailedArr = [];
        var numberOfBuildings = 0;
        var numberOfUnits = 0;
        var countedUnits = [];
        var unitsFailed = 0;
        var unitsNoViol = 0
        var unitsNoAccess = 0;
        var unitsNoAccRei = 0;
        //Use these variables to mark each unit as what it is:
        var NO_VIOLATION = "No Violation";
        var FAIL = "Fail";
        var NA = "NA";
        var NA_REINSP = "NA Reinsp"
        bldgInspViolTable = loadASITable(bldgInspViolsTname);
        unitInspViolTable = loadASITable(unitInspViolsTname);
        inspectionInfoTblArr = loadASITable(inspectionsTable);
        
        //Read BUILDING INSPECTION VIOLATIONS TABLE
        if(bldgInspViolTable){
            for(eachRow in bldgInspViolTable){
                var aRow = bldgInspViolTable[eachRow];
                
                var colValue = aRow["Bldg #"] + "";
                if(bldgNumbers.indexOf(colValue) == -1){
                    bldgNumbers.push(colValue);
                    numberOfBuildings++;
                }
            }
            
            for(eachInsp in inspectionInfoTblArr){
                var inspRow = inspectionInfoTblArr[eachInsp];
                inspRow["# of Bldgs Inspected"] = numberOfBuildings + "";
            }
            //updateAsiTableRow(inspectionsTable, "# of Bldgs Inspected", numberOfBuildings);
        }
        
        if(unitInspViolTable){
            for(eachRow in unitInspViolTable){
                
                aRow = unitInspViolTable[eachRow];
                var colValue = aRow["Bldg #"] + aRow["Unit #"] + "";
                var roomCol = aRow["Room"];
                var isCorrected = aRow["Corrected"] == "CHECKED";
                
                //If no Violation is found, then we mark the unit as No Violation
                if(roomCol == "No Violation"){
                    //unitsNoViol++;
                    countedUnits[colValue] = NO_VIOLATION;
                }
                
                //Process Fail units
                if(matches(roomCol, "Basement:","Bedroom 1:","Bedroom 2:","Bedroom 3:",
                                    "Bathroom 1:","Bathroom 2:","Dining Room:","Entire Unit:",
                                    "Hallway:","Kitchen:","Laundry Room:",
                                    "Living Room:","Patio:","Stairs:","Sun Room:")) {
                    
                    //If a Fail unit
                    //Check if it has been marked as No Violation
                    if(countedUnits[colValue] == NO_VIOLATION){
                        //unitsFailed++;
                        //if it has been marked as No Violation
                        // but this new row is not marked as corrected, then mark as Fail
                        if(!isCorrected){
                            countedUnits[colValue] = FAIL;
                        }
                        //Else if Corrected, leave as is
                        //if(isCorrected){
                        //  countedUnits[colValue] = NO_VIOLATION;
                        //}
                    }
                    //If it has not been marked as No Violation
                    if(countedUnits[colValue] != NO_VIOLATION){
                        //if not corrected, mark as fail
                        if(!isCorrected){
                            countedUnits[colValue] = FAIL;
                        }
                        //Else if corrected and not marked as Fail then mark as NO_VIOLATION
                        if(isCorrected && countedUnits[colValue] != FAIL){
                            countedUnits[colValue] = NO_VIOLATION;
                        }
                    }
                    
                }
                
                //If Not a violation or a fail,  then we have a No Access
                if(matches(roomCol, "Tenant Refusal","R. B. R.","Tenant Ill - Pass")) {
                    if(countedUnits[colValue] != NO_VIOLATION && countedUnits[colValue] != FAIL){
                        //unitsNoAccess++;
                        countedUnits[colValue] = NA
                    }
                }
                
                //If not a violation or fail or No Access, then mark as No Access Reinspect
                if(matches(roomCol, "Dog on Premises","Lockout","Tenant Ill - Re-Inspect")){
                    if(countedUnits[colValue] != NO_VIOLATION && countedUnits[colValue] != FAIL && countedUnits[colValue] != NA){
                        //unitsNoAccRei++;
                        countedUnits[colValue] = NA_REINSP;
                    }
                }
            }
            
            //Finally loop through the units and their markings to count the corresponding number of units.
            for(unit in countedUnits){
                var aUnit = countedUnits[unit];
                if(aUnit == NO_VIOLATION) unitsNoViol++;
                if(aUnit == FAIL)         unitsFailed++;
                if(aUnit == NA)           unitsNoAccess++;
                if(aUnit == NA_REINSP)    unitsNoAccRei++;
            }
            
			numberOfUnits = unitsNoViol + unitsFailed + unitsNoAccess + unitsNoAccRei;
			
            for(eachInsp in inspectionInfoTblArr){
                var inspRow = inspectionInfoTblArr[eachInsp];
                if(inspRow["Validated"] == "UNCHECKED"){
                    inspRow["# of Units Inspected"]         = numberOfUnits         + "";
                    inspRow["Units - Passed"]               = unitsNoViol           + "";
                    inspRow["Units - Failed"]               = unitsFailed           + "";
                    inspRow["Units - No Access"]            = unitsNoAccess         + "";
                    inspRow["Units - No Access/Re-Inspect"] = unitsNoAccRei + "";
                }
            }
        }
        
        removeASITable(inspectionsTable);
        addASITable(inspectionsTable, inspectionInfoTblArr);
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function enfScript350_inpsCustListBldgInfo(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function enfScript350_inpsCustListBldgInfo(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("enfScript350_inpsCustListBldgInfo() ended.");
}//END enfScript350_inpsCustListBldgInfo()
function enfScript350_updateCustInspCustList(){
    logDebug("enfScript350_updateCustInspCustList() started");
    try{
		var iType;
		var isDate;
		
		if(ifTracer(matches(vEventName, "InspectionScheduleAfter", "InspectionMultipleScheduleAfter"), 'InspectionScheduleAfter')){
			iType = inspType;
			isDate = inspSchedDate;
		}
		else{
		    iType = arguments[0];
            isDate = arguments[1];			
		}
        
        var $iTrc = ifTracer;
        var inspsTable = "INSPECTION INFORMATION";
        var iTypeColValue = "";
        var tableArr = [];
        var rowExists = false;
        
        tableArr = loadASITable(inspsTable);
        
        if($iTrc(tableArr, 'tableArrx')){
            for(eachRow in tableArr){
                var aRow = tableArr[eachRow];
                for(col in aRow)
                    if(col == "Inspection Type" && (iType + "") == aRow[col]) rowExists = true;
            }
        }
        
        var row = [{colName: 'Inspection Type', colValue: iType},
                   {colName: 'Inspection Date', colValue: formatDteStringToMMDDYYYY(isDate)},
                   {colName: '# of Bldgs Inspected', colValue: "0"},
                   {colName: '# of Units Inspected', colValue: "0"},
                   {colName: 'Units - Passed', colValue: "0"},
                   {colName: 'Units - Failed', colValue: "0"},
                   {colName: 'Units - No Access', colValue: "0"},
                   {colName: 'Units - No Access/Re-Inspect', colValue: "0"}];
        
        //if(!updateAsiTableRow(inspsTable, "Inspection Date", formatDteStringToMMDDYYYY(isDate), { 
        //    capId: capId,
        //    colFilters: [
        //        { colName: "Inspection Type", colValue: iType}
        //    ]})
        //) {
        //    addAsiTableRow(inspsTable, row);
        //}
        
        if($iTrc(!rowExists, 'row does not exits, inserting it'))   
            addAsiTableRow(inspsTable, row);
        if($iTrc(rowExists, 'row exists, updating the "Inspection Date"'))
            updateAsiTableRow(inspsTable, "Inspection Date", formatDteStringToMMDDYYYY(isDate), {
                    capId: capId,
                    colFilters: [
                        { colName: "Inspection Type", colValue: iType}
                    ]});
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function enfScript350_updateCustInspCustList(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function enfScript350_updateCustInspCustList(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("enfScript350_updateCustInspCustList() ended");
}//END enfScript350_updateCustInspCustList();
/*
 * THIS SIMULATES ES6 ARRAY.PROTOTYPE.FIND() --- BUT NOT A PROTOTYPE
 *      ALLOWS YOU TO DEFINE CUSTOM SEARCH CRITERIA BY PASSING A FUNCTION 
 *      IF YOUR FUNCTION CRITERIA = TRUE, IT RETURNS THE OBJECT
 * 
 * EXAMPLE
 *  var item = es6ArrayFind(array, function(itm) {
        return itm.guideItemText == 'Inspect' && itm.guideItemStatus == 'Yes';
    });
*/
function es6ArrayFind(array, callback) {
    if (array === null) {
      throw new TypeError('array cannot be null or undefined');
    } else if (typeof callback !== 'function') {
      throw new TypeError('callback must be a function');
    }
    var list = Object(array);
    // Makes sures is always has an positive integer as length.
    var length = list.length >>> 0;
    var thisArg = arguments[2];
    for (var i = 0; i < length; i++) {
      var element = list[i];
      if ( callback.call(thisArg, element, i, list) ) {
        return element;
      }
    }
  };
  

  

/**
 * finds parent record from an ASI field, check if this parent is of certain type and creates a relation
 * 
 * @param asiFieldName field name to get parent capId from
 * @param parentRequiredType 4 levels record type that parent should match, <b>pass</b> null to ignore
 * 
 * @returns {Boolean} true if parent exist, matches criteria and no errors, false otherwise
 **/
function establishCivilPlanParentRelationship(asiFieldName, parentRequiredType) {
	var olduseAppSpecificGroupName = useAppSpecificGroupName;
	useAppSpecificGroupName = false;
	var asiValue = getAppSpecific(asiFieldName);
	useAppSpecificGroupName = olduseAppSpecificGroupName;

	if (asiValue == null || asiValue == "") {
		logDebug("**WARN Custom Field value is null or empty" + asiFieldName);
		return false;
	}

	var thisParentCapId = aa.cap.getCapID(asiValue);
	if (!thisParentCapId.getSuccess()) {
		logDebug("**WARN " + asiFieldName + " = " + asiValue + " // failed to get ParentCapId:" + thisParentCapId.getErrorMessage());
		return false;
	}//get parent capId success

	thisParentCapId = thisParentCapId.getOutput();
	var thisParentCapModel = aa.cap.getCap(thisParentCapId).getOutput();
	if (thisParentCapModel == null) {
		logDebug("**WARN get parent capModel: " + thisParentCapModel.getErrorMessage());
		return false;
	}

	var parentType = thisParentCapModel.getCapType().getValue();
	if (parentType == null) {
		return false;
	}

	if (parentRequiredType != null && !parentRequiredType.equalsIgnoreCase(parentType)) {
		logDebug("parentRequiredType:" + parentRequiredType + " != parentType:" + parentType);
		return false;
	}

	var childs = getChildren("*/*/*/*", capId);
	if (childs != null && childs.length > 0) {
		logDebug("**WARN this cap has childs:" + capId);
		return false;
	}

	//createAppHierarchy
	var hierarchy = aa.cap.createAppHierarchy(thisParentCapId, capId);
	if (!hierarchy.getOutput()) {
		logDebug("**ERROR hierarchy failed: " + hierarchy.getErrorMessage());
		return false;
	}
	return true;
}
function feeAmount2(feestr, itemCap) {
    var checkStatus = false;
	var statusArray = new Array();

	//get optional arguments
	if (arguments.length > 2) {
		checkStatus = true;
		for (var i = 1; i < arguments.length; i++)
			statusArray.push(arguments[i]);
	}


	var feeTotal = 0;
	var feeResult = aa.fee.getFeeItems(itemCap, feestr, null);
	if (feeResult.getSuccess()) {
		var feeObjArr = feeResult.getOutput();
	} else {
		logDebug("**ERROR: getting fee items: " + feeResult.getErrorMessage());
		return false
	}

	for (ff in feeObjArr) {
		if (feestr.equals(feeObjArr[ff].getFeeCod()) && (!checkStatus || exists(feeObjArr[ff].getFeeitemStatus(), statusArray))) {
            feeTotal += feeObjArr[ff].getFee();
        }
    }

    return feeTotal;
}
function feeExistsGetSeqNbr(feestr) // optional statuses to check for
{
	var checkStatus = false;
	var statusArray = new Array();

	//get optional arguments
	if (arguments.length > 1) {
		checkStatus = true;
		for (var i = 1; i < arguments.length; i++)
			statusArray.push(arguments[i]);
	}

	var feeResult = aa.fee.getFeeItems(capId, feestr, null);
	if (feeResult.getSuccess()) {
		var feeObjArr = feeResult.getOutput();
	} else {
		logDebug("**ERROR: getting fee items: " + capContResult.getErrorMessage());
		return false
	}

	for (ff in feeObjArr)
		if (feestr.equals(feeObjArr[ff].getFeeCod()) && (!checkStatus || exists(feeObjArr[ff].getFeeitemStatus(), statusArray)))
			return feeObjArr[ff].getFeeSeqNbr();

	return false;
} 

function forestryInspectionResultAutomation() {
	if (inspType == "Forestry Inspection" && inspResult == "Complete") {
		var checklist = false;

		var checkListResutArray = loadFIGuideSheetItems(inspId);
		for (i in checkListResutArray) {
			if (checkListResutArray[i] == "Yes") {
				checklist = true;
				break;
			}

		}

		if (checklist == true) {
			closeTask("Inspection Phase", "Complete", "", "");

			var tasks = aa.workflow.getTasks(capId).getOutput();
			for (x in tasks) {
				if (isTaskActive(tasks[x].getTaskDescription())) {
					deactivateTask(tasks[x].getTaskDescription());
				}

			}

		}

	}
	if (inspType == "Forestry Inspection" && inspResult == "Fall Trim") {

		var checklist = false;

		var checkListResutArray = loadFIGuideSheetItems(inspId);
		for (i in checkListResutArray) {
			if (checkListResutArray[i] == "Yes") {
				checklist = true;
				break;
			}
		}

		if (checklist == true) {
			closeTask("Inspection Phase", "Complete", "", "");

			var tasks = aa.workflow.getTasks(capId).getOutput();
			for (x in tasks) {
				if (isTaskActive(tasks[x].getTaskDescription())) {
					deactivateTask(tasks[x].getTaskDescription());
				}
			}
		}
	}
	if (inspType == "Forestry Inspection" && inspResult != "Complete") {

		var now = new Date();
		var treeId = "";
		var diameter = "";
		var inspectionId = "";
		var requestComment = "";
		var updateMap = aa.util.newHashtable();

		//		treeId = getUnitNbrArray(inspId);
		var thisInspection = aa.inspection.getInspection(capId, inspId);
		if (!thisInspection.getSuccess()) {
			logDebug("**WARN failed to get inspection " + inspId + " Err: " + thisInspection.getErrorMessage());
			return false;
		}

		thisInspection = thisInspection.getOutput();

		treeId = thisInspection.getInspection().getActivity().getUnitNBR();
		diameter = thisInspection.getInspection().getActivity().getVehicleID();
		requestComment = thisInspection.getInspection().getRequestComment();

		var schedRes = aa.inspection.scheduleInspection(capId, null, aa.date.parseDate(nextWorkDay(new Date())), null, "Field Crew Inspection", requestComment);

		if (schedRes.getSuccess()) {
			inspectionId = schedRes.getOutput();
		} else {
			logDebug("ERROR: scheduling inspection for TreeID (" + treeId + "): " + schedRes.getErrorMessage());
			return false;
		}

		var newInspection = aa.inspection.getInspection(capId, inspectionId).getOutput();
		if (diameter != null && diameter != "") {
			newInspection.getInspection().getActivity().setVehicleID(diameter);
		}
		if (treeId != null && treeId != "") {
			newInspection.getInspection().getActivity().setUnitNBR(treeId);
		}
		var edit = aa.inspection.editInspection(newInspection);

		//Copy check list with value = yes
		CopyCheckList(inspectionId);
	}
	if (inspType == "Forestry Inspection" && (inspResult == "PR1" || inspResult == "PR2" || inspResult == "PR2" || inspResult == "Other")) {
		updateTask("Inspection Phase", "Complete");
		var tasks = aa.workflow.getTasks(capId).getOutput();
		for (x in tasks) {
			if (isTaskActive(tasks[x].getTaskDescription())) {
				deactivateTask(tasks[x].getTaskDescription());
			}
		}
	}
	if (inspType == "Forestry Inspection" && inspResult == "Forestry Refer to Code") {

		var newCap = createCap("Enforcement/incident/zoning/NA");

		var linkResult = aa.cap.createAppHierarchy(capId, newCap);
		if (linkResult.getSuccess())
			logDebug("Successfully linked to Parent Application ");
		else
			logDebug("**ERROR: linking to parent application parent cap id  " + linkResult.getErrorMessage());

		updateAppStatus("Complete", "By script");

		var tasks = aa.workflow.getTasks(capId).getOutput();
		for (x in tasks) {
			if (isTaskActive(tasks[x].getTaskDescription())) {
				deactivateTask(tasks[x].getTaskDescription());
			}
		}
	}
}

function forestryScript153_forestryReviewInsp(){
    logDebug("forestryScript153_forestryReviewInsp() started");
    try{
        if(ifTracer(matches(inspResult, "Plant", "Plant - Letter"), 'res:Plan/Plant - Letter')){
            if(ifTracer(isTaskActive("Tree Planting Intake"), 'isTaskActive("Tree Planting Intake")'))
                resultWorkflowTask("Tree Planting Intake", "Add to List");
            
            if(ifTracer(!isScheduled("Planting"), 'Planting inspection NOT scheduled')){
                var plantInspId = scheduleInspectionCustom("Planting", 35);
				copyGSItemsByStatusAndSheeType(inspId, plantInspId, ["FORESTRY INSPECTOR"], "Yes");
            }
            
            resultWorkflowTask("Site Review", "Plant");
            activateTask("Property Owner Response");
        }
        
        if(ifTracer(inspResult == "No Plant", 'res: No Plant')){
            resultWorkflowTask("Site Review", "No Plant");
            updateAppStatus("Complete", "Updated via EMSE");
            var wfProcess = getWfProcessCodeByCapId(capId);
            logDebug("Record is complete.  Closing all active tasks for process code: " + wfProcess);
            if(wfProcess) deactivateActiveTasks(wfProcess);
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function forestryScript153_forestryReviewInsp(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function forestryScript153_forestryReviewInsp(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("forestryScript153_forestryReviewInsp() ended");
}//END forestryScript153_forestryReviewInsp
function forestryScript26_check4Dups(){
    try{
        var checkForDups = AInfo["Check for Duplicates"];
        var possibleDupAltIds = "";
        
        if(ifTracer(checkForDups == "CHECKED", 'Checking for duplicates')){
            var capAddResult = aa.cap.getCapListByDetailAddress(AddressStreetName,parseInt(AddressHouseNumber),AddressStreetSuffix,AddressZip,AddressStreetDirection,null);
            if(!capAddResult.getSuccess()) return;
            
            var capIdArray = capAddResult.getOutput();
            
            for (cappy in capIdArray){
                var relCapId = capIdArray[cappy].getCapID();
                var relCap = aa.cap.getCap(relCapId).getOutput();
                // get cap type
                var relType = relCap.getCapType().toString();
                var relStatus = relCap.getCapStatus();
                
                if(relType.startsWith("Forestry/") && matches(relStatus, "Wait List","Assigned","Submitted","Working","No Plant","Planted","Removed","Complete Not Stake", "Complete Staked","Warranty Failed")){
                    possibleDupAltIds += relCapId.getCustomID() + ",";
                }
            }
            
            if(possibleDupAltIds.length > 0){
                cancel = true;
                showMessage = true;
                comment("Possible duplicates: " + possibleDupAltIds.substring(0, possibleDupAltIds.length -1));
            }
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function (). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function (). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
}
/* formatDteStringToMMDDYYYY()
 * takes a string date in the format MM/DD/YYYY
 * it returns a 10 characters long date string if stringDte is not 10 characters long
 * e.g. stringDte == '7/24/2018' it returns '07/24/2018'
 */
function formatDteStringToMMDDYYYY(stringDte){
    var date = new Date(stringDte);
    
    var yyyy = date.getFullYear().toString(),
        mm = (date.getMonth() + 1).toString(),
        dd = date.getDate().toString();

    // CONVERT mm AND dd INTO chars
    var mmChars = mm.split(''),
        ddChars = dd.split('');

    // CONCAT THE STRINGS IN YYYY-MM-DD FORMAT
    return datestring = (mmChars[1] ? mm : "0" + mmChars[0]) + '/' + (ddChars[1] ? dd : "0" + ddChars[0]) + '/' + yyyy;
}
function formatToMMDDYYYY(date) {
    var yyyy = date.getFullYear().toString(),
        mm = (date.getMonth() + 1).toString(),
        dd = date.getDate().toString();

    // CONVERT mm AND dd INTO chars
    var mmChars = mm.split(''),
        ddChars = dd.split('');

    // CONCAT THE STRINGS IN YYYY-MM-DD FORMAT
    return datestring = (mmChars[1] ? mm : "0" + mmChars[0]) + '/' + (ddChars[1] ? dd : "0" + ddChars[0]) + '/' + yyyy;
}
function generateReportForASyncEmail(itemCap, reportName, module, parameters) {
    //returns the report file which can be attached to an email.
    var vAltId;
	var user = currentUserID;   // Setting the User Name
    var report = aa.reportManager.getReportInfoModelByName(reportName);
	var permit;
	var reportResult;
	var reportOutput;
	var vReportName;
    report = report.getOutput();
    report.setModule(module);
    report.setCapId(itemCap);
    report.setReportParameters(parameters);
	
	vAltId = itemCap.getCustomID();
	report.getEDMSEntityIdModel().setAltId(vAltId);
	
    permit = aa.reportManager.hasPermission(reportName, user);
    if (permit.getOutput().booleanValue()) {
        reportResult = aa.reportManager.getReportResult(report);
        if (!reportResult.getSuccess()) {
            logDebug("System failed get report: " + reportResult.getErrorType() + ":" + reportResult.getErrorMessage());
            return false;
        }
        else {
            reportOutput = reportResult.getOutput();
			vReportName = reportOutput.getName();
			logDebug("Report " + vReportName + " generated for record " + itemCap.getCustomID() + ". " + parameters);
            return vReportName;
        }
    }
    else {
        logDebug("Permissions are not set for report " + reportName + ".");
        return false;
    }
}
function generateReportForEmail(itemCap, reportName, module, parameters) {
    //returns the report file which can be attached to an email.
    var vAltId;
	var user = currentUserID;   // Setting the User Name
    var report = aa.reportManager.getReportInfoModelByName(reportName);
	var permit;
	var reportResult;
	var reportOutput;
	var vReportName;
    report = report.getOutput();
    report.setModule(module);
    report.setCapId(itemCap);
    report.setReportParameters(parameters);
	
	vAltId = itemCap.getCustomID();
	report.getEDMSEntityIdModel().setAltId(vAltId);
	
    permit = aa.reportManager.hasPermission(reportName, user);
    if (permit.getOutput().booleanValue()) {
        reportResult = aa.reportManager.getReportResult(report);
        if (!reportResult.getSuccess()) {
            logDebug("System failed get report: " + reportResult.getErrorType() + ":" + reportResult.getErrorMessage());
            return false;
        }
        else {
            reportOutput = reportResult.getOutput();
			vReportName = reportOutput.getName();
			logDebug("Report " + vReportName + " generated for record " + itemCap.getCustomID() + ". " + parameters);
            return vReportName;
        }
    }
    else {
        logDebug("Permissions are not set for report " + reportName + ".");
        return false;
    }
}
function generateWorkOrderEmail(workFlowTask, workflowStatusArray, asiFieldName, emailTemplateName, reportName, rptParams, emailTo, seqType, seqName, maskName) {

	if (wfTask == workFlowTask) {

		var statusMatch = false;

		for (s in workflowStatusArray) {
			if (wfStatus == workflowStatusArray[s]) {
				statusMatch = true;
				break;
			}
		}//for all status options

		if (!statusMatch) {
			return false;
		}

		//Update ASI value
		var autoGenNumber = getNextSequence(seqType, seqName, maskName);
		var olduseAppSpecificGroupName = useAppSpecificGroupName;
		useAppSpecificGroupName = false;
		editAppSpecific(asiFieldName, autoGenNumber);
		useAppSpecificGroupName = olduseAppSpecificGroupName;

		//Send the email with attached report
		var eParams = aa.util.newHashtable();
		addParameter(eParams, "$$WorkOrderNumber$$", autoGenNumber);
		addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(eParams, "$$recordAlias$$", cap.getCapModel().getCapType().getAlias());
		addParameter(eParams, "$$recordStatus$$", cap.getCapModel().getCapStatus());
		addParameter(eParams, "$$balance$$", feeBalance(""));
		addParameter(eParams, "$$wfTask$$", wfTask);
		addParameter(eParams, "$$wfStatus$$", wfStatus);
		addParameter(eParams, "$$wfDate$$", wfDate);
		if (wfComment != null && typeof wfComment !== 'undefined') {
			addParameter(eParams, "$$wfComment$$", wfComment);
		}
		addParameter(eParams, "$$wfStaffUserID$$", wfStaffUserID);
		addParameter(eParams, "$$wfHours$$", wfHours);

		sendEmailWithReport(emailTo, emailTemplateName, reportName, rptParams, eParams);
	} else {
		return false;
	}
	return true;
}

function getACARecordURL(acaUrl) {

    var acaRecordUrl = "";
	var acaUrl = "https://awebdev.aurora.city/CitizenAccess"
    var id1 = capId.ID1;
    var id2 = capId.ID2;
    var id3 = capId.ID3;

    acaRecordUrl = acaUrl + "/urlrouting.ashx?type=1000";
    acaRecordUrl += "&Module=" + cap.getCapModel().getModuleName();
    acaRecordUrl += "&capID1=" + id1 + "&capID2=" + id2 + "&capID3=" + id3;
    acaRecordUrl += "&agencyCode=" + aa.getServiceProviderCode();

    return acaRecordUrl;
}

function getAddress(capId)
{
	capAddresses = null;
	var s_result = aa.address.getAddressByCapId(capId);
	if(s_result.getSuccess())
	{
		capAddresses = s_result.getOutput();
		if (capAddresses == null || capAddresses.length == 0)
		{
			logDebug("WARNING: no addresses on this CAP:" + capId);
			capAddresses = null;
		}
	}
	else
	{
		logDebug("Error: Failed to address: " + s_result.getErrorMessage());
		capAddresses = null;	
	}
	return capAddresses;
}





function getAddressInALine() {

	var capAddrResult = aa.address.getAddressByCapId(capId);
	var addressToUse = null;
	var strAddress = "";
		
	if (capAddrResult.getSuccess()) {
		var addresses = capAddrResult.getOutput();
		if (addresses) {
			for (zz in addresses) {
  				capAddress = addresses[zz];
				if (capAddress.getPrimaryFlag() && capAddress.getPrimaryFlag().equals("Y")) 
					addressToUse = capAddress;
			}
			if (addressToUse == null)
				addressToUse = addresses[0];

			if (addressToUse) {
			    strAddress = addressToUse.getHouseNumberStart();
			    var addPart = addressToUse.getStreetDirection();
			    if (addPart && addPart != "") 
			    	strAddress += " " + addPart;
			    var addPart = addressToUse.getStreetName();
			    if (addPart && addPart != "") 
			    	strAddress += " " + addPart;	
			    var addPart = addressToUse.getStreetSuffix();
			    if (addPart && addPart != "") 
			    	strAddress += " " + addPart;	
			    var addPart = addressToUse.getCity();
			    if (addPart && addPart != "") 
			    	strAddress += " " + addPart + ",";
			    var addPart = addressToUse.getState();
			    if (addPart && addPart != "") 
			    	strAddress += " " + addPart;	
			    var addPart = addressToUse.getZip();
			    if (addPart && addPart != "") 
			    	strAddress += " " + addPart;	
				return strAddress
			}
		}
	}
	return null;
}

function getAddressInALine() {

	var capAddrResult = aa.address.getAddressByCapId(capId);
	var addressToUse = null;
	var strAddress = "";
		
	if (capAddrResult.getSuccess()) {
		var addresses = capAddrResult.getOutput();
		if (addresses) {
			for (zz in addresses) {
  				capAddress = addresses[zz];
				if (capAddress.getPrimaryFlag() && capAddress.getPrimaryFlag().equals("Y")) 
					addressToUse = capAddress;
			}
			if (addressToUse == null)
				addressToUse = addresses[0];

			if (addressToUse) {
			    strAddress = addressToUse.getHouseNumberStart();
			    var addPart = addressToUse.getStreetDirection();
			    if (addPart && addPart != "") 
			    	strAddress += " " + addPart;
			    var addPart = addressToUse.getStreetName();
			    if (addPart && addPart != "") 
			    	strAddress += " " + addPart;	
			    var addPart = addressToUse.getStreetSuffix();
			    if (addPart && addPart != "") 
			    	strAddress += " " + addPart;	
			    var addPart = addressToUse.getCity();
			    if (addPart && addPart != "") 
			    	strAddress += " " + addPart + ",";
			    var addPart = addressToUse.getState();
			    if (addPart && addPart != "") 
			    	strAddress += " " + addPart;	
			    var addPart = addressToUse.getZip();
			    if (addPart && addPart != "") 
			    	strAddress += " " + addPart;	
				return strAddress
			}
		}
	}
	return null;
}


function getAllContactsEmails(){
	var vConObjArry = getContactObjsByCap(capId);
	var emailsString = "";
	for(eachCont in vConObjArry){
		var vConObj = vConObjArry[eachCont];
		var vConRefSeqNbr = vConObj.refSeqNumber;
		//Get contact email
		if (vConObj) {
			conEmail = vConObj.people.getEmail();
			if (conEmail && conEmail != null && conEmail != "") {
				conEmail = conEmail.toUpperCase();
				emailsString += conEmail + ";";
			}
		}
	}
	
	if(emailsString.length > 0) return emailsString.slice(0, -1)
	
    return false;
}
/*--------------------------------------------------------------------------------------------------------------------/
| Start ETW 09/16/14 Added getAppName Function
/--------------------------------------------------------------------------------------------------------------------*/
function getAppName() {
    var itemCap = capId;
    if (arguments.length == 1) itemCap = arguments[0]; // use cap ID specified in args

    capResult = aa.cap.getCap(itemCap)

    if (!capResult.getSuccess())
    { logDebug("**WARNING: error getting cap : " + capResult.getErrorMessage()); return false }

    capModel = capResult.getOutput().getCapModel()

    return capModel.getSpecialText()
}
/*--------------------------------------------------------------------------------------------------------------------/
| End ETW 09/16/14 Added getAppName Function
/--------------------------------------------------------------------------------------------------------------------*/
function getASIgroup(groupName, itemCap) {
	var ret = new Array();
	var appSpecInfoResult = aa.appSpecificInfo.getByCapID(itemCap);
	if (appSpecInfoResult.getSuccess()) {
		var appspecObj = appSpecInfoResult.getOutput();

		if (groupName != "") {
			for (i in appspecObj)
				if (appspecObj[i].getCheckboxType() == groupName) {
					ret.push(appspecObj[i]);
				}
		}
	} else {
		ret = null;
		logDebug("**ERROR: getting app specific info for Cap : " + appSpecInfoResult.getErrorMessage())
	}
	return ret;
}
/*
* WRAPPER AROUND loadASITable - RETURNS NULL OR ARRAY
    colFilters = [
        { colName: 'Abatement #', colValue: capIDString },
        { colnName: 'Type', colValue: AInfo['Abatement Type'] }
    ]
*/
function getAsiTableRows(tableName, options) {
    var settings = {
        capId: capId,
        colFilters: null //array of column values to filter by... null = all rows
    };
    //optional params - overriding default settings
    for (var attr in options) { settings[attr] = options[attr]; }

    var rows = loadASITable(tableName, settings.capId),
        filter,
        matched,
        rtn = [];

    if (rows == undefined || rows == null) {
        return null;    //no table or rows
    }

    if(settings.colFilters != null && settings.colFilters.length > 0) {
        for(var idxRows in rows) {
            matched = true;
            for(var idxFilter in settings.colFilters) {
                filter = settings.colFilters[idxFilter];
                if(filter.colValue != rows[idxRows][filter.colName]) {
                    matched = false;
                }
            }
            if(matched) {
                rtn.push(rows[idxRows]);
            }
        }
        return rtn
    } 

    return rows;
}


function getAssignedDept() {
    try {
        var asgnDept = "";
        var cdScriptObjResult = aa.cap.getCapDetail(capId);
        if (!cdScriptObjResult.getSuccess()) {
            aa.debug("**ERROR: No cap detail script object : ",
                    cdScriptObjResult.getErrorMessage());
            return "";
        }

        var cdScriptObj = cdScriptObjResult.getOutput();
        if (!cdScriptObj) {
            aa.debug("**ERROR: No cap detail script object", "");
            return "";
        }
        cd = cdScriptObj.getCapDetailModel();
        var asgnDept = cd.getAsgnDept();

        return asgnDept;

    } catch (e) {
        aa.debug("getAssignedDept ", e);
        return null;
    }
}
function getAssignedStaff() {
	try {
		var assignedStaff = "";
		var cdScriptObjResult = aa.cap.getCapDetail(capId);
		if (!cdScriptObjResult.getSuccess()) {
			aa.debug("**ERROR: No cap detail script object : ",
					cdScriptObjResult.getErrorMessage());
			return "";
		}

		var cdScriptObj = cdScriptObjResult.getOutput();
		if (!cdScriptObj) {
			aa.debug("**ERROR: No cap detail script object", "");
			return "";
		}
		cd = cdScriptObj.getCapDetailModel();
		assignedStaff = cd.getAsgnStaff();

		return assignedStaff

	} catch (e) {
		aa.debug("getAssignedStaff ", e);
		return null;
	}
}
function getAssignedStaffEmail(){
	var cdScriptObjResult = aa.cap.getCapDetail(capId);
	if (!cdScriptObjResult.getSuccess()) {
		logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage());
        return ""
	}
	var cdScriptObj = cdScriptObjResult.getOutput();
	if (!cdScriptObj) {
		logDebug("**ERROR: No cap detail script object");
		return ""
	}
	var cd = cdScriptObj.getCapDetailModel();
    var	userId=cd.getAsgnStaff();
    if (userId==null) return "";
	var iNameResult = aa.person.getUser(userId);
	var iName = iNameResult.getOutput();
	var email=iName.getEmail();
	return email;
}
function getAssignedStaffFullName(){
	var cdScriptObjResult = aa.cap.getCapDetail(capId);
	if (!cdScriptObjResult.getSuccess()) {
		logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage());
        return ""
	}
	var cdScriptObj = cdScriptObjResult.getOutput();
	if (!cdScriptObj) {
		logDebug("**ERROR: No cap detail script object");
		return ""
	}
	var cd = cdScriptObj.getCapDetailModel();
    var	userId=cd.getAsgnStaff();
    if (userId==null) return "";
	var iNameResult = aa.person.getUser(userId);
	var iName = iNameResult.getOutput();
	var fullName=iName.getFullName();
	return fullName;
}
function getAssignedStaffPhone(){
	var cdScriptObjResult = aa.cap.getCapDetail(capId);
	if (!cdScriptObjResult.getSuccess()) {
		logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage());
        return ""
	}
	var cdScriptObj = cdScriptObjResult.getOutput();
	if (!cdScriptObj) {
		logDebug("**ERROR: No cap detail script object");
		return ""
	}
	var cd = cdScriptObj.getCapDetailModel();
    var	userId=cd.getAsgnStaff();
    if (userId==null) return "";
	var iNameResult = aa.person.getUser(userId);
	var iName = iNameResult.getOutput();
	var phone=iName.getPhoneNumber();
	return phone;
}
function getAssignedStaffTitle(){
	var cdScriptObjResult = aa.cap.getCapDetail(capId);
	if (!cdScriptObjResult.getSuccess()) {
		logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage());
        return ""
	}
	var cdScriptObj = cdScriptObjResult.getOutput();
	if (!cdScriptObj) {
		logDebug("**ERROR: No cap detail script object");
		return ""
	}
	var cd = cdScriptObj.getCapDetailModel();
    var	userId=cd.getAsgnStaff();
    if (userId==null) return "";
	var iNameResult = aa.person.getUser(userId);
	var iName = iNameResult.getOutput();
	var title=iName.getTitle();
	return title;
}
function getAssignInspectorID(inspectorName) {
    var arrInspectorName = inspectorName.split(' ');
    if (arrInspectorName != null && arrInspectorName.length > 0) {
        var firstName = arrInspectorName[0];
        var middleName = null;
        var lastName = arrInspectorName[1];
        var personResult = aa.person.getUser(firstName, middleName, lastName);
        if (personResult.getSuccess()) {
            var objPerson = personResult.getOutput();
            var inspectorID = objPerson.getUserID();
            var inspectorDepartment = objPerson.getDeptOfUser();
            if (typeof (inspectorID) != "undefined" && inspectorID != null && inspectorID != "" && typeof (inspectorDepartment) != "undefined" && inspectorDepartment != null && inspectorDepartment != "")
                updateRecordDetails(inspectorID, inspectorDepartment);
        }
    }
}

function getBalanceByCapId(feestr, feeSch, invoicedOnly, capId) {
    var amtFee = 0,
       amtPaid = 0,
       ff;

    invoicedOnly = (invoicedOnly == undefined || invoicedOnly == null) ? false : invoicedOnly;

    var feeResult = aa.fee.getFeeItems(capId, feestr, null);
    if (feeResult.getSuccess()) {
        var feeObjArr = feeResult.getOutput();
    }
    else {
        logDebug("**ERROR: getting fee items: " + capContResult.getErrorMessage());
        return 999999;
    }

    for (ff in feeObjArr)
        if ((!feestr || feestr.equals(feeObjArr[ff].getFeeCod())) && (!feeSch || feeSch.equals(feeObjArr[ff].getF4FeeItemModel().getFeeSchudle()))) {
            if (!(matches(feeObjArr[ff].feeitemStatus, "VOIDED", "CREDITED"))) {  //if fee is voided or credited - exclude
                if (!invoicedOnly || feeObjArr[ff].feeitemStatus == "INVOICED") {
                    amtFee += feeObjArr[ff].getFee();
                    var pfResult = aa.finance.getPaymentFeeItems(capId, null);
                    if (pfResult.getSuccess()) {
                        var pfObj = pfResult.getOutput();
                        for (ij in pfObj) {
                            if (feeObjArr[ff].getFeeSeqNbr() == pfObj[ij].getFeeSeqNbr()) {
                                amtPaid += pfObj[ij].getFeeAllocation()
                            }
                        }
                        logDebug("feestr=" + feestr + " - " + "status=" + feeObjArr[ff].feeitemStatus + " - " + "amtFee=" + amtFee + " - " + "amtPaid=" + amtPaid);
                    }
                }
                else {
                    logDebug("feestr=" + feestr + ' ---- NOT  Invoiced');
                }
            }
            else {
                logDebug("feestr=" + feestr + ' ---- Voided/Credited');
            }
        }
    return amtFee - amtPaid;
}

/**
 * @param statusDate work flow status date
 * @param daysOut number of days that need to be shifted
 * @returns {String} status date plus the days out
 */
function getCalculatedDate(statusDate, daysOut) {
	var newDate = new Date(statusDate);
	newDate.setDate(newDate.getDate() + parseInt(daysOut));
	var dd = newDate.getDate();
	var mm = newDate.getMonth() + 1;
	var yy = newDate.getFullYear();
	var formatedDate = mm + "/" + dd + "/" + yy;
	return formatedDate;
}
function getCapByAddressN(ats,capId,sOfRequest){
	try{
		var ret=null
		// get address data
		var addResult = aa.address.getAddressByCapId(capId);
		if (addResult.getSuccess()){ 
			var aoArray = addResult.getOutput();  
		}else{ 
			logDebug("**ERROR: getting address by cap ID: " + addResult.getErrorMessage());
			return false; 
			}
		
		if (aoArray.length)	{ 
			var ao = aoArray[0];
			}else{ 
				logDebug("**WARNING: no address for comparison:");
				return false; 
			}
		// get caps with same address
		var capAddResult = aa.cap.getCapListByDetailAddress(ao.getStreetName(),ao.getHouseNumberStart(),ao.getStreetSuffix(),ao.getZip(),ao.getStreetDirection(),null);
		if (capAddResult.getSuccess()){
			var capIdArray=capAddResult.getOutput(); 
		 	}
		else{
			logDebug("**ERROR: getting similar addresses: " + capAddResult.getErrorMessage());
				return false; 
			}
		// loop through related caps
		for (cappy in capIdArray){
			if(capIdArray[cappy].getCustomID() == capId.getCustomID()) { continue; }
			var relcap = aa.cap.getCap(capIdArray[cappy].getCapID()).getOutput();
			// get cap type
			reltype = relcap.getCapType().toString();
						
			var ata = ats.split("/");
			var reltypeN=reltype.split("/");
			if (ata[0]==reltypeN[0] && ata[1]==reltypeN[1]){
				//check status & ASI value
				if (relcap.getCapStatus().toString().equalsIgnoreCase("Wait List") || relcap.getCapStatus().toString().equalsIgnoreCase("Assigned") || relcap.getCapStatus().toString().equalsIgnoreCase("Submitted") || relcap.getCapStatus().toString().equalsIgnoreCase("Working")){
					useAppSpecificGroupName=false;
					var sourceOfReq=getAppSpecific("Source of Request",capIdArray[cappy].getCapID());
					if (typeof(sourceOfReq)!="undefined" && sourceOfReq!=null && sourceOfReq!="" && sourceOfReq.equals(sOfRequest)){
						ret=capIdArray[cappy];
						break;
					}
				}
				
				
			}
			
		}
		
		
		return ret;
		
		}catch(err){
			logDebug("****ERROR IN BATCH_ARBORIST_LICENSE_NO_RENEWAL_SUSPEND_LICENSE:**** " + err);
			return false;
		}
}	

function getCapByParcel(ats,capId,sOfRequest){
	try{
		var ret;
		var capParcelResult = aa.parcel.getParcelandAttribute(capId,null);
		if (capParcelResult.getSuccess())
			{ var Parcels = capParcelResult.getOutput().toArray(); }
		else	
			{ logDebug("**ERROR: getting parcels by cap ID: " + capParcelResult.getErrorMessage()); return false; }
		for (zz in Parcels)
		{
			var ParcelValidatedNumber = Parcels[zz].getParcelNumber();

			// get caps with same parcel
			var capAddResult = aa.cap.getCapListByParcelID(ParcelValidatedNumber,null);
			if (capAddResult.getSuccess())
				{ var capIdArray=capAddResult.getOutput(); }
			else
				{ logDebug("**ERROR: getting similar parcels: " + capAddResult.getErrorMessage());  return false; }
			// loop through related caps
			for (cappy in capIdArray)
				{
				// skip if current cap
				if (capId.getCustomID().equals(capIdArray[cappy].getCustomID()))continue;
				var relcap = aa.cap.getCap(capIdArray[cappy].getCapID()).getOutput();
				// get cap type
				var reltypeN = relcap.getCapType().toString().split("/");
				var ata = ats.split("/");
				if (ata[0]==reltypeN[0] && ata[1]==reltypeN[1]){
					//check status & ASI value
					if (relcap.getCapStatus().toString().equalsIgnoreCase("Wait List") || relcap.getCapStatus().toString().equalsIgnoreCase("Assigned") || relcap.getCapStatus().toString().equalsIgnoreCase("Submitted") || relcap.getCapStatus().toString().equalsIgnoreCase("Working")){
						useAppSpecificGroupName=false;
						var sourceOfReq=getAppSpecific("Source of Request",capIdArray[cappy].getCapID());
						if (typeof(sourceOfReq)!="undefined" && sourceOfReq!=null && sourceOfReq!="" && sourceOfReq.equals(sOfRequest)){
							ret=capIdArray[cappy];
							break;
						}
					}
				
				}
				
				}
			
		}	
		
		return ret;
	}catch(e){
		logDebug("****ERROR IN getCapByParcel " + e);
		return false
		}
}


function getCapFullAddress() {
    var rtnAddress="",
        capAddresses = aa.address.getAddressByCapId(capId);

    if (capAddresses.getSuccess()) {
        capAddresses = capAddresses.getOutput();
        if (capAddresses != null && capAddresses.length > 0) {
            capAddresses = capAddresses[0];
            var rtnAddress = "";
            rtnAddress = capAddresses.getHouseNumberStart() + " ";
            rtnAddress = rtnAddress + capAddresses.getStreetName() + " ";
            rtnAddress = rtnAddress + capAddresses.getCity() + " ";
            rtnAddress = rtnAddress + capAddresses.getState() + " ";
            rtnAddress = rtnAddress + capAddresses.getZip();
            
        }
    }
    return rtnAddress;
}
function getCCs(recipientEmail) {
    var contactList = getPeople(capId);
    var ownersList = getOwner(capId);
    var cc = new Array();

    for (i in contactList) {
        var contact = contactList[i];
        var contactEmail = contact.getEmail();
        if (!isEmpty(contactEmail) && contactEmail != recipientEmail) {
            cc.push(contactEmail);
        }
    }

    for (i in ownersList) {
        var owner = ownersList[i];
        var ownerEmail = owner.getEmail();
        if (!isEmpty(ownerEmail) && ownerEmail != recipientEmail) {
            cc.push(ownerEmail);
        }
    }

    return cc.join(";");
}


function getClosestAvailableMeeting(meetingGroupName, targetDate, startDate, endDate, vMeetingType) {
logDebug("************getClosestAvailableMeeting START");
    try {
	var availables = aa.meeting.getAvailableMeetings(null, 60, meetingGroupName, startDate, endDate, null, null);
	var availMeets = availables.getOutput();
	var closestDays = null;
	var retMeeting = null;
	for (y in availMeets) {
		if ( availMeets[y].meetingType == vMeetingType ) {
			var meetingStartDate = aa.util.formatDate(availMeets[y].startDate, "MM/dd/yyyy");
			var dMSD = new Date(meetingStartDate.toString());
			var tmpTarget = ("0" + targetDate.getMonth()).slice(-2) + "/" 
							+ ("0" + targetDate.getDayOfMonth()).slice(-2) + "/" 
							+ targetDate.getYear();
			tmpTarget = new Date(tmpTarget);
			var daysDiff = Math.abs(dMSD - tmpTarget);
			daysDiff = Math.floor((daysDiff) / (1000*60*60*24));
			if ( (daysDiff < closestDays) || (closestDays ==  null ) ) {
				retMeeting = availMeets[y];
				closestDays = daysDiff;
			}
		}
	}
    } catch (err) {
        logDebug("getClosestAvailableMeeting: A JavaScript Error occured: " + err.message);
    }
	logDebug("getClosestAvailableMeeting: the closest day is "+closestDays+"from the target date of:"+targetDate);
	logDebug("************getClosestAvailableMeeting END");
    return retMeeting;
}

/*
* GETS COMPLETED INSPECTIONS

    OPTIONS: ADDITIONAL OPTIONS YOU NEED FOR FILTERING (CURRENTLY FILTERS BY inspType)
*/
function getCompletedInspections(options) {
    var settings = {
        inspType: null, // if not null, will filter by given inspection type
        capId: capId,
    };
    for (var attr in options) { settings[attr] = options[attr]; } //optional params - overriding default settings

    var completedInspections = [],
        inspResultObj = aa.inspection.getInspections(settings.capId);
      
    if (inspResultObj.getSuccess()) {
        var inspList = inspResultObj.getOutput();
        for (xx in inspList) {
            if(
                (!inspList[xx].getInspectionStatus().toUpperCase().equals("SCHEDULED"))
                && (settings.inspType == null || String(settings.inspType).equals(inspList[xx].getInspectionType()))
            ){
                completedInspections.push(inspList[xx].getInspectionType());
            }
        }
    }    
      
    return completedInspections;
}

function getConfiguredContactTypes() {
	var bizDomScriptResult = aa.bizDomain.getBizDomain('CONTACT TYPE');
	var vContactTypeArray = [];
	var i;
	
	if (bizDomScriptResult.getSuccess()) {
		bizDomScriptArray = bizDomScriptResult.getOutput().toArray();
		
		for (i in bizDomScriptArray) {
			if (bizDomScriptArray[i].getAuditStatus() != 'I') { 
				vContactTypeArray.push(bizDomScriptArray[i].getBizdomainValue());
			}
		}
	}
	
	return vContactTypeArray;
}
function getContactEmailAddress(contType, itemCap){
	var thisContact = getContactByType(contType, itemCap);
	
	if(thisContact)
	var thisContEmailAddr = thisContact.getEmail();
	
	if(thisContEmailAddr) return thisContEmailAddr;
	return false;
}
function getContactName(vConObj) {
	if (vConObj.people.getContactTypeFlag() == "organization") {
		if (vConObj.people.getBusinessName() != null && vConObj.people.getBusinessName() != "")
			return vConObj.people.getBusinessName();
		
		return vConObj.people.getBusinessName2();
	}
	else {
		if (vConObj.people.getFullName() != null && vConObj.people.getFullName() != "") {
			return vConObj.people.getFullName();
		}
		if (vConObj.people.getFirstName() != null && vConObj.people.getLastName() != null) {
			return vConObj.people.getFirstName() + " " + vConObj.people.getLastName();
		}
		if (vConObj.people.getBusinessName() != null && vConObj.people.getBusinessName() != "")
			return vConObj.people.getBusinessName();
	
		return vConObj.people.getBusinessName2();
	}
}
function getContactObjsByCap(itemCap) {
    // optional typeToLoad
    var typesToLoad = false;
    if (arguments.length == 2) {
		typesToLoad = arguments[1];
	}
    var capContactArray = null;
    var cArray = [];
    var yy = 0;

    var capContactResult = aa.people.getCapContactByCapID(itemCap);
    if (capContactResult.getSuccess()) {
        capContactArray = capContactResult.getOutput();
    }

    if (capContactArray) {
        for (yy in capContactArray) {
            //exclude inactive contacts
            if (capContactArray[yy].getPeople().getAuditStatus() == 'I') {
                continue;
            }
            if (!typesToLoad || capContactArray[yy].getPeople().contactType == typesToLoad) {
                cArray.push(new contactObj(capContactArray[yy]));
            }
        }
    }

    return cArray;
}
/*
* GETS CONTACTS

    OPTIONS: ADDITIONAL OPTIONS YOU NEED FOR FILTERING (CURRENTLY FILTERS BY contactType)
*/
function getContacts(options) {
    var settings = {
        capId: capId,
        contactType: null //if not null, filters by contact type
    };
    for (var attr in options) { settings[attr] = options[attr]; } //optional params - overriding default settings


    var contactsByType = [];
	var contactArray = getPeople(settings.capId);

	for (thisContact in contactArray) {
        if (settings.contactType == null || (contactArray[thisContact].getPeople().contactType).toUpperCase() == settings.contactType.toUpperCase()) {
            contactsByType.push(contactArray[thisContact].getPeople())
        }
    }
	return contactsByType;
}

function getContactTypes() {
	var bizDomScriptResult = aa.bizDomain.getBizDomain('CONTACT TYPE');
	var vContactTypeArray = [];
	var i;
	
	if (bizDomScriptResult.getSuccess()) {
		bizDomScriptArray = bizDomScriptResult.getOutput().toArray();
		
		for (i in bizDomScriptArray) {
			if (bizDomScriptArray[i].getAuditStatus() != 'I') { 
				vContactTypeArray.push(bizDomScriptArray[i].getBizdomainValue());
			}
		}
	}
	
	return vContactTypeArray;
}
/* Check Address "County" field first, then if that is null check Parcel "County" field,
   then if that is null check GIS Layer "Parcels" and attribute "PARCEL_COUNTY" looking for field called Arapahoe county
 */
function getCountyFromAddrOrParcel(){
    //check County in address:
    var county = null;
    var addResult = aa.address.getAddressByCapId(capId);
    if (addResult.getSuccess()) {
        var addResult = addResult.getOutput();
        if (addResult != null && addResult.length > 0) {
            addResult = addResult[0];
            county = addResult.getCounty();
        }//has address(es)
    }//get address success

    //still null? try parcel:
    if (county == null || county == "") {
        var parcels = aa.parcel.getParcelByCapId(capId, null);
        if (parcels.getSuccess()) {
            parcels = parcels.getOutput();

            if (parcels != null && parcels.size() > 0) {
                var attributes = parcels.get(0).getParcelAttribute().toArray();
                for (p in attributes) {
                    if (attributes[p].getB1AttributeName().toUpperCase().indexOf("COUNTY") != -1) {
                        county = attributes[p].getB1AttributeValue();
                        break;
                    }
                }//for parcel attributes
            }//cap has parcel
        }//get parcel success
    }//county is null

    //still null? try GIS:
    if (county == null || county == "") {
        var PARCEL_COUNTY = getGISInfo(gisSvcName, gisLayerName, gisAttrName);
        if (PARCEL_COUNTY) {
            county = PARCEL_COUNTY;
        }
    }
	
	return county;
}
function getDocModel4Link(dCategory){
    var vDocumentList = aa.document.getDocumentListByEntity(capId, "CAP");
    if (vDocumentList != null) {
        vDocumentList = vDocumentList.getOutput();
    }
    if (vDocumentList != null) {
        for (y = 0; y < vDocumentList.size(); y++) {
            vDocumentModel = vDocumentList.get(y);
            vDocumentName = vDocumentModel.getFileName();
            vDocumentCat  = vDocumentModel.getDocCategory();
            if (vDocumentCat == dCategory) {
                return vDocumentModel;
            }
        }
    }
    
    return null;
}
/*===========================================
Title : getGISIdForLayer 
Purpose : Returns the GIS Feature ID value that is associated to a record by layer name 
Author : Paul Rose
Functional Area : GIS
Description : This function checks to see if an associated GIS Feature on current record
              exists for a specific layer and returns the GIS Feature ID or false.
Reviewed By : 
Script Type : EMSE
General Purpose/Client Specific : General
Client developed for : 
Parameters : 
	gisLayerID: Text: GIS layer name, found in GIS map layers list
Example: getGISIdForLayer(Parcels);
=========================================== */
function getGISIdForLayer(gisLayerID)
{
	try{
		//logDebug("Looking at CAP " + capId);
		var gisIdForLayer = "";
		var gisObjResult = aa.gis.getCapGISObjects(capId); // get gis objects on the cap
		if (gisObjResult.getSuccess()) 	
			var fGisObj = gisObjResult.getOutput();
		else
			{ logDebug("**WARNING: Getting GIS objects for CAP.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()); }
		
		for (a1 in fGisObj) { // for each GIS object on the Cap
			var gisTypeScriptModel = fGisObj[a1];
			var gisObjArray = gisTypeScriptModel.getGISObjects()
			for (b1 in gisObjArray) {
				var gisObjScriptModel = gisObjArray[b1];
				var gisObjModel = gisObjScriptModel.getGisObjectModel() ;
				//logDebug("GIS Service " + gisObjModel.getServiceID() + " GIS Layer " + gisObjModel.getLayerId() + " GIS Id " + gisObjModel.getGisId())
				if (gisLayerID == gisObjModel.getLayerId()) {
					//logDebug("gisIdForLayer " + gisIdForLayer + " GIS Layer " + gisObjModel.getLayerId() + " GIS Id " + gisObjModel.getGisId())
					gisIdForLayer = gisObjModel.getGisId();
				}
			}
		}
	
		if(typeof(gisIdForLayer) != 'undefined')
		{
			return gisIdForLayer;
		}
		else
		{
			return false;
		}
	}
	catch (err) {
		logDebug("A JavaScript Error occurred: function getGISIdForLayer: " + err.message);
		logDebug(err.stack);
	}
}
/***************************************************************************/
/*===========================================
Title : getGISInfo2 
Purpose : Returns an attribute from a layer in GIS with proximity parameters 
Author : Paul Rose
Functional Area : GIS
Description : Optional parameters for buffer distance allow you to shrink or enlarge
              the GIS feature on the record when overlaying the target layer in GIS.
              Using -1 "feet" will shrink the parcel shape to help eliminate touching
              features that the parcel is not actually within.
Reviewed By : 
Script Type : EMSE
General Purpose/Client Specific : General
Client developed for : 
Parameters : 
	svc: Text:  GIS service name, usually found on the map
	layer: Text: GIS layer name, found in GIS map layers list
	attributename: GIS field name value to be returned
	numDistance: Number: Optional, defaults to zero, distance from parcel to check
	distanceType: One of: feet, meters, miles
Example: getGISInfo2("SANDIEGO", "Community Plan", "CPNAME", -1, "feet");
=========================================== */
function getGISInfo2(svc,layer,attributename) // optional: numDistance, distanceType
{
	try{
	var numDistance = 0
	if (arguments.length >= 4) numDistance = arguments[3]; // use numDistance in arg list
	var distanceType = "feet";
	if (arguments.length == 5) distanceType = arguments[4]; // use distanceType in arg list

	var retString;
   	
	var bufferTargetResult = aa.gis.getGISType(svc,layer); // get the buffer target
	if (bufferTargetResult.getSuccess())
		{
		var buf = bufferTargetResult.getOutput();
		buf.addAttributeName(attributename);
		}
	else
		{ logDebug("**WARNING: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage()) ; return false }
			
	var gisObjResult = aa.gis.getCapGISObjects(capId); // get gis objects on the cap
	if (gisObjResult.getSuccess()) 	
		var fGisObj = gisObjResult.getOutput();
	else
		{ logDebug("**WARNING: Getting GIS objects for Cap.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()) ; return false }

	for (a1 in fGisObj) // for each GIS object on the Cap.  We'll only send the last value
		{
		var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], numDistance, distanceType, buf);

		if (bufchk.getSuccess())
			var proxArr = bufchk.getOutput();
		else
			{ logDebug("**WARNING: Retrieving Buffer Check Results.  Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage()) ; return false }	
		
		for (a2 in proxArr)
			{
			var proxObj = proxArr[a2].getGISObjects();  // if there are GIS Objects here, we're done
			for (z1 in proxObj)
				{
				var v = proxObj[z1].getAttributeValues()
				retString = v[0];
				}
			
			}
		}
	return retString;
	}
	catch (err) {
		logDebug("A JavaScript Error occurred: function getGISInfo2: " + err.message);
		logDebug(err.stack);
	}
}
/***************************************************************************/
/*------------------------------------------------------------------------------------------------------/
|
| Notes   : getGISInfo2ASB(svc,layer,attributename) // optional: numDistance, distanceType
|         : To be called on ApplicationSubmitBefore event
|         : PLEASE ADD COMMENTS HERE IF YOU UPDATE 
/------------------------------------------------------------------------------------------------------*/
/*===========================================
Title : getGISInfoASB2 
Purpose : Returns an attribute from a layer in GIS with proximity parameters 
Author : Paul Rose
Functional Area : GIS
Description : Note: To be used with ApplicationSubmitBefore only.
              Optional parameters for buffer distance allow you to shrink or enlarge the GIS feature
              on the record when overlaying the target layer in GIS. Using -1 "feet" will shrink the
              parcel shape to help eliminate touching features that the parcel is not actually within.
Reviewed By : 
Script Type : EMSE
General Purpose/Client Specific : General
Client developed for : 
Parameters : 
	svc: Text:  GIS service name, usually found on the map
	layer: Text: GIS layer name, found in GIS map layers list
	attributename: GIS field name value to be returned
	numDistance: Number: Optional, defaults to zero, distance from parcel to check
	distanceType: One of: feet, meters, miles
Example: getGISInfo2ASB("SANDIEGO", "City Boundaries", "JURISDICTION", -1, "feet");
=========================================== */
function getGISInfo2ASB(svc,layer,attributename) // optional: numDistance, distanceType
{
	try{	
		var numDistance = 0
		if (arguments.length >= 4) numDistance = arguments[3]; // use numDistance in arg list
		var distanceType = "feet";
		if (arguments.length == 5) distanceType = arguments[4]; // use distanceType in arg list
		var retString;
	   	
		var bufferTargetResult = aa.gis.getGISType(svc,layer); // get the buffer target
		if (bufferTargetResult.getSuccess())
		{
			var buf = bufferTargetResult.getOutput();
			buf.addAttributeName(attributename);
		}
		else
		{ logDebug("**ERROR: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage()) ; return false }
				
		var gisObjResult = aa.gis.getParcelGISObjects(ParcelValidatedNumber); // get gis objects on the parcel number
		if (gisObjResult.getSuccess()) 	
			var fGisObj = gisObjResult.getOutput();
		else
			{ logDebug("**ERROR: Getting GIS objects for Parcel.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()) ; return false }
	
		for (a1 in fGisObj) // for each GIS object on the Parcel.  We'll only send the last value
		{
			var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], numDistance, distanceType, buf);
	
			if (bufchk.getSuccess())
				var proxArr = bufchk.getOutput();
			else
				{ logDebug("**ERROR: Retrieving Buffer Check Results.  Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage()) ; return false }	
			
			for (a2 in proxArr)
			{
				var proxObj = proxArr[a2].getGISObjects();  // if there are GIS Objects here, we're done
				for (z1 in proxObj)
				{
					var v = proxObj[z1].getAttributeValues()
					retString = v[0];
				}
			}
		}
		
		return retString;
	}
	catch (err) {
		logDebug("A JavaScript Error occurred: function getGISInfo2ASB: " + err.message);
		logDebug(err.stack);
	}
}
/***************************************************************************/
/*===========================================
Title : getGISInfoArray2 
Purpose : Returns an array of attributes from a layer in GIS with proximity parameters 
Author : Paul Rose
Functional Area : GIS
Description : Optional parameters for buffer distance allow you to shrink or enlarge
              the GIS feature on the record when overlaying the target layer in GIS.
              Using -1 "feet" will shrink the parcel shape to help eliminate touching
              features that the parcel is not actually within.
Reviewed By : 
Script Type : EMSE
General Purpose/Client Specific : General
Client developed for : 
Parameters : 
	svc: Text:  GIS service name, usually found on the map
	layer: Text: GIS layer name, found in GIS map layers list
	attributename: GIS field name value to be returned
	numDistance: Number: Optional, defaults to zero, distance from parcel to check
	distanceType: One of: feet, meters, miles
Example: getGISInfoArray2("SANDIEGO", "FEMA Floodways & Floodplains","FLD_ZONE",-1,"feet");
=========================================== */
function getGISInfoArray2(svc,layer,attributename) // optional: numDistance, distanceType
{
	try{	
		var numDistance = 0
		if (arguments.length >= 4) numDistance = arguments[3]; // use numDistance in arg list
		var distanceType = "feet";
		if (arguments.length == 5) distanceType = arguments[4]; // use distanceType in arg list
		var retArray = new Array();
	   	
		var bufferTargetResult = aa.gis.getGISType(svc,layer); // get the buffer target
		if (bufferTargetResult.getSuccess())
			{
			var buf = bufferTargetResult.getOutput();
			buf.addAttributeName(attributename);
			}
		else
			{ logDebug("**WARNING: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage()) ; return false }
				
		var gisObjResult = aa.gis.getCapGISObjects(capId); // get gis objects on the cap
		if (gisObjResult.getSuccess()) 	
			var fGisObj = gisObjResult.getOutput();
		else
			{ logDebug("**WARNING: Getting GIS objects for Cap.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()) ; return false }
	
		for (a1 in fGisObj) // for each GIS object on the Cap.  We'll only send the last value
			{
			var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], numDistance, distanceType, buf);
	
			if (bufchk.getSuccess())
				var proxArr = bufchk.getOutput();
			else
				{ logDebug("**WARNING: Retrieving Buffer Check Results.  Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage()) ; return false }	
			
			for (a2 in proxArr)
				{
				var proxObj = proxArr[a2].getGISObjects();  // if there are GIS Objects here, we're done
				for (z1 in proxObj)
					{
					var v = proxObj[z1].getAttributeValues();
					retArray.push(v[0]);
					}
				
				}
			}
		return retArray;
	}
	catch (err) {
		logDebug("A JavaScript Error occurred: function getGISInfoArray2: " + err.message);
		logDebug(err.stack);
	}
}
/***************************************************************************/
/*===========================================
Title : getGISInfoArray_Buffer 
Purpose : Returns an array of attributes from a layer in GIS with proximity parameters
Author : Paul Rose
Functional Area : GIS
Description : Optional parameters for buffer distance allow you to shrink or enlarge
              the GIS feature on the record when overlaying the target layer in GIS.
              Using -1 "feet" will shrink the parcel shape to help eliminate touching
              features that the parcel is not actually within.
Reviewed By : 
Script Type : EMSE
General Purpose/Client Specific : General
Client developed for : 
Parameters : 
	svc: Text:  GIS service name, usually found on the map
	layer: Text: GIS layer name, found in GIS map layers list
	arrAttrName: Array: list of field name(s) values to be returned
	numDistance: Number: Optional, defaults to zero, distance from parcel to check
	distanceType: One of: feet, meters, miles
Example: getGISInfoArray_Buffer("SANDIEGO","FAA Part 77 Noticing Area",["FROMBUFDST","TOBUFDIST","HT"],1,"feet");
=========================================== */
function getGISInfoArray_Buffer(svc,layer,arrAttrName) {
try{
	var numDistance = 0
	if (arguments.length >= 4) numDistance = arguments[3]; // use numDistance in arg list
	var distanceType = "feet";
	if (arguments.length == 5) distanceType = arguments[4]; // use distanceType in arg list
	var retArray = new Array();
   	
	var bufferTargetResult = aa.gis.getGISType(svc,layer); // get the buffer target
	if (bufferTargetResult.getSuccess())
		{
		var buf = bufferTargetResult.getOutput();
		for (xx in arrAttrName)
			buf.addAttributeName(arrAttrName[xx]);
		//var buf = bufferTargetResult.getOutput();
		//for (argnum = 2; argnum < arguments.length; argnum++)
		//	buf.addAttributeName(arguments[argnum]);
		//	logDebug("buf: "+buf);
	}else
		{ logDebug("**WARNING: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage()) ; return false }
			
	var gisObjResult = aa.gis.getCapGISObjects(capId); // get gis objects on the cap
	if (gisObjResult.getSuccess()) 	
		var fGisObj = gisObjResult.getOutput();
	else
		{ logDebug("**WARNING: Getting GIS objects for Cap.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()) ; return false }

	for (a1 in fGisObj) // for each GIS object on the Cap.  We'll only send the last value
	{
		var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], numDistance, distanceType, buf);
		if (bufchk.getSuccess())
			var proxArr = bufchk.getOutput();
		else {
			aa.print("**WARNING: Retrieving Buffer Check Results.  Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage());
			return false
		}
		for (a2 in proxArr) {
			var proxObj = proxArr[a2].getGISObjects(); // if there are GIS Objects here, we're done
			for (z1 in proxObj) {
				var n = proxObj[z1].getAttributeNames();
				var v = proxObj[z1].getAttributeValues();
				var valArray = new Array();
				//
				// 09/18/08 JHS Explicitly adding the key field of the object, since getBufferByRadius will not pull down the key field
				// hardcoded this to GIS_ID
				//
				valArray["GIS_ID"] = proxObj[z1].getGisId()
				for (n1 in n) {
					valArray[n[n1]] = v[n1];
					//logDebug("valArray[n[n1]]: " + valArray[n[n1]]);
				}
				retArray.push(valArray);
			}
		}
	}
	return retArray;
}catch (err) {
	logDebug("A JavaScript Error occurred: getGISInfoArray_Buffer: " + err.message);
	logDebug(err.stack)
}};

/*===========================================
Title : getObjectIdValue 
Purpose : Returns an attribute from a layer in GIS with proximity parameters 
Author : Paul Rose
Functional Area : GIS
Description : Otional parameters for buffer distance allow you to shrink or enlarge
              the GIS feature on the record when overlaying the target layer in GIS.
              Using -1 "feet" will shrink the parcel shape to help eleminate touching
              features that the parcel is not actually within.
Reviewed By : 
Script Type : EMSE
General Purpose/Client Specific : General
Client developed for : 
Parameters : 
	svc: Text:  GIS service name, usually found on the map
	layer: Text: GIS layer name, found in GIS map layers list
Example: getObjectIdValue("KGIS","Intersections");
=========================================== */
function getObjectIdValue(svc,layer) 
{
	try{	
		var retString;
	   	// aa.gis.getCapGISObjects(capId).getOutput()[0].getGISObjects()[0].getGisObjectModel().getGISLayerId();
		var gisObjResult = aa.gis.getCapGISObjects(capId); // get GIS objects on the cap
		if (gisObjResult.getSuccess()) 	
			var fGisObj = gisObjResult.getOutput();
		else
			{ logDebug("**WARNING: Getting GIS objects for Cap.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()) ; return false }
	
		for (a1 in fGisObj) // for each GIS object on the Cap, look for specific layer name to get ID field
			{
			var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], numDistance, distanceType, buf);
	
			if (bufchk.getSuccess())
				var proxArr = bufchk.getOutput();
			else
				{ logDebug("**WARNING: Retrieving Buffer Check Results.  Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage()) ; return false }	
			
			for (a2 in proxArr)
				{
				var proxObj = proxArr[a2].getGISObjects();  // if there are GIS Objects here, we're done
				for (z1 in proxObj)
					{
					var v = proxObj[z1].getAttributeValues()
					retString = v[0];
					}
				
				}
			}
		return retString;
	}
	catch (err) {
		logDebug("A JavaScript Error occurred: function getGISObjectIdValue: " + err.message);
		logDebug(err.stack);
	}
}
/***************************************************************************/
 /* RETURNS AN ARRAY OF [ {com.accela.aa.inspection.guidesheet.GGuideSheetItemModel } ]
     * OPTIONAL FILTERS SUCH AS inspId, guidesheetName, guideTypeName, guideItemName, guideItemValue
     *
     * EXAMPLE - Gets all items for specified inspId, guidelist type, where value = 'Yes'
     *  guideSheets = getGuideSheetItems({
            inspId: inspId,
            guideTypeName: "FORESTRY INSPECTOR",
            guideItemValue: 'Yes'
        });
     * 
    */
   function getGuideSheetItems(options) {
    var settings = {
        capId: capId,
        inspId: null,    // filter by InspId - null for no filtering
        guideTypeName: null,    // filter by guideTypeName - null for no filtering
        guideItemName: null,  // filter by guideItemName (guideItemText) - null for no filtering
        guideItemValue: null  // filter by itemValue (guideItemStatus) - null for no filtering
    };
    //optional params - overriding default settings
    for (var attr in options) { settings[attr] = options[attr]; } 
  
    var returnItems = [],
        inspections = [],
        inspModel,
        inspGuidesheets,
        inspGuidesheetsArray = [],
        inspGuidesheetItemsArray = [];

    inspections = aa.inspection.getInspections(settings.capId).getOutput();

    for (var inspKey in inspections) {
        if (inspections[inspKey].getIdNumber() == settings.inspId || settings.inspId == null) {
            inspModel = inspections[inspKey].getInspection();
            inspGuidesheets = inspModel.getGuideSheets();

            if (inspGuidesheets) {
                inspGuidesheetsArray = inspGuidesheets.toArray();
                for (var gsKey in inspGuidesheetsArray) {
                    if(inspGuidesheetsArray[gsKey].guideType == settings.guideTypeName || settings.guideTypeName == null) {
                        var inspGuidesheetItemsArray = inspGuidesheetsArray[gsKey].getItems().toArray();
                        for (var idx in inspGuidesheetItemsArray) {
                            if(settings.guideItemName == inspGuidesheetItemsArray[idx].guideItemText
                                || settings.guideItemValue == inspGuidesheetItemsArray[idx].guideItemStatus
                                || (settings.guideItemName == null && settings.guideItemValue == null)
                            ) {
                                returnItems.push( inspGuidesheetItemsArray[idx]);
                            }
                        }
                    }
                } 
            }
        } 
    }
    return returnItems;
}

function getIncompleteCapId()  {
    	var s_id1 = aa.env.getValue("PermitId1");
   	var s_id2 = aa.env.getValue("PermitId2");
    	var s_id3 = aa.env.getValue("PermitId3");

    	var result = aa.cap.getCapIDModel(s_id1, s_id2, s_id3);
    	if(result.getSuccess()) {
    		return result.getOutput();
	}  
    	else { logDebug("ERROR: Failed to get capId: " + result.getErrorMessage()); return null; }
}
/*
* GETS INSPECTIONS

    OPTIONS: ADDITIONAL OPTIONS YOU NEED FOR FILTERING (CURRENTLY FILTERS BY inspId, inspType & inspResult)
*/
function getInspections(options) {
    var settings = {
        capId: capId,
        inspId: null, // if not null, will filter by given inspection id
        inspType: null, // if not null, will filter by given inspection type
        inspResult: null // if not null, will filter by given inspection result
    };
    for (var attr in options) { settings[attr] = options[attr]; } //optional params - overriding default settings
    
	var retInspections = [];
	var r = aa.inspection.getInspections(settings.capId);
	if (r.getSuccess()) {
		var inspArray = r.getOutput();

		for (var i in inspArray) {
			if (
                (settings.inspType == null || String(settings.inspType).equals(inspArray[i].getInspectionType()))
                && (settings.inspResult == null || String(settings.inspResult).equals(inspArray[i].getInspectionStatus()))
                && (settings.inspId == null || settings.inspId == inspArray[i].getIdNumber())
            ) {
                retInspections.push(inspArray[i]);
			}
		}
	} 
	return retInspections;
}

//Get inspector by inspection ID
function getInspectorByInspID(iNumber){
        // optional capId
    // updates the inspection and assigns to a new user
    // requires the inspection id and the user name
    // V2 8/3/2011.  If user name not found, looks for the department instead
    //

    var itemCap = capId
    if (arguments.length > 2)
        itemCap = arguments[2]; // use cap ID specified in args

    var iObjResult = aa.inspection.getInspection(itemCap, iNumber);
    if (!iObjResult.getSuccess()) {
        logDebug("**WARNING retrieving inspection " + iNumber + " : " + iObjResult.getErrorMessage());
        return false;
    }
    
    iObj = iObjResult.getOutput();
    inspUserObj = aa.person.getUser(iObj.getInspector().getFirstName(),iObj.getInspector().getMiddleName(),iObj.getInspector().getLastName()).getOutput();
    return inspUserObj.getUserID();
}
function getInspectorID() {
    var inspID;
    var cdScriptObjResult = aa.cap.getCapDetail(capId);
    var objCDScript = cdScriptObjResult.getOutput();
    capDetailModel = objCDScript.getCapDetailModel();
    if (typeof (capDetailModel) != "undefined" && capDetailModel != null)
        inspID = capDetailModel.getAsgnStaff();
        logDebug("Inspector ID: " + inspID);
    return inspID;
}
//Get inspection request by inspection ID
function getInspReqCommsByInspID(iNumber){
        // optional capId
    // updates the inspection and assigns to a new user
    // requires the inspection id and the user name
    // V2 8/3/2011.  If user name not found, looks for the department instead
    //

    var itemCap = capId
    if (arguments.length > 2)
        itemCap = arguments[2]; // use cap ID specified in args

    var iObjResult = aa.inspection.getInspection(itemCap, iNumber);
    if (!iObjResult.getSuccess()) {
        logDebug("**WARNING retrieving inspection " + iNumber + " : " + iObjResult.getErrorMessage());
        return false;
    }
    
    iObj = iObjResult.getOutput();
	iModel = iObj.getInspection();
    return iModel.getRequestComment();
}

//returns object of most recently scheduled inspection
function getLastCreatedInspection(capId, inspectionType, inspectionStatus) {
	//get inspections for this cap (of type inspectionType)
	var capInspections = aa.inspection.getInspections(capId);
	if (!capInspections.getSuccess()) {
		return false;
	}
	capInspections = capInspections.getOutput();

	var schedInspWithMaxId = null;
	//find last one (we created)
	for (i in capInspections) {
		if (capInspections[i].getInspectionType() == inspectionType && capInspections[i].getInspectionStatus() == inspectionStatus) {

			//if multiple scheduled of same type, make sure to get last one (maxID)
			if (schedInspWithMaxId == null || schedInspWithMaxId.getIdNumber() < capInspections[i].getIdNumber()) {
				schedInspWithMaxId = capInspections[i];
			}
		}
	}
	return schedInspWithMaxId;
}
/*
* GETS LAST INSPECTION

    OPTIONS: ADDITIONAL OPTIONS YOU NEED FOR FILTERING (CURRENTLY FILTERS BY inspType & inspResult)
*/
function getLastInspection(options) {
    var settings = {
        capId: capId,
        inspType: null, // if not null, will filter by given inspection type
        inspResult: null // if not null, will filter by given inspection result
    };
    for (var attr in options) { settings[attr] = options[attr]; } //optional params - overriding default settings

    
	var ret = null;
	var r = aa.inspection.getInspections(settings.capId);
	if (r.getSuccess()) {
		var maxId = -1;
		var maxInsp = null;
		var inspArray = r.getOutput();

		for (i in inspArray) {
			if (
                (settings.inspType == null || String(settings.inspType).equals(inspArray[i].getInspectionType()))
                && (settings.inspResult == null || String(settings.inspResult).equals(inspArray[i].getInspectionStatus()))
            ) {
				var id = inspArray[i].getIdNumber();
				if (id > maxId) {
					maxId = id;
					maxInsp = inspArray[i];
				}
			}
		}
		if (maxId >= 0) {
			ret = maxInsp;
		}
	} 
	return ret;
}

/*
* GETS LAST INVOICE

    OPTIONS: ADDITIONAL OPTIONS YOU NEED FOR FILTERING (CURRENTLY FILTERS BY feeCodes & zeroBalanceDue)
*/
function getLastInvoice(options) {
    var settings = {
		capId: capId,
		zeroBalanceDue: false,
		feeCodes: [] //an array of fee codes to filter by [ENF_HI_01, ENF_HI_02] - empty for all fees
    };
    for (var attr in options) { settings[attr] = options[attr]; } //optional params - overriding default settings

	var lastInvoice = null,
		invoice,
		balDue,
		fees,
		fee,
		feefound = false,
		invoices = aa.finance.getInvoiceByCapID(settings.capId, null).getOutput();

	for (var idxInv in invoices) {
		 invoice = invoices[idxInv];
		 balDue = invoice.getInvoiceModel().getBalanceDue();
		if(settings.zeroBalanceDue && balDue > 0) {
			continue;
		}
		if(settings.feeCodes.length > 0) {
			fees = aa.invoice.getFeeItemInvoiceByInvoiceNbr(thisInvoice.getInvNbr()).getOutput();
			feefound = false;
			for (var idxFee in fees) {
				fee = fees[idxFee];
				if(settings.feeCodes.indexOf(fee.feeCode)) {
					feefound = true;
					break;
				}
			}
			if(feefound == false) {
				continue;
			}
		}

		if(lastInvoice == null || lastInvoice.getInvNbr() < invoice.getInvNbr()) {
			lastInvoice = invoice;
		}
	}
	return invoice;
}

    function getMeetings(options) {
        var settings = {
            capId: capId,
            meetingType: null,
            includeHistory: true
        };
        for (var attr in options) { settings[attr] = options[attr]; } //optional params - overriding default settings
    
        var idx,
            filteredMeetings = [],
            allMeetings = aa.meeting.getMeetingsByCAP(settings.capId, settings.includeHistory).getOutput().toArray();
        
        for (idx in allMeetings) {
			if (settings.meetingType == null || allMeetings[idx].meeting.meetingType == settings.meetingType) {
                filteredMeetings.push(allMeetings[idx])
			}
        }
        return filteredMeetings;
    }
    
/**
returns next value of mask/sequence provided
* @param seqType from system Sequence generator (type of seq/mask)
*/
function getNextSequence(seqType, seqName, maskName) {
	try {
		var agencySeqBiz = aa.proxyInvoker.newInstance("com.accela.sg.AgencySeqNextBusiness").getOutput();
		var params = aa.proxyInvoker.newInstance("com.accela.domain.AgencyMaskDefCriteria").getOutput();

		params.setAgencyID(aa.getServiceProviderCode());
		params.setMaskName(maskName);
		params.setRecStatus("A");
		params.setSeqType(seqType);
		params.setSeqName(seqName);

		var seq = agencySeqBiz.getNextMaskedSeq("ADMIN", params, null, null);

		return seq;
	} catch (err) {
		aa.print("error " + err);
		return null;
	}
}
function getOnwertName() {
	var ownArr = getOwner(capId);
	var ownName = "";
	
	if(!ownArr) return ownName;	
	if(ownArr.length == 0) return ownName;
	
	for(each in ownArr){
		anOwn = ownArr[each];
		
	    if(anOwn.getPrimaryOwner() == "Y"){
			if(anOwn.getOwnerFullName() != null && anOwn.getOwnerFullName() != "" && anOwn.getOwnerFullName() != undefined)
				return  anOwn.getOwnerFullName();
			
			if(anOwn.getOwnerFirstName() != null && anOwn.getOwnerFirstName() != "" && anOwn.getOwnerFirstName() != undefined &&
			   anOwn.getOwnerLastName() != null && anOwn.getOwnerLastName() != "" && anOwn.getOwnerLastName() != undefined)
			   return anOwn.getOwnerFirstName() + " " + anOwn.getOwnerLastName();
		}
		else{
			if(anOwn.getOwnerFullName() != null && anOwn.getOwnerFullName() != "" && anOwn.getOwnerFullName() != undefined)
				ownName = anOwn.getOwnerFullName();
			
			if(anOwn.getOwnerFirstName() != null && anOwn.getOwnerFirstName() != "" && anOwn.getOwnerFirstName() != undefined &&
			   anOwn.getOwnerLastName() != null && anOwn.getOwnerLastName() != "" && anOwn.getOwnerLastName() != undefined)
			   ownName = anOwn.getOwnerFirstName() + " " + anOwn.getOwnerLastName();
		}
	}
	
	return ownName;
}

function getOwner(capId) {
    capOwnerArr = null;
    var s_result = aa.owner.getOwnerByCapId(capId);
    if (s_result.getSuccess()) {
        capOwnerArr = s_result.getOutput();
        if (capOwnerArr == null || capOwnerArr.length == 0) {
            aa.print("WARNING: no Owner on this CAP:" + capId);
            capOwnerArr = null;
        }
    } else {
        aa.print("ERROR: Failed to Owner: " + s_result.getErrorMessage());
        capOwnerArr = null;
    }
    return capOwnerArr;
}
function getParcelOwnersBySQL(vParcelNbr) {
	//Correct parcel number if it has "-" within.
	if (vParcelNbr.indexOf("-") != -1) {
		vParcelNbr = vParcelNbr.replace(/-/g,"");
	}

	////Read
	var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
	var ds = initialContext.lookup("java:/AA");
	var conn = ds.getConnection();

	//var vRtField = "a.L1_OWNER_NBR,b,SOURCE_SEQ_NBR,b.L1_EVENT_ID,b.L1_PRIMARY_OWNER,b.L1_OWNER_STATUS,b.L1_OWNER_FULL_NAME,b.L1_OWNER_TITLE,b.L1_OWNER_FNAME,b.L1_OWNER_MNAME,b.L1_OWNER_LNAME,b.L1_TAX_ID,b.L1_ADDRESS1,b.L1_ADDRESS2,b.L1_ADDRESS3,b.L1_CITY,b.L1_STATE,b.L1_ZIP,b.L1_COUNTRY,b.L1_PHONE,b.L1_FAX,b.L1_MAIL_ADDRESS1,b.L1_MAIL_ADDRESS2,b.L1_MAIL_ADDRESS3,b.L1_MAIL_CITY,b.L1_MAIL_STATE,b.L1_MAIL_ZIP,b.L1_MAIL_COUNTRY,b.L1_UDF1,b.L1_UDF2,b.L1_UDF3,b.L1_UDF4,b.GA_IVR_PIN,b.L1_EMAIL,b.EXT_UID,b.L1_PHONE_COUNTRY_CODE,b.L1_FAX_COUNTRY_CODE,b.REC_DATE,b.REC_FUL_NAM,b.REC_STATUS";
	var vRtField = "*";
	
	var selectString = "select " + vRtField + " from XPAROWNR a inner join L3OWNERS b on a.SOURCE_SEQ_NBR = b.SOURCE_SEQ_NBR and a.L1_OWNER_NBR = b.L1_OWNER_NBR where a.SOURCE_SEQ_NBR = '1' and a.L1_PARCEL_NBR = '" + vParcelNbr + "'";
	var sStmt = conn.prepareStatement(selectString);
	var rSet = sStmt.executeQuery();
	//var retVal;
	//var retArr = [];
	var ownArr = [];
	var x = 0;
	var vOwnerModel;
	while (rSet.next()) {
		//retVal = rSet.getString('L1_OWNER_NBR');
		//retArr.push(retVal);
		// convert to capOwnerScriptModel
		vOwnerModel = aa.owner.getCapOwnerScriptModel().getOutput();
		vOwnerModel.setL1OwnerNumber(rSet.getString('L1_OWNER_NBR'));
		vOwnerModel.setAddress1(rSet.getString('L1_ADDRESS1'));
		vOwnerModel.setAddress2(rSet.getString('L1_ADDRESS2'));
		vOwnerModel.setAddress3(rSet.getString('L1_ADDRESS3'));
		vOwnerModel.setCity(rSet.getString('L1_CITY'));
		vOwnerModel.setCountry(rSet.getString('L1_COUNTRY'));
		vOwnerModel.setEmail(rSet.getString('L1_EMAIL'));
		vOwnerModel.setFax(rSet.getString('L1_FAX'));
		vOwnerModel.setMailAddress1(rSet.getString('L1_MAIL_ADDRESS1'));
		vOwnerModel.setMailAddress2(rSet.getString('L1_MAIL_ADDRESS2'));
		vOwnerModel.setMailAddress3(rSet.getString('L1_MAIL_ADDRESS3'));
		vOwnerModel.setMailCity(rSet.getString('L1_MAIL_CITY'));
		vOwnerModel.setMailCountry(rSet.getString('L1_MAIL_COUNTRY'));
		vOwnerModel.setMailState(rSet.getString('L1_MAIL_STATE'));
		vOwnerModel.setMailZip(rSet.getString('L1_MAIL_ZIP'));
		vOwnerModel.setOwnerFirstName(rSet.getString('L1_OWNER_FNAME'));
		vOwnerModel.setOwnerFullName(rSet.getString('L1_OWNER_FULL_NAME'));
		vOwnerModel.setOwnerLastName(rSet.getString('L1_OWNER_LNAME'));
		vOwnerModel.setOwnerMiddleName(rSet.getString('L1_OWNER_MNAME'));
		vOwnerModel.setOwnerStatus(rSet.getString('L1_OWNER_STATUS'));
		vOwnerModel.setOwnerTitle(rSet.getString('L1_OWNER_TITLE'));
		vOwnerModel.setPhone(rSet.getString('L1_PHONE'));
		vOwnerModel.setPrimaryOwner(rSet.getString('L1_PRIMARY_OWNER'));
		vOwnerModel.setState(rSet.getString('L1_STATE'));
		vOwnerModel.setTaxID(rSet.getString('L1_TAX_ID'));
		vOwnerModel.setUID(rSet.getString('EXT_UID'));
		vOwnerModel.setZip(rSet.getString('L1_ZIP'));
		ownArr.push(vOwnerModel);
	}
	sStmt.close();
	conn.close();
	
	return ownArr;
}

function getPendingInspectionID() {
    var inspID;
    var objInspResult = aa.inspection.getInspections(capId);
    if (objInspResult.getSuccess()) {
        var listInspection = objInspResult.getOutput();
        for (l in listInspection) {
            var inspectionType = listInspection[l].getInspectionType();
            var inspectionStatus = listInspection[l].getInspectionStatus();
            if (typeof (inspectionType) != "undefined" && inspectionType != null && inspectionType != "" && typeof (inspectionStatus) != "undefined" && inspectionStatus != null && inspectionStatus != "") {
                if (inspectionType.toLowerCase() == "forestry inspection" && inspectionStatus.toLowerCase() == "pending") {
                    var inspID = listInspection[l].getIdNumber();
                    break;
                }
            }
        }
    }

    return inspID;
}


function getPendingInspections(ret) {
	// returns associative array 
	var inspResultObj = aa.inspection.getInspections(capId);
	if (inspResultObj.getSuccess()) {
		inspList = inspResultObj.getOutput();
		ret["Electrical Final"] = 0;
		ret["Electrical Rough"] = 0;
		ret["Mechanical Final"] = 0;
		ret["Mechanical Rough"] = 0;
		ret["Plumbing Final"] = 0;
		ret["Plumbing Rough"] = 0;
		ret["Framing Final"] = 0;
		ret["Framing Rough"] = 0;

		for (xx in inspList) {
			if (inspList[xx].getInspectionStatus().toUpperCase().equals("PENDING")) {
				if (ret["Electrical Final"] == 0 && String(inspList[xx].getInspectionType()).equalsIgnoreCase("Electrical Final"))
					ret["Electrical Final"] = 1
				if (ret["Electrical Rough"] == 0 && String(inspList[xx].getInspectionType()).equalsIgnoreCase("Electrical Rough"))
					ret["Electrical Rough"] = 1

				if (ret["Mechanical Final"] == 0 && String(inspList[xx].getInspectionType()).equalsIgnoreCase("Mechanical Final"))
					ret["Mechanical Final"] = 1
				if (ret["Mechanical Rough"] == 0 && String(inspList[xx].getInspectionType()).equalsIgnoreCase("Mechanical Rough"))
					ret["Mechanical Rough"] = 1

				if (ret["Plumbing Final"] == 0 && String(inspList[xx].getInspectionType()).equalsIgnoreCase("Plumbing Final"))
					ret["Plumbing Final"] = 1
				if (ret["Plumbing Rough"] == 0 && String(inspList[xx].getInspectionType()).equalsIgnoreCase("Plumbing Rough"))
					ret["Plumbing Rough"] = 1

				if (ret["Framing Final"] == 0 && String(inspList[xx].getInspectionType()).equalsIgnoreCase("Framing Final"))
					ret["Framing Final"] = 1
				if (ret["Framing Rough"] == 0 && String(inspList[xx].getInspectionType()).equalsIgnoreCase("Framing Rough"))
					ret["Framing Rough"] = 1
			}
		}

	}
}
/*--------------------------------------------------------------------------------------------------------------------/
| Start ETW 12/3/14 getPeople3_0
/--------------------------------------------------------------------------------------------------------------------*/
function getPeople3_0(capId) {
    capPeopleArr = null;
    var s_result = aa.people.getCapContactByCapID(capId);
    if (s_result.getSuccess()) {
        capPeopleArr = s_result.getOutput();
        if (capPeopleArr != null || capPeopleArr.length > 0) {
            for (loopk in capPeopleArr) {
                var capContactScriptModel = capPeopleArr[loopk];
                var capContactModel = capContactScriptModel.getCapContactModel();
                var peopleModel = capContactScriptModel.getPeople();
                var contactAddressrs = aa.address.getContactAddressListByCapContact(capContactModel);
                if (contactAddressrs.getSuccess()) {
                    var contactAddressModelArr = convertContactAddressModelArr(contactAddressrs.getOutput());
                    peopleModel.setContactAddressList(contactAddressModelArr);
                }
            }
        }
        else {
            logDebug("WARNING: no People on this CAP:" + capId);
            capPeopleArr = null;
        }
    }
    else {
        logDebug("ERROR: Failed to People: " + s_result.getErrorMessage());
        capPeopleArr = null;
    }
    return capPeopleArr;
}
/*--------------------------------------------------------------------------------------------------------------------/
| End ETW 12/3/14 getPeople3_0
/--------------------------------------------------------------------------------------------------------------------*/
/**
 * Calculates date of N working days before a date
 * @param fromDate {Date} date to calculate from
 * @param numOfDays working days number
 * @returns {Date} date of N working days before fromDate 
 */
function getPrevWorkingDays(fromDate, numOfDays) {
	var prev = null;
	while (numOfDays-- != 0) {
		var getFrom = aa.date.getScriptDateTime(fromDate);
		prev = aa.calendar.getPreviousWorkDay(getFrom);
		prev = prev.getOutput();
		fromDate = prev;
	}
	return prev;
}
function getPrimaryOwnerEmail(){
	capOwnerResult = aa.owner.getOwnerByCapId(capId);

	if (capOwnerResult.getSuccess()) {
		owner = capOwnerResult.getOutput();

		for (o in owner) {
			thisOwner = owner[o];
			if (thisOwner.getPrimaryOwner() == "Y") {
				var oEmail = thisOwner.getEmail();
			    if(oEmail != null && oEmail != "" && oEmail != undefined)
				    return oEmail;
			}
		}
	}
	
	return false;
}//END getPrimaryOwnerEmail
function getPrimaryOwnerFirstAndLastName(){
	capOwnerResult = aa.owner.getOwnerByCapId(capId);

	if (capOwnerResult.getSuccess()) {
		owner = capOwnerResult.getOutput();

		for (o in owner) {
			thisOwner = owner[o];
			if (thisOwner.getPrimaryOwner() == "Y") {
			    if(thisOwner.getOwnerFirstName()) return thisOwner.getOwnerFirstName() + thisOwner.getOwnerLastName();
			}
		}
	}
	
	return "";
}//END getPrimaryOwnerFirstAndLastName
function getPrimaryOwnerFullName(){
	capOwnerResult = aa.owner.getOwnerByCapId(capId);

	if (capOwnerResult.getSuccess()) {
		owner = capOwnerResult.getOutput();

		for (o in owner) {
			thisOwner = owner[o];
			if (thisOwner.getPrimaryOwner() == "Y") {
			    return thisOwner.getOwnerFullName();
			}
		}
	}
	
	return "";
}//END getPrimaryOwnerFullName
function getPrimaryParcel() {
	try {
		//get parcel(s) by capid
		var parcels = aa.parcel.getParcelDailyByCapID(capId, null);

		if (parcels.getSuccess()) {
			parcels = parcels.getOutput();
			if (parcels == null || parcels.length == 0) {
				aa.print("No parcels available for this record");
			} else {
				for (cnt in parcels) {
					if (parcels[cnt].getPrimaryParcelFlag() == "Y") {
						return parcels[cnt].getParcelNumber();
					}
				}
			}
		}
		return null;
	} catch (err) {
		logDebug("A JavaScript Error occurred in custom function getPrimaryParcel(): " + err.message);
		//aa.print("A JavaScript Error occurred in custom function getPrimaryParcel(): " + err.message);
	}
}

function getPrimaryParcelAttributesAndUpdateCustomField(stdForestryInspectorAssignments) {
    
/* commented out, vArea is not as complex
	var vTownship = getGISInfoArray("AURORACO", "Parcels", "PARCEL_JURISDICTION");
	var vRange = getGISInfoArray("AURORACO", "Parcels", "SHAPE.area");
	var vSection = getGISInfoArray("AURORACO", "Parcels", "SHAPE.len");
	var vArea;
	//  Assume only one return
	if (vTownship.length > 0 && vRange.length > 0 && vSection.length > 0) {
		// Format Data
		vArea = vTownship[0] + " " + vRange[0] + " " + "0" + " " + vSection[0];
		logDebug("Area: " + vArea);
		//Save to ASI field
		editAppSpecific("Area Number", vArea); 
	}
*/
	var capParcelResult = aa.parcel.getParcelByCapId(capId, null);
    if (capParcelResult.getSuccess()) {
        var arrParcels = capParcelResult.getOutput().toArray();
        for (var p in arrParcels) {
            var isPrimaryParcel = arrParcels[p].isPrimaryParcel();
            if (isPrimaryParcel) {
                var township = arrParcels[p].getTownship();
                var range = arrParcels[p].getRange();
                var section = arrParcels[p].getSection();
                //var areaNumberValue = township + range +  "0" + section ;
               
                var areaNo = arrParcels[p].getInspectionDistrict();
                var trs = township + range + section;
                if ((typeof (areaNo) != "undefined" && areaNo != null && areaNo != "") || (typeof (trs) != "undefined" && trs != null && trs != "")) {
                    mapAreaTRSAssignmentInspectors(areaNo, trs, stdForestryInspectorAssignments);
					
					// Get GIS Information
					var vArea = getGISInfoArray("AURORACO", "Forestry Index Mapbook Poly", "TRS_NO");
					for (i in vArea) {
						logDebug("Area: " + vArea[i]);
					}
					//Save to ASI field
					editAppSpecific("Area Number", vArea);
				}
            }
        }
    }
}
   
function getPrimLPEmailByCapId(itemCap){
    var capLps = getLicenseProfessional(itemCap);
    
    for(eachLp in capLps){
        var lp = capLps[eachLp];
        
        if(lp.getPrintFlag() == "Y") return lp.getEmail();
    }
    
	if(capLps) return capLps[0].getEmail();
	
	return null;
}
function getRecordsModule(vCapId) {
	var vCap = aa.cap.getCap(vCapId);
	var vModule = "";
	if (vCap.getSuccess()) {
		vCap = vCap.getOutput();
		vModule = vCap.getCapModel().getModuleName();
	}
	return vModule;
}
function getRenewalCapByParentCapIDForIncomplete(parentCapid) {
	if (parentCapid == null || aa.util.instanceOfString(parentCapid)) {
		return null;
	}
	//1. Get parent license for review
	var result = aa.cap.getProjectByMasterID(parentCapid, "Renewal", "Incomplete");
	if (result.getSuccess()) {
		projectScriptModels = result.getOutput();
		if (projectScriptModels == null || projectScriptModels.length == 0) {
			logDebug("ERROR: Failed to get renewal CAP by parent CAPID(" + parentCapid + ") for review");
			return null;
		}
		//2. return parent CAPID.
		projectScriptModel = projectScriptModels[0];
		return projectScriptModel;
	} else {
		logDebug("ERROR: Failed to get renewal CAP by parent CAP(" + parentCapid + ") for review: " + result.getErrorMessage());
		return null;
	}
}

function getSourceGuideSheetList() {
	var guideSheetList = aa.util.newArrayList();
	var itemsResult = aa.inspection.getInspections(capId);
	if (itemsResult.getSuccess()) {
		var inspectionScriptModels = itemsResult.getOutput();
		for ( var k in inspectionScriptModels) {
			if (inspectionScriptModels[k].getIdNumber() == inspId) {
				var inspectionModel = inspectionScriptModels[k].getInspection();
				var gGuideSheetModels = inspectionModel.getGuideSheets();
				if (gGuideSheetModels) {
					for (var i = 0; i < gGuideSheetModels.size(); i++) {
						var guideSheetItemList = aa.util.newArrayList();
						var gGuideSheetModel = gGuideSheetModels.get(i);
						var guideSheetNumber = gGuideSheetModel.getGuidesheetSeqNbr();

						var gGuideSheetItemModels = gGuideSheetModel.getItems();
						if (gGuideSheetItemModels) {
							for (var j = 0; j < gGuideSheetItemModels.size(); j++) {
								var gGuideSheetItemModel = gGuideSheetItemModels.get(j);
								if ((gGuideSheetItemModels.get(j).getGuideItemStatus() == "Yes") && (gGuideSheetItemModels.get(j).getGuideItemText() != "Inspect")) {
									guideSheetItemList.add(gGuideSheetItemModel);
								}
							}
						}

						if (guideSheetItemList.size() > 0) {
							var gGuideSheet = gGuideSheetModel.clone();
							gGuideSheet.setItems(guideSheetItemList);
							guideSheetList.add(gGuideSheet);
						}
					}
				} else {
					logDebug("There is no guideSheets from this inspection: " + inspId);
				}
			}
		}
	}
	return guideSheetList;
}

//**************************************************************************
//Function		getTaskAssignedStaff
//Desc:			given a workflow task, return the staff object that has been
// 				assigned to the task.
//
//input:		wfstr: the workflow task name (string)
//				process name (string) [optional]
//
//returns:		people object 
//
//Created By: Silver Lining Solutions
//**************************************************************************
function getTaskAssignedStaff(wfstr) // optional process name
{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 2) {
		processName = arguments[1]; // subprocess
		useProcess = true;
	}

	var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, null, null);
	
	if (workflowResult.getSuccess()) {
		var wfObj = workflowResult.getOutput();
	}
	else {
		aa.print("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		var fTask = wfObj[i];

		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) 
		{
			var aStaff = fTask.getAssignedStaff();
			var staffObj = aa.person.getUser(aStaff.firstName, "", aStaff.lastName).getOutput(); 

			return(staffObj);
		}
	}
}

function getTaskSpecific(wfName, itemName) { // optional: itemCap
	var i = 0;
	var itemCap = capId;
	if (arguments.length == 4)
		itemCap = arguments[3]; // use cap ID specified in args

	//
	// Get the workflows
	//
	var workflowResult = aa.workflow.getTasks(itemCap);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logDebug("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage());
		return false;
	}

	//
	// Loop through workflow tasks
	//
	for (i in wfObj) {
		var fTask = wfObj[i];
		var stepnumber = fTask.getStepNumber();
		var processID = fTask.getProcessID();
		if (wfName.equals(fTask.getTaskDescription())) { // Found the right Workflow Task
			var TSIResult = aa.taskSpecificInfo.getTaskSpecifiInfoByDesc(itemCap, processID, stepnumber, itemName);
			if (TSIResult.getSuccess()) {
				var TSI = TSIResult.getOutput();
				if (TSI != null) {
					var TSIArray = new Array();
					var TSInfoModel = TSI.getTaskSpecificInfoModel();
					var itemValue = TSInfoModel.getChecklistComment();
					return itemValue;
				} else {
					logDebug("No task specific info field called " + itemName + " found for task " + wfName);
					return false;
				}
			} else {
				logDebug("**ERROR: Failed to get Task Specific Info objects: " + TSIResult.getErrorMessage());
				return false;
			}
		} // found workflow task
	} // each task
	return false;
}
function getTaskStatusDate(vWfTask, vWfStatus) // optional process name, capId
{
	var itemCap = capId;
	var useProcess = false;
	var processName = "";
	var workflowResult;
	var wfObj;
	var fTask;
	var vStatusDate;
	var vStatusDate_mm;
	var vStatusDate_dd
	var vStatusDate_yyyy;
	var vStatusDateString;
	var vReturn = false;

	if (arguments.length == 3) {
		itemCap = arguments[2]; // use cap ID specified in args
	}

	if (arguments.length > 2 && arguments[2] != null) {
		processName = arguments[2]; // subprocess
		useProcess = true;
	}

	workflowResult = aa.workflow.getWorkflowHistory(itemCap, vWfTask, null);
	if (workflowResult.getSuccess())
		wfObj = workflowResult.getOutput();
	else {
		logDebug("**ERROR: Failed to get workflow object");
		return false;
	}

	for (i in wfObj) {
		fTask = wfObj[i];
		logDebug("1) " + fTask.getTaskDescription());
		logDebug("2) " + fTask.getDisposition());
		if (fTask.getTaskDescription().toUpperCase().equals(vWfTask.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName)) && (fTask.getDisposition().toUpperCase().equals(vWfStatus.toUpperCase()))) {
			if (fTask.getStatusDate() != null) {
				vStatusDate = fTask.getStatusDate();
				vStatusDate_mm = vStatusDate.getMonth() + 1;
				vStatusDate_mm = (vStatusDate_mm < 10) ? '0' + vStatusDate_mm : vStatusDate_mm;
				vStatusDate_dd = vStatusDate.getDate();
				vStatusDate_dd = (vStatusDate_dd < 10) ? '0' + vStatusDate_dd : vStatusDate_dd;
				vStatusDate_yyyy = vStatusDate.getYear() + 1900;
				vStatusDateString = vStatusDate_mm + "/" + vStatusDate_dd + "/" + vStatusDate_yyyy;
				vReturn = true;
			} 
		}
	}
	if (vReturn == true) {
		return vStatusDateString;
	} else {
		return false;
	}
}
function getUserDefaultModule(pUserName) {
	var vUserProfileValue = aa.userright.getUserProfileValue(pUserName,"Default Module");
	var x = 0;
	if (vUserProfileValue.getSuccess() && vUserProfileValue.getOutput() != null) {
		vUserProfileValue = vUserProfileValue.getOutput();
		if (vUserProfileValue.getServerConstantValue() != null) {
			return vUserProfileValue.getServerConstantValue();
		} else {
			logDebug("User " + pUserName + " does not have a default module configured.");
			return false;
		}
	} else {
		logDebug("Failed to get default user module for user ID: " + pUserName);
		return false;
	}
}

function getWfProcessCodeByCapId(itemCap){
var workflowResult = aa.workflow.getTaskItemByCapID(itemCap,null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage());
		//return false;
	}

	for (i in wfObj) {
		var fTask = wfObj[i];
		var process = fTask.getProcessCode()
		if(process != null && process != "" && process != undefined) return process;
	}
	
	return false;
}
function getWorkflowTaskName() {
	// find record type
	var cap = aa.cap.getCap(capId).getOutput();
	var capType = cap.getCapType().toString();
	
	if (capType=="")return "";
	var wfTaskToUpdate="";
	
	if (capType.equals("Planning/Application/Conditional Use/NA")) {
		if (wfProcess == "PLN_COND_USE") {
			 if (wfTask=="Pre Submittal Meetings" && wfStatus=="Route for Review") wfTaskToUpdate="Planning Pre Acceptance"; 
			 else if (wfTask=="Application Acceptance" && wfStatus=="Accepted") wfTaskToUpdate="Review Distribution";
			 else if (wfTask=="Review Distribution" && wfStatus=="In Review")wfTaskToUpdate="Planning Review";
			 else if (wfTask=="Review Consolidation" && wfStatus=="Review Complete")   wfTaskToUpdate="Hearing Scheduled" ;
			 else if (wfTask=="Review Consolidation" && wfStatus=="Resubmittal Requested") wfTaskToUpdate="Submission Quality Check";
			 else if (wfTask=="PC Legal Notification" && wfStatus=="Notification Sent") wfTaskToUpdate="Staff Report,Prepare Signs and Notice - PC"
			 else if (wfTask=="Generate Hearing Results" && wfStatus=="Complete") wfTaskToUpdate="Add to Council Agenda";
			 else if (wfTask=="Council Legal Notification" && wfStatus=="Notification Sent") wfTaskToUpdate="Complete E-Agenda,Prepare Signs and Notice - CC";
			 else if (wfTask=="Planning Commission Hearing" && (wfStatus=="Recommend Denial" || wfStatus=="Recommend Approval")) wfTaskToUpdate="Generate Hearing Results";
			 else if ((wfTask=="Complete E-Agenda" || wfTask=="Prepare Signs and Notice - CC") && wfStatus=="Complete") wfTaskToUpdate="City Council Meeting";
			 else {
				 var tasksArray=["Landscape Review","Addressing Review","Planning Review","Forestry Review","Licensing Review","Code Enforcement Review","Urban Renewal Review","Neighborhood Services Review","Traffic Review","Life Safety Review","ODA Review"];
				 var statusesArray=["Complete","Proceed-Tech","Resubmittal Requested","Comments Not Received"];
				 var isMatch=checkTrigger(tasksArray,statusesArray);				 
				 if (isMatch) wfTaskToUpdate="Review Consolidation";
			 }      
		}
	} else if (capType.equals("Planning/Application/Master Plan/NA")) {
		if (wfProcess == "PLN_MST_PLN") {
			if (wfTask=="Pre Submittal Meetings" && wfStatus=="Route for Review") wfTaskToUpdate="Planning Pre Acceptance";
			else if (wfTask=="Review Distribution" &&  wfStatus=="In Review") wfTaskToUpdate="Planning Review";
			else if (wfTask=="Application Acceptance" && wfStatus=="Accepted") wfTaskToUpdate="Review Distribution";
			else if (wfTask=="Review Consolidation" && wfStatus=="Resubmittal Requested") wfTaskToUpdate="Submission Quality Check";
			else if (wfTask=="Review Consolidation" && wfStatus=="Review Complete") wfTaskToUpdate="Administrative Decision";
			else if (wfTask=="Appeal" && wfStatus=="Appeal Filed") wfTaskToUpdate="Create E-Agenda,Prepare Signs and Notices – AD";
			else if (wfTask=="PC Legal Notification" && wfStatus=="Notification Sent") wfTaskToUpdate= "Staff Report,Prepare Signs and Notice - PC";
			else if (wfTask=="Generate Hearing Results" && wfStatus=="Complete") wfTaskToUpdate="Add to Council Agenda";
			else if (wfTask=="Council Legal Notification" && wfStatus=="Notification Sent") wfTaskToUpdate="Complete E-Agenda,Prepare Signs and Notice - CC"
			else if ((wfTask=="Complete E-Agenda" || wfTask=="Prepare Signs and Notice - CC") &&  wfStatus=="Complete")wfTaskToUpdate="City Council Meeting";
			else if (wfTask=="Planning Commission Hearing" && (wfStatus=="Recommend Denial" || wfStatus=="Recommend Approval")) wfTaskToUpdate="Generate Hearing Results";
			else if (( wfTask=="Create E-Agenda" || wfTask=="Prepare Signs and Notices - AD") && wfStatus=="Complete")wfTaskToUpdate="Hearing Scheduling";
			else {
				 var tasksArray=["Landscape Review", "Addressing Review", "Planning Review", "Forestry Review", "Licensing Review", "Code Enforcement Review", "Urban Renewal Review", "Neighborhood Services Review", "Traffic Review", "Life Safety Review", "ODA Review"];
				 var statusesArray=["Complete", "Proceed-Tech", "Resubmittal Requested", "Comments Not Received"];
				 var isMatch=checkTrigger(tasksArray,statusesArray);				 
				 if (isMatch) wfTaskToUpdate="Review Consolidation";
			}			
		}// process
	} else if (capType.equals("Planning/Application/Master Plan/Amendment")) {
		if (wfProcess == "PLN_MST_PLN_AMND") {
			if (wfTask=="Pre Submittal Meetings" && wfStatus=="Route for Review") wfTaskToUpdate="Planning Pre Acceptance,Planning GIS Pre Acceptance";
			else if (wfTask=="Application Acceptance" && wfStatus=="Accepted") wfTaskToUpdate="Review Distribution";
			else if (wfTask=="Review Distribution" && wfStatus=="In Review")wfTaskToUpdate="Planning Review";
			else if (wfTask=="Review Consolidation" && wfStatus=="Resubmittal Requested") wfTaskToUpdate="Submission Quality Check";
			else if (wfTask=="Review Consolidation" && wfStatus=="Review Complete") wfTaskToUpdate="Administrative Decision";
			else if (wfTask=="Appeal" && wfStatus=="Appeal Filed") wfTaskToUpdate="Create E-Agenda,Prepare Signs and Notices - AD";
			else if (wfTask=="PC Legal Notification" && wfStatus=="Notification Sent") wfTaskToUpdate="Staff Report,Prepare Signs and Notice - PC";
			else if (wfTask=="Generate Hearing Results" && wfStatus=="Complete") wfTaskToUpdate="Add to Council Agenda";
			else if (wfTask=="Council Legal Notification" && wfStatus=="Notification Sent") wfTaskToUpdate="Complete E-Agenda,Prepare Signs and Notice - CC"
			else if (wfTask=="City Council Meeting" && (wfStatus=="Denied" || wfStatus=="Approved")) wfTaskToUpdate="Appeal Period";
			else if ((wfTask=="Complete E-Agenda" || wfTask=="Prepare Signs and Notice - CC") && wfStatus=="Complete")wfTaskToUpdate="City Council Meeting";
			else if (wfTask=="Planning Commission Hearing" && (wfStatus=="Recommend Denial" || wfStatus=="Recommend Approval")) wfTaskToUpdate="Generate Hearing Results";
			else if ((wfTask=="Create E-Agenda" || wfTask=="Prepare Signs and Notices - AD") && wfStatus=="Complete" )wfTaskToUpdate="Hearing Scheduling";
			else {
				 var tasksArray=["Landscape Review", "Addressing Review", "Planning Review", "Forestry Review", "Licensing Review", "Code Enforcement Review", "Urban Renewal Review", "Neighborhood Services Review", "Traffic Review", "Life Safety Review", "ODA Review"];
				 var statusesArray=["Complete", "Proceed-Tech", "Resubmittal Requested", "Comments Not Received"];
				 var isMatch=checkTrigger(tasksArray,statusesArray);				 
				 if (isMatch) wfTaskToUpdate="Review Consolidation";
				}
			}	
	} else if (capType.equals("Planning/Application/Preliminary Plat/NA")) {
		if (wfProcess == "PLN_PRE_PLAT") {
			if (wfTask=="Pre Submittal Meetings" && wfStatus=="Route for Review")wfTaskToUpdate="Planning Pre Acceptance";
			else if (wfTask=="Application Acceptance" && wfStatus=="Accepted")wfTaskToUpdate="Review Distribution";
			else if (wfTask=="Review Distribution" && wfStatus=="In Review") wfTaskToUpdate="Planning Review";
			else if (wfTask=="Review Consolidation" && wfStatus=="Resubmittal Requested") wfTaskToUpdate="Submission Quality Check";
			else if (wfTask=="Review Consolidation" && wfStatus=="Review Complete")wfTaskToUpdate="Administrative Decision";
			else if (wfTask=="Appeal" && wfStatus=="Appeal Filed")wfTaskToUpdate="Create E-Agenda,Prepare Signs and Notices - AD"
			else if (wfTask=="PC Legal Notification" && wfStatus=="Notification Sent") wfTaskToUpdate="Staff Report,Prepare Signs and Notice - PC"
			else if (wfTask =="Planning Commission Hearing" && (wfStatus=="Recommend Denial" || wfStatus=="Recommend Approval"))wfTaskToUpdate="Generate Hearing Results";
			else if (wfTask=="Generate Hearing Results" && wfStatus=="Complete") wfTaskToUpdate="Add to Council Agenda"; 
			else if (wfTask=="Council Legal Notification" && wfStatus=="Notification Sent") wfTaskToUpdate="Complete E-Agenda,Prepare Signs and Notice - CC";
			else if (wfTask=="City Council Meeting" && (wfStatus=="Denied" || wfStatus=="Approved"))wfTaskToUpdate="Appeal Period – CC";
			else if ((wfTask =="Complete E-Agenda" ||  wfTask=="Prepare Signs and Notice - CC") && wfStatus=="Complete") wfTaskToUpdate="City Council Meeting";
			else if ((wfTask =="Create E-Agenda" || wfTask=="Prepare Signs and Notices - AD") && wfStatus=="Complete") wfTaskToUpdate="Hearing Scheduling";
			else {
				 var tasksArray=["Landscape Review", "Addressing Review", "Planning Review", "Forestry Review", "Licensing Review", "Code Enforcement Review", "Urban Renewal Review", "Neighborhood Services Review", "Traffic Review", "Life Safety Review", "ODA Review"];
				 var statusesArray=["Complete", "Proceed-Tech", "Resubmittal Requested", "Comments Not Received"];
				 var isMatch=checkTrigger(tasksArray,statusesArray);				 
				 if (isMatch) wfTaskToUpdate="Review Consolidation";
			}
		}
	} else if (capType.equals("Planning/Application/Rezoning/NA")) {
		if (wfProcess == "PLN_REZONE") {
			 if (wfTask=="Pre Submittal Meetings" && wfStatus=="Route for Review")wfTaskToUpdate="Planning Pre Acceptance";
			 else if (wfTask=="Application Acceptance" && wfStatus=="Accepted")wfTaskToUpdate="Review Distribution";
			 else if (wfTask=="Review Distribution" && wfStatus=="In Review") wfTaskToUpdate="Planning Review";
			 else if (wfTask=="Review Consolidation" && wfStatus=="Resubmittal Requested") wfTaskToUpdate="Submission Quality Check";
			 else if (wfTask=="Review Consolidation" && wfStatus=="Review Complete") wfTaskToUpdate="Hearing Scheduling";
			 else if (wfTask=="PC Legal Notification" && wfStatus=="Notification Sent") wfTaskToUpdate="Staff Report,Prepare Signs and Notice - PC"
			 else if (wfTask=="Generate Hearing Results" && wfStatus=="Complete") wfTaskToUpdate="Add to Council Agenda"; 
			 else if (wfTask=="Council Legal Notification" && wfStatus=="Notification Sent") wfTaskToUpdate="Complete E-Agenda,Prepare Signs and Notice - CC";
			 else if (wfTask=="City Council Meeting" && (wfStatus=="Denied" || wfStatus=="Approved"))wfTaskToUpdate="Appeal Period"
			 else if ((wfTask =="Complete E-Agenda" ||  wfTask=="Prepare Signs and Notice - CC") && wfStatus=="Complete") wfTaskToUpdate="City Council Meeting";
			 else if (wfTask =="Planning Commission Hearing" && (wfStatus=="Recommend Denial" || wfStatus=="Recommend Approval"))wfTaskToUpdate="Generate Hearing Results";
			 else {
				 var tasksArray=["Planning Review", "Neighborhood Liason Review", "Water Department Review", "ODA Review"];
				 var statusesArray=["Complete", "Proceed-Tech", "Resubmittal Requested", "Comments Not Received"];
				 var isMatch=checkTrigger(tasksArray,statusesArray);				 
				 if (isMatch) wfTaskToUpdate="Review Consolidation";
				 }
			}
	} else if (capType.equals("Planning/Application/Site Plan/Amendment")) {
		if (wfProcess == "PLN_SITE_PLAN") {
			 if (wfTask=="Pre Submittal Meetings" && wfStatus=="Route for Review")wfTaskToUpdate="Planning Pre Acceptance";
			 else if (wfTask=="Application Acceptance" && wfStatus=="Accepted")wfTaskToUpdate="Review Distribution";
			 else if (wfTask=="Review Distribution" && wfStatus=="In Review") wfTaskToUpdate="Planning Review";
			 else if (wfTask=="Review Consolidation" && wfStatus=="Resubmittal Requested") wfTaskToUpdate="Submission Quality Check";
			 else if (wfTask=="Review Consolidation" && wfStatus=="Review Complete") wfTaskToUpdate="Hearing Scheduling";
			 else if (wfTask=="PC Legal Notification" && wfStatus=="Notification Sent") wfTaskToUpdate="Staff Report,Prepare Signs and Notice - PC"
			 else if (wfTask=="Generate Hearing Results" && wfStatus=="Complete") wfTaskToUpdate="Add to Council Agenda";
			 else if (wfTask=="Council Legal Notification" && wfStatus=="Notification Sent") wfTaskToUpdate="Complete E-Agenda,Prepare Signs and Notice - CC";	 
			 else if ((wfTask =="Complete E-Agenda" ||  wfTask=="Prepare Signs and Notice - CC") && wfStatus=="Complete") wfTaskToUpdate="City Council Meeting";
			 else if (wfTask =="Planning Commission Hearing" && (wfStatus=="Recommend Denial" || wfStatus=="Recommend Approval"))wfTaskToUpdate="Generate Hearing Results";
			 else {
				 var tasksArray=["Planning Review", "Neighborhood Liason Review", "Water Department Review", "ODA Review"];
				 var statusesArray=["Complete", "Proceed-Tech", "Resubmittal Requested", "Comments Not Received"];
				 var isMatch=checkTrigger(tasksArray,statusesArray);				 
				 if (isMatch) wfTaskToUpdate="Review Consolidation";
				 }
			 }
} else if (capType.equals("Planning/Application/Site Plan/Major")) {
		if (wfProcess == "PLN_SITE_MAJOR") {
			if (wfTask=="Pre Submittal Meetings" && wfStatus=="Route for Review") wfTaskToUpdate="Planning Pre Acceptance";
			else if (wfTask=="Application Acceptance" && wfStatus=="Accepted")wfTaskToUpdate="Review Distribution";
			else if (wfTask=="Review Distribution" && wfStatus=="In Review") wfTaskToUpdate="Planning Review";
			else if (wfTask=="Review Consolidation" && wfStatus=="Resubmittal Requested") wfTaskToUpdate="Submission Quality Check";
			else if (wfTask=="Review Consolidation" && wfStatus=="Review Complete") wfTaskToUpdate="Hearing Scheduling";
			else if (wfTask=="PC Legal Notification" && wfStatus=="Notification Sent") wfTaskToUpdate="Staff Report,Prepare Signs and Notice - PC";
			else if (wfTask=="Generate Hearing Results" && wfStatus=="Complete") wfTaskToUpdate="Add to Council Agenda";
			else if (wfTask=="Council Legal Notification" && wfStatus=="Notification Sent") wfTaskToUpdate="Complete E-Agenda,Prepare Signs and Notice - CC";
			else if (wfTask=="Appeal/Call Up Period" && (wfStatus=="Complete" || wfStatus=="Appeal Not Requested"))wfTaskToUpdate="Complete Case";
			else if ((wfTask=="Complete E-Agenda" || wfTask=="Prepare Signs and Notice - CC") && wfStatus=="Complete")wfTaskToUpdate="City Council Meeting";
			else if (wfTask=="Planning Commission Hearing" && (wfStatus=="Recommend Denial" || wfStatus=="Recommend Approval"))	wfTaskToUpdate="Generate Hearing Results";
			else {
				 var tasksArray=["Planning Review", "Neighborhood Liason Review", "Water Department Review", "ODA Review"];
				 var statusesArray=["Complete", "Proceed-Tech", "Resubmittal Requested", "Comments Not Received"];
				 var isMatch=checkTrigger(tasksArray,statusesArray);				 
				 if (isMatch) wfTaskToUpdate="Review Consolidation";		
				}	
			}

	} else if (capType.equals("Planning/Application/Site Plan/Minor")) {
		if (wfProcess == "PLN_SITE_PLAN_MIN2") {
			if (wfTask=="Pre Submittal Meetings" && wfStatus=="Route for Review")wfTaskToUpdate="Planning Pre Acceptance";
			else if (wfTask=="Application Acceptance" && wfStatus=="Accepted")wfTaskToUpdate="Review Distribution";
			else if (wfTask=="Review Distribution" && wfStatus=="In Review")wfTaskToUpdate="Planning Review";
			else if (wfTask=="Review Consolidation" && wfStatus=="Resubmittal Requested")wfTaskToUpdate="Submission Quality Check";
			else if (wfTask=="Review Consolidation" && wfStatus=="Review Complete")wfTaskToUpdate="Hearing Scheduling";
			else if (wfTask=="PC Legal Notification" && wfStatus=="Notification Sent")wfTaskToUpdate="Staff Report,Prepare Signs and Notice - PC";
			else if (wfTask=="Planning Commission Hearing" && (wfStatus=="Recommend Denial" || wfStatus=="Recommend Approval"))wfTaskToUpdate="Generate Hearing Results";
			else {
				 var tasksArray=["Planning Review", "Neighborhood Liason Review", "Water Department Review", "ODA Review"];
				 var statusesArray=["Complete", "Proceed-Tech", "Resubmittal Requested", "Comments Not Received"];
				 var isMatch=checkTrigger(tasksArray,statusesArray);				 
				 if (isMatch) wfTaskToUpdate="Review Consolidation";
				
				}
			}
	}  else if (capType.equals("Planning/Special Request/Zoning Inquiry/NA")) {
		if (wfProcess == "PLN_EXPRESS") {
			if (wfTask=="Assign Zoning Inquiry" && wfStatus=="Assigned") wfTaskToUpdate="Zoning Inquiry Meeting";
			else if (wfTask=="Zoning Inquiry Meeting" && wfStatus=="Complete") wfTaskToUpdate="Review Zoning Inquiry Letter";
			else if (wfTask=="Review Zoning Inquiry Letter" && wfStatus=="Letter Approved")wfTaskToUpdate="Generate Letter";	
		}
	}

	

	return wfTaskToUpdate;
}


function guideSheetObject(gguidesheetModel,gguidesheetItemModel)
	{
	this.gsType = gguidesheetModel.getGuideType();
	this.gsSequence = gguidesheetModel.getGuidesheetSeqNbr();
	this.gsDescription = gguidesheetModel.getGuideDesc();
	this.gsIdentifier = gguidesheetModel.getIdentifier();
	this.item = gguidesheetItemModel;
	this.text = gguidesheetItemModel.getGuideItemText()
	this.status = gguidesheetItemModel.getGuideItemStatus();
	this.comment = gguidesheetItemModel.getGuideItemComment();
	this.score = gguidesheetItemModel.getGuideItemScore();
	this.statusGroup = gguidesheetItemModel.getGuideItemStatusGroupName();
	this.resultType = aa.guidesheet.getStatusResultType(aa.getServiceProviderCode(), this.statusGroup, this.status).getOutput();
	this.info = new Array();
	this.infoTables = new Array();
	this.validTables = false;				//true if has ASIT info
	this.validInfo = false;				//true if has ASI info

	
	this.loadInfo = function() {
		var itemASISubGroupList = this.item.getItemASISubgroupList();
		//If there is no ASI subgroup, it will throw warning message.
		if(itemASISubGroupList != null)
		{
			this.validInfo = true;
			var asiSubGroupIt = itemASISubGroupList.iterator();
			while(asiSubGroupIt.hasNext())
			{
				var asiSubGroup = asiSubGroupIt.next();
				var asiItemList = asiSubGroup.getAsiList();
				if(asiItemList != null)
				{
					var asiItemListIt = asiItemList.iterator();
					while(asiItemListIt.hasNext())
					{
						var asiItemModel = asiItemListIt.next();
						this.info[asiItemModel.getAsiName()] = asiItemModel.getAttributeValue();
					}
				}
			}
		}
		

	}
	
	this.loadInfoTables = function() {

		var guideItemASITs = this.item.getItemASITableSubgroupList();
		if (guideItemASITs!=null)
		for(var j = 0; j < guideItemASITs.size(); j++)
		{
			var guideItemASIT = guideItemASITs.get(j);
			var tableArr = new Array();
			var columnList = guideItemASIT.getColumnList();
			for (var k = 0; k < columnList.size() ; k++ )
			{
				var column = columnList.get(k);
				var values = column.getValueMap().values();
				var iteValues = values.iterator();
				while(iteValues.hasNext())
				{
					var i = iteValues.next();
					var zeroBasedRowIndex = i.getRowIndex()-1;
					if (tableArr[zeroBasedRowIndex] == null) tableArr[zeroBasedRowIndex] = new Array();
					tableArr[zeroBasedRowIndex][column.getColumnName()] = i.getAttributeValue()
				}
			}
			
			this.infoTables["" + guideItemASIT.getTableName()] = tableArr;
			this.validTables = true;
		}
	}
}
function hasInspection(inspections, treeId, existingDiameter, inspType) {
	for (i in inspections) {
		if (inspections[i].getInspectionType().equalsIgnoreCase(inspType)) {
			var act = inspections[i].getInspection().getActivity();
			if (act.getUnitNBR() == treeId) {
				return true;
			if (act.getVehicleID() == existingDiameter)
				return true;
			}
		}//inspType match
	}//for all inspections
	return false;
}


function hasInvoicedFees(recordCapId, feeCode) {
	var s = aa.fee.getFeeItems(recordCapId, feeCode, null);
	if (!s.getSuccess())
		return false;

	var n = s.getOutput();

	for (ff in n) {
		if ("INVOICED" == n[ff].getFeeitemStatus()) {
			return true;
		}
	}
	return false;
}

function hasNewOrInvoicedFees(recordCapId, feeCode) {
var s = aa.fee.getFeeItems(recordCapId, feeCode, null);
if (!s.getSuccess())
	return false;

var n = s.getOutput();

for (ff in n) {
	if ("INVOICED" == n[ff].getFeeitemStatus() || "NEW" == n[ff].getFeeitemStatus()) {
		return true;
	}
}
return false;
}
/*
 * Helper
 * 
 * Desc:			
 * Used to display results of boolean condition
 * often wrapped in if statement as follows:
 *  if(ifTracer(''foo == 'bar', 'foo equals bar')) {}
 * 
*/

function ifTracer (cond, msg) {
    cond = cond ? true : false;
    logDebug((cond).toString().toUpperCase() + ': ' + msg);
    return cond;
}
function includesCrmCustomWorkflowRules(){

//START FORESTRY RECORD WORKFLOW CRM LOGIC

//Start Logic For Building Workflow Statuses that trigger when comments status updates are published to the shadow record which will push to CRM System
if (appMatch("Forestry/Permit/NA/NA")||appMatch("Forestry/Request/Citizen/NA")||appMatch("Forestry/Request/Planting/NA")) {

var parent = getParent();
if(parent){
	if(matches(wfStatus,"Incomplete","Removal","No Replant","Replant","Assigned","No Plant","Returned to Sender","Vacant Property","Plant Tree","Plant","Add to List")){

		createCapComment(wfComment,parent);
		updateAppStatus("In Progress","Updated via Script",parent);
		createCapComment(wfComment);


	}

	if(matches(wfStatus,"Complete","Issued","Owner Denied","Duplicate","Complete Staked","Complete Not Staked","Remove from List")){

		createCapComment(wfComment,parent);
		updateAppStatus("Completed","Updated via Script",parent);
		createCapComment(wfComment);

		}
	}
}

//END FORESTRY RECORD WORKFLOW CRM LOGIC

//START BUILDING RECORD WORKFLOW CRM LOGIC

//Start Logic For Building Workflow Statuses that trigger when comments status updates are published to the shadow record which will push to CRM System
if (appMatch("Building/Enforcement/Notice of Violation/NA")) {
    var parent = getParent();
    if(parent){
        if(matches(wfStatus,"Fire Call","Assigned","In Progress","Extension","Issue Summons","Notice of Violation","Third Notice","First Notice","Second Notice","Non Compliance")){
            createCapComment(wfComment,parent);
            updateAppStatus("In Progress","Updated via Script",parent);
			createCapComment(wfComment);
        }
        
        if(matches(wfStatus,"Duplicate","Referred","Complete","Reasign to another Division","No Violation Observed","Compliance")){
            createCapComment(wfComment,parent);
            updateAppStatus("Completed","Updated via Script",parent);
			createCapComment(wfComment);
        }
    }
}

//END BUILDING RECORD WORKFLOW CRM LOGIC

//START ENFORCEMENT RECORD WORKFLOW CRM LOGIC

//Start Logic For Building Workflow Statuses that trigger when comments status updates are published to the shadow record which will push to CRM System
if (appMatch("Enforcement/Incident/Abatement/NA")||appMatch("Enforcement/Incident/Summons/NA")||appMatch("Enforcement/Housing/Inspection/NA")||appMatch("Enforcement/Incident/Informational/NA")||appMatch("Enforcement/Neighborhood/NA/NA")||appMatch("Enforcement/Incident/Record with County/NA")||appMatch("Enforcement/Incident/Snow/NA")||appMatch("Enforcement/Incident/Zoning/NA")) {

var parent = getParent();
if(parent){
	if(matches(wfStatus,"Assigned","Graffiti Abatement Redo","Bill and Photo Denied","Invoice Approved","Invoice Denied","Bill and Photo Approved","Called Service Request","Invoiced - City Paid","Invoiced","Taken and Stored","Rescheduled","Reschedule upon Re-Inspect","Record Reception","Lien Paid","Submit Recording","Released to County","Record Reception","Submitted","FTA - Visit","FTA - Inspection Scheduled","FTA","Continuance","Trial Issue New Summons","NFZV - 1 Year","Non-Compliant","Court Ordered Re-Inspect","Trial","Non-Complance New Summons","Pre-Trial","Sent - Regular","Sent - Certified","Complete","5 - Summons File to CA","4 - Summons to Docketing","1 - Create Summons File","6 - Citation File to CA", "2 - Summons to Court Liaison","3 - File to Court Liaison","Unverifiable","Taken and Stored - Citation","Taken and Stored - Summons","Visit/Attempted Contact","Personal Service","Letter to be Sent","No Show","Inspection Failed","Extension - No Fee","Extension - Fee","Skip to Summons","Inspection Passed","CO Verified","Scheduled","Pending Housing Inspection","Packet Mailed","Housing Letter Sent","Release to County","Record Submitted","Record Reception","Lien Paid","Record Reception","Record Submitted","Pictures Only","Garage Sales","Banners","Misc.","Second Notice","First Notice","Expiring","Renewed","Expiring","Failed")){

		createCapComment(wfComment,parent);
		updateAppStatus("In Progress","Updated via Script",parent);
		createCapComment(wfComment);


			}

	if(matches(wfStatus,"Completed Service Request","Canceled","Dismissed","Compliance","Complete","Cancelled","Withdrawn","Compliance/Complete","No Violation","Closed","Final Notice","Duplicate","Referred","New Owner","Compliant")){

		createCapComment(wfComment,parent);
		updateAppStatus("Completed","Updated via Script",parent);
		createCapComment(wfComment);


			}
		}
}

//END ENFORCEMENT RECORD WORKFLOW CRM LOGIC

//START FIRE RECORD WORKFLOW CRM LOGIC

//Start Logic For Building Workflow Statuses that trigger when comments status updates are published to the shadow record which will push to CRM System
if (appMatch("Fire/Complaint/NA/NA")||appMatch("Fire/Primary Inspection/NA/NA")||appMatch("Fire/Special Inspection/NA/NA")) {

var parent = getParent();
if(parent){
	if(matches(wfStatus,"Research","Violation","In Progress")){

		createCapComment(wfComment,parent);
		updateAppStatus("In Progress","Updated via Script",parent);
		createCapComment(wfComment);


}

	if(matches(wfStatus,"Withdrawn","Compliance/Complete","No Violation","Complete","Inactive")){

		createCapComment(wfComment,parent);
		updateAppStatus("Completed","Updated via Script",parent);
		createCapComment(wfComment);


		}
	}
}

//END FIRE RECORD WORKFLOW CRM LOGIC

//START PUBLIC WORKS RECORD WORKFLOW CRM LOGIC

//Start Logic For Building Workflow Statuses that trigger when comments status updates are published to the shadow record which will push to CRM System
if (appMatch("PublicWorks/Traffic/Traffic Engineering Request/NA")) {

var parent = getParent();

if(parent){
	if(matches(wfStatus,"Accepted","Workorder Drafted","Generated","Assigned","Assigned to Supervisor","Draft Work Order")){

		createCapComment(wfComment,parent);
		updateAppStatus("In Progress","Updated via Script",parent);
		createCapComment(wfComment);


	}

	if(matches(wfStatus,"Request Complete","Complete","Refer to Code Enforcement","No Change Warranted","Refer to Forestry","Completed","Approved","Denied")){

		createCapComment(wfComment,parent);
		updateAppStatus("Completed","Updated via Script",parent);
		createCapComment(wfComment);

		}
	}
}

//END PUBLICWORKS RECORD WORKFLOW CRM LOGIC

}

/**
 * check record if any inspection with the given statu exists
 * @param recordCapId record capId to check
 & @param inspectionStatus status to check inspections for
 * @returns {Boolean} true if all inspections were completed, false otherwise
 */
function inspectionsByStatus(recordCapId, inspectionStatus) {
	var t = aa.inspection.getInspections(recordCapId);
	if (t.getSuccess()) {
		var n = t.getOutput();
		for (xx in n)
			if (n[xx].getInspectionStatus().toUpperCase().equals(inspectionStatus.toUpperCase()))
				return true;
	} else {
		logDebug("**ERROR failed to get inspections, error: " + t.getErrorMessage());
		return false;
	}
	return false;
}
function invoiceAllFees (){ //optional capId
try{
	var itemCap = capId;
	if (arguments.length > 0)
		itemCap = arguments[0];
	var feeSeq_L = new Array(); 
	var paymentPeriod_L = new Array(); 
	var invoiceResult_L = false;
	var retVal = false;
	var feeResult = aa.finance.getFeeItemByCapID(itemCap);
	if (feeResult.getSuccess()) {
		var feeArray = feeResult.getOutput();
		for (var f in feeArray) {
			var thisFeeObj = feeArray[f];
			if (matches(thisFeeObj.getFeeitemStatus(), "VOIDED", "NEW")) {
				paymentPeriod_L.push(thisFeeObj.getPaymentPeriod());
				feeSeq_L.push(thisFeeObj.getFeeSeqNbr());
			}
		}

		if(feeSeq_L[0]!=undefined){
			invoiceResult_L = aa.finance.createInvoice(itemCap, feeSeq_L, paymentPeriod_L);
			if (invoiceResult_L.getSuccess()){
				var invoiceResult = aa.finance.getFeeItemInvoiceByFeeNbr(itemCap, feeSeq_L[0], null);
				if (invoiceResult.getSuccess()) {
					var invoiceItem = invoiceResult.getOutput();
					retVal = invoiceItem[0].getInvoiceNbr();
				}
			}
		}else{
			logDebug("Error with feeSeq_L " +feeSeq_L);
		}
	}else {
		logDebug("Error getting fees " + feeResult.getErrorMessage());
	}
	return retVal;
}catch (exception) {
    comment("A JavaScript Error occurred:  invoiceAllFees: " + err.message);
}};

function invoiceNewFeesOneInvoice(itemCap){
	var thisFeeSeq_L = new Array(); 			// invoicing fee for CAP in args
    var thisPaymentPeriod_L = new Array(); 		// invoicing pay periods for CAP in args
	var getFeeResult = aa.fee.getFeeItems(itemCap, null, "NEW");
	if (getFeeResult.getSuccess()) {
		var feeList = getFeeResult.getOutput();
		for (feeNum in feeList) {
			var thisFee = feeList[feeNum];
			if (thisFee.getFeeitemStatus().equals("NEW")) {
				var feeSeq = thisFee.getFeeSeqNbr();
				var feePeriod = thisFee.getPaymentPeriod();
                thisFeeSeq_L.push(feeSeq);
				thisPaymentPeriod_L.push(feePeriod);
			}
		}
		
		var invoiceResult_L = aa.finance.createInvoice(itemCap, thisFeeSeq_L, thisPaymentPeriod_L);
        if (invoiceResult_L.getSuccess())
            logMessage("Invoicing assessed fee items is successful.");
        else
            logDebug("**ERROR: Invoicing the fee items assessed was not successful.  Reason: " + invoiceResult_L.getErrorMessage());
		
	} else {
		logDebug("**ERROR: getting fee items (" + feeList[feeNum].getFeeCod() + "): " + getFeeResult.getErrorMessage())
	}
}
function isBlankOrNull(value) {
	return value == null || String(value).trim().equals(String('')) || String(value).trim().equals(String('null'));
}
function isHistTaskStatus(wfTask, wfTaskStatus) {
	
	itemCap = capId;
	if (arguments.length == 3) itemCap = arguments[2];
	
    wfObj = aa.workflow.getHistory(itemCap).getOutput();

    for (var x = 0; x < wfObj.length; x++) {
        if (wfObj[x].disposition == wfTaskStatus && wfObj[x].getTaskDescription() == wfTask) {
            return true;
        }
    }
    return false;
}
function isMatchAddress(addressScriptModel1, addressScriptModel2)
{
	if (addressScriptModel1 == null || addressScriptModel2 == null)
	{
		return false;
	}
	var streetName1 = addressScriptModel1.getStreetName();
	var streetName2 = addressScriptModel2.getStreetName();
	if ((streetName1 == null && streetName2 != null) 
		|| (streetName1 != null && streetName2 == null))
	{
		return false;
	}
	if (streetName1 != null && !streetName1.equals(streetName2))
	{
		return false;
	}
	return true;
}
/*--------------------------------------------------------------------------------------------------------------------/
| Start ETW 12/3/14 isMatchPeople3_0
/--------------------------------------------------------------------------------------------------------------------*/
function isMatchPeople3_0(capContactScriptModel, capContactScriptModel2) {
    if (capContactScriptModel == null || capContactScriptModel2 == null) {
        return false;
    }

    var contactType1 = capContactScriptModel.getCapContactModel().getPeople().getContactType();
    var contactType2 = capContactScriptModel2.getCapContactModel().getPeople().getContactType();
    var firstName1 = capContactScriptModel.getCapContactModel().getPeople().getFirstName();
    var firstName2 = capContactScriptModel2.getCapContactModel().getPeople().getFirstName();
    var lastName1 = capContactScriptModel.getCapContactModel().getPeople().getLastName();
    var lastName2 = capContactScriptModel2.getCapContactModel().getPeople().getLastName();
    var fullName1 = capContactScriptModel.getCapContactModel().getPeople().getFullName();
    var fullName2 = capContactScriptModel2.getCapContactModel().getPeople().getFullName();

    if ((contactType1 == null && contactType2 != null) || (contactType1 != null && contactType2 == null)) {
        return false;
    }

    if (contactType1 != null && !contactType1.equals(contactType2)) {
        return false;
    }

    if ((firstName1 == null && firstName2 != null) || (firstName1 != null && firstName2 == null)) {
        return false;
    }

    if (firstName1 != null && !firstName1.equals(firstName2)) {
        return false;
    }

    if ((lastName1 == null && lastName2 != null) || (lastName1 != null && lastName2 == null)) {
        return false;
    }

    if (lastName1 != null && !lastName1.equals(lastName2)) {
        return false;
    }

    if ((fullName1 == null && fullName2 != null) || (fullName1 != null && fullName2 == null)) {
        return false;
    }

    if (fullName1 != null && !fullName1.equals(fullName2)) {
        return false;
    }

    return true;
}
/*--------------------------------------------------------------------------------------------------------------------/
| End ETW 12/3/14 isMatchPeople3_0
/--------------------------------------------------------------------------------------------------------------------*/
function isRenewProcess(parentCapID, partialCapID) {
	logDebug("in isRenewProcess");
	//1. Check to see parent CAP ID is null.
	if (parentCapID == null || partialCapID == null || aa.util.instanceOfString(parentCapID)) {
		return false;
	}
	//2. Get CAPModel by PK for partialCAP.
	var result = aa.cap.getCap(partialCapID);
	if(result.getSuccess()) {
		capScriptModel = result.getOutput();
		//2.1. Check to see if it is partial CAP.	
		if (capScriptModel.isCompleteCap()) {
			logDebug("ERROR: It is not partial CAP(" + capScriptModel.getCapID() + ")");
			return false;
		}
	}
	else {
		logDebug("ERROR: Fail to get CAPModel (" + partialCapID + "): " + result.getErrorMessage());
		return false;
	}
	//3.  Check to see if the renewal was initiated before. 
	result = aa.cap.getProjectByMasterID(parentCapID, "Renewal", "Incomplete");
	if(result.getSuccess()) {
		partialProjects = result.getOutput();
		if (partialProjects != null && partialProjects.length > 0) {
			//Avoid to initiate renewal process multiple times.
			logDebug("Warning: Renewal process was initiated before. ( "+ parentCapID + ")");
			return false;
		}
		
	}
	//4 . Check to see if parent CAP is ready for renew.
	return isReadyRenew(parentCapID);
}


function isTaskAssigned(wfstr) // optional process name
{
	// Assigns the task to a user.  No audit.
	//
	var useProcess = false;
	var processName = "";
	if (arguments.length == 2) {
		processName = arguments[1]; // subprocess
		useProcess = true;
    }
		
	var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, null, null);
 	if (workflowResult.getSuccess())
  	 	var wfObj = workflowResult.getOutput();
  	else { logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage()); return false; }
	
	for (i in wfObj){
   		var fTask = wfObj[i];
 		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase())  && (!useProcess || fTask.getProcessCode().equals(processName))){
			var staffObj = fTask.getAssignedStaff();
			if(staffObj.getFirstName() != undefined && staffObj.getFirstName() != null && staffObj.getFirstName() != "") return true;
		}
	}
	return false;
}

/**
 * adds 0 padding to left of value (padded value will be 2 digits)
 * @param value
 * @returns padded value
 */
function leftPadding(value) {
	if (parseInt(value) < 10) {
		return "0" + value;
	} else {
		return value;
	}
}

/**
 * Link latest uploaded documents fromCap toCap
 * @param fromCapId src cap
 * @param toCapId dest cap
 * @param {Array} docTypesArray document types to link
 */
function linkDocuments(fromCapId, toCapId, docTypesArray) {
	var docsArray = aa.document.getCapDocumentList(fromCapId, aa.getAuditID()).getOutput();
	var latestUploadedDoc = null;
	for (t in docTypesArray) {
		for (d in docsArray) {
			var documentModel = docsArray[d];
			if (docTypesArray[t] == documentModel.getDocCategory()) {
				reqDocModel = documentModel;
				if (latestUploadedDoc == null) {
					latestUploadedDoc = documentModel;
				} else {
					var docModelUploadDate = aa.util.formatDate(documentModel.getFileUpLoadDate(), "MM/dd/YYYY");
					var latestUploadDate = aa.util.formatDate(latestUploadedDoc.getFileUpLoadDate(), "MM/dd/YYYY");
					if (dateDiff(docModelUploadDate, latestUploadDate) < 0) {
						latestUploadedDoc = documentModel;
					}
				}
			}//doc type match
		}//for all docs
		if (latestUploadedDoc != null) {
			aa.document.createDocumentAssociation(latestUploadedDoc, toCapId, "CAP");
			latestUploadedDoc = null;
		}
	}//for all types required
}
function loadASITablesBefore4CoA() {

 	//
 	// Loads App Specific tables into their own array of arrays.  Creates global array objects
	//
	//

	var gm =  aa.env.getValue("AppSpecificTableGroupModel");
	var ta = gm.getTablesMap().values()
	var tai = ta.iterator();

	while (tai.hasNext())
	  {
	  var tsm = tai.next();

	  if (tsm.rowIndex.isEmpty()) continue;  // empty table

	  var tempObject = new Array();
	  var tempArray = new Array();
	  var tn = tsm.getTableName();

	  tn = String(tn).replace(/[^a-zA-Z0-9]+/g,'');

	  if (!isNaN(tn.substring(0,1))) tn = "TBL" + tn  // prepend with TBL if it starts with a number

	  var tsmfldi = tsm.getTableField().iterator();
	  var tsmcoli = tsm.getColumns().iterator();
	  var numrows = 1;

	  while (tsmfldi.hasNext())  // cycle through fields
		{
		if (!tsmcoli.hasNext())  // cycle through columns
			{
			var tsmcoli = tsm.getColumns().iterator();
			tempArray.push(tempObject);  // end of record
			var tempObject = new Array();  // clear the temp obj
			numrows++;
			}
		var tcol = tsmcoli.next();
		var tval = tsmfldi.next();
		tempObject[tcol.getColumnName()] = tval;
		}
	  tempArray.push(tempObject);  // end of record
	  var copyStr = "" + tn + " = tempArray";
	  logDebug("ASI Table Array : " + tn + " (" + numrows + " Rows)");
	  eval(copyStr);  // move to table name
	  }

	}
function loadFIGuideSheetItems(inspId) {
	//
	// Returns an array of guide sheet objects
	// Optional second parameter, cap ID to load from
	// requires guideSheetObject definition
	//

	var retArray = new Array()
	var itemCap = capId;
	if (arguments.length == 2)
		itemCap = arguments[1]; // use cap ID specified in args

	var r = aa.inspection.getInspections(itemCap); // have to use this method to get guidesheet data

	if (r.getSuccess()) {
		var inspArray = r.getOutput();

		for (i in inspArray) {
			if (inspArray[i].getIdNumber() == inspId) {
				var inspModel = inspArray[i].getInspection();

				var gs = inspModel.getGuideSheets()

				if (gs) {
					gsArray = gs.toArray();
					for ( var loopk in gsArray) {
						a = gsArray[loopk];

						var gsItems = gsArray[loopk].getItems().toArray()
						for ( var loopi in gsItems) {
							if (gsItems[loopi].getGuideType().toUpperCase() == "FORESTRY INSPECTOR") {
								var gso = new guideSheetObject(gsArray[loopk], gsItems[loopi]);
								retArray.push(gsItems[loopi].getGuideItemStatus());
							}
						}
					}
				} // if there are guidesheets
				else
					logDebug("No guidesheets for this inspection");
			} // if this is the right inspection
		} // for each inspection
	} // if there are inspections

	logDebug("loaded " + retArray.length + " guidesheet items");
	return retArray;
}
function loadTSIByTask(thisArr, wfTsk){
    // If useTaskSpecificGroupName==true, appends wf process code.wftask. to TSI field label
    // Optional second parameter, cap ID to load from
    //
    
    var itemCap = capId;
    if (arguments.length == 3) itemCap = arguments[2]; // use cap ID specified in args

    var workflowResult = aa.workflow.getTasks(itemCap);
    if (workflowResult.getSuccess())
        var wfObj = workflowResult.getOutput();
    else
        { logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage()) ; return false; }
 
    for (i in wfObj) {
        var fTask = wfObj[i];
        var stepnumber = fTask.getStepNumber();
        var processID = fTask.getProcessID();
        var TSIResult = aa.taskSpecificInfo.getTaskSpecificInfoByTask(itemCap, processID, stepnumber)
        if (TSIResult.getSuccess()) {
            var TSI = TSIResult.getOutput();
            for (a1 in TSI) {
                if(fTask.getTaskDescription() == wfTsk) thisArr[TSI[a1].getCheckboxDesc()] = TSI[a1].getChecklistComment();
            }
        }
    }
}
function loadUserProperties(usrArr, usrId){
    var usrObjResult = aa.person.getUser(usrId);
    
    if(!usrObjResult.getSuccess()) return false;
    
    var usrObj = usrObjResult.getOutput();
    var usrDept = usrObj.getDeptOfUser();
    var dpt = aa.people.getDepartmentList(null).getOutput();
    for (var thisdpt in dpt){
        var m = dpt[thisdpt]
        var n = m.getServiceProviderCode() + "/" + m.getAgencyCode() + "/" + m.getBureauCode() + "/" + m.getDivisionCode() + "/" + m.getSectionCode() + "/" + m.getGroupCode() + "/" + m.getOfficeCode() 
      
        if (n.equals(usrDept)) usrDept = m.getDeptName();
    }
    
    usrArr["FullName"] = usrObj.getFullName();
    usrArr["PhoneNumer"] = usrObj.getPhoneNumber();
    usrArr["Email"] = usrObj.getEmail();
    usrArr["Department"] = usrDept;
}
function lpExistsOnCap(itemCap){
    var licProfResult = aa.licenseScript.getLicenseProf(itemCap);
    if (!licProfResult.getSuccess()){
        logDebug("Error getting CAP's license professional: " +licProfResult.getErrorMessage());
        //return false;
    }
    else{
        var licProfList = licProfResult.getOutput();
        if(licProfList && licProfList.length > 0) return true;
    }
	return false;
}

function mapAreaTRSAssignmentInspectors(areaNo, trs, stdForestryInspectorAssignments) {
    var bizDomScriptResult = aa.bizDomain.getBizDomain(stdForestryInspectorAssignments);
    if (bizDomScriptResult.getSuccess()) {
        arrBizDomScript = bizDomScriptResult.getOutput().toArray();
        if (arrBizDomScript != null && arrBizDomScript.length > 0) {
            for (var b in arrBizDomScript) {
                var bizDomainValue = arrBizDomScript[b].getBizdomainValue();
                var inspectorName = arrBizDomScript[b].getDescription();
                if (typeof (bizDomainValue) != "undefined" && bizDomainValue != null && bizDomainValue != "") {
                    var arrBizDomainValue = bizDomainValue.split("\\|");
                    if (arrBizDomainValue != null && arrBizDomainValue.length > 0) {
                        if (typeof (areaNo) != "undefined" && areaNo != null && areaNo != "") {
                            if (arrBizDomainValue[0] != null && arrBizDomainValue[0] != "") {
                                if (areaNo == arrBizDomainValue[0]) {
                                    if (typeof (inspectorName) != "undefined" && inspectorName != null && inspectorName != "") {
                                        getAssignInspectorID(inspectorName);
                                        break;
                                    }
                                }
                            }
                        } else if (typeof (trs) != "undefined" && trs != null && trs != "") {
                            if (arrBizDomainValue[1] != null && arrBizDomainValue[1] != "") {
                                if (trs == arrBizDomainValue[1]) {
                                    if (typeof (inspectorName) != "undefined" && inspectorName != null && inspectorName != "") {
                                        getAssignInspectorID(inspectorName);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function matchARecordType(appTypeStringArray, valTypeString) {
    var appTypeArray,
        valTypeArray = valTypeString.split("/"),
        idx,
        key;

    if (valTypeArray.length != 4) { return false; } //invalid
    for (idx in appTypeStringArray) {
        appTypeArray = appTypeStringArray[idx].split('/');
        if (appTypeArray.length != 4) { break; } //invalid

        for (key in appTypeArray) {
            if (appTypeArray[key].toUpperCase() != valTypeArray[key].toUpperCase() && appTypeArray[key] != '*') {
                break;
            } else if (key == appTypeArray.length-1) {
                return true; //its a match (all 4 elements)
            }
        }
    }
    return false;
}
function noInvoicedFeesErrorMessage(workFlowTask, workflowStatusArray) {

	if (wfTask == workFlowTask) {

		var statusMatch = false;

		for (s in workflowStatusArray) {
			if (wfStatus == workflowStatusArray[s]) {
				statusMatch = true;
				break;
			}
		}//for all status options

		if (!statusMatch) {
			return false;
		}

		var hasInvoiced = hasInvoicedFees(capId, "");
		//Script 164
		if (!hasInvoiced && AInfo["Review Fee?"] == "Yes") {
			cancel = true;
			showMessage = true;
			comment("Please add and invoice the correct fee item(s).");
			return false;
		}
	} else {
		return false;
	}
	return true;
}

function odaScript225_emailMeetingNotes(){
    logDebug("odaScript225_emailMeetingNotes() started");
    try{
        var emailTemplate = "ODA PRE APP MEETING NOTES EMAIL # 225";
        var reportTemplate = "JD_TEST_SSRS";
        var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
        acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
        var recordURL = getACARecordURL(acaURLDefault);
        var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
        var reportFile = [];
        var emailParams = aa.util.newHashtable();
        
        var odaProjMan = AInfo["ODA Project Manager"];
        var odaProjCor = AInfo["ODA Project Coordinator"];
        
        addParameter(emailParams, "$$altID$$", capIDString);
        addParameter(emailParams, "$$acaRecordUrl$$", recordURL);
        
        var resParEmail = getContactEmailAddress("Responsible Party", capId) + ";";
        var ccEmails = "";
        
        if(resParEmail){
            resParEmail = "";
            var conts = getContactObjs(capId);
            
            for(each in conts){
                var aCont = conts[each].people;
                
                if(matches(aCont.contactType, "Consultant", "Responsible Party") && aCont.email) 
                    resParEmail += aCont.email + ";";
            }
            
            if(odaProjMan){
                var adaProjManSplit = odaProjMan.split(" ");
                if(adaProjManSplit.length == 3)
                    var staffObj = aa.person.getUser(adaProjManSplit[0], adaProjManSplit[1], adaProjManSplit[3]).getOutput();
                else
                    var staffObj = aa.person.getUser(adaProjManSplit[0], "", adaProjManSplit[1]).getOutput();
                
                if(staffObj && staffObj.email != null && staffObj.email != undefined && staffObj.email != "") {
                    ccEmails += staffObj.email + ";";
                    addParameter(emailParams, "$$projectManagerEmail$$", staffObj.email)
                }
            }           
            
            if(odaProjCor){
                var adaProjCorSplit = odaProjCor.split(" ");
                if(adaProjCorSplit.length == 3)
                    var staffObj = aa.person.getUser(adaProjCorSplit[0], adaProjCorSplit[1], adaProjCorSplit[3]).getOutput();
                else
                    var staffObj = aa.person.getUser(adaProjCorSplit[0], "", adaProjCorSplit[1]).getOutput();
                
                if(staffObj && staffObj.email != null && staffObj.email != undefined && staffObj.email != "") {
                    ccEmails += staffObj.email + ";";
                    addParameter(emailParams, "$$projectCoordinatorEmail$$", staffObj.email)
                }
            }
            //Get document deep link URL
            
            //Get ACA Url
            vACAUrl = lookup("ACA_CONFIGS", "ACA_SITE");
            vACAUrl = vACAUrl.substr(0, vACAUrl.toUpperCase().indexOf("/ADMIN"));
            var docNotFound = true;
            vDocumentList = aa.document.getDocumentListByEntity(capId, "CAP");
            if (vDocumentList != null) {
                vDocumentList = vDocumentList.getOutput();
            }
            
            if (vDocumentList != null) {
                for (y = 0; y < vDocumentList.size(); y++) {
                    vDocumentModel = vDocumentList.get(y);
                    vDocumentCat = vDocumentModel.getDocCategory();
                    if (vDocumentCat == "Pre-Application Meeting Notes") {
                        //Add the document url to the email paramaters using the name: $$acaDocDownloadUrl$$
                        getACADocDownloadParam4Notification(emailParams, vACAUrl, vDocumentModel);
                        logDebug("including document url: " + emailParams.get('$$acaDocDownloadUrl$$'));
                        aa.print("including document url: " + emailParams.get('$$acaDocDownloadUrl$$'));
                        docNotFound = false;
                        break;
                    }
                }
            }
            //If no documents found then we just add the record link
            if(!vDocumentList || docNotFound) addParameter(emailParams, "$$acaDocDownloadUrl$$", recordURL);
            
            var sendResult = sendNotification("noreply@auroragov.org",resParEmail,ccEmails,emailTemplate,emailParams,reportFile,capID4Email);
            if (!sendResult) { logDebug("script225: UNABLE TO SEND NOTICE!  ERROR: "+ sendResult.getErrorMessage()); }
            else { logDebug("script225: Sent email notification of meeting notes to "+ resParEmail + ", and CC to " + ccEmails)}
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function odaScript225_emailMeetingNotes(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function odaScript225_emailMeetingNotes(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("odaScript225_emailMeetingNotes() ended");
}//END odaScript225_emailMeetingNotes()
function ownerExistsOnCap(){
	capOwnerResult = aa.owner.getOwnerByCapId(capId);
	if (capOwnerResult.getSuccess()) {
		owner = capOwnerResult.getOutput();
		for (o in owner) {
			return true;
			}
		}
return false;

}
/**
 * calculate and add a Fee based on criteria 
 * @param workFlowTask add the fee when wfTask match this, optional send null to ignore (for ASA)
 * @param workflowStatusArray add the fee when wfStatus match one of this, optional send null to ignore (for ASA)
 * @returns {Boolean}
 */
function permitNoPlansFeeCalculation(workFlowTask, workflowStatusArray, permitFeeTypeAsiName, permitFeeTypeTotalAsiName, gisSvcName, gisLayerName, gisAttrName) {
    logDebug("permitNoPlansFeeCalculation started.");
    var canAddFees = false;

    if (workFlowTask && workFlowTask != null && workflowStatusArray && workflowStatusArray != null) {
        if (wfTask == workFlowTask) {

            for (s in workflowStatusArray) {
                if (wfStatus == workflowStatusArray[s]) {
                    canAddFees = true;
                    break;
                }
            }//for all status options
        } else {
            return false;
        }
    } else {
        //not Workflow related (most probably ASA) always true
        canAddFees = true;
    }

    if (!canAddFees) {
        return false;
    }

    //check if AInfo is loaded with useAppSpecificGroupName=true,
    //we need it useAppSpecificGroupName=false, most of time we don't have subgroup name
    var asiValues = new Array();
    if (useAppSpecificGroupName) {
        var olduseAppSpecificGroupName = useAppSpecificGroupName;
        useAppSpecificGroupName = false;
        loadAppSpecific(asiValues);
        useAppSpecificGroupName = olduseAppSpecificGroupName;
    } else {
        asiValues = AInfo;
    }

    //determine Fee Code / Fee Sched to sue based on record type
    var feeSched = null;
    var feeCodesAry = [];
	feeSched = "BLD_PNP";
	feeCodesAry["BUILDING_FEE_FLAT"] = "BLD_PNP_06";
	feeCodesAry["BUILDING_FEE_VALUATION"] = "BLD_PNP_01";
	feeCodesAry["ARAPAHOE_FEE_1"] = "BLD_PNP_03";
	feeCodesAry["ARAPAHOE_FEE_2"] = "BLD_PNP_04";
	feeCodesAry["BUILDING_USE_TAX_FEE"] = "BLD_PNP_02";
	feeCodesAry["BUILDING_DRIVEWAY_FEE"] = "BLD_PNP_11";

    
    //check County in address:
    var county = null;
    var addResult = aa.address.getAddressByCapId(capId);
    if (addResult.getSuccess()) {
        var addResult = addResult.getOutput();
        if (addResult != null && addResult.length > 0) {
            addResult = addResult[0];
            county = addResult.getCounty();
        }//has address(es)
    }//get address success

    //still null? try parcel:
    if (county == null || county == "") {
        var parcels = aa.parcel.getParcelByCapId(capId, null);
        if (parcels.getSuccess()) {
            parcels = parcels.getOutput();

            if (parcels != null && parcels.size() > 0) {
                var attributes = parcels.get(0).getParcelAttribute().toArray();
                for (p in attributes) {
                    if (attributes[p].getB1AttributeName().toUpperCase().indexOf("COUNTY") != -1) {
                        county = attributes[p].getB1AttributeValue();
                        break;
                    }
                }//for parcel attributes
            }//cap has parcel
        }//get parcel success
    }//county is null

    //still null? try GIS:
    if (county == null || county == "") {
        var PARCEL_COUNTY = getGISInfo(gisSvcName, gisLayerName, gisAttrName);
        if (PARCEL_COUNTY) {
            county = PARCEL_COUNTY;
        }
    }

    //Arapahoe county Fee  
    if (county == "ARAPAHOE") {
        var feeQty = 0;
        var materialsCost = asiValues["Materials Cost"];
        var valuation = asiValues["Valuation"];
        if (materialsCost && materialsCost != null && materialsCost != "" && valuation && valuation != null && valuation != ""
                && parseFloat(materialsCost) <= (parseFloat(valuation) / 2)) {
            feeQty = parseFloat(valuation)/2;
        } else if (materialsCost && materialsCost != null && materialsCost != "" && valuation && valuation != null && valuation != ""
                && parseFloat(materialsCost) > (parseFloat(valuation) / 2)) {
            feeQty = parseFloat(materialsCost);
        }

        if (feeQty > 0) {
            updateFee(feeCodesAry["ARAPAHOE_FEE_1"], feeSched, "FINAL", feeQty, "Y");
            updateFee(feeCodesAry["ARAPAHOE_FEE_2"], feeSched, "FINAL", feeQty, "Y");
        }
    }//county = Arapahoe   
    
        //Driveway Fee
        var feeQty = 0;
        var driveways = asiValues["# of Driveways"];
        if (driveways && driveways != null && driveways != "") {
            feeQty = parseFloat(driveways);
        }

        if (feeQty > 0) {
            updateFee(feeCodesAry["BUILDING_DRIVEWAY_FEE"], feeSched, "FINAL", feeQty, "Y");
        }
       
    //Building Use Tax Fee
    var feeQty = 0;
    var materialsCost = asiValues["Materials Cost"];
    var valuation = asiValues["Valuation"];

    if (materialsCost && materialsCost != null && materialsCost != "" && valuation && valuation != null && valuation != ""
            && parseFloat(materialsCost) <= (parseFloat(valuation) / 2)) {
        feeQty = parseFloat(valuation)/2;
    } else if (materialsCost && materialsCost != null && materialsCost != "" && valuation && valuation != null && valuation != ""
            && parseFloat(materialsCost) > (parseFloat(valuation) / 2)) {
        feeQty = parseFloat(materialsCost);
    }

    if (feeQty > 0) {
        updateFee(feeCodesAry["BUILDING_USE_TAX_FEE"], feeSched, "FINAL", feeQty, "Y");
    }//END Building Use Tax Fee
	
try{    
	updateFee(feeCodesAry["BUILDING_FEE_FLAT"], feeSched, "FINAL", 1, "Y");
    //Building Fee (Flat Fee)
    /*var permitTypeTotal = asiValues[permitFeeTypeTotalAsiName];
    if (asiValues[permitFeeTypeAsiName] && asiValues[permitFeeTypeAsiName] != null && asiValues[permitFeeTypeAsiName] != "" && asiValues[permitFeeTypeAsiName] != "Other" && parseFloat(permitTypeTotal)> 0) {
        var permitTypeTotal = asiValues[permitFeeTypeTotalAsiName];
        if (permitTypeTotal && permitTypeTotal != null && permitTypeTotal != "" && parseFloat(permitTypeTotal ) > 0) {
            if (appTypeArray && String(appTypeArray[2]).equalsIgnoreCase("Plans")){
            updateFee(feeCodesAry["BUILDING_FEE_FLAT"], feeSched, "FINAL", 1, "Y");
            }
        } else {
            logDebug("**WARN " + permitFeeTypeAsiName + " is NOT empty and " + permitFeeTypeTotalAsiName + " is empty, no fees added");
        }
    } else if (!asiValues[permitFeeTypeAsiName] || asiValues[permitFeeTypeAsiName] == null || asiValues[permitFeeTypeAsiName] == "" || asiValues[permitFeeTypeAsiName] == "Other" || parseFloat(permitTypeTotal ) == 0) 
    {
        ////Building Fee (Valuation) -- add logic for Other (dropdown)
        var valuation = asiValues["Valuation"];
        var perFeeTot = AInfo["Permit Fee Type Total"];
        var feeAmt = 0;
        
        if(perFeeTot && parseFloat(perFeeTot) > 0) feeAmt = parseFloat(perFeeTot);
        else if(valuation && valuation != null && valuation != "") feeAmt = parseFloat(valuation);
        
        if (feeAmt > 0) {
            updateFee(feeCodesAry["BUILDING_FEE_VALUATION"], feeSched, "FINAL", parseFloat(valuation), "Y");
        } else {
            logDebug("**WARN " + permitFeeTypeAsiName + " is empty and Valuation is empty, no fees added");
        }
    }
	*/
    
}
catch (err) {
    handleError(err, "Error on Building Fee script");
}
    logDebug("permitNoPlansFeeCalculation ended.");
    return true;
}

/**
 * calculate and add a Fee based on criteria 
 * @param workFlowTask add the fee when wfTask match this, optional send null to ignore (for ASA)
 * @param workflowStatusArray add the fee when wfStatus match one of this, optional send null to ignore (for ASA)
 * @returns {Boolean}
 */
function permitWithPlansFeeCalculation(workFlowTask, workflowStatusArray, permitFeeTypeAsiName, permitFeeTypeTotalAsiName, gisSvcName, gisLayerName, gisAttrName) {
    logDebug("permitWithPlansFeeCalculation started.");
    var canAddFees = false;

    if (workFlowTask && workFlowTask != null && workflowStatusArray && workflowStatusArray != null) {
        if (wfTask == workFlowTask) {

            for (s in workflowStatusArray) {
                if (wfStatus == workflowStatusArray[s]) {
                    canAddFees = true;
                    break;
                }
            }//for all status options
        } else {
            return false;
        }
    } else {
        //not Workflow related (most probably ASA) always true
        canAddFees = true;
    }

    if (!canAddFees) {
        return false;
    }

    //check if AInfo is loaded with useAppSpecificGroupName=true,
    //we need it useAppSpecificGroupName=false, most of time we don't have subgroup name
    var asiValues = new Array();
    if (useAppSpecificGroupName) {
        var olduseAppSpecificGroupName = useAppSpecificGroupName;
        useAppSpecificGroupName = false;
        loadAppSpecific(asiValues);
        useAppSpecificGroupName = olduseAppSpecificGroupName;
    } else {
        asiValues = AInfo;
    }

    //determine Fee Code / Fee Sched to sue based on record type
    var feeSched = null;
    var feeCodesAry = [];
    if (appTypeArray && String(appTypeArray[2]).equalsIgnoreCase("Plans")) {
        feeSched = "BLD_PWP";
        feeCodesAry["BUILDING_FEE_FLAT"] = "BLD_PWP_01";
        feeCodesAry["BUILDING_FEE_VALUATION"] = "BLD_PWP_06";
        feeCodesAry["ARAPAHOE_FEE_1"] = "BLD_PWP_03";
        feeCodesAry["ARAPAHOE_FEE_2"] = "BLD_PWP_04";
        feeCodesAry["BUILDING_USE_TAX_FEE"] = "BLD_PWP_02";
        feeCodesAry["BUILDING_DRIVEWAY_FEE"] = "BLD_PWP_11";
        feeCodesAry["BUILDING_CHICKEN_FEE"] = "BLD_PWP_12";
    } else if (appTypeArray && String(appTypeArray[2]).equalsIgnoreCase("No Plans")) {
        feeSched = "BLD_PNP";
    //  feeCodesAry["BUILDING_FEE_FLAT"] = "BLD_PNP_06";
        feeCodesAry["BUILDING_FEE_VALUATION"] = "BLD_PNP_01";
        feeCodesAry["ARAPAHOE_FEE_1"] = "BLD_PNP_03";
        feeCodesAry["ARAPAHOE_FEE_2"] = "BLD_PNP_04";
        feeCodesAry["BUILDING_USE_TAX_FEE"] = "BLD_PNP_02";
        feeCodesAry["BUILDING_DRIVEWAY_FEE"] = "BLD_PNP_11";
    }

    if (feeSched == null) {
        logDebug("**WARN could not obtain Fee Schedule from App Type " + appTypeArray);
        return false;
    }
    
    //Chicken Coops Fee
    if(appTypeArray && String(appTypeArray[2]).equalsIgnoreCase("Plans")){
        //Chicken Fee
        var feeQtyCh = 0;
        var chickens = asiValues["# of Chicken Coops"];
        if(chickens && chickens != null && chickens != ""){
            feeQtyCh = parseFloat(chickens);
        }
        
        if(feeQtyCh > 0 && feeCodesAry["BUILDING_CHICKEN_FEE"]){
            updateFee(feeCodesAry["BUILDING_CHICKEN_FEE"], feeSched, "FINAL", 1, "N");
            return true;
        }
    }//END Chicken Coops Fee
    
    //check County in address:
    var county = null;
    var addResult = aa.address.getAddressByCapId(capId);
    if (addResult.getSuccess()) {
        var addResult = addResult.getOutput();
        if (addResult != null && addResult.length > 0) {
            addResult = addResult[0];
            county = addResult.getCounty();
        }//has address(es)
    }//get address success

    //still null? try parcel:
    if (county == null || county == "") {
        var parcels = aa.parcel.getParcelByCapId(capId, null);
        if (parcels.getSuccess()) {
            parcels = parcels.getOutput();

            if (parcels != null && parcels.size() > 0) {
                var attributes = parcels.get(0).getParcelAttribute().toArray();
                for (p in attributes) {
                    if (attributes[p].getB1AttributeName().toUpperCase().indexOf("COUNTY") != -1) {
                        county = attributes[p].getB1AttributeValue();
                        break;
                    }
                }//for parcel attributes
            }//cap has parcel
        }//get parcel success
    }//county is null

    //still null? try GIS:
    if (county == null || county == "") {
        var PARCEL_COUNTY = getGISInfo(gisSvcName, gisLayerName, gisAttrName);
        if (PARCEL_COUNTY) {
            county = PARCEL_COUNTY;
        }
    }

    //Arapahoe county Fee  
    if (county == "ARAPAHOE") {
        var feeQty = 0;
        var materialsCost = asiValues["Materials Cost"];
        var valuation = asiValues["Valuation"];
        if (materialsCost && materialsCost != null && materialsCost != "" && valuation && valuation != null && valuation != ""
                && parseFloat(materialsCost) <= (parseFloat(valuation) / 2)) {
            feeQty = parseFloat(valuation)/2;
        } else if (materialsCost && materialsCost != null && materialsCost != "" && valuation && valuation != null && valuation != ""
                && parseFloat(materialsCost) > (parseFloat(valuation) / 2)) {
            feeQty = parseFloat(materialsCost);
        }

        if (feeQty > 0) {
            updateFee(feeCodesAry["ARAPAHOE_FEE_1"], feeSched, "FINAL", feeQty, "N");
            updateFee(feeCodesAry["ARAPAHOE_FEE_2"], feeSched, "FINAL", feeQty, "N");
        }
    }//county = Arapahoe   
    
        //Driveway Fee
        var feeQty = 0;
        var driveways = asiValues["# of Driveways"];
        if (driveways && driveways != null && driveways != "") {
            feeQty = parseFloat(driveways);
        }

        if (feeQty > 0) {
            updateFee(feeCodesAry["BUILDING_DRIVEWAY_FEE"], feeSched, "FINAL", feeQty, "N");
        }
       
    //Building Use Tax Fee
    var feeQty = 0;
    var materialsCost = asiValues["Materials Cost"];
    var valuation = asiValues["Valuation"];

    if (materialsCost && materialsCost != null && materialsCost != "" && valuation && valuation != null && valuation != ""
            && parseFloat(materialsCost) <= (parseFloat(valuation) / 2)) {
        feeQty = parseFloat(valuation)/2;
    } else if (materialsCost && materialsCost != null && materialsCost != "" && valuation && valuation != null && valuation != ""
            && parseFloat(materialsCost) > (parseFloat(valuation) / 2)) {
        feeQty = parseFloat(materialsCost);
    }

    if (feeQty > 0) {
        updateFee(feeCodesAry["BUILDING_USE_TAX_FEE"], feeSched, "FINAL", feeQty, "N");
    }//END Building Use Tax Fee
	
try{    
    //Building Fee (Flat Fee)
    var permitTypeTotal = asiValues[permitFeeTypeTotalAsiName];
    if (asiValues[permitFeeTypeAsiName] && asiValues[permitFeeTypeAsiName] != null && asiValues[permitFeeTypeAsiName] != "" && asiValues[permitFeeTypeAsiName] != "Other" && parseFloat(permitTypeTotal)> 0) {
        var permitTypeTotal = asiValues[permitFeeTypeTotalAsiName];
        if (permitTypeTotal && permitTypeTotal != null && permitTypeTotal != "" && parseFloat(permitTypeTotal ) > 0) {
            if (appTypeArray && String(appTypeArray[2]).equalsIgnoreCase("Plans")){
            updateFee(feeCodesAry["BUILDING_FEE_FLAT"], feeSched, "FINAL", parseFloat(permitTypeTotal), "N");
            }
        } else {
            logDebug("**WARN " + permitFeeTypeAsiName + " is NOT empty and " + permitFeeTypeTotalAsiName + " is empty, no fees added");
        }
    } else if (!asiValues[permitFeeTypeAsiName] || asiValues[permitFeeTypeAsiName] == null || asiValues[permitFeeTypeAsiName] == "" || asiValues[permitFeeTypeAsiName] == "Other" || parseFloat(permitTypeTotal ) == 0) 
    {
        ////Building Fee (Valuation) -- add logic for Other (dropdown)
        var valuation = asiValues["Valuation"];
        var perFeeTot = AInfo["Permit Fee Type Total"];
        var feeAmt = 0;
        
        if(perFeeTot && parseFloat(perFeeTot) > 0) feeAmt = parseFloat(perFeeTot);
        else if(valuation && valuation != null && valuation != "") feeAmt = parseFloat(valuation);
        
        if (feeAmt > 0) {
            updateFee(feeCodesAry["BUILDING_FEE_VALUATION"], feeSched, "FINAL", parseFloat(valuation), "N");
        } else {
            logDebug("**WARN " + permitFeeTypeAsiName + " is empty and Valuation is empty, no fees added");
        }
    }
    
}
catch (err) {
    handleError(err, "Error on Building Fee script");
}
    logDebug("permitWithPlansFeeCalculation ended.");
    return true;
}
/**
 * main function
 * 
 */
         
function planningCaseAssignmentChange(){
	try {
		   var assignedStaff=getAssignedStaff(capId);
			logDebug("assignedStaff:" + assignedStaff);
			if (typeof(assignedStaff)!="undefined" && assignedStaff!=null && assignedStaff!=""){
				assignWfTask(assignedStaff,capId);
			}
	}catch(err){
		aa.debug("planningCaseAssignmentChange " , err);
	}
}
//Script 284 Activate tasks with statuses of 
// "Proceed Tech" or "Resubmittal Requested"
function plnScript284_activateTasks() {
    logDebug("plnScript284_activateTasks() started");
    try{
        var reviewTasksStatuses = ["Proceed-Tech", "Proceed Tech", "Resubmittal Requested"];
        var workflowTasks = aa.workflow.getTasks(capId).getOutput();
        for (i in workflowTasks) {
            var wfTask = workflowTasks[i];
            if (wfTask.getTaskDescription().indexOf("Review") != -1 && checkWFStatus(wfTask.getDisposition(), reviewTasksStatuses)) {
                if (!isTaskActive(wfTask.getTaskDescription())) {
                    activateTask(wfTask.getTaskDescription());
                }
            }
        }
    }
    catch(err){
        showMessage=true;
        comment("Error on custom function plnScript284_activateTasks(). Error: " + err + ". Line Number: " + err.lineNumber);
    }
    logDebug("plnScript284_activateTasks() ended");
}//END plnScript284_activateTasks()

function populateTreeInformationCustomList(treeInformaionCustomListName) {
    var GISService = "AURORACO";
    var objGISResult = aa.gis.getCapGISObjects(capId); // get gis objects on the cap
    if (objGISResult.getSuccess())
        var fGisObj = objGISResult.getOutput();
    else
        logDebug("**WARNING: Getting GIS objects for CAP.  Reason is: " + objGISResult.getErrorType() + ":" + objGISResult.getErrorMessage());

    var arrGIS = getGISInfoArray_Buffer(GISService, "Trees", ["TREE_ID_NO", "MAN_UNIT", "DIAMETER", "SPECIES"], 3, "feet");
    var br = "<br>";

    if (arrGIS != null && arrGIS.length > 0) {
        for (g in arrGIS) {
            var thisGIS = arrGIS[g];
            var treeIdNo = thisGIS["TREE_ID_NO"];
            var manUnit = thisGIS["MAN_UNIT"];
            var diameter = thisGIS["DIAMETER"];
            var species = thisGIS["SPECIES"];

            logDebug("g: " + g + ": TREE_ID_NO: " + treeIdNo + ",  MAN_UNIT: " + manUnit + ",  DIAMETER: " + diameter + ",  SPECIES: " + species);

            if (!doesASITRowExist("TREE INFORMATION", "Tree ID", treeIdNo)) {
                newRow = new Array();
                newRow["Tree ID"] = new asiTableValObj("Tree ID", treeIdNo, "N");
                if (manUnit && manUnit != "")
                    newRow["Management Unit"] = new asiTableValObj("Management Unit", manUnit, "N");
                else
                    newRow["Management Unit"] = new asiTableValObj("Management Unit", "", "N");
                if (diameter && diameter != "")
                    newRow["Existing Diameter"] = new asiTableValObj("Existing Diameter", diameter, "N");
                else
                    newRow["Existing Diameter"] = new asiTableValObj("Existing Diameter", "", "N");
                if (species && species != "")
                    newRow["Species"] = new asiTableValObj("Species", species, "N");
                else
                    newRow["Species"] = new asiTableValObj("Species", "", "N");

                addToASITable(treeInformaionCustomListName, newRow);
            }
        }
    }
}
function prepareAppForRenewal() {
	logDebug("in prepareAppForRenewal");
	var partialCapId = getIncompleteCapId();
	var parentCapId = aa.env.getValue("ParentCapID");

	logDebug("Parent Cap id from environment = " + parentCapId);
	//1. Check to see if license is ready for renew
	if (isRenewProcess(parentCapId, partialCapId)) {
		logDebug("CAPID(" + parentCapId + ") is ready for renew. PartialCap (" + partialCapId + ")");
		//2. Associate partial cap with parent CAP.
		var result = aa.cap.createRenewalCap(parentCapId, partialCapId, true);
		if (result.getSuccess()) {
			//3. Copy key information from parent license to partial cap
			// copyKeyInfo(parentCapId, partialCapId);
			
			// 4. Update Veteran Custom field if contact is a veteran
			// if(getIfVeteran(parentCapId)) editAppSpecific("Veteran","Yes",partialCapId);
			// if(appMatch("Licenses/Nursing/Registered Nurse/Renewal",partialCapId)) updateRNSpecialtyCertificationTable(partialCapId,parentCapId);
			
			//4. Set B1PERMIT.B1_ACCESS_BY_ACA to "Y" for partial CAP to allow that it is searched by ACA user.
			aa.cap.updateAccessByACA(partialCapId, "Y");
		}
		else { logDebug("ERROR: Associate partial cap with parent CAP. " + result.getErrorMessage()); }
	}
	else { logDebug("This is not renewal process. PartialCapId = " + partialCapId + " ParentCapId = " + parentCapId); }
}

/**
 * if cap has specific status, reject the payment
 * @param rejectCapStatus capStatus to reject payment if matched
*/
function preventPaymentDueToSpecialAssessment(rejectCapStatus) {
	if (cap.getCapModel().getCapStatus() != null && cap.getCapModel().getCapStatus().equalsIgnoreCase(rejectCapStatus)) {
		cancel = true;
		showMessage = true;
		comment("This lien has been transferred to the County under Special Assessment.");
		return true;
	}
	return false;
}
//this global function can be used to quickly get a string of the contents of an object
//such as a fee array or contact array.

function printObject(theobject)
{
	var debugline = "";
	for (var item in theobject )
	{	
		debugline += "*********** ITEM " + item + " ***********<br>";
		for (var prop in theobject[item])
		{
			debugline += prop + ":" + theobject[item][prop] + "<br>";
		}
		debugline += "<br><br>";
	}
	return debugline;
}
function printObjProps (obj) {
    var idx;

    if (obj.getClass != null) {
        aa.print("************* " + obj.getClass() + " *************");
    }
    for (idx in obj) {
        if (typeof (obj[idx]) == "function") {
            try {
                aa.print(idx + ":  " + obj[idx]());
            } catch (ex) { }
        } else {
            aa.print(idx + ":  " + obj[idx]);
        }
    }
    aa.print("***********************************************");
}   
/* Process Notice of Violation script
 * Params:
 * @iType (String) - Inspection Type to check for
 * @iResult (String) - Inspection Result to check for
 * @createNewInsp (boolean) - Create new Notice of Violation inspection
 * @updateWf (boolean) - Update a workflow task with a status
 * @wfTsk2Update (String) - workflow task to update
 * @wfSt2Update (String) - workflow task status to update the task to
 */
function processNotOfViolInsp(iType, iResult, createNewInsp, insp2Create, updateWf, wfTsk2Update, wfSt2Update){
    logDebug("noticeOfViolationInspection() started");
    try{
        var $iTrc = ifTracer;
        var newInspReqComments = getInspReqCommsByInspID(inspId);
        var inspector = getInspectorByInspID(inspId);
        var inspDaysAhead = days_between(aa.util.parseDate(dateAdd(null, 0)), aa.util.parseDate(dateAdd(inspResultDate, 7, true)));
        if($iTrc(inspType == iType && inspResult == iResult, inspType + ' == ' + iType + ' && ' + inspResult + ' == ' + iResult)){
            if($iTrc(createNewInsp, "create new inspection"))
                scheduleInspection(insp2Create, inspDaysAhead, currentUserID, null, newInspReqComments);
            if($iTrc(updateWf, "update worflow")){
                if(!isTaskActive(wfTsk2Update))
                    activateTask(wfTsk2Update);
                
                //if(wfTsk2Update == "Investigation" && wfSt2Update == "Notice of Violation")
                //    closeTask(wfTsk2Update, wfSt2Update);
                //else
                //    updateTask(wfTsk2Update, wfSt2Update);
			    resultWorkflowTask(wfTsk2Update, wfSt2Update);
            }
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on noticeOfViolationInspection(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
        logDebug("Error on noticeOfViolationInspection(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("noticeOfViolationInspection() ended");
}
//Script 183 - Scenario 2
function pubWrksScript183_assessFees(){
    logDebug("pubWrksScript183_assessFees() stared");
    try{
        var typeOfImpvs = loadASITable("TYPE OF IMPROVEMENTS");
        var feeItem = "";
        var feeSched = "PW_PIP";
        var feePeriod = "FINAL";
        var feeQty = 0;
        var feeInv = "N";
        var feesAdded = [];
        var possibleFees = ["PW_PIP_13","PW_PIP_15","PW_PIP_16","PW_PIP_14","PW_PIP_23","PW_PIP_31","PW_PIP_32","PW_PIP_03","PW_PIP_34","PW_PIP_17","PW_PIP_05","PW_PIP_37","PW_PIP_20","PW_PIP_22","PW_PIP_04","PW_PIP_11","PW_PIP_19","PW_PIP_18","PW_PIP_12","PW_PIP_02","PW_PIP_10","PW_PIP_01","PW_PIP_07","PW_PIP_21","PW_PIP_09","PW_PIP_08","PW_PIP_24","PW_PIP_06"];
        
        for(var i in typeOfImpvs){
            var aRow = typeOfImpvs[i];
            var impvType = aRow["Type"].fieldValue;
            var impvTypeNum = aRow["Ea / Sq. Ft. / Lineal Ft."].fieldValue;
            
            if(impvType == null || impvTypeNum == null) { logDebug("WARNING: There is no value for 'Type' and/or 'Ea / Sq. Ft. / Lineal Ft.' in line " + (parseInt(i) + 1)); continue;}
            if(impvType == "Combo Curb, Gutter, Walk (LF)")                        { feeItem = "PW_PIP_13"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Cross Pans (EA)")                                      { feeItem = "PW_PIP_15"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Curb Cut for Driveway (EA)")                           { feeItem = "PW_PIP_16"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Curb Ramp (EA)")                                       { feeItem = "PW_PIP_14"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Directional Bore (LF)")                                { feeItem = "PW_PIP_23"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Driveway (EA)")                                        { feeItem = "PW_PIP_31"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Dry Utility Permit (SINGLE FEE)")                      { feeItem = "PW_PIP_32"; feeQty = 1; }
            if(impvType == "Guardrail (SINGLE FEE)")                               { feeItem = "PW_PIP_03"; feeQty = 1; }
            if(impvType == "Materials Lab (SINGLE FEE)")                           { feeItem = "PW_PIP_34"; feeQty = 1; }
            if(impvType == "Median Cover-Concrete or Aggregate (SF)")              { feeItem = "PW_PIP_17"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Median Curb and Gutter (LF)")                          { feeItem = "PW_PIP_05"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Mid Block Ramp (EA)")                                  { feeItem = "PW_PIP_37"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Mill & Overlay (SF)")                                  { feeItem = "PW_PIP_20"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Misc. w/Description (EA)")                             { feeItem = "PW_PIP_22"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Monitoring Well (EA)")                                 { feeItem = "PW_PIP_04"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Mountable Curb and Gutter (LF)")                       { feeItem = "PW_PIP_11"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Paving New Roads Including Subgrade Preparation (SF)") { feeItem = "PW_PIP_19"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Potholes (1-5 Lump Sum; More than 5 (EA))")            { feeItem = "PW_PIP_18"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Retaining Wall (EA)")                                  { feeItem = "PW_PIP_12"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Sidewalk (LF)")                                        { feeItem = "PW_PIP_02"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Sidewalk Chase Drain (EA)")                            { feeItem = "PW_PIP_10"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Small Cell Site (SINGLE FEE)")                         { feeItem = "PW_PIP_01"; feeQty = 1; }
            if(impvType == "Street Cuts (SF)")                                     { feeItem = "PW_PIP_07"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Street/Pedestrian Lights (EA)")                        { feeItem = "PW_PIP_21"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Structures - Box Culverts etc. (CF)")                  { feeItem = "PW_PIP_09"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Structures - Yard Surface (CF)")                       { feeItem = "PW_PIP_08"; feeQty = parseFloat(impvTypeNum); }
            if(impvType == "Traffic Signal (SINGLE FEE)")                          { feeItem = "PW_PIP_24"; feeQty = 1; }
            if(impvType == "Vertical Curb and Gutter (LF)")                        { feeItem = "PW_PIP_06"; feeQty = parseFloat(impvTypeNum); }
            
            if(feeItem != "" && feeQty > 0) {
                logDebug("Adding fee " + feeItem + " with quantity of " + feeQty + ". For " + impvType + ".");
                updateFee(feeItem, feeSched, feePeriod, feeQty, feeInv);
                feesAdded.push(feeItem);
                feeItem = ""; feeQty = 0;
                logDebug("*****************************************************************************************");
            }
        }
        
        for(posFee in possibleFees){
            var pFee = possibleFees[posFee];
            if(!contains(feesAdded, pFee)) { if(feeExists(pFee)) removeFee(pFee, feePeriod); }
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function (). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function (). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("pubWrksScript183_assessFees() ended");
}//END pubWrksScript183_assessFees()
function pubWrksScript183_assessFeesScenario1(){
    logDebug("pubWrksScript183_assessFeesScenario1() started.");
    try{
        var feeItem      = "";
        var feeSched     = "PW_PIP";
        var feePeriod    = "FINAL";
        var feeQty       = 0;
        var feeInv       = "N";
        var reAppFee     = AInfo["Re-Application Fee"];
        var revFee       = AInfo["Review Fee"];
        var trafCtrlInfo = loadASITable("TRAFFIC CONTROL INFORMATION");
		
		var reAppFeeItem = "PW_PIP_36";
		var revFeeItem = "PW_PIP_35";
        
        if(reAppFee == "Yes")
            updateFee(reAppFeeItem, feeSched, feePeriod, 1, feeInv);
		else { if(feeExists(reAppFeeItem)) removeFee(reAppFeeItem, feePeriod); }
        if(revFee == "Yes")
            updateFee(revFeeItem, feeSched, feePeriod, 1, feeInv);
		else { if(feeExists(revFeeItem)) removeFee(revFeeItem, feePeriod); }
        
        for(eachRow in trafCtrlInfo){
            var aRow = trafCtrlInfo[eachRow];
            feeQty += parseFloat(aRow["Street Occupancy Fee Amount"]);
        }
        
        if(feeQty > 0) updateFee("PW_PIP_30", feeSched, feePeriod, feeQty, feeInv);
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function pubWrksScript183_assessFeesScenario1(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function pubWrksScript183_assessFeesScenario1(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("pubWrksScript183_assessFeesScenario1() ended.");
}//END pubWrksScript183_assessFeesScenario1()
function pWrksScript145_updateAppName(srcCapId, targetCapId){
    logDebug("pWrksScript145_updateAppName() started");
    try{
	    var $iTrc = ifTracer;
        var parentCapId = getParent();
	    if($iTrc(parentCapId, parentCapId)) copyAppName(parentCapId, capId);
    }
    catch(err){
        showMessage = true;
        comment("Error on pWrksScript145_updateAppName(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
        logDebug("Error on pWrksScript145_updateAppName(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
    }    
}//END pWrksScript145_updateAppName()
function pWrksScript180_emailPermit(){
    logDebug("pWrksScript180_emailPermit() started");
    try{
        var emailTemplate = "PW PI ISSUED # 180";
		var reportTemplate = "PW_Public_Improvement_Permit";
        var emailParams = aa.util.newHashtable();
		var reportParams = aa.util.newHashtable();
        var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
        acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
        var recordURL = getACARecordURL(acaURLDefault);
        var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
        var reportFile = [];
        var emlTo = getContactEmailAddress("Applicant", capId);
        
        addParameter(emailParams, "$$altID$$", capIDString);
		//addParameter(emailParams, "$$acaDocDownloadURL$$", reportTemplate);
        addParameter(emailParams, "$$acaRecordUrl$$", recordURL);
		
		addParameter(reportParams, "RecordID", capIDString);
        
        if(emlTo)
			emailContacts("Applicant", emailTemplate, emailParams, reportTemplate, reportParams);
    }
    catch(err){
        showMessage = true;
        comment("Error on function pWrksScript180_emailPermit(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
        logDebug("Error on function pWrksScript180_emailPermit(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("pWrksScript180_emailPermit() ended");
}//END pWrksScript180_emailPermit()
function pWrksScript289_subPlatNotification(){
    logDebug("pWrksScript289_subPlatNotification() started");
    try{
        var emailTemplate = "PLN SUB PLAT RECORDED # 289";
        var emailParams = aa.util.newHashtable();
        var recepNumber = AInfo["Reception Number"];
        var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
        acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
        var recordURL = getACARecordURL(acaURLDefault);
        var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
        var reportFile = [];
        var emlTo = getAllContactsEmails();
        
        addParameter(emailParams, "$$altID$$", capIDString);
        addParameter(emailParams, "$$recordName$$", capName);
        addParameter(emailParams, "$$receptionNumber$$", recepNumber);
        addParameter(emailParams, "$$acaRecordUrl$$", recordURL);
        if(emlTo){
            var sendResult = sendNotification("noreply@aurora.gov",emlTo,"",emailTemplate,emailParams,reportFile,capID4Email);
            if (!sendResult) { logDebug("pWrksScript289_subPlatNotification: UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
            else { logDebug("pWrksScript289_subPlatNotification: Sent email notification that application has been recorded to "+emlTo)}
        }
        else
            logDebug("WARNING: There are no emails on file for the contacts.");
    }
    catch(err){
        showMessage = true;
        comment("Error on function pWrksScript289_subPlatNotification(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
        logDebug("Error on function pWrksScript289_subPlatNotification(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("pWrksScript289_subPlatNotification() ended");
}//END pWrksScript289_subPlatNotification()
//Script 292
function pWrksScript292_sendIncompleteEmail(){
    logDebug("pWrksScript292_sendIncompleteEmail() started");
    try{
        var emailTemplate = "PW EA INCOMPLETE COMPLETENESS CHECK # 292";
        var applicantEmail = getContactEmailAddress("Applicant", capId);
        var permitFile = "";
        
        if(applicantEmail){
            var emailParams = aa.util.newHashtable();
            var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
            acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
            var recordURL = getACARecordURL(acaURLDefault);
            var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
            var reportFile = [];
            var emlTo = applicantEmail;
            
            addParameter(emailParams, "$$altID$$", capIDString);
            addParameter(emailParams, "$$acaRecordUrl$$", recordURL);
			addParameter(emailParams, "$$wfComment$$", wfComment == null ? "" : wfComment);
            
            var sendResult = sendNotification("noreply@aurora.gov",emlTo,"",emailTemplate,emailParams,reportFile,capID4Email);
            if (!sendResult) { logDebug("pWrksScript292_sendIncompleteEmail: UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
            else { logDebug("pWrksScript292_sendIncompleteEmail: Sent email notification that work order is complete to "+emlTo)}
        }
        else
            logDebug("WARNING: No applicant email on the record.");
    }
    catch(err){
        showMessage = true;
        comment("Error on function pWrksScript292_sendIncompleteEmail(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
        logDebug("Error on function pWrksScript292_sendIncompleteEmail(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("pWrksScript292_sendIncompleteEmail() ended");
}//END pWrksScript292_sendIncompleteEmail();
function pWrksScript293_addFeeEmailReadyToPay(){
    logDebug("pWrksScript293_addFeeEmailReadyToPay() started");
    try{
        var $iTrc = ifTracer,
            reviewFee = AInfo["Review Fee?"],
            feeItem = "PW_EAS_01",
            sendEmail = false,
            emailTemplate = "PW READY TO PAY #123",
            applicantEmail = getContactEmailAddress("Applicant", capId);
            
        if($iTrc(reviewFee == "Yes", 'Review Fee')){
            if($iTrc(feeExists(feeItem) && feeExists(feeItem, "INVOICED") && feeBalance(feeItem) > 0, 'fee is invoiced and has balance'))
                sendEmail = true;
            if($iTrc(!feeExists(feeItem) || (feeExists(feeItem) && !feeExists(feeItem, "INVOICED") && feeBalance(feeItem) > 0), 'fee does not exists OR exists but it is not invoiced and has a balance.')){
                updateFee(feeItem, "PW_EASMNT", "FINAL", 1, "Y");
                sendEmail = true;
            }
            
            if($iTrc(sendEmail && applicantEmail, 'sendMail')){
                
                var contactTypes = 'Applicant';
                var acaUrl = lookup("ACA_CONFIGS","OFFICIAL_WEBSITE_URL");
                emailparams = aa.util.newHashtable();
                emailparams.put("$$ContactEmail$$", applicantEmail);
                emailparams.put("$$recordAlias$$", appTypeAlias);
                emailparams.put("$$altID$$", capId.getCustomID());
                emailparams.put("$$acaRecordUrl$$", acaUrl);
                emailparams.put("$$wfComment$$", wfComment == null ? "" : wfComment);
                
                emailContacts(contactTypes, emailTemplate, emailparams, "", "", "N", "");
            }
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on function pWrksScript293_addFeeEmailReadyToPay(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
        logDebug("Error on function pWrksScript293_addFeeEmailReadyToPay(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("pWrksScript293_addFeeEmailReadyToPay() ended");
}//END pWrksScript293_addFeeEmailReadyToPay()
function pWrksScript303_reqOwnerSigEmail(){
    logDebug("pWrksScript303_reqOwnerSigEmail() started");
    try{
        var $iTrc = ifTracer,
            emailTemplate = "PW REAL PROP OWNER SIGNATURE # 303",
			applicantEmail = getContactEmailAddress("Applicant", capId);
		
            
        if($iTrc(applicantEmail, 'applicantEmail')){
            var contactTypes = 'Applicant';
            var acaUrl = lookup("ACA_CONFIGS","OFFICIAL_WEBSITE_URL");
            emailparams = aa.util.newHashtable();
            emailparams.put("$$ContactEmail$$", applicantEmail);
            emailparams.put("$$recordAlias$$", appTypeAlias);
            emailparams.put("$$altID$$", capId.getCustomID());
            emailparams.put("$$acaRecordUrl$$", acaUrl);
            //emailparams.put("$$wfComment$$", wfComment == null ? "" : wfComment);
            
            emailContacts(contactTypes, emailTemplate, emailparams, "", "", "N", "");
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on function pWrksScript303_reqOwnerSigEmail(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
        logDebug("Error on function pWrksScript303_reqOwnerSigEmail(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("pWrksScript303_reqOwnerSigEmail() ended");
}//END pWrksScript303_reqOwnerSigEmail()
function pWrksScript305_updateTaskDueDate(){
    logDebug("pWrksScript305_updateTaskDueDate() started");
    try{
        var newDueDate = dateAdd(wfDateMMDDYYYY, 180);
        editTaskDueDate("Signatures", newDueDate);
    }
    catch(err){
        showMessage = true;
        comment("Error on function pWrksScript305_updateTaskDueDate(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
        logDebug("Error on function pWrksScript305_updateTaskDueDate(). Err: " + err + ". Line Number: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("pWrksScript305_updateTaskDueDate() ended");
}//END pWrksScript305_updateTaskDueDate()
/**
 * 
 * @param emailTemplate email template 
 * @param reviewTasksStatuses the task status that need to check
 * @returns {Boolean} return true if the success otherwise will return false
 */
function reactivateTasksAndSendemail(emailTemplate, reviewTasksStatuses) {
	var workflowTasks = aa.workflow.getTasks(capId).getOutput();
	for (i in workflowTasks) {
		var wfTask = workflowTasks[i];
		if (wfTask.getTaskDescription().indexOf("Review") != -1 && checkWFStatus(wfTask.getDisposition(), reviewTasksStatuses)) {
			if (!isTaskActive(wfTask.getTaskDescription())) {
				activateTask(wfTask.getTaskDescription());
			}

		}
	}
	var applicantEmail = null;
	var recordApplicant = getContactByType("Applicant", capId);
	if (recordApplicant) {
		applicantEmail = recordApplicant.getEmail();
	}
	if (applicantEmail == null) {
		logDebug("**WARN Applicant on record " + capId + " has no email");
		return false
	}

	var files = new Array();
	var eParams = aa.util.newHashtable();
	addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
	addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
	addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
	addParameter(eParams, "$$wfTask$$", wfTask);
	addParameter(eParams, "$$wfStatus$$", wfStatus);
	if (wfComment != null && typeof wfComment !== 'undefined') {
		addParameter(eParams, "$$wfComment$$", wfComment);
	}
	var sent = aa.document.sendEmailByTemplateName("", applicantEmail, "", emailTemplate, eParams, files);
	if (!sent.getSuccess()) {
		logDebug("**ERROR sending email failed, error:" + sent.getErrorMessage());
		return false;
	}

	return true;

}

//removeContactsFromCap()
function removeContactsFromCap(itemCapId){
    var cons = aa.people.getCapContactByCapID(itemCapId).getOutput();
    for (x in cons){
        conSeqNum = cons[x].getPeople().getContactSeqNumber();
	    if (conSeqNum){	
		    aa.people.removeCapContact(itemCapId, conSeqNum);
	    }
    }
}
//removeContactsFromCapByType()
function removeContactsFromCapByType(itemCapId, conType){
    var cons = aa.people.getCapContactByCapID(itemCapId).getOutput();
    for (x in cons){
        var conSeqNum = cons[x].getPeople().getContactSeqNumber();
		var thisConType = cons[x].getPeople().getContactType();
	    if (conSeqNum && thisConType == conType){	
		    aa.people.removeCapContact(itemCapId, conSeqNum);
	    }
    }
}
function removeDuplicateParcelsFromTable(pParcelTable) {
	//go through ASIT array and remove duplicates
	try {
		//aa.print("- Inside removeDuplicateParcelsFromTable()");
		var parcelFound = false

		//copy table for comparision
		compareTable = pParcelTable;
		for (indxCT in compareTable) {
			var compareTableRow = compareTable[indxCT]
			//aa.print("-- checking >" + compareTableRow["Parcel"] + "<");
			parcelFound = false;

			for (var indexPT = 0; indexPT < pParcelTable.length; indexPT++) {
				var pParcelTableRow = pParcelTable[indexPT]
				//aa.print("--- comparing >" + compareTableRow["Parcel"] + "< to >" + pParcelTableRow["Parcel"] + "<");

				if (String(compareTableRow["Parcel"]) == String(pParcelTableRow["Parcel"])) {
					//aa.print("---- found match");
					if (parcelFound) {
						//aa.print("**** splicing " + pParcelTableRow["Parcel"]);
						pParcelTable.splice(indexPT, 1);
						indexPT = indexPT - 1;
					} else {
						parcelFound = true;
						//aa.print("---- setting parcelFound = " + parcelFound);
					}

				}
			}
		}
	} catch (err) {
		logDebug("A JavaScript Error occurred in custom function removeDuplicateParcelsFromTable(): " + err.message);
		//aa.print("A JavaScript Error occurred in custom function removeDuplicateParcelsFromTable(): " + err.message);
	}
}
function removeDuplicatesFromMultipleParcelsTable() {
	try {
		var asiTableName = "MULTIPLE PARCELS";
		parcelTable = loadASITable(asiTableName, capId);

		//remove primary parcel if in table
		removeParcelFromTable(parcelTable, getPrimaryParcel());

		//remove duplicates in table
		removeDuplicateParcelsFromTable(parcelTable);

		removeASITable(asiTableName);

		addASITable(asiTableName, parcelTable);
	} catch (err) {
		logDebug("A JavaScript Error occurred in custom function removeDuplicatesFromMultipleParcelsTable(): " + err.message);
	}
}


function removeMasterPlanDataFromShrdDDList(appStatusArray, stdChoiceName) {
    logDebug("removeMasterPlanDataFromShrdDDList() started");
    var statusMatch = false;
    var currentAppStatus = cap.getCapModel().getCapStatus();

    for (s in appStatusArray) {
        if (currentAppStatus == appStatusArray[s]) {
            var appName = cap.getSpecialText();
            if (appName == null || appName == "") {
                logDebug("application name is null or empty, capId=" + capId);
                return false;
            }
            deactivateSD(stdChoiceName, appName);
            clearBizDomainCache();
			logDebug("removeMasterPlanDataFromShrdDDList() ended with true");
            return true;
        }
    }//for all status options
	
	logDebug("removeMasterPlanDataFromShrdDDList() ended with false");
    return false;
}
function removeParcelFromTable(pParcelTable, pParcelNo) {
	//remove all occurrences of a single parcel from ASI Table
	try {
		//aa.print("- Inside removeParcelFromTable()");
		//aa.print("- removing parcel #" + pParcelNo);

		var psn = 0;
		while (psn < pParcelTable.length) {
			var currentRow = pParcelTable[psn];
			//aa.print("-- currentRow[Parcel] = " + currentRow["Parcel"]);
			if (String(currentRow["Parcel"]) == String(pParcelNo)) {
				//aa.print("--- found match, splicing " + currentRow["Parcel"]);
				pParcelTable.splice(psn, 1);
				//aa.print("new parcelTable Table length = " + pParcelTable.length);
				psn -= 1;

			}
			psn += 1;
			//aa.print("new psn = " + psn);
		}

	} catch (err) {
		logDebug("A JavaScript Error occurred in custom function removeParcelFromTable(): " + err.message);
		//aa.print("A JavaScript Error occurred in custom function removeParcelFromTable(): " + err.message);
	}
}
function requireDataInSpecialInspections() {
	logDebug("requireDataInSpecialInspections() started");
    try {
		var $iTrc = ifTracer;
        if ($iTrc((wfTask == "Special Inspections Check" && wfStatus == "Report Received") || (wfTask == "Special Inspection Check" && wfStatus == "Reports Received"), 'wf:Special Inspections Check/Report Received OR Special Inspection Check/Reports Received")')) {
            var specialInspections = getASIgroup("SPECIAL INSPECTIONS", capId);
            if (specialInspections != null) {
                var missingData = "";
                for (xx in specialInspections) {

                    //check if ___Required field and filled
                    var asiFieldName = specialInspections[xx].getCheckboxDesc();
                    if (new java.lang.String(asiFieldName).endsWith("Required") && typeof (specialInspections[xx].getChecklistComment()) != "undefined"
                            && !isBlankOrNull(specialInspections[xx].getChecklistComment())) {

                        asiFieldName = asiFieldName.trim();

                        //validate it's __Received field
                        var asiFieldReceived = asiFieldName.substring(0, asiFieldName.lastIndexOf(" ")) + " Received";
                        if (!validateField(asiFieldReceived, specialInspections)) {
                            missingData += asiFieldName + ",";
                        }

                    }//need validation
                }//for all ASIs

                if (!isBlankOrNull(missingData)) {//remove last ,
                    missingData = missingData.substring(0, missingData.length - 1);
                    //throw ("The following data is required : " + missingData);
                    cancel = showMessage = true;
                    comment("The following data is required : " + missingData);
                }
            }//specialInspections
        }//task and status match

    } catch (e) {
        cancel = true;
        showMessage = true;
        comment(e);
    }
	logDebug("requireDataInSpecialInspections() ended");
}//END requireDataInSpecialInspections()

function resubmittalRequestedEmailNotification(workFlowTask, workflowStatusArray, emailTemplate) {

	if (workFlowTask == null || wfTask == workFlowTask) {

		var statusMatch = false;

		for (s in workflowStatusArray) {
			if (wfStatus == workflowStatusArray[s]) {
				statusMatch = true;
				break;
			}
		}
		//for all status options
		if (!statusMatch) {
			return false;
		}

		var contacts = getContactArray();
		if (!contacts) {
			logDebug("**WARN no contacts found on cap " + capId);
			return false;
		}

		var toEmails = new Array();
		for (c in contacts) {
			if (contacts[c]["email"] && contacts[c]["email"] != null && contacts[c]["email"] != "") {
				toEmails.push(contacts[c]["email"]);
			}
		}

		if (toEmails.length == 0) {
			logDebug("**WARN no contacts with valid email on cap " + capId);
			return false;
		}
// set up parameters for template
var acaSiteUrl = lookup("ACA_CONFIGS", "ACA_SITE");
var subStrIndex = acaSiteUrl.toUpperCase().indexOf("/ADMIN");
var acaCitizenRootUrl = acaSiteUrl.substring(0, subStrIndex);

var deepUrl = "/urlrouting.ashx?type=1000";
deepUrl = deepUrl + "&Module=" + cap.getCapModel().getModuleName();
deepUrl = deepUrl + "&capID1=" + capId.getID1();
deepUrl = deepUrl + "&capID2=" + capId.getID2();
deepUrl = deepUrl + "&capID3=" + capId.getID3();
deepUrl = deepUrl + "&agencyCode=" + aa.getServiceProviderCode();
deepUrl = deepUrl + "&HideHeader=true";
var recordDeepUrl = acaCitizenRootUrl + deepUrl;
var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
var reportFile = [];
		var eParams = aa.util.newHashtable();
		addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
		addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
		addParameter(eParams, "$$balance$$", feeBalance(""));
		addParameter(eParams, "$$wfTask$$", wfTask);
		addParameter(eParams, "$$wfStatus$$", wfStatus);
		addParameter(eParams, "$$wfDate$$", wfDate);
		addParameter(eParams, "$$wfComment$$", wfComment);
		addParameter(eParams, "$$wfStaffUserID$$", wfStaffUserID);
		addParameter(eParams, "$$wfHours$$", wfHours);
		addParameter(eParams, "$$recordDeepUrl$$", recordDeepUrl);
		/*for (t in toEmails) {
			aa.document.sendEmailByTemplateName("", toEmails[t], "", emailTemplate, eParams, null);
		}*/
        for (t in toEmails) {
		var sendResult = sendNotification("noreply@aurora.gov",toEmails[t],"",emailTemplate,eParams,reportFile,capID4Email);
		}
	} else {
		return false;
	}

	return true;
}
/**
 * results workflow task and sets the status and performs next step based on configured status
 * @param wfstr
 * @param wfstat
 * @param wfcomment
 * @param wfnote
 * @returns {Boolean}
 */
function resultWorkflowTask(wfstr, wfstat, wfcomment, wfnote) // optional process name
{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 5) {
		processName = arguments[4]; // subprocess
		useProcess = true;
	}

	var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, null, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage());
		return false;
	}

	if (!wfstat)
		wfstat = "NA";

	for (i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
			var statObj = aa.workflow.getTaskStatus(fTask, wfstat);
			var dispo = "U";
			if (statObj.getSuccess()) {
				var status = statObj.getOutput();
				dispo = status.getResultAction();
			} else {
				logDebug("Could not get status action resulting to no change")
			}

			var dispositionDate = aa.date.getCurrentDate();
			var stepnumber = fTask.getStepNumber();
			var processID = fTask.getProcessID();

			if (useProcess)
				aa.workflow.handleDisposition(capId, stepnumber, processID, wfstat, dispositionDate, wfnote, wfcomment, systemUserObj, dispo);
			else
				aa.workflow.handleDisposition(capId, stepnumber, wfstat, dispositionDate, wfnote, wfcomment, systemUserObj, dispo);

			logMessage("Resulting Workflow Task: " + wfstr + " with status " + wfstat);
			logDebug("Resulting Workflow Task: " + wfstr + " with status " + wfstat);
		}
	}
}

function scheduleForestryRequestPlantingSiteReview(inspectionTypeForestrySiteReview) {
    var inspectorID = getAssignedStaff();
    
    if (typeof (inspectorID) != "undefined" && inspectorID != null && inspectorID != "")
        scheduleInspection(inspectionTypeForestrySiteReview, 0, inspectorID);
}

function scheduleInspectionCustom(iType,DaysAhead) // optional inspector ID.  This function requires dateAdd function
	{
	// DQ - Added Optional 4th parameter inspTime Valid format is HH12:MIAM or AM (SR5110) 
	// DQ - Added Optional 5th parameter inspComm ex. to call without specifying other options params scheduleInspection("Type",5,null,null,"Schedule Comment");
	var inspectorObj = null;
	var inspTime = null;
	var inspComm = "Scheduled via Script";
	if (arguments.length >= 3) 
		if (arguments[2] != null)
		{
		var inspRes = aa.person.getUser(arguments[2])
		if (inspRes.getSuccess())
			var inspectorObj = inspRes.getOutput();
		}

	if (arguments.length >= 4)
	    if (arguments[3] != null)
		    inspTime = arguments[3];
	
	if (arguments.length == 5)
	    if (arguments[4] != null)
	        inspComm = arguments[4];

	var schedRes = aa.inspection.scheduleInspection(capId, inspectorObj, aa.date.parseDate(dateAdd(null,DaysAhead)), inspTime, iType, inspComm)
	
	if (schedRes.getSuccess()){
		logDebug("Successfully scheduled inspection : " + iType + " for " + dateAdd(null,DaysAhead));
		return schedRes.getOutput();
	}
	else
		logDebug( "**ERROR: adding scheduling inspection (" + iType + "): " + schedRes.getErrorMessage());
	
	return null;
}
function scheduleInspectionCustom4CapId(itemCap, iType,DaysAhead) // optional inspector ID.  This function requires dateAdd function
    {
    // DQ - Added Optional 5th parameter inspTime Valid format is HH12:MIAM or AM (SR5110) 
    // DQ - Added Optional 6th parameter inspComm ex. to call without specifying other options params scheduleInspection("Type",5,null,null,"Schedule Comment");
    var inspectorObj = null;
    var inspTime = null;
    var inspComm = "Scheduled via Script";
    if (arguments.length >= 4) 
        if (arguments[3] != null)
        {
        var inspRes = aa.person.getUser(arguments[3])
        if (inspRes.getSuccess())
            var inspectorObj = inspRes.getOutput();
        }

    if (arguments.length >= 5)
        if (arguments[4] != null)
            inspTime = arguments[4];
    
    if (arguments.length == 6)
        if (arguments[5] != null)
            inspComm = arguments[5];

    var schedRes = aa.inspection.scheduleInspection(itemCap, inspectorObj, aa.date.parseDate(dateAdd(null,DaysAhead)), inspTime, iType, inspComm)
    
    if (schedRes.getSuccess()){
        logDebug("Successfully scheduled inspection : " + iType + " for " + dateAdd(null,DaysAhead));
        return schedRes.getOutput();
    }
    else
        logDebug( "**ERROR: adding scheduling inspection (" + iType + "): " + schedRes.getErrorMessage());
    
    return null;
}
function scheduleInspectionWithCapIdBusinessDays(iType,DaysAhead) // optional inspector ID.  This function requires dateAddHC2 function
{
    // DQ - Added Optional 4th parameter inspTime Valid format is HH12:MIAM or AM (SR5110) 
    // DQ - Added Optional 5th parameter inspComm ex. to call without specifying other options params scheduleInspection("Type",5,null,null,"Schedule Comment");
    var inspectorObj = null;
    var inspTime = null;
    var inspComm = "Scheduled via Script";
	var vCapId = capId;
    if (arguments.length >= 3) 
        if (arguments[2] != null){
            var inspRes = aa.person.getUser(arguments[2])
            if (inspRes.getSuccess())
                var inspectorObj = inspRes.getOutput();
        }
    
    if (arguments.length >= 4)
        if (arguments[3] != null)
                        inspTime = arguments[3];
    
    if (arguments.length == 5)
        if (arguments[4] != null)
            inspComm = arguments[4];
    
    if (arguments.length == 6)
        if (arguments[5] != null)
            vCapId = arguments[5];
                                    
    var schedRes = aa.inspection.scheduleInspection(vCapId, inspectorObj, aa.date.parseDate(dateAddHC2(null,DaysAhead)), inspTime, iType, inspComm)
    
    if (schedRes.getSuccess())
        logDebug("Successfully scheduled inspection : " + iType + " for " + dateAddHC(null,DaysAhead));
    else
        logDebug( "**ERROR: adding scheduling inspection (" + iType + "): " + schedRes.getErrorMessage());
}

//Script 124
//Record Types:	?PublicWorks/Pavement Design/NA/NA?
//Event: 		PRA - Payment Received After
//Desc:			if Record Status is Payment Pending and when payment received and balance = 0 
//					then
//						Activate Quality Check with Due date Today + 1 
//						and update record status to Submitted 
//				(check with client if the record status should change and perhaps add status of Paid?)
//Created By: Silver Lining Solutions

function script124_ActivateQualityCheckWhenPaidandBalIsZero() {
	logDebug("script124_ActivateQualityCheckWhenPaidandBalIsZero() started.");
	try{
		if ( capStatus == "Payment Pending") {
			if ( balanceDue == 0 ) {
				activateTask("Quality Check");
				editTaskDueDate("Quality Check", dateAdd(null,1));
				updateAppStatus("Submitted");
				logDebug("script124: Set Quality Check Activated due date tomorrow and capStatus is Submitted!");
			}
		}
	}
	catch(err){
		showMessage = true;
		comment("Error on custom function script124_ActivateQualityCheckWhenPaidandBalIsZero(). Please contact administrator. Err: " + err);
		logDebug("Error on custom function script124_ActivateQualityCheckWhenPaidandBalIsZero(). Please contact administrator. Err: " + err);
	}
	logDebug("script124_ActivateQualityCheckWhenPaidandBalIsZero() ended.");
};//END script124_ActivateQualityCheckWhenPaidandBalIsZero();

//Script 130
//Record Types:	Water/Water/Tap/Application
//Event: 		ApplicationSubmitAfter
//Desc:			IF
//					The custom field “Size of Water Meter” has a value greater than or equal to 3”
//					(Note – This is a dropdown field which includes increments of 1” up to 12” and 
//					then includes the field of other” which will classify this rule to run). 
//				THEN:
//					Then add the fee “WAT_TA_39” and the quantity from the 
//						custom field “Average Daily Demand(In GPD)” 
//					  but do NOT invoice the fee. 
//Created By: Silver Lining Solutions

function script130_AssessWaterMeterTapFeeWithAvgDailyDemand() {
	logDebug("script130_AssessWaterMeterTapFeeWithAvgDailyDemand() started.");
	try{
		var sizeOfWaterMeter = AInfo["Size of Water Meter"],
		waterMeterTapFeeItem = "WAT_TA_39",
		waterMeterTapFeeSchedule = "WAT_TA",
		waterMeterTapFeeQty = 0;

		sizeOfWaterMeter = Number(sizeOfWaterMeter.replace('"',''));

		logDebug("script130: sizeOfWaterMeter is: "+sizeOfWaterMeter);
		
		if (sizeOfWaterMeter >= 3)
		{
			waterMeterTapFeeQty = AInfo["Average Daily Demand(In GPD)"];

			if ( isNaN(waterMeterTapFeeQty) ) {
				logDebug("script130: Unable to assess fee because Average Daily Demand(In GPD) is not a number!");
			}
			else {
				logDebug("script130: Assessing Fee: "+waterMeterTapFeeSchedule+" :: "+waterMeterTapFeeItem+" with amount: "+parseFloat(waterMeterTapFeeQty));
				//Assess the fee
				newFeeSeq = addFee(waterMeterTapFeeItem, waterMeterTapFeeSchedule, 'FINAL', parseFloat(waterMeterTapFeeQty), 'N');
			}
		}
		else {
			logDebug("script130: size of Meter is less than 3 or Other - no fee auto assessment.");
		}
	}
	catch(err){
		showMessage = true;
		comment("Error on custom function script130_AssessWaterMeterTapFeeWithAvgDailyDemand(). Please contact administrator. Err: " + err);
		logDebug("Error on custom function script130_AssessWaterMeterTapFeeWithAvgDailyDemand(). Please contact administrator. Err: " + err);
	}
	logDebug("script130_AssessWaterMeterTapFeeWithAvgDailyDemand() ended.");
};//END script130_AssessWaterMeterTapFeeWithAvgDailyDemand();

//script133_AutoCreateTraffic
//Record Types:	ODA/Pre App/Na/NA
//Event: WTUA - WorkflowTaskUpdateAfter
//Desc: When the workflow status Complete on WF task Prepare Preliminary Letter on a ODA/Pre App/Na/NA record,
//		check Traffic Review WF task TSI field Is Traffic Impact Study Required if Yes,
//		Then then automatically create the Traffic Impact Study record as a child to the ODA record. 
//Created By: Silver Lining Solutions

function script133_AutoCreateTraffic() {
	
	logDebug("script133_AutoCreateTraffic started.");
	try{
		if (wfTask==("Prepare Preliminary Letter") && wfStatus ==("Complete")) {
			if (AInfo["Traffic Impact Study Required"] == "Yes") {
				trafficCap = createChild("PublicWorks","Traffic","Traffic Impact","NA","Traffic Impact Study");
				if (!trafficCap.getSuccess()) {
					comment("Unable to create child record on script133_AutoCreateTraffic. Please contact administrator.");
				}
			}
		}
	} catch(err){
		showMessage = true;
		comment("Error on custom function script133_AutoCreateTraffic. Please contact administrator. Err: " + err);
		logDebug("script133: Error on custom function script133_AutoCreateTraffic. Please contact administrator. Err: " + err);
		logDebug("script133: A JavaScript Error occurred: WTUA:ODA/Pre App/Na/NA 133: " + err.message);
		logDebug(err.stack)
	}
	logDebug("script133_AutoCreateTraffic ended.");
//	if function is used        };//END WTUA:ODA/Pre App/Na/NA;

}


//Script 143
//Record Types:	P?ublicWorks/Traffic/Traffic Engineering Request/NA
//Event: 		WorkflowTaskUpdateAfter (WTUA)
//Desc:			If the wfTask = “Work Order to Traffic OPS” and the wfStatus = “Completed” 
//				Then send email notification(Email Template TBD by Aurora) 
//				to Anna Bunce(abunce@auroragov.org) which will have details 
//				that the work order has been completed.    
//Created By: Silver Lining Solutions

function script143_SendRenewalEmailWhenWOtoTrafficOPSComplete() {
	logDebug("script143_SendRenewalEmailWhenWOtoTrafficOPSComplete() started.");
	try{
		var emlTo = "chad@esilverliningsolutions.com";
		
		if ( wfTask == "Work Order to Traffic OPS" && wfStatus == "Completed" ) 
		{
			var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
			var emailParameters = aa.util.newHashtable();
			var reportFile = [];
			var sendResult = sendNotification("noreply@aurora.gov",emlTo,"","TEST_FOR_SCRIPTS",emailParameters,reportFile,capID4Email);
			if (!sendResult) { logDebug("script143: UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
			else { logDebug("script143: Sent email notification that work order is complete to "+emlTo)}
		}
	}
	catch(err){
		showMessage = true;
		comment("Error on custom function script143_SendRenewalEmailWhenWOtoTrafficOPSComplete(). Please contact administrator. Err: " + err);
		logDebug("Error on custom function script143_SendRenewalEmailWhenWOtoTrafficOPSComplete(). Please contact administrator. Err: " + err);
	}
	logDebug("script143_SendRenewalEmailWhenWOtoTrafficOPSComplete() ended.");
};//END script143_SendRenewalEmailWhenWOtoTrafficOPSComplete();

//Script 152
//Record Types:	Forestry/Request/Planting/NA
//Event: 		WTUA
//Desc:			When wfTask = “Property Owner Responce” has a wfStatus = “Plant Tree”
//				Then schedule a “Forestry Site Review” Inspection 
//				for current day + 5 business days. 
//
//
//Created By: Silver Lining Solutions

function script152_ForestryPropertyOwnerResponcePlanting() {
	logDebug("script152_ForestryPropertyOwnerResponcePlanting() started.");
	try{
		logDebug("script152_ForestryPropertyOwnerResponcePlanting: wf task is: "+wfTask);
		logDebug("script152_ForestryPropertyOwnerResponcePlanting: wf status is: "+wfStatus);
	
		if  ( wfTask == 'Property Owner Responce' && wfStatus == 'Plant Tree' )
		{
				// get date that is +5 BUSINESS days ahead   need to test on a wed/thurs/fri to see how date add works
/*			var businessDays = 7, counter = 0; // set to 1 to count from next business day
			while( businessDays>0 ){
				var tmp = new Date();
				tmp.setDate( tmp.getDate() + counter++ );
				switch( tmp.getDay() ){
						case 0: case 6: break;// sunday & saturday
						default:
							businessDays--;
						}; 
			}
*/
			scheduleInspection("Planting",5,null,null,null);
		}
	}
	catch(err){
		showMessage = true;
		comment("script152_ForestryPropertyOwnerResponcePlanting: Error on custom function script152_ForestryPropertyOwnerResponcePlanting(). Please contact administrator. Err: " + err);
		logDebug("script152_ForestryPropertyOwnerResponcePlanting: Error on custom function script152_ForestryPropertyOwnerResponcePlanting(). Please contact administrator. Err: " + err);
	}
	logDebug("script152_ForestryPropertyOwnerResponcePlanting() ended.");
};//END script152_ForestryPropertyOwnerResponcePlanting();
		
//Script 16
//Record Types:	Building/*/*/* and Fire/*/*/*
//Event: 		CTRCA(ACA) or ASA(Civic Platform)
//Desc:			If the Application Name field is empty
//				Action:	Take any address fields that have data in them and concatenate those 
//						fields and update the application name field with the result.
//Created By: Silver Lining Solutions

function script16_FillApplicationNameWhenEmpty() {
	aa.print("script16_FillApplicationNameWhenEmpty() started.");
	try{
		var thisCap = aa.cap.getCap(capId).getOutput();
		var thisCapSpclText = thisCap.getSpecialText();
		if ( thisCapSpclText == null ) {
			//Get address(es) on current CAP
			var myAddr = aa.address.getAddressByCapId(capId);
			if (!myAddr.getSuccess()) {
				logDebug("**ERROR: getting CAP addresses: " + myAddr.getErrorMessage());
				return false;
			}
			var addrArray = new Array();
			var addrArray = myAddr.getOutput();
			if (addrArray.length == 0 || addrArray == undefined) {
				logDebug("The current CAP has no address.  Unable to get CAPs with the same address.")
				return false;
			}
			//use 1st address
			var thisHouseNumberStart		= addrArray[0].getHouseNumberStart()== null ? "" : addrArray[0].getHouseNumberStart() + " ";
			var thisStreetDirection			= addrArray[0].getStreetDirection()== null ? "" : addrArray[0].getStreetDirection() + " ";
			var thisStreetName				= addrArray[0].getStreetName()== null ? "" : addrArray[0].getStreetName() + " ";
			var thisStreetSuffix			= addrArray[0].getStreetSuffix()== null ? "" : addrArray[0].getStreetSuffix() + " ";
			var thisStreetSuffixdirection	= addrArray[0].getStreetSuffixdirection()== null ? "" : addrArray[0].getStreetSuffixdirection() + " ";
			var thisUnitType				= addrArray[0].getUnitType()== null ? "" : addrArray[0].getUnitType() + " ";
			var thisUnitStart				= addrArray[0].getUnitStart()== null ? "" : addrArray[0].getUnitStart() + " ";
			var thisCity					= addrArray[0].getCity()== null ? "" : addrArray[0].getCity() + " ";
			var thisState					= addrArray[0].getState()== null ? "" : addrArray[0].getState() + " ";
			var thisZip						= addrArray[0].getZip()== null ? "" : addrArray[0].getZip();

			var newAppNameText = thisHouseNumberStart + thisStreetDirection + thisStreetName + thisStreetSuffix + thisStreetSuffixdirection + thisUnitType + thisUnitStart + thisCity + thisState + thisZip;
			thisCapModel = thisCap.getCapModel();
			thisCap.setSpecialText(newAppNameText);
			aa.cap.editCapByPK(thisCapModel);
		}
	}
	catch(err){
		showMessage = true;
		comment("Error on custom function script16_FillApplicationNameWhenEmpty(). Please contact administrator. Err: " + err);
		logDebug("Error on custom function script16_FillApplicationNameWhenEmpty(). Please contact administrator. Err: " + err);
	}
	logDebug("script16_FillApplicationNameWhenEmpty() ended.");
};//END script16_FillApplicationNameWhenEmpty();

//Script 175
//Record Types:	PublicWorks\Traffic\Traffic Engineering Request\NA 
//Event: 		ASA
//Desc:			Criteria/Action on submittal do:
// 					1) if submitted via ACA assign WF Task Application Submittal to Anna Bunce
//                  2) if NOT submitted via ACA assign WF Task Application Submittal to 
//                     the creator of the record
//
//Created By: Silver Lining Solutions

function script175_AssignApplicationSubmittalTask(){
	logDebug("script175_AssignApplicationSubmittalTask() started.");
	try
	{
		if (publicUser)
			{
			assignTask("Application Submittal","ABUNCE");
			logDebug("script175_AssignApplicationSubmittalTask: assigning Application Submittal to ABUNCE");
			}
		else 
			{
			assignTask("Application Submittal",currentUserID);	
			logDebug("script175_AssignApplicationSubmittalTask: assigning Application Submittal to current User:" + currentUserID);
			}
	}
	catch(err){
		logDebug("Error on custom function script175_AssignApplicationSubmittalTask(). Please contact administrator. Err: " + err);
	}
	logDebug("script175_AssignApplicationSubmittalTask() ended.");
}; //END script175_AssignApplicationSubmittalTask()

//Script 185
//Record Types:	Building/*/*/* 
//Event: 		CTRCA(ACA) or ASA(Civic Platform)
//Desc:			When the application is submitted
//				Update the expiration date to 180 calendar days from the submission date.
//Created By: Silver Lining Solutions

function script185_UpdateAppExpDate180Days() {
	logDebug("script185_UpdateAppExpDate180Days() started.");
	try{
		editAppSpecific("Application Expiration Date",dateAdd(fileDate,180));
	}
	catch(err){
		showMessage = true;
		comment("Error on custom function script185_UpdateAppExpDate180Days(). Please contact administrator. Err: " + err);
		logDebug("Error on custom function script185_UpdateAppExpDate180Days(). Please contact administrator. Err: " + err);
	}
	logDebug("script185_UpdateAppExpDate180Days() ended.");
};//END script185_UpdateAppExpDate180Days();

//Script 197
//Record Types:	Building/NA/NA/NA 
//Event: 		ISA
//Desc:	 
//
//              Criteria If the inspectionType = “Sprinkler System” is scheduled
//              Action update the record status to “Awaiting Inspection”
//
//Created By: Silver Lining Solutions
//
// UPDATED JMPorter 10/9/2018 - Per update from chuck, Sprinkler System has been renamed to Sprinkler System Rough.  

function script197_SetAwaitingInspectionStatus() {
	logDebug("script197_SetAwaitingInspectionStatus() started.");
	try {
		if(inspType == "Sprinkler System Rough" ){
			updateAppStatus("Awaiting Inspection");
		}
	}
	catch (err) {
		comment("Error on custom function script197_SetAwaitingInspectionStatus(). Please contact administrator. Err: " + err);
	}

};//END script197_SetAwaitingInspectionStatus();

//Script  204
//Record Types:	Building/NA/NA/NA
//Event: 		ApplicationSubmitAfter(Civic Platform) or ConvertToRealCapAfter(ACA)
//Desc:			If criteria:
//				If Custom Field Single Family Detached Homes = No
//				Action: then Activate the Water Meter WF task.
//Created By: Silver Lining Solutions

function script204_ASAActivateActivateWaterMeterTask() {
	logDebug("script204_ASAActivateActivateWaterMeterTask started.");
	try{
		if(!publicUser){
			var asiSingleFamilyDetachedHome = AInfo["Single Family Detached Home"];
		}
		else {
			loadAppSpecific4ACA(AInfo);
			var asiSingleFamilyDetachedHome = AInfo["Single Family Detached Home"];
		}
		logDebug("script204: Single Family Detached Home:"+asiSingleFamilyDetachedHome);
		if (asiSingleFamilyDetachedHome == "No" )
		{
				activateTask("Water Meter");
		}
	}
	catch(err){
		showMessage = true;
		comment("script204: Error on custom function script204_ASAActivateActivateWaterMeterTask(). Please contact administrator. Err: " + err);
		logDebug("script204: Error on custom function script204_ASAActivateActivateWaterMeterTask(). Please contact administrator. Err: " + err);
	}
	logDebug("script204_ASAActivateActivateWaterMeterTask() ended.");
};//END script204_ASAActivateActivateWaterMeterTask();
?//script205_DeactivateSpecInsp
//Record Types:	Building/*/*/*
//Event: WTUA - WorkflowTaskUpdateAfter
//Desc: If wfTask = “Permit Issuance” and wfStatus = “Issued” and the custom field “Special Inspection” is equal to “No”, 
//			then deactivate the workflow task “Special Inspection Checklist”
//Created By: Silver Lining Solutions
function script205_DeactivateSpecInsp() {
	
	logDebug("script205_DeactivateSpecInsp started.");
	try{
		if ( wfTask== "Permit Issuance" && wfStatus == "Issued" && AInfo["Special Inspection"] == "No" ) {
			deactivateTask("Special Inspections Check");
		}
	} catch(err){
		showMessage = true;
		comment("Error on custom function script205_DeactivateSpecInsp. Please contact administrator. Err: " + err);
		logDebug("Error on custom function script205_DeactivateSpecInsp. Please contact administrator. Err: " + err);
		logDebug("A JavaScript Error occurred: WTUA:Building/*/*/* 205: " + err.message);
		logDebug(err.stack)
	}
	logDebug("script205_DeactivateSpecInsp ended.");
//	if function is used        };//END WTUA:Building/*/*/*;

///TEST JMPorter to see if update through GITHUB

}
//script206_DeactivateFEMA
//Record Types:	Building/Permit/New Building/NA
//Event: WTUA - WorkflowTaskUpdateAfter
//Desc: If wfTask = “Engineering Review” and wfStatus is NOT = “Approved with FEMA Cert Required”, then deactivate the workflow task “FEMA Elevation Certification”
//Created By: Silver Lining Solutions

function script206_DeactivateFEMA() {
	logDebug("script206_DeactivateFEMA started.");
	try{
		var $iTrc = ifTracer;
		if ($iTrc(!isTaskStatus("Engineering Review", "Approved with FEMA Cert Required"), 'Issued and NOT Engineering Review/Approved with FEMA Cert Required'))
			deactivateTask("FEMA Elevation Certification");
	}
	catch(err){
		showMessage = true;
		comment("Error on custom function script206_DeactivateFEMA. Please contact administrator. Err: " + err);
		logDebug("A JavaScript Error occurred: ASA:Building/*/*/* 204: " + err.message);
		logDebug(err.stack)
	}
	logDebug("script206_DeactivateFEMA ended.");
//	if function is used        };//END WTUA:Building/Permit/New Building/NA;

}
//Script 207
//Record Types:	Building/Permit/New Building/NA 
//Event: 		WTUA
//Desc:	 
//
//              Criteria wfTask = = Certificate of Occupancy status = Final CO Issued or Not Required 
//             			and If custom field “Single Family Detached home” = “No” 
//
//              Action then auto generate the record “Fire/Primary Inspection/NA/NA” 
//              		
//              2nd Criteria workflow status is "Final CO Issued” on the building record
//              2nd Action populate the custom field “Building Square Footage” from 
//						the Building/Permit/New Building/NA record  
//
//Created By: Silver Lining Solutions

function script207_SetTotalSqFtOnFireRecord() {
	logDebug("script207_SetTotalSqFtOnFireRecord() started.");
	try {
		var SFDHome = getAppSpecific("Single Family Detached Home");
		logDebug("SFDHome =" + SFDHome);
		if( SFDHome == "No" && wfTask == "Certificate of Occupancy" && (wfStatus == "Final CO Issued" || wfStatus == "Not Required"))
			{
			logDebug("script207_SetTotalSqFtOnFireRecord() passed test.");
			var cCapId = createChild("Fire", "Primary Inspection", "NA", "NA", ""); 
			if (cCapId != null) {
				if (wfStatus == "Final CO Issued") 
					{
					//JMAIN updated this because it wasn't building in the EMSE tool.
					//editAppSpecific("Building Square Footage", {Total Finished Area Sq Ft}, cCapId);
					var totalfinishedarea = getAppSpecific("Total Finished Area Sq Ft");
					editAppSpecific("Building Square Footage", totalfinishedarea, cCapId);

					logDebug("script207_SetTotalSqFtOnFireRecord() updated ASI.");
					}
			}
		}
	}
	catch (err) {
		comment("Error on custom function script207_SetTotalSqFtOnFireRecord(). Please contact administrator. Err: " + err);
	}

};//END script207_SetTotalSqFtOnFireRecord

//script208_UpdatePermitFields
//Record Types:	Building/Permit/*/* (EXCEPT Building/Permit/Master/NA)
//Event: WTUA - WorkflowTaskUpdateAfter
//Desc: If wfTask = Permit Issuance and wfStatus = “Issued”, then insert the current date into the permit issue date custom field 
//		and current date + 180 days into the permit expiration date field.  
//Created By: Silver Lining Solutions

function script208_UpdatePermitFields() {
	
	logDebug("script208_UpdatePermitFields  started.");
	try{
		if (!appMatch("Building/Permit/Master/NA")) {
				editAppSpecific("Permit Issued Date",dateAdd(null,0));		
				editAppSpecific("Permit Expiration Date",dateAdd(null,180));
		}
	} catch(err){
		showMessage = true;
		comment("Error on custom function script208_UpdatePermitFields . Please contact administrator. Err: " + err);
		logDebug("Error on custom function script208_UpdatePermitFields . Please contact administrator. Err: " + err);
		logDebug("A JavaScript Error occurred: WTUA:Building/Permit/*/* 208: " + err.message);
		logDebug(err.stack)
	}
	logDebug("script208_UpdatePermitFields  ended.");
//	if function is used        };//END WTUA:Building/Permit/*/* ;

}
//Script 220
//Record Types: ODA/Pre Application/NA/NA
//Event:        ASA
//Desc:         When the record is submitted/created then generate 
//              Application Received email and send it to the contacts 
//              on the record. Aurora will provide the email template  
//
//Created By: Silver Lining Solutions

function script220_ApplicationReceivedEmailForPreApp() {
    logDebug("script220_ApplicationReceivedEmailForPreApp() started.");
    try{        
        /*var iNameResult = aa.person.getUser(currentUserID);
        var iName = iNameResult.getOutput();
        var email=iName.getEmail();
        var emlTo=email;*/
        //var emlTo = "eric@esilverliningsolutions.com";
        /*logDebug("script220 currentUserID: " + currentUserID);
        logDebug("script220         email: " + email);
        logDebug("script220         emlTo: " + emlTo);*/
        var emailTemplate = "ODA PRE APP SUBMITAL EMAIL # 220";
        var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
        acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
        var recordURL = getACARecordURL(acaURLDefault);
        var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
        var reportFile = [];
        var emailParams = aa.util.newHashtable();

        addParameter(emailParams, "$$altID$$", capIDString);
        addParameter(emailParams, "$$ApplicationName$$", capName);
        addParameter(emailParams, "$$acaRecordUrl$$", recordURL);
		
        
        var resParEmail = getContactEmailAddress("Responsible Party", capId);
        var ccEmails = "";
        
        if(resParEmail){
            var conts = getContactObjs(capId);
            for(each in conts){
                var aCont = conts[each].people;
                
                if(aCont.contactType == "Consultant" && aCont.email) 
                    ccEmails += aCont.email + ",";
            }
            
            var sendResult = sendNotification("noreply@auroragov.org",resParEmail,ccEmails,emailTemplate,emailParams,reportFile,capID4Email);
            if (!sendResult) { logDebug("script220: UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
            else { logDebug("script220: Sent email notification that ODA PRE APP is Submitted to "+resParEmail)}
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function script220_ApplicationReceivedEmailForPreApp(). Please contact administrator. Err: " + err);
        logDebug("Error on custom function script220_ApplicationReceivedEmailForPreApp(). Please contact administrator. Err: " + err);
    }
    logDebug("script220_ApplicationReceivedEmailForPreApp() ended.");
};//END script220_ApplicationReceivedEmailForPreApp
//Script 224
//Record Types:	ODA/Pre App/NA/NA
//Event: 		WTUA
//Desc:			Event WorkflowUpdateAfter 
//
//              Criteria: wfTask = Planning Review and status = Ready for Supervisor 
//
//              Action: activate Planning Supervisor Review task (note this lets the 
//                      Supervisor know they need to look at the record again)
//
//Created By: Silver Lining Solutions

function script224_ActivatePlanningSupervisorReview(){
	logDebug("script224_ActivatePlanningSupervisorReview() started.");
	try
	{
		if ( wfTask == "Planning Review" && wfStatus == "Ready for Supervisor Review")
		{
			activateTask("Planning Supervisor Review");
		}
	}
	catch(err)
	{
		logDebug("Error on custom function script224_ActivatePlanningSupervisorReview(). Please contact administrator. Err: " + err);
	}
	logDebug("script224_ActivatePlanningSupervisorReview() ended.");
};//END script224_ActivatePlanningSupervisorReview

function failedMJInspectionAutomation(vCapType) {

	var daysToAdd;
	var inspDate = inspObj.getInspectionDate().getMonth() + "/" + inspObj.getInspectionDate().getDayOfMonth() + "/" + inspObj.getInspectionDate().getYear();
	var inspResultComment = inspObj.getInspection().getResultComment();
	
	// list MJ inspection types
	var inspectionTypesAry = [ "MJ AMED Inspections", "MJ Building Inspections - Electrical", "MJ Building Inspections - Life Safety",
		"MJ Building Inspections - Mechanical", "MJ Building Inspections - Plumbing", "MJ Building Inspections - Structural", "MJ Security Inspections - 3rd Party",
		"MJ Zoning Inspections", "MJ Building Inspections", "MJ Code Enforcement Inspections", "MJ Planning Inspections", "MJ Security Inspections - Police" ];
	
	//define number of days to schedule next inspection
	if (vCapType == "Application"){
		daysToAdd = 1;
	} else {
		daysToAdd = 7;
	}
	var emailTemplateName = "LIC MJ INSPECTION CORRECTION REPORT # 231";		
			
	//check for failed inspections, schedule new inspection, and email applicant with report
	for (s in inspectionTypesAry) {
		if (inspType == inspectionTypesAry[s] && inspResult == "Failed") {
			var adResult = aa.address.getAddressByCapId(capId).getOutput(); 
            for(x in adResult)
            {
                var adType = adResult[x].getAddressType(); 
                var stNum = adResult[x].getHouseNumberStart();
                var preDir =adResult[x].getStreetDirection();
                var stName = adResult[x].getStreetName(); 
                var stType = adResult[x].getStreetSuffix();
                var city = adResult[x].getCity();
                var state = adResult[x].getState();
                var zip = adResult[x].getZip();
            }
            var primaryAddress = stNum + " " + preDir + " " + stName + " " + stType + " " + "," + city + " " + state + " " + zip;

            var asiValues = new Array();
            loadAppSpecific(asiValues); 

			var vInspector = getInspectorByInspID(inspId, capId);
			var vInspType = inspType;
			var vInspStatus = "Scheduled";
			
			var lastIndex = inspType.lastIndexOf(" Inspections");
            var inspTypeSub = inspType.substring(0, lastIndex);

			//schedule new inspection daysToAdd number of days from inspection result date
			logDebug("Days to add: " + daysToAdd);
			var newInspSchedDate = dateAddHC3(inspDate, daysToAdd, "Y");
			scheduleInspectDate(vInspType, newInspSchedDate);
			
			//get sequence ID for most recently created inspection
			var lastInspectionObj = getLastCreatedInspection(capId, vInspType, vInspStatus);
			if (lastInspectionObj == null) {
				logDebug("Failed to find most recent inspection of type " + vInspType);
				continue;
			}
			
			var lastInspectionSeq = lastInspectionObj.getIdNumber();
			
			//assign inspection to inspector
			assignInspection(lastInspectionSeq, vInspector);
			
			//copy checklist items from failed inspection to the new inspection
			copyGuideSheetItemsByStatus(inspId, lastInspectionSeq);

			var eParams = aa.util.newHashtable();
			addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
			addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
			addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());

			var reportTemplate = "MJ_Compliance_Corrections_Letter";
			var reportParams = aa.util.newHashtable();
			addParameter(reportParams, "InspActNumber", inspId);
			
			if (inspId) {
				addParameter(eParams, "$$inspId$$", inspId);
			}
			if (inspResult)
				addParameter(eParams, "$$inspResult$$", inspResult);
			if (inspResultDate)
				addParameter(eParams, "$$inspResultDate$$", inspResultDate);
			if (inspGroup)
				addParameter(eParams, "$$inspGroup$$", inspGroup);
			if (inspType)
				addParameter(eParams, "$$inspType$$", inspType);
			if (inspSchedDate)
				addParameter(eParams, "$$inspSchedDate$$", inspSchedDate);
			if (inspResultComment)
				addParameter(eParams, "$$inspResultComment$$", inspResultComment);
			if (inspTypeSub)
                addParameter(eParams, "$$inspTypeSub$$", inspTypeSub.toUpperCase());
            if (primaryAddress)
                addParameter(eParams, "$$FullAddress$$", primaryAddress);
            if (asiValues["State License Number"])
                addParameter(eParams, "$$StateLicenseNumber$$", asiValues["State License Number"]);
            if (asiValues["Trade Name"])
                addParameter(eParams, "$$TradeName$$", asiValues["Trade Name"]);
			
			//send email with report attachment
			emailContactsWithReportLinkASync("Inspection Contact", emailTemplateName, eParams, reportTemplate, reportParams, "N", "");

			return true;
		}
	}
	return false;
}


function passedMJInspectionAutomation(vCapType) {
	var emailTemplate = "LIC MJ COMPLIANCE #232";
	var inspResultComment = inspObj.getInspection().getResultComment();
	//check for passed application inspections and email inspection contact with report
	if (vCapType == "Application") {
		if (inspResult == "Passed" || inspResult == "Passed - Minor Violations") {
			var adResult = aa.address.getAddressByCapId(capId).getOutput(); 
            for(x in adResult)
            {
                var adType = adResult[x].getAddressType(); 
                var stNum = adResult[x].getHouseNumberStart();
                var preDir =adResult[x].getStreetDirection();
                var stName = adResult[x].getStreetName(); 
                var stType = adResult[x].getStreetSuffix();
                var city = adResult[x].getCity();
                var state = adResult[x].getState();
                var zip = adResult[x].getZip();
            }
            var primaryAddress = stNum + " " + preDir + " " + stName + " " + stType + " " + "," + city + " " + state + " " + zip;

            var asiValues = new Array();
            loadAppSpecific(asiValues); 

            var lastIndex = inspType.lastIndexOf(" Inspections");
            var inspTypeSub = inspType.substring(0, lastIndex);

			var eParams = aa.util.newHashtable();
			addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
			addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
			addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
			
			if (inspId) {
				addParameter(eParams, "$$inspId$$", inspId);
			}
			if (inspResult)
				addParameter(eParams, "$$inspResult$$", inspResult);
			if (inspResultDate)
				addParameter(eParams, "$$inspResultDate$$", inspResultDate);
			if (inspGroup)
				addParameter(eParams, "$$inspGroup$$", inspGroup);
			if (inspType)
				addParameter(eParams, "$$inspType$$", inspType);
			if (inspSchedDate)
				addParameter(eParams, "$$inspSchedDate$$", inspSchedDate);
			if (inspTypeSub)
                addParameter(eParams, "$$inspTypeSub$$", inspTypeSub.toUpperCase());
            if (inspResultComment)
                addParameter(eParams, "$$inspResultComment$$", inspResultComment);
            if (primaryAddress)
                addParameter(eParams, "$$FullAddress$$", primaryAddress);
            if (asiValues["State License Number"])
                addParameter(eParams, "$$StateLicenseNumber$$", asiValues["State License Number"]);
            if (asiValues["Trade Name"])
                addParameter(eParams, "$$TradeName$$", asiValues["Trade Name"]);
            
			var reportTemplate = "MJ_Compliance_Corrections_Letter";
			var reportParams = aa.util.newHashtable();
			addParameter(reportParams, "InspActNumber", inspId);
			
			//send email with report attachment		
			emailContactsWithReportLinkASync("Inspection Contact", emailTemplate, eParams, reportTemplate, reportParams, "N", "");
		}
	} 
}


function requestExtensionMJInspection(vCapType) {

	var daysToAdd;
	var inspDate = inspObj.getInspectionDate().getMonth() + "/" + inspObj.getInspectionDate().getDayOfMonth() + "/" + inspObj.getInspectionDate().getYear();
   
	// list MJ inspection types
	var inspectionTypesAry = [ "MJ AMED Inspections", "MJ Building Inspections - Electrical", "MJ Building Inspections - Life Safety",
		"MJ Building Inspections - Mechanical", "MJ Building Inspections - Plumbing", "MJ Building Inspections - Structural", "MJ Security Inspections - 3rd Party",
		"MJ Zoning Inspections", "MJ Building Inspections", "MJ Code Enforcement Inspections", "MJ Planning Inspections", "MJ Security Inspections - Police" ];

    //define number of days to schedule next inspection
	if (vCapType == "Application"){
		daysToAdd = 1;
	} else {
		daysToAdd = 7;
	}

    //check for extension request and schedule new inspection
    for (s in inspectionTypesAry) {
        if (inspType == inspectionTypesAry[s] && inspResult == "Request for Extension") {
			var vInspector = getInspectorByInspID(inspId, capId);
			var vInspType = inspType;
			var vInspStatus = "Scheduled";
		
			var newInspSchedDate = dateAddHC3(inspDate, daysToAdd, "Y");
			
			var inspResultComment;
			var vInspComments;
			
			if (inspResultComment != "" || inspResultComment != null) {
				vInspComments = inspResultComment;				
			} else {
				vInspComments = inspComment;
			}
			
			//Schedule the inspection with the result comments from the current inspection.
			scheduleInspectDate(inspType, newInspSchedDate, null, null, vInspComments);
			var newInspId = getScheduledInspId(inspType);
			if (newInspId) {
				copyGuideSheetItemsByStatus(inspId, newInspId);
			}
			
			//get sequence ID for most recently created inspection
			var lastInspectionObj = getLastCreatedInspection(capId, vInspType, vInspStatus);
			if (lastInspectionObj == null) {
				logDebug("Failed to find most recent inspection of type " + vInspType);
				continue;
			}
			
			var lastInspectionSeq = lastInspectionObj.getIdNumber();
			
			//assign inspection to inspector
			assignInspection(lastInspectionSeq, vInspector);
		}
    }
}
//Script 256
//Record Types:	Planning/*/*/*
//Event: 		WTUB
//Desc:			Event WorkflowUpdateBefore 
//
//              Event WorkflowTaskUpdateBefore
//
//              Criteria wfTask = Application Acceptance status = Accepted 
//                                and If Assigned Staff on Record Detail is null 
//
//              Action Raise Message “Case Manager not Assigned. Please enter on the Record tab”
//
//Created By: Silver Lining Solutions

function script256_MessageIfNoCaseManagerAssign (){
	logDebug("script256_MessageIfNoCaseManagerAssign() started.");
	try
	{
		if ( wfTask == "Application Acceptance" && wfStatus == "Accepted")
		{
			// determine if the record has an assigned Case Manager. if not throw error
			if (getAssignedStaff() == null)
				throw "Case Manager not Assigned. Please enter on the Record tab";			
		}
	}
	catch(err)
	{
		cancel = true;
		showMessage = true;
		comment(err);
	}
	logDebug("script256_MessageIfNoCaseManagerAssign() ended.");
};//END script256_MessageIfNoCaseManagerAssign

//Script 265
//Record Types:	PublicWorks\Traffic\Traffic Engineering Request\NA 
//Event: 		WTUA
//Desc:			Event WorkflowUpdateAfter 
//
//              when WF task 'Supervisor Review' is updated with status 'Approved',
//              then check to see if the status of task 'Draft Workorder' is status
//              'Workorder Drafted' then set assign the task 'Manager Review' to the current user
//
//Created By: Silver Lining Solutions

function script265_ManagerReviewToSupervisor (){
	logDebug("script265_ManagerReviewToSupervisor() started.");
	try{
		var $iTrc = ifTracer;
		var supRevAssigned = isTaskAssigned("Supervisor Review");
		var initSupRevAssi = isTaskAssigned("Initial Supervisor Review");
		var assignedTo = getTaskSpecific("Initial Review", "Assigned to Supervisor");
		
		if($iTrc(!supRevAssigned && !initSupRevAssi, 'Supervisor Review and Initial Supervisor Review are not assigned'))
			assignTaskToTSIUser("Supervisor Review", assignedTo);
		
		if($iTrc(!supRevAssigned && initSupRevAssi, '!supRevAssigned && initSupRevAssi')){
			var initSupRevUser = getTaskAssignedStaff("Initial Supervisor Review");
			assignTask("Supervisor Review", initSupRevUser.getUserID());
		}
		
		/*if($iTrc(!supRevAssigned, '!supRevAssigned')){
			var initSupRevUser = getTaskAssignedStaff("Supervisor Review");
			assignTask("Supervisor Review", initSupRevUser.getUserID());
		}*/
	}
	catch(err){
		logDebug("Error on custom function script265_ManagerReviewToSupervisor(). Please contact administrator. Err: " + err);
	}
	logDebug("script265_ManagerReviewToSupervisor() ended.");
};//END script265_ManagerReviewToSupervisor

//Script 266
//Record Types:	PublicWorks/Traffic/Traffic Engineering Request/NA
//Event: 		WTUB
//Desc:			Event WorkflowTaskUpdateBefore
//
//              Criteria wfTask = Draft Workorder status = Workorder Drafted
//                                and If Custom Fields Location, Desription, and Priority is null 
//
//              Action Raise Message “Content incomplete please populate workflow information to use this status.”
//
//Created By: Silver Lining Solutions_Darren

function script266_WorkorderFieldsMustHaveAValue(){
	logDebug("script266_WorkorderFieldsMustHaveAValue() started.");
	try
	{
		if ( wfTask == "Draft Workorder" && wfStatus == "Workorder Drafted")
		{
			// determine if the record has values in custome fields for Location, Description, and Priority. if not throw error
/*			if ({Description}== null || {Location}== null || {Work Order Priority}== null)
				throw "Content incomplete please populate workflow information to use this status.";			
*/		}
	}
	catch(err)
	{
		cancel = true;
		showMessage = true;
		comment(err);
	}
	logDebug("script266_WorkorderFieldsMustHaveAValue() ended.");
};//END script266_WorkorderFieldsMustHaveAValue

//Script        script268_MakeFieldsNullIfNoWorkOrderrder
//Record Types: PublicWorks\Traffic\Traffic Engineering Request\NA??
//Event:        WTUA - WorkflowTaskUpdateAfter 
//Desc:         Make Fields Null if no work order
//                  if 
//                      wfTask = Traffic Investigation status = No Change Warranted, Refer to Forestry, Refer to Code Enforcement 
//                  then
//                      Make Custom Fields Location, Description and Work Order Priority null. 
//Created By: Silver Lining Solutions

function script268_MakeFieldsNullIfNoWorkOrderrder() {
    logDebug("script268_MakeFieldsNullIfNoWorkOrderrder() started.");
    try{
        editAppSpecific("Location",null);
        editAppSpecific("Description",null);
        editAppSpecific("Work Order Priority",null);
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function script268_MakeFieldsNullIfNoWorkOrderrder(). Please contact administrator. Err: " + err);
        logDebug("script268: Error on custom function script268_MakeFieldsNullIfNoWorkOrderrder(). Please contact administrator. Err: " + err);
    }
    logDebug("script268_MakeFieldsNullIfNoWorkOrderrder() ended.");
};//END script268_MakeFieldsNullIfNoWorkOrderrder();
//Script 270
//Record Types:	?PublicWorks\Traffic\Traffic Engineering Request\NA??
//Event: 		WTUA
//Desc:			IF wfTask = "Generate Work Order" and wfStatus = "Generated"
//				THEN Copy Record ID into Custom Field "Work Order Number"
//					(will now use record ID if ops does not like this they can change the mask.)
//Created By: Silver Lining Solutions

function script270_GenerateWorkOrderNumber() {
	logDebug("script270_GenerateWorkOrderNumber started.");
	try{
		altId = capId.getCustomID();
		if ( wfTask == "Generate Work Order" && wfStatus == "Generated" ) {
			logDebug("script270: Copying Record ID ->"+altId+"<- to Work Order Number!");
			editAppSpecific("Work Order Number",altId);
		}
	}
	catch(err){
		showMessage = true;
		comment("script270: Error on custom function script270_GenerateWorkOrderNumber(). Please contact administrator. Err: " + err);
		logDebug("script270: Error on custom function script270_GenerateWorkOrderNumber(). Please contact administrator. Err: " + err);
	}
	logDebug("script270_GenerateWorkOrderNumber() ended.");
};//END script270_GenerateWorkOrderNumber();

//Script 271	Assignments due when site plan is due
//Record Types:	?PublicWorks\Traffic\Traffic Impact\NA??
//Event: 		WTUA
//Desc:			IF wfTask = "Application Submittal" and wfStatus = "Accepted" 
//				THEN set due date of wfTasks 
//					"Completeness Review", 
//					"Traffic Study Manager Review", 
//					"Traffic Study Supervisor Review" and 
//					"Traffic Study Staff Review" parallel tasks 
//				need to have the same due date as the parent site plan.
//
//Created By: Silver Lining Solutions

function script271_AssignmentsDueWhenSitePlanIsDue() {
	aa.print("script271_AssignmentsDueWhenSitePlanIsDue started.");
	try{
		var thisParentCap = getParent();
		if (thisParentCap) {
			aa.print("script271: parent found! Parent custom ID is:"+thisParentCap.getCustomID());
			var thisParentCapModel = aa.cap.getCap(thisParentCap).getOutput();;
			if (thisParentCapModel == null) {
				aa.print("script271: **WARNING get parent capModel is null.  Nothing to update");
			} else {
				var workflowResult = aa.workflow.getTasks(thisParentCap);
				var vThisWorkflow = aa.workflow.getTasks(capId);
				if (workflowResult.getSuccess()) {
					var wfObj = workflowResult.getOutput();
				} else { 
					aa.print("script271:  **ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage()); 
					return; 
				}
				
				if (vThisWorkflow.getSuccess()) {
					var vThisWorkflowObj = vThisWorkflow.getOutput();
				} else {
					aa.print("script271:  **ERROR: Failed to get this workflow object: " + s_capResult.getErrorMessage()); 
					return; 
				}
				
				for (i in wfObj) {
					var fTask = wfObj[i];
					if (fTask.getTaskDescription().toUpperCase() == "TRAFFIC REVIEW" ) {
						var thisAADueDate = fTask.getDueDate();
						var thisDueDateMonth = "00"+thisAADueDate.month;
						thisDueDateMonth = thisDueDateMonth.substr(thisDueDateMonth.length-2);
						var thisDueDateDay = "00"+thisAADueDate.dayOfMonth;
						thisDueDateDay = thisDueDateDay.substr(thisDueDateDay.length-2);
						var thisDueDateYear = "00"+thisAADueDate.year;
						thisDueDateYear = thisDueDateYear.substr(thisDueDateYear.length-4);
						var thisDueDate =	thisDueDateMonth+"/"+
											thisDueDateDay+"/"+
											thisDueDateYear;
						aa.print("script271: Setting WF DUE DATE to:"+thisDueDate);
						
						for (i in vThisWorkflowObj) {
							var vTask = vThisWorkflowObj[i];
							var vDaysDue = 0;
							vTask.setDaysDue(vDaysDue);						
						}
						if ( wfTask == "Application Submittal" && wfStatus == "Accepted" ) {
						editTaskDueDate("Completeness Review",thisDueDate);
						}
						if (wfTask == "Completeness Review" && wfStatus == "Complete") {
							editTaskDueDate("Traffic Study Manager Review",thisDueDate);
							editTaskDueDate("Traffic Study Supervisor Review",thisDueDate);
							editTaskDueDate("Traffic Study Staff Review",thisDueDate);
						}
					}
				}
			}
		}
		else aa.print("script271: No parent site plan found!");
	}

	catch(err){
		showMessage = true;
		comment("script271: Error on custom function script271_AssignmentsDueWhenSitePlanIsDue(). Please contact administrator. Err: " + err);
		aa.print("script271: Error on custom function script271_AssignmentsDueWhenSitePlanIsDue(). Please contact administrator. Err: " + err);
	}
aa.print("script271_AssignmentsDueWhenSitePlanIsDue() ended.");
};//END script271_AssignmentsDueWhenSitePlanIsDue();
function script273_WTUA_CalcReviewDueDatesAndPotentialPCHearingSchedule(){
    logDebug("script273_WTUA_CalcReviewDueDatesAndPotentialPCHearingSchedule START.");
    var appSpecRevComments = "";
    var appSpecValRevComments = "";
    var appSpecProjCommHearingDate = "";
    var appSpecSubmissionDate = "";
    var appSpecValSubmissionDate = "";
    
    if ( !(AInfo["1st Review Comments Due Date"]) ) {
        // Set up the 'target' date we want to search for meetings
        var dToday = new Date();
        var lookForPlanningMtgDate  = aa.date.parseDate(dateAdd(dToday,(7*6.5)));
        var lookForMMDDYYYY = ("0" + lookForPlanningMtgDate.getMonth()).slice(-2) + "/" 
                                + ("0" + lookForPlanningMtgDate.getDayOfMonth()).slice(-2) + "/" 
                                + lookForPlanningMtgDate.getYear();

        //Set up the 'look back' from the target date for searching
        var lookForStartDate        = aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,0));
        
        //Set up the 'look forward' from the target date for searching
        var lookForEndDate          = aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,+45));
        
        //Find the closest meeting to lookForPlanningMtgDate between lookForStartDate and lookForEndDate 
        var newPlnMtg = getClosestAvailableMeeting("Planning Commission", lookForPlanningMtgDate, lookForStartDate, lookForEndDate, "PLANNING COMMISSION");

        // update review comments
        var revdDate = aa.date.parseDate(dateAddHC2("",15, true));
        var revdDateStr = ("0" + revdDate.getMonth()).slice(-2) + "/" 
                            + ("0" + revdDate.getDayOfMonth()).slice(-2) + "/" 
                            + revdDate.getYear();
        editAppSpecific("1st Review Comments Due date",revdDateStr);
        
        // update planning commission date if found
        if (newPlnMtg != null) {
            var newHearingDate = (""+ newPlnMtg.startDate).slice(5,7)+"/" 
                                +(""+ newPlnMtg.startDate).slice(8,10)+"/"
                                +(""+ newPlnMtg.startDate).slice(0,4);
            editAppSpecific("Projected Planning Commission Date",newHearingDate);
        } else {
            logDebug("Script 273: WARNING - there is no planning commission date within 45 days of your target date!");
            comment("<B><Font Color=RED>WARNING - there is no planning commission date within 45 days of your target date!</Font></B>");
        }
    }
    else 
        if ( !(AInfo["2nd Review Comments Due Date"]) ) {
            // Set up the 'target' date we want to search for meetings
            var dToday = new Date();
            var lookForPlanningMtgDate  = aa.date.parseDate(dateAddHC2(dToday,(7*6)));
            var lookForMMDDYYYY = ("0" + lookForPlanningMtgDate.getMonth()).slice(-2) + "/" 
                                    + ("0" + lookForPlanningMtgDate.getDayOfMonth()).slice(-2) + "/" 
                                    + lookForPlanningMtgDate.getYear();
            
            //Set up the 'look back' from the target date for searching
            var lookForStartDate        = aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,0));
            
            //Set up the 'look forward' from the target date for searching
            var lookForEndDate          = aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,+42));
            
            //Find the closest meeting to lookForPlanningMtgDate between lookForStartDate and lookForEndDate 
            var newPlnMtg = getClosestAvailableMeeting("Planning Commission", lookForPlanningMtgDate, lookForStartDate, lookForEndDate, "PLANNING COMMISSION");
            
            // update review comments
            var revdDate = aa.date.parseDate(dateAddHC2("",15, true));
            var revdDateStr = ("0" + revdDate.getMonth()).slice(-2) + "/" 
                                + ("0" + revdDate.getDayOfMonth()).slice(-2) + "/" 
                                + revdDate.getYear();
            editAppSpecific("2nd Review Comments Due date",revdDateStr);
            
            // update submission date
            var subdDate = aa.date.parseDate(dateAddHC2("",20, true));
            var subdDateStr = ("0" + subdDate.getMonth()).slice(-2) + "/" 
                                + ("0" + subdDate.getDayOfMonth()).slice(-2) + "/" 
                                + subdDate.getYear();
            editAppSpecific("Applicant 2nd Submission Date",subdDateStr); 
            
            // update planning commission date if found
            if (newPlnMtg != null) {
                var newHearingDate = (""+ newPlnMtg.startDate).slice(5,7)+"/" 
                                    +(""+ newPlnMtg.startDate).slice(8,10)+"/"
                                    +(""+ newPlnMtg.startDate).slice(0,4);
                editAppSpecific("Projected Planning Commission Date",newHearingDate);
            } else {
                logDebug("Script 273: WARNING - there is no planning commission date within 45 days of your target date!");
                comment("<B><Font Color=RED>WARNING - there is no planning commission date within 45 days of your target date!</Font></B>");
            }
            
        } else {
            // Set up the 'target' date we want to search for meetings
            var dToday = new Date();
            var lookForPlanningMtgDate  = aa.date.parseDate(dateAddHC2(dToday,(7*5)));
            var lookForMMDDYYYY = ("0" + lookForPlanningMtgDate.getMonth()).slice(-2) + "/" 
                                    + ("0" + lookForPlanningMtgDate.getDayOfMonth()).slice(-2) + "/" 
                                    + lookForPlanningMtgDate.getYear();
                    
            //Set up the 'look back' from the target date for searching
            var lookForStartDate        = aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,0));
            
            //Set up the 'look forward' from the target date for searching
            var lookForEndDate          = aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY, +35));
            
            //Find the closest meeting to lookForPlanningMtgDate between lookForStartDate and lookForEndDate 
            var newPlnMtg = getClosestAvailableMeeting("Planning Commission", lookForPlanningMtgDate, lookForStartDate, lookForEndDate, "PLANNING COMMISSION");
        
            if (!(AInfo["3rd Review Comments Due Date"])) {
                // update review comments
                var revdDate = aa.date.parseDate(dateAddHC2("",10, true));
                var revdDateStr = ("0" + revdDate.getMonth()).slice(-2) + "/" 
                                    + ("0" + revdDate.getDayOfMonth()).slice(-2) + "/" 
                                    + revdDate.getYear();
                editAppSpecific("3rd Review Comments Due date",revdDateStr);
            
                // update submission date
                var subdDate = aa.date.parseDate(dateAddHC2("",15, true));
                var subdDateStr = ("0" + subdDate.getMonth()).slice(-2) + "/" 
                                    + ("0" + subdDate.getDayOfMonth()).slice(-2) + "/" 
                                    + subdDate.getYear();
                editAppSpecific("Applicant 3rd Submission Date",subdDateStr); 
            }
			else {
				// else if not null still update submission date
                var subdDate = aa.date.parseDate(dateAddHC2("",15, true));
                var subdDateStr = ("0" + subdDate.getMonth()).slice(-2) + "/" 
                                    + ("0" + subdDate.getDayOfMonth()).slice(-2) + "/" 
                                    + subdDate.getYear();
                editAppSpecific("Applicant 3rd Submission Date",subdDateStr); 
			}
        
            // update planning commission date if found
            if (newPlnMtg != null) {
                var newHearingDate = (""+ newPlnMtg.startDate).slice(5,7)+"/" 
                                    +(""+ newPlnMtg.startDate).slice(8,10)+"/"
                                    +(""+ newPlnMtg.startDate).slice(0,4);
                editAppSpecific("Projected Planning Commission Date",newHearingDate);
            } else {
                    logDebug("Script 273: WARNING - there is no planning commission date within 45 days of your target date!");
                    comment("<B><Font Color=RED>WARNING - there is no planning commission date within 45 days of your target date!</Font></B>");
                }
        }
    
        logDebug("**script273 preparing email**");
        
        // send an email to the applicant
        // Get the Applicant's email
        var recordApplicant = getContactByType("Applicant", capId);
        var applicantEmail = null;
        if (!recordApplicant || recordApplicant.getEmail() == null || recordApplicant.getEmail() == "") {
            logDebug("**WARN no applicant or applicant has no email, capId=" + capId);
        } else {
            applicantEmail = recordApplicant.getEmail();
        }
        
        // Get the Case Manager's email
        var caseManagerEmail=getAssignedStaffEmail();
        var caseManagerPhone=getAssignedStaffPhone();
        var caseManagerFullName=getAssignedStaffFullName();
        var caseManagerTitle=getAssignedStaffTitle();
        
        var cc="";
        
        if (isBlankOrNull(caseManagerEmail)==false){
            if (cc!=""){
                cc+= ";" +caseManagerEmail;
            }else{
                cc=caseManagerEmail;
            }
        }       
        
        if(recordApplicant){
            var acaSiteUrl = lookup("ACA_CONFIGS", "ACA_SITE");
            var subStrIndex = acaSiteUrl.toUpperCase().indexOf("/ADMIN");
            var recordACAUrl = getACARecordURL(subStrIndex)
            aa.print(recordACAUrl);
            var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
            var emailParameters = aa.util.newHashtable();
            addParameter(emailParameters, "$$todayDate$$", dateAdd(null, 0));
            addParameter(emailParameters, "$$altID$$", cap.getCapModel().getAltID());
            addParameter(emailParameters, "$$capAlias$$", capName);
            addParameter(emailParameters, "$$recordAlias$$", cap.getCapType().getAlias());
            addParameter(emailParameters, "$$StaffPhone$$", caseManagerPhone);
            addParameter(emailParameters, "$$StaffEmail$$", caseManagerEmail);
            addParameter(emailParameters, "$$StaffFullName$$", caseManagerFullName);
            addParameter(emailParameters, "$$StaffTitle$$", caseManagerTitle);
            addParameter(emailParameters, "$$FirstName$$", recordApplicant.getFirstName());
            addParameter(emailParameters, "$$LastName$$", recordApplicant.getLastName());
            addParameter(emailParameters, "$$wfComment$$", wfComment);
            addParameter(emailParameters, "$$acaDocDownloadUrl$$", recordACAUrl);
            var reportFile = [];
            var sendResult = sendNotification("noreply@aurora.gov",applicantEmail,"","PLN REVIEW COMMENTS # 273 274 275",emailParameters,reportFile,capID4Email);
            if (!sendResult) 
                { logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
            else
                { logDebug("Sent Notification"); }  
        }
    logDebug("script273_WTUA_CalcReviewDueDatesAndPotentialPCHearingSchedule end.");    
}//END script273_WTUA_CalcReviewDueDatesAndPotentialPCHearingSchedule()
function script274_WTUA_CalcReviewDueDatesAndPotentialPCHearingSchedule2(){
    logDebug("script274_WTUA_CalcReviewDueDatesAndPotentialPCHearingSchedule2 START.");

    var appSpecRevComments = "";
    var appSpecValRevComments = "";
    var appSpecProjCommHearingDate = "";
    var appSpecSubmissionDate = "";
    var appSpecValSubmissionDate = "";

    if ( !(AInfo["1st Review Comments Due Date"]) ) {
        // Set up the 'target' date we want to search for meetings
        var dToday = new Date();
        var lookForPlanningMtgDate  = aa.date.parseDate(dateAddHC2(dToday,(7*12)));
        var lookForMMDDYYYY = ("0" + lookForPlanningMtgDate.getMonth()).slice(-2) + "/" 
                                + ("0" + lookForPlanningMtgDate.getDayOfMonth()).slice(-2) + "/" 
                                + lookForPlanningMtgDate.getYear();
        logDebug("lookForPlanningMtgDate = " + lookForPlanningMtgDate);
        //Set up the 'look back' from the target date for searching
        var lookForStartDate        = aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,0));
        
        //Set up the 'look forward' from the target date for searching
        var lookForEndDate          = aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,+84));
        
        //Find the closest meeting to lookForPlanningMtgDate between lookForStartDate and lookForEndDate 
        var newPlnMtg = getClosestAvailableMeeting("Planning Commission", lookForPlanningMtgDate, lookForStartDate, lookForEndDate, "PLANNING COMMISSION");

        // update review comments
		//Specs say to check for Resubmital requested,but only prelminary plat has this status
		var updateCustField = true;
		//if(appMatch("Planning/Application/Preliminary Plat/NA") && !isHistTaskStatus("Review Distribution", "Resubmittal Requested")) updateCustField = false;
		
        if(updateCustField){
            var revdDate = aa.date.parseDate(dateAddHC2("",15, true));
            var revdDateStr = ("0" + revdDate.getMonth()).slice(-2) + "/" 
                                + ("0" + revdDate.getDayOfMonth()).slice(-2) + "/" 
                                + revdDate.getYear();
            editAppSpecific("1st Review Comments Due date",revdDateStr);
        
            // update planning commission date if found
            if (newPlnMtg != null) {
                var newHearingDate = (""+ newPlnMtg.startDate).slice(5,7)+"/" 
                                    +(""+ newPlnMtg.startDate).slice(8,10)+"/"
                                    +(""+ newPlnMtg.startDate).slice(0,4);
                logDebug("newHearingDate = " + newHearingDate);                             
                editAppSpecific("Projected Planning Commission Date",newHearingDate);
            } else {
                logDebug("Script 274: WARNING - there is no planning commission date within 45 days of your target date!");
                comment("<B><Font Color=RED>WARNING - there is no planning commission date within 45 days of your target date!</Font></B>");
            }
		}
    }
    else 
        if ( !(AInfo["2nd Review Comments Due Date"]) ) {
            // Set up the 'target' date we want to search for meetings
            logDebug("1st Review Comments is Populated--Looking at 2nd Review Comments");
            var dToday = new Date();
            var lookForPlanningMtgDate  = aa.date.parseDate(dateAddHC2(dToday,(7*8)));
            var lookForMMDDYYYY = ("0" + lookForPlanningMtgDate.getMonth()).slice(-2) + "/" 
                                    + ("0" + lookForPlanningMtgDate.getDayOfMonth()).slice(-2) + "/" 
                                    + lookForPlanningMtgDate.getYear();
            
            //Set up the 'look back' from the target date for searching
            var lookForStartDate        = aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,0));
            
            //Set up the 'look forward' from the target date for searching
            var lookForEndDate          = aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,+56));
            
            //Find the closest meeting to lookForPlanningMtgDate between lookForStartDate and lookForEndDate 
            var newPlnMtg = getClosestAvailableMeeting("Planning Commission", lookForPlanningMtgDate, lookForStartDate, lookForEndDate, "PLANNING COMMISSION");
        
            // update review comments
		    //Specs say to check for Resubmital requested,but only prelminary plat has this status
		    var updateCustField = true;
		    //if(appMatch("Planning/Application/Preliminary Plat/NA") && !isHistTaskStatus("Review Distribution", "Resubmittal Requested")) updateCustField = false;
		    
            if(updateCustField){
                var revdDate = aa.date.parseDate(dateAddHC2("",15, true));
                var revdDateStr = ("0" + revdDate.getMonth()).slice(-2) + "/" 
                                    + ("0" + revdDate.getDayOfMonth()).slice(-2) + "/" 
                                    + revdDate.getYear();
                editAppSpecific("2nd Review Comments Due date",revdDateStr);
                logDebug("*******2nd Review Date = " +revdDateStr);
			    
            
        
                // update submission date
                var subdDate = aa.date.parseDate(dateAddHC2("",20, true));
                var subdDateStr = ("0" + subdDate.getMonth()).slice(-2) + "/" 
                                    + ("0" + subdDate.getDayOfMonth()).slice(-2) + "/" 
                                    + subdDate.getYear();
                editAppSpecific("Applicant 2nd Submission Date",subdDateStr); 
                
                // update planning commission date if found
                if (newPlnMtg != null) {
                    var newHearingDate = (""+ newPlnMtg.startDate).slice(5,7)+"/" 
                                        +(""+ newPlnMtg.startDate).slice(8,10)+"/"
                                        +(""+ newPlnMtg.startDate).slice(0,4);
                    editAppSpecific("Projected Planning Commission Date",newHearingDate);
                } else {
                    logDebug("Script 274: WARNING - there is no planning commission date within 45 days of your target date!");
                    comment("<B><Font Color=RED>WARNING - there is no planning commission date within 45 days of your target date!</Font></B>");
                }
			}
            
        } else {
            // Set up the 'target' date we want to search for meetings
            var dToday = new Date();
            var lookForPlanningMtgDate  = aa.date.parseDate(dateAddHC2(dToday,(7*4)));
            var lookForMMDDYYYY = ("0" + lookForPlanningMtgDate.getMonth()).slice(-2) + "/" 
                                    + ("0" + lookForPlanningMtgDate.getDayOfMonth()).slice(-2) + "/" 
                                    + lookForPlanningMtgDate.getYear();
                    
            //Set up the 'look back' from the target date for searching
            var lookForStartDate        = aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,0));
            
            //Set up the 'look forward' from the target date for searching
            var lookForEndDate          = aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY, +28));
            
            //Find the closest meeting to lookForPlanningMtgDate between lookForStartDate and lookForEndDate 
            var newPlnMtg = getClosestAvailableMeeting("Planning Commission", lookForPlanningMtgDate, lookForStartDate, lookForEndDate, "PLANNING COMMISSION");
        
            if (!(AInfo["3rd Review Comments Due Date"])) {
                // update review comments
		        //Specs say to check for Resubmital requested,but only prelminary plat has this status
		        var updateCustField = true;
		        //if(appMatch("Planning/Application/Preliminary Plat/NA") && !isHistTaskStatus("Review Distribution", "Resubmittal Requested")) updateCustField = false;
		        
                if(updateCustField){
                    var revdDate = aa.date.parseDate(dateAddHC2("",10, true));
                    var revdDateStr = ("0" + revdDate.getMonth()).slice(-2) + "/" 
                                        + ("0" + revdDate.getDayOfMonth()).slice(-2) + "/" 
                                        + revdDate.getYear();
                    editAppSpecific("3rd Review Comments Due date",revdDateStr);
                    
                    // update submission date
                    var subdDate = aa.date.parseDate(dateAddHC2("",15, true));
                    var subdDateStr = ("0" + subdDate.getMonth()).slice(-2) + "/" 
                                        + ("0" + subdDate.getDayOfMonth()).slice(-2) + "/" 
                                        + subdDate.getYear();
                    editAppSpecific("Applicant 3rd Submission Date",subdDateStr); 
				}
            }
        
            // update planning commission date if found
            if (newPlnMtg != null) {
                var newHearingDate = (""+ newPlnMtg.startDate).slice(5,7)+"/" 
                                    +(""+ newPlnMtg.startDate).slice(8,10)+"/"
                                    +(""+ newPlnMtg.startDate).slice(0,4);
                editAppSpecific("Projected Planning Commission Date",newHearingDate);
            } else {
                logDebug("Script 274: WARNING - there is no planning commission date within 45 days of your target date!");
                comment("<B><Font Color=RED>WARNING - there is no planning commission date within 45 days of your target date!</Font></B>");
            }
        }
    
        logDebug("**script274 preparing email**");
        
        // send an email to the applicant
        // Get the Applicant's email
        var recordApplicant = getContactByType("Applicant", capId);
        var applicantEmail = null;
        if (!recordApplicant || recordApplicant.getEmail() == null || recordApplicant.getEmail() == "") {
            logDebug("**WARN no applicant or applicant has no email, capId=" + capId);
        } else {
            applicantEmail = recordApplicant.getEmail();
        }
        
        // Get the Case Manager's email
        var caseManagerEmail=getAssignedStaffEmail();
        var caseManagerPhone=getAssignedStaffPhone();
        var caseManagerFullName=getAssignedStaffFullName();
        var caseManagerTitle=getAssignedStaffTitle();
        
        var cc="";
        
        if (isBlankOrNull(caseManagerEmail)==false){
            if (cc!=""){
                cc+= ";" +caseManagerEmail;
            }else{
                cc=caseManagerEmail;
            }
        }       
        
        if(recordApplicant){
            var acaSiteUrl = lookup("ACA_CONFIGS", "ACA_SITE");
            var subStrIndex = acaSiteUrl.toUpperCase().indexOf("/ADMIN");
            var recordACAUrl = getACARecordURL(subStrIndex)
            aa.print(recordACAUrl);
            var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
            var emailParameters = aa.util.newHashtable();
            addParameter(emailParameters, "$$todayDate$$", dateAdd(null, 0));
            addParameter(emailParameters, "$$altID$$", cap.getCapModel().getAltID());
            addParameter(emailParameters, "$$capAlias$$", capName);
            addParameter(emailParameters, "$$recordAlias$$", cap.getCapType().getAlias());
            addParameter(emailParameters, "$$StaffPhone$$", caseManagerPhone);
            addParameter(emailParameters, "$$StaffEmail$$", caseManagerEmail);
            addParameter(emailParameters, "$$StaffFullName$$", caseManagerFullName);
            addParameter(emailParameters, "$$StaffTitle$$", caseManagerTitle);
            addParameter(emailParameters, "$$FirstName$$", recordApplicant.getFirstName());
            addParameter(emailParameters, "$$LastName$$", recordApplicant.getLastName());
            addParameter(emailParameters, "$$wfComment$$", wfComment);
            addParameter(emailParameters, "$$acaDocDownloadUrl$$", recordACAUrl);
            var reportFile = [];
            var sendResult = sendNotification("noreply@aurora.gov",applicantEmail,"","PLN REVIEW COMMENTS # 273 274 275",emailParameters,reportFile,capID4Email);
            if (!sendResult) 
                { logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
            else
                { logDebug("Sent Notification"); }  
        }
        else logDebug("There is no applicant, no email sent");
            
    logDebug("script274_WTUA_CalcReviewDueDatesAndPotentialPCHearingSchedule2 end.");
}//END script274_WTUA_CalcReviewDueDatesAndPotentialPCHearingSchedule2()

function script275_WTUA_CalcReviewDueDatesAndPotentialPCHearingSchedule()
{
logDebug("script275_WTUA_CalcReviewDueDatesAndPotentialPCHearingSchedule3 START.");
var appSpecRevComments = "";
var appSpecValRevComments = "";
var appSpecProjCommHearingDate = "";
var appSpecSubmissionDate = "";
var appSpecValSubmissionDate = "";

if (wfTask == "Review Distribution" && wfStatus == "In Review") {
    logDebug("*******TASK AND STATUS MATCH*****");
    if(countOfTaskStatus("Review Distribution", "In Review") > 1){
        if ( !(AInfo["1st Review Comments Due Date"]) ) {
            // Set up the 'target' date we want to search for meetings
            var dToday = new Date();
            var lookForPlanningMtgDate  = aa.date.parseDate(dateAddHC2(dToday,(7*17.5)));
            var lookForMMDDYYYY = ("0" + lookForPlanningMtgDate.getMonth()).slice(-2) + "/" 
                                    + ("0" + lookForPlanningMtgDate.getDayOfMonth()).slice(-2) + "/" 
                                    + lookForPlanningMtgDate.getYear();
        
            //Set up the 'look back' from the target date for searching
            var lookForStartDate        = aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,0));
            
            //Set up the 'look forward' from the target date for searching
            var lookForEndDate          = aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,+122));
            logDebug("lookForPlanningMtgDate = " + lookForPlanningMtgDate);
            //Find the closest meeting to lookForPlanningMtgDate between lookForStartDate and lookForEndDate 
            var newPlnMtg = getClosestAvailableMeeting("Planning Commission", lookForPlanningMtgDate, lookForStartDate, lookForEndDate, "PLANNING COMMISSION");
        
            // update review comments
            var revdDate = aa.date.parseDate(dateAddHC2("",15, true));
            var revdDateStr = ("0" + revdDate.getMonth()).slice(-2) + "/" 
                                + ("0" + revdDate.getDayOfMonth()).slice(-2) + "/" 
                                + revdDate.getYear();
            editAppSpecific("1st Review Comments Due date",revdDateStr);
            
            // update planning commission date if found
            if (newPlnMtg != null) {
                var newHearingDate = (""+ newPlnMtg.startDate).slice(5,7)+"/" 
                                    +(""+ newPlnMtg.startDate).slice(8,10)+"/"
                                    +(""+ newPlnMtg.startDate).slice(0,4);
              logDebug("newHearingDate = " + newHearingDate);           
              editAppSpecific("Projected Planning Commission Date",newHearingDate);
            } else {
                logDebug("Script 275: WARNING - there is no planning commission date within 12 weeks of your target date!");
                comment("<B><Font Color=RED>WARNING - there is no planning commission date within 12 weeks of your target date!</Font></B>");
            }
        }
        else if ( !(AInfo["2nd Review Comments Due Date"]) ) {
            // Set up the 'target' date we want to search for meetings
            logDebug("1st Review Comments is Populated--Looking at 2nd Review Comments");
            var dToday = new Date();
            var lookForPlanningMtgDate  = aa.date.parseDate(dateAddHC2(dToday,(7*6)));
            var lookForMMDDYYYY = ("0" + lookForPlanningMtgDate.getMonth()).slice(-2) + "/" 
                                    + ("0" + lookForPlanningMtgDate.getDayOfMonth()).slice(-2) + "/" 
                                    + lookForPlanningMtgDate.getYear();
            
            //Set up the 'look back' from the target date for searching
            var lookForStartDate        = aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,0));
            
            //Set up the 'look forward' from the target date for searching
            var lookForEndDate          = aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,+42));
            
            //Find the closest meeting to lookForPlanningMtgDate between lookForStartDate and lookForEndDate 
            var newPlnMtg = getClosestAvailableMeeting("Planning Commission", lookForPlanningMtgDate, lookForStartDate, lookForEndDate, "PLANNING COMMISSION");
        
            // update review comments
            var revdDate = aa.date.parseDate(dateAddHC2("",15, true));
            var revdDateStr = ("0" + revdDate.getMonth()).slice(-2) + "/" 
                                + ("0" + revdDate.getDayOfMonth()).slice(-2) + "/" 
                                + revdDate.getYear();
            editAppSpecific("2nd Review Comments Due date",revdDateStr);
            logDebug("*******2nd Review Date = " +revdDateStr);
        
            // update submission date
            var subdDate = aa.date.parseDate(dateAddHC2("",20, true));
            var subdDateStr = ("0" + subdDate.getMonth()).slice(-2) + "/" 
                                + ("0" + subdDate.getDayOfMonth()).slice(-2) + "/" 
                                + subdDate.getYear();
            editAppSpecific("Applicant 2nd Submission Date",subdDateStr); 
        
            // update planning commission date if found
            if (newPlnMtg != null) {
                var newHearingDate = (""+ newPlnMtg.startDate).slice(5,7)+"/" 
                                    +(""+ newPlnMtg.startDate).slice(8,10)+"/"
                                    +(""+ newPlnMtg.startDate).slice(0,4);
                editAppSpecific("Projected Planning Commission Date",newHearingDate);
            } else {
                logDebug("Script 275: WARNING - there is no planning commission date within 45 days of your target date!");
                comment("<B><Font Color=RED>WARNING - there is no planning commission date within 45 days of your target date!</Font></B>");
            }
            
        } else {
            // Set up the 'target' date we want to search for meetings
            var dToday = new Date();
            var lookForPlanningMtgDate  = aa.date.parseDate(dateAddHC2(dToday,(7*5)));
            var lookForMMDDYYYY = ("0" + lookForPlanningMtgDate.getMonth()).slice(-2) + "/" 
                                    + ("0" + lookForPlanningMtgDate.getDayOfMonth()).slice(-2) + "/" 
                                    + lookForPlanningMtgDate.getYear();
                    
            //Set up the 'look back' from the target date for searching
            var lookForStartDate        = aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,0));
            
            //Set up the 'look forward' from the target date for searching
            var lookForEndDate          = aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY, +35));
            
            //Find the closest meeting to lookForPlanningMtgDate between lookForStartDate and lookForEndDate 
            var newPlnMtg = getClosestAvailableMeeting("Planning Commission", lookForPlanningMtgDate, lookForStartDate, lookForEndDate, "PLANNING COMMISSION");
        
            if (!(AInfo["3rd Review Comments Due Date"])) {
                // update review comments
                var revdDate = aa.date.parseDate(dateAddHC2("",10, true));
                var revdDateStr = ("0" + revdDate.getMonth()).slice(-2) + "/" 
                                    + ("0" + revdDate.getDayOfMonth()).slice(-2) + "/" 
                                    + revdDate.getYear();
                editAppSpecific("3rd Review Comments Due date",revdDateStr);
            
                // update submission date
                var subdDate = aa.date.parseDate(dateAddHC2("",15, true));
                var subdDateStr = ("0" + subdDate.getMonth()).slice(-2) + "/" 
                                    + ("0" + subdDate.getDayOfMonth()).slice(-2) + "/" 
                                    + subdDate.getYear();
                editAppSpecific("Applicant 3rd Submission Date",subdDateStr); 
            }
        
            // update planning commission date if found
            if (newPlnMtg != null) {
                var newHearingDate = (""+ newPlnMtg.startDate).slice(5,7)+"/" 
                                    +(""+ newPlnMtg.startDate).slice(8,10)+"/"
                                    +(""+ newPlnMtg.startDate).slice(0,4);
                editAppSpecific("Projected Planning Commission Date",newHearingDate);
            } else {
                logDebug("Script 274: WARNING - there is no planning commission date within 45 days of your target date!");
                comment("<B><Font Color=RED>WARNING - there is no planning commission date within 45 days of your target date!</Font></B>");
            }
        }
        
            logDebug("**script275 preparing email**");
            
            // send an email to the applicant
            // Get the Applicant's email
            var recordApplicant = getContactByType("Applicant", capId);
            var applicantEmail = null;
            if (!recordApplicant || recordApplicant.getEmail() == null || recordApplicant.getEmail() == "") {
                logDebug("**WARN no applicant or applicant has no email, capId=" + capId);
            } else {
                applicantEmail = recordApplicant.getEmail();
            }
            
            // Get the Case Manager's email
            var caseManagerEmail=getAssignedStaffEmail();
            var caseManagerPhone=getAssignedStaffPhone();
            var caseManagerFullName=getAssignedStaffFullName();
            var caseManagerTitle=getAssignedStaffTitle();
            
            var cc="";
            
            if (isBlankOrNull(caseManagerEmail)==false){
                if (cc!=""){
                    cc+= ";" +caseManagerEmail;
                }else{
                    cc=caseManagerEmail;
                }
            }       
            
            var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
            var emailParameters = aa.util.newHashtable();
            addParameter(emailParameters, "$$altID$$", cap.getCapModel().getAltID());
            addParameter(emailParameters, "$$recordAlias$$", cap.getCapType().getAlias());
            addParameter(emailParameters, "$$StaffPhone$$", caseManagerPhone);
            addParameter(emailParameters, "$$StaffEmail$$", caseManagerEmail);
            addParameter(emailParameters, "$$StaffFullName$$", caseManagerFullName);
            addParameter(emailParameters, "$$StaffTitle$$", caseManagerTitle);
            addParameter(emailParameters, "$$applicantFirstName$$", recordApplicant.getFirstName());
            addParameter(emailParameters, "$$applicantLastName$$", recordApplicant.getLastName());
            addParameter(emailParameters, "$$wfComment$$", wfComment);
            var reportFile = [];
            var sendResult = sendNotification("noreply@aurora.gov",applicantEmail,"","PLN REVIEW COMMENTS # 273 274 275",emailParameters,reportFile,capID4Email);
            if (!sendResult) 
                { logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
            else
                { logDebug("Sent Notification"); }  
		}
				
	}
logDebug("script275_WTUA_CalcReviewDueDatesAndPotentialPCHearingSchedule3 end.");
}
//Script 281
//Record Types: Fire/*/*/*
//Event:        ISA
//Desc:         Event InspectionScheduleAfter 
//
//              Criteria: Any Fire Inspection being scheduled 
//
//              Action: When an Inspection is Scheduled update the Inspector 
//              to the assigned user on the record detail
//
//Created By: Silver Lining Solutions

function script281_AssignScheduledFireInspection(){
    logDebug("script281_AssignScheduledFireInspection() started.");
    try
    {
        // first get the user that has been assigned to the Record
        // if there is no user this may need to be an error
        var userID = getAssignedStaff();
        var userDept = getAssignedDept();
        if (userID == null){
            if(userDept == null)
                throw "Record not Assigned to User. Please enter on the Record tab";
            else{
                switch(userDept + ""){
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS1":
                        userID = "FIRE STATION 01";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS2":
                        userID = "FIRE STATION 02";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS3":
                        userID = "FIRE STATION 03";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS4":
                        userID = "FIRE STATION 04";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS5":
                        userID = "FIRE STATION 05";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS6":
                        userID = "FIRE STATION 06";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS7":
                        userID = "FIRE STATION 07";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS8":
                        userID = "FIRE STATION 08";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS9":
                        userID = "FIRE STATION 09";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS10":
                        userID = "FIRE STATION 10";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS11":
                        userID = "FIRE STATION 11";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS12":
                        userID = "FIRE STATION 12";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS13":
                        userID = "FIRE STATION 13";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS14":
                        userID = "FIRE STATION 14";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS15":
                        userID = "FIRE STATION 15";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS16":
                        userID = "FIRE STATION 16";
                        break;
                    case "AURORACO/FIRE/NA/NA/NA/NA/FS17":
                        userID = "FIRE STATION 17";
                        break;
                    default:
                        break;
                }
            }
        }
        
        if(userID != null)
            assignInspection(inspId,userID);
    }
    catch(err){
        logDebug("Error on script281_AssignScheduledFireInspection(). Please contact administrator. Err: " + err);
    }
    logDebug("script281_AssignScheduledFireInspection() ended.");
};//END script281_AssignScheduledFireInspection

//Script 295	Update completeness check to complete when payment made
//Record Types:	PublicWorks/Real Property/Easement/NA
//Event: 		PaymentReceivedAfter (PRA)
//Desc:			When a payment is made and the balance is 0 
//				then update the workflow task Completeness Check 
//				with the workflow status to Complete.
//Created By: Silver Lining Solutions

function script295_UpdateCompletenessCheckPRA() {
	logDebug("script295_UpdateCompletenessCheckPRA started.");
	try{
		if ( balanceDue <= 0 ) {
			closeTask("Completeness Check","Complete","updated via script when balance is zero","updated via script when balance is zero");
			logDebug("script295: updated completeness check to complete!");
			activateTask("Review Distribution");
			
		}
	}
	catch(err){
		showMessage = true;
		comment("script295: Error on custom function script295_UpdateCompletenessCheckPRA(). Please contact administrator. Err: " + err);
		logDebug("script295: Error on custom function script295_UpdateCompletenessCheckPRA(). Please contact administrator. Err: " + err);
	}
	logDebug("script295_UpdateCompletenessCheckPRA() ended.");
};//END script295_UpdateCompletenessCheckPRA();
//Script 31
//Record Types:	Planning/Special Request/Zoning Inquiry/NA
//Event: 		CTRCA(ACA) or ASA(Civic Platform)
//Desc:			For Planning/Special Request/Zoning Inquiry/NA Calculate Custom Field 
//				Expiration Date at 30 working days from date application is submitted.
//				Action:	on ASA set ASI field Expiration Date today+30.
//Created By: Silver Lining Solutions

function script31_CalcCustomExpDate() {
	logDebug("script31_CalcCustomExpDate() started.");
	try{
		logDebug("the cap id is: "+capId);
		logDebug("today is: "+sysDateMMDDYYYY);
		logDebug("and adding 30 working days makes it: "+ dateAddHC2(sysDateMMDDYYYY, 30, 'Y'));
		var chkThisDate = dateAddHC2(sysDateMMDDYYYY, 30, 'Y');
		logDebug("and after I store the data away its a type: "+typeof (chkThisDate)+" and value of: "+chkThisDate);
		editAppSpecific("Expiration Date", chkThisDate);		
	}
	catch(err){
		showMessage = true;
		comment("Error on custom function script31_CalcCustomExpDate(). Please contact administrator. Err: " + err);
		logDebug("Error on custom function script31_CalcCustomExpDate(). Please contact administrator. Err: " + err);
	}
	logDebug("script31_CalcCustomExpDate() ended.");
}//END script31_CalcCustomExpDate()

function Script332_scheduleInspectionTSI()  {
    var today = aa.util.parseDate(dateAdd(null, 0));
    var tsiArray = new Array();
            
    loadTaskSpecific(tsiArray);
    var pPreHearingDate = tsiArray["Pre hearing inspection date"];
	var preHearingDateMinus1 = getPrevWorkingDays(new Date(pPreHearingDate), 1);
    var inspectorID = getInspectorID();
    var noOfDays = days_between(today, preHearingDateMinus1);
                
    if (pPreHearingDate != null )
        scheduleInspection("Pre Court Investigation", noOfDays, inspectorID, null, workDescGet(capId));
}
//script349_SetColumnValueToNA
//Record Types:	Enforcement/Housing/Inspection/NA
//Event: ASIUA
//Desc: ASIUA - when custom list field "Room" 
//     (Subgroup - "UNIT INSPECTION VIOLATIONS") is set to: 
//     (No Violation; Dog on Premises; Lockout; Tenant Refusal; RBR; 
//     Tenant Ill - Pass; Tenant Ill - Reinspect), then make custom 
//     list fields (Object; Location; and Violation) set to "NA" even 
//     if any one of the fields has a value (NOT Null) when saved. 
//     Enforcement/Housing/Inspection/NA
//
//Created By: Silver Lining Solutions

/**
* Set update column value. format: Map<rowID, Map<columnName, columnValue>>
**/
function setUpdateColumnValue(updateRowsMap/** Map<rowID, Map<columnName, columnValue>> **/, rowID, columnName, columnValue)
{
	var updateFieldsMap = updateRowsMap.get(rowID);
	if (updateFieldsMap == null)
	{
		updateFieldsMap = aa.util.newHashMap();
		updateRowsMap.put(rowID, updateFieldsMap);
	}
	updateFieldsMap.put(columnName, columnValue);
}

/**
* update ASIT rows data. updateRowsMap format: Map<rowID, Map<columnName, columnValue>>
**/
function updateAppSpecificTableInfors(tableName, capId, updateRowsMap/** Map<rowID, Map<columnName, columnValue>> **/)
{
	if (updateRowsMap == null || updateRowsMap.isEmpty())
	{
		return;
	}
	
	var asitTableScriptModel = aa.appSpecificTableScript.createTableScriptModel();
	var asitTableModel = asitTableScriptModel.getTabelModel();
	var rowList = asitTableModel.getRows();
	asitTableModel.setSubGroup(tableName);
	var rowIdArray = updateRowsMap.keySet().toArray();
	for (var i = 0; i < rowIdArray.length; i++)
	{
		var rowScriptModel = aa.appSpecificTableScript.createRowScriptModel();
		var rowModel = rowScriptModel.getRow();
		comment("rowIdArray[i] = " + rowIdArray[i]);
		rowModel.setFields(updateRowsMap.get(rowIdArray[i]));
		rowModel.setId(rowIdArray[i]);
		rowList.add(rowModel);
	}
	return aa.appSpecificTableScript.updateAppSpecificTableInfors(capId, asitTableModel);
}




function script349_SetColumnValueToNA() {
	
	logDebug("script349_SetColumnValueToNA  started.");
	try{
		//var capIDModel = aa.cap.getCapIDModel(capId.ID1,capId.ID2,capId.ID3).getOutput();

		// table name
		var tableName = "UNIT INSPECTION VIOLATIONS";
		var columnName ="Room";

		// Create a HashMap.
		var searchConditionMap = aa.util.newHashMap(); // Map<columnName, List<columnValue>>

		// Create a List object to add the value of Column.
		var valuesList = aa.util.newArrayList();
		valuesList.add("No Violation");
		valuesList.add("Dog on Premises");
		valuesList.add("Lockout");
		valuesList.add("Tenent Refusal");
		valuesList.add("R. B. R.");
		valuesList.add("Tenent Ill - Pass");
		valuesList.add("Tenent Ill - Reinspect");

		searchConditionMap.put(columnName, valuesList);

		//var appSpecificTableInfo = aa.appSpecificTableScript.getAppSpecificTableInfo(capIDModel, tableName, searchConditionMap/** Map<columnName, List<columnValue>> **/);
		var appSpecificTableInfo = aa.appSpecificTableScript.getAppSpecificTableInfo(capId, tableName, searchConditionMap/** Map<columnName, List<columnValue>> **/);
		if (appSpecificTableInfo.getSuccess())
		{
			var appSpecificTableModel = appSpecificTableInfo.getOutput().getAppSpecificTableModel();
			var tableFields = appSpecificTableModel.getTableFields(); // List<BaseField>
			if (tableFields != null && tableFields.size() > 0)
			{
				var updateRowsMap = aa.util.newHashMap(); // Map<rowID, Map<columnName, columnValue>>
				for (var i=0; i < tableFields.size(); i++)
				{
					var fieldObject = tableFields.get(i); // BaseField
					
					//get the column name.
					var columnName = fieldObject.getFieldLabel();
					//get the value of column
					var columnValue = fieldObject.getInputValue();
					//get the row ID 
					var rowID = fieldObject.getRowIndex();
					
					setUpdateColumnValue(updateRowsMap, rowID, "Location", "NA");
					setUpdateColumnValue(updateRowsMap, rowID, "Violation", "NA");
					setUpdateColumnValue(updateRowsMap, rowID, "Object", "NA");
				}
				if (!updateRowsMap.isEmpty())
				{
					updateAppSpecificTableInfors(tableName, capId, updateRowsMap);
				}
			}	
		}

		
	
	} catch(err){
		showMessage = true;
		comment("Error on custom function script349_SetColumnValueToNA . Please contact administrator. Err: " + err);
		logDebug("Error on custom function script349_SetColumnValueToNA . Please contact administrator. Err: " + err);
		logDebug("A JavaScript Error occurred: WTUA:Building/Permit/*/* 208: " + err.message);
		logDebug(err.stack)
	}
	logDebug("script349_SetColumnValueToNA  ended.");

}


//script380_UpdatCustomFieldPermitExpirationDates
//Record Types:	Building/Permit/New Construction/NA; Building/Permit/Plans/NA; Building/Permit/No Plans/NABuilding/Permit/*/* (EXCEPT Building/Permit/Master/NA)
//Event: IRSA - Inspection Result Submit After
//Desc: Inspection Result Submit After, update the Custom Field ‘Permit Expiration Date’ with Today's date + 180 days if inspection result is not "Cancelled"  

//Created By: Silver Lining Solutions

function script380_PermitExpirationDateWithTodaysDate180(){
	
	logDebug("script380_PermitExpirationDateWithTodaysDate180  started.");
	try{
		
		if (inspResult !="Cancelled") {
				editAppSpecific("Permit Expiration Date",dateAdd(null,180));
		}
	} catch(err){
		showMessage = true;
		comment("Error on custom function script380_PermitExpirationDateWithTodaysDate180 . Please contact administrator. Err: " + err);
		logDebug("Error on custom function script380_PermitExpirationDateWithTodaysDate180 . Please contact administrator. Err: " + err);
		logDebug("A JavaScript Error occurred: IRSA:Building/Permit/*/* 380: " + err.message); 
		logDebug(err.stack)
	}
	logDebug("script380_PermitExpirationDateWithTodaysDate180  ended.");
//	if function is used        };//END PRA:Building/Permit/*/* ;

}

//script381_UpdatCustomFieldPermitExpirationDates
//Record Types:	Building/Permit/New Construction/NA; Building/Permit/Plans/NA; Building/Permit/No Plans/NABuilding/Permit/*/* (EXCEPT Building/Permit/Master/NA)
//Event: PRA - PaymentReceivedAfter
//Desc: Payment Recieved After, update the Custom Field ‘Permit Expiration Date’ with Today's date + 180 days  

//Created By: Silver Lining Solutions

function script381_UpdatCustomFieldPermitExpirationDates(){
	
	logDebug("script381_UpdatCustomFieldPermitExpirationDates  started.");
	try{
		if (!appMatch("Building/Permit/Master/NA")) {
				editAppSpecific("Permit Issued Date",dateAdd(null,0));		
				editAppSpecific("Permit Expiration Date",dateAdd(null,180));
		}
	} catch(err){
		showMessage = true;
		comment("Error on custom function script381_UpdatCustomFieldPermitExpirationDates . Please contact administrator. Err: " + err);
		logDebug("Error on custom function script381_UpdatCustomFieldPermitExpirationDates . Please contact administrator. Err: " + err);
		logDebug("A JavaScript Error occurred: PRA:Building/Permit/*/* 381: " + err.message); 
		logDebug(err.stack)
	}
	logDebug("script381_UpdatCustomFieldPermitExpirationDates  ended.");
//	if function is used        };//END PRA:Building/Permit/*/* ;

}
/*Script 398
 * Record Types:	Water/Water/SWMP/Permit
 * Event: 		WorkflowTaskUpdateAfter (WTUA)
 * 
 * Desc:			
 * When WF Task = Final Certification is statused as Complete send 
 * email to Applicant to schedule the Final Inspection when ready 
 * for an inspection. Include Deeplink to the record in the email

 * 
*/

function script398_ScheduleFinalInspection() {
	logDebug("script398_ScheduleFinalInspection() started.");
	try{
		if (ifTracer(wfTask == "Final Certification" && wfStatus == "Complete", 'wfTask == Final Certification && wfStatus == Complete')) 
		{
            var emailTemplate = 'SWMP FINAL CERTIFICATION COMPLETE #398',
                contactTypes = 'Applicant',
                emailparams = aa.util.newHashtable();

            emailContacts(contactTypes, emailTemplate, emailparams, "", "", "N", "");
 		}
	}
	catch(err){
		showMessage = true;
		comment("Error on custom function “script398_ScheduleFinalInspection(). Please contact administrator. Err: " + err);
		logDebug("Error on custom function “script398_ScheduleFinalInspection(). Please contact administrator. Err: " + err);
	}
	logDebug("script398_ScheduleFinalInspection() ended.");
};//END script398_ScheduleFinalInspection();

/*Script 399
 * Record Types:	Water/Water/SWMP/Application
 * Event: 		WorkflowTaskUpdateAfter (WTUA)
 * 
 * Desc:			
 * When workflow task application submittal = accepted and custom field 
 * Paying by bond= yes then email applicant that they must bring in physical 
 * bond with instructions to bring to the permit center and status workflow 
 * task fee processing as awaiting bond.

 * 
*/

function script399_BondEmailAndAwaitingBondTaskStatus() {
	logDebug("script399_BondEmailAndAwaitingBondTaskStatus() started.");
	try{
		if (ifTracer(wfTask == "Application Submittal" && wfStatus == "Accepted", 'wfTask == Application Submittal && wfStatus == Accepted')) 
		{
            var emailTemplate = 'SWMP PAYING BY BOND #399',
                contactTypes = 'Applicant',
                emailparams = aa.util.newHashtable();

            if(ifTracer(getAppSpecific("Paying with Bond") =='Yes','Paying with Bond == Yes')) {
                emailContacts(contactTypes, emailTemplate, emailparams, "", "", "N", "");
                updateTask('Fee Processing',"Awaiting Bond", "Updated via EMSE (#399)","");
            }
 		}
	}
	catch(err){
		showMessage = true;
		comment("Error on custom function “script399_BondEmailAndAwaitingBondTaskStatus(). Please contact administrator. Err: " + err);
		logDebug("Error on custom function “script399_BondEmailAndAwaitingBondTaskStatus(). Please contact administrator. Err: " + err);
	}
	logDebug("script399_BondEmailAndAwaitingBondTaskStatus() ended.");
};//END script399_BondEmailAndAwaitingBondTaskStatus();

/*Script 400
 * Record Types: Water/Water/Tap/Application
 * Event: 		IRSB/IRSA
 * 
 * Desc:			
 * If the inspection type = "Meter Set Inspection" and the inspection checklist field “Water meter number” does not have a
value and the inspection status = “Passed” then prevent the inspection from being resulted and display the error message
"Water Meter Number must not be null to status inspection as passed." When inspection status = passed then populate
"Water Meter Number" info field on the parent building permit record with the data from the checklist field “Water meter
number”. When inspection type "Meter Set Inspection" status = failed then send email to the applicant with instructions to
log on to ACA or call the Aurora Water Operations Service Center at 303-326-8645 between the hours of 7am to 3:30 pm
to schedule a re-inspection.
 * 
*/ 
function script400_WatTapApplicationInspectionAutomation() {
 	logDebug("script400_WatTapApplicationInspectionAutomation() started.");
	try{
        var eventName = aa.env.getValue("EventName"),
            emailTemplate = 'WAT METER SET INSPECTION FAILED # 400',
            toContactTypes = 'Applicant',
            ccContactTypes = '',
            emailParams = aa.util.newHashtable(),
            reportName = "",
            reportParams = aa.util.newHashtable(),
            parentCapScriptModel,
            parentCapTypeString,
            parentCapId,
            guideSheetObjects = getGuideSheetObjects(inspId),
            applicant = getContactByType("Applicant", capId),
            idx;

            
		if (ifTracer(eventName.indexOf("InspectionResultSubmitBefore") > -1 || eventName.indexOf("InspectionResultModifyBefore") > -1, 'eventName.indexOf(InspectionResultSubmitBefore) > -1')) {
            if (ifTracer(inspResult == 'Pass' && !getMeterNumber(), 'inspResult == Pass && getMeterNumber() == false')) {
                cancel = true;
                showMessage = true;
                comment("'Water Meter Number' field from the 'Tap Application' checklist must not be blank to status inspection as Pass.");                            
                logDebug("'Water Meter Number' field from the 'Tap Application' checklist must not be blank to status inspection as Pass.");                            
            }
			if (ifTracer(inspResult == 'Fail' && getMeterNumber(), 'inspResult == Fail && getMeterNumber() == true')) {
                cancel = true;
                showMessage = true;
                comment("'Water Meter Number' field from the 'Tap Application' checklist must be blank to status inspection as Fail.");                            
                logDebug("'Water Meter Number' field from the 'Tap Application' checklist must be blank to status inspection as Fail.");                            
            }
        } else if (ifTracer(eventName.indexOf("InspectionResultSubmitAfter") > -1 || eventName.indexOf("InspectionResultModifyAfter") > -1, 'eventName.indexOf(InspectionResultSubmitAfter) > -1'))  {
                if (ifTracer(inspResult == 'Pass', 'inspResult == Pass')) {
                    var meterNbr = getMeterNumber();
                    editAppSpecific("Water Meter Number", meterNbr, capId);
                    //get parent
                    parentCapId = getParent();
                    if(ifTracer(parentCapId, 'parent found')) {
                        //make sure parent is a permit (Building/Permit/*/*)
                        parentCapScriptModel = aa.cap.getCap(parentCapId).getOutput();
                        parentCapTypeString = parentCapScriptModel.getCapType().toString();
                      //  if(ifTracer(parentCapTypeString.indexOf('Building/Permit/') > -1, 'parent = Building/Permit/*/*')) {
                            //there is no water meter number field - make a comment per email from christy dtd 20180605
                       //     createCapComment('Water Meter Number: ' + getMeterNumber(), parentCapId);
                            //update any parent type Water Meter Number asi per qa testing note dtd 8/16 
                        editAppSpecific("Water Meter Number", meterNbr, parentCapId);
                            //   }
                    }
                    
                } else if (ifTracer(inspResult == 'Fail', 'inspResult == Fail')) {    //failed
				    var resComment = "";
					
					if(eventName.indexOf("InspectionResultSubmitAfter") > -1) resComment = inspComment;
					else resComment = inspResultComment;
					
                    addParameter(emailParams, "$$inspComment$$", resComment);
                    emailContactsWithCCs(toContactTypes, emailTemplate, emailParams, reportName, reportParams, "N", "", ccContactTypes);
                }
        }
    }
    catch(err){
		showMessage = true;
		comment("Error on custom function script400_WatTapApplicationInspectionAutomation(). Please contact administrator. Err: " + err);
		logDebug("Error on custom function script400_WatTapApplicationInspectionAutomation(). Please contact administrator. Err: " + err);
	}
    logDebug("script400_WatTapApplicationInspectionAutomation() ended."); 
    

    function getMeterNumber() {
        var meterNumber = null;
        if (guideSheetObjects &&  guideSheetObjects.length > 0) {
            for (idx in guideSheetObjects) {
                if(guideSheetObjects[idx].gsType == 'Tap Application') {
                    guideSheetObjects[idx].loadInfo();
                    return guideSheetObjects[idx].info["Meter Number"]
                }
                
            }
        }
        return meterNumber;
    }
}   //END script400_WatTapApplicationInspectionAutomation();



//@ts-check
//Script 57
//Record Types:	Forestry/*/*/*
//Event: 		ISA (Inspection Scheduled After)
//Desc:			When an inspection is scheduled, Then automatically set the scheduled date of 
//				the inspection to the current system date and insert the RECORD detailed description 
//				text and the tree ID and Unit Number(both come from the Custom list Tree Information) 
//				into the inspection request/comments field.  
//Created By: Silver Lining Solutions

function script57_ForestryInspectionScheduleDate() {
	logDebug("script57_ForestryInspectionScheduleDate() started.");
	try{
		
		//Get the Record Work Description
		var thisCap = aa.cap.getCap(capId).getOutput();
		if (thisCap != null ) {
			var thisCapModel = thisCap.getCapModel();
			if (thisCapModel != null) {
				if (thisCapModel.getCapWorkDesModel()) {
					var thisWorkDesc = thisCapModel.getCapWorkDesModel().description
				}
				else {
					var thisWorkDesc = "";
				}
				//Get Tree Info List data, loop through them and add to a text var 
				var thisAppSpecTable = loadASITable("TREE INFORMATION", capId);
				var row, treeId, treeMgtUnit;
				var addThisText = "" + thisWorkDesc + "\n";

logDebug("script57: got the tree info and the cap description!");
logDebug("script57: desc:"+thisWorkDesc);
//logDebug("script57: tree info table ***************************");
				
				for (var ea in thisAppSpecTable) {
					row = thisAppSpecTable[ea];
					
//logDebug("script57: tree info row:"+row);
//logDebug("script57: row tree id:"+row["Tree ID"]);
//logDebug("script57: row tree qty:"+row["Management Unit"]);

					treeID = "" + row["Tree ID"].fieldValue;
					treeMgtUnit = "" + row["Management Unit"].fieldValue;
					addThisText += "\n" + "TREE ID: " + treeID;
					addThisText += "\n" + "Management Unit: " + treeMgtUnit;
				}

				var inspIdArr = aa.env.getValue("InspectionIDArray");	
				
//logDebug("script57: the insp array is:"+inspIdArr);		
				
				for (var inInsp in inspIdArr) {
					var thisInspectionID = inspIdArr[inInsp];
					var thisInsp = aa.inspection.getInspection(capId, thisInspectionID ).getOutput();
					var thisScheduledDate = sysDate;

//logDebug("script57: the request comment is>"+thisInsp.requestComment + "<");
//logDebug("script57: the inspection comments are >"+thisInsp.InspectionComment + "<");

					var thisRequestComment = thisInsp.requestComment == null ? "" + "\n" + addThisText : thisInsp.requestComment+ "\n" + addThisText;
					thisInsp.setScheduledDate(thisScheduledDate);
					thisInsp.setInspectionComments(thisRequestComment);
					aa.inspection.editInspection(thisInsp);
				}
			} else logDebug("script57: could not get cap Model!");
		} else logDebug("script57: could not get cap!");
	}
	catch(err){
		showMessage = true;
		comment("Error on custom function script57_ForestryInspectionScheduleDate(). Please contact administrator. Err: " + err);
		logDebug("Error on custom function script57_ForestryInspectionScheduleDate(). Please contact administrator. Err: " + err);
	}
	logDebug("script57_ForestryInspectionScheduleDate() ended.");
} //END script57_ForestryInspectionScheduleDate()

//Script 59
//Record Types: Planning/NA/NA/NA
//Event:        WTUA
//Desc:         tbd  
//
//Created By: Silver Lining Solutions

function script59_PlanningCloseCaseComplete(){
    logDebug("script59_PlanningCloseCaseComplete() started.");
    if(ifTracer(wfTask == 'Case Complete' && matches(wfStatus, 'Closed', 'Complete'), 'wf: Case Complete/Closed OR Case Complete/Complete'))
        if(wfProcess) deactivateActiveTasks(wfProcess);
    logDebug("script59_PlanningCloseCaseComplete() ended.");
};//END script59_PlanningCloseCaseComplete();
//script83_TapAppFees
//Record Types: Water/Water/Tap/Application
//Event: ASA- ApplicationSubmitAfter, ASIUA- AppSpecificInfoUpdateAfter
//Desc: Add fees with ASI is updated.
//Created By: Silver Lining Solutions
//Updated 07/27/2018 (evontrapp@etechconsultingllc.com) - Added logic to check for pre/post 2017 fee schedule
//Updated 07/30/2018 (evontrapp@etechconsultingllc.com) - Added fee logic for Cherry Creek Basin, Commercial Water fee, and updated Z-Zone fee assessment

function script83_TapAppFees() {
    logDebug("script83_TapAppFees started.");
    try{
        var type = AInfo["Type"];
        var plattedAfter = AInfo["Platted after 2017"];
        var feeItem = "";
        var feeSched = "";
        var feePeriod = "FINAL";
        var feeQty = 0;
        var feeInv = "N";
        
        //Variables used for calculating amount
        var waterClosets = AInfo["Water Closets"];
        var lotSize      = AInfo["Total Lot Size"];
        var stubOut      = AInfo["Stub out Paid with Building Permit"];
        var constWtr     = AInfo["Construction Water"];
        var cherryCreek  = AInfo["Cherry Creek Basin"];
        var resUnits     = AInfo["Number of Residential Units"];
        var sizeWtrMeter = AInfo["Size of Water Meter"];
        var hardSfSqFt   = AInfo["Hard Surface Sq Ft"];
        var bldgSqFt     = AInfo["Building Sq Ft"];
        var avrDailyDemd = AInfo["Average Daily Demand(In GPD)"];
        var nonWtrSqFt   = AInfo["Non-water conserving sq ft"];
        var wtrSqFt      = AInfo["Water conserving sq ft"];
        
		var feeArray = ["WAT_TA_01","WAT_TA_02","WAT_TA_03","WAT_TA_04","WAT_TA_05","WAT_TA_06","WAT_TA_09","WAT_TA_10","WAT_TA_11","WAT_TA_12","WAT_TA_16","WAT_TA_17","WAT_TA_18","WAT_TA_19","WAT_TA_20","WAT_TA_21","WAT_TA_22","WAT_TA_23","WAT_TA_24","WAT_TA_25","WAT_TA_26","WAT_TA_27","WAT_TA_28","WAT_TA_29","WAT_TA_30","WAT_TA_31","WAT_TA_32","WAT_TA_33","WAT_TA_36","WAT_TA_37","WAT_TA_39","WAT_TA_40","WAT_TA_41","WAT_TA_42","WAT_TA_44"];
        var feeArray2 = ["WAT_TA2_01","WAT_TA2_02","WAT_TA2_03","WAT_TA2_04","WAT_TA2_05","WAT_TA2_06","WAT_TA2_09","WAT_TA2_10","WAT_TA2_11","WAT_TA2_12","WAT_TA2_16","WAT_TA2_17","WAT_TA2_18","WAT_TA2_19","WAT_TA2_20","WAT_TA2_21","WAT_TA2_22","WAT_TA2_23","WAT_TA2_24","WAT_TA2_25","WAT_TA2_26","WAT_TA2_27","WAT_TA2_28","WAT_TA2_29","WAT_TA2_30","WAT_TA2_31","WAT_TA2_32","WAT_TA2_33","WAT_TA2_36","WAT_TA2_37","WAT_TA2_39","WAT_TA2_40","WAT_TA2_41","WAT_TA2_42","WAT_TA2_44"];
        
		for(j in feeArray){
            var aFee = feeArray[j];
            if(feeExists(aFee)) removeFee(aFee, feePeriod);
        }
		
		for(j in feeArray2){
            var aFee = feeArray2[j];
            if(feeExists(aFee)) removeFee(aFee, feePeriod);
        }
		
        //use WAT_TA fee schedule if platted after 2017
        if (ifTracer(plattedAfter == "Yes", 'Platted Prior 2017')) {
            feeSched = "WAT_TA";
            
            
            
            if(ifTracer(type == "Single Family Detached", "Single Family Detached")){
                if(waterClosets){
                    waterClosets = parseFloat(waterClosets);
                    if(waterClosets < 3) feeItem = "WAT_TA_01";
                    if(waterClosets >= 3 && waterClosets < 5) feeItem = "WAT_TA_02";
                    if(waterClosets >= 5) feeItem = "WAT_TA_03";
                    
                    if(feeItem != "") {
                        updateFee(feeItem, feeSched, feePeriod, 1, feeInv);
                        feeItem = ""; 
                    }
                }
                
                if(lotSize) updateFee("WAT_TA_04", feeSched, feePeriod, parseFloat(lotSize), feeInv);
                if(stubOut == "Yes") updateFee("WAT_TA_44", feeSched, feePeriod, 1, feeInv);
                
                updateFee("WAT_TA_05", feeSched, feePeriod, 1, feeInv);
                updateFee("WAT_TA_06", feeSched, feePeriod, 1, feeInv);
                
                if(constWtr == "Yes") updateFee("WAT_TA_42", feeSched, feePeriod, 1, feeInv);
                if(cherryCreek == "Yes") updateFee("WAT_TA_40", feeSched, feePeriod, 1, feeInv);
            }
                
            if(ifTracer(type == "Single Family Attached", "Single Family Attached")){
                if(resUnits) updateFee("WAT_TA_09", feeSched, feePeriod, parseFloat(resUnits), feeInv);
                if(lotSize) updateFee("WAT_TA_10", feeSched, feePeriod, parseFloat(lotSize), feeInv);
                if(stubOut == "Yes") updateFee("WAT_TA_44", feeSched, feePeriod, 1, feeInv);
                   
                updateFee("WAT_TA_11", feeSched, feePeriod, 1, feeInv);
                updateFee("WAT_TA_12", feeSched, feePeriod, 1, feeInv);
                
                if(constWtr == "Yes") updateFee("WAT_TA_42", feeSched, feePeriod, 1, feeInv);
                if(cherryCreek == "Yes") updateFee("WAT_TA_40", feeSched, feePeriod, 1, feeInv);
            }
            
            if(ifTracer(type == "Multi Family", "Multi Family")){
                if(resUnits) updateFee("WAT_TA_16", feeSched, feePeriod, parseFloat(resUnits), feeInv);
                if(stubOut == "Yes") updateFee("WAT_TA_44", feeSched, feePeriod, 1, feeInv);
                
                if(resUnits) updateFee("WAT_TA_17", feeSched, feePeriod, parseFloat(resUnits), feeInv);
                
                if(sizeWtrMeter == '3/4"') updateFee("WAT_TA_18", feeSched, feePeriod, 1, feeInv);
                if(sizeWtrMeter == '1"') updateFee("WAT_TA_19", feeSched, feePeriod, 1, feeInv);
                if(sizeWtrMeter == '1 1/2"') updateFee("WAT_TA_20", feeSched, feePeriod, 1, feeInv);
                if(sizeWtrMeter == '2"') updateFee("WAT_TA_21", feeSched, feePeriod, 1, feeInv);
                
                if(constWtr == "Yes") updateFee("WAT_TA_42", feeSched, feePeriod, 1, feeInv);
                if(cherryCreek == "Yes") {
                    if(hardSfSqFt) hardSfSqFt = parseFloat(hardSfSqFt); else hardSfSqFt = 0;
                    if(bldgSqFt) bldgSqFt = parseFloat(bldgSqFt); else bldgSqFt = 0;
                    updateFee("WAT_TA_41", feeSched, feePeriod, hardSfSqFt + bldgSqFt, feeInv);
                }
            }
                
            if(ifTracer(type == "Commercial", "Commercial")){
                if(sizeWtrMeter == '3/4"')   {
                    updateFee("WAT_TA_22", feeSched, feePeriod, 1, feeInv);
                    updateFee("WAT_TA_26", feeSched, feePeriod, 1, feeInv);
                    updateFee("WAT_TA_30", feeSched, feePeriod, 1, feeInv);
                }
                if(sizeWtrMeter == '1"')     {
                    updateFee("WAT_TA_23", feeSched, feePeriod, 1, feeInv);
                    updateFee("WAT_TA_27", feeSched, feePeriod, 1, feeInv);
                    updateFee("WAT_TA_31", feeSched, feePeriod, 1, feeInv);
                }
                if(sizeWtrMeter == '1 1/2"') {
                    updateFee("WAT_TA_24", feeSched, feePeriod, 1, feeInv);
                    updateFee("WAT_TA_28", feeSched, feePeriod, 1, feeInv);
                    updateFee("WAT_TA_32", feeSched, feePeriod, 1, feeInv);
                }
                if(sizeWtrMeter == '2"')     {
                    updateFee("WAT_TA_25", feeSched, feePeriod, 1, feeInv);
                    updateFee("WAT_TA_29", feeSched, feePeriod, 1, feeInv);
                    updateFee("WAT_TA_33", feeSched, feePeriod, 1, feeInv);
                }
                
                if(matches(sizeWtrMeter, '3"', '4"', '6"', '8"', '10"', '12"','Other')){
                    if(avrDailyDemd) {
                        avrDailyDemd = parseFloat(avrDailyDemd);
                        updateFee("WAT_TA_39", feeSched, feePeriod, avrDailyDemd, feeInv)
                    }
                }
                
                if(stubOut == "Yes") updateFee("WAT_TA_44", feeSched, feePeriod, 1, feeInv);
                
                if(constWtr == "Yes") updateFee("WAT_TA_42", feeSched, feePeriod, 1, feeInv);
                if(cherryCreek == "Yes") {
                    if(hardSfSqFt) hardSfSqFt = parseFloat(hardSfSqFt); else hardSfSqFt = 0;
                    if(bldgSqFt) bldgSqFt = parseFloat(bldgSqFt); else bldgSqFt = 0;
                    updateFee("WAT_TA_41", feeSched, feePeriod, hardSfSqFt + bldgSqFt, feeInv);
                }
            }
            
            if(ifTracer(type == "Irrigation", "Irrigation")){
                if(nonWtrSqFt) {
                    nonWtrSqFt = parseFloat(nonWtrSqFt);
                    updateFee("WAT_TA_36", feeSched, feePeriod, nonWtrSqFt, feeInv)
                }
                
                if(wtrSqFt) {
                    wtrSqFt = parseFloat(wtrSqFt);
                    updateFee("WAT_TA_37", feeSched, feePeriod, wtrSqFt, feeInv)
                }
            }
        } else if (ifTracer(plattedAfter == "No", 'Platted After 2017')) { //use WAT_TA2 fee schedule if platted before 2017
                feeSched = "WAT_TA2";
                
                if(ifTracer(type == "Single Family Detached", "Single Family Detached")){
                    if(waterClosets){
                        waterClosets = parseFloat(waterClosets);
                        if(waterClosets < 3) feeItem = "WAT_TA2_01";
                        if(waterClosets >= 3 && waterClosets < 5) feeItem = "WAT_TA2_02";
                        if(waterClosets >= 5) feeItem = "WAT_TA2_03";
                        
                        if(feeItem != "") { updateFee(feeItem, feeSched, feePeriod, 1, feeInv); feeItem = "";}
                    }
                
                    if(lotSize) updateFee("WAT_TA2_04", feeSched, feePeriod, parseFloat(lotSize), feeInv);
                    if(stubOut == "Yes") updateFee("WAT_TA2_44", feeSched, feePeriod, 1, feeInv);
                    
                    updateFee("WAT_TA2_05", feeSched, feePeriod, 1, feeInv);
                    updateFee("WAT_TA2_06", feeSched, feePeriod, 1, feeInv);
                
                    if(constWtr == "Yes") updateFee("WAT_TA2_42", feeSched, feePeriod, 1, feeInv);
                    if(cherryCreek == "Yes") updateFee("WAT_TA2_40", feeSched, feePeriod, 1, feeInv);
                }
                
                if(ifTracer(type == "Single Family Attached", "Single Family Attached")){
                    if(resUnits) updateFee("WAT_TA2_09", feeSched, feePeriod, parseFloat(resUnits), feeInv);
                    if(lotSize) updateFee("WAT_TA2_10", feeSched, feePeriod, parseFloat(lotSize), feeInv);
                    if(stubOut == "Yes") updateFee("WAT_TA2_44", feeSched, feePeriod, 1, feeInv);
                    
                    updateFee("WAT_TA2_11", feeSched, feePeriod, 1, feeInv);
                    updateFee("WAT_TA2_12", feeSched, feePeriod, 1, feeInv);
                
                    if(constWtr == "Yes") updateFee("WAT_TA2_42", feeSched, feePeriod, 1, feeInv);
                    if(cherryCreek == "Yes") updateFee("WAT_TA2_40", feeSched, feePeriod, 1, feeInv);
                }
            
                if(ifTracer(type == "Multi Family", "Multi Family")){
                    if(resUnits) updateFee("WAT_TA2_16", feeSched, feePeriod, parseFloat(resUnits), feeInv);
                    if(stubOut == "Yes") updateFee("WAT_TA2_44", feeSched, feePeriod, 1, feeInv);
                    
                    if(resUnits) updateFee("WAT_TA2_17", feeSched, feePeriod, parseFloat(resUnits), feeInv);
                    
                    if(sizeWtrMeter == '3/4"')   updateFee("WAT_TA2_18", feeSched, feePeriod, 1, feeInv);
                    if(sizeWtrMeter == '1"')     updateFee("WAT_TA2_19", feeSched, feePeriod, 1, feeInv);
                    if(sizeWtrMeter == '1 1/2"') updateFee("WAT_TA2_20", feeSched, feePeriod, 1, feeInv);
                    if(sizeWtrMeter == '2"')     updateFee("WAT_TA2_21", feeSched, feePeriod, 1, feeInv);
                
                    if(constWtr == "Yes") updateFee("WAT_TA2_42", feeSched, feePeriod, 1, feeInv);
                    if(cherryCreek == "Yes") {
                        if(hardSfSqFt) hardSfSqFt = parseFloat(hardSfSqFt); else hardSfSqFt = 0;
                        if(bldgSqFt) bldgSqFt = parseFloat(bldgSqFt); else bldgSqFt = 0;
                        updateFee("WAT_TA2_41", feeSched, feePeriod, hardSfSqFt + bldgSqFt, feeInv);
                    }
                }
                
                if(ifTracer(type == "Commercial", "Commercial")){
                    if(sizeWtrMeter == '3/4"')   {
                        updateFee("WAT_TA2_22", feeSched, feePeriod, 1, feeInv);
                        updateFee("WAT_TA2_26", feeSched, feePeriod, 1, feeInv);
                        updateFee("WAT_TA2_30", feeSched, feePeriod, 1, feeInv);
                    }
                    if(sizeWtrMeter == '1"')     {
                        updateFee("WAT_TA2_23", feeSched, feePeriod, 1, feeInv);
                        updateFee("WAT_TA2_27", feeSched, feePeriod, 1, feeInv);
                        updateFee("WAT_TA2_31", feeSched, feePeriod, 1, feeInv);
                    }
                    if(sizeWtrMeter == '1 1/2"') {
                        updateFee("WAT_TA2_24", feeSched, feePeriod, 1, feeInv);
                        updateFee("WAT_TA2_28", feeSched, feePeriod, 1, feeInv);
                        updateFee("WAT_TA2_32", feeSched, feePeriod, 1, feeInv);
                    }
                    if(sizeWtrMeter == '2"')     {
                        updateFee("WAT_TA2_25", feeSched, feePeriod, 1, feeInv);
                        updateFee("WAT_TA2_29", feeSched, feePeriod, 1, feeInv);
                        updateFee("WAT_TA2_33", feeSched, feePeriod, 1, feeInv);
                    }
                    
                    if(matches(sizeWtrMeter, '3"', '4"', '6"', '8"', '10"', '12"','Other')){
                        if(avrDailyDemd) {
                            avrDailyDemd = parseFloat(avrDailyDemd);
                            updateFee("WAT_TA2_39", feeSched, feePeriod, avrDailyDemd, feeInv)
                        }
                    }
                    
                    if(stubOut == "Yes") updateFee("WAT_TA2_44", feeSched, feePeriod, 1, feeInv);
                    
                    if(constWtr == "Yes") updateFee("WAT_TA2_42", feeSched, feePeriod, 1, feeInv);
                    if(cherryCreek == "Yes") {
                        if(hardSfSqFt) hardSfSqFt = parseFloat(hardSfSqFt); else hardSfSqFt = 0;
                        if(bldgSqFt) bldgSqFt = parseFloat(bldgSqFt); else bldgSqFt = 0;
                        updateFee("WAT_TA2_41", feeSched, feePeriod, hardSfSqFt + bldgSqFt, feeInv);
                    }
                }
            
                if(ifTracer(type == "Irrigation", "Irrigation")){
                    if(nonWtrSqFt) {
                        nonWtrSqFt = parseFloat(nonWtrSqFt);
                        updateFee("WAT_TA2_36", feeSched, feePeriod, nonWtrSqFt, feeInv)
                    }
                    
                    if(wtrSqFt) {
                        wtrSqFt = parseFloat(wtrSqFt);
                        updateFee("WAT_TA2_37", feeSched, feePeriod, wtrSqFt, feeInv)
                    }
                }
        } 
        else {
            logDebug("Missing AInfo: Platted after 2017");
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function script83_TapAppFees. Please contact administrator. Err: " + err);
        logDebug("Error on custom function script83_TapAppFees. Please contact administrator. Err: " + err);
        logDebug("A JavaScript Error occurred: ASA:Water/Water/Tap/Application 83: " + err.message);
        logDebug(err.stack)
    }
    
    logDebug("script83_TapAppFees ended.");
}//END script83_TapAppFees
//Script 84
//Record Types: Water/Water/SWMP/Renewal
//Event:        WorkflowTaskUpdateAfter (WTUA)
//Desc:         If the wfTask = “Permit Issued” and the wfStatus = “Completed” 
//              Then send email notification(Email Template TBD by Aurora) 
//              to Geoff(grabinow@auroragov.org) which will have details 
//              that the renewal has been approved. 
//
//      THIS SCRIPT WILL NOT BE COMPLETED UNTIL CITY HAS NOTIFICATION TEMPLATE IN PLACE, THEN CHANGE THE EMAIL ADDRESS
//   
//Created By: Silver Lining Solutions

function script84_SendRenewalEmailWhenPermitIssuedComplete() {
    logDebug("script84_SendRenewalEmailWhenPermitIssuedComplete() started.");
    try{
        // if wfTask = Permit Issued & wfStatus = Completed"
        var emailTo = getContactEmailAddress("Applicant", capId);
		if(emailTo){
            var applicantObj = getContactObjsByCap(capId, "Applicant");
            var applicantFullNam = getContactName(applicantObj[0]);
            var emailTemplate = "SWMP PERMIT RENEWAL APPROVED # 84";
            var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
            acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
            var recordURL = getACARecordURL(acaURLDefault);
            var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
            var reportFile = [];
            var emailParams = aa.util.newHashtable();
            emailParams.put("$$altID$$", capIDString);
            emailParams.put("$$ContactFullName$$", applicantFullNam);
            emailParams.put("$$acaRecordUrl$$", recordURL);
            
            var sendResult = sendNotification("noreply@aurora.gov",emailTo,"",emailTemplate,emailParams,reportFile,capID4Email);
            if (!sendResult) { logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
		}
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function script84_SendRenewalEmailWhenPermitIssuedComplete(). Please contact administrator. Err: " + err);
        logDebug("Error on custom function script84_SendRenewalEmailWhenPermitIssuedComplete(). Please contact administrator. Err: " + err);
    }
    logDebug("script84_SendRenewalEmailWhenPermitIssuedComplete() ended.");
};//END script84_SendRenewalEmailWhenPermitIssuedComplete();

/*Script 85
 * Record Types:	Water/Water/SWMP/Renewal
 * Event: 		WorkflowTaskUpdateAfter (WTUA)
 * 
 * Desc:			
 * If the workflow task “Permit Issuance” has a status of “Completed” then automatically 
 * update the parent permit (Water/Water/SWMP/Permit) with data from the current renewal 
 * record(Water/Water/SWMP/Renewal) including contacts, custom fields, application name, 
 * address and parcel.
 * 
*/

function script85_UpdateSwmpParent() {
	logDebug("script85_UpdateSwmpParent() started.");
	try{
		if (ifTracer(wfTask == "Permit Issued" && wfStatus == "Complete", 'wfTask == Permit Issued && wfStatus == Complete')) 
		{
            //get parent
            var childCapScriptModel,
                parentCapScriptModel,
                parentCapTypeString,
                parentCapId = getParentLicenseCapID(capId);

            if(ifTracer(parentCapId, 'parent found')) {
                //make sure parent is a permit (Water/Water/SWMP/Permit)
                childCapScriptModel = aa.cap.getCap(capId).getOutput();
                parentCapScriptModel = aa.cap.getCap(parentCapId).getOutput();
                parentCapTypeString = parentCapScriptModel.getCapType().toString();
                if(ifTracer(parentCapTypeString == 'Water/Water/SWMP/Permit', 'parent = Water/Water/SWMP/Permit')) {
                    // copy data from renewal to parent application
                    copyContacts(capId,parentCapId);
                    copyAppSpecific(parentCapId);
                    copyASIFields(capId,parentCapId);
                    copyASITables(capId,parentCapId);
                    copyAddresses(capId, parentCapId);
                    copyParcels(capId, parentCapId);
                    editAppName(childCapScriptModel.specialText, parentCapId);
                }
            }
 		}
	}
	catch(err){
		showMessage = true;
		comment("Error on custom function “script85_UpdateSwmpParent(). Please contact administrator. Err: " + err);
		logDebug("Error on custom function “script85_UpdateSwmpParent(). Please contact administrator. Err: " + err);
	}
	logDebug("script85_UpdateSwmpParent() ended.");
}//END script85_UpdateSwmpParent();

//script87_Link SWMP
//Record Types:	Water/Water/SWMP/Transfer
//Event: ASA- ApplicationSubmitAfter
//Desc: Automatically link the SWMP Permit record to the transfer request record 
//		by taking the value entered in the custom field SWMP Permit Number and adding the record as the parent. 

function script87_LinkSWMP() {
	
	logDebug("script87_Link SWMP started.");
	try{
		
		var gp = AInfo['SWMP Permit Number'];
		var gpc = null;
		gpc = aa.cap.getCapID(AInfo['SWMP Permit Number']).getOutput();
	
		if (!publicUser && !partialCap) {
		addParent(gpc.getCustomID());
		}

		
		
	} catch(err){
		showMessage = true;
		comment("Error on custom function script87_Link SWMP. Please contact administrator. Err: " + err);
		logDebug("script87: Error on custom function script87_Link SWMP. Please contact administrator. Err: " + err);
		logDebug("script87: A JavaScript Error occurred: ASA:Water/Water/SWMP/Transfer 133: " + err.message);
		logDebug(err.stack)
	}
	logDebug("script87_Link SWMP ended.");
//	if function is used        };//END ASA:Water/Water/SWMP/Transfer;

}


//script89_PreventInspStatus.js
//WTUB:Water/Utility/Permit/NA
//Record Types:	Water/Utility/Permit/NA
//Event: WTUB - WorkflowTaskUpdateBefore
//Desc:  When WorkFlow Utility Inspection – Complete status - Do not allow if Clearwater Inspection, super flush, pressure test do not have a result of Pass.
//Created By: Silver Lining Solutions

function script89_PreventInspStatus() {
	logDebug("script89_PreventInspStatus started.");

	if ("Utility Inspection".equals(wfTask) && "Completed".equals(wfStatus)) {
		var clearInspectionPassed = false;
		var hydroInspectionPassed = false;
		var superInspectionPassed = false;
		var inspResultObj = aa.inspection.getInspections(capId);
		if (inspResultObj.getSuccess()) {
			var inspList = inspResultObj.getOutput();
			for (index in inspList) {
				if (inspList[index].getInspectionType().toUpperCase().indexOf("CLEARWATER") >= 0
					 && matches(inspList[index].getInspectionStatus().toUpperCase(), "PASSED", "PASS", "COMPLETE", "CANCELLED")) {
					clearInspectionPassed = true;
				}
				if (inspList[index].getInspectionType().toUpperCase().indexOf("SUPER FLUSH") >= 0
					 && matches(inspList[index].getInspectionStatus().toUpperCase(), "PASSED", "PASS", "COMPLETE", "CANCELLED")) {
					superInspectionPassed = true;
				}
				if (inspList[index].getInspectionType().toUpperCase().indexOf("HYDROSTATIC PRESSURE TEST") >= 0
					 && matches(inspList[index].getInspectionStatus().toUpperCase(), "PASSED", "PASS", "COMPLETE", "CANCELLED")) {
					hydroInspectionPassed = true;
				}
			}
		}

		if (!clearInspectionPassed || !hydroInspectionPassed || !superInspectionPassed) {
			cancel = true;
			showMessage = true;
			comment("Task cannot be completed until the Clearwater, super flush, pressure test Inspection has been approved");
		}
	}
	logDebug("script89_PreventInspStatus ended.");

}


function sendEmail(emailTemplate) {
    //Get the Applicant
    var recordApplicant = getContactByType("Applicant", capId);

    if (!recordApplicant || recordApplicant.getEmail() == null || recordApplicant.getEmail() == "") {
        logDebug("**WARN no applicant or applicant has no email, capId=" + capId);
    } else {
        applicantEmail = recordApplicant.getEmail();
        var files = new Array();
        var eParams = aa.util.newHashtable();
        addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
        addParameter(eParams, "$$recordAlias$$", cap.getCapModel().getCapType().getAlias());
        addParameter(eParams, "$$recordStatus$$", cap.getCapModel().getCapStatus());
        addParameter(eParams, "$$balance$$", feeBalance(""));
        addParameter(eParams, "$$PaymentDate$$", PaymentDate);
        addParameter(eParams, "$$PaymentTotalPaidAmount$$", PaymentTotalPaidAmount);
        addParameter(eParams, "$$balanceDue$$", balanceDue);
        var sent = aa.document.sendEmailByTemplateName("", applicantEmail, "", emailTemplate, eParams, files);
        if (!sent.getSuccess()) {
            logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
        }
    }
}

/*function sendEmail(emailTemplate) {
    //Get the Applicant
    var recordApplicant = getContactByType("Applicant", capId);

    if (!recordApplicant || recordApplicant.getEmail() == null || recordApplicant.getEmail() == "") {
        logDebug("**WARN no applicant or applicant has no email, capId=" + capId);
    } else {
        applicantEmail = recordApplicant.getEmail();
        var files = new Array();
        var eParams = aa.util.newHashtable();
        addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
        addParameter(eParams, "$$recordAlias$$", cap.getCapModel().getCapType().getAlias());
        addParameter(eParams, "$$recordStatus$$", cap.getCapModel().getCapStatus());
        addParameter(eParams, "$$balance$$", feeBalance(""));
        addParameter(eParams, "$$PaymentDate$$", PaymentDate);
        addParameter(eParams, "$$PaymentTotalPaidAmount$$", PaymentTotalPaidAmount);
        addParameter(eParams, "$$balanceDue$$", balanceDue);
        var sent = aa.document.sendEmailByTemplateName("", applicantEmail, "", emailTemplate, eParams, files);
        if (!sent.getSuccess()) {
            logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
        }
    }
}
*/

function sendEmail(emailTemplate) {
    //Get the Applicant
    var recordApplicant = getContactByType("Applicant", capId);

    if (!recordApplicant || recordApplicant.getEmail() == null || recordApplicant.getEmail() == "") {
        logDebug("**WARN no applicant or applicant has no email, capId=" + capId);
    } else {
        applicantEmail = recordApplicant.getEmail();
        // Get cc emails from other contacts and owners, make sure that the applicant email is not in the cc emails
        var cc = getCCs(applicantEmail);
        var files = new Array();
        var eParams = aa.util.newHashtable();
        addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
        addParameter(eParams, "$$recordAlias$$", cap.getCapModel().getCapType().getAlias());
        addParameter(eParams, "$$recordStatus$$", cap.getCapModel().getCapStatus());
        addParameter(eParams, "$$balance$$", feeBalance(""));
        addParameter(eParams, "$$wfTask$$", wfTask);
        addParameter(eParams, "$$wfStatus$$", wfStatus);
        addParameter(eParams, "$$wfDate$$", wfDate);
        if (wfComment != null && typeof wfComment !== 'undefined') {
            addParameter(eParams, "$$wfComment$$", wfComment);
        }
        addParameter(eParams, "$$wfStaffUserID$$", wfStaffUserID);
        addParameter(eParams, "$$wfHours$$", wfHours);

        var sent = aa.document.sendEmailByTemplateName("", applicantEmail, cc, emailTemplate, eParams, files);
        if (!sent.getSuccess()) {
            logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
        }
    }
}

/**
 * 
 * @param InspectionType the insp type that need to be checked
 * @param checkListItem1 the check list item that need to be checked 
 * @param checkListItem2 the check list item that need to be checked 
 * @param checkListItemValue the check list item value that need to be checked 
 * @param emailTemplate email template
 * @param emailAddress email address
 */
function sendEmailBasedOnInspectionResult(InspectionType, checkListItem1, checkListItem2, checkListItemValue, emailTemplate, emailAddress) {
	var itemComment1 = "";
	var itemComment2 = "";
	for (i in InspectionType) {
		if (inspResult != null && inspResult != "" && inspType == InspectionType[i]) {
			var Insp = inspObj.getIdNumber();
			if (inspObj.getInspectionType().equalsIgnoreCase(InspectionType[i])) {
				var objeclist = getGuideSheetObjects(Insp);
				for ( var ob in objeclist) {
					if (objeclist[ob].text.equalsIgnoreCase(checkListItem1)) {
						if (objeclist[ob].status.equalsIgnoreCase(checkListItemValue)) {
							itemComment1 = objeclist[ob].comment;
						}
					}
					if (objeclist[ob].text.equalsIgnoreCase(checkListItem2)) {
						if (objeclist[ob].status.equalsIgnoreCase(checkListItemValue)) {
							itemComment2 = objeclist[ob].comment;
						}
					}
				}
			}
			break;
		}
	}//for all insp types to check

	if (itemComment1 != "" || itemComment2 != "") {
		sendEmailWithTemplate(emailTemplate, emailAddress, checkListItem1, checkListItem2, itemComment1, itemComment2);
	}
}

function sendEmailNotification(emailTemplate,reportName){
	logDebug("SendEmailNotification START");
	// Get the Applicant's email
	var recordApplicant = getContactByType("Applicant", capId);
	var applicantEmail = null;
	if (!recordApplicant || recordApplicant.getEmail() == null || recordApplicant.getEmail() == "") {
		logDebug("**WARN no applicant or applicant has no email, capId=" + capId);
	} else {
		applicantEmail = recordApplicant.getEmail();
	}
	// Get the Developer's email
	var recordDeveloper = getContactByType("Developer", capId);
	var developerEmail = null;
	if (!recordDeveloper || recordDeveloper.getEmail() == null || recordDeveloper.getEmail() == "") {
		logDebug("**WARN no developer or developer has no email, capId=" + capId);
	} else {
		developerEmail = recordDeveloper.getEmail();
	}
	
	// Get the Case Manager's email
	var caseManagerEmail=getAssignedStaffEmail();
	var caseManagerPhone=getAssignedStaffPhone();
	
	var cc="";
	if (isBlankOrNull(developerEmail)==false){
		cc=developerEmail;
	}
	if (isBlankOrNull(caseManagerEmail)==false){
		if (cc!=""){
			cc+= ";" +caseManagerEmail;
		}else{
			cc=caseManagerEmail;
		}
	}
	
	var eParams = aa.util.newHashtable();
	addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
	addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
	addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
	addParameter(eParams, "$$balance$$", feeBalance(""));
	addParameter(eParams, "$$wfTask$$", wfTask);
	addParameter(eParams, "$$wfStatus$$", wfStatus);
	addParameter(eParams, "$$wfDate$$", wfDate);
	addParameter(eParams, "$$wfComment$$", wfComment);
	addParameter(eParams, "$$wfStaffUserID$$", wfStaffUserID);
	addParameter(eParams, "$$wfHours$$", wfHours);
	addParameter(eParams, "$$StaffPhone$$", caseManagerPhone);
	addParameter(eParams, "$$StaffEmail$$", caseManagerEmail);
	
	//Based on report, fill report parameters here
	var rptParams = aa.util.newHashtable();
	rptParams.put("RECORD_MODULE", "PLANNING");
	
/*	var sent =sendEmailWithReport(applicantEmail,cc, emailTemplate, reportName, rptParams, eParams);
	if (sent==false) {
		logDebug("**WARN sending email failed");
	}*/
  
// 7/29/2018 New requirements added for script 290
// need to send notice for a Public Hearing Notice document
	vACAUrl = lookup("ACA_CONFIGS", "ACA_SITE");
    vACAUrl = vACAUrl.substr(0, vACAUrl.toUpperCase().indexOf("/ADMIN"));
    addParameter(eParams, "$$acaRecordURL$$",getACARecordURL(vACAUrl));
	var docNotFound = true;
    vDocumentList = aa.document.getDocumentListByEntity(capId, "CAP");
    if (vDocumentList != null) {
        vDocumentList = vDocumentList.getOutput();
    }
	aa.print("doc list = " + vDocumentList);
	aa.print("list size = " + vDocumentList.size());
	if (vDocumentList != null) {
		for (y = 0; y < vDocumentList.size(); y++) {
			vDocumentModel = vDocumentList.get(y);
			vDocumentCat = vDocumentModel.getDocCategory();
			aa.print("doc category = " + vDocumentCat);
			if (vDocumentCat == "Public Hearing Notice") {
				//Add the document url to the email paramaters using the name: $$acaDocDownloadUrl$$
				getACADocDownloadParam4Notification(eParams, vACAUrl, vDocumentModel);
				logDebug("including document url: " + eParams.get('$$acaDocDownloadUrl$$'));
				aa.print("including document url: " + eParams.get('$$acaDocDownloadUrl$$'));
				docNotFound = false;
				break;
			}
		}
	}
	var reportFile = [];
	var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
	var sendResult = sendNotification("noreply@aurora.gov",applicantEmail,cc,emailTemplate,eParams,reportFile,capID4Email);
	if (!sendResult) 
		{ logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
	else
		{ logDebug("Sent Notification"); }	
	logDebug("SendEmailNotification START");	
}

function sendEmailReceipt_MJApplication(){

	var applicant = getContactByType("Applicant", capId);
	if (!applicant || !applicant.getEmail()) {
		logDebug("**WARN no applicant found on or no email capId=" + capId);
		return false;
	}
	var toEmail = applicant.getEmail();
	var vStateFee;
	var vLocalFee;
	var vPayment;
	var vPayments;
	var vPaymentSeqNbr = 0;
	
	// Get all payments on the record
	vPayments = aa.finance.getPaymentByCapID(capId, null);	
	if (vPayments.getSuccess() == true) {
		vPayments = vPayments.getOutput();
		var y = 0;
		// Loop through payments to get the latest by highest SEQ number
		for (y in vPayments) {
			vPayment = vPayments[y];
			if (vPayment.getPaymentSeqNbr() > vPaymentSeqNbr) {
				vPaymentSeqNbr = vPayment.getPaymentSeqNbr();
			}
		}
		if (vPaymentSeqNbr != null && vPaymentSeqNbr != "") {
			logDebug("The latest payment has a sequence number of " + vPaymentSeqNbr);
		}
	}
	
	var feeResult = aa.fee.getFeeItems(capId);
	if (feeResult.getSuccess()) {
		var feeObjArr = feeResult.getOutput();
	} else {
		logDebug("**ERROR: getting fee items: " + capContResult.getErrorMessage());
		return false		
	}

	var ff = 0;
	//loop through fee items
	for (ff in feeObjArr) {
        var pfResult = aa.finance.getPaymentFeeItems(capId, null);
        if (pfResult.getSuccess()) {
			var pfObj = pfResult.getOutput();
			//match fee items to sequence number
			for (ij in pfObj) {
				if (feeObjArr[ff].getFeeSeqNbr() == pfObj[ij].getFeeSeqNbr() && pfObj[ij].getPaymentSeqNbr() == vPaymentSeqNbr) {
					logDebug("Debug Point 3");
					//check for state and local fees
					if (feeObjArr[ff].getFeeCod() == "LIC_MJRC_01" || feeObjArr[ff].getFeeCod() == "LIC_MJRPM_01" || feeObjArr[ff].getFeeCod() == "LIC_MJST_05" || feeObjArr[ff].getFeeCod() == "LIC_MJTST_01" || feeObjArr[ff].getFeeCod() == "LIC_MJTR_01" || feeObjArr[ff].getFeeCod() == "LIC_MJ_01") {
						logDebug("State fee is present");
						vStateFee = true;
					} else {
						logDebug("Local fee is present");
						vLocalFee = true;
					}
				}
			}
		}
	}
	
	if(vStateFee != null && vStateFee != "" && vStateFee == true) {
		var emailTemplateName = "LIC MJ STATE FEE RECEIPT";

		var eParams = aa.util.newHashtable();

		//load ASi and ASIT
		var olduseAppSpecificGroupName = useAppSpecificGroupName;
		useAppSpecificGroupName = false;
		var asiValues = new Array();
		loadAppSpecific(asiValues);
		useAppSpecificGroupName = olduseAppSpecificGroupName;
		//logDebug("State License Number: " + asiValues["State License Number"]);
			
		adResult = aa.address.getAddressByCapId(capId).getOutput(); 
		for(x in adResult) {
			var adType = adResult[x].getAddressType(); 
			var stNum = adResult[x].getHouseNumberStart();
			var preDir =adResult[x].getStreetDirection();
			var stName = adResult[x].getStreetName(); 
			var stType = adResult[x].getStreetSuffix();
			var city = adResult[x].getCity();
			var state = adResult[x].getState();
			var zip = adResult[x].getZip();
		}

		var primaryAddress = stNum + " " + preDir + " " + stName + " " + stType + " " + "," + city + " " + state + " " + zip;
		var appName = cap.getSpecialText();
		
		addParameter(eParams, "$$date$$", sysDateMMDDYYYY);
		addParameter(eParams, "$$amountPaid$$", PaymentTotalPaidAmount);
		addParameter(eParams, "$$StateLicenseNumber$$", asiValues["State License Number"]);
		addParameter(eParams, "$$TradeName$$", asiValues["Trade Name"]);
		addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
		addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
		addParameter(eParams, "$$FullAddress$$", primaryAddress);
		addParameter(eParams, "$$ApplicationName$$", appName);

		//send email
		emailWithReportLinkASync(toEmail, emailTemplateName, eParams, "", "", "N", "");
	}
	
	if(vLocalFee != null && vLocalFee != "" && vLocalFee == true) {
		var emailTemplateName = "LIC MJ FEE RECEIPT";
		var eParams = aa.util.newHashtable();

		//load ASi and ASIT
		var olduseAppSpecificGroupName = useAppSpecificGroupName;
		useAppSpecificGroupName = false;
		var asiValues = new Array();
		loadAppSpecific(asiValues);
		useAppSpecificGroupName = olduseAppSpecificGroupName;
		//logDebug("State License Number: " + asiValues["State License Number"]);
			
		adResult = aa.address.getAddressByCapId(capId).getOutput(); 
		for(x in adResult) {
			var adType = adResult[x].getAddressType(); 
			var stNum = adResult[x].getHouseNumberStart();
			var preDir =adResult[x].getStreetDirection();
			var stName = adResult[x].getStreetName(); 
			var stType = adResult[x].getStreetSuffix();
			var city = adResult[x].getCity();
			var state = adResult[x].getState();
			var zip = adResult[x].getZip();
		}

		var primaryAddress = stNum + " " + preDir + " " + stName + " " + stType + " " + "," + city + " " + state + " " + zip;
		var appName = cap.getSpecialText();
		
		addParameter(eParams, "$$date$$", sysDateMMDDYYYY);
		addParameter(eParams, "$$amountPaid$$", PaymentTotalPaidAmount);
		addParameter(eParams, "$$StateLicenseNumber$$", asiValues["State License Number"]);
		addParameter(eParams, "$$TradeName$$", asiValues["Trade Name"]);
		addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
		addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
		addParameter(eParams, "$$FullAddress$$", primaryAddress);
		addParameter(eParams, "$$ApplicationName$$", appName);

		//send email
		emailWithReportLinkASync(toEmail, emailTemplateName, eParams, "", "", "N", "");
	}
}
function sendEmailReceipt_MJApplication_PAPA(){

	var applicant = getContactByType("Applicant", capId);
	if (!applicant || !applicant.getEmail()) {
		logDebug("**WARN no applicant found on or no email capId=" + capId);
		return false;
	}
	var toEmail = applicant.getEmail();
	var vStateFee;
	var vLocalFee;
	var vPayment;
	var vPayments;
	var vPaymentSeqNbr = 0;

	var feeResult = aa.fee.getFeeItems(capId);
	if (feeResult.getSuccess()) {
		var feeObjArr = feeResult.getOutput();
	} else {
		logDebug("**ERROR: getting fee items: " + capContResult.getErrorMessage());
		return false		
	}

	//loop through fee items
	for (ff in feeSeqArr) {
			//match fee items to sequence number
			for (ij in feeObjArr) {
				if (feeSeqArr[ff] == feeObjArr[ij].getFeeSeqNbr() && appliedAmountArr[ff] > 0) {
					logDebug("Debug Point 3");
					//check for state and local fees
					if (feeObjArr[ij].getFeeCod() == "LIC_MJRC_01" || feeObjArr[ij].getFeeCod() == "LIC_MJRPM_01" || feeObjArr[ij].getFeeCod() == "LIC_MJST_05" || feeObjArr[ij].getFeeCod() == "LIC_MJTST_01" || feeObjArr[ij].getFeeCod() == "LIC_MJTR_01" || feeObjArr[ij].getFeeCod() == "LIC_MJ_01") {
						logDebug("State fee is present");
						vStateFee = true;
					} else {
						logDebug("Local fee is present");
						vLocalFee = true;
					}
				}
			}
	}
	
	if(vStateFee != null && vStateFee != "" && vStateFee == true) {
		var emailTemplateName = "LIC MJ STATE FEE RECEIPT";

		var eParams = aa.util.newHashtable();

		//load ASi and ASIT
		var olduseAppSpecificGroupName = useAppSpecificGroupName;
		useAppSpecificGroupName = false;
		var asiValues = new Array();
		loadAppSpecific(asiValues);
		useAppSpecificGroupName = olduseAppSpecificGroupName;
		//logDebug("State License Number: " + asiValues["State License Number"]);
			
		adResult = aa.address.getAddressByCapId(capId).getOutput(); 
		for(x in adResult) {
			var adType = adResult[x].getAddressType(); 
			var stNum = adResult[x].getHouseNumberStart();
			var preDir =adResult[x].getStreetDirection();
			var stName = adResult[x].getStreetName(); 
			var stType = adResult[x].getStreetSuffix();
			var city = adResult[x].getCity();
			var state = adResult[x].getState();
			var zip = adResult[x].getZip();
		}

		var primaryAddress = stNum + " " + preDir + " " + stName + " " + stType + " " + "," + city + " " + state + " " + zip;
		var appName = cap.getSpecialText();
		
		addParameter(eParams, "$$date$$", sysDateMMDDYYYY);
		addParameter(eParams, "$$amountPaid$$", "");
		addParameter(eParams, "$$StateLicenseNumber$$", asiValues["State License Number"]);
		addParameter(eParams, "$$TradeName$$", asiValues["Trade Name"]);
		addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
		addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
		addParameter(eParams, "$$FullAddress$$", primaryAddress);
		addParameter(eParams, "$$ApplicationName$$", appName);

		//send email
		emailWithReportLinkASync(toEmail, emailTemplateName, eParams, "", "", "N", "");
	}
	
	if(vLocalFee != null && vLocalFee != "" && vLocalFee == true) {
		var emailTemplateName = "LIC MJ FEE RECEIPT";
		var eParams = aa.util.newHashtable();

		//load ASi and ASIT
		var olduseAppSpecificGroupName = useAppSpecificGroupName;
		useAppSpecificGroupName = false;
		var asiValues = new Array();
		loadAppSpecific(asiValues);
		useAppSpecificGroupName = olduseAppSpecificGroupName;
		//logDebug("State License Number: " + asiValues["State License Number"]);
			
		adResult = aa.address.getAddressByCapId(capId).getOutput(); 
		for(x in adResult) {
			var adType = adResult[x].getAddressType(); 
			var stNum = adResult[x].getHouseNumberStart();
			var preDir =adResult[x].getStreetDirection();
			var stName = adResult[x].getStreetName(); 
			var stType = adResult[x].getStreetSuffix();
			var city = adResult[x].getCity();
			var state = adResult[x].getState();
			var zip = adResult[x].getZip();
		}

		var primaryAddress = stNum + " " + preDir + " " + stName + " " + stType + " " + "," + city + " " + state + " " + zip;
		var appName = cap.getSpecialText();
		
		addParameter(eParams, "$$date$$", sysDateMMDDYYYY);
		addParameter(eParams, "$$amountPaid$$", "");
		addParameter(eParams, "$$StateLicenseNumber$$", asiValues["State License Number"]);
		addParameter(eParams, "$$TradeName$$", asiValues["Trade Name"]);
		addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
		addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
		addParameter(eParams, "$$FullAddress$$", primaryAddress);
		addParameter(eParams, "$$ApplicationName$$", appName);

		//send email
		emailWithReportLinkASync(toEmail, emailTemplateName, eParams, "", "", "N", "");
	}
}
function sendEmailWithReport(ownerEmail, applicantEmail, emailTemplateName, reportName, rptParams, emailParams) {

	var report = aa.reportManager.getReportInfoModelByName(reportName);
	if (report == null) {
		logDebug("**WARN getReportInfoModelByName() returned NULL, reportType=" + reportName);
		return false;
	}
	if (report.getSuccess()) {
		var reportFiles = new Array();

		report = report.getOutput();
		report.setModule(cap.getCapModel().getModuleName());
		report.setCapId(capId.getID1() + "-" + capId.getID2() + "-" + capId.getID3());
		report.setReportParameters(rptParams);

		var hasPerm = aa.reportManager.hasPermission(reportName, aa.getAuditID());
		if (hasPerm.getSuccess() && hasPerm.getOutput().booleanValue()) {
			var reportResult = aa.reportManager.getReportResult(report);
			if (reportResult.getSuccess()) {
				reportResult = reportResult.getOutput();
				var reportFile = aa.reportManager.storeReportToDisk(reportResult);
				if (reportFile.getSuccess()) {
					reportFile = reportFile.getOutput();
					reportFiles.push(reportFile);
				} else {
					logDebug("**WARN storeReportToDisk() failed: " + reportFile.getErrorMessage());
				}
			}//report result OK
		}//has permission

		var altIDScriptModel = aa.cap.createCapIDScriptModel(capId.getID1(), capId.getID2(), capId.getID3());
		var sent = aa.document.sendEmailAndSaveAsDocument("", ownerEmail, applicantEmail, emailTemplateName, emailParams, altIDScriptModel, reportFiles);
		if (!sent.getSuccess()) {
			logDebug("**WARN send email failed, Error: " + sent.getErrorMessage());
		}
	} else {//report OK
		logDebug("**WARN getReportInfoModelByName() failed: " + report.getErrorMessage());
	}
}


/**
 *  
 * @param emailTemplate email template
 * @param emailAddress email address	
 * @param checkListItem1 check list item to include it in the template
 * @param checkListItem2 check list item to include it in the template
 * @param itemComment1 check list item comment to include it in the template
 * @param itemComment2  check list item comment to include it in the template
 * @returns {Boolean} returns true if the email has been send otherwise will return false 
 */
function sendEmailWithTemplate(emailTemplate, emailAddress, checkListItem1, checkListItem2, itemComment1, itemComment2) {

	var files = new Array();
	var eParams = aa.util.newHashtable();
	addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
	addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
	addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
	addParameter(eParams, "$$inspType$$", inspType);
	addParameter(eParams, "$$inspResult$$", inspResult);
	addParameter(eParams, "$$checkListItem1$$", checkListItem1 + "Comment : " + itemComment1);
	addParameter(eParams, "$$checkListItem2$$", checkListItem2 + "Comment : " + itemComment2);

	var sent = aa.document.sendEmailByTemplateName("", emailAddress, "", emailTemplate, eParams, files);
	if (!sent.getSuccess()) {
		logDebug("**ERROR sending email failed, error:" + sent.getErrorMessage());
		return false;
	}
	return true;

}

function sendHearingScheduledEmailAndUpdateASI(workFlowTaskToCheck, workflowStatusArray, meetingType, asiFieldName, emailTemplate) {
	logDebug("sendHearingScheduledEmailAndUpdateASI() started.");
	if (cap.getCapModel().getCapType().getSubType().equalsIgnoreCase("Address")) {
		return false;
	}

	if (wfTask == workFlowTaskToCheck) {
		var statusMatch = false;

		for (s in workflowStatusArray) {
			if (wfStatus == workflowStatusArray[s]) {
				statusMatch = true;
				break;
			}
		}//for all status options

		if (!statusMatch) {
			return false;
		}

		logDebug("worklow matches: " + workFlowTaskToCheck + "/" + workflowStatusArray);
		//Update ASI
		var meetings = aa.meeting.getMeetingsByCAP(capId, true);
		if (!meetings.getSuccess()) {
			logDebug("**ERROR could not get meeting capId=" + capId + " error:" + meetings.getErrorMessage());
			return;
		}
		meetings = meetings.getOutput().toArray();
		for (m in meetings) {
			logDebug("meeting " + m);
			if (meetings[m].getMeeting().getMeetingType() != null && meetings[m].getMeeting().getMeetingType().equalsIgnoreCase(meetingType)) {
				logDebug("meetingType matches: " + meetingType);
				//Edit ASI
				var meetingDate = new Date(meetings[m].getMeeting().getStartDate().getTime());
				//meetingDate = dateAdd(meetingDate, 0);
				meetingDate = aa.util.formatDate(meetingDate, "MM/dd/YYYY");
				var olduseAppSpecificGroupName = useAppSpecificGroupName;
				useAppSpecificGroupName = false;
				editAppSpecific(asiFieldName, meetingDate);
				logDebug("ASI " + asiFieldName);
				var noOfSigns = getAppSpecific("Number of Signs");
				useAppSpecificGroupName = olduseAppSpecificGroupName;
				
				if(noOfSigns == undefined || noOfSigns == null || noOfSigns == "") noOfSigns = "";

				//Send email
				var recordApplicant = getContactByType("Applicant", capId);
				var applicantEmail = null;
				if (!recordApplicant || recordApplicant.getEmail() == null || recordApplicant.getEmail() == "") {
					logDebug("**WARN no applicant or applicant has no email, capId=" + capId);
				} else {
					applicantEmail = recordApplicant.getEmail();
				}
				//06/19 - Concatenate first and last name
		        var firstName = recordApplicant.getFirstName();   
		        var middleName =recordApplicant.getMiddleName();   
		        var lastName = recordApplicant.getLastName(); 
		        var fullName = buildFullName(firstName, middleName,lastName);
                
		        // Get the Case Manager's email
		        var caseManagerEmail=getAssignedStaffEmail();
		        var caseManagerPhone=getAssignedStaffPhone();
		        var caseManagerFullName=getAssignedStaffFullName();
		        var caseManagerTitle=getAssignedStaffTitle();
					
					if(isBlankOrNull(caseManagerEmail)==true) caseManagerEmail = "";
					var files = new Array();
				//prepare Deep URL:
				var acaSiteUrl = lookup("ACA_CONFIGS", "ACA_SITE");
				var subStrIndex = acaSiteUrl.toUpperCase().indexOf("/ADMIN");
				var acaCitizenRootUrl = acaSiteUrl.substring(0, subStrIndex);
				var deepUrl = "/urlrouting.ashx?type=1000";
				deepUrl = deepUrl + "&Module=" + cap.getCapModel().getModuleName();
				deepUrl = deepUrl + "&capID1=" + capId.getID1();
				deepUrl = deepUrl + "&capID2=" + capId.getID2();
				deepUrl = deepUrl + "&capID3=" + capId.getID3();
				deepUrl = deepUrl + "&agencyCode=" + aa.getServiceProviderCode();
				deepUrl = deepUrl + "&HideHeader=true";
				var recordDeepUrl = acaCitizenRootUrl + deepUrl;
				var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
				var reportFile = [];

					var eParams = aa.util.newHashtable();
					addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
					addParameter(eParams, "$$ContactEmail$$", applicantEmail);
					addParameter(eParams, "$$ContactFullName$$", fullName);
					addParameter(eParams, "$$pcDate$$", meetingDate);
					addParameter(eParams, "$$10dayspriortopcDate$$", dateAdd(meetingDate, -10));
					addParameter(eParams, "$$numberofSigns$$", noOfSigns);
					addParameter(eParams, "$$StaffPhone$$", caseManagerPhone);
					addParameter(eParams, "$$StaffEmail$$", caseManagerEmail);
					addParameter(eParams, "$$StaffFullName$$", caseManagerFullName);
		            addParameter(eParams, "$$StaffTitle$$",caseManagerTitle);
					addParameter(eParams, "$$recordDeepUrl$$", recordDeepUrl);
					if (wfComment != null && typeof wfComment !== 'undefined') {
						addParameter(eParams, "$$wfComment$$", wfComment);
					}
					addParameter(eParams, "$$wfStaffUserID$$", wfStaffUserID);
					addParameter(eParams, "$$wfHours$$", wfHours);

					var sendResult = sendNotification("noreply@aurora.gov",applicantEmail, "",emailTemplate, eParams,reportFile,capID4Email);
					if (!sendResult) 
					{ logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
									
				//}//applicant OK
				//return true;
			}//meetingType match
		}//for all meetings
		//logDebug("**WARN no meeting of type=" + meetingType + " capId=" + capId);
		return false;
	} else {
		return false;
	}
	return true;
}

/**
 * Check Check if workflow status and workflow task matches arguments, send email to Applicant
 * @param workFlowTask
 * @param workflowStatusArray
 * @param emailTemplate
 * @returns {Boolean} true if task name and status matches, false if error
 */
function sendIncompleteApplicationEmail(workFlowTask, workflowStatusArray, emailTemplate) {
	if (wfTask == workFlowTask) {

		var statusMatch = false;

		for (s in workflowStatusArray) {
			if (wfStatus == workflowStatusArray[s]) {
				statusMatch = true;
				break;
			}
		}//for all status options

		if (!statusMatch) {
			return false;
		}

		//send email
		var applicant = getContactByType("Applicant", capId);
		if (!applicant || !applicant.getEmail()) {
			logDebug("**WARN no applicant found on or no email capId=" + capId);
			return false;
		}
		var toEmail = applicant.getEmail();
		var files = new Array();

		var eParams = aa.util.newHashtable();
		addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
		addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
		addParameter(eParams, "$$balance$$", feeBalance(""));
		addParameter(eParams, "$$wfTask$$", wfTask);
		addParameter(eParams, "$$wfStatus$$", wfStatus);
		addParameter(eParams, "$$wfDate$$", wfDate);
		if (typeof wfComment !== 'undefined' && wfComment != null && wfComment != "") {
			addParameter(eParams, "$$wfComment$$", wfComment);
		}
		addParameter(eParams, "$$wfStaffUserID$$", wfStaffUserID);
		addParameter(eParams, "$$wfHours$$", wfHours);

		var sent = aa.document.sendEmailByTemplateName("", toEmail, "", emailTemplate, eParams, files);
		if (!sent.getSuccess()) {
			logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
			return false;
		}
		return true;
	} else {
		return false;
	}
}

function sendMeetingConfirmationEmail(workFlowTask, workflowStatusArray, emailTemplate) {

	if (wfTask == workFlowTask) {

		var statusMatch = false;

		for (s in workflowStatusArray) {
			if (wfStatus == workflowStatusArray[s]) {
				statusMatch = true;
				break;
			}
		}//for all status options

		if (!statusMatch) {
			return false;
		}

		//deprecated email functionality
		/*var toEmail = "";
		var responsibleParty = getContactByType("Responsible Party", capId);
		if (!responsibleParty || !responsibleParty.getEmail()) {
			logDebug("**WARN no 'Responsible Party' found or has no email capId=" + capId);
		} else {
			toEmail = responsibleParty.getEmail();
		}

		var consultant = getContactByType("Consultant", capId);
		if (!consultant || !consultant.getEmail()) {
			logDebug("**WARN no 'Consultant' found or has no capId=" + capId);
		} else {
			if (toEmail != "") {
				toEmail += ";";
			}
			toEmail += consultant.getEmail();
		}*/

		var asiValues = new Array();
		if (useAppSpecificGroupName) {
			var olduseAppSpecificGroupName = useAppSpecificGroupName;
			useAppSpecificGroupName = false;
			loadAppSpecific(asiValues);
			useAppSpecificGroupName = olduseAppSpecificGroupName;
		} else {
			asiValues = AInfo;
		}

		//var ccEmail = "";
		
		var vODAProjectCoordinator = getAppSpecific("ODA Project Coordinator");
		var vODAPCUserID = lookup("ODA_PC", vODAProjectCoordinator);
		var vODAPCEmail = getUserEmail(vODAPCUserID);
		
		var vODAProjectManager = getAppSpecific("ODA Project Manager");
		var vODAPMUserID = lookup("ODA_PM", vODAProjectManager);
		var vODAPMEmail = getUserEmail(vODAPMUserID);
		
		/*var projectCoord = asiValues["ODA Project Coordinator"];
		var projectMan = asiValues["ODA Project Manager"];
		
		if (projectCoord != null && projectCoord != "") {
			var fullName = projectCoord.split(" ");
			var contact = aa.people.getPeopleByFMLName(fullName[0], "", fullName[1]);
			if (contact.getSuccess()) {
				if (contact.getOutput() != null) {
					var peop = contact.getOutput();
					if (peop.length > 0) {
						ccEmail += peop[0].getEmail();
					}
				}
			}
		}
		if (projectMan != null && projectMan != "") {
			if (ccEmail != "") {
				ccEmail += ";";
			}
			var fullName = projectMan.split(" ");
			var contact = aa.people.getPeopleByFMLName(fullName[0], "", fullName[1]);
			if (contact.getSuccess()) {
				if (contact.getOutput() != null) {
					var peop = contact.getOutput();
					if (peop.length > 0) {
						ccEmail += peop[0].getEmail();
					}
				}
			}
		}*/
		
		
		var eParams = aa.util.newHashtable();
		addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(eParams, "$$capAlias$$", cap.getCapType().getAlias());
		addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
		addParameter(eParams, "$$balance$$", feeBalance(""));
		addParameter(eParams, "$$wfTask$$", wfTask);
		addParameter(eParams, "$$wfStatus$$", wfStatus);
		addParameter(eParams, "$$wfDate$$", wfDate);
		addParameter(eParams, "$$wfComment$$", wfComment);
		addParameter(eParams, "$$wfStaffUserID$$", wfStaffUserID);
		addParameter(eParams, "$$wfHours$$", wfHours);
		addParameter(eParams, "$$ODACoordinatorEmail$$", vODAPCEmail);
		addParameter(eParams, "$$ODAProjectManagerEmail$$", vODAPMEmail);
		addParameter(eParams, "$$todayDate$$", dateAdd(null, 0));

		emailContactsWithReportLinkASync("Responsible Party,Consultant", emailTemplate, eParams, "", "", "N", "");
		
		/*var sent = aa.document.sendEmailByTemplateName("", toEmail, ccEmail, emailTemplate, eParams, null);
		if (!sent.getSuccess()) {
			logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
		}*/
	} else {
		return false;
	}

	return true;
}
//Scripts 226, 227
function sendMJLicEmail(itemCap){
    logDebug("sendMJLicEmail() started.");
    try{
        var asiValues = new Array();
        loadAppSpecific(asiValues); 
        var adResult = aa.address.getAddressByCapId(capId).getOutput(); 
        for(x in adResult)
        {
            var adType = adResult[x].getAddressType(); 
            var stNum = adResult[x].getHouseNumberStart();
            var preDir =adResult[x].getStreetDirection();
            var stName = adResult[x].getStreetName(); 
            var stType = adResult[x].getStreetSuffix();
            var city = adResult[x].getCity();
            var state = adResult[x].getState();
            var zip = adResult[x].getZip();
        }
        var primaryAddress = stNum + " " + preDir + " " + stName + " " + stType + " " + "," + city + " " + state + " " + zip;
        var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
        acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
        var recordDeepUrl = getACARecordURL(acaURLDefault);
    
        var vEmailTemplate = "LIC MJ APPROVAL OF LICENSE #226 - 230";
        var vReportTemplate = "MJ_License";
        var vEParams = aa.util.newHashtable();
        addParameter(vEParams, "$$ApplicationName$$", appTypeAlias);
        addParameter(vEParams, "$$recordAlias$$", appTypeAlias);
        addParameter(vEParams, "$$wfComment$$", wfComment);
        addParameter(vEParams, "$$StateLicenseNumber$$", asiValues["State License Number"]);  
        addParameter(vEParams, "$$TradeName$$", asiValues["Trade Name"]);
        addParameter(vEParams, "$$FullAddress$$", primaryAddress); 
        addParameter(vEParams, "$$acaRecordUrl$$", recordDeepUrl);

        var vRParams = aa.util.newHashtable();
        addParameter(vRParams, "Record_ID", itemCap.getCustomID());
        
        emailContactsWithReportLinkASync("Applicant,Responsible Party", vEmailTemplate, vEParams, vReportTemplate, vRParams, null, null, itemCap);
        //emailContactsWithReportLinkASync("Applicant,Responsible Party", emailTemplate, eParams, "", "", "N", "");
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function sendMJLicEmail(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function sendMJLicEmail(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("sendMJLicEmail() ended.");
}//END sendMJLicEmail()
function sendNoticePCEmail(){
//use the correct wftask name
if (wfTask.indexOf("Prepare Signs and Notice") == 0 && wfStatus=="Complete"){
	//Please use the correct email template name & report name
	var emailTemplate="PLN PREPARE SIGNS #290";
	var reportName="WorkFlowTasksOverdue";
	sendEmailNotification(emailTemplate,reportName);
	}
}

/**
 * * If the workflow status = "Issued" and the "Code Reference" custom field is empty, then update the "Code Reference"
 *   field with the value "2015 I-Codes/Aurora Muni Codes/2017-NEC".
 * @returns {void} 
 */

function setCodeReference(wfStatusCompare) {
    var $iTrc = ifTracer;
    logDebug("setCodeReference() started");
    //In case the permit is issued from other event, we hard code the task and status.
    if(vEventName != "WorkflowTaskUpdateAfter"){
        logDebug("Event name is not WTUA");
        wfStatus = wfStatusCompare;
    }
	
    if ($iTrc(wfStatus == wfStatusCompare, 'wfStatus == ' + wfStatusCompare)) {
        var codeRefVal = getAppSpecific("Code Reference");
        if ($iTrc(isEmpty(codeRefVal), 'isEmpty(codeRefVal)')) {
            editAppSpecific("Code Reference", "2015 I-Codes/Aurora Muni Codes/2017-NEC");
        }
    }
    logDebug("setCodeReference() ended.");
}

function setEAgendaDueDate(workFlowTask, workflowStatusArray, wfTaskToUpdate, meetingType) {

	if (wfTask == workFlowTask) {

		var statusMatch = false;

		for (s in workflowStatusArray) {
			if (wfStatus == workflowStatusArray[s]) {
				statusMatch = true;
				break;
			}
		}//for all status options

		if (!statusMatch) {
			return false;
		}

		activateTask(wfTaskToUpdate);
		
		var meetings = aa.meeting.getMeetingsByCAP(capId, true);
		if (!meetings.getSuccess()) {
			logDebug("**WARN could not get meetings capId=" + capId + " error:" + meetings.getErrorMessage());
			return false;
		}
		meetings = meetings.getOutput().toArray();
		for (m in meetings) {
			if (meetings[m].getMeeting().getMeetingType() != null && meetings[m].getMeeting().getMeetingType().equalsIgnoreCase(meetingType)) {
				var meetingDate = new Date(meetings[m].getMeeting().getStartDate().getTime());
				var prev15 = getPrevWorkingDays(meetingDate, 15);
				var prev20 = getPrevWorkingDays(meetingDate, 20);
				prev15 = aa.util.formatDate(prev15, "MM/dd/YYYY");
				prev20 = aa.util.formatDate(prev20, "MM/dd/YYYY");
				editTaskDueDate(wfTaskToUpdate, prev15);
				updateTaskAssignedDate(wfTaskToUpdate,prev20);
	            //logDebug("Prev 20: " + prev20);
				break;//stop meetings loop
			}//meeting found
		}//for all meetings
	} else {
		return false;
	}
	return true;

	
}

function setTaskItemStartTime(wfstr, dateStr){
    //Optional parameter capId
    //Optional parameter processName
    var useProcess = false;
    var processName = "";
    if (arguments.length == 4){
        processName = arguments[3]; // subprocess
        useProcess = true;
    }
    
    var itemCap = capId
    if(arguments.length == 3) itemCap == arguments[2];
    
    var workflowResult = aa.workflow.getTaskItems(itemCap, wfstr, processName, null, null, null);
    
    var workflowResult = aa.workflow.getTaskItems(capId, wfstr, processName, null, null, null);
    if (workflowResult.getSuccess())
        var wfObj = workflowResult.getOutput();
    else
        { logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage()); return false; }
    
    var retVal = new Date(String(dateStr));
    if (retVal.toString().equals("Invalid Date")){
        logDebug("WARNING: Unable to set start date on workflow task " + wfstr + ". " + dateStr + " is invalid.");
        return retVal;
    }
    
    for (i in wfObj) {
        var fTask = wfObj[i];
        if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
            var stepnumber = fTask.getStepNumber();
            var processID = fTask.getProcessID();
            var completeFlag = fTask.getCompleteFlag();

			fTask.setStartTime(aa.util.now());
            /*if (useProcess) {
                aa.workflow.adjustTask(itemCap, stepnumber, processID, "Y", "N", null, null)
            } else {
                aa.workflow.adjustTask(itemCap, stepnumber, "Y", "N", null, null)
            }*/
			var fTaskModel = fTask.getTaskItem();
			var tResult = aa.workflow.adjustTaskWithNoAudit(fTaskModel);
			if (tResult.getSuccess())
				logDebug("Set Workflow Task: " + fTask.getTaskDescription() + " start date " + dateStr);
			else {
				logMessage("**ERROR: Failed to update due date on workflow: " + tResult.getErrorMessage());
				return false;
			}
            //logDebug("Setting start date for task " + wfstr + " to " + dateStr);
        }
    }
}
function setWFStatusAndActivate(sName){
	var workflowResult = aa.workflow.getTaskItems(capId, "", "", null, null, null);
	if (workflowResult.getSuccess())
		wfObj = workflowResult.getOutput();
	   
	else {
		logDebug("**ERROR: Failed to get workflow object: " , s_capResult.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		var fTask = wfObj[i];
		var wStaus="Resubmittal Requested";
		if ((fTask.getDisposition() != null && fTask.getDisposition().toUpperCase().equals(wStaus.toUpperCase())> 0)) {
			var dispositionDate = aa.date.getCurrentDate();
			var stepnumber = fTask.getStepNumber();
			//activate task
			var tResult =aa.workflow.adjustTask(capId, stepnumber, "Y", "N", null, null);
			if (tResult.getSuccess()){
				logDebug("Activated Workflow Task: " , fTask.getTaskDescription());
			}
			// update task status
			var uResult=aa.workflow.handleDisposition(capId, stepnumber,sName, dispositionDate, "", "Updated by Script", systemUserObj, "U");
			if (uResult.getSuccess()){
				logDebug("Set Workflow Task: " + fTask.getTaskDescription(), " Status to : Resubmittal Received");
			}
			
		}
	}
	return true;
}

/**
 * 
 * @param inspectionType
 * @param inspectionResultArray
 * @param checkListItemName
 * @param asitFieldName
 * @param schedTypeIfChecked
 * @param schedTypeIfNotChecked
 * @param department 6-levels department to assign inspection to
 * @returns {Boolean}
 */
function stumpGrindInspectionScheduling(inspectionType, inspectionResultArray, checkListItemName, asitFieldName, schedTypeIfChecked, schedTypeIfNotChecked, department) {
	logDebug("Begin Script 379");

	if (inspType == inspectionType) {
		var resultMatched = false;
		var asiFieldValue = null;		
		for (s in inspectionResultArray) {
			if (inspResult == inspectionResultArray[s]) {
				resultMatched = true;
				break;
			}
		}//for all status options

		if (!resultMatched) {
			return false;
		}

		//get checkListItemName value and asitFieldName value:
		var guideSheetsAry = getGuideSheetObjects(inspId);
		if (!guideSheetsAry || guideSheetsAry.length == 0) {
			logDebug("**WARN getGuideSheetObjects failed, capId=" + capId);
		} else {
			for (g in guideSheetsAry) {
				if (guideSheetsAry[g].gsType == "FORESTRY INSPECTOR" && guideSheetsAry[g].text == checkListItemName) {
					resultMatched = (String(guideSheetsAry[g].status).toLowerCase() == "yes");
					guideSheetsAry[g].loadInfo();
					for(i in guideSheetsAry[g].info) {
						if(guideSheetsAry[g].info[i] != null) {
							asiFieldValue = guideSheetsAry[g].info[i];
						} else {
							asiFieldValue = "NOT CHECKED";
						}
					}
					logDebug("Successfully retrieved checklist and ASI value");
					aa.print(asitFieldName + "=" + asiFieldValue);
				}
			}
		}

		if (!resultMatched) {
			return false;
		}
	
		var inspToSched = null;
		if (asiFieldValue && asiFieldValue != null && asiFieldValue == "CHECKED") {
			inspToSched = schedTypeIfChecked;
			logDebug("Scheduled inspection type " + schedTypeIfChecked);
		} else {
			inspToSched = schedTypeIfNotChecked;
			logDebug("Scheduled inspection type " + schedTypeIfNotChecked);
		}

		//Schedule Inspection and assign to department
		var user = aa.people.getSysUserModel();
		user.setServiceProviderCode(aa.getServiceProviderCode());
		var deptLevels = department.split("/");
		user.setAgencyCode(deptLevels[0]);
		user.setBureauCode(deptLevels[1]);
		user.setDivisionCode(deptLevels[2]);
		user.setSectionCode(deptLevels[3]);
		user.setGroupCode(deptLevels[4]);
		user.setOfficeCode(deptLevels[5]);
		user.setFirstName("");
		user.setMiddleName("");
		user.setLastName("");
		user.setUserID("");
		var schedResult = aa.inspection.scheduleInspection(capId, user, aa.date.parseDate(dateAdd(null, 0)), null, inspToSched, "Scheduled via Script");
		
	} else {
		return false;
	}
	logDebug("Finished Script 379");
	return true;
}
function treeCreatePlantingRecordFromInsp(inspId)
	{
	// Script 201
		/* 
		Updated requirements 8/29/2018
		
		run off InspectionSubmitAfter
		If Forestry Inspection has result "Complete" and Checklist Plant = Yes and OK toPlant = Yes Then
		1.create the child planting record and from Plant Checklist item in FORESTRY INSPECTOR -
		concatinate rows from Custom List and put it in to the newly created child record

		2.  for the Parent
		do status "Assigned" on the Tree Request Intake",
		Status of "Complete" on workflow task Inspection Phase task
		Status "Complete" the Crew Work task
		update the record status to Complete
		3. In the newly created child Planting record
		enter the status of "Add to List" in workflow task Tree Planting Intake.
		Plus enter status of "Plant" in Site Review Task
		Status of "Plant Tree" in task Property Owner Responce
		activate the Quality Control task
		schedule a "Planting" Inspection for 5 business days from today's date.
		 */

		var doPlant = false;
		var fgs = getGuideSheetObjects(inspId);
		if (fgs) {
			for (var gsitems in fgs) {
				var fgsi = fgs[gsitems]; // guidesheet item
				if ("Plant".equals(fgsi.text) && "Yes".equals(fgsi.status)) {
					fgsi.loadInfo();
					logDebug("info : " + fgsi.info.length);
					for (var i in fgsi.info) { logDebug(i + " = " + fgsi.info[i]); }
					if (fgsi.info["Ok to Plant"] == "Yes") {
						doPlant = true;
						break;
					}
				}
			}
		}
		
		if (doPlant) {
			resultWorkflowTask("Tree Request Intake", "Assigned", "", "Updated by Script 201");
			resultWorkflowTask("Inspection Phase", "Complete", "", "Updated by Script 201");
			resultWorkflowTask("Crew Work", "Complete", "", "Updated by Script 201");
			updateAppStatus("Complete","Updated by Script 201");

			var options = {
				parentCapID: capId,
				appName: (inspObj.getInspection().getActivity().vehicleID) ? "Tree ID removed" + (inspObj.getInspection().getActivity().vehicleID) : "",
				createAsTempRecord: false,
				copyParcels: true,
				copyAddresses: true,
				copyOwner: true,
				copyContacts: true
			}
			var plantingRecordId = createChildGeneric("Forestry", "Request", "Planting", "NA", options);
			var tmpId = capId;
			capId = plantingRecordId;
			resultWorkflowTask("Tree Planting Intake", "Add to List", "", "");
			resultWorkflowTask("Site Review", "Plant", "", "");
			resultWorkflowTask("Property Owner Response", "Plant Tree", "", "");
			activateTask("Quality Control");
			scheduleInspection("Planting", dateAdd(null,5,true));
			//get GIS objects
			copyParcelGisObjects();
			treeInventoryPopulate(plantingRecordId)
			newDetailInfo = ""
			if (plantingRecordId) {
				fgsi.loadInfoTables();
				if (fgsi.validTables) {
					var g = (fgsi.infoTables["NEW TREE PLANTING"] ? fgsi.infoTables["NEW TREE PLANTING"] : []);
					for (var fvi in g) {
						var fvit = g[fvi];
						var thisViolation = [{
								colName: "Location",
								colValue: String(fvit["Location"])
							}, {
								colName: "Quantity",
								colValue: String(fvit["Quantity"])
							}, {
								colName: "Species",
								colValue: String(fvit["Species"])
							}, {
								colName: "Comments",
								colValue: String(fvit["Comments"])
							}
						];
						addAsiTableRow("NEW TREE PLANTING", thisViolation);
						if(newDetailInfo == "")
							{var newDetailInfo = fvit["Location"] + " " + fvit["Quantity"] + " " + fvit["Species"] + " " + fvit["Comments"]}
						else
							{var newDetailInfo = newDetailInfo + ". " + fvit["Location"] + " " + fvit["Quantity"] + " " + fvit["Species"] + " " + fvit["Comments"]}
					}
				}
			}
			updateWorkDesc(newDetailInfo)
			capId = tmpId;
		}
	}
function treeCreatePlantingRecordReplantFromInsp(inspId)
	{
	// Script 27
	var doRePlant = false;
	var fgs = getGuideSheetObjects(inspId);
	if (fgs) {
		for (var gsitems in fgs) {
			var fgsi = fgs[gsitems]; // guidesheet item
			if ("Removal".equals(fgsi.text) && "Yes".equals(fgsi.status)) {
				doRePlant = true;
				break;
			}
		}
	}
	if (doRePlant) {
		//resultWorkflowTask("Tree Request Intake", "Assigned", "", "Updated by Script 201");
		//resultWorkflowTask("Inspection Phase", "Complete", "", "Updated by Script 201");
		//resultWorkflowTask("Crew Work", "Complete", "", "Updated by Script 201");
		//updateAppStatus("Complete","Updated by Script 201");

		var options = {
			parentCapID: capId,
			appName: (inspObj.getInspection().getActivity().vehicleID) ? "Tree ID removed" + (inspObj.getInspection().getActivity().vehicleID) : "",
			createAsTempRecord: false,
			copyParcels: true,
			copyAddresses: true,
			copyOwner: true,
			copyContacts: true
		}
		var plantingRecordId = createChildGeneric("Forestry", "Request", "Planting", "NA", options);
		var parentInspectorId = getLastInspector("Forestry Inspection")
		var tmpId = capId;
		capId = plantingRecordId;
		resultWorkflowTask("Tree Planting Intake", "Add to List", "", "");
		//resultWorkflowTask("Site Review", "Plant", "", "");
		//resultWorkflowTask("Property Owner Response", "Plant Tree", "", "");
		//activateTask("Quality Control");
		
		scheduleInspection("Forestry Site Review", 0,parentInspectorId);
		
		//get GIS objects
		copyParcelGisObjects();
		treeInventoryPopulate(plantingRecordId)
		capId = tmpId;
		aa.cap.copyCapWorkDesInfo(capId, plantingRecordId);
		}
	}
function treeInventoryPopulate(vCapId)
	{
	var tmpId = capId;
	// get address
	if(vCapId != null)
		{
		capId = vCapId;
		}
	var myAddr = aa.address.getAddressByCapId(capId);
	var addrArray = new Array();
	var addrArray = myAddr.getOutput();
	if(addrArray.length != 0)
		{
		//use 1st address
		var thisHouseNumberStart = addrArray[0].getHouseNumberStart()== null ? "" : addrArray[0].getHouseNumberStart() + " ";
		var thisStreetDirection	= addrArray[0].getStreetDirection()== null ? "" : addrArray[0].getStreetDirection() + " ";
		var thisStreetName = addrArray[0].getStreetName()== null ? "" : addrArray[0].getStreetName() + " ";
		var thisStreetSuffix = addrArray[0].getStreetSuffix()== null ? "" : addrArray[0].getStreetSuffix()
		var capAddress = thisHouseNumberStart + thisStreetDirection + thisStreetName + thisStreetSuffix
		// get tree data
		var arrGIS = new Array;
		newRow = new Array();

		arrGIS = getGISBufferInfo("AURORACO","Trees","100","TREE_ID_NO","MAN_UNIT","DIAMETER","SPECIES","ADDRESS")
		logDebug("arrGIS Length " + arrGIS.length)
		for(x in arrGIS){
			//newRow = new Array();
			var thisGIS = arrGIS[x];
			var treeIdNo = thisGIS["TREE_ID_NO"];
			var manUnit = thisGIS["MAN_UNIT"];
			var diameter = thisGIS["DIAMETER"];
			var species = thisGIS["SPECIES"];
			var TreeAdd = thisGIS["ADDRESS"];
			if(TreeAdd == capAddress)
				{
				newRow["Tree ID"] = treeIdNo
				newRow["Management Unit"] = manUnit
				newRow["Existing Diameter"] = diameter
				newRow["Species"] = species
				addToASITable("TREE INFORMATION", newRow);
				}
			}
		}
	capId = tmpId;
	}
function updateApplicationNameWithAddressInfo() {
    var capAddrResult = aa.address.getAddressByCapId(capId);
    if (capAddrResult.getSuccess()) {
        var listAddress = capAddrResult.getOutput();
        if (listAddress != null && listAddress.length > 0) {
            var checkForPrimary = true;
            if (listAddress.length == 1)
                checkForPrimary = false;

            for (var a in listAddress) {
                var objAddress = listAddress[a];
                if (typeof (objAddress) != "undefined" && objAddress != null) {
                    if (checkForPrimary) {
                        var primaryFlag = objAddress.getPrimaryFlag();
                        if (typeof (primaryFlag) != "undefined" && primaryFlag != null && primaryFlag != "") {
                            if (primaryFlag.toLowerCase() == "y") {
                                var displayAddress = objAddress.getDisplayAddress();
                                if (typeof (displayAddress) != "undefined" && displayAddress != null && displayAddress != "")
                                logDebug("App Name " + displayAddress);
                                    editAppName(displayAddress);
                                break;
                            }
                        }
                    } else {
                        var displayAddress = objAddress.getDisplayAddress();
                        if (typeof (displayAddress) != "undefined" && displayAddress != null && displayAddress != "")
                        logDebug("App Name " + displayAddress);
                            editAppName(displayAddress);
                        break;
                    }
                }
            }
        }
    }
}


/**
 * update appName, appends asi value to current name, if asi value not empty and not already appended
 * @param asiFieldName asi field that has the value
*/
function updateAppNameAppendAssetNumber(asiFieldName) {

	if (typeof AInfo[asiFieldName] !== 'undefined' && AInfo[asiFieldName] != null && AInfo[asiFieldName] != "") {
		var appName = cap.getSpecialText();
		var asiValue = AInfo[asiFieldName];

		if (appName == null) {
			appName = asiValue;
		} else {
			if (appName.indexOf(asiValue) == -1) {
				//prevent multiple concatenation
				appName = appName + " " + asiValue;
			}
		}

		//only update if value was changed
		if (appName != cap.getSpecialText()) {
			editAppName(appName);
		}
	}//asiField has Value

	return true;
}
/**
 * If Contact type on record = Qualified Professional, populate the Legal Entity Name (Application Name field) with
concatinated FirstName+LastName or Organization Name
 */
function updateAppNameFromContact() {
	var contactType = "Qualified Professional";
	var contacts = aa.people.getCapContactByCapID(capId);
	if (contacts.getSuccess()) {
		contacts = contacts.getOutput();
		var newAppName = null;
		for (c in contacts) {
			conModel = contacts[c].getCapContactModel();
			if (conModel.getContactType() == contactType) {
				if ((conModel.getFirstName() == null || conModel.getFirstName().trim() == "") && (conModel.getLastName() == null || conModel.getLastName().trim() == "")) {
					newAppName = conModel.getBusinessName();
					break;
				} else {
					newAppName = conModel.getFirstName().trim() + " " + conModel.getLastName().trim()
					break;
				}
			}//Qualified Professional
		}//for all contacts

		if (newAppName != null) {
			editAppName(newAppName);
		}
	}//get contacts success
}

/**
 * @param workflowTask work flow task that need to be checked
 * @param workflowStatus work flow status to be checked
 * @param ASIFieldName ASI field that need to be updated
 * @param daysOut number of days that need to be shifted
 */
function UpdateASIFieldBasedOnworkFlowTask(workflowTask, workflowStatus, ASIFieldName, daysOut) {
	if (wfTask == workflowTask && wfStatus == workflowStatus) {
		editAppSpecific(ASIFieldName, getCalculatedDate(wfDateMMDDYYYY, daysOut), capId);
	}

}

/*
* UPDATES A COLUMN FOR AN EXISTING ROW(S)
*  UPDATES ALL ROWS (BY DEFAULT) - SEE OPTIONS

    NOTE 1: Can only be used by rows added using the UI or addAsiTableRow()
    NOTE 2: Filters are additive

    colFilters = [
        { colName: 'Abatement #', colValue: capIDString },
        { colnName: 'Type', colValue: AInfo['Abatement Type'] }
    ]
    */ 
function updateAsiTableRow(tableName, columnName, newValue, options) {
    var settings = {
        capId: capId,
        rowIndex: null, //0 based row index - null means update all rows
        colFilters: null //array of column values to filter by... null = update all rows
    };
    for (var attr in options) { settings[attr] = options[attr]; } //optional params - overriding default settings

    var row,
        val,
        rtn = false,
        asiTableRowIndexes = [];

    logDebug('updateAsiTableRow() starting');
    //first get existing rows - if available
    var asitTable = getAsiTableRows(tableName, {
        capId: settings.capId,
    })
  
    if(asitTable != null) { //found table
        asiTableRowIndexes = getAsiTableRowIndexes();
        filterRows();
        logDebug('updateAsiTableRow(): asitTable.length = ' + asitTable.length);

        // if(settings.rowIndex != null && asitTable[settings.rowIndex] != null) { //update specific row
        //     row = asitTable[settings.rowIndex];
        //     val = row[columnName] ? row[columnName] : null;
        //     rtn = updAsiTableRow(asiTableRowIndexes[settings.rowIndex])
        // } else {    //update all rows  todo
        for (var ea in asitTable) {
            row = asitTable[ea];
            if(row.filteredOut == false) {
                val = row[columnName] ? row[columnName] : null;
                rtn = updAsiTableRow(asiTableRowIndexes[ea]);   
            }
        }
     //   }
        return true
    }
    return rtn;


    function filterRows() {
        var matched,
            filter,
            idxRows;

        for(idxRows in asitTable) {
            asitTable[idxRows].filteredOut = false;
        }

        //filter by settings.rowIndex
        if(settings.rowIndex != null && asitTable[settings.rowIndex] != null) { //update specific row
            for(idxRows in asitTable) {
                if(settings.rowIndex != idxRows) {
                    asitTable[idxRows].filteredOut = true;
                }
            }
        }

        //filter by settings.colFilters
        if(settings.colFilters != null && settings.colFilters.length > 0) {
            for(idxRows in asitTable) {
                matched = true;
                for(var idxFilter in settings.colFilters) {
                    filter = settings.colFilters[idxFilter];
                    if(filter.colValue.toString() != asitTable[idxRows][filter.colName].toString()) {
                        matched = false;
                    }
                }
                if(matched == false) {
                    asitTable[idxRows].filteredOut = true;
                }
            }
        } 
    }

    function getAsiTableRowIndexes() {
        var asiTableRowIndexes = [];
            appSpecificTableInfo = aa.appSpecificTableScript.getAppSpecificTableInfo(settings.capId, tableName, null);
        
        if (appSpecificTableInfo.getSuccess())
        {     
            appSpecificTableModel = appSpecificTableInfo.getOutput().getAppSpecificTableModel();
            var tableFields = appSpecificTableModel.getTableFields(); // List<BaseField>
            if (tableFields != null && tableFields.size() > 0)
            {
                var updateRowsMap = aa.util.newHashMap(); // Map<rowID, Map<columnName, columnValue>>
                for (var i=0; i < tableFields.size(); i++)
                {
                    var fieldObject = tableFields.get(i); // BaseField
                    //get the row ID 
                    var foRowIndex = fieldObject.getRowIndex();

                    if(asiTableRowIndexes.indexOf(foRowIndex) < 0) {
                        asiTableRowIndexes.push(foRowIndex)
                    }

                }
            }
        }
        return asiTableRowIndexes;	
    }

    /*
* ALLOWS UPDATING OF ONE COLUMN IN ONE ROW
 
    NOTE: Can only be used by rows added using the UI or addAsiTableRow()
*/
    function updAsiTableRow(rowIndex) {
    var appSpecificTableInfo = aa.appSpecificTableScript.getAppSpecificTableInfo(settings.capId, tableName, null);
    if (appSpecificTableInfo.getSuccess())
    {
        var appSpecificTableModel = appSpecificTableInfo.getOutput().getAppSpecificTableModel();
        var tableFields = appSpecificTableModel.getTableFields(); // List<BaseField>
        if (tableFields != null && tableFields.size() > 0)
        {
            var updateRowsMap = aa.util.newHashMap(); // Map<rowID, Map<columnName, columnValue>>
            for (var i=0; i < tableFields.size(); i++)
            {
                var fieldObject = tableFields.get(i); // BaseField
                //get the column name.
                var foColumnName = fieldObject.getFieldLabel();
                //get the value of column
                var foColumnValue = fieldObject.getInputValue();
                //get the row ID 
                var foRowIndex = fieldObject.getRowIndex();

                if(columnName == foColumnName && rowIndex == foRowIndex) {
                    setUpdateColumnValue(rowIndex);
                }
             }
            if (!updateRowsMap.isEmpty())
            {
                updateAppSpecificTableInfors();
            }
        }
        return true;	
    }
    return false;

    /** 
    /* Set update column value. format: Map<rowID, Map<columnName, columnValue>>
    **/
    function setUpdateColumnValue(rowIndex)
    {
        logDebug('setUpdateColumnValue(): rowIndex = ' + rowIndex + ', columnName = ' + columnName + ', columnValue = ' + newValue);
        var updateFieldsMap = updateRowsMap.get(rowIndex);
        if (updateFieldsMap == null)
        {
            updateFieldsMap = aa.util.newHashMap();
            updateRowsMap.put(rowIndex, updateFieldsMap);
        }
        updateFieldsMap.put(columnName, newValue);
    }

    /**
    * update ASIT rows data. updateRowsMap format: Map<rowID, Map<columnName, columnValue>>
    **/
    function updateAppSpecificTableInfors()
    {
    logDebug("in update STI");
        if (updateRowsMap == null || updateRowsMap.isEmpty())
        {
            return;
        }
        
        var asitTableScriptModel = aa.appSpecificTableScript.createTableScriptModel();
        var asitTableModel = asitTableScriptModel.getTabelModel();
        var rowList = asitTableModel.getRows();
        asitTableModel.setSubGroup(tableName);
        var rowIdArray = updateRowsMap.keySet().toArray();
        logDebug("rowIdArray.length = " + rowIdArray.length);
        for (var i = 0; i < rowIdArray.length; i++)
        {
            var rowScriptModel = aa.appSpecificTableScript.createRowScriptModel();
            var rowModel = rowScriptModel.getRow();
            rowModel.setFields(updateRowsMap.get(rowIdArray[i]));
            rowModel.setId(rowIdArray[i]);
            rowList.add(rowModel);
        }
        return aa.appSpecificTableScript.updateAppSpecificTableInfors(settings.capId, asitTableModel);
    }

    }

}


/* update asit rows based on criteria of one column and one value
 * @updateArray - an array of columns and values to update.
 */
function updateASITRows(tableName, colName, colValue, updateArray){
	logDebug("Updating Asi Rows");
	var itemCap = capId
    if (arguments.length > 4)
        itemCap = arguments[4]; // use cap ID specified in args
	
	var rowsUpdated = 0;
	var tRows = loadASITable(tableName, itemCap);
	
	for(eachRow in tRows){
		var aRow = tRows[eachRow];
		
		if(aRow[colName].toString() == colValue.toString()){
			for(i in updateArray){
				aRow[i] = updateArray[i];		
			}
			rowsUpdated++;
		}
	}
	
	if(rowsUpdated > 0){
		removeASITable(tableName, itemCap);
		addASITable(tableName, tRows, itemCap);
		return true;
	}
	
	if(rowsUpdated == 0) return false;
}
function updateAssignedToUser() {
	var assignedStaff = getAssignedStaff();
	var wfTaskToUpdate=getWorkflowTaskName();	
	if (wfTaskToUpdate!=null && wfTaskToUpdate!=""){
		if (wfTaskToUpdate.indexOf(",")> 0) {
			wfTaskToUpdate=wfTaskToUpdate.split(",")
			for (i in wfTaskToUpdate){
				assignTask(wfTaskToUpdate[i], assignedStaff,wfProcess);
			}
		}else {
			
			assignTask(wfTaskToUpdate, assignedStaff,wfProcess);
		}		
	}
		
}
function updateAssignedUserForTraffEngReq(){
if ( (wfTask=="Initial Review" || wfTask=="Initial Supervisor Review") && wfStatus=="Assigned"){
	// update wftask Traffic Investigation assigned department & user , get  from TSI
	useTaskSpecificGroupName=false;
	var tsiArray = new Array(); 
        loadTaskSpecific(tsiArray);
        for (i in tsiArray){
    if (i=="Assigned To"){
    	var assignedTo=tsiArray[i];
    	if (assignedTo!=null && assignedTo!=""){
    			var userName=assignedTo.split(" ");
    			var userObj = aa.person.getUser(userName[0],null,userName[1]).getOutput();
    			assignTask("Traffic Investigation",userObj.getUserID());
    			updateTaskDepartment("Traffic Investigation",userObj.getDeptOfUser());		
    	}	
     }
    	
    }
	
}
}

function updateCapOwnersByParcel() {
	//loads the parcels on the record, looks up the parcels' owners, and adds them
	try {
		var ownerNumberList = new Array();
		var ownerRefNumber = "";
		var firstLoop = true;
		var duplicateOwner = false;

		// remove current owners on record
		var recOwners = aa.owner.getOwnerByCapId(capId).getOutput()
		for (pntOwner in recOwners) {
			aa.owner.removeCapOwnerModel(recOwners[pntOwner]);
		}

		//get record's parcel(s)
		var parcels = aa.parcel.getParcelDailyByCapID(capId, null);

		if (parcels.getSuccess()) {
			parcels = parcels.getOutput();
			if (parcels == null || parcels.length == 0) {
				logDebug("No parcels available for this record");
			} else {
				//get owner(s) by parcel(s) and add to record
				for (var i = 0; i < parcels.length; i++) {
					var parcelOwnersResult = aa.owner.getOwnersByParcel(parcels[i]);
					var parcelNbr = parcels[i].getParcelNumber();
					var parcelUID = parcels[i].getParcelModel().getUID();
					if (parcelOwnersResult.getSuccess()) {
						var actuallyParcelNumber = parcelNbr != null ? parcelNbr : parcelUID;
						//aa.print("");
						//aa.print("Successfully get owner(s) by Parcel "+actuallyParcelNumber+". Detail as follow:");
						var ownerArr = parcelOwnersResult.getOutput();
						//aa.print("Size :" + ownerArr.length);
						for (j = 0; j < ownerArr.length; j++) {
							ownerRefNumber = ownerArr[j].getL1OwnerNumber();
							//aa.print("Looking at ref owner: " + ownerRefNumber);
							duplicateOwner = false;

							if (firstLoop) {
								ownerArr[j].setCapID(capId);
								ownerArr[j].setPrimaryOwner("N");
								aa.owner.createCapOwnerWithAPOAttribute(ownerArr[j]);
								//aa.print("Added first owner: " + ownerArr[j].getOwnerFullName() + ", #" + ownerArr[j].getL1OwnerNumber());
								ownerNumberList.push(ownerArr[j].getL1OwnerNumber());
								firstLoop = false;
							} else {
								// Look for duplicates
								for (k = 0; k < ownerNumberList.length; k++) {
									if (ownerNumberList[k] == ownerRefNumber) {
										duplicateOwner = true;
										//aa.print("Found duplicate");
										break;
									}
								}
								if (!duplicateOwner) {
									ownerArr[j].setCapID(capId);
									ownerArr[j].setPrimaryOwner("N");
									aa.owner.createCapOwnerWithAPOAttribute(ownerArr[j]);
									//aa.print("Added owner: " + ownerArr[j].getOwnerFullName() + ", #" + ownerArr[j].getL1OwnerNumber());
									ownerNumberList.push(ownerArr[j].getL1OwnerNumber());
								}
							}
						}
					} else {
						logDebug("ERROR: Failed to get owner(s) by Parcel(s): " + parcelOwnersResult.getErrorMessage());
					}
				}
			}
		}
	} catch (err) {
		comment("A JavaScript Error occurred:  Custom Function: updateCapOwnersByParcel(): " + err.message);
	}
}

/**
 * If any WF Task is updated to a status of Resubmittal Requested or if workflow task Accept Plans is updated to a status of
Accepted, update the Custom Field Application Expiration Date (now + 180 days)
 */
function updateExpirationDateAsi() {
	var asiFieldName = "Application Expiration Date";
	var numOfDays = 180;
	
	var now = formatDateX(aa.date.getCurrentDate());
    appExpDate = aa.date.addDate(now, numOfDays);
    editAppSpecific(asiFieldName, appExpDate);
}

/**
 * Format a ScriptDate mm/dd/yyyy
 * @param scriptDate
 * @returns {String} formatted date
 */
function formatDateX(scriptDate) {
	var ret = "";
	ret += scriptDate.getMonth().toString().length == 1 ? "0" + scriptDate.getMonth() : scriptDate.getMonth();
	ret += "/";
	ret += scriptDate.getDayOfMonth().toString().length == 1 ? "0" + scriptDate.getDayOfMonth() : scriptDate.getDayOfMonth();
	ret += "/";
	ret += scriptDate.getYear();
	return ret;
}

function updateInspectionInfo(inspectionIdTreeIdMap, inspectionIdExistingDiameterMap, guideSheetType) {
	//can't get specific inspection by ID, guideSheets will be null
	var inspections = aa.inspection.getInspections(capId).getOutput();
	for (x in inspectionIdTreeIdMap) {
		var treeId = inspectionIdTreeIdMap[x];
		for (i in inspections) {
			if (inspections[i].getIdNumber() == x) {
				var inspc = inspections[i].getInspection();

				//update guideSheet ID:
				var guideSheets = inspc.getGuideSheets();
				for (g = 0; g < guideSheets.size(); g++) {
					if (guideSheets.get(g).getDispGuideType() == guideSheetType) {
						var guideSheet = guideSheets.get(g);
						guideSheet.setIdentifier(treeId);
						var updated = aa.guidesheet.updateGGuidesheet(guideSheet, aa.getAuditID());
						if (!updated.getSuccess()) {
							logDebug("**WARN updateGGuidesheet failed, inspecId:" + x + " Err:" + updated.getErrorMessage());
						}
						break;
					}//guidesheetType matched
				}//for all guideSheets

				//update unitNbr:
				var act = inspc.getActivity();
				act.setUnitNBR(treeId);
				updated = aa.inspection.editInspection(inspections[i]);
				if (!updated.getSuccess()) {
					logDebug("**WARN editInspection failed, inspecId:" + x + " Err:" + updated.getErrorMessage());
				}
			}//inspId matched
		}//for all inspections
	}//for inspectionIdTreeIdMap
	
	for (x in inspectionIdExistingDiameterMap) {
		var existingDiameter = inspectionIdExistingDiameterMap[x];
		for (i in inspections) {
			if (inspections[i].getIdNumber() == x) {
				var inspc = inspections[i].getInspection();

				//update guideSheet ID:
				var guideSheets = inspc.getGuideSheets();
				for (g = 0; g < guideSheets.size(); g++) {
					if (guideSheets.get(g).getDispGuideType() == guideSheetType) {
						var guideSheet = guideSheets.get(g);
						guideSheet.setIdentifier(treeId);
						var updated = aa.guidesheet.updateGGuidesheet(guideSheet, aa.getAuditID());
						if (!updated.getSuccess()) {
							logDebug("**WARN updateGGuidesheet failed, inspecId:" + x + " Err:" + updated.getErrorMessage());
						}
						break;
					}//guidesheetType matched
				}//for all guideSheets

				//update Existing Diameter (renamed Vehicle ID):
				var act = inspc.getActivity();
				act.setVehicleID(existingDiameter);
				updated = aa.inspection.editInspection(inspections[i]);
				if (!updated.getSuccess()) {
					logDebug("**WARN editInspection failed, inspecId:" + x + " Err:" + updated.getErrorMessage());
				}
			}//inspId matched
		}//for all inspections
	}//for inspectionIdExistingDiameterMap
		
	return false;
}
function updatePermitExpirationCF(workflowTaskName, workflowStatus,cfName) {
	for ( var i in workflowTaskName) {
		var wft = workflowTaskName[i];
		if (wfTask == wft && wfStatus == workflowStatus) {
			var statusDate = dateAdd(wfDateMMDDYYYY,180);
			useAppSpecificGroupName = false;
			editAppSpecific(cfName,statusDate);
		}
	}
}
function updateRecordDetails(inspectorID, inspectorDepartment) {
    var cdScriptObjResult = aa.cap.getCapDetail(capId);
    var objCDScript = cdScriptObjResult.getOutput();
    capDetailModel = objCDScript.getCapDetailModel();
    if (typeof (capDetailModel) != "undefined" && capDetailModel != null) {
        capDetailModel.setAsgnDept(inspectorDepartment);
        capDetailModel.setAsgnStaff(inspectorID);
        aa.cap.editCapDetail(capDetailModel);
    }
}
function updateReviewCommentsDueDate(workFlowTask, workFlowStatus, firstReviewDateASI, secondReviewDateASI, thirdReviewDateASI, meetingType, planningCommissionDateASI,
    applicant2ndSubmissionDateASI, applicant3rdSubmissionDateASI, emailTemplate, recordURL) {

// Stories
if (matches(wfTask, workFlowTask) && matches(wfStatus, workFlowStatus)) {
    var firstReviewDate = getAppSpecific(firstReviewDateASI);
    var secondReviewDate = getAppSpecific(secondReviewDateASI);
    var thirdReviewDate = getAppSpecific(thirdReviewDateASI);
    var closesMeetingDate;

    if (isEmpty(firstReviewDate)) {
        // If Custom Field "1st Review Comments Due date" is null
        // Then update it with Today + 15 days
        firstReviewDate = dateAdd(new Date(), 15, true);
        editAppSpecific(firstReviewDateASI, firstReviewDate);
        // And update the custom Field "Projected Planning Commission Hearing date" by searching the Planning
        // Commission Meeting Calendar returning the "Planning Commission Meeting" closest to 6.5 weeks from the current date
        closesMeetingDate = getClosesMeetingDate(6.5, meetingType);
        editAppSpecific(planningCommissionDateASI, aa.util.formatDate(closesMeetingDate, "MM/dd/yyyy"));
    } else if (!isEmpty(firstReviewDate) && isEmpty(secondReviewDate)) {
        // If custom field "1st Review Comments Due date" is not null and
        // custom field "2nd Review Comments Due date" is null 
        // Then update the field "2nd Review Comments Due date" with Today + 15 days
        secondReviewDate = dateAdd(new Date(), 15);
        editAppSpecific(secondReviewDateASI, secondReviewDate);
        // And update the custom Field "Projected Planning Commission Hearing date" by searching the Planning
        // Commission Meeting Calendar returning the "Planning Commission Meeting" closest to 6 weeks from the current date
        closesMeetingDate = getClosesMeetingDate(6, meetingType);
        editAppSpecific(planningCommissionDateASI, aa.util.formatDate(closesMeetingDate, "MM/dd/yyyy"));
        // Also update the Custom Field "Applicant 2nd Submission Date" to Today + 20 days
        var appSecondSubmissionDate = dateAdd(new Date(), 20);
        editAppSpecific(applicant2ndSubmissionDateASI, appSecondSubmissionDate);
    } else if (!isEmpty(firstReviewDate) && !isEmpty(secondReviewDate) && isEmpty(thirdReviewDate)) {
        // If custom field "1st Review Comments Due date" is not null and
        // custom field "2nd Review Comments Due date" is not null and 
        // custom field "3rd Review Comments Due Date" is null
        // Then update the field "3rd Review Comments Due Date" with Today + 10 days
        thirdReviewDate = dateAdd(new Date(), 10);
        editAppSpecific(thirdReviewDateASI, thirdReviewDate);
        // And update the custom Field "Projected Planning Commission Hearing date" by searching the Planning
        // Commission Meeting Calendar returning the "Planning Commission Meeting" closest to 5 weeks from the current date
        closesMeetingDate = getClosesMeetingDate(5, meetingType);
        editAppSpecific(planningCommissionDateASI, aa.util.formatDate(closesMeetingDate, "MM/dd/yyyy"));
        // Also update the Custom Field "Applicant 3rd Submission Date" to Today + 15 days
        var appthirdSubmissionDate = dateAdd(new Date(), 15);
        editAppSpecific(applicant3rdSubmissionDateASI, appthirdSubmissionDate);
    } else if (!isEmpty(firstReviewDate) && !isEmpty(secondReviewDate) && !isEmpty(thirdReviewDate)) {
        closesMeetingDate = getClosesMeetingDate(5, meetingType);
        editAppSpecific(planningCommissionDateASI, aa.util.formatDate(closesMeetingDate, "MM/dd/yyyy"));
        var appthirdSubmissionDate = dateAdd(new Date(), 15);
        editAppSpecific(applicant3rdSubmissionDateASI, appthirdSubmissionDate);
    }
    var applicantEmail = null;
    var recordApplicant = getContactByType("Applicant", capId);
    if (recordApplicant) {
        applicantEmail = recordApplicant.getEmail();
    }
    if (applicantEmail == null) {
        logDebug("**WARN Applicant on record " + capId + " has no email");
        return false
    }
    var files = new Array();
    var emailParams = aa.util.newHashtable();
    addParameter(emailParams, "$$altID$$", cap.getCapModel().getAltID());
    addParameter(emailParams, "$$recordAlias$$", cap.getCapModel().getCapType().getAlias());
    addParameter(emailParams, "$$recordStatus$$", cap.getCapModel().getCapStatus());
    addParameter(emailParams, "$$wfComment$$", wfComment);
    addParameter(emailParams, "$$wfTask$$", wfTask);
    addParameter(emailParams, "$$wfStatus$$", wfStatus);
    addParameter(emailParams, "$$acaRecordUrl$$", recordURL);
    var sent = aa.document.sendEmailByTemplateName("", applicantEmail, "", emailTemplate, emailParams, files);
    if (!sent.getSuccess()) {
        logDebug("**ERROR sending email failed, error:" + sent.getErrorMessage());
        return false;
    }
}
}

function updateSubmittalNumber(workFlowTask, workflowStatusArray, customFieldName) {
    if (wfTask == workFlowTask) {
        var statusMatch = false;

        for (s in workflowStatusArray) {
            if (wfStatus == workflowStatusArray[s]) {
                statusMatch = true;
                break;
            }
        }

        if (!statusMatch) {
            return false;
        }

        var customFieldValue = getAppSpecific(customFieldName, capId);
        if (typeof (customFieldValue) != "undefined" && customFieldValue != null && customFieldValue != "")
            customFieldValue = parseInt(customFieldValue) + 1;
        else
            customFieldValue = 1;

        editAppSpecific(customFieldName, customFieldValue);


    } else {
        return false;
    }

    return true;
}

/**
 * 
 * @param emailTemplate the email template that need to send to the applicant
 * @param taskToBeUpdated the task to be updated when the validation of the parallel tasks completed 
 * @param taskStatus the status that need to update on the task
 * @returns {Boolean} true if every thing is working fine otherwise will return false
 */
function UpdateTaskAndSendNotification(emailTemplate, taskToBeUpdated, taskStatus) {
	var taskResult = aa.workflow.getTask(capId, taskToBeUpdated);
	var currentTask = taskResult.getOutput();
	if (currentTask != null && currentTask != "") {
		currentTask.setDisposition(taskStatus);
		var updateResult = aa.workflow.handleDisposition(currentTask.getTaskItem(), capId);
	}

	var applicantEmail = null;
	var recordApplicant = getContactByType("Applicant", capId);
	if (recordApplicant) {
		applicantEmail = recordApplicant.getEmail();
	}
	if (applicantEmail == null) {
		logDebug("**WARN Applicant on record " + capId + " has no email");
		return false
	}

	var files = new Array();
	var eParams = aa.util.newHashtable();
	addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
	addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
	addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
	addParameter(eParams, "$$wfTask$$", wfTask);
	addParameter(eParams, "$$wfStatus$$", wfStatus);
	addParameter(eParams, "$$wfDate$$", wfDate);

	if (wfComment != null && typeof wfComment !== 'undefined') {
		addParameter(eParams, "$$wfComment$$", wfComment);
	}
	
	var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());

	var sendResult = sendNotification("noreply@aurora.gov",applicantEmail,"",emailTemplate,eParams,files,capID4Email);
	if (!sendResult) 
		{ logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
	else
		{ logDebug("Sent Notification"); }	

}


function updateTaskAssignedDate(wfstr,wfAssignDate) // optional process name
                {
                // Update the task assignment date
                //
                var useProcess = false;
                var processName = "";
                if (arguments.length == 3)
                                {
                                processName = arguments[2]; // subprocess
                                useProcess = true;
                                }
                var workflowResult = aa.workflow.getTasks(capId);
                if (workflowResult.getSuccess())
                                var wfObj = workflowResult.getOutput();
                else
                                { logDebug("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage()); return false; }

                for (i in wfObj)
                                {
                                var fTask = wfObj[i];
                                if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase())  && (!useProcess || fTask.getProcessCode().equals(processName)))
                                                {
                                                var assignDate = aa.util.now();
                                                var tempDate = new Date(wfAssignDate);
                                                assignDate.setTime(tempDate.getTime())
                                                if (assignDate)
                                                                {
                                                                var taskItem = fTask.getTaskItem();
                                                                taskItem.setAssignmentDate(assignDate);

                                                                var adjustResult = aa.workflow.adjustTaskWithNoAudit(taskItem);
                                                                if (adjustResult.getSuccess())
                                                                                {logDebug("Updated Workflow Task : " + wfstr + " Assigned Date to " + wfAssignDate);}
                                                                else
                                                                                {logDebug("Error updating wfTask : " + adjustResult.getErrorMessage());}
                                                                }
                                                else
                                                                logDebug("Couldn't update assigned date.  Invalid date : " + wfAssignDate);
                                                }
                                }
                }


/**
 * Update task status with the assigned user 
 * @param TasksToBeChecked the needed tasks to be updated if its active.
 */
function updateTaskAssignedUserbyCapAssignedUser(TasksToBeChecked) {
	var capAssignedUser = aa.cap.getCapDetail(capId).getOutput().getCapDetailModel().getAsgnStaff();
	if (capAssignedUser != null && capAssignedUser != "") {
		for ( var i in TasksToBeChecked) {
			if (isTaskActive(TasksToBeChecked[i])) {
				assignTask(TasksToBeChecked[i], capAssignedUser);
				break;
			}
		}
	}
}


/**
 * For all workflow tasks, with status equals one of wfStatusNamesArray, task item is activated (if not active) and updated with newTaskStatus
 * @param wfStatusNamesArray list of statuses to check if tasks have
 * @param newTaskStatus the status to be assigned to matched tasks
 * @returns {Boolean}
 */
function updateTaskStatusAndActivate(wfStatusNamesArray, newTaskStatus) {

	var tasks = aa.workflow.getTasks(capId);
	if (!tasks.getSuccess()) {
		logDebug("**WARN failed to get cap tasks, capId=" + capId + " Error:" + tasks.getErrorMessage());
		return false;
	}
	tasks = tasks.getOutput();

	if (tasks == null || tasks.length == 0) {
		logDebug("**WARN tasks list empty or null, capId=" + capId);
		return false;
	}

	for (w in wfStatusNamesArray) {
		for (t in tasks) {
			if (wfStatusNamesArray[w] == tasks[t].getDisposition()) {
				if (tasks[t].getActiveFlag() == "N") {
					activateTask(tasks[t].getTaskDescription());
				}
				updateTask(tasks[t].getTaskDescription(), newTaskStatus, "by script - document uploaded", "by script - document uploaded");
				//NO break; ... we need to check all tasks against each status
			}//status matched
		}//for all wf Tasks
	}//for all wfStatuses
	return true;
}
function UpdateWFAddInspAndCreateNewRecord(){
	if (inspType=="Non-warranty Inspection" && inspResult=="Passed"){
		deactivateActiveTasks("ENF_TREE_PLANT");
	}else if (inspType=="Non-warranty Inspection" && inspResult=="Failed"){
		//create a new insp of type Tree Removal
		scheduleInspect(capId,"Tree Removal",0);
		//create a child record 
	    var ChildCapId=createChild("Forestry","Request","Planting","NA","Tree Planting Wait List");
		//update WfTask Tree Planting Intake
		closeTaskByCapId("Tree Planting Intake","Add to List","","",ChildCapId);
		//enter "Staff" in Custom Field "Source of Request" 
		editAppSpecific("Source of Request","Staff",ChildCapId);
		//Activate wfTask Site Review
		activateWFTask("Site Review",ChildCapId);
	}
}

/**
 * 
 * @param parentWorkflowTasktoBechecked the task that need to be checked 
 * @param parentworkFlowStatustoBeChecked the status of the task to be checked 
 * @param workFlowTaskTobechecked current work flow task
 * @param workFlowStatusTobeChecked current work flow status
 * @param workflowTasktobeActivated work flow task to be activated
 * @param ASIFieldNametoBeUpdated asi field name
 * @param ASIFieldValue value
 */
function updateWFtaskAndASIField(parentWorkflowTasktoBechecked, parentworkFlowStatustoBeChecked, workFlowTaskTobechecked, workFlowStatusTobeChecked, workflowTasktobeActivated,
		ASIFieldNametoBeUpdated, ASIFieldValue) {
	if (wfTask == workFlowTaskTobechecked && wfStatus == workFlowStatusTobeChecked) {
		var parentTask = aa.workflow.getTask(capId, parentWorkflowTasktoBechecked).getOutput();
		if (parentTask != null && parentTask != "") {
			if (parentTask.getDisposition() == parentworkFlowStatustoBeChecked) {
				activateTask(workflowTasktobeActivated);
				editAppSpecific(ASIFieldNametoBeUpdated, ASIFieldValue, capId);

			}

		}

	}

}


/**
 * this function to update work flow task due date
 * @param workFlowTasktobeChecked status to be checked 
 * @param numberOfdayes number of days 
 */
function UpdateworkFlowTaskDueDate(workFlowTasktobeChecked, numberOfdayes) {
	if (wfStatus == workFlowTasktobeChecked) {
		var FormateddueDate = wfDue.getDayOfMonth() + "/" + wfDue.getMonth() + "/" + wfDue.getYear();
		editTaskDueDate(wfTask, getCalculatedDate(FormateddueDate, numberOfdayes));
	}

}
function validateField(asiFieldReceived, specialInspections) {
	for (xx in specialInspections) {

		if (specialInspections[xx].getCheckboxDesc() != asiFieldReceived) {
			continue;
		}

		if (typeof (specialInspections[xx].getChecklistComment()) != "undefined" && !isBlankOrNull(specialInspections[xx].getChecklistComment())) {
			return true;
		} else {
			return false;
		}
	}
	return false;
}

/**
 * check if parent of certain type exists, and has a certain capStatus, block workflow submit 
 * @param workflowStatusArray
 * @param parentType
 * @param parentStatus
 * @returns {Boolean}
 */
function validateParentCapStatus(workflowStatusArray, parentType, parentStatus) {

    var statusMatch = false;

    if(ifTracer(vEventName == "WorkflowTaskUpdateBefore", 'WTUB')){
    
        for (s in workflowStatusArray) {
            if (wfStatus == workflowStatusArray[s]) {
                statusMatch = true;
                break;
            }
        }//for all status options

        if (!statusMatch) {
            return false;
        }
	
        var parents = getParents(parentType);
        for (p in parents) {
            var parentCap = aa.cap.getCap(parents[p]).getOutput();
            if (parentCap.getCapStatus() == parentStatus) {
                cancel = true;
                showMessage = true;
                comment("Master is previous code year cannot issue permit.");
                return false;
            }
        }
        return true;
	}
	
	if(ifTracer(vEventName == "PaymentReceiveAfter", 'PRA')){
		var parents = getParents(parentType);
        for (p in parents) {
            var parentCap = aa.cap.getCap(parents[p]).getOutput();
            if (parentCap.getCapStatus() == parentStatus) {
                showMessage = true;
                comment("<B><Font Color=RED>Master is previous code year cannot issue permit.</Font></B>");
                return false;
            }
        }
        return true;
	}
}
function validateReceptionNumber(){
	try{
		if (wfTask=="Recordation" && wfStatus=="Recorded"){
			useAppSpecificGroupName=false;
			var receptionNumber=getAppSpecific("Reception Number");
			if (receptionNumber==null)throw "Reception Number is not set and see Info Fields to fill in the reception number";
		}
			
	}catch(e){
		cancel = true;
		showMessage = true;
		comment(e);
	}
}

function validateWOFields() {
try{
	if (wfTask=="Draft Workorder" && wfStatus=="Workorder Drafted"){
		useAppSpecificGroupName=false;
		var location=getAppSpecific("Location");
		var description=getAppSpecific("Description");
		var priority=getAppSpecific("Work Order Priority");
		if (isBlankOrNull(location)|| isBlankOrNull(description) || isBlankOrNull(priority)){
			throw "Missing Information. Info Fields Description, Location, and Work Order Priority in the WORK ORDER INFORMATION section must be filled out prior to saving this task status.";
		}
	}
}catch(e){
	cancel = true;
	showMessage = true;
	comment(e);
}
}
function wtrScript131_checkASITbefore(){
    logDebug("wtrScript131_checkASITbefore() started");
    try{
        var permitType = AInfo["Utility Permit Type"];
        var doCancel = false;
            try{
                var watMatRows = 0;
                var sizeRows = 0;
                var swpRows = 0;
                var psspRows = 0;
                var privSspRows = 0;
                var privFireRows = 0;
                
                var minRows = 1;
                var rowsNeededInTable = "";
                loadASITablesBefore4CoA();
                
                if(ifTracer(permitType == "Water Main Utility Permit", 'permitType == "Water Main Utility Permit"')){
                    watMatRows = WATERMATERIAL.length;
                    for(x in WATERMATERIAL){
                        var col1 = WATERMATERIAL[x]["Size of Pipe"];
                        var col2 = WATERMATERIAL[x]["Pipe Material"];       
                        var col3 = WATERMATERIAL[x]["Length in Lineal Feet"];
                        
                        logDebug("col1:" + col1 );
                        logDebug("col2:" + col2 );
                        logDebug("col3:" + col3 );
                        if((col1 != null) || (col2 != null) || (col3 != null)){
                           doCancel = false;
                        }
                        else
                            doCancel = true;
                    }
                    
                    sizeRows = SIZE.length;
                    for(x in SIZE){
                        var col1 = SIZE[x]["Size"];
                        var col2 = SIZE[x]["Number of Taps"];       
                        var col3 = SIZE[x]["Location Description"];
                        var col4 = SIZE[x]["Complete"];
                        
                        logDebug("col1:" + col1 );
                        logDebug("col2:" + col2 );
                        logDebug("col3:" + col3 );
                        logDebug("col4:" + col4 );
                        if((col1 != null) || (col2 != null) || (col3 != null) || (col4 != null)){
                           doCancel = false;
                        }
                        else
                            doCancel = true;
                    }
                }
                if(ifTracer(permitType == "Sanitary Sewer Permit", 'permitType == "Sanitary Sewer Permit"')){//SANITARYSEWERMATERIAL
                    swpRows = SANITARYSEWERMATERIAL.length;
                    for(x in SANITARYSEWERMATERIAL){
                        var col1 = SANITARYSEWERMATERIAL[x]["Size of Pipe"];
                        var col2 = SANITARYSEWERMATERIAL[x]["Pipe Material"];       
                        var col3 = SANITARYSEWERMATERIAL[x]["Length in Lineal Feet"];
                        
                        logDebug("col1:" + col1);
                        logDebug("col2:" + col2);
                        logDebug("col3:" + col3);
                        if((col1 != null) || (col2 != null) || (col3 != null)){
                           doCancel = false;
                        }
                        else
                            doCancel = true;
                    }
                }
                if(ifTracer(permitType == "Public Storm Sewer Permit", 'permitType == "Public Storm Sewer Permit"')){//PUBLICSTORMMATERIAL
                    psspRows = PUBLICSTORMMATERIAL.length;
                    for(x in PUBLICSTORMMATERIAL){
                        var col1 = PUBLICSTORMMATERIAL[x]["Size of Pipe"];
                        var col2 = PUBLICSTORMMATERIAL[x]["Pipe Material"];       
                        var col3 = PUBLICSTORMMATERIAL[x]["Length in Lineal Feet"];
                        
                        logDebug("col1:" + col1);
                        logDebug("col2:" + col2);
                        logDebug("col3:" + col3);
                        if((col1 != null) || (col2 != null) || (col3 != null)){
                           doCancel = false;
                        }
                        else
                            doCancel = true;
                    }
                }
                if(ifTracer(permitType == "Private Storm Sewer Permit", 'permitType == "Private Storm Sewer Permit"')){//PRIVATESTORMMATERIAL
                    privSspRows = PRIVATESTORMMATERIAL.length;
                    for(x in PRIVATESTORMMATERIAL){
                        var col1 = PRIVATESTORMMATERIAL[x]["Size of Pipe"];
                        var col2 = PRIVATESTORMMATERIAL[x]["Pipe Material"];       
                        var col3 = PRIVATESTORMMATERIAL[x]["Length in Lineal Feet"];
                        
                        logDebug("col1:" + col1);
                        logDebug("col2:" + col2);
                        logDebug("col3:" + col3);
                        if((col1 != null) || (col2 != null) || (col3 != null)){
                           doCancel = false;
                        }
                        else
                            doCancel = true;
                    }
                }
                if(ifTracer(permitType == "Private Fire Line Permit", 'permitType == "Private Fire Line Permit"')){//PRIVATEFIRELINEMATERIAL
                    privFireRows = PRIVATEFIRELINEMATERIAL.length;
                    for(x in PRIVATEFIRELINEMATERIAL){
                        var col1 = PRIVATEFIRELINEMATERIAL[x]["Size of Pipe"];
                        var col2 = PRIVATEFIRELINEMATERIAL[x]["Pipe Material"];       
                        var col3 = PRIVATEFIRELINEMATERIAL[x]["Length in Lineal Feet"];
                        
                        logDebug("col1:" + col1);
                        logDebug("col2:" + col2);
                        logDebug("col3:" + col3);
                        if((col1 != null) || (col2 != null) || (col3 != null)){
                           doCancel = false;
                        }
                        else
                            doCancel = true;
                    }
                    
                    sizeRows = SIZE.length;
                    for(x in SIZE){
                        var col1 = SIZE[x]["Size"];
                        var col2 = SIZE[x]["Number of Taps"];       
                        var col3 = SIZE[x]["Location Description"];
                        var col4 = SIZE[x]["Complete"];
                        
                        logDebug("col1:" + col1 );
                        logDebug("col2:" + col2 );
                        logDebug("col3:" + col3 );
                        logDebug("col4:" + col4 );
                        if((col1 != null) || (col2 != null) || (col3 != null) || (col4 != null)){
                           doCancel = false;
                        }
                        else
                            doCancel = true;
                    }
                }
                
            }
            catch(err2){
                if(watMatRows   < minRows && sizeRows >= minRows && permitType == "Water Main Utility Permit")  { doCancel = true; rowsNeededInTable = "WATER MATERIAL"; }
                if(sizeRows     < minRows && watMatRows >= minRows && permitType == "Water Main Utility Permit")  { doCancel = true; rowsNeededInTable = "WET TAP SIZE"; }
                if(sizeRows     < minRows && watMatRows < minRows && permitType == "Water Main Utility Permit")  { doCancel = true; rowsNeededInTable = "WET TAP SIZE and WATER MATERIAL"; }
                
                if(swpRows      < minRows && permitType == "Sanitary Sewer Permit")      { doCancel = true; rowsNeededInTable = "SANITARY SEWER MATERIAL"; }
                if(psspRows     < minRows && permitType == "Public Storm Sewer Permit")  { doCancel = true; rowsNeededInTable = "PUBLIC STORM MATERIAL"; }
                if(privSspRows  < minRows && permitType == "Private Storm Sewer Permit") { doCancel = true; rowsNeededInTable = "PRIVATE STORM MATERIAL"; }
                
                if(privFireRows < minRows && sizeRows >= minRows && permitType == "Private Fire Line Permit")   { doCancel = true; rowsNeededInTable = "PRIVATE FIRE LINE MATERIAL"; }
                if(sizeRows     < minRows && privFireRows >= minRows && permitType == "Private Fire Line Permit")   { doCancel = true; rowsNeededInTable = "WET TAP SIZE"; }
                if(sizeRows     < minRows && privFireRows < minRows && permitType == "Private Fire Line Permit")   { doCancel = true; rowsNeededInTable = "WET TAP SIZE and PRIVATE FIRE LINE MATERIAL"; }
                
                logDebug("Error on wtrScript131_checkASITbefore(). Err: " + err2);
            }
            logDebug("watMatRows:" + watMatRows);
            logDebug("sizeRows:" + sizeRows)
            if(watMatRows   < minRows && sizeRows >= minRows && permitType == "Water Main Utility Permit")  { doCancel = true; rowsNeededInTable = "WATER MATERIAL"; }
            if(sizeRows     < minRows && watMatRows >= minRows && permitType == "Water Main Utility Permit")  { doCancel = true; rowsNeededInTable = "WET TAP SIZE"; }
            if(sizeRows     < minRows && watMatRows < minRows && permitType == "Water Main Utility Permit")  { doCancel = true; rowsNeededInTable = "WET TAP SIZE and WATER MATERIAL"; }
            
            if(swpRows      < minRows && permitType == "Sanitary Sewer Permit")      { doCancel = true; rowsNeededInTable = "SANITARY SEWER MATERIAL"; }
            if(psspRows     < minRows && permitType == "Public Storm Sewer Permit")  { doCancel = true; rowsNeededInTable = "PUBLIC STORM MATERIAL"; }
            if(privSspRows  < minRows && permitType == "Private Storm Sewer Permit") { doCancel = true; rowsNeededInTable = "PRIVATE STORM MATERIAL"; }
                
            if(privFireRows < minRows && sizeRows >= minRows && permitType == "Private Fire Line Permit")   { doCancel = true; rowsNeededInTable = "PRIVATE FIRE LINE MATERIAL"; }
            if(sizeRows     < minRows && privFireRows >= minRows && permitType == "Private Fire Line Permit")   { doCancel = true; rowsNeededInTable = "WET TAP SIZE"; }
            if(sizeRows     < minRows && privFireRows < minRows && permitType == "Private Fire Line Permit")   { doCancel = true; rowsNeededInTable = "WET TAP SIZE and PRIVATE FIRE LINE MATERIAL"; }
            
            if(doCancel){
                cancel = true;
                showMessage = true;
                comment("You must add at least 1 row in " + rowsNeededInTable);
            }
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function wtrScript131_checkASITbefore(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function wtrScript131_checkASITbefore(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("wtrScript131_checkASITbefore() ended");
}//END wtrScript131_checkASITbefore()
function wtrScript302_warrantyReqdNotification(){
    logDebug("wtrScript302_warrantyReqdNotification() started");
    try{
        var emlTemplate = "WUP WARRANTY WORK REQUIRED #302";
        var lpEml = getPrimLPEmailByCapId(capId);
        var applicantEml = getContactEmailAddress("Applicant", capId);
        var ownerEml = getPrimaryOwnerEmail();
        
        if(ifTracer(applicantEml, 'applicantEml')){
            var applicantObj = getContactObjsByCap(capId, "Applicant");
            var applicantFullNam = getContactName(applicantObj[0]);
            
            var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
            acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
            var recordURL = getACARecordURL(acaURLDefault);
            var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
            var reportFile = [];
		    //var punchListModel = getDocModel4Link("Warrant Work Punch List");
	        //var punchListLink = recordURL;
			var emailParams = aa.util.newHashtable();
            emailParams.put("$$ContactEmail$$", applicantEml);
            emailParams.put("$$altID$$", capIDString);
            emailParams.put("$$ContactFullName$$", applicantFullNam);
            emailParams.put("$$acaRecordUrl$$", recordURL);
            emailParams.put("$$wfComment$$", wfComment == null ? "" : wfComment);
            
			//Send email to applicant
            var sendResult = sendNotification("noreply@aurora.gov",applicantEml,"",emlTemplate,emailParams,reportFile,capID4Email);
            if (!sendResult) { logDebug("wtrScript302_warrantyReqdNotification: UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
            else { logDebug("wtrScript302_warrantyReqdNotification: Sent email notification that work order is complete to "+applicantEml)}
			//Send email to owner
            emailParams.put("$$ContactEmail$$", ownerEml);
            var sendResult = sendNotification("noreply@aurora.gov",ownerEml,"",emlTemplate,emailParams,reportFile,capID4Email);
            if (!sendResult) { logDebug("wtrScript302_warrantyReqdNotification: UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
            else { logDebug("wtrScript302_warrantyReqdNotification: Sent email notification that work order is complete to "+ownerEml)}
			//Send email to lp
            emailParams.put("$$ContactEmail$$", lpEml);
            var sendResult = sendNotification("noreply@aurora.gov",lpEml,"",emlTemplate,emailParams,reportFile,capID4Email);
            if (!sendResult) { logDebug("wtrScript302_warrantyReqdNotification: UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
            else { logDebug("wtrScript302_warrantyReqdNotification: Sent email notification that work order is complete to "+lpEml)}
        }
        
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function wtrScript302_warrantyReqdNotification(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function wtrScript302_warrantyReqdNotification(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("wtrScript302_warrantyReqdNotification() ended.");
}//END wtrScript302_warrantyReqdNotification();

