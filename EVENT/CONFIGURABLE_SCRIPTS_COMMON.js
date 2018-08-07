/*------------------------------------------------------------------------------------------------------/
| Program		: CONFIGURABLE_SCRIPTS_COMMON.js
| Event			: N/A
| Usage			: Script performs common functions as an aide to the Standard Configurable Scripts
| Created by	: AME Team
| Created on	: 11/01/2017
/------------------------------------------------------------------------------------------------------*/


var SCRIPT_VERSION = 3.0;
// Support ACA and AV, without messing with Global publicUser
var currUserId = aa.env.getValue("CurrentUserID");
var isPublicUser = false;
if (typeof publicUser === 'undefined') {
	isPublicUser = currUserId.indexOf("PUBLICUSER") == 0;
} else {
	isPublicUser = publicUser;
}

/** 
 * this is a global variable for Configurable scripts
 * used by preScript to cancel process of the STDBASE script
 * based on complex logic
 * */
var cancelCfgExecution = false;

var asiGroups;
if (isPublicUser && (typeof controlString === 'undefined' || controlString == "Pageflow") && (typeof capId === 'undefined' || capId == null)) {
	var includesAccelaFunctions = getScriptText("INCLUDES_ACCELA_FUNCTIONS");
	if (typeof (includesAccelaFunctions) != "undefined" && includesAccelaFunctions != null && includesAccelaFunctions != "") {
		eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
	} else {
		eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, true));
	}

	var includesAccelaGlobals = getScriptText("INCLUDES_ACCELA_GLOBALS");
	if (typeof (includesAccelaGlobals) != "undefined" && includesAccelaGlobals != null && includesAccelaGlobals != "") {
		eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
	} else {
		eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, true));
	}

	var capModel = aa.env.getValue("CapModel");
	var cap = capModel;
	capId = capModel.getCapID();
	asiGroups = capModel.getAppSpecificInfoGroups();

}
// this in case of there is capId and cap object is undefined.
else if (typeof cap === 'undefined' && capId != null) {
	cap = aa.cap.getCap(capId).getOutput();
}

/**
 * Check JSON CONF file for Application type (Wild Card supported), controlString, event variables and primary criteria
 * <br/> if matched, JSON settings (rules) are returned to STDBASE script.
 * <br/><b>Primary Criteria</b> includes:  customFields, customLists, contactFields, addressFields, parcelFields, lpFields, recordStatus
 * <br/><b>Event Variables</b> are: Workflow: task and status, Inspection: type and result, Document: group and category
 * @param settingsArray array of matched settings from JSON conf file (accessed and filled by reference)
 * @param jsonFileSuffix
 * @param allowedEvents {Array} {OPTIONAL} events allowed to execute the STDBASE regardless of JSON config or CONFIGURABLE_RULESET, empty or null to ignore
 * @returns {Boolean} true if STDBASE script should start (criteria matched)
 */
function isConfigurableScript(settingsArray, jsonFileSuffix) {
	var allowedEvents = [];
	if (arguments.length == 3) {
		allowedEvents = arguments[2];
	}

	// delete this if "Pageflow" passed from GLOBAL SCRIPTS
	if (isPublicUser && typeof controlString === 'undefined') {
		controlString = "Pageflow";
	}

	//to prevent the document upload after and before on ACA insert mode. because we done have cap or cap model.
	if (isPublicUser && capId.toString().indexOf("EST") > -1 && controlString.indexOf("DocumentUpload") > -1) {
		return false;
	}

	var itemCap, itemAppTypeResult, itemAppTypeString, itemAppTypeArray;
	if (capId != null) {
		itemCap = aa.cap.getCap(capId).getOutput();
		itemAppTypeResult = itemCap.getCapType();
		itemAppTypeString = itemAppTypeResult.toString();
		itemAppTypeArray = itemAppTypeString.split('/');
		module = itemAppTypeArray[0].toUpperCase();
	} else {
		itemAppTypeArray = appTypeArray;
		itemAppTypeString = appTypeArray[0] + "/" + appTypeArray[1] + "/" + appTypeArray[2] + "/" + appTypeArray[3];
		module = appTypeArray[0].toUpperCase();

	}

	var solMapStdChoice = "SOLUTION_MAPPING";
	var solution = lookup(solMapStdChoice, itemAppTypeString);
	if (!solution) {
		solution = lookup(solMapStdChoice, itemAppTypeArray[0] + "/" + itemAppTypeArray[1] + "/" + itemAppTypeArray[2] + "/*");
	}
	if (!solution) {
		solution = lookup(solMapStdChoice, itemAppTypeArray[0] + "/" + itemAppTypeArray[1] + "/*/*");
	}
	if (!solution) {
		solution = lookup(solMapStdChoice, itemAppTypeArray[0] + "/*/*/*");
	}
	if (!solution) {
		return false;
	}
	var jsonName = "CONF_" + solution + "_" + jsonFileSuffix;

	var cfgJsonStr = getScriptText(jsonName);
	if (cfgJsonStr == "") {
		return false
	}

	var cfgJsonObj = JSON.parse(cfgJsonStr);

	var wildCardProbabiltyArr = [ itemAppTypeArray[0] + "/" + itemAppTypeArray[1] + "/" + itemAppTypeArray[2] + "/" + itemAppTypeArray[3],
			itemAppTypeArray[0] + "/" + itemAppTypeArray[1] + "/" + itemAppTypeArray[2] + "/*", itemAppTypeArray[0] + "/" + itemAppTypeArray[1] + "/*/*",
			itemAppTypeArray[0] + "/*/*/*", itemAppTypeArray[0] + "/*/" + itemAppTypeArray[2] + "/*",
			itemAppTypeArray[0] + "/*/" + itemAppTypeArray[2] + "/" + itemAppTypeArray[3], itemAppTypeArray[0] + "/*/*/" + itemAppTypeArray[3],
			itemAppTypeArray[0] + "/" + itemAppTypeArray[1] + "/*/" + itemAppTypeArray[3] ];

	for (w in wildCardProbabiltyArr) {
		var recordTypeRules = cfgJsonObj[wildCardProbabiltyArr[w]];
		if (recordTypeRules === undefined)
			continue;

		//on event involved, just add whatever in record type match level
		if (allowedEvents && allowedEvents != null && allowedEvents.length > 0 && !arrayContainsValue(allowedEvents, controlString)) {
			logDebug("**WARN isConfigurableScript() controlString not in allowedEvents array STDBASE:" + jsonFileSuffix + " allowedEvents:" + allowedEvents);
			continue;
		}

		//logDebug("find cfgJsonObj for record type: [" + wildCardProbabiltyArr[w] + "] : " + (recordTypeRules != undefined));

		var recordTypeEventRules = recordTypeRules[controlString];
		if (recordTypeEventRules === undefined)
			continue;

		//logDebug("find controlString [" + controlString + "] in recordTypeRules: " + recordTypeEventRules.length);
		//logDebug("Check Is Event Criteria Matched...?");
		for (x in recordTypeEventRules) {
			var criteria = recordTypeEventRules[x].criteria;
			var operators = recordTypeEventRules[x].metadata.operators;
			if (controlString.indexOf("Workflow") > -1) {
				var evalResult = evaluateBooleanVinA(criteria["task"], wfTask, getLogicalOp(recordTypeEventRules[x], "task"));
				if (evalResult || criteria["task"] == null || criteria["task"] === undefined || criteria["task"].length == 0) {
					var evalResult = evaluateBooleanVinA(criteria["status"], wfStatus, getLogicalOp(recordTypeEventRules[x], "status"));
					if (evalResult || criteria["status"] == null || criteria["status"] === undefined || criteria["status"].length == 0) {
						var primaryCriResult = checkPrimaryCriteria(criteria, operators);
						if (!primaryCriResult) {
							continue;
						}
						//logDebug(controlString + " :: event criteria matched, add rule to settings array...");
						settingsArray.push(recordTypeEventRules[x]);
					}//event 2nd level matched
				}//event 1st level matched
			} else if (controlString.indexOf("InspectionResult") > -1) {
				var evalResult = evaluateBooleanVinA(criteria["inspectionTypePerformed"], inspType, getLogicalOp(recordTypeEventRules[x], "inspectionTypePerformed"));
				if (evalResult || criteria["inspectionTypePerformed"] == null || criteria["inspectionTypePerformed"] === undefined) {
					var evalResult = evaluateBooleanVinA(criteria["inspectionResult"], inspResult, getLogicalOp(recordTypeEventRules[x], "inspectionResult"));
					if (evalResult || criteria["inspectionResult"] == null || criteria["inspectionResult"] === undefined) {
						var primaryCriResult = checkPrimaryCriteria(criteria, operators);
						if (!primaryCriResult) {
							continue;
						}
						//logDebug(controlString + " :: event criteria matched, add rule to settings array...");
						settingsArray.push(recordTypeEventRules[x]);
					}//event 2nd level matched
				}//event 1st level matched
			} else if (controlString.indexOf("InspectionMultipleSchedule") > -1 || controlString.indexOf("InspectionSchedule") > -1) {
				var evalResult = evaluateBooleanVinA(criteria["inspectionTypePerformed"], inspType, getLogicalOp(recordTypeEventRules[x], "inspectionTypePerformed"));
				if (evalResult || criteria["inspectionTypePerformed"] == null || criteria["inspectionTypePerformed"] === undefined) {
					if (evalResult) {
						var primaryCriResult = checkPrimaryCriteria(criteria, operators);
						if (!primaryCriResult) {
							continue;
						}
						settingsArray.push(recordTypeEventRules[x]);
					}
				}//event 1st level matched
			} else if (controlString.indexOf("Document") > -1) {
				var crDocCategory = criteria["documentCategory"];
				var crDocGroup = criteria["documentGroup"];

				var isReqCrDocCategory = crDocCategory != null && crDocCategory !== undefined && crDocCategory.length > 0;
				var isReqCrDocGroup = crDocGroup != null && crDocGroup !== undefined && crDocGroup.length > 0;

				var total = 0;
				for (var d = 0; d < documentModelArray.size(); d++) {
					var docGrp = documentModelArray.get(d).getDocGroup();
					var docCat = documentModelArray.get(d).getDocCategory();
					for (k in crDocCategory) {
						//if doc cat not required or matched AND docGrp not required or matched, count it
						if ((!isReqCrDocCategory || crDocCategory[k] == docCat) && (!isReqCrDocGroup || arrayContainsValue(crDocGroup, docGrp))) {
							++total;
						}
					}//for all crDocCategory in JSON
				}//for all cap docs

				var docExistEval = false;
				if (isReqCrDocCategory)
					docExistEval = (total >= crDocCategory.length);
				else
					docExistEval = true;

				docExistEval = evaluateBoolean(docExistEval, getLogicalOp(recordTypeEventRules[x], "document"));
				if (docExistEval) {
					var primaryCriResult = checkPrimaryCriteria(criteria, operators);
					if (!primaryCriResult) {
						continue;
					}
					//logDebug(controlString + " :: event criteria matched, add rule to settings array...");
					settingsArray.push(recordTypeEventRules[x]);
				}

			} else {
				//other events: Pageflow, ApplicationSubmitAfter...
				var primaryCriResult = checkPrimaryCriteria(criteria, operators);
				if (!primaryCriResult) {
					continue;
				}
				settingsArray.push(recordTypeEventRules[x]);
			}
		}//for all rules in ....
	}//for all record type options (wildcard)
	return (settingsArray != null && settingsArray.length > 0);
}

/**
 * Check if customFields, customLists, contactFields, addressFields, parcelFields, lpFields, recordStatus are exist in JSON criteria and matches current record
 * @param criteria json object from conf JSON
 * @param operators json object from conf JSON
 * @returns {Boolean}
 */
function checkPrimaryCriteria(criteria, operators) {
	var PRI_CRITERIA_ELEMENTS = [ "customFields", "customLists", "contactFields", "addressFields", "parcelFields", "lpFields", "recordStatus" ];
	var crElementMethodNameMap = new Array();
	crElementMethodNameMap["customFields"] = "isCustomFieldsMatchRules";
	crElementMethodNameMap["customLists"] = "isCustomListsMatchRules";
	crElementMethodNameMap["contactFields"] = "isContactMatchRules";
	crElementMethodNameMap["addressFields"] = "isAddressMatchRules";
	crElementMethodNameMap["parcelFields"] = "isParcelMatchRules";
	crElementMethodNameMap["lpFields"] = "isLPMatchRules";
	crElementMethodNameMap["recordStatus"] = "isCapStatusMatchRules";

	for (cr in PRI_CRITERIA_ELEMENTS) {
		var crElement = PRI_CRITERIA_ELEMENTS[cr];
		if (criteria.hasOwnProperty(crElement)) {
			var expr = "isXxxMatchRules(crElementJson)";
			var crElementJson = criteria[crElement];
			expr = crElementMethodNameMap[crElement] + "(crElementJson)";
			var evalResult = eval(expr);
			if (!isEmptyOrNull(operators)) {
				evalResult = evaluateBoolean(evalResult, operators[crElement]);
			}
			if (!evalResult) {
				return false;
			}
		}//crElement  exist
	}//for all PRI_CRITERIA_ELEMENTS
	return true;
}

/**
 * Check if JSON object has operators defined, and return value of required property
 * @param jsonRules an element from settingsArray[] array
 * @param opPropName
 * @returns operator value, or null if not exist.
 */
function getLogicalOp(jsonRules, opPropName) {
	if (isEmptyOrNull(jsonRules.metadata.operators) || isEmptyOrNull(jsonRules.metadata.operators[opPropName])) {
		return null;
	}
	return jsonRules.metadata.operators[opPropName];
}
/**
 * Apply an operator -currently '!=' only supported, to a boolean, any other operator will be considered as '=='
 * @param evalResult a boolean value
 * @param {String} op 
 * @returns evalResult after applying op
 */
function evaluateBoolean(evalResult, op) {
	if (op != null && op !== undefined && op == "!=") {
		evalResult = !evalResult;
	}
	return evalResult;
}

/**
 * Finds if value exist in inputArray then Apply an operator -currently '!=' only supported, to the result,
   <br/>any other operator will be considered as '=='
 * @param evalResult a boolean value
 * @param {String} op 
 * @returns search result after applying op
 */
function evaluateBooleanVinA(inputArray, value, op) {
	if (inputArray == null || inputArray === undefined || inputArray.length == 0) {
		return true;
	}

	var evalResult = arrayContainsValue(inputArray, value);
	return evaluateBoolean(evalResult, op);
}

function getContacts() {
	var ContactModel = aa.env.getValue("Contact");
	var ContactModelList = aa.env.getValue("SelectedContactList");
	if (controlString == "ApplicationSubmitBefore") {
		return getContactsFromSessionForASB();
	} else if (isPublicUser && (capId.toString().indexOf("EST") != -1 || (cap != null && cap.getCapClass() == "EDITABLE"))) {
		return getContactsFromSession4ACA();
	} else if (ContactModel != "" || ContactModelList != "") {
		return getContactsFromSessionAV();
	} else {
		return getContactsList();
	}
}

function getParcel(parcelArray) {
	var ParcelList = aa.env.getValue("SelectedParcelList");
	var ParcelObject = aa.env.getValue("parcelModel");

	if (controlString == "ApplicationSubmitBefore") {
		return LoadParcelAttributesForASB(parcelArray);
	}
	if (isPublicUser && (capId.toString().indexOf("EST") != -1 || (cap != null && cap.getCapClass() == "EDITABLE"))) {
		return LoadParcelFromSession(parcelArray);
	} else if (ParcelList != "" || ParcelObject != "") {
		LoadPacelFromAVSession(parcelArray);
	} else if (capId != null) {
		return loadParcelAttributes(parcelArray);

	}

}

function getAddress(thisArr) {
	var addressModel = aa.env.getValue("AddressModel");
	var addressModelList = aa.env.getValue("SelectedAddressList");
	if (controlString == "ApplicationSubmitBefore") {
		return LoadAddressAttributesForASB(thisArr);
	} else if (isPublicUser && (capId.toString().indexOf("EST") != -1 || (cap != null && cap.getCapClass() == "EDITABLE"))) {
		return loadAddressAndAttributesFromSession4ACA(thisArr);
	} else if (addressModel != "" || addressModelList != "") {
		loadAddressAttributesSessionAV(thisArr);
	} else {
		return loadAddressAttributesLocalAV(thisArr);
	}

}

//this function to get the address attribute from the session in ACA and AV for ASB EVENT
function LoadAddressAttributesForASB(thisArr) {
	if (aa.env.getValue("AddressPrimaryFlag") != "" || aa.env.getValue("AddressStreetDirection") != "" || aa.env.getValue("AddressStreetName") != ""
			|| aa.env.getValue("AddressStreetSuffix") != "" || aa.env.getValue("AddressCity") != "" || aa.env.getValue("AddressZip") != ""
			|| aa.env.getValue("AddressValidatedNumber") != "" || aa.env.getValue("AddressHouseNumber") != "" || aa.env.getValue("AddressHouseFraction") != ""
			|| aa.env.getValue("AddressUnitNumber") != "" || aa.env.getValue("AddressUnitType") != "" || aa.env.getValue("AddressState") != "") {
		var address = new Array();
		address["primaryFlag"] = aa.env.getValue("AddressPrimaryFlag");
		address["streetDirection"] = aa.env.getValue("AddressStreetDirection");
		address["streetName"] = aa.env.getValue("AddressStreetName");
		address["streetSuffix"] = aa.env.getValue("AddressStreetSuffix");
		address["city"] = aa.env.getValue("AddressCity");
		address["zip"] = aa.env.getValue("AddressZip");
		address["ValidatedNumber"] = aa.env.getValue("AddressValidatedNumber");
		address["HouseNumber"] = aa.env.getValue("AddressHouseNumber");
		address["HouseFraction"] = aa.env.getValue("AddressHouseFraction");
		address["AddressUnitNumber"] = aa.env.getValue("AddressUnitNumber");
		address["AddressUnitType"] = aa.env.getValue("AddressUnitType");
		address["AddressState"] = aa.env.getValue("AddressState");
		thisArr.push(address);
	}
}

function loadAddressAttributesSessionAV(thisArr) {

	var addressModel = aa.env.getValue("AddressModel");
	var addressModelList = aa.env.getValue("SelectedAddressList");

	if (addressModelList != "" && addressModelList != null) {
		for (var i = 0; i < addressModelList.size(); i++) {
			var address = new Array();
			// Explicitly load some standard values
			address["primaryFlag"] = addressModelList.get(i).getPrimaryFlag();
			address["houseNumberStart"] = addressModelList.get(i).getHouseNumberStart();
			address["streetDirection"] = addressModelList.get(i).getStreetDirection();
			address["streetName"] = addressModelList.get(i).getStreetName();
			address["streetSuffix"] = addressModelList.get(i).getStreetSuffix();
			address["city"] = addressModelList.get(i).getCity();
			address["state"] = addressModelList.get(i).getState();
			address["zip"] = addressModelList.get(i).getZip();
			address["addressStatus"] = addressModelList.get(i).getAddressStatus();
			address["county"] = addressModelList.get(i).getCounty();
			address["country"] = addressModelList.get(i).getCountry();
			address["addressDescription"] = addressModelList.get(i).getAddressDescription();
			address["xCoordinate"] = addressModelList.get(i).getXCoordinator();
			address["yCoordinate"] = addressModelList.get(i).getYCoordinator();

			addressAttrObj = addressModelList.get(i).getAttributes().toArray();
			for (z in addressAttrObj)
				address[addressAttrObj[z].getB1AttributeName()] = addressAttrObj[z].getB1AttributeValue();

			thisArr.push(address)
		}
	} else {

		var address = new Array();
		// Explicitly load some standard values
		address["primaryFlag"] = addressModel.getPrimaryFlag();
		address["houseNumberStart"] = addressModel.getHouseNumberStart();
		address["streetDirection"] = addressModel.getStreetDirection();
		address["streetName"] = addressModel.getStreetName();
		address["streetSuffix"] = addressModel.getStreetSuffix();
		address["city"] = addressModel.getCity();
		address["state"] = addressModel.getState();
		address["zip"] = addressModel.getZip();
		address["addressStatus"] = addressModel.getAddressStatus();
		address["county"] = addressModel.getCounty();
		address["country"] = addressModel.getCountry();
		address["addressDescription"] = addressModel.getAddressDescription();
		address["xCoordinate"] = addressModel.getXCoordinator();
		address["yCoordinate"] = addressModel.getYCoordinator();
		var addressAttrObj = aa.env.getValue("AddressAttribute");
		if (addressAttrObj != "") {
			addressAttrObj = addressAttrObj.toArray();
			for (z in addressAttrObj)
				address[addressAttrObj[z].getB1AttributeName()] = addressAttrObj[z].getB1AttributeValue();
		}

		thisArr.push(address)

	}

}

function loadAddressAttributesLocalAV(thisArr) {
	var itemCap = capId;
	if (arguments.length == 2)
		itemCap = arguments[1]; // use cap ID specified in args

	// var fcapAddressObj = null;
	var capAddressResult = aa.address.getAddressWithAttributeByCapId(itemCap);
	if (capAddressResult.getSuccess())
		var fcapAddressObj = capAddressResult.getOutput();
	else
		logDebug("**ERROR: Failed to get Address object: " + capAddressResult.getErrorType() + ":" + capAddressResult.getErrorMessage())

	for (i in fcapAddressObj) {

		var address = new Array();
		addressAttrObj = fcapAddressObj[i].getAttributes().toArray();
		for (z in addressAttrObj)
			address[addressAttrObj[z].getB1AttributeName()] = addressAttrObj[z].getB1AttributeValue();

		// Explicitly load some standard values
		address["primaryFlag"] = fcapAddressObj[i].getPrimaryFlag();
		address["houseNumberStart"] = fcapAddressObj[i].getHouseNumberStart();
		address["streetDirection"] = fcapAddressObj[i].getStreetDirection();
		address["streetName"] = fcapAddressObj[i].getStreetName();
		address["streetSuffix"] = fcapAddressObj[i].getStreetSuffix();
		address["city"] = fcapAddressObj[i].getCity();
		address["state"] = fcapAddressObj[i].getState();
		address["zip"] = fcapAddressObj[i].getZip();
		address["addressStatus"] = fcapAddressObj[i].getAddressStatus();
		address["county"] = fcapAddressObj[i].getCounty();
		address["country"] = fcapAddressObj[i].getCountry();
		address["addressDescription"] = fcapAddressObj[i].getAddressDescription();
		address["xCoordinate"] = fcapAddressObj[i].getXCoordinator();
		address["yCoordinate"] = fcapAddressObj[i].getYCoordinator();

		thisArr.push(address);
	}
}

function GetASIValue(asiFieldName) {
	if (controlString == "ApplicationSubmitBefore") {
		return AInfo[asiFieldName];
	} else if (isPublicUser && (capId.toString().indexOf("EST") != -1 || (cap != null && cap.getCapClass() == "EDITABLE"))) {
		return getFieldValue(asiFieldName, asiGroups);
	} else {
		return AInfo[asiFieldName];
	}
}

function getASITable(tableName) {
	if (controlString == "ApplicationSubmitBefore") {
		return getASITBefore(tableName);
	} else if (isPublicUser && (capId.toString().indexOf("EST") != -1 || (cap != null && cap.getCapClass() == "EDITABLE"))) {
		return getASITablesRowsFromSession4ACA(tableName);
	} else {
		return loadASITable(tableName);
	}
}

function getLPFields(returnArray) {
	var LPModel = aa.env.getValue("LicProfModel");
	var LPModelList = aa.env.getValue("LicenseList");

	if (controlString == "ApplicationSubmitBefore") {
		getLPfromSessionForASB(returnArray);
	} else if (isPublicUser && (capId.toString().indexOf("EST") != -1 || (cap != null && cap.getCapClass() == "EDITABLE"))) {
		return loadlicensedProfessional(returnArray);
	} else if (LPModel != "" || LPModelList != "") {
		getLPFieldsAVSession(returnArray);
	} else {
		return getLPFieldsAV(returnArray);
	}
}
//this function to get the LP attribute from the session in ACA and AV for ASB EVENT
function getLPfromSessionForASB(returnArray) {
	var LPModelList = aa.env.getValue("LicProfList");

	if (LPModelList != "" && LPModelList != null) {
		for (var i = 0; i < LPModelList.size(); i++) {

			var lp = new Array();
			lp["licType"] = LPModelList.get(i).getLicenseType();
			lp["licenseNbr"] = LPModelList.get(i).getLicenseNbr();
			lp["lastName"] = LPModelList.get(i).getContactLastName();
			lp["firstName"] = LPModelList.get(i).getContactFirstName();
			lp["businessName"] = LPModelList.get(i).getBusinessName();
			lp["address1"] = LPModelList.get(i).getAddress1();
			lp["city"] = LPModelList.get(i).getCity();
			lp["state"] = LPModelList.get(i).getState();
			lp["zip"] = LPModelList.get(i).getZip();
			lp["country"] = LPModelList.get(i).getCountry();
			lp["email"] = LPModelList.get(i).getEmail();
			lp["phone1"] = LPModelList.get(i).getPhone1();
			lp["phone2"] = LPModelList.get(i).getPhone2();
			lp["lastRenewalDate"] = LPModelList.get(i).getLastRenewalDate();
			lp["licExpirationDate"] = LPModelList.get(i).getLicenseExpirDate();
			lp["FEIN"] = LPModelList.get(i).getFein();
			lp["gender"] = LPModelList.get(i).getGender();
			lp["birthDate"] = LPModelList.get(i).getBirthDate();

			var tmpAttrList = LPModelList.get(i).getAttributes();
			for (xx1 in tmpAttrList) {
				lp[tmpAttrList[xx1].attributeName] = tmpAttrList[xx1].attributeValue;
			}

			returnArray.push(lp)

		}
	}
}

function getLPFieldsAVSession(returnArray) {
	var LiceProfessionalobject = aa.env.getValue("LicProfModel");
	var LPModelList = aa.env.getValue("LicenseList");

	if (LPModelList != "") {

		for (var i = 0; i < LPModelList.size(); i++) {

			var lp = new Array();
			lp["licType"] = LPModelList.get(i).getLicenseType();
			lp["licenseNbr"] = LPModelList.get(i).getLicenseNbr();
			lp["lastName"] = LPModelList.get(i).getContactLastName();
			lp["firstName"] = LPModelList.get(i).getContactFirstName();
			lp["businessName"] = LPModelList.get(i).getBusinessName();
			lp["address1"] = LPModelList.get(i).getAddress1();
			lp["city"] = LPModelList.get(i).getCity();
			lp["state"] = LPModelList.get(i).getState();
			lp["zip"] = LPModelList.get(i).getZip();
			lp["country"] = LPModelList.get(i).getCountry();
			lp["email"] = LPModelList.get(i).getEmail();
			lp["phone1"] = LPModelList.get(i).getPhone1();
			lp["phone2"] = LPModelList.get(i).getPhone2();
			lp["lastRenewalDate"] = LPModelList.get(i).getLastRenewalDate();
			lp["licExpirationDate"] = LPModelList.get(i).getLicenseExpirDate();
			lp["FEIN"] = LPModelList.get(i).getFein();
			lp["gender"] = LPModelList.get(i).getGender();
			lp["birthDate"] = LPModelList.get(i).getBirthDate();

			var tmpAttrList = LPModelList.get(i).getAttributes();
			for (xx1 in tmpAttrList) {
				lp[tmpAttrList[xx1].attributeName] = tmpAttrList[xx1].attributeValue;
			}

			returnArray.push(lp)

		}
	} else {
		var lp = new Array();
		lp["licType"] = LiceProfessionalobject.getLicenseType();
		lp["licenseNbr"] = LiceProfessionalobject.getLicenseNbr();
		lp["lastName"] = LiceProfessionalobject.getContactLastName();
		lp["firstName"] = LiceProfessionalobject.getContactFirstName();
		lp["businessName"] = LiceProfessionalobject.getBusinessName();
		lp["address1"] = LiceProfessionalobject.getAddress1();
		lp["city"] = LiceProfessionalobject.getCity();
		lp["state"] = LiceProfessionalobject.getState();
		lp["zip"] = LiceProfessionalobject.getZip();
		lp["country"] = LiceProfessionalobject.getCountry();
		lp["email"] = LiceProfessionalobject.getEmail();
		lp["phone1"] = LiceProfessionalobject.getPhone1();
		lp["phone2"] = LiceProfessionalobject.getPhone2();
		lp["lastRenewalDate"] = LiceProfessionalobject.getLastRenewalDate();
		lp["licExpirationDate"] = LiceProfessionalobject.getLicenseExpirDate();
		lp["FEIN"] = LiceProfessionalobject.getFein();
		lp["gender"] = LiceProfessionalobject.getGender();
		lp["birthDate"] = LiceProfessionalobject.getBirthDate();

		var tmpAttrList = LiceProfessionalobject.getAttributes();
		for (xx1 in tmpAttrList) {
			lp[tmpAttrList[xx1].attributeName] = tmpAttrList[xx1].attributeValue;
		}

		returnArray.push(lp)
	}
}

function getLPFieldsAV(returnArray) {
	var rArray = new Array();
	licArr = getLicenseProfessional(capId);
	for (i in licArr) {

		var lp = new Array();
		lp["licType"] = licArr[i].getLicenseType();
		lp["licenseNbr"] = licArr[i].getLicenseNbr();
		lp["lastName"] = licArr[i].getContactLastName();
		lp["firstName"] = licArr[i].getContactFirstName();
		lp["businessName"] = licArr[i].getBusinessName();
		lp["address1"] = licArr[i].getAddress1();
		lp["city"] = licArr[i].getCity();
		lp["state"] = licArr[i].getState();
		lp["zip"] = licArr[i].getZip();
		lp["country"] = licArr[i].getCountry();
		lp["email"] = licArr[i].getEmail();
		lp["phone1"] = licArr[i].getPhone1();
		lp["phone2"] = licArr[i].getPhone2();
		lp["lastRenewalDate"] = licArr[i].getLastRenewalDate();
		lp["licExpirationDate"] = licArr[i].getLicenseExpirDate();
		lp["FEIN"] = licArr[i].getFein();
		lp["gender"] = licArr[i].getGender();
		lp["birthDate"] = licArr[i].getBirthDate();

		var tmpAttrList = licArr[i].getAttributes();
		for (xx1 in tmpAttrList) {
			lp[tmpAttrList[xx1].attributeName] = tmpAttrList[xx1].attributeValue;
		}
		returnArray.push(lp)

	}
}

function loadAddressAndAttributesFromSession4ACA(addressArray) {
	var addressModel = null;

	if (String(cap.getClass()).indexOf("CapScriptModel") != -1) {
		addressModel = cap.getCapModel().getAddressModel();
	} else {
		addressModel = cap.getAddressModel();
	}

	if (addressModel == null) {
		return false;
	}

	var address = new Array();
	if (addressModel.getAttributes() != null) {
		addressAttrObj = addressModel.getAttributes().toArray();
		for (z in addressAttrObj)
			address[addressAttrObj[z].getB1AttributeName()] = addressAttrObj[z].getB1AttributeValue();
	}

	address["primaryFlag"] = addressModel.getPrimaryFlag();
	address["houseNumberStart"] = addressModel.getHouseNumberStart();
	address["streetDirection"] = addressModel.getStreetDirection();
	address["streetName"] = addressModel.getStreetName();
	address["streetSuffix"] = addressModel.getStreetSuffix();
	address["city"] = addressModel.getCity();
	address["state"] = addressModel.getState();
	address["zip"] = addressModel.getZip();
	address["addressStatus"] = addressModel.getAddressStatus();
	address["county"] = addressModel.getCounty();
	address["country"] = addressModel.getCountry();
	address["addressDescription"] = addressModel.getAddressDescription();
	address["xCoordinate"] = addressModel.getXCoordinator();
	address["yCoordinate"] = addressModel.getYCoordinator();
	addressArray.push(address)

	return true;
}

function loadlicensedProfessional(returnArray) {
	var licArr = capModel.getLicenseProfessionalList();
	if (licArr == null || licArr.size() == 0) {
		return false;
	}
	for (var i = 0; i < licArr.size(); i++) {
		var license = new Array();
		license["licType"] = licArr.get(i).getLicenseType();
		license["licenseNbr"] = licArr.get(i).getLicenseNbr();
		license["lastName"] = licArr.get(i).getContactLastName();
		license["firstName"] = licArr.get(i).getContactFirstName();
		license["businessName"] = licArr.get(i).getBusinessName();
		license["address1"] = licArr.get(i).getAddress1();
		license["city"] = licArr.get(i).getCity();
		license["state"] = licArr.get(i).getState();
		license["zip"] = licArr.get(i).getZip();
		license["country"] = licArr.get(i).getCountry();
		license["email"] = licArr.get(i).getEmail();
		license["phone1"] = licArr.get(i).getPhone1();
		license["phone2"] = licArr.get(i).getPhone2();
		license["lastRenewalDate"] = licArr.get(i).getLastRenewalDate();
		license["licExpirationDate"] = licArr.get(i).getLicenseExpirDate();
		license["FEIN"] = licArr.get(i).getFein();
		license["gender"] = licArr.get(i).getGender();
		license["birthDate"] = licArr.get(i).getBirthDate();

		var tmpAttrList = licArr.get(i).getAttributes();
		for (xx1 in tmpAttrList) {
			license[tmpAttrList[xx1].attributeName] = tmpAttrList[xx1].attributeValue;
		}
		returnArray.push(license);
	}
}
//this function to get the parcel attribute from the session in ACA and AV for ASB EVENT
function LoadParcelAttributesForASB(thisArr) {
	var parcel = new Array();
	parcel["ParcelNumber"] = aa.env.getValue("ParcelValidatedNumber");
	parcel["Block"] = aa.env.getValue("ParcelBlock");
	parcel["Page"] = aa.env.getValue("ParcelPage");
	parcel["ExemptValue"] = aa.env.getValue("ParcelExcemptValue");
	parcel["Book"] = aa.env.getValue("ParcelBook");
	parcel["ParcelImprovedValue"] = aa.env.getValue("ParcelImprovedValue");
	parcel["Lot"] = aa.env.getValue("ParcelLot");
	parcel["ParcelArea"] = aa.env.getValue("ParcelArea");
	parcel["ParcelTract"] = aa.env.getValue("ParcelTract");
	parcel["ParcelLegalDescription"] = aa.env.getValue("ParcelLegalDescription");
	parcel["ParcelLandValue"] = aa.env.getValue("ParcelLandValue");
	thisArr.push(parcel);

}

function loadParcelAttributes(thisArr) {
	var itemCap = capId;
	if (arguments.length == 2)
		itemCap = arguments[1]; // use cap ID specified in args

	var fcapParcelObj = null;
	var capParcelResult = aa.parcel.getParcelandAttribute(itemCap, null);
	if (capParcelResult.getSuccess())
		var fcapParcelObj = capParcelResult.getOutput().toArray();
	else
		logDebug("**ERROR: Failed to get Parcel object: " + capParcelResult.getErrorType() + ":" + capParcelResult.getErrorMessage())

	for (i in fcapParcelObj) {

		var parcel = new Array();
		// Explicitly load some standard values
		parcel["ParcelNumber"] = fcapParcelObj[i].getParcelNumber();
		parcel["Section"] = fcapParcelObj[i].getSection();
		parcel["Block"] = fcapParcelObj[i].getBlock();
		parcel["LegalDesc"] = fcapParcelObj[i].getLegalDesc();
		parcel["GisSeqNo"] = fcapParcelObj[i].getGisSeqNo();
		parcel["SourceSeqNumber"] = fcapParcelObj[i].getSourceSeqNumber();
		parcel["Page"] = fcapParcelObj[i].getPage();
		parcel["I18NSubdivision"] = fcapParcelObj[i].getI18NSubdivision();
		parcel["CouncilDistrict"] = fcapParcelObj[i].getCouncilDistrict();
		parcel["RefAddressTypes"] = fcapParcelObj[i].getRefAddressTypes();
		parcel["ParcelStatus"] = fcapParcelObj[i].getParcelStatus();
		parcel["ExemptValue"] = fcapParcelObj[i].getExemptValue();
		parcel["PublicSourceSeqNBR"] = fcapParcelObj[i].getPublicSourceSeqNBR();
		parcel["CensusTract"] = fcapParcelObj[i].getCensusTract();
		parcel["InspectionDistrict"] = fcapParcelObj[i].getInspectionDistrict();
		parcel["NoticeConditions"] = fcapParcelObj[i].getNoticeConditions();
		parcel["ImprovedValue"] = fcapParcelObj[i].getImprovedValue();
		parcel["PlanArea"] = fcapParcelObj[i].getPlanArea();
		parcel["Lot"] = fcapParcelObj[i].getLot();
		parcel["ParcelArea"] = fcapParcelObj[i].getParcelArea();
		parcel["Township"] = fcapParcelObj[i].getTownship();
		parcel["LandValue"] = fcapParcelObj[i].getLandValue();

		parcelAttrObj = fcapParcelObj[i].getParcelAttribute().toArray();
		for (z in parcelAttrObj) {
			parcel["ParcelAttribute." + parcelAttrObj[z].getB1AttributeName()] = parcelAttrObj[z].getB1AttributeValue();
		}
		thisArr.push(parcel);
	}
	return thisArr;
}

function LoadPacelFromAVSession(parcelArray) {

	var SelectedParcelList = aa.env.getValue("SelectedParcelList");
	var ParcelModel = aa.env.getValue("parcelModel");

	if (SelectedParcelList != "" && SelectedParcelList != null) {
		for (var i = 0; i < SelectedParcelList.size(); i++) {
			var parcel = new Array();
			parcel["ParcelNumber"] = SelectedParcelList.get(i).getParcelModel().getParcelNo();
			parcel["Section"] = SelectedParcelList.get(i).getParcelModel().getSection();
			parcel["Block"] = SelectedParcelList.get(i).getParcelModel().getBlock();
			parcel["LegalDesc"] = SelectedParcelList.get(i).getParcelModel().getLegalDesc();
			parcel["GisSeqNo"] = SelectedParcelList.get(i).getParcelModel().getGisSeqNo();
			parcel["SourceSeqNumber"] = SelectedParcelList.get(i).getParcelModel().getSourceSeqNumber();
			parcel["Page"] = SelectedParcelList.get(i).getParcelModel().getPage();
			parcel["I18NSubdivision"] = SelectedParcelList.get(i).getParcelModel().getI18NSubdivision();
			parcel["CouncilDistrict"] = SelectedParcelList.get(i).getParcelModel().getCouncilDistrict();
			parcel["RefAddressTypes"] = SelectedParcelList.get(i).getParcelModel().getRefAddressTypes();
			parcel["ParcelStatus"] = SelectedParcelList.get(i).getParcelModel().getParcelStatus();
			parcel["ExemptValue"] = SelectedParcelList.get(i).getParcelModel().getExemptValue();
			parcel["PublicSourceSeqNBR"] = parcelModel.getParcelModel().getPublicSourceSeqNBR();
			parcel["CensusTract"] = SelectedParcelList.get(i).getParcelModel().getCensusTract();
			parcel["InspectionDistrict"] = SelectedParcelList.get(i).getParcelModel().getInspectionDistrict();
			parcel["NoticeConditions"] = SelectedParcelList.get(i).getParcelModel().getNoticeConditions();
			parcel["ImprovedValue"] = SelectedParcelList.get(i).getParcelModel().getImprovedValue();
			parcel["PlanArea"] = SelectedParcelList.get(i).getParcelModel().getPlanArea();
			parcel["Lot"] = SelectedParcelList.get(i).getParcelModel().getLot();
			parcel["ParcelArea"] = SelectedParcelList.get(i).getParcelModel().getParcelArea();
			parcel["Township"] = SelectedParcelList.get(i).getParcelModel().getTownship();
			parcel["LandValue"] = SelectedParcelList.get(i).getParcelModel().getLandValue();

			var tmpAttrList = SelectedParcelList.get(i).getParcelModel().getParcelAttribute();
			for (xx1 in tmpAttrList) {
				parcel[tmpAttrList[xx1].attributeName] = tmpAttrList[xx1].attributeValue;
			}

			parcelArray.push(parcel);
		}
	} else {
		var parcel = new Array();
		parcel["ParcelNumber"] = ParcelModel.getParcelModel().getParcelNo();
		parcel["Section"] = ParcelModel.getParcelModel().getSection();
		parcel["Block"] = ParcelModel.getParcelModel().getBlock();
		parcel["LegalDesc"] = ParcelModel.getParcelModel().getLegalDesc();
		parcel["GisSeqNo"] = ParcelModel.getParcelModel().getGisSeqNo();
		parcel["SourceSeqNumber"] = ParcelModel.getParcelModel().getSourceSeqNumber();
		parcel["Page"] = ParcelModel.getParcelModel().getPage();
		parcel["I18NSubdivision"] = ParcelModel.getParcelModel().getI18NSubdivision();
		parcel["CouncilDistrict"] = ParcelModel.getParcelModel().getCouncilDistrict();
		parcel["RefAddressTypes"] = ParcelModel.getParcelModel().getRefAddressTypes();
		parcel["ParcelStatus"] = ParcelModel.getParcelModel().getParcelStatus();
		parcel["ExemptValue"] = ParcelModel.getParcelModel().getExemptValue();
		parcel["PublicSourceSeqNBR"] = parcelModel.getParcelModel().getPublicSourceSeqNBR();
		parcel["CensusTract"] = ParcelModel.getParcelModel().getCensusTract();
		parcel["InspectionDistrict"] = ParcelModel.getParcelModel().getInspectionDistrict();
		parcel["NoticeConditions"] = ParcelModel.getParcelModel().getNoticeConditions();
		parcel["ImprovedValue"] = ParcelModel.getParcelModel().getImprovedValue();
		parcel["PlanArea"] = ParcelModel.getParcelModel().getPlanArea();
		parcel["Lot"] = ParcelModel.getParcelModel().getLot();
		parcel["ParcelArea"] = ParcelModel.getParcelModel().getParcelArea();
		parcel["Township"] = ParcelModel.getParcelModel().getTownship();
		parcel["LandValue"] = ParcelModel.getParcelModel().getLandValue();

		var tmpAttrList = ParcelModel.getParcelModel().getParcelAttribute();
		for (xx1 in tmpAttrList) {
			parcel[tmpAttrList[xx1].attributeName] = tmpAttrList[xx1].attributeValue;
		}

		parcelArray.push(parcel);

	}

}

function LoadParcelFromSession(parcelArray) {
	var parcelModel = capModel.getParcelModel();
	if (parcelModel) {
		var parcel = new Array();
		parcel["ParcelNumber"] = parcelModel.getParcelNo();
		parcel["Section"] = parcelModel.getParcelModel().getSection();
		parcel["Block"] = parcelModel.getParcelModel().getBlock();
		parcel["LegalDesc"] = parcelModel.getParcelModel().getLegalDesc();
		parcel["GisSeqNo"] = parcelModel.getParcelModel().getGisSeqNo();
		parcel["SourceSeqNumber"] = parcelModel.getParcelModel().getSourceSeqNumber();
		parcel["Page"] = parcelModel.getParcelModel().getPage();
		parcel["I18NSubdivision"] = parcelModel.getParcelModel().getI18NSubdivision();
		parcel["CouncilDistrict"] = parcelModel.getParcelModel().getCouncilDistrict();
		parcel["RefAddressTypes"] = parcelModel.getParcelModel().getRefAddressTypes();
		parcel["ParcelStatus"] = parcelModel.getParcelModel().getParcelStatus();
		parcel["ExemptValue"] = parcelModel.getParcelModel().getExemptValue();
		parcel["PublicSourceSeqNBR"] = parcelModel.getParcelModel().getPublicSourceSeqNBR();
		parcel["CensusTract"] = parcelModel.getParcelModel().getCensusTract();
		parcel["InspectionDistrict"] = parcelModel.getParcelModel().getInspectionDistrict();
		parcel["NoticeConditions"] = parcelModel.getParcelModel().getNoticeConditions();
		parcel["ImprovedValue"] = parcelModel.getParcelModel().getImprovedValue();
		parcel["PlanArea"] = parcelModel.getParcelModel().getPlanArea();
		parcel["Lot"] = parcelModel.getParcelModel().getLot();
		parcel["ParcelArea"] = parcelModel.getParcelModel().getParcelArea();
		parcel["Township"] = parcelModel.getParcelModel().getTownship();
		parcel["LandValue"] = parcelModel.getParcelModel().getLandValue();

		var tmpAttrList = parcelModel.getParcelModel().getParcelAttribute();
		for (xx1 in tmpAttrList) {
			parcel[tmpAttrList[xx1].attributeName] = tmpAttrList[xx1].attributeValue;
		}
		parcelArray.push(parcel);
	}

}

function createAsitRulesMap(customListsRule) {
	var asitRule = new Array();

	for ( var tc in customListsRule) {
		var asitCell = customListsRule[tc];

		var tableName = asitCell.tableName;
		var asitColName = asitCell.columnName;
		var asitValue = asitCell.value;

		if (asitRule[tableName] == null) {
			var ruleArr = new Array();
			ruleArr.push(new asitRuleFieldsObject(asitColName, asitValue))
			asitRule[tableName] = ruleArr;
		} else {
			ruleArr = asitRule[tableName];
			ruleArr.push(new asitRuleFieldsObject(asitColName, asitValue))
			asitRule[tableName] = ruleArr;
		}
	} // for all ASIT rules

	return asitRule;
}

function asitRuleFieldsObject(columnName, fieldValue) {
	this.columnName = columnName;
	this.fieldValue = fieldValue;

	asitRuleFieldsObject.prototype.toString = function() {
		return String(this.fieldValue);
	};
}

//this function to get the Contacts attribute from the session in ACA and AV for ASB EVENT
function getContactsFromSessionForASB() {
	var contactModelList = aa.env.getValue("ContactList");
	if (contactModelList != "" && contactModelList != null) {
		var contactsArray = new Array;
		var contact = new Array;
		for (var i = 0; i < contactModelList.size(); i++) {

			contact["lastName"] = contactModelList.get(i).getPeople().getLastName();
			contact["firstName"] = contactModelList.get(i).getPeople().getFirstName();
			contact["middleName"] = contactModelList.get(i).getPeople().getMiddleName();
			contact["businessName"] = contactModelList.get(i).getPeople().getBusinessName();
			contact["contactSeqNumber"] = contactModelList.get(i).getPeople().getContactSeqNumber();
			contact["contactType"] = contactModelList.get(i).getPeople().getContactType();
			contact["relation"] = contactModelList.get(i).getPeople().getRelation();
			contact["phone1"] = contactModelList.get(i).getPeople().getPhone1();
			contact["phone2"] = contactModelList.get(i).getPeople().getPhone2();
			contact["email"] = contactModelList.get(i).getPeople().getEmail();
			contact["addressLine1"] = contactModelList.get(i).getPeople().getCompactAddress().getAddressLine1();
			contact["addressLine2"] = contactModelList.get(i).getPeople().getCompactAddress().getAddressLine2();
			contact["city"] = contactModelList.get(i).getPeople().getCompactAddress().getCity();
			contact["state"] = contactModelList.get(i).getPeople().getCompactAddress().getState();
			contact["zip"] = contactModelList.get(i).getPeople().getCompactAddress().getZip();
			contact["fax"] = contactModelList.get(i).getPeople().getFax();

			contact["country"] = contactModelList.get(i).getPeople().getCountryCode();
			contact["fullName"] = contactModelList.get(i).getPeople().getFullName();
			contact["peopleModel"] = contactModelList.get(i).getPeople();

			var atts = new Array;
			var attributes = contactModelList.get(i).getPeople().getAttributes();
			if (attributes)
				atts = attributes.toArray()
			for (att in atts)
				contact[atts[att].attributeName] = atts[att].attributeValue;

			contactsArray.push(contact);
		}
	}

	return contactsArray;
}

function getContactsFromSessionAV() {
	var contactModel = aa.env.getValue("Contact");
	var contactModelList = aa.env.getValue("SelectedContactList");
	var contactsArray = new Array;
	var contact = new Array;
	if (contactModelList != "" && contactModelList != null) {

		for (var i = 0; i < contactModelList.size(); i++) {
			contact["lastName"] = contactModelList.get(i).getPeople().getLastName();
			contact["firstName"] = contactModelList.get(i).getPeople().getFirstName();
			contact["middleName"] = contactModelList.get(i).getPeople().getMiddleName();
			contact["businessName"] = contactModelList.get(i).getPeople().getBusinessName();
			contact["contactSeqNumber"] = contactModelList.get(i).getPeople().getContactSeqNumber();
			contact["contactType"] = contactModelList.get(i).getPeople().getContactType();
			contact["relation"] = contactModelList.get(i).getPeople().getRelation();
			contact["phone1"] = contactModelList.get(i).getPeople().getPhone1();
			contact["phone2"] = contactModelList.get(i).getPeople().getPhone2();
			contact["email"] = contactModelList.get(i).getPeople().getEmail();
			contact["addressLine1"] = contactModelList.get(i).getPeople().getCompactAddress().getAddressLine1();
			contact["addressLine2"] = contactModelList.get(i).getPeople().getCompactAddress().getAddressLine2();
			contact["city"] = contactModelList.get(i).getPeople().getCompactAddress().getCity();
			contact["state"] = contactModelList.get(i).getPeople().getCompactAddress().getState();
			contact["zip"] = contactModelList.get(i).getPeople().getCompactAddress().getZip();
			contact["fax"] = contactModelList.get(i).getPeople().getFax();

			contact["country"] = contactModelList.get(i).getPeople().getCountryCode();
			contact["fullName"] = contactModelList.get(i).getPeople().getFullName();
			contact["peopleModel"] = contactModelList.get(i).getPeople();

			var atts = new Array;
			var attributes = contactModelList.get(i).getPeople().getAttributes();
			if (attributes)
				atts = attributes.toArray()
			for (att in atts)
				contact[atts[att].attributeName] = atts[att].attributeValue;

			contactsArray.push(contact);
		}

	} else {
		contact["lastName"] = contactModel.getPeople().getLastName();
		contact["firstName"] = contactModel.getPeople().getFirstName();
		contact["middleName"] = contactModel.getPeople().getMiddleName();
		contact["businessName"] = contactModel.getPeople().getBusinessName();
		contact["contactSeqNumber"] = contactModel.getPeople().getContactSeqNumber();
		contact["contactType"] = contactModel.getPeople().getContactType();
		contact["relation"] = contactModel.getPeople().getRelation();
		contact["phone1"] = contactModel.getPeople().getPhone1();
		contact["phone2"] = contactModel.getPeople().getPhone2();
		contact["email"] = contactModel.getPeople().getEmail();
		contact["addressLine1"] = contactModel.getPeople().getCompactAddress().getAddressLine1();
		contact["addressLine2"] = contactModel.getPeople().getCompactAddress().getAddressLine2();
		contact["city"] = contactModel.getPeople().getCompactAddress().getCity();
		contact["state"] = contactModel.getPeople().getCompactAddress().getState();
		contact["zip"] = contactModel.getPeople().getCompactAddress().getZip();
		contact["fax"] = contactModel.getPeople().getFax();

		contact["country"] = contactModel.getPeople().getCountryCode();
		contact["fullName"] = contactModel.getPeople().getFullName();
		contact["peopleModel"] = contactModel.getPeople();

		var atts = new Array;
		var attributes = contactModel.getPeople().getAttributes();
		if (attributes)
			atts = attributes.toArray()
		for (att in atts)
			contact[atts[att].attributeName] = atts[att].attributeValue;

		contactsArray.push(contact);
	}
	return contactsArray

}

function getContactsFromSession4ACA() {
	var e = capId;
	var r = null;

	if (String(cap.getClass()).indexOf("CapScriptModel") != -1) {
		r = cap.getCapModel().getContactsGroup();
	} else {
		r = cap.getContactsGroup();
	}
	if (r == null)
		return false;

	var contactsArray = new Array;

	if (r.size() > 0) {
		for (var cc = 0; cc < r.size(); cc++) {
			var contact = new Array;
			contact["lastName"] = r.get(cc).getPeople().lastName;
			contact["firstName"] = r.get(cc).getPeople().firstName;
			contact["middleName"] = r.get(cc).getPeople().middleName;
			contact["businessName"] = r.get(cc).getPeople().businessName;
			contact["contactSeqNumber"] = r.get(cc).getPeople().contactSeqNumber;
			contact["contactType"] = r.get(cc).getPeople().contactType;
			contact["relation"] = r.get(cc).getPeople().relation;
			contact["phone1"] = r.get(cc).getPeople().phone1;
			contact["phone2"] = r.get(cc).getPeople().phone2;
			contact["email"] = r.get(cc).getPeople().email;
			contact["addressLine1"] = r.get(cc).getPeople().getCompactAddress().getAddressLine1();
			contact["addressLine2"] = r.get(cc).getPeople().getCompactAddress().getAddressLine2();
			contact["city"] = r.get(cc).getPeople().getCompactAddress().getCity();
			contact["state"] = r.get(cc).getPeople().getCompactAddress().getState();
			contact["zip"] = r.get(cc).getPeople().getCompactAddress().getZip();
			contact["fax"] = r.get(cc).getPeople().getFax();
			contact["country"] = r.get(cc).getPeople().getCountryCode();
			contact["fullName"] = r.get(cc).getPeople().getFullName();
			contact["peopleModel"] = r.get(cc).getPeople();

			var atts = new Array;
			var o = r.get(cc).getPeople().getAttributes();
			if (o)
				atts = o.toArray()
			for (att in atts)
				contact[atts[att].attributeName] = atts[att].attributeValue;

			contactsArray.push(contact);
		}

		return contactsArray
	}
	return false;
}

function getContactsList() {
	var contactArray = getPeople(capId);
	var contactsArray = new Array;
	if (contactArray.length > 0) {
		for (var cc = 0; cc < contactArray.length; cc++) {
			var contact = new Array;
			contact["lastName"] = contactArray[cc].getPeople().lastName;
			contact["firstName"] = contactArray[cc].getPeople().firstName;
			contact["middleName"] = contactArray[cc].getPeople().middleName;
			contact["businessName"] = contactArray[cc].getPeople().businessName;
			contact["contactSeqNumber"] = contactArray[cc].getPeople().contactSeqNumber;
			contact["contactType"] = contactArray[cc].getPeople().contactType;
			contact["relation"] = contactArray[cc].getPeople().relation;
			contact["phone1"] = contactArray[cc].getPeople().phone1;
			contact["phone2"] = contactArray[cc].getPeople().phone2;
			contact["email"] = contactArray[cc].getPeople().email;
			contact["addressLine1"] = contactArray[cc].getPeople().getCompactAddress().getAddressLine1();
			contact["addressLine2"] = contactArray[cc].getPeople().getCompactAddress().getAddressLine2();
			contact["city"] = contactArray[cc].getPeople().getCompactAddress().getCity();
			contact["state"] = contactArray[cc].getPeople().getCompactAddress().getState();
			contact["zip"] = contactArray[cc].getPeople().getCompactAddress().getZip();
			contact["fax"] = contactArray[cc].getPeople().getFax();
			contact["country"] = contactArray[cc].getPeople().getCountryCode();
			contact["fullName"] = contactArray[cc].getPeople().getFullName();
			contact["peopleModel"] = contactArray[cc].getPeople();
			var atts = new Array;
			var o = contactArray[cc].getPeople().getAttributes();
			if (o)
				atts = o.toArray()
			for (att in atts)
				contact[atts[att].attributeName] = atts[att].attributeValue;

			contactsArray.push(contact);
		}
		return contactsArray
	}

	return false;
}

function getFieldValue(fieldName, asiGroups) {
	if (asiGroups == null) {
		return null;
	}

	var iteGroups = asiGroups.iterator();
	while (iteGroups.hasNext()) {
		var group = iteGroups.next();
		var fields = group.getFields();
		if (fields != null) {
			var iteFields = fields.iterator();
			while (iteFields.hasNext()) {
				var field = iteFields.next();
				if (fieldName == field.getCheckboxDesc()) {
					return field.getChecklistComment();
				}
			}
		}
	}
	return null;
}

function getASITablesRowsFromSession4ACA(tableName) {
	var gm = null;
	if (String(cap.getClass()).indexOf("CapScriptModel") != -1) {
		gm = cap.getCapModel().getAppSpecificTableGroupModel();
	} else {
		gm = cap.getAppSpecificTableGroupModel();
	}
	if (gm == null) {
		return false;
	}
	var ta = gm.getTablesMap();
	var tai = ta.values().iterator();
	while (tai.hasNext()) {
		var tsm = tai.next();
		if (tsm.rowIndex.isEmpty())
			continue;

		var asitRow = new Array;
		var asitTables = new Array;
		var tn = tsm.getTableName();
		if (tn != tableName) {
			continue;
		}

		var tsmfldi = tsm.getTableField().iterator();
		var tsmcoli = tsm.getColumns().iterator();
		while (tsmfldi.hasNext()) {

			var tcol = tsmcoli.next();
			var tval = tsmfldi.next();

			asitRow[tcol.getColumnName()] = tval;

			if (!tsmcoli.hasNext()) {
				tsmcoli = tsm.getColumns().iterator();
				asitTables.push(asitRow);
				asitRow = new Array;
			}
		}
		return asitTables;
	}
	return false;
}

function addConditionMultiLanguage(cDescEnglish, cDescArabic) {
	var itemCap = capId;
	if (arguments.length >= 3) {
		itemCap = arguments[2];
	}

	var cType = "Required Document";
	var capCondArr = new Array();
	var enCond = aa.capCondition.getNewConditionScriptModel().getOutput();

	enCond.setResLangId("en_US");
	enCond.setConditionDescription(cDescEnglish);
	enCond.setLongDescripton(cDescEnglish);
	enCond.setResolutionAction("Notice");
	enCond.setPublicDisplayMessage(cDescEnglish);
	enCond.setCapID(itemCap);
	enCond.setConditionStatus("Applied");
	enCond.setConditionType(cType);
	enCond.setDisplayConditionStatusAndType(cType);

	var arCond = aa.capCondition.getNewConditionScriptModel().getOutput();
	arCond.setResLangId("ar_AE");
	arCond.setConditionDescription(cDescArabic);
	arCond.setLongDescripton(cDescArabic);
	arCond.setResolutionAction("Notice");
	arCond.setPublicDisplayMessage(cDescArabic);
	arCond.setCapID(itemCap);
	arCond.setConditionStatus("Applied");
	arCond.setConditionType(cType);
	arCond.setDisplayConditionStatusAndType(cType);
	capCondArr.push(enCond);
	capCondArr.push(arCond);

	var addCapCondResult = aa.condition.createConditionWithMulLangs(capCondArr, enCond);

	if (addCapCondResult.getSuccess()) {
		logDebug("Successfully added condition ", addCapCondResult.getOutput());
	}
}

function removeAllRequiredDocumentCapCondition() {
	var entityModel = aa.proxyInvoker.newInstance("com.accela.v360.document.EntityModel").getOutput();
	entityModel.setServiceProviderCode(aa.getServiceProviderCode());
	entityModel.setEntityType("TMP_CAP");
	entityModel.setEntityID(capId);

	var documentlist = aa.document.getDocumentListByEntity(capId, 'TMP_CAP').getOutput();
	var documentBiz = aa.proxyInvoker.newInstance("com.accela.aa.ads.ads.DocumentBusiness").getOutput();

	for (var d = 0; d < documentlist.size(); d++) {
		var documentItem = documentlist.get(d);
		documentBiz.removeDocument4Partial(entityModel, aa.getServiceProviderCode(), documentItem.getDocumentNo());
	}

	// delete conditions
	var result = aa.capCondition.getCapConditions(capId);
	var condMap = {};
	var conditions = {};
	var capConds = result.getOutput();
	for (var i = 0; i < capConds.length; i++) {
		aa.capCondition.deleteCapCondition(capId, capConds[i].getConditionNumber());
	}
}

//// this function to compare address between the JSON and the system(Sesssion or DB)
function isAddressMatchRules(addressJson) {

	if (!addressJson || addressJson == null || addressJson == "" || (typeof addressJson == 'object' && Object.keys(addressJson).length == 0)) {
		return true;
	}

	var addrArray = new Array();
	getAddress(addrArray);

	if (!addrArray) {
		return false
	}

	for ( var j in addressJson) {
		matched = false;
		for (ary in addrArray) {
			if (addrArray[ary][j] == addressJson[j]) {
				matched = true;
				for ( var xx in addressJson) {
					if (addrArray[ary][xx] != addressJson[xx]) {
						matched = false;
						break;
					}
				}//this address vs all JSON
				if (matched) {
					return true;
				}
			}//one attribute matched, check other attributes in same address object
		}//for all addr
	}//for all json

	return false;
}

////this function to compare parcel between the JSON and the system(Sesssion or DB)
function isParcelMatchRules(parcelJson) {

	if (!parcelJson || parcelJson == null || parcelJson == "" || (typeof parcelJson == 'object' && Object.keys(parcelJson).length == 0)) {
		return true;
	}

	var parcelArray = new Array();
	getParcel(parcelArray);
	if (!parcelArray) {
		return false;
	}

	for ( var j in parcelJson) {
		matched = false;
		for (ary in parcelArray) {
			if (parcelArray[ary][j] == parcelJson[j]) {
				matched = true;
				for ( var xx in parcelJson) {
					if (parcelArray[ary][xx] != parcelJson[xx]) {
						matched = false;
						break;
					}
				}//this address vs all JSON
				if (matched) {
					return true;
				}
			}//one attribute matched, check other attributes in same address object
		}//for all addr
	}//for all json

	return false;
}

////this function to compare LP between the JSON and the system(Sesssion or DB)
function isLPMatchRules(lpJson) {

	if (!lpJson || lpJson == null || lpJson == "" || (typeof lpJson == 'object' && Object.keys(lpJson).length == 0)) {
		return true;
	}

	var lpArray = new Array();
	getLPFields(lpArray);
	if (!lpArray) {
		return false;
	}

	for ( var j in lpJson) {
		matched = false;
		for (ary in lpArray) {
			if (lpArray[ary][j] == lpJson[j]) {
				matched = true;
				for ( var xx in lpJson) {
					if (lpArray[ary][xx] != lpJson[xx]) {
						matched = false;
						break;
					}
				}//this address vs all JSON
				if (matched) {
					return true;
				}
			}//one attribute matched, check other attributes in same address object
		}//for all addr
	}//for all json
	return false;
}

/**
 * This function to compare Record Status between the JSON and the system(Sesssion or DB)
 * @param {Array} or {String} statusJson
 * @returns {Boolean}
 */
function isCapStatusMatchRules(statusJson) {

	if (statusJson == null || statusJson == "")
		return true;

	var tmpArray = new Array();
	if (!Array.isArray(statusJson)) {
		tmpArray.push(statusJson);
	} else {
		tmpArray = statusJson;
	}

	if (tmpArray.length == 0) {
		return true;
	}

	var tmpCapStatus = getRecordStatus();
	for (s in tmpArray) {
		if (tmpArray[s] == tmpCapStatus) {
			return true;
		}
	}
	return false;
}

//this function is to get the current cap status if ACA or AV.
function getRecordStatus() {
	var capModel;
	if (isPublicUser && (capId.toString().indexOf("EST") != -1 || (cap != null && cap.getCapClass() == "EDITABLE"))) {
		capModel = aa.env.getValue("CapModel");
		return capModel.getCapStatus();
	} else {
		capModel = aa.cap.getCap(capId).getOutput();
		return capModel.getCapStatus();
	}
}

function isContactMatchRules(contactFieldsJson) {
	//no contact rules in JSON
	if (!contactFieldsJson || contactFieldsJson == null || contactFieldsJson == "" || (typeof contactFieldsJson == 'object' && Object.keys(contactFieldsJson).length == 0)) {
		return true;
	}

	var contactsArray = getContacts();

	//contacts array is empty
	if (!contactsArray) {
		return false;
	}

	for (ca in contactsArray) {
		var rowMatched = true;

		for ( var ct in contactFieldsJson) {
			rowMatched = rowMatched && contactFieldsJson[ct].equals(contactsArray[ca][ct]);

		} // for contactInfo in json

		if (rowMatched) {
			return true;
		}
	} // for all contact rows

	return false;
}

function isCustomFieldsMatchRules(customFieldsJson) {

	//no contact rules in JSON
	if (!customFieldsJson) {
		return true;
	}

	var result = true;

	for ( var cf in customFieldsJson) {
		var recordValue = GetASIValue(cf);
		// this to handle in case the field is check box and we need to check if its un checked 
		// Accela always returns null in case of the check box is not checked.
		if (recordValue == null && arrayContainsValue(customFieldsJson[cf], "UNCHECKED")) {
			result = result && true;
		} else if (!arrayContainsValue(customFieldsJson[cf], recordValue)) {
			result = false;
		}
		if (!result) {
			return false;
		}
	}
	return result;
}

function isCustomListsMatchRules(customListsRulesJson) {

	if (!customListsRulesJson) {
		return true;
	}

	var asitRulesMap = createAsitRulesMap(customListsRulesJson);
	var isMatched = true;

	for ( var rm in asitRulesMap) {
		var asiTable = getASITable(rm);
		var tableRules = asitRulesMap[rm];
		for (row in asiTable) {
			//check if all rule fields for an ASITable are matched in one row (from record data)
			isMatched = true; // reset to TRUE for each row
			for (j in tableRules) {
				var tableValue = asiTable[row][tableRules[j].columnName];
				var rulesColumnValue = tableRules[j].fieldValue;
				if (!Array.isArray(rulesColumnValue)) {
					rulesColumnValue = [ rulesColumnValue ];
				}
				var oneValueMatched = false;
				for (m in rulesColumnValue) {
					oneValueMatched = oneValueMatched || (tableValue == rulesColumnValue[m]);
					if (oneValueMatched) {
						break;
					}
				}//for all column required values

				//after each row in ASIT (check if still matched)
				isMatched = isMatched && oneValueMatched;

				if (!isMatched) {
					return false;
				}
			} // for all tableRule fields
		} // for all rows in record ASIT
		//if (for one of ASITables in rules), all record ASIT rows did not match
		if (!isMatched) {
			return false;
		}
	} // for all asitRulesMap
	return true;
}

/**
 * Compares ONLY (address, contact, customFields,customLists, Parcel and LicensedProfessional) data VS
 * JSON rule item, OTHER RULE fields will not be compared (ex, step, page)
 * @param jsonRuleItem
 * @returns true if all rule types/fields are matched, otherwise false
 */
function isJsonRulesMatchRecordData(jsonRuleItem) {
	var contactInfo = jsonRuleItem.contactFields;
	var customFields = jsonRuleItem.customFields;
	var customLists = jsonRuleItem.customLists;
	var addressInfo = jsonRuleItem.addressFields;
	var lpInfo = jsonRuleItem.lpFields;
	var parcelFields = jsonRuleItem.parcelFields;
	return isContactMatchRules(contactInfo) && isCustomFieldsMatchRules(customFields) && isCustomListsMatchRules(customLists) && isAddressMatchRules(addressInfo)
			&& isParcelMatchRules(parcelFields) && isLPMatchRules(lpInfo);
}

// this function will create invoice for recrod tpye fees
function invoiceFeeCustom(fcode, fperiod) {
	//invoices all assessed fees having fcode and fperiod
	var feeFound = false;
	getFeeResult = aa.finance.getFeeItemsByFeeCodeAndPeriod(capId, fcode, fperiod, "NEW");
	if (getFeeResult.getSuccess()) {
		var feeList = getFeeResult.getOutput();
		for (feeNum in feeList)
			if (feeList[feeNum].getFeeitemStatus().equals("NEW")) {
				var feeSeq = feeList[feeNum].getFeeSeqNbr();
				feeSeqList.push(feeSeq);
				paymentPeriodList.push(fperiod);
				feeFound = true;
				logDebug("Assessed fee " + fcode + " found and tagged for invoicing");
			}

		if (feeSeqList.length) {
			invoiceResult = aa.finance.createInvoice(capId, feeSeqList, paymentPeriodList);
			if (invoiceResult.getSuccess()) {
				logDebug("Invoicing assessed fee items is successful.");

			}
		}

	} else {
		logDebug("**ERROR: getting fee items (" + fcode + "): " + getFeeResult.getErrorMessage())
	}
	return feeFound;
}

/**
 * Handles undefined variables. Set required = true or false.
 * @example If undefined and required = true then return false.
 * 			If undefined and required = false then return an empty string.
 * 			If not undefined, then return the item
 *
 * @param {*} item
 * @param {*} required
 */
function handleUndefined(item, required) {
	if (typeof item == 'undefined' && required) {
		return false;
	}
	if (typeof item == 'undefined' && !required) {
		return '';
	}
	return item;
}

/**
 * Check if passed value is null, undefined or empty, if passed value is an Array,
   <br/>then if length=0 or has an item with value '' will consider EmptyOrNull
 * @param value
 * @returns {Boolean}
 */
function isEmptyOrNull(value) {
	return value == null || value === undefined || String(value) == "";
}
/// --------------------- GIS UTILS Section
function GisUtils(gisServiceId) {
	this.gisBusiness = aa.proxyInvoker.newInstance("com.accela.aa.gis.gis.GISBusiness").getOutput();
	this.parcelBusiness = aa.proxyInvoker.newInstance("com.accela.aa.aamain.parcel.ParcelBusiness").getOutput();
	this.serviceProviderCode = aa.getServiceProviderCode();

	if (gisServiceId != null) {
		this.gisServiceId = gisServiceId;
	} else {
		this.gisServiceId = this.gisBusiness.getDefaultGISServiceID(this.serviceProviderCode, "ADMIN");
	}
}

/**
 * Utility Method to retrieve layer information by the configured object id
 *
 * @param gisLayer : Gis Layer to retrieve its information.
 * @param gisId : Layer Object Id
 * @param mappingIdField : FID or OBJECTID
 * @returns List of Layer attributes
 */
GisUtils.prototype.getGisLayerInfo = function(gisLayer, gisId, mappingIdField) {
	var layerInfoList = null;
	try {
		var gisObjectModel = aa.proxyInvoker.newInstance("com.accela.aa.gis.gis.GISObjectModel").getOutput();
		var gisTypeObj = aa.gis.getGISType(this.gisServiceId, gisLayer).getOutput();

		var gisTypeModel = gisTypeObj.getGISTypeModel();
		var gisObjectModelList = aa.util.newArrayList();
		if (mappingIdField.equalsIgnoreCase("OBJECTID")) {
			gisObjectModel.setGisObjectID(gisId);
		} else if (mappingIdField.equalsIgnoreCase("FID")) {
			gisObjectModel.setGisId(gisId);
		}
		gisObjectModelList.add(gisObjectModel);
		gisTypeModel.setGISObjects(gisObjectModelList);

		var gisObjectAttributes = aa.gis.getGISObjectAttributes(gisTypeObj).getOutput();
		if (gisObjectAttributes != null) {
			var attributes = gisObjectAttributes.getGisObjectModel().getAttributes();
			if (attributes != null && attributes.size() > 0) {
				layerInfoList = attributes.entrySet().toArray();
			}
		}
	} catch (e) {
		aa.debug("Error at GisUtils.getGisLayerInfo, gisId : " + gisId, e);
		throw e;
	}

	return layerInfoList;
}

/**
 * communicates with GIS service and fetch value of attributeName
 * @param serviceId
 * @param layer
 * @param attributeName
 * @param mappingIdField : FID or OBJECTID
 * @param gisId is parcel number
 * @returns value of requested attribute, or false if not exist in GisAttributes array
 */
function getAttrFromGIS(serviceId, layer, attributeName, mappingIdField, gisId) {
	var gisUtil = new GisUtils(serviceId);
	var layerAttributesArray = gisUtil.getGisLayerInfo(layer, gisId, mappingIdField);
	if (layerAttributesArray == null || layerAttributesArray.length == 0) {
		return false;
	}

	for (g in layerAttributesArray) {
		if (layerAttributesArray[g].getKey().equals(attributeName)) {
			return layerAttributesArray[g].getValue();
		}
	} //for gis attrs

	return false;
}
/// --------------------- GIS UTILS Section -- END

/**
 * this function to check the proximity for specific object type
 * @param svc GIS Service
 * @param layer GIS layer
 * @param numDistance distance
 * @param objectType that you need to check if the object type is all or null it will check all GIS objects 
 * else it will check the specific type that you passed.
 * @param distanceType optional param that shows the distance unit.
 * @returns   true if the app has a gis object in proximity
 *  
 */
//Important Note : proximityForGISObject will not work with javascript JS . only with Silverlight and USE_GIS_REST_API should be NO or disabled
function proximityForGISObject(svc, layer, numDistance, objectType) {
	// returns true if the app has a gis object in proximity
	// use with all events except ApplicationSubmitBefore

	var distanceType = "feet"
	if (arguments.length == 4)
		distanceType = arguments[3]; // use distance type in arg list

	var bufferTargetResult = aa.gis.getGISType(svc, layer); // get the buffer target
	if (bufferTargetResult.getSuccess()) {
		var buf = bufferTargetResult.getOutput();
		buf.addAttributeName(layer + "_ID");
	} else {
		logDebug("**WARNING: Getting GIS Type for Buffer Target.  Reason is: " + bufferTargetResult.getErrorType() + ":" + bufferTargetResult.getErrorMessage());
		return false
	}

	var gisObjResult = aa.gis.getCapGISObjects(capId); // get gis objects on the cap
	if (gisObjResult.getSuccess())
		var fGisObj = gisObjResult.getOutput();
	else {
		logDebug("**WARNING: Getting GIS objects for Cap.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage());
		return false
	}

	for (a1 in fGisObj) // for each GIS object on the Cap
	{
		if (fGisObj[a1].getGisTypeId() == objectType || objectType == null || objectType == "all") {
			var bufchk = aa.gis.getBufferByRadius(fGisObj[a1], numDistance, distanceType, buf);
			logDebug("GIS OBJECT Type " + fGisObj[a1].getGisTypeId());

			if (bufchk.getSuccess())
				var proxArr = bufchk.getOutput();
			else {
				logDebug("**WARNING: Retrieving Buffer Check Results. Reason is: " + bufchk.getErrorType() + ":" + bufchk.getErrorMessage());
				return false
			}
		} else {
			return false;
		}

		for (a2 in proxArr) {
			var proxObj = proxArr[a2].getGISObjects(); // if there are GIS Objects here, we're done
			if (proxObj.length) {
				return true;
			}
		}
	}

	return false; // this will return false if the fGisObj for the cap is empty
}

/**
 * @deprecated <b>use getGisAttributesMap() instead</b>
 * creates an Associative Array, with values retrieved from GIS service.
 * @param copyGISData Describes GIS service|layer|attribute and destination field name (JSON Object)
 * @param mappingIdField ID or OBJECTID
 * @param parcelNumber
 * @returns {Associative Array} , KEY is destination field/attribute name, VALUE is the new value (From GIS Service) 
 */
function getNewAttributesMap(copyGISData, mappingIdField, parcelNumber) {
	var atrValuesMap = new Array();
	for (key in copyGISData) {

		var destFieldName = copyGISData[key];

		//[0]: service, [1] layer, [2] attribute
		var keyArray = key.split("|");
		var newValue = getAttrFromGIS(keyArray[0], keyArray[1], keyArray[2], mappingIdField, parcelNumber);

		if (newValue) {
			atrValuesMap[destFieldName] = newValue;
		}
	}//for all copyGisData key Fields
	return atrValuesMap;
}

/**
 * creates an Associative Array, with values retrieved from GIS service.
 * @param copyGISData from rules JSON Object
 * @param parcelNumber
 * @returns {Associative Array} , KEY is destination field/attribute name, VALUE is the new value (From GIS Service) 
 */
function getGisAttributesMap(copyGISData, parcelNumber) {
	var atrValuesMap = new Array();
	for (i in copyGISData) {
		var item = copyGISData[i];
		var destFieldName = String(item.field);
		var newValue = getAttrFromGIS(item.service, item.layer, item.attribute, item.mappingIdField, parcelNumber);
		if (newValue) {
			atrValuesMap[destFieldName] = newValue;
		}
	}//for all copyGisData key Fields
	return atrValuesMap;
}

/**
 * this function to get the related records that linked to the same address that linked to the current cap
 * @param StreetName
 * @param HouseNumberStart
 * @param StreetSuffix
 * @param StreetDirection
 * @returns array of capIdScriptModel
 */
function getRelatedCapsByAddressAttributes(StreetName, HouseNumberStart, StreetSuffix, StreetDirection) {
	var retArr = new Array();

	HouseNumberStart = (HouseNumberStart != "") ? parseInt(HouseNumberStart) : 0;
	capAddResult = aa.cap.getCapListByDetailAddress(StreetName, HouseNumberStart, StreetSuffix, null, StreetDirection, null);
	if (capAddResult.getSuccess()) {
		var capIdArray = capAddResult.getOutput();
	} else {
		logDebug("**ERROR: getting similar addresses: " + capAddResult.getErrorMessage());
		return false;
	}

	// loop through related caps
	for (cappy in capIdArray) {
		retArr.push(capIdArray[cappy]);

	} // loop through related caps

	if (retArr.length > 0)
		return retArr;

}

/**
 * Copy Assets from capIdFrom to capIdTo
 * @param capIdFrom Source Record
 * @param capIdTo Destination Record
 * @param typesArray types/group names to be copied, null or empty array means ALL
 * @returns true if success, false otherwise
 */
function copyAssetsByType(capIdFrom, capIdTo, typesArray) {

	var isByType = typesArray != null && typesArray.length > 0;

	//clone all
	if (!isByType) {
		var capModelFrom = aa.cap.getCapByPK(capId, true);
		if (!capModelFrom.getSuccess()) {
			return false;
		}
		capModelFrom = capModelFrom.getOutput();
		var cloned = aa.asset.cloneAssets(capModelFrom, capIdTo);
		return cloned.getSuccess();
	}

	var a = aa.asset.getRecordAssetsByRecordId(capIdFrom);//WorkOrderAssetModel
	if (!a.getSuccess()) {
		logDebug("**INFO: Failed to get src Assets: " + r.getErrorMessage());
		return false;
	}
	var assets = a.getOutput();

	for (as in assets) {

		if (isByType) {

			var seqNum = assets[as].getAssetPK().getG1AssetSequenceNumber();
			var assetData = aa.asset.getAssetData(seqNum);
			if (assetData.getSuccess()) {
				assetData = assetData.getOutput(); //array of AssetScriptModel
			} else {
				continue;
			}
			var assetMasterModel = assetData.getAssetMasterModel();//AssetMasterModel
			if (!arrayContainsValue(typesArray, assetMasterModel.getG1AssetType())) {
				continue;
			}
		}

		assets[as].setCapID(capIdTo);
		aa.asset.createWorkOrderAsset(assets[as]);
	}//for all assets
	return true;
}
/**
 * Copy Licensed Professionals from capIdFrom to capIdTo
 * @param capIdFrom Source Record
 * @param capIdTo Destination Record
 * @param typesArray types/group names to be copied, null or empty array means ALL
 * @returns true if success, false otherwise
 */
function copyLicensedProfByType(capIdFrom, capIdTo, typesArray) {
	var n = aa.licenseProfessional.getLicensedProfessionalsByCapID(capIdFrom).getOutput();
	var isByType = typesArray != null && typesArray.length > 0;

	if (n != null)
		for (x in n) {
			if (isByType && !arrayContainsValue(typesArray, n[x].getLicenseType())) {
				continue;
			}//isByType

			n[x].setCapID(capIdTo);
			aa.licenseProfessional.createLicensedProfessional(n[x]);
		}//for all LPs
	else
		logDebug("No licensed professional on source");
	return true;
}
/**
 * Copy Addresses from capIdFrom to capIdTo
 * @param capIdFrom Source Record
 * @param capIdTo Destination Record
 * @param typesArray types/group names to be copied, null or empty array means ALL
 * @returns true if success, false otherwise
 */
function copyAddressesByType(capIdFrom, capIdTo, typesArray) {

	var isByType = typesArray != null && typesArray.length > 0;
	var hasPrimary = false;

	//check if target has any primary addresses
	var i = aa.address.getAddressByCapId(capIdTo);
	if (i.getSuccess()) {
		address = i.getOutput();
		for (yy in address) {
			if ("Y" == address[yy].getPrimaryFlag()) {
				hasPrimary = true;
				break;
			}
		}
	} else {
		logMessage("**INFO: Failed to get dest addresses: " + i.getErrorMessage());
		return false;
	}

	var i = aa.address.getAddressWithAttributeByCapId(capIdFrom);
	if (i.getSuccess()) {
		address = i.getOutput();
		for (yy in address) {
			if (isByType && !arrayContainsValue(typesArray, address[yy].getAddressType())) {
				continue;
			}//isByType

			newAddress = address[yy];
			newAddress.setCapID(capIdTo);
			if (hasPrimary)
				newAddress.setPrimaryFlag("N");
			aa.address.createAddressWithAPOAttribute(capIdTo, newAddress);
		}//for all address
	} else {
		logMessage("**INFO: Failed to get src addresses: " + i.getErrorMessage());
		return false
	}
	return true;
}
/**
 * Copy Conditions from capIdFrom to capIdTo
 * @param capIdFrom Source Record
 * @param capIdTo Destination Record
 * @param typesArray types/group names to be copied, null or empty array means ALL
 * @returns true if success, false otherwise
 */
function copyConditionsByType(capIdFrom, capIdTo, typesArray) {

	var isByType = typesArray != null && typesArray.length > 0;
	var n = aa.capCondition.getCapConditions(capIdFrom);
	if (n.getSuccess())
		var r = n.getOutput();
	else {
		logDebug("**INFO: failed getting cap conditions: " + n.getErrorMessage());
		return false;
	}
	for (cc in r) {
		var i = r[cc];

		if (isByType && !arrayContainsValue(typesArray, i.getConditionType())) {
			continue;
		}

		var s = aa.capCondition.addCapCondition(capIdTo, i.getConditionType(), i.getConditionDescription(), i.getConditionComment(), i.getEffectDate(), i.getExpireDate(), aa.date
				.getCurrentDate(), i.getRefNumber1(), i.getRefNumber2(), i.getImpactCode(), i.getIssuedByUser(), i.getStatusByUser(), i.getConditionStatus(), currentUserID,
				String("A"), null, i.getDisplayConditionNotice(), i.getIncludeInConditionName(), i.getIncludeInShortDescription(), i.getInheritable(), i.getLongDescripton(), i
						.getPublicDisplayMessage(), i.getResolutionAction(), null, null, i.getReferenceConditionNumber(), i.getConditionGroup(), i.getDisplayNoticeOnACA(), i
						.getDisplayNoticeOnACAFee(), i.getPriority(), i.getConditionOfApproval());
	}//for all conds
	return true;
}
/**
 * Copy ASI from capIdFrom to capIdTo
 * @param capIdFrom Source Record
 * @param capIdTo Destination Record
 * @param typesArray types/group names to be copied, null or empty array means ALL
 * @returns true if success, false otherwise
 */
function copyAppSpecificByType(capIdFrom, capIdTo, typesArray) {

	//make sure editAppSpecific() works with GROUP_NAME.FIELD_NAME parameter format
	var originalUseAppSpecificGroupName = useAppSpecificGroupName;
	useAppSpecificGroupName = true;

	var isByType = typesArray != null && typesArray.length > 0;
	var asiMGroups = aa.appSpecificInfo.getByCapID(capIdFrom).getOutput();
	for (a in asiMGroups) {
		if (isByType && !arrayContainsValue(typesArray, asiMGroups[a].getCheckboxType())) {
			continue;
		}//byType
		editAppSpecific(asiMGroups[a].getCheckboxType() + "." + asiMGroups[a].getCheckboxDesc(), asiMGroups[a].getChecklistComment(), capIdTo);
	}//for all asiMGroups

	//revert to original value
	useAppSpecificGroupName = originalUseAppSpecificGroupName;
}
/**
 * Copy ASIT from capIdFrom to capIdTo
 * @param capIdFrom Source Record
 * @param capIdTo Destination Record
 * @param typesArray types/group names to be copied, null or empty array means ALL
 * @returns true if success, false otherwise
 */
function copyASITablesByType(capIdFrom, capIdTo, typesArray) {

	var n = capIdFrom;
	var r = aa.appSpecificTableScript.getAppSpecificTableGroupModel(n).getOutput();
	var i = r.getTablesArray();
	var s = i.iterator();
	var o = new Array;
	var isByType = typesArray != null && typesArray.length > 0;
	while (s.hasNext()) {
		var f = s.next();
		var l = new Array;
		var c = new Array;
		var tableName = f.getTableName() + "";
		var p = 0;

		if (isByType && !arrayContainsValue(typesArray, tableName)) {
			continue;
		}//isByType

		if (!f.rowIndex.isEmpty()) {
			var m = f.getTableField().iterator();
			var g = f.getColumns().iterator();
			var y = f.getAppSpecificTableModel().getReadonlyField().iterator();
			while (m.hasNext()) {
				if (!g.hasNext()) {
					var g = f.getColumns().iterator();
					c.push(l);
					var l = new Array();
				}
				var b = g.next();
				var w = m.next();
				var E = "N";
				if (y.hasNext()) {
					E = y.next();
				}
				var S = new asiTableValObj(b.getColumnName(), w, E);
				l[b.getColumnName()] = S
			}
			c.push(l);
		}
		addASITable(tableName, c, capIdTo);
	}//for all ASITs
	return true;
}

/**
 * return contacts on record with recordCapId
 * @param recordCapId record id to get contacts from
 * @returns {Array} of ContactModel
 */
function getCapContactModel(recordCapId) {
	var capContactArray = [];
	var capContactResult = aa.people.getCapContactByCapID(recordCapId);
	if (capContactResult.getSuccess()) {
		capContactArray = capContactResult.getOutput();
	}
	return capContactArray;
}
/**
 * check if the array contains a value
 * @param ary
 * @param value
 * @returns {Boolean} true if exist, false otherwise
 */
function arrayContainsValue(ary, value) {
	if (ary != null) {

		//if not array, convert to array
		if (!Array.isArray(ary)) {
			ary = [ ary ];
		}

		for (t in ary) {
			if (ary[t] == value) {
				return true;
			}
		}//for all types
	}
	return false;
}
/**
 * check if an array (mostly assoc array) has a key
 * @param ary
 * @param key
 * @returns {Boolean} true if exist, false otherwise
 */
function arrayContainsKey(ary, key) {
	if (ary != null) {
		for (t in ary) {
			if (t == key) {
				return true;
			}
		}//for all types
	}
	return false;
}

/**
 * this function will return the ASIT on the application submit before event.
 * @param asitName the name of the ASIT
 * @returns the ASIT object if exists else will returns null
 */
function getASITBefore(asitName) {
	var gm = aa.env.getValue("AppSpecificTableGroupModel");
	var gmItem = gm;

	if (null != gmItem && gmItem != "") {
		var ta = gmItem.getTablesMap().values();
		var ASITArray = ta.toArray();
		for ( var x in ASITArray) {
			var tsm = ASITArray[x];
			var tn = tsm.getTableName();
			if (tn != asitName)
				continue;
			if (tsm.rowIndex.isEmpty())
				continue;
			var tempObject = new Array;
			var tempArray = new Array;
			var numrows = 0;
			if (!tsm.rowIndex.isEmpty()) {
				var tsmfldi = tsm.getTableField().iterator();
				var tsmcoli = tsm.getColumns().iterator();
				var numrows = 1;
				while (tsmfldi.hasNext()) {
					if (!tsmcoli.hasNext()) {
						var tsmcoli = tsm.getColumns().iterator();
						tempArray.push(tempObject);
						var tempObject = new Array;
						numrows++
					}
					var tcol = tsmcoli.next();
					var tval = tsmfldi.next();
					var readOnly = "N";
					var fieldInfo = new asiTableValObj(tcol.getColumnName(), tval, readOnly);
					tempObject[tcol.getColumnName()] = fieldInfo
				}

				tempArray.push(tempObject);

				if (tn == asitName) {
					return tempArray;
				} else {
					return null;
				}
			}
		}
	}

	return null;
}

//This was added because the one in ACCELA_FUNCTIONS has a bug (not checking for null which causes an exception)
function contactObjLocal(ccsm) {

	this.people = null; // for access to the underlying data
	this.capContact = null; // for access to the underlying data
	this.capContactScript = null; // for access to the underlying data
	this.capId = null;
	this.type = null;
	this.seqNumber = null;
	this.refSeqNumber = null;
	this.asiObj = null;
	this.asi = new Array(); // associative array of attributes
	this.customFieldsObj = null;
	this.customFields = new Array();
	this.customTablesObj = null;
	this.customTables = new Array();
	this.primary = null;
	this.relation = null;
	this.addresses = null; // array of addresses
	this.validAttrs = false;
	this.validCustomFields = false;
	this.validCustomTables = false;

	this.capContactScript = ccsm;
	if (ccsm) {
		if (ccsm.getCapContactModel == undefined) { // page flow
			this.people = this.capContactScript.getPeople();
			this.refSeqNumber = this.capContactScript.getRefContactNumber();
		} else {
			this.capContact = ccsm.getCapContactModel();
			this.people = this.capContact.getPeople();
			this.refSeqNumber = this.capContact.getRefContactNumber();
			// contact ASI
			var tm = this.people.getTemplate();
			if (tm) {
				var templateGroups = tm.getTemplateForms();
				var gArray = new Array();
				if (!(templateGroups == null || templateGroups.size() == 0)) {
					var subGroups = templateGroups.get(0).getSubgroups();
					if (subGroups != null) {
						for (var subGroupIndex = 0; subGroupIndex < subGroups.size(); subGroupIndex++) {
							var subGroup = subGroups.get(subGroupIndex);
							var fields = subGroup.getFields();
							for (var fieldIndex = 0; fieldIndex < fields.size(); fieldIndex++) {
								var field = fields.get(fieldIndex);
								this.asi[field.getDisplayFieldName()] = field.getDefaultValue();
							}
						}
					}//sub!=null
				}
			}

			// contact attributes
			// Load People Template Fields
			if (this.people.getAttributes() != null) {
				this.asiObj = this.people.getAttributes().toArray();
				if (this.asiObj != null) {
					for ( var xx1 in this.asiObj)
						this.asi[this.asiObj[xx1].attributeName] = this.asiObj[xx1];
					this.validAttrs = true;
				}
			}
			// Load Custom Template Fields
			if (this.capContact.getTemplate() != null && this.capContact.getTemplate().getTemplateForms() != null) {
				var customTemplate = this.capContact.getTemplate();
				this.customFieldsObj = customTemplate.getTemplateForms();

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
							this.customFields[eachField.displayFieldName] = eachField.defaultValue;
							logDebug("(contactObj) {" + eachField.displayFieldName + "} = " + eachField.defaultValue);
							this.validCustomFields = true;
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
		} else {
			pmcal = this.people.getContactAddressList();
			if (pmcal) {
				this.addresses = pmcal.toArray();
			}
		}
	}
	this.toString = function() {
		return this.capId + " : " + this.type + " " + this.people.getLastName() + "," + this.people.getFirstName() + " (id:" + this.seqNumber + "/" + this.refSeqNumber
				+ ") #ofAddr=" + this.addresses.length + " primary=" + this.primary;
	}

	this.getEmailTemplateParams = function(params, vContactType) {
		var contactType = "";
		if (arguments.length == 2)
			contactType = arguments[1];

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
		if (arguments.length == 2)
			newType = arguments[1];
		//2. Get people with target CAPID.
		var targetPeoples = getContactObjs(targetCapId, [ String(newType) ]);
		//3. Check to see which people is matched in both source and target.
		for ( var loopk in targetPeoples) {
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
		if (t == null)
			return false;
		if (!String(this.people.type).equals(String(t.people.type))) {
			return false;
		}
		if (!String(this.people.getFirstName()).equals(String(t.people.getFirstName()))) {
			return false;
		}
		if (!String(this.people.getLastName()).equals(String(t.people.getLastName()))) {
			return false;
		}
		if (!String(this.people.getFullName()).equals(String(t.people.getFullName()))) {
			return false;
		}
		if (!String(this.people.getBusinessName()).equals(String(t.people.getBusinessName()))) {
			return false;
		}
		return true;
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

		if (this.refSeqNumber) {
			var vRefContPeopleObj = aa.people.getPeople(this.refSeqNumber).getOutput();
			var saveResult = aa.people.syncCapContactToReference(this.capContact, vRefContPeopleObj);
			if (saveResult.getSuccess())
				logDebug("(contactObj) syncCapContactToReference : " + this);
			else
				logDebug("(contactObj) error syncCapContactToReference : " + this + " : " + saveResult.getErrorMessage());
		} else {
			logDebug("(contactObj) error syncCapContactToReference : No Reference Contact to Syncronize With");
		}

	}
	this.syncCapContactFromReference = function() {

		if (this.refSeqNumber) {
			var vRefContPeopleObj = aa.people.getPeople(this.refSeqNumber).getOutput();
			var saveResult = aa.people.syncCapContactFromReference(this.capContact, vRefContPeopleObj);
			if (saveResult.getSuccess())
				logDebug("(contactObj) syncCapContactFromReference : " + this);
			else
				logDebug("(contactObj) error syncCapContactFromReference : " + this + " : " + saveResult.getErrorMessage());
		} else {
			logDebug("(contactObj) error syncCapContactFromReference : No Reference Contact to Syncronize With");
		}

	}

	//get method for Attributes
	this.getAttribute = function(vAttributeName) {
		var retVal = null;
		if (this.validAttrs) {
			var tmpVal = this.asi[vAttributeName.toString().toUpperCase()];
			if (tmpVal != null)
				retVal = tmpVal.getAttributeValue();
		}
		return retVal;
	}

	//Set method for Attributes
	this.setAttribute = function(vAttributeName, vAttributeValue) {
		var retVal = false;
		if (this.validAttrs) {
			var tmpVal = this.asi[vAttributeName.toString().toUpperCase()];
			if (tmpVal != null) {
				tmpVal.setAttributeValue(vAttributeValue);
				retVal = true;
			}
		}
		return retVal;
	}

	//get method for Custom Template Fields
	this.getCustomField = function(vFieldName) {
		var retVal = null;
		if (this.validCustomFields) {
			var tmpVal = this.customFields[vFieldName.toString()];
			if (!matches(tmpVal, undefined, null, "")) {
				retVal = tmpVal;
			}
		}
		return retVal;
	}

	//Set method for Custom Template Fields
	this.setCustomField = function(vFieldName, vFieldValue) {

		var retVal = false;
		if (this.validCustomFields) {

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
						if (eachField.displayFieldName == vFieldName) {
							logDebug("(contactObj) updating custom field {" + eachField.displayFieldName + "} = " + eachField.defaultValue + " to " + vFieldValue);
							eachField.setDefaultValue(vFieldValue);
							retVal = true;
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
		if (this.addresses.length > 1) {

			var addrTypeCount = new Array();
			for (y in this.addresses) {
				thisAddr = this.addresses[y];
				addrTypeCount[thisAddr.addressType] = 0;
			}

			for (yy in this.addresses) {
				thisAddr = this.addresses[yy];
				addrTypeCount[thisAddr.addressType] += 1;
			}

			for (z in addrTypeCount) {
				if (addrTypeCount[z] > 1)
					return false;
			}
		} else {
			return true;
		}

		return true;

	}

	this.getAddressTypeCounts = function() { //returns an associative array of how many adddresses are attached.

		var addrTypeCount = new Array();

		for (y in this.addresses) {
			thisAddr = this.addresses[y];
			addrTypeCount[thisAddr.addressType] = 0;
		}

		for (yy in this.addresses) {
			thisAddr = this.addresses[yy];
			addrTypeCount[thisAddr.addressType] += 1;
		}

		return addrTypeCount;

	}

	this.createPublicUser = function() {

		if (!this.capContact.getEmail()) {
			logDebug("(contactObj) Couldn't create public user for : " + this + ", no email address");
			return false;
		}

		if (String(this.people.getContactTypeFlag()).equals("organization")) {
			logDebug("(contactObj) Couldn't create public user for " + this + ", the contact is an organization");
			return false;
		}

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
				userPinBiz.updateActiveStatusAndLicenseIssueDate4PublicUser(aa.getServiceProviderCode(), userSeqNum, "ADMIN");

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
			} else {
				logDebug("(contactObj) **WARNIJNG creating public user " + this.capContact.getEmail() + "  failure: " + result.getErrorMessage());
				return null;
			}
		}

		//  Now that we have a public user let's connect to the reference contact       

		if (this.refSeqNumber) {
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
			if (arguments.length == 1)
				capTypes = arguments[0];

			var pm = aa.people.createPeopleModel().getOutput().getPeopleModel();
			var ccb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.CapContactDAOOracle").getOutput();
			pm.setServiceProviderCode(aa.getServiceProviderCode());
			pm.setContactSeqNumber(this.refSeqNumber);

			var cList = ccb.getCapContactsByRefContactModel(pm).toArray();

			for ( var j in cList) {
				var thisCapId = aa.cap.getCapID(cList[j].getCapID().getID1(), cList[j].getCapID().getID2(), cList[j].getCapID().getID3()).getOutput();
				if (appMatch(capTypes, thisCapId)) {
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
			if (arguments.length == 1)
				capTypes = arguments[0];

			var pm = aa.people.createPeopleModel().getOutput().getPeopleModel();
			var ccb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.CapContactDAOOracle").getOutput();
			pm.setServiceProviderCode(aa.getServiceProviderCode());
			pm.setContactSeqNumber(this.refSeqNumber);

			var cList = ccb.getCapContactsByRefContactModel(pm).toArray();

			for ( var j in cList) {
				var thisCapId = aa.cap.getCapID(cList[j].getCapID().getID1(), cList[j].getCapID().getID2(), cList[j].getCapID().getID3()).getOutput();
				if (capTypes && appMatch(capTypes, thisCapId)) {
					var ccsm = aa.people.getCapContactByPK(thisCapId, cList[j].getPeople().contactSeqNumber).getOutput();
					var newContactObj = new contactObj(ccsm);
					resultArray.push(newContactObj)
				}
			}
		}

		return resultArray;
	}

	this.getRelatedRefLicProfObjs = function() {

		var refLicProfObjArray = new Array();

		// optional 2rd parameter serv_prov_code
		var updating = false;
		var serv_prov_code_4_lp = aa.getServiceProviderCode();
		if (arguments.length == 1) {
			serv_prov_code_4_lp = arguments[0];
		}

		if (this.refSeqNumber && serv_prov_code_4_lp) {
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
			if (xRefContactEntArray) {
				for (iLP in xRefContactEntArray) {
					var xRefContactEnt = xRefContactEntArray[iLP];
					var lpSeqNbr = xRefContactEnt.getEntityID1();
					var lpObjResult = aa.licenseScript.getRefLicenseProfBySeqNbr(aa.getServiceProviderCode(), lpSeqNbr);
					var refLicNum = lpObjResult.getOutput().getStateLicense();

					refLicProfObjArray.push(new licenseProfObject(refLicNum));

				}

			} else {
				logDebug("(contactObj.getRelatedRefLicProfObjs) - No Related Reference License License Professionals");
			}

			return refLicProfObjArray;
		} else {
			logDebug("**ERROR:Some Parameters are empty");
		}

	}

	this.linkRefContactWithRefLicProf = function(licnumber, lictype) {

		var lpObj = new licenseProfObject(licnumber, lictype);
		var refLicProfSeq = lpObj.refLicModel.getLicSeqNbr();
		// optional 2rd parameter serv_prov_code
		var updating = false;
		var serv_prov_code_4_lp = aa.getServiceProviderCode();
		if (arguments.length == 3) {
			serv_prov_code_4_lp = arguments[2];
		}

		if (this.refSeqNumber && refLicProfSeq && serv_prov_code_4_lp) {
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
			if (existedModel.getContactSeqNumber()) {
				logDebug("(contactObj) The License Professional has been linked to the Reference Contact.");
			} else {
				var XRefContactEntityCreatedResult = xRefContactEntityBusiness.createXRefContactEntity(xRefContactEntity);
				if (XRefContactEntityCreatedResult) {
					logDebug("(contactObj) The License Professional has been linked to the Reference Contact.");
				} else {
					logDebug("(contactObj) **ERROR:License professional failed to link to reference contact.  Reason: " + XRefContactEntityCreatedResult.getErrorMessage());
				}
			}
		} else {
			logDebug("**ERROR:Some Parameters are empty");
		}

	}

	this.createRefLicProf = function(licNum, rlpType, addressType, licenseState) {

		// optional 3rd parameter serv_prov_code
		var updating = false;
		var serv_prov_code_4_lp = aa.getServiceProviderCode();
		if (arguments.length == 5) {
			serv_prov_code_4_lp = arguments[4];
			aa.setDelegateAgencyCode(serv_prov_code_4_lp);
		}

		// addressType = one of the contact address types, or null to pull from the standard contact fields.
		var newLic = getRefLicenseProf(licNum, rlpType);

		if (newLic) {
			updating = true;
			logDebug("(contactObj) Updating existing Ref Lic Prof : " + licNum);
		} else {
			var newLic = aa.licenseScript.createLicenseScriptModel();
		}

		peop = this.people;
		cont = this.capContact;
		if (cont.getFirstName() != null)
			newLic.setContactFirstName(cont.getFirstName());
		if (peop.getMiddleName() != null)
			newLic.setContactMiddleName(peop.getMiddleName()); // use people for this
		if (cont.getLastName() != null)
			if (peop.getNamesuffix() != null)
				newLic.setContactLastName(cont.getLastName() + " " + peop.getNamesuffix());
			else
				newLic.setContactLastName(cont.getLastName());
		if (peop.getBusinessName() != null)
			newLic.setBusinessName(peop.getBusinessName());
		if (peop.getPhone1() != null)
			newLic.setPhone1(peop.getPhone1());
		if (peop.getPhone2() != null)
			newLic.setPhone2(peop.getPhone2());
		if (peop.getEmail() != null)
			newLic.setEMailAddress(peop.getEmail());
		if (peop.getFax() != null)
			newLic.setFax(peop.getFax());
		newLic.setAgencyCode(serv_prov_code_4_lp);
		newLic.setAuditDate(sysDate);
		newLic.setAuditID(currentUserID);
		newLic.setAuditStatus("A");
		newLic.setLicenseType(rlpType);
		newLic.setStateLicense(licNum);
		newLic.setLicState(licenseState);
		//setting this field for a future enhancement to filter license types by the licensing board field. (this will be populated with agency names)
		var agencyLong = lookup("CONTACT_ACROSS_AGENCIES", servProvCode);
		if (!matches(agencyLong, undefined, null, ""))
			newLic.setLicenseBoard(agencyLong);
		else
			newLic.setLicenseBoard("");

		var addr = null;

		if (addressType) {
			for ( var i in this.addresses) {
				var cAddr = this.addresses[i];
				if (addressType.equals(cAddr.getAddressType())) {
					addr = cAddr;
				}
			}
		}

		if (!addr)
			addr = peop.getCompactAddress(); //  only used on non-multiple addresses or if we can't find the right multi-address

		if (addr.getAddressLine1() != null)
			newLic.setAddress1(addr.getAddressLine1());
		if (addr.getAddressLine2() != null)
			newLic.setAddress2(addr.getAddressLine2());
		if (addr.getAddressLine3() != null)
			newLic.getLicenseModel().setTitle(addr.getAddressLine3());
		if (addr.getCity() != null)
			newLic.setCity(addr.getCity());
		if (addr.getState() != null)
			newLic.setState(addr.getState());
		if (addr.getZip() != null)
			newLic.setZip(addr.getZip());
		if (addr.getCountryCode() != null)
			newLic.getLicenseModel().setCountryCode(addr.getCountryCode());

		if (updating) {
			myResult = aa.licenseScript.editRefLicenseProf(newLic);

		} else {
			myResult = aa.licenseScript.createRefLicenseProf(newLic);
			if (myResult.getSuccess()) {
				var newRefLicSeqNbr = parseInt(myResult.getOutput());
				this.linkRefContactWithRefLicProf(licNum, rlpType, serv_prov_code_4_lp);
			}
		}

		if (arguments.length == 5) {
			aa.resetDelegateAgencyCode();
		}

		if (myResult.getSuccess()) {
			logDebug("Successfully added/updated License No. " + licNum + ", Type: " + rlpType + " From Contact " + this);
			return true;
		} else {
			logDebug("**WARNING: can't create ref lic prof: " + myResult.getErrorMessage());
			return false;
		}
	}

	this.getAKA = function() {
		var aka = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.PeopleAKABusiness").getOutput();
		if (this.refSeqNumber) {
			return aka.getPeopleAKAListByContactNbr(aa.getServiceProviderCode(), String(this.refSeqNumber)).toArray();
		} else {
			logDebug("contactObj: Cannot get AKA names for a non-reference contact");
			return false;
		}
	}

	this.addAKA = function(firstName, middleName, lastName, fullName, startDate, endDate) {
		if (!this.refSeqNumber) {
			logDebug("contactObj: Cannot add AKA name for non-reference contact");
			return false;
		}

		var aka = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.PeopleAKABusiness").getOutput();
		var args = new Array();
		var akaModel = aa.proxyInvoker.newInstance("com.accela.orm.model.contact.PeopleAKAModel", args).getOutput();
		var auditModel = aa.proxyInvoker.newInstance("com.accela.orm.model.common.AuditModel", args).getOutput();

		var a = aka.getPeopleAKAListByContactNbr(aa.getServiceProviderCode(), String(this.refSeqNumber));
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

	this.removeAKA = function(firstName, middleName, lastName) {
		if (!this.refSeqNumber) {
			logDebug("contactObj: Cannot remove AKA name for non-reference contact");
			return false;
		}

		var removed = false;
		var aka = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.PeopleAKABusiness").getOutput();
		var l = aka.getPeopleAKAListByContactNbr(aa.getServiceProviderCode(), String(this.refSeqNumber));

		var i = l.iterator();
		while (i.hasNext()) {
			var thisAKA = i.next();
			if ((!thisAKA.getFirstName() || thisAKA.getFirstName().equals(firstName)) && (!thisAKA.getMiddleName() || thisAKA.getMiddleName().equals(middleName))
					&& (!thisAKA.getLastName() || thisAKA.getLastName().equals(lastName))) {
				i.remove();
				logDebug("contactObj: removed AKA Name : " + firstName + " " + middleName + " " + lastName);
				removed = true;
			}
		}

		if (removed)
			aka.saveModels(aa.getServiceProviderCode(), this.refSeqNumber, l);
	}

	this.hasPublicUser = function() {
		if (this.refSeqNumber == null)
			return false;
		var s_publicUserResult = aa.publicUser.getPublicUserListByContactNBR(aa.util.parseLong(this.refSeqNumber));

		if (s_publicUserResult.getSuccess()) {
			var fpublicUsers = s_publicUserResult.getOutput();
			if (fpublicUsers == null || fpublicUsers.size() == 0) {
				logDebug("The contact(" + this.refSeqNumber + ") is not associated with any public user.");
				return false;
			} else {
				logDebug("The contact(" + this.refSeqNumber + ") is associated with " + fpublicUsers.size() + " public users.");
				return true;
			}
		} else {
			logMessage("**ERROR: Failed to get public user by contact number: " + s_publicUserResult.getErrorMessage());
			return false;
		}
	}

	this.linkToPublicUser = function(pUserId) {

		if (pUserId != null) {
			var pSeqNumber = pUserId.replace('PUBLICUSER', '');

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
			getACARecordParam4Notification(params, acaUrl);
			addParameter(params, "$$licenseType$$", cap.getCapType().getAlias());
			addParameter(params, "$$altID$$", capIDString);
			var notificationName;

			if (this.people.getContactTypeFlag() == "individual") {
				notificationName = this.people.getFirstName() + " " + this.people.getLastName();
			} else {
				notificationName = this.people.getBusinessName();
			}

			if (notificationName)
				addParameter(params, "$$notificationName$$", notificationName);
			if (this.refSeqNumber) {
				var v = new verhoeff();
				var pinCode = v.compute(String(this.refSeqNumber));
				addParameter(params, "$$pinCode$$", pinCode);

				sendNotification(sysFromEmail, toEmail, "", "PUBLICUSER CREATE AND LINK", params, null);
			}

		}

	}

	this.getRelatedRefContacts = function() { //Optional relationship types array 

		var relTypes;
		if (arguments.length > 0)
			relTypes = arguments[0];

		var relConsArray = new Array();

		if (matches(this.refSeqNumber, null, undefined, ""))
			return relConsArray;

		//check as the source
		var xrb = aa.proxyInvoker.newInstance("com.accela.aa.aamain.people.XRefContactEntityBusiness").getOutput();
		xRefContactEntityModel = aa.people.getXRefContactEntityModel().getOutput();
		xRefContactEntityModel.setContactSeqNumber(parseInt(this.refSeqNumber));
		x = xrb.getXRefContactEntityList(xRefContactEntityModel);

		if (x.size() > 0) {
			var relConList = x.toArray();

			for ( var zz in relConList) {
				var thisRelCon = relConList[zz];
				var addThisCon = true;
				if (relTypes) {
					addThisCon = exists(thisRelCon.getEntityID4(), relTypes);
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

			for ( var zz in relConList) {
				var thisRelCon = relConList[zz];
				var addThisCon = true;
				if (relTypes) {
					addThisCon = exists(thisRelCon.getEntityID4(), relTypes);
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

//////////////////// DPOR API //////////////////////////////////////////////////////////////

function callDporApi(lpNumber) {
	var dporURL = aa.bizDomain.getBizDomainByValue("DPOR_INTERFACE", "URL").getOutput();
	if (dporURL == null || dporURL == "") {
		var tmpResp = new soapRespObj();
		tmpResp.isErr = true;
		tmpResp.errorMessage = "ERROR:API url not configured";
		return tmpResp;
	}
	dporURL = dporURL.getDescription();

	var dporToken = aa.bizDomain.getBizDomainByValue("DPOR_INTERFACE", "TOKEN").getOutput();
	if (dporToken == null || dporToken == "") {
		var tmpResp = new soapRespObj();
		tmpResp.isErr = true;
		tmpResp.errorMessage = "ERROR:API token not configured";
		return tmpResp;
	}
	dporToken = dporToken.getDescription();

	eval(getScriptText("DPOR_INTERFACE", aa.getServiceProviderCode(), false));

	var dporSoapResult = invokeDPOR(lpNumber, dporToken, dporURL);
	return dporSoapResult;
}
