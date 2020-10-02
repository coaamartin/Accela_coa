if (currentUserID == "ACHARLTO"){
showDebug = 3;
}
comment("Beginning WTUA4RENEWTPS");
//Set CAPID (CAP id)  for test.
//Unit Test Parameters --> begin
//aa.env.setValue("PermitId1", "07WEN");
//aa.env.setValue("PermitId2", "00000");
//aa.env.setValue("PermitId3", "00005");
//set workflow task info for test.
//aa.env.setValue("WorkflowTask", "License status");	
//aa.env.setValue("WorkflowStatus", "Active");	
//aa.env.setValue("ProcessID", "10382");
//aa.env.setValue("SD_STP_NUM", "5");
//Unit Test Parameters --> end

// -------------------------------------------------------------------------------------------------
// Transaction section.
// -------------------------------------------------------------------------------------------------
var E_TRANSACTION_STATUS_PENDING = 0;
var E_TRANSACTION_STATUS_AUTHORIZED_AND_CAPTURED = 1;
var E_TRANSACTION_STATUS_AUTHORIZED = 3;
var E_TRANSACTION_STATUS_REVERSED = 4;
var E_TRANSACTION_CAPTURE_SUCCESS = 0;
var E_TRANSACTION_REVERSE_SUCCESS = 0;
var DEPARTMENT = "Economy";
var PROVIDER = "Economy";
var DATE_FORMAT = "MM/dd/yyyy HH:mm:ss";
var mailFrom = "Auto_Sender@Accela.com";
var mailCC = "brook.huang@achievo.com";
// -------------------------------------------------------------------------------------------------

var capID = getCapId();

if (isApproveEtisalatPayment(capID, 
	aa.env.getValue("WorkflowTask"), //workflow task
	aa.env.getValue("SD_STP_NUM"), //task step number
	aa.env.getValue("ProcessID"),  //process ID
	aa.env.getValue("WorkflowStatus"))) //task status
{
	// Approve authorized transactions.
	ApproveAuthorizedTransaction(capID);
}
else if (isVoidEtisalatPayment(capID, 
	aa.env.getValue("WorkflowTask"), //workflow task
	aa.env.getValue("SD_STP_NUM"), //task step number
	aa.env.getValue("ProcessID"),  //process ID
	aa.env.getValue("WorkflowStatus"))) //task status
{
	// Void authorized transactions.
	voidAuthorizedTransaction(capID, aa.messageResources.getLocalMessage("payment.gateway.review.void_transaction_for_deny"));
}

//1. Check to see if the license reviewing was approved by agency user.
if (isWorkflowApproveForReview(capID, 
	aa.env.getValue("WorkflowTask"), //workflow task
	aa.env.getValue("SD_STP_NUM"), //task step number
	aa.env.getValue("ProcessID"),  //process ID
	aa.env.getValue("WorkflowStatus"))) //task status
{
	//2. Get parent license CAPID
	var parentLicenseCAPID = getParentCapIDForReview(capID)
	aa.print("parent capid :" + parentLicenseCAPID);
	var partialCapID = getPartialCapID(capID);

	if (parentLicenseCAPID != null)
		logDebug("parentlicenseCAPID = "+parentLicenseCAPID);
	{
		// 3. Check to see if license is ready for renew.
		//if (isReadyRenew(parentLicenseCAPID))
		//{
			//3.1 Get projectScriptModel of renewal CAP.	
			renewalCapProject = getRenewalCapByParentCapIDForReview(parentLicenseCAPID);
			logDebug("renewalCapProject = "+renewalCapProject);
			if (renewalCapProject != null)
			{
				//4. Set B1PERMIT.B1_ACCESS_BY_ACA to "N" for partial CAP to not allow that it is searched by ACA user.
				aa.cap.updateAccessByACA(capID, "N");			
				//5. Set parent license to "Active"
				if (activeLicense(parentLicenseCAPID))
				{
					//6. Set renewal CAP status to "Complete"
					renewalCapProject.setStatus("Complete");
					aa.print("license(" + parentLicenseCAPID + ") is activated.");
					aa.cap.updateProject(renewalCapProject);
					//7. Copy key information from child CAP to parent CAP.
					copyKeyInfo(capID, parentLicenseCAPID);

					//8. move renew document to parent cap
					//aa.cap.transferRenewCapDocument(partialCapID, parentLicenseCAPID, false);
					//aa.print("Transfer document for renew cap. Source Cap: " + partialCapID + ", target Cap: " + parentLicenseCAPID);
					
					//9. Send approved license email to public user
					//aa.expiration.sendApprovedNoticEmailToCitizenUser(parentLicenseCAPID);
					//aa.print("send approved license email to citizen user.");
				}
			}
		}
//	}
}
else if (isWorkflowDenyForReview(capID, 
	aa.env.getValue("WorkflowTask"), //workflow task
	aa.env.getValue("SD_STP_NUM"), //task step number
	aa.env.getValue("ProcessID"),  //process ID
	aa.env.getValue("WorkflowStatus"))) //task status)
{

	//1.1. Get parent license CAPID
	var parentLicenseCAPID = getParentCapIDForReview(capID)
	aa.print("parent capid :" + parentLicenseCAPID);
	if (parentLicenseCAPID != null)
	{
		//1.2. Check to see if license is ready for renew.
		if (isReadyRenew(parentLicenseCAPID))
		{
			//1.3 Get projectScriptModel of renewal CAP.	
			renewalCapProject = getRenewalCapByParentCapIDForReview(parentLicenseCAPID);
			if (renewalCapProject != null)
			{
				//1.4 Send denied license email to public user
				aa.expiration.sendDeniedNoticeEmailToCitizenUser(parentLicenseCAPID)
				aa.print("send denied license email to citizen user.");
			}
		}
	}
}
aa.env.setValue("ScriptReturnCode", "0"); 
aa.env.setValue("ScriptReturnMessage", "WorkflowTaskUpdateAfter for Renewal process.");

function isApproveEtisalatPayment(capID, wfTask, stepNum, processID, taskStatus)
{
	if (capID == null || aa.util.instanceOfString(capID) 
		|| stepNum == null || processID == null 
		|| wfTask == null || taskStatus == null)
	{
		return false;
	}

	var taskItem = getTaskItem(capID, stepNum, processID);

	if (taskItem == null)
	{
		return false;
	}

	if (taskItem.getTaskDescription().equals(wfTask)
		&& "Approve-Payment".equals(wfTask)
		&& "Approve".equals(taskStatus))
	{
		return true;
	}

	return false;
}

function isVoidEtisalatPayment(capID, wfTask, stepNum, processID, taskStatus)
{
	if (capID == null || aa.util.instanceOfString(capID) 
		|| stepNum == null || processID == null 
		|| wfTask == null || taskStatus == null)
	{
		return false;
	}

	var taskItem = getTaskItem(capID, stepNum, processID);

	if (taskItem == null)
	{
		return false;
	}

	if (taskItem.getTaskDescription().equals(wfTask)
		&& "Approve-Payment".equals(wfTask)
		&& "Void".equals(taskStatus))
	{
		return true;
	}
	return false;
}

function isWorkflowApproveForReview(capID, wfTask, stepNum, processID, taskStatus)
{
	if (capID == null || aa.util.instanceOfString(capID) 
		|| stepNum == null || processID == null 
		|| wfTask == null || taskStatus == null)
	{
		return false;
	}
	if (wfTask.length()  == 0)
	{
		return false;
	}
	//1. Get workflow task item
	var result = aa.workflow.getTask(capID, stepNum, processID);
    if(result.getSuccess())
	{
		taskItemScriptModel = result.getOutput();
		if (taskItemScriptModel == null)
		{
			aa.print("ERROR: Failed to get workflow task with CAPID(" + capID + ") for review");
			return false;
		}
		//2. Check to see if the agency user approve renewal application .
		if (taskItemScriptModel.getTaskDescription().equals(wfTask)
			&& ("Application Review".equals(wfTask) || "City License Issued".equals(wfTask) || "License Review".equals(wfTask) || "City Final Review".equals(wfTask) || "Final Review".equals(wfTask)|| "Clerk Final Review".equals(wfTask) || "Renewal Issuance".equals(wfTask))
			&& ("Issue License".equals(taskStatus) || "Renewed".equals(taskStatus)))
		{
			return true;
		}	
		else
		{
			aa.print("Issuing license (" + wfTask +") task isn't listed in line 205");
		}
	}  
    else 
    {
      aa.print("ERROR: Failed to get workflow task(" + capID + ") for review: " + result.getErrorMessage());
    }
	return false;
}

function isWorkflowDenyForReview(capID, wfTask, stepNum, processID, taskStatus)
{
	if (capID == null || aa.util.instanceOfString(capID) 
		|| stepNum == null || processID == null 
		|| wfTask == null || taskStatus == null)
	{
		return false;
	}
	if (wfTask.length()  == 0)
	{
		return false;
	}
	//1. Get workflow task item
	var result = aa.workflow.getTask(capID, stepNum, processID);
    if(result.getSuccess())
	{
		taskItemScriptModel = result.getOutput();
		if (taskItemScriptModel == null)
		{
			aa.print("ERROR: Failed to get workflow task with CAPID(" + capID + ") for review");
			return false;
		}
		//2. Check to see if the agency user approve renewal application .
		if (taskItemScriptModel.getTaskDescription().equals(wfTask)
			&& "Renewal Status".equals(wfTask)
			&& "Denied".equals(taskStatus))
		{
			return true;
		}	
		else
		{
			aa.print("Issuing license (" + wfTask +") don't have been approved");
		}
	}  
    else 
    {
      aa.print("ERROR: Failed to get workflow task(" + capID + ") for review: " + result.getErrorMessage());
    }
	return false;
}


function isReadyRenew(capid)
{
	if (capid == null || aa.util.instanceOfString(capid))
	{
		return false;
	}
	var result = aa.expiration.isExpiredLicenses(capid);
    if(result.getSuccess())
	{
		return true;
	}  
    else 
    {
      aa.print("ERROR: Failed to get expiration with CAP(" + capid + "): " + result.getErrorMessage());
    }
	return false;
}

function getB1ExpirationScriptModel(capid)
{
	if (capid == null || aa.util.instanceOfString(capid))
	{
		return null;
	}
	var result = aa.expiration.getLicensesByCapID(capid);
    if(result.getSuccess())
	{
		return result.getOutput();
	}  
    else 
    {
      aa.print("ERROR: Failed to get expiration with CAP(" + capid + "): " + result.getErrorMessage());
      return null;
    }
}

function activeLicense(capid)
{
	if (capid == null || aa.util.instanceOfString(capid))
	{
		return false;
	}
	//1. Set status to "Active", and update expired date.
	var result = aa.expiration.activeLicensesByCapID(capid);
	if(result.getSuccess())
	{
		return true;
	}  
	else 
	{
	  aa.print("ERROR: Failed to activate License with CAP(" + capid + "): " + result.getErrorMessage());
	}
	return false;
}

function getParentCapIDForReview(capid)
{
	if (capid == null || aa.util.instanceOfString(capid))
	{
		return null;
	}
	//1. Get parent license for review
	var result = aa.cap.getProjectByChildCapID(capid, "Renewal", "Incomplete"); //incomplete was review
    if(result.getSuccess())
	{
		projectScriptModels = result.getOutput();
		if (projectScriptModels == null || projectScriptModels.length == 0)
		{
			aa.print("ERROR: Failed to get parent CAP with CAPID(" + capid + ") for review");
			return null;
		}
		//2. return parent CAPID.
		projectScriptModel = projectScriptModels[0];
		return projectScriptModel.getProjectID();
	}  
    else 
    {
      aa.print("ERROR: Failed to get parent CAP by child CAP(" + capid + ") for review: " + result.getErrorMessage());
      return null;
    }
}

function getRenewalCapByParentCapIDForReview(parentCapid)
{
	if (parentCapid == null || aa.util.instanceOfString(parentCapid))
	{
		return null;
	}
	//1. Get parent license for review
	var result = aa.cap.getProjectByMasterID(parentCapid, "Renewal", "Incomplete");
    if(result.getSuccess())
	{
		projectScriptModels = result.getOutput();
		if (projectScriptModels == null || projectScriptModels.length == 0)
		{
			aa.print("ERROR: Failed to get renewal CAP by parent CAPID(" + parentCapid + ") for review");
			return null;
		}
		//2. return parent CAPID.
		projectScriptModel = projectScriptModels[0];
		return projectScriptModel;
	}  
    else 
    {
      aa.print("ERROR: Failed to get renewal CAP by parent CAP(" + parentCapid + ") for review: " + result.getErrorMessage());
      return null;
    }
}

function copyKeyInfo(srcCapId, targetCapId)
{
	//copy ASI infomation
	copyAppSpecificInfo(srcCapId, targetCapId);
	//copy License infomation
	copyLicenseProfessional(srcCapId, targetCapId);
	//copy Address infomation
	copyAddress(srcCapId, targetCapId);
	//copy AST infomation
	copyAppSpecificTable(srcCapId, targetCapId);
	//copy Parcel infomation
	copyParcel(srcCapId, targetCapId);
	//copy People infomation
	copyPeople(srcCapId, targetCapId);
	//copy Owner infomation
	copyOwner(srcCapId, targetCapId);
	//Copy CAP condition information
	//copyCapCondition(srcCapId, targetCapId);
	//Copy additional info.
	//copyAdditionalInfo(srcCapId, targetCapId);
	//Copy Education information.
	//copyEducation(srcCapId, targetCapId);
	//Copy Continuing Education information.
	//copyContEducation(srcCapId, targetCapId);
	//Copy Examination information.
	//copyExamination(srcCapId, targetCapId);
	//Copy documents information
	var currentUserID = aa.env.getValue("CurrentUserID");
	copyRenewCapDocument(srcCapId, targetCapId ,currentUserID);
}

function copyRenewCapDocument(srcCapId, targetCapId,currentUserID)
{
	if(srcCapId != null && targetCapId != null)
	{
		aa.cap.copyRenewCapDocument(srcCapId, targetCapId,currentUserID);
	}
}

function copyEducation(srcCapId, targetCapId)
{
	if(srcCapId != null && targetCapId != null)
	{
		aa.education.copyEducationList(srcCapId, targetCapId);
	}
}

function copyContEducation(srcCapId, targetCapId)
{
	if(srcCapId != null && targetCapId != null)
	{
		aa.continuingEducation.copyContEducationList(srcCapId, targetCapId);
	}
}

function copyExamination(srcCapId, targetCapId)
{
	if(srcCapId != null && targetCapId != null)
	{
		aa.examination.copyExaminationList(srcCapId, targetCapId);
	}
}

function copyAppSpecificInfo(srcCapId, targetCapId)
{
	//1. Get Application Specific Information with source CAPID.
	var  appSpecificInfo = getAppSpecificInfo(srcCapId);
	if (appSpecificInfo == null || appSpecificInfo.length == 0)
	{
		return;
	}
	//2. Set target CAPID to source Specific Information.
	for (loopk in appSpecificInfo)
	{
		var sourceAppSpecificInfoModel = appSpecificInfo[loopk];
		
		sourceAppSpecificInfoModel.setPermitID1(targetCapId.getID1());
		sourceAppSpecificInfoModel.setPermitID2(targetCapId.getID2());
		sourceAppSpecificInfoModel.setPermitID3(targetCapId.getID3());	
		//3. Edit ASI on target CAP (Copy info from source to target)
		aa.appSpecificInfo.editAppSpecInfoValue(sourceAppSpecificInfoModel);
	}
}


function getAppSpecificInfo(capId)
{
	capAppSpecificInfo = null;
	var s_result = aa.appSpecificInfo.getByCapID(capId);
	if(s_result.getSuccess())
	{
		capAppSpecificInfo = s_result.getOutput();
		if (capAppSpecificInfo == null || capAppSpecificInfo.length == 0)
		{
			aa.print("WARNING: no appSpecificInfo on this CAP:" + capId);
			capAppSpecificInfo = null;
		}
	}
	else
	{
		aa.print("ERROR: Failed to appSpecificInfo: " + s_result.getErrorMessage());
		capAppSpecificInfo = null;	
	}
	// Return AppSpecificInfoModel[] 
	return capAppSpecificInfo;
}

function copyLicenseProfessional(srcCapId, targetCapId)
{
	//1. Get license professionals with source CAPID.
	var capLicenses = getLicenseProfessional(srcCapId);
	if (capLicenses == null || capLicenses.length == 0)
	{
		return;
	}
	//2. Get license professionals with target CAPID.
	var targetLicenses = getLicenseProfessional(targetCapId);
	//3. Check to see which licProf is matched in both source and target.
	for (loopk in capLicenses)
	{
		sourcelicProfModel = capLicenses[loopk];
		//3.1 Set target CAPID to source lic prof.
		sourcelicProfModel.setCapID(targetCapId);
		targetLicProfModel = null;
		//3.2 Check to see if sourceLicProf exist.
		if (targetLicenses != null && targetLicenses.length > 0)
		{
			for (loop2 in targetLicenses)
			{
				if (isMatchLicenseProfessional(sourcelicProfModel, targetLicenses[loop2]))
				{
					targetLicProfModel = targetLicenses[loop2];

					break;
				}
			}
		}
		//3.3 It is a matched licProf model.
		if (targetLicProfModel != null)
		{
			//3.3.1 Copy information from source to target.
			aa.licenseProfessional.copyLicenseProfessionalScriptModel(sourcelicProfModel, targetLicProfModel);
			//3.3.2 Edit licProf with source licProf information. 
			aa.licenseProfessional.editLicensedProfessional(targetLicProfModel);
		}
		//3.4 It is new licProf model.
		else
		{
			//3.4.1 Create new license professional.
			aa.licenseProfessional.createLicensedProfessional(sourcelicProfModel);
		}
	}
}

function isMatchLicenseProfessional(licProfScriptModel1, licProfScriptModel2)
{
	if (licProfScriptModel1 == null || licProfScriptModel2 == null)
	{
		return false;
	}
	if (licProfScriptModel1.getLicenseType().equals(licProfScriptModel2.getLicenseType())
		&& licProfScriptModel1.getLicenseNbr().equals(licProfScriptModel2.getLicenseNbr()))
	{
		return true;
	}
	return	false;
}

function getLicenseProfessional(capId)
{
	capLicenseArr = null;
	var s_result = aa.licenseProfessional.getLicenseProf(capId);
	if(s_result.getSuccess())
	{
		capLicenseArr = s_result.getOutput();
		if (capLicenseArr == null || capLicenseArr.length == 0)
		{
			aa.print("WARNING: no licensed professionals on this CAP:" + capId);
			capLicenseArr = null;
		}
	}
	else
	{
		aa.print("ERROR: Failed to license professional: " + s_result.getErrorMessage());
		capLicenseArr = null;	
	}
	return capLicenseArr;
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
		}
		//3.4 It is new address model.
		else
		{	
			//3.4.1 Create new address.
			aa.address.createAddressWithAPOAttribute(targetCapId, sourceAddressfModel);
		}
	}
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

function getAddress(capId)
{
	capAddresses = null;
	var s_result = aa.address.getAddressByCapId(capId);
	if(s_result.getSuccess())
	{
		capAddresses = s_result.getOutput();
		if (capAddresses == null || capAddresses.length == 0)
		{
			aa.print("WARNING: no addresses on this CAP:" + capId);
			capAddresses = null;
		}
	}
	else
	{
		aa.print("ERROR: Failed to address: " + s_result.getErrorMessage());
		capAddresses = null;	
	}
	return capAddresses;
}

function copyAppSpecificTable(srcCapId, targetCapId)
{
	var tableNameArray = getTableName(srcCapId);
	if (tableNameArray == null)
	{
		return;
	}
	for (loopk in tableNameArray)
	{
		var tableName = tableNameArray[loopk];
		//1. Get appSpecificTableModel with source CAPID
		var targetAppSpecificTable = getAppSpecificTable(srcCapId,tableName);
		
		//2. Edit AppSpecificTableInfos with target CAPID
		var aSTableModel = null;
		if(targetAppSpecificTable == null)
		{
			return;
		}
		else
		{
		    aSTableModel = targetAppSpecificTable.getAppSpecificTableModel();
		}
		aa.appSpecificTableScript.editAppSpecificTableInfos(aSTableModel,
								targetCapId,
								null);
	}
	
}

function getTableName(capId)
{
	var tableName = null;
	var result = aa.appSpecificTableScript.getAppSpecificGroupTableNames(capId);
	if(result.getSuccess())
	{
		tableName = result.getOutput();
		if(tableName!=null)
		{
			return tableName;
		}
	}
	return tableName;
}

function getAppSpecificTable(capId,tableName)
{
	appSpecificTable = null;
	var s_result = aa.appSpecificTableScript.getAppSpecificTableModel(capId,tableName);
	if(s_result.getSuccess())
	{
		appSpecificTable = s_result.getOutput();
		if (appSpecificTable == null || appSpecificTable.length == 0)
		{
			aa.print("WARNING: no appSpecificTable on this CAP:" + capId);
			appSpecificTable = null;
		}
	}
	else
	{
		aa.print("ERROR: Failed to appSpecificTable: " + s_result.getErrorMessage());
		appSpecificTable = null;	
	}
	return appSpecificTable;
}

function copyParcel(srcCapId, targetCapId)
{
	//1. Get parcels with source CAPID.
	var copyParcels = getParcel(srcCapId);
	if (copyParcels == null || copyParcels.length == 0)
	{
		return;
	}
	//2. Get parcel with target CAPID.
	var targetParcels = getParcel(targetCapId);
	//3. Check to see which parcel is matched in both source and target.
	for (i = 0; i < copyParcels.size(); i++)
	{
		sourceParcelModel = copyParcels.get(i);
		//3.1 Set target CAPID to source parcel.
		sourceParcelModel.setCapID(targetCapId);
		targetParcelModel = null;
		//3.2 Check to see if sourceParcel exist.
		if (targetParcels != null && targetParcels.size() > 0)
		{
			for (j = 0; j < targetParcels.size(); j++)
			{
				if (isMatchParcel(sourceParcelModel, targetParcels.get(j)))
				{
					targetParcelModel = targetParcels.get(j);
					break;
				}
			}
		}
		//3.3 It is a matched parcel model.
		if (targetParcelModel != null)
		{
			//3.3.1 Copy information from source to target.
			var tempCapSourceParcel = aa.parcel.warpCapIdParcelModel2CapParcelModel(targetCapId, sourceParcelModel).getOutput();
			var tempCapTargetParcel = aa.parcel.warpCapIdParcelModel2CapParcelModel(targetCapId, targetParcelModel).getOutput();
			aa.parcel.copyCapParcelModel(tempCapSourceParcel, tempCapTargetParcel);
			//3.3.2 Edit parcel with sourceparcel. 
			aa.parcel.updateDailyParcelWithAPOAttribute(tempCapTargetParcel);
		}
		//3.4 It is new parcel model.
		else
		{
			//3.4.1 Create new parcel.
			aa.parcel.createCapParcelWithAPOAttribute(aa.parcel.warpCapIdParcelModel2CapParcelModel(targetCapId, sourceParcelModel).getOutput());
		}
	}
}

function isMatchParcel(parcelScriptModel1, parcelScriptModel2)
{
	if (parcelScriptModel1 == null || parcelScriptModel2 == null)
	{
		return false;
	}
	if (parcelScriptModel1.getParcelNumber().equals(parcelScriptModel2.getParcelNumber()))
	{
		return true;
	}
	return	false;
}

function getParcel(capId)
{
	capParcelArr = null;
	var s_result = aa.parcel.getParcelandAttribute(capId, null);
	if(s_result.getSuccess())
	{
		capParcelArr = s_result.getOutput();
		if (capParcelArr == null || capParcelArr.length == 0)
		{
			aa.print("WARNING: no parcel on this CAP:" + capId);
			capParcelArr = null;
		}
	}
	else
	{
		aa.print("ERROR: Failed to parcel: " + s_result.getErrorMessage());
		capParcelArr = null;	
	}
	return capParcelArr;
}

function copyPeople(srcCapId, targetCapId)
{
	//1. Get people with source CAPID.
	var capPeoples = getPeople(srcCapId);
	if (capPeoples == null || capPeoples.length == 0)
	{
		return;
	}
	//2. Get people with target CAPID.
	var targetPeople = getPeople(targetCapId);
	//3. Check to see which people is matched in both source and target.
	for (loopk in capPeoples)
	{
		sourcePeopleModel = capPeoples[loopk];
		//3.1 Set target CAPID to source people.
		sourcePeopleModel.getCapContactModel().setCapID(targetCapId);
		targetPeopleModel = null;
		//3.2 Check to see if sourcePeople exist.
		if (targetPeople != null && targetPeople.length > 0)
		{
			for (loop2 in targetPeople)
			{
				if (isMatchPeople(sourcePeopleModel, targetPeople[loop2]))
				{
					targetPeopleModel = targetPeople[loop2];
					break;
				}
			}
		}
		//3.3 It is a matched people model.
		if (targetPeopleModel != null)
		{
			//3.3.1 Copy information from source to target.
			aa.people.copyCapContactModel(sourcePeopleModel.getCapContactModel(), targetPeopleModel.getCapContactModel());
			//3.3.2 Edit People with source People information. 
			aa.people.editCapContactWithAttribute(targetPeopleModel.getCapContactModel());
		}
		//3.4 It is new People model.
		else
		{
			//3.4.1 Create new people.
			aa.people.createCapContactWithAttribute(sourcePeopleModel.getCapContactModel());
		}
	}
}

function isMatchPeople(capContactScriptModel, capContactScriptModel2)
{
	if (capContactScriptModel == null || capContactScriptModel2 == null)
	{
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
	if ((contactType1 == null && contactType2 != null) 
		|| (contactType1 != null && contactType2 == null))
	{
		return false;
	}
	if (contactType1 != null && !contactType1.equals(contactType2))
	{
		return false;
	}
	if ((firstName1 == null && firstName2 != null) 
		|| (firstName1 != null && firstName2 == null))
	{
		return false;
	}
	if (firstName1 != null && !firstName1.equals(firstName2))
	{
		return false;
	}
	if ((lastName1 == null && lastName2 != null) 
		|| (lastName1 != null && lastName2 == null))
	{
		return false;
	}
	if (lastName1 != null && !lastName1.equals(lastName2))
	{
		return false;
	}
	if ((fullName1 == null && fullName2 != null) 
		|| (fullName1 != null && fullName2 == null))
	{
		return false;
	}
	if (fullName1 != null && !fullName1.equals(fullName2))
	{
		return false;
	}
	return	true;
}

function getPeople(capId)
{
	capPeopleArr = null;
	var s_result = aa.people.getCapContactByCapID(capId);
	if(s_result.getSuccess())
	{
		capPeopleArr = s_result.getOutput();
		if (capPeopleArr == null || capPeopleArr.length == 0)
		{
			aa.print("WARNING: no People on this CAP:" + capId);
			capPeopleArr = null;
		}
	}
	else
	{
		aa.print("ERROR: Failed to People: " + s_result.getErrorMessage());
		capPeopleArr = null;	
	}
	return capPeopleArr;
}

function copyOwner(srcCapId, targetCapId)
{
	//1. Get Owners with source CAPID.
	var capOwners = getOwner(srcCapId);
	if (capOwners == null || capOwners.length == 0)
	{
		return;
	}
	//2. Get Owners with target CAPID.
	var targetOwners = getOwner(targetCapId);
	//3. Check to see which owner is matched in both source and target.
	for (loopk in capOwners)
	{
		sourceOwnerModel = capOwners[loopk];
		//3.1 Set target CAPID to source Owner.
		sourceOwnerModel.setCapID(targetCapId);
		targetOwnerModel = null;
		//3.2 Check to see if sourceOwner exist.
		if (targetOwners != null && targetOwners.length > 0)
		{
			for (loop2 in targetOwners)
			{
				if (isMatchOwner(sourceOwnerModel, targetOwners[loop2]))
				{
					targetOwnerModel = targetOwners[loop2];
					break;
				}
			}
		}
		//3.3 It is a matched owner model.
		if (targetOwnerModel != null)
		{
			//3.3.1 Copy information from source to target.
			aa.owner.copyCapOwnerModel(sourceOwnerModel, targetOwnerModel);
			//3.3.2 Edit owner with source owner information. 
			aa.owner.updateDailyOwnerWithAPOAttribute(targetOwnerModel);
		}
		//3.4 It is new owner model.
		else
		{
			//3.4.1 Create new Owner.
			aa.owner.createCapOwnerWithAPOAttribute(sourceOwnerModel);
		}
	}
}

function isMatchOwner(ownerScriptModel1, ownerScriptModel2)
{
	if (ownerScriptModel1 == null || ownerScriptModel2 == null)
	{
		return false;
	}
	var fullName1 = ownerScriptModel1.getOwnerFullName();
	var fullName2 = ownerScriptModel2.getOwnerFullName();
	if ((fullName1 == null && fullName2 != null) 
		|| (fullName1 != null && fullName2 == null))
	{
		return false;
	}
	if (fullName1 != null && !fullName1.equals(fullName2))
	{
		return false;
	}
	return	true;
}

function getOwner(capId)
{
	capOwnerArr = null;
	var s_result = aa.owner.getOwnerByCapId(capId);
	if(s_result.getSuccess())
	{
		capOwnerArr = s_result.getOutput();
		if (capOwnerArr == null || capOwnerArr.length == 0)
		{
			aa.print("WARNING: no Owner on this CAP:" + capId);
			capOwnerArr = null;
		}
	}
	else
	{
		aa.print("ERROR: Failed to Owner: " + s_result.getErrorMessage());
		capOwnerArr = null;	
	}
	return capOwnerArr;
}

function copyCapCondition(srcCapId, targetCapId)
{
	//1. Get Cap condition with source CAPID.
	var capConditions = getCapConditionByCapID(srcCapId);
	if (capConditions == null || capConditions.length == 0)
	{
		return;
	}
	//2. Get Cap condition with target CAPID.
	var targetCapConditions = getCapConditionByCapID(targetCapId);
	//3. Check to see which Cap condition is matched in both source and target.
	for (loopk in capConditions)
	{
		sourceCapCondition = capConditions[loopk];
		//3.1 Set target CAPID to source Cap condition.
		sourceCapCondition.setCapID(targetCapId);
		targetCapCondition = null;
		//3.2 Check to see if source Cap condition exist in target CAP. 
		if (targetCapConditions != null && targetCapConditions.length > 0)
		{
			for (loop2 in targetCapConditions)
			{
				if (isMatchCapCondition(sourceCapCondition, targetCapConditions[loop2]))
				{
					targetCapCondition = targetCapConditions[loop2];
					break;
				}
			}
		}
		//3.3 It is a matched Cap condition model.
		if (targetCapCondition != null)
		{
			//3.3.1 Copy information from source to target.
			sourceCapCondition.setConditionNumber(targetCapCondition.getConditionNumber());
			//3.3.2 Edit Cap condition with source Cap condition information. 
			aa.capCondition.editCapCondition(sourceCapCondition);
		}
		//3.4 It is new Cap condition model.
		else
		{
			//3.4.1 Create new Cap condition.
			aa.capCondition.createCapCondition(sourceCapCondition);
		}
	}
}

function isMatchCapCondition(capConditionScriptModel1, capConditionScriptModel2)
{
	if (capConditionScriptModel1 == null || capConditionScriptModel2 == null)
	{
		return false;
	}
	var description1 = capConditionScriptModel1.getConditionDescription();
	var description2 = capConditionScriptModel2.getConditionDescription();
	if ((description1 == null && description2 != null) 
		|| (description1 != null && description2 == null))
	{
		return false;
	}
	if (description1 != null && !description1.equals(description2))
	{
		return false;
	}
	var conGroup1 = capConditionScriptModel1.getConditionGroup();
	var conGroup2 = capConditionScriptModel2.getConditionGroup();
	if ((conGroup1 == null && conGroup2 != null) 
		|| (conGroup1 != null && conGroup2 == null))
	{
		return false;
	}
	if (conGroup1 != null && !conGroup1.equals(conGroup2))
	{
		return false;
	}
	return true;
}

function getCapConditionByCapID(capId)
{
	capConditionScriptModels = null;
	
	var s_result = aa.capCondition.getCapConditions(capId);
	if(s_result.getSuccess())
	{
		capConditionScriptModels = s_result.getOutput();
		if (capConditionScriptModels == null || capConditionScriptModels.length == 0)
		{
			aa.print("WARNING: no cap condition on this CAP:" + capId);
			capConditionScriptModels = null;
		}
	}
	else
	{
		aa.print("ERROR: Failed to get cap condition: " + s_result.getErrorMessage());
		capConditionScriptModels = null;	
	}
	return capConditionScriptModels;
}

function copyAdditionalInfo(srcCapId, targetCapId)
{
	//1. Get Additional Information with source CAPID.  (BValuatnScriptModel)
	var  additionalInfo = getAdditionalInfo(srcCapId);
	if (additionalInfo == null)
	{
		return;
	}
	//2. Get CAP detail with source CAPID.
	var  capDetail = getCapDetailByID(srcCapId);
	//3. Set target CAP ID to additional info.
	additionalInfo.setCapID(targetCapId);
	if (capDetail != null)
	{
		capDetail.setCapID(targetCapId);
	}
	//4. Edit or create additional infor for target CAP.
	aa.cap.editAddtInfo(capDetail, additionalInfo);
}

//Return BValuatnScriptModel for additional info.
function getAdditionalInfo(capId)
{
	bvaluatnScriptModel = null;
	var s_result = aa.cap.getBValuatn4AddtInfo(capId);
	if(s_result.getSuccess())
	{
		bvaluatnScriptModel = s_result.getOutput();
		if (bvaluatnScriptModel == null)
		{
			aa.print("WARNING: no additional info on this CAP:" + capId);
			bvaluatnScriptModel = null;
		}
	}
	else
	{
		aa.print("ERROR: Failed to get additional info: " + s_result.getErrorMessage());
		bvaluatnScriptModel = null;	
	}
	// Return bvaluatnScriptModel
	return bvaluatnScriptModel;
}

function getCapDetailByID(capId)
{
	capDetailScriptModel = null;
	var s_result = aa.cap.getCapDetail(capId);
	if(s_result.getSuccess())
	{
		capDetailScriptModel = s_result.getOutput();
		if (capDetailScriptModel == null)
		{
			aa.print("WARNING: no cap detail on this CAP:" + capId);
			capDetailScriptModel = null;
		}
	}
	else
	{
		aa.print("ERROR: Failed to get cap detail: " + s_result.getErrorMessage());
		capDetailScriptModel = null;	
	}
	// Return capDetailScriptModel
	return capDetailScriptModel;
}


function getCapId()  
{
    var id1 = aa.env.getValue("PermitId1");
    var id2 = aa.env.getValue("PermitId2");
    var id3 = aa.env.getValue("PermitId3");

    var s_capResult = aa.cap.getCapIDModel(id1, id2, id3);
    if(s_capResult.getSuccess())
	{
      return s_capResult.getOutput();
	}  
    else 
    {
      aa.print("ERROR: Failed to get capId: " + s_capResult.getErrorMessage());
      return null;
    }
}

function getTaskItem(capID, stepNum, processID)
{
	var taskItemScriptModel = null;
	var result = aa.workflow.getTask(capID, stepNum, processID);
	if(result.getSuccess())
	{
		taskItemScriptModel = result.getOutput();
		if (taskItemScriptModel == null)
		{
			aa.print("ERROR: Failed to get workflow task with CAPID(" + capID + ")");
		}
	}  
	else 
	{
		aa.print("ERROR: Failed to get workflow task(" + capID + ") for review: " + result.getErrorMessage());
	}

	return taskItemScriptModel;
}

// -------------------------------------------------------------------------------------------------
// Transaction section.
// -------------------------------------------------------------------------------------------------

/**
 * Iterator to approve all authorized transactions.
 * 1. Capture Etisalat transactions.
 * 2. Void all authorized transactions if capture is failed.
 * 3. Approve local transactions if capture is success.
 * 4. Reverse all authorized transactions if approve is failed.
 * 5. Send remider email if capture is success.
 */
function ApproveAuthorizedTransaction(capID)
{
	var entityID = capID.toString();
	var authorizedTransactions = getAllAuthorizedTransactions(entityID);
	aa.log("Start to approve authorized transactions.");
	aa.log("CAP ID: " + entityID);
	if (authorizedTransactions == null || authorizedTransactions.length == 0)
	{
		aa.log("Not any authorized transaction found for this CAP: " + entityID);
		return false;
	}
	aa.log("Transaction size: " + authorizedTransactions.length);

	aa.log("Iterate transactions.");
	// Iterate all authorized transactions of this CAP to approve.
	for (var i = 0; i < authorizedTransactions.length; i++)
	{
		var condidateTrans = authorizedTransactions[i];
		var consolidatorID = condidateTrans.getProcTransID();
		var publicUserSeq = condidateTrans.getClientNumber();
		aa.log("ConsolidatorID: " + consolidatorID);
		aa.log("publicUserSeq: " + publicUserSeq);
		// 1. Capture Etisalat transactions.
		if (!captureTransaction(consolidatorID))
		{
			aa.log("Capture Etisalat transaction failed, start to reverse all authorized transactions.");
			// 2. Reverse all authorized transactions if capture is failed.
			voidAuthorizedTransaction(capID, aa.messageResources.getLocalMessage("payment.gateway.review.void_transaction_for_capture_failed"));
			return false;
		}

		var publicUser = getPublicUser(publicUserSeq);
		var transactions = getTransactionsByConIDAndEntityID(consolidatorID, entityID);
		// 3. Approve local transactions if capture is success.
		if (!approveLocalTransAfterCapture(consolidatorID, transactions))
		{
			aa.log("Approve local transaction failed, start to reverse all authorized transactions.");
			// 4. Reverse all authorized transactions if approve is failed.
			voidAuthorizedTransaction(capID, aa.messageResources.getLocalMessage("payment.gateway.review.void_transaction_for_approve_failed"));
			return false;
		}

		// 5. Send remider email if capture is success.
		sendRemiderEmailAfterApprove(consolidatorID, publicUser, transactions, capID);
	}

	return true;
}

/**
 * Iterator to void all authorized transactions.
 * 1. Void transactions.
 *    a) Reverse Etisalat transactions.
 *    b) Void local transactions if reverse is success.
 *    c) Cancel local transaction if reverse is failed.
 * 2. Void payment.
 * 3. Send remider email if capture is success.
 */
function voidAuthorizedTransaction(capID, voidReason)
{
	var entityID = capID.toString();
	var customID = getCustomID(capID);
	capID.setCustomID(customID);
	var authorizedTransactions = getAllAuthorizedTransactions(entityID);
	aa.log("Start to reverse authorized transactions.");
	aa.log("CAP ID: " + entityID);
	if (authorizedTransactions == null || authorizedTransactions.length == 0)
	{
		aa.log("Not any authorized transaction found for this CAP: " + entityID);
		return false;
	}

	aa.log("Transaction size: " + authorizedTransactions.length);
	aa.log("Iterate transactions.");
	for (var i = 0; i < authorizedTransactions.length; i++)
	{
		var condidateTrans = authorizedTransactions[i];
		var consolidatorID = condidateTrans.getProcTransID();
		var batchNumber = condidateTrans.getBatchTransCode();
		var publicUserSeq = condidateTrans.getClientNumber();
		aa.log("ConsolidatorID: " + consolidatorID);
		aa.log("publicUserSeq: " + publicUserSeq);
		var publicUser = getPublicUser(publicUserSeq);
		var transactions = getTransactionsByConIDAndEntityID(consolidatorID, entityID);
		// 1. Void transactions.
		doVoid(consolidatorID, transactions);
		// 2. Void payment.
		doVoidPayment(capID, batchNumber);
		// 3. Send remider email if capture is success.
		sendRemiderEmailAfterVoid(consolidatorID, publicUser, transactions, capID, voidReason);
	}

	return true;
}

function sendRemiderEmailAfterApprove(consolidatorID, publicUser, transactions, capIDModel)
{
	var capModel = getCAPModel(capIDModel);
	capIDModel = capModel.getCapID();
	var agencyTransaction = getAgencyTransaction(transactions);
	var capType = null;
	var capTypeModelResult = aa.cap.getCapTypeModelByCapID(capIDModel);
	if (capTypeModelResult.getSuccess())
	{
		capType = capTypeModelResult.getOutput().getAlias();
	}
	else
	{
		aa.log("Get CAP type failed, set CAP type to empty.");
		aa.log(capTypeModelResult.getErrorMessage());
		capType = "";
	}
	var expireDate = aa.util.formatDate(aa.util.dateDiff(agencyTransaction.getAuditDate(), "DAY", getexpireDay()), DATE_FORMAT);
	
	var subjectParameters = aa.util.newHashtable(); 
	var contentParameters = aa.util.newHashtable();
	
	addParameter(contentParameters, "$$servProvCode$$", agencyTransaction.getServiceProviderCode());
	addParameter(contentParameters, "$$capID$$", capIDModel.getCustomID());
	addParameter(contentParameters, "$$capType$$", capType);
	addParameter(contentParameters, "$$FirstName$$", publicUser.getFirstName());
	addParameter(contentParameters, "$$LastName$$", publicUser.getLastName());
	addParameter(contentParameters, "$$mmddyy$$", expireDate);
	sendEmail(mailFrom, publicUser.getEmail(), mailCC, "ACA_EMAIL_ETISALAT_PAYMENT_COMPLETION_SUCCEEDED_SUBJECT", subjectParameters, "ACA_EMAIL_ETISALAT_PAYMENT_COMPLETION_SUCCEEDED_CONTENT", contentParameters);
}

function sendRemiderEmailAfterVoid(consolidatorID, publicUser, transactions, capIDModel, voidReason)
{
	var capModel = getCAPModel(capIDModel);
	capIDModel = capModel.getCapID();
	var paymentAmount = getTotalTransactionFee(transactions);
	var agencyTransaction = getAgencyTransaction(transactions);
	var auditDate = aa.util.formatDate(agencyTransaction.getAuditDate(), DATE_FORMAT);
	var capType = null;
	var capTypeResult = aa.cap.getCapTypeModelByCapID(capIDModel); 
	if (capTypeResult.getSuccess())
	{
		capType = capTypeResult.getOutput().getAlias();
		aa.log("Get CAP type successful: " + capType);
	}
	else
	{
		aa.log("Get CAP type model failed, set CAP type to empty.");
		aa.log(capTypeResult.getErrorMessage());
		capType = "";
	}
	var expireDate = aa.util.formatDate(aa.util.dateDiff(agencyTransaction.getAuditDate(), "DAY", getexpireDay()), DATE_FORMAT);

	var subjectParameters = aa.util.newHashtable(); 
	var contentParameters = aa.util.newHashtable();
	
	addParameter(contentParameters, "$$servProvCode$$", agencyTransaction.getServiceProviderCode());
	addParameter(contentParameters, "$$Date$$", auditDate);
	addParameter(contentParameters, "$$Amount$$", aa.util.formatFee(paymentAmount));
	addParameter(contentParameters, "$$capID$$", capIDModel.getCustomID());
	addParameter(contentParameters, "$$capType$$", capType);
	addParameter(contentParameters, "$$FirstName$$", publicUser.getFirstName());
	addParameter(contentParameters, "$$LastName$$", publicUser.getLastName());
	addParameter(contentParameters, "$$mmddyy$$", expireDate);
	addParameter(contentParameters, "$$processResult$$", voidReason);
	sendEmail(mailFrom, publicUser.getEmail(), mailCC, "ACA_EMAIL_ETISALAT_PAYMENT_COMPLETION_FAILED_SUBJECT", subjectParameters, "ACA_EMAIL_ETISALAT_PAYMENT_COMPLETION_FAILED_CONTENT", contentParameters);
}

/**
 * 1. Get out cashier session.
 * 2. Get out all related payments by batch number.
 * 3. Iterate all payments to void them.
 */
function doVoidPayment(capID, batchNumber)
{
	// 1. Get out cashier session.
	var cashierSessionResult = aa.finance.getCashierSessionFromDB();
	var cashierSession = null;
	if (cashierSessionResult.getSuccess())
	{
		aa.log("Get cashier session from database success.");
		cashierSession = cashierSessionResult.getOutput();
	}
	else
	{
		aa.log("Get cashier session from database failed.");
		aa.log(cashierSessionResult.getErrorMessage());
	}

	// 2. Get out all related payments by batch number.
	var payments = getPaymentByBatchNumber(batchNumber);
	if (payments == null || payments.length == 0)
	{
		aa.log("None of payment related with batch number (" + batchNumber + ").");
	}

	aa.log("payments size: " + payments.length);
	// 3. Iterate all payments to void them.
	for(var i = 0; i < payments.length; i++)
	{
		var condidatePayment = payments[i];
		var sessionNbr = "0";
		var paymentModel = aa.finance.createPaymentScriptModel();
		paymentModel.setPaymentSeqNbr(condidatePayment.getPaymentSeqNbr());
		paymentModel.setPaymentStatus("VOIDED");
		paymentModel.setPaymentComment("Transaction has be deny via workflow.");
		aa.log("Start to void payment (" + condidatePayment.getPaymentSeqNbr() + ")");
		if (cashierSession != null)
		{
			aa.log("Use cashier session from database to void payment.");
			sessionNbr = cashierSession.getSessionNumber();
			paymentModel.setCashierID(cashierSession.getUserID());
			paymentModel.setWorkstationID(cashierSession.getWorkstationID());
			paymentModel.setTerminalID(cashierSession.getTerminalID());
			paymentModel.setRegisterNbr(cashierSession.getTerminalID());
		}
		else
		{
			paymentModel.setCashierID(aa.getAuditID());
			aa.log("No available cashier session for this void payment.");
		}
		var voidResult = aa.finance.voidPayment(capID, paymentModel, sessionNbr);
		if (voidResult.getSuccess())
		{
			aa.log("Void payment success.");
		}
		else
		{
			aa.log("Void payment failed.");
			aa.log(voidResult.getErrorMessage());
		}
	}
}

/**
 * 1. Reverse Etisalat transaction.
 * 2. Update local transaction if preview reverse success.
 */
function doVoid(consolidatorID, transactions)
{
	aa.log("Do void: Void Etisalat transaction.");
	
	var transactionStatusCode = null;
	var transactionStatus = null;
	var enquireRespondString = enquireEtisalatTransaction(consolidatorID);
	if (enquireRespondString != null)
	{
		transactionStatusCode = aa.util.getValueFromXML("Status", enquireRespondString);
		transactionStatus = aa.util.getValueFromXML("StatusDescription", enquireRespondString);		
	}
	
	var reverseRespondString = reverseEtisalatTransaction(consolidatorID);
	var reverseStatusCode = reverseRespondString == null ? null : aa.util.getValueFromXML("Status", reverseRespondString);
	var reverseResultMessage = reverseRespondString == null ? null : aa.util.getValueFromXML("StatusDescription", reverseRespondString);
	
	if (E_TRANSACTION_REVERSE_SUCCESS != reverseStatusCode)
	{
		reverseResultMessage = "Failed to void transaction in status: " + transactionStatus + ", " + reverseResultMessage;
		cancelAuthorizedTransaction(transactions, reverseResultMessage);
		return;
	}
	
	if (reverseResultMessage != null)
	{
		reverseResultMessage = "Voided - " + reverseResultMessage;
	}
	for (var i = 0; i < transactions.length; i++)
	{			
		transactions[i].setStatus("Voided");
		transactions[i].setProcResult(reverseStatusCode);
		transactions[i].setProcRespMsg(reverseResultMessage);
		aa.finance.updateETransaction4ACA(transactions[i]);
	}
}

function approveLocalTransAfterCapture(consolidatorID, transactions)
{
	var enquireRespondString = enquireEtisalatTransaction(consolidatorID);
	var enquireStatus = aa.util.getValueFromXML("Status", enquireRespondString);
	aa.log("Etisalat transaction status: " + enquireStatus);
	if (E_TRANSACTION_STATUS_AUTHORIZED_AND_CAPTURED != enquireStatus)
	{
		aa.log("Invalid Etisalat transaction status for approve.");
		return false;
	}
	
	var gateWayTransactionID = aa.util.getValueFromXML("PaymentGatewayTransactionID", enquireRespondString);
	var bankAuthorCode = aa.util.getValueFromXML("BankAuthorizationCode", enquireRespondString);

	aa.log("Start to approve transaction.");
	for (var i = 0; i < transactions.length; i++)
	{
		transactions[i].setGateWayTransactionID(gateWayTransactionID);
		transactions[i].setAuthCode(bankAuthorCode);
		transactions[i].setStatus("Approved");
		aa.finance.updateETransaction4ACA(transactions[i]);
	}
	aa.log("Commit OK: Approve local transaction succeed.");
	
	return true;
}

function cancelAuthorizedTransaction(transactions, cancelReason)
{
	aa.log("Start to cancel authorized transactions.");
	for (var i = 0; i < transactions.length; i++)
	{
		if (transactions[i].getStatus() != "Authorized")
		{
			continue;
		}
		
		transactions[i].setStatus("Failed");
		transactions[i].setProcRespMsg(cancelReason);
		aa.finance.updateETransaction4ACA(transactions[i]);
		aa.log("Cancel authorized transactions: " + transactions[i].getTransactionNumber());
		aa.log("For reason: " + cancelReason);
	}
}

function captureTransaction(consolidatorID)
{
	var captureRespondString = captureEtisalatTransaction(consolidatorID);
	var captureStatus = aa.util.getValueFromXML("Status", captureRespondString);
	return (E_TRANSACTION_CAPTURE_SUCCESS == captureStatus);
}

function getOnlinePaymentWebService()
{
	var onlinePaymentWebServiceResult = aa.proxyInvoker.newInstance("com.accela.epayment.wsclient.PaymentClientImpl");
	if (!onlinePaymentWebServiceResult.getSuccess())
	{
		aa.log("Error occurs during fetch web service client.\n");
		aa.log(onlinePaymentWebServiceResult.getErrorMessage());		
	}
	return onlinePaymentWebServiceResult.getOutput();
}

function enquireEtisalatTransaction(consolidatorID)
{
	aa.log("Enquire Etisalat transaction.");
	var onlinePaymentWebService = getOnlinePaymentWebService();
	if (onlinePaymentWebService == null)
	{
		return null;
	}
	var enquireReqestString = "<Enquire><Customer>" + DEPARTMENT + "</Customer><ConsolidatorID>" + consolidatorID + "</ConsolidatorID></Enquire>";
	aa.log("Start to enquire Etisalat transaction: " + enquireReqestString);
	var enquireRespondString = onlinePaymentWebService.enquire(enquireReqestString);
	aa.log("Online payment web service respond result: " + enquireRespondString);

	return enquireRespondString;
}

function captureEtisalatTransaction(consolidatorID)
{
	var onlinePaymentWebService = getOnlinePaymentWebService();
	if (onlinePaymentWebService == null)
	{
		return null;
	}
	var captureRequestString = "<CaptureTransaction><Customer>" + DEPARTMENT + "</Customer><ConsolidatorID>" + consolidatorID + "</ConsolidatorID></CaptureTransaction >";
	aa.log("Start to capture Etisalat transaction: " + captureRequestString);
	var captureRespondString = onlinePaymentWebService.captureTransaction(captureRequestString);
	aa.log("Online payment web service respond result: " + captureRespondString);
	
	return captureRespondString;
}

function reverseEtisalatTransaction(consolidatorID)
{
	aa.log("Reverse Etisalat transaction.");
	var onlinePaymentWebService = getOnlinePaymentWebService();
	if (onlinePaymentWebService == null)
	{
		return null;
	}
	var reverseReqestString = "<ReverseTransaction><Customer>" + DEPARTMENT + "</Customer><ConsolidatorID>" + consolidatorID + "</ConsolidatorID></ReverseTransaction>";
	aa.log("Start to reverse Etisalat transaction: " + reverseReqestString);
	var reverseRespondString = onlinePaymentWebService.reverseTransaction(reverseReqestString);
	aa.log("Online payment web service respond result: " + reverseRespondString);

	return reverseRespondString;
}

function getAllAuthorizedTransactions(entityID)
{
	var transSearchModel = aa.finance.createTransactionScriptModel();	
	transSearchModel.setProvider(PROVIDER);
	transSearchModel.setStatus("Authorized");
	transSearchModel.setFeeType("Permit");
	transSearchModel.setEntityID(entityID);
	transSearchModel.setAuditStatus("A");
	
	return searchTransactions(transSearchModel);
}

function getTransactionsByConIDAndEntityID(consolidatorID, entityID)
{
	var transSearchModel = aa.finance.createTransactionScriptModel();	
	transSearchModel.setProvider(PROVIDER);
	transSearchModel.setEntityID(entityID);
	transSearchModel.setProcTransID(consolidatorID);
	transSearchModel.setAuditStatus("A");
	
	return searchTransactions(transSearchModel);
}

function searchTransactions(transSearchModel)
{
	var searchResult = null;
	transSearchResult = aa.finance.getETransaction(transSearchModel, null);
	if (transSearchResult.getSuccess())
	{
		searchResult = transSearchResult.getOutput();
	}
	else
	{
		aa.log("Error occur during searching transaction: " + transSearchResult.getErrorMessage());
	}
	
	return searchResult;
}

function getPublicUser(publicUserSeq)
{
	aa.log("Init: Find out public user model.");
	var publicUser = null;
	var publicUserResult = aa.publicUser.getPublicUser(publicUserSeq);
	if (!publicUserResult.getSuccess())
	{
		aa.log("Error occur during finding public user.");
		aa.log(publicUserResult.getErrorMessage());
		return null;
	}
	
	publicUser = publicUserResult.getOutput();
	if (publicUser == null)
	{
		aa.log("Non invalid public user found: " + publicUserSeq);
		return null;
	}
	
	aa.log("Public user name: " + publicUser.getUserID());
	
	return publicUser;
}

function getTotalTransactionFee(transactions)
{
	if (transactions == null || transactions.length == 0)
	{
		return 0.00;
	}
	
	var paymentAmount = 0.00;
	for (var i = 0; i < transactions.length; i++)
	{
		paymentAmount = aa.util.add(paymentAmount, transactions[i].getTotalFee().doubleValue());
	}
	
	return paymentAmount;
}

function getAgencyTransaction(transactions)
{
	var agencyTransaction = null;
	for (var i = 0; i < transactions.length; i++)
	{
		if ("Permit" == transactions[i].getFeeType())
		{
			agencyTransaction = transactions[i];
			aa.log("Agency transaction: " + agencyTransaction.getTransactionNumber());
		}
	}
	
	if (agencyTransaction == null)
	{
		aa.log("Non invalid agency transaction found with consolidator ID: " + consolidatorID);
		return null;
	}

	return agencyTransaction;
}

function getexpireDay()
{
	var bizResult = aa.bizDomain.getBizDomainByValue("ACA_ONLINE_PAYMENT_WEBSERVICE", "EXPIRATION_DAYS");
	var expireDay = null;
	if (bizResult.getSuccess())
	{
		var biz = bizResult.getOutput();
		aa.log("Expired day biz value: " + biz);
		if(biz == null || biz.getDescription() == "")
		{
			aa.log("WARNING: The expire day isn't set-up, it will be set as 3 day!");
			expireDay = "3";
		}
		else
		{
			expireDay = biz.getDescription();
			aa.log("The expire day is :" + expireDay);
		}
	}
	else
	{
		aa.log("WARNING: Exception occurs during fetch expire day, it will be set as 3 day!\n");
		aa.log(bizResult.getErrorMessage());
		expireDay = "3";
	}
	
	try
	{
		expireDay = aa.util.parseLong(expireDay);
	}
	catch (e)
	{
		aa.log("WARNING: Exception occurs, it will be set as 3 day!\n");
		aa.log(e);
		expireDay = 3;
	}
	
	return expireDay;
}

// Add value to map.
function addParameter(pamaremeters, key, value)
{
	if(key != null)
	{
		if(value == null)
		{
			value = "";
		}
		
		pamaremeters.put(key, value);
	}
}

function sendEmail(from, to, cc, subjectTempKey, subjectParameters, contentTempKey, contentParameters)
{
	aa.log("Start to send email using tempalte: " + subjectTempKey + " " + contentTempKey);
	var subject = aa.util.getCustomContentByType(subjectTempKey, subjectParameters);
	var content = aa.util.getCustomContentByType(contentTempKey, contentParameters);
	aa.sendMail(from, to, cc, subject, content);
	aa.log("Send email successful.");
}

function getCAPModel(capIDModel)
{
	aa.log("Init: Find out CAP information.");
	var capModel = aa.cap.getCapViewBySingle4ACA(capIDModel);
	if (capModel == null)
	{
		aa.log("Fail to get CAP model: " + capIDModel.toString());
		return null;
	}
	
	return capModel;
}

function getPaymentByBatchNumber(batchNumber)
{
	var payments = null;
	var paymentsResult = aa.finance.getPaymentByBatchNumber(batchNumber);
	if (!paymentsResult.getSuccess())
	{
		aa.log("Fail to get payments by batch number (" + batchNumber + ").");
		aa.log(paymentsResult.getErrorMessage());
		return payments;
	}

	return (paymentsResult.getOutput());
}

/**
 * Get custom ID.
 */
function getCustomID(capIDModel)
{
	var customID = null;
	if (capIDModel.getCustomID() != null && capIDModel.getCustomID() != "")
	{
		return capIDModel.getCustomID();
	}

	var capResult = aa.cap.getCapByPK(capIDModel, false);
	if (capResult.getSuccess())
	{
		customID = capResult.getOutput().getCapID().getCustomID();
	}
	else
	{
		aa.log("Cannot found out custom ID for given CAP: " + capIDModel.toString());
	}
	
	return customID;
}

// get partial cap id
function getPartialCapID(capid)
{
	if (capid == null || aa.util.instanceOfString(capid))
	{
		return null;
	}
	//1. Get original partial CAPID  from related CAP table.
	var result = aa.cap.getProjectByChildCapID(capid, "EST", null);
	if(result.getSuccess())
	{
		projectScriptModels = result.getOutput();
		if (projectScriptModels == null || projectScriptModels.length == 0)
		{
			aa.print("ERROR: Failed to get partial CAP with CAPID(" + capid + ")");
			return null;
		}
		//2. Get original partial CAP ID from project Model
		projectScriptModel = projectScriptModels[0];
		return projectScriptModel.getProjectID();
	}  
	else 
	{
		aa.print("ERROR: Failed to get partial CAP by child CAP(" + capid + "): " + result.getErrorMessage());
		return null;
	}
}
comment("Ending WTUA4RENEWTPS");

// ---------------------------------------------------------------------------------------------------