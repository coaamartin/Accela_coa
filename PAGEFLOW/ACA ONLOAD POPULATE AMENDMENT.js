/*------------------------------------------------------------------------------------------------------/
| Program : ACA ONLOAD POPULATE AMENDMENT
| Event   : ACA ONLOAD 
|
| Usage   : Used to pre-populate contacts on amendment records from the amendment parent.
|
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START User Configurable Parameters
|
|     Only variables in the following section may be changed.  If any other section is modified, this
|     will no longer be considered a "Master" script and will not be supported in future releases.  If
|     changes are made, please add notes above.
/------------------------------------------------------------------------------------------------------*/
var showMessage = false;						// Set to true to see results in popup window
var showDebug = false;							// Set to true to see debug messages in popup window
var message =	"";								// Message String
var debug = "";									// Debug String
var br = "<BR>";								// Break Tag
var cancel = false;

var cap = aa.env.getValue("CapModel");
var capId = cap.getCapID();
var servProvCode = capId.getServiceProviderCode()       		// Service Provider Code
var currentUserID = aa.env.getValue("CurrentUserID");
if (currentUserID.indexOf("PUBLICUSER") == 0) { currentUserID = "ADMIN" ; publicUser = true }  // ignore public users

var useAppSpecificGroupName = false;

// page flow custom code begin
try {

	var cap = aa.env.getValue("CapModel");
	var capId = cap.getCapID();
	parentCapIdString = "" + cap.getParentCapID();
	if (parentCapIdString) {
		pca = parentCapIdString.split("-");
		parentCapId = aa.cap.getCapID(pca[0], pca[1], pca[2]).getOutput();
	}

	var refAddress;
	var refParcel;
	var refGIS;
	var contactList;
	var applicantModel;
	var valModel;
	var valModelList;

	if (parentCapId) {

		parentCap = aa.cap.getCapViewBySingle4ACA(parentCapId);

		//Copy Address
		refAddress = parentCap.getAddressModel();
		cap.setAddressModel(refAddress);

		//Copy Parcel
		refParcel = parentCap.getParcelModel();
		cap.setParcelModel(refParcel);

		// copy Owner
		refOwner = parentCap.getOwnerModel();
		cap.setOwnerModel(refOwner);

		// copy LP
		refLP = parentCap.getLicenseProfessionalModel();
		cap.setLicenseProfessionalModel(refLP);

		//

		//Copy Contacts
		//Copy Contacts
		contactList = parentCap.getContactsGroup();
		for (i = 0; i < contactList.size(); i++) {
			contactList.get(i).getPeople().setContactSeqNumber(null);
			contactList.get(i).setComponentName(null);
		}
		cap.setContactsGroup(contactList);

		applicantModel = parentCap.getApplicantModel();
		applicantModel.getPeople().setContactSeqNumber(null);
		applicantModel.setComponentName(null);
		cap.setApplicantModel(applicantModel);

		copyAdditionalInfo(parentCapId, capId);

		copyCapDetailInfo(parentCapId, capId);

		copyCapWorkDesInfo(parentCapId, capId);

		//Copy ASI
		var pASI = [];
		loadAppSpecific(pASI);
		copyAppSpecificForAmendment(pASI);
		
		copyAppSpecificTableForLic(parentCapId, capId);

		aa.env.setValue("CapModel", cap);
	}
} catch (err) {
	showDebug = true;
	logDebug("Error " + err.message + " at " + err.lineNumber + "Stack: " + err.stack);

}

if (debug.indexOf("**ERROR") > 0) {
	aa.env.setValue("ErrorCode", "1");
	aa.env.setValue("ErrorMessage", debug);
} else {
	if (cancel) {
		aa.env.setValue("ErrorCode", "-2");
		if (showMessage)
			aa.env.setValue("ErrorMessage", message);
		if (showDebug)
			aa.env.setValue("ErrorMessage", debug);
	} else {
		aa.env.setValue("ErrorCode", "0");
		if (showMessage)
			aa.env.setValue("ErrorMessage", message);
		if (showDebug)
			aa.env.setValue("ErrorMessage", debug);
	}
}

////////////////////////////////////// Functions below this point ////////////////////////////////////////////////////////////////
function copyAppSpecific4ACA(capFrom) { // copy all App Specific info into new Cap
	var i = capFrom.getAppSpecificInfoGroups().iterator();
	while (i.hasNext()) {
		var group = i.next();
		var fields = group.getFields();
		if (fields != null) {
			var iteFields = fields.iterator();
			while (iteFields.hasNext()) {
				var field = iteFields.next();

				if (useAppSpecificGroupName)
					editAppSpecific4ACA(field.getCheckboxType() + "." + field.getCheckboxDesc(), field.getChecklistComment());
				else {
					logDebug("copying " + field.getCheckboxDesc() + " : " + field.getChecklistComment());
					editAppSpecific4ACA(field.getCheckboxDesc(), field.getChecklistComment());
				}
			}
		}
	}
}

function editAppSpecific4ACA(itemName, itemValue) {

	var i = cap.getAppSpecificInfoGroups().iterator();
	while (i.hasNext()) {
		var group = i.next();
		var fields = group.getFields();
		if (fields != null) {
			var iteFields = fields.iterator();
			while (iteFields.hasNext()) {
				var field = iteFields.next();
				if ((useAppSpecificGroupName && itemName.equals(field.getCheckboxType() + "." + field.getCheckboxDesc())) || itemName.equals(field.getCheckboxDesc())) {
					field.setChecklistComment(itemValue);
				}
			}
		}
	}
}

function loadASITable(tname) {

	//
	// Returns a single ASI Table array of arrays
	// Optional parameter, cap ID to load from
	//
	var itemCap = capId;
	if (arguments.length == 2)
		itemCap = arguments[1]; // use cap ID specified in args

	var gm = aa.appSpecificTableScript.getAppSpecificTableGroupModel(itemCap).getOutput();
	var ta = gm.getTablesArray()
		var tai = ta.iterator();
	while (tai.hasNext()) {
		var tsm = tai.next();
		var tn = tsm.getTableName();

		if (!tn.equals(tname))
			continue;

		if (tsm.rowIndex.isEmpty()) {
			logDebug("Couldn't load ASI Table " + tname + " it is empty");
			return false;
		}

		var tempObject = new Array();
		var tempArray = new Array();

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

		}

		tempArray.push(tempObject); // end of record
	}

	return tempArray;
}

function asiTableValObj(columnName, fieldValue, readOnly) {
	this.columnName = columnName;
	this.fieldValue = fieldValue;
	this.readOnly = readOnly;

	asiTableValObj.prototype.toString = function () {
		return this.fieldValue
	}
};

function addASITable(tableName, tableValueArray) // optional capId
{
	//  tableName is the name of the ASI table
	//  tableValueArray is an array of associative array values.  All elements MUST be either a string or asiTableVal object
	var itemCap = capId
		if (arguments.length > 2)
			itemCap = arguments[2]; // use cap ID specified in args

		var tssmResult = aa.appSpecificTableScript.getAppSpecificTableModel(itemCap, tableName)

		if (!tssmResult.getSuccess()) {
			logDebug("**WARNING: error retrieving app specific table " + tableName + " " + tssmResult.getErrorMessage());
			return false
		}

		var tssm = tssmResult.getOutput();
	var tsm = tssm.getAppSpecificTableModel();
	var fld = tsm.getTableField();
	var fld_readonly = tsm.getReadonlyField(); // get Readonly field

	for (thisrow in tableValueArray) {

		var col = tsm.getColumns()
			var coli = col.iterator();
		while (coli.hasNext()) {
			var colname = coli.next();

			if (typeof(tableValueArray[thisrow][colname.getColumnName()]) == "object") // we are passed an asiTablVal Obj
			{
				fld.add(tableValueArray[thisrow][colname.getColumnName()].fieldValue);
				fld_readonly.add(tableValueArray[thisrow][colname.getColumnName()].readOnly);
			} else // we are passed a string
			{
				fld.add(tableValueArray[thisrow][colname.getColumnName()]);
				fld_readonly.add(null);
			}
		}

		tsm.setTableField(fld);

		tsm.setReadonlyField(fld_readonly);

	}

	var addResult = aa.appSpecificTableScript.editAppSpecificTableInfos(tsm, itemCap, currentUserID);

	if (!addResult.getSuccess()) {
		logDebug("**WARNING: error adding record to ASI Table:  " + tableName + " " + addResult.getErrorMessage());
		return false
	} else {
		//Refresh Cap Model (Custom Addition by Engineering, but wasn't able to submit ACA record)
		//var tmpCap = aa.cap.getCapViewBySingle(capId);
		//cap.setAppSpecificTableGroupModel(tmpCap.getAppSpecificTableGroupModel());

		logDebug("Successfully added record to ASI Table: " + tableName);
	}

}

function logDebug(dstr) {

	if (!aa.calendar.getNextWorkDay) {

		var vLevel = 1
			if (arguments.length > 1)
				vLevel = arguments[1]

					if ((showDebug & vLevel) == vLevel || vLevel == 1)
						debug += dstr + br;

					if ((showDebug & vLevel) == vLevel)
						aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"), dstr)
	} else {
		debug += dstr + br;
	}

}

function appMatch(ats) // optional capId or CapID string
{
	var matchArray = appTypeArray //default to current app
		if (arguments.length == 2) {
			matchCapParm = arguments[1]
				if (typeof(matchCapParm) == "string")
					matchCapId = aa.cap.getCapID(matchCapParm).getOutput(); // Cap ID to check
				else
					matchCapId = matchCapParm;
				if (!matchCapId) {
					logDebug("**WARNING: CapId passed to appMatch was not valid: " + arguments[1]);
					return false
				}
				matchCap = aa.cap.getCap(matchCapId).getOutput();
			matchArray = matchCap.getCapType().toString().split("/");
		}

		var isMatch = true;
	var ata = ats.split("/");
	if (ata.length != 4)
		logDebug("**ERROR in appMatch.  The following Application Type String is incorrectly formatted: " + ats);
	else
		for (xx in ata)
			if (!ata[xx].equals(matchArray[xx]) && !ata[xx].equals("*"))
				isMatch = false;
	return isMatch;
}

function copyAdditionalInfo(srcCapId, targetCapId) {
	//1. Get Additional Information with source CAPID.  (BValuatnScriptModel)
	var additionalInfo = getAdditionalInfo(srcCapId);
	if (additionalInfo == null) {
		return;
	}
	//2. Get CAP detail with source CAPID.
	var capDetail = getCapDetailByID(srcCapId);
	//3. Set target CAP ID to additional info.
	additionalInfo.setCapID(targetCapId);
	if (capDetail != null) {
		capDetail.setCapID(targetCapId);
	}
	//4. Edit or create additional infor for target CAP.
	aa.cap.editAddtInfo(capDetail, additionalInfo);
}

//Return BValuatnScriptModel for additional info.
function getAdditionalInfo(capId) {
	bvaluatnScriptModel = null;
	var s_result = aa.cap.getBValuatn4AddtInfo(capId);
	if (s_result.getSuccess()) {
		bvaluatnScriptModel = s_result.getOutput();
		if (bvaluatnScriptModel == null) {
			aa.print("WARNING: no additional info on this CAP:" + capId);
			bvaluatnScriptModel = null;
		}
	} else {
		aa.print("ERROR: Failed to get additional info: " + s_result.getErrorMessage());
		bvaluatnScriptModel = null;
	}
	// Return bvaluatnScriptModel
	return bvaluatnScriptModel;
}

function getCapDetailByID(capId) {
	capDetailScriptModel = null;
	var s_result = aa.cap.getCapDetail(capId);
	if (s_result.getSuccess()) {
		capDetailScriptModel = s_result.getOutput();
		if (capDetailScriptModel == null) {
			aa.print("WARNING: no cap detail on this CAP:" + capId);
			capDetailScriptModel = null;
		}
	} else {
		aa.print("ERROR: Failed to get cap detail: " + s_result.getErrorMessage());
		capDetailScriptModel = null;
	}
	// Return capDetailScriptModel
	return capDetailScriptModel;
}

function copyCapWorkDesInfo(srcCapId, targetCapId) {
	aa.cap.copyCapWorkDesInfo(srcCapId, targetCapId);
}

function copyCapDetailInfo(srcCapId, targetCapId) {
	aa.cap.copyCapDetailInfo(srcCapId, targetCapId);
}

function copyAppSpecificTableForLic(srcCapId, targetCapId) {
	var tableNameArray = getTableName(srcCapId);
	var targetTableNameArray = getTableName(targetCapId);
	if (tableNameArray == null) {
		logDebug("tableNameArray is null, returning");
		return;
	}
	for (loopk in tableNameArray) {
		var tableName = tableNameArray[loopk];
		if (IsStrInArry(tableName, targetTableNameArray)) {
			//1. Get appSpecificTableModel with source CAPID
			var sourceAppSpecificTable = getAppSpecificTableForLic(srcCapId, tableName);
			//2. Edit AppSpecificTableInfos with target CAPID
			var srcTableModel = null;
			if (sourceAppSpecificTable == null) {
				logDebug("sourceAppSpecificTable is null");
				return;
			} else {
				srcTableModel = sourceAppSpecificTable.getAppSpecificTableModel();

				tgtTableModelResult = aa.appSpecificTableScript.getAppSpecificTableModel(targetCapId, tableName);
				if (tgtTableModelResult.getSuccess()) {
					tgtTableModel = tgtTableModelResult.getOutput();
					if (tgtTableModel == null) {
						logDebug("target table model is null");
					} else {
						tgtGroupName = tgtTableModel.getGroupName();
						srcTableModel.setGroupName(tgtGroupName);
					}
				} else {
					logDebug("Error getting target table model " + tgtTableModelResult.getErrorMessage());
				}
			}
			editResult = aa.appSpecificTableScript.editAppSpecificTableInfos(srcTableModel,
					targetCapId,
					null);
			if (editResult.getSuccess()) {
				logDebug("Successfully editing appSpecificTableInfos");
			} else {
				logDebug("Error editing appSpecificTableInfos " + editResult.getErrorMessage());
			}
		} else {
			logDebug("Table " + tableName + " is not defined on target");
		}
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

function IsStrInArry(eVal,argArr) {
   	for (x in argArr){
   		if (eVal == argArr[x]){
   			return true;
   		}
 	  }	
	return false;
}

function getAppSpecificTableForLic(capId,tableName)
{
	appSpecificTable = null;
	var s_result = aa.appSpecificTableScript.getAppSpecificTableModel(capId,tableName);
	if(s_result.getSuccess())
	{
		appSpecificTable = s_result.getOutput();
		if (appSpecificTable == null || appSpecificTable.length == 0)
		{
			logDebug("WARNING: no appSpecificTable on this CAP:" + capId);
			appSpecificTable = null;
		}
	}
	else
	{
		logDebug("ERROR: Failed to appSpecificTable: " + s_result.getErrorMessage());
		appSpecificTable = null;	
	}
	return appSpecificTable;
}

function copyAppSpecificForAmendment(AInfo) // copy all App Specific info
// into new Cap, 1 optional
// parameter for ignoreArr
{
	var ignoreArr = new Array();
	var limitCopy = false;
	if (arguments.length > 2) {
		ignoreArr = arguments[2];
		limitCopy = true;
	}

	for (asi in AInfo) {
		if (limitCopy) {
			var ignore = false;
			for (var i = 0; i < ignoreArr.length; i++) {
				if (asi.indexOf(ignoreArr[i]) == 0) {
					// if(ignoreArr[i] == asi){
					logDebug("ignoring " + asi);
					ignore = true;
					break;
				}
			}
			if (!ignore)
				editAppSpecific4ACA(asi, AInfo[asi]);
		} else
			editAppSpecific4ACA(asi, AInfo[asi]);
	}
}

function loadAppSpecific(thisArr) {
	// 
	// Returns an associative array of App Specific Info
	// Optional second parameter, cap ID to load from
	//
	
	var itemCap = capId;
	if (arguments.length == 2) itemCap = arguments[1]; // use cap ID specified in args

    var appSpecInfoResult = aa.appSpecificInfo.getByCapID(itemCap);
	if (appSpecInfoResult.getSuccess())
	 	{
		var fAppSpecInfoObj = appSpecInfoResult.getOutput();

		for (loopk in fAppSpecInfoObj)
			{
			thisArr[fAppSpecInfoObj[loopk].checkboxDesc] = fAppSpecInfoObj[loopk].checklistComment;
			}
		}
	}