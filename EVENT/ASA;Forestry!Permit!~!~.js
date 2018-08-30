
//Populate GIS objects
var gisIdForLayer = "";
var gisObjResult = aa.gis.getCapGISObjects(capId); // get gis objects on the cap
if (gisObjResult.getSuccess()) 	
	var fGisObj = gisObjResult.getOutput();
else
	{ logDebug("**WARNING: Getting GIS objects for CAP.  Reason is: " + gisObjResult.getErrorType() + ":" + gisObjResult.getErrorMessage()); }

//Script 198
showDebug = true
treeInventoryPopulate()


