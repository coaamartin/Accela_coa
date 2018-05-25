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