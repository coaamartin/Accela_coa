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
    scheduleForestryRequestPlantingSiteReview(inspectionTypeForestrySiteReview);
    closeTreePlantingIntakeTask(workflowTask, workflowStatusArray, workflowComment, activateTaskName);
    ////TODO:
    ////PopulateTreeInformationCustomList(treeInformaionCustomListName);
}

function scheduleForestryRequestPlantingSiteReview(inspectionTypeForestrySiteReview) {
    var inspectorID = getInspectorID();

    if (typeof (inspectorID) != "undefined" && inspectorID != null && inspectorID != "")
        scheduleInspection(inspectionTypeForestrySiteReview, 0, inspectorID);
}

function getInspectorID() {
    var inspID;
    var cdScriptObjResult = aa.cap.getCapDetail(capId);
    var objCDScript = cdScriptObjResult.getOutput();
    capDetailModel = objCDScript.getCapDetailModel();
    if (typeof (capDetailModel) != "undefined" && capDetailModel != null)
        inspID = capDetailModel.getAsgnStaff();

    return inspID;
}


function PopulateTreeInformationCustomList(treeInformaionCustomListName) {
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

function doesASITRowExist(tName, cName, cValue) {
    itemCap = capId;
    if (arguments.length > 3)
        itemCap = arguments[3];
    try {
        tempASIT = loadASITable(tName, itemCap);
        if (tempASIT == undefined || tempASIT == null)
            return false;

        var rowFound = false;

        if (tempASIT != null && tempASIT.length > 0) {
            for (var ea in tempASIT) {
                var row = tempASIT[ea];
                fv = "" + row[cName].fieldValue;
                cValue = "" + cValue;
                r = new RegExp("^" + cValue + "(.)*");

                if ((String(fv).match(r)) || (fv == cValue)) {
                    return true;

                }
            }
        }

        return rowFound;
    }
    catch (err) {
        logDebug(err);
        return false;
    }
}