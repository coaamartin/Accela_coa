/*
Script ID-Trees from GIS:
Paul H. Rose
Script will first get all associated GIS features and then do a get buffer of GIS features in the Trees layer.
 */

try {
	logDebug("Executing Forestry Permit record Tree Inventory GIS Fields");
	logDebug("Looking at CAP " + capId);
	var gisIdForLayer = "";
	var gisObjResult = aa.gis.getCapGISObjects(capId); // get gis objects on the cap
	if (gisObjResult.getSuccess())
		var fGisObj = gisObjResult.getOutput();
	else {
		logDebug("**WARNING: Getting GIS objects for CAP.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage());
	}

	var arrGIS = getGISInfoArray_Buffer("AURORACO", "Trees", ["TREE_ID_NO", "MAN_UNIT", "DIAMETER", "SPECIES"], 3, "feet");
	var br = "<br>";
	for (x in arrGIS) {
		var thisGIS = arrGIS[x];
		var treeIdNo = thisGIS["TREE_ID_NO"];
		var manUnit = thisGIS["MAN_UNIT"];
		var diameter = thisGIS["DIAMETER"];
		var species = thisGIS["SPECIES"];

		logDebug("x: " + x + ": TREE_ID_NO: " + treeIdNo + ",  MAN_UNIT: " + manUnit + ",  DIAMETER: " + diameter + ",  SPECIES: " + species);

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

			addToASITable("TREE INFORMATION", newRow);
		}
	}
} catch (err) {
	logDebug("A JavaScript Error occurred: ASA:Forestry/Permit/*/*: Trees from GIS: " + err.message);
	logDebug(err.stack)
};

function IsStrInArry(eVal, argArr) {
	for (x in argArr) {
		if (eVal == argArr[x]) {
			return true;
		}
	}
	return false;
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
		if (tempASIT == undefined || tempASIT == null)
			return false;
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
	} catch (err) {
		logDebug(err);
		return false;
	}
}
