//Start Script 60 - User story 3
//Record Type:
//Forestry/*/*/*
//Event:
//ApplicationSubmitAfter(Civic Platform) or ConvertToRealCapAfter (ACA)
//If criteria:
//On application submission
//Action:
//1. assigned to Forestry Inspector (update record detail Department and User) based on the Record Custom Field Area Number (form GIS or Parcel data) (See script 154 that is working and has the code for this - The layer is here: Database Connections\GISSQL.sde.layeruser.prod.sde\sde.PARKS.Forestry\sde.PARKS.ForestryIndexMapbookPoly).
//2. Update the Record Assigned To the appropriate forestry inspector
//3. If the record type Forestry/Request/Planting/* then schedule inspection type “Forestry Site Review” to the assigned person in the record assigned to.
//4. Take all the address fields that have data and concatenate into a string and update the Application Name field.
//5. If record type Forestry/Request/Citizen/* get value from Custom Field “Source of Request” if value is Staff then insert status of “Assigned” and add the comments “Proactive” in the comments on the workflow task “Tree Request Intake” and move the work flow task forward by Activating the workflow task “Inspection Phase”.
//6. If Record Type Forestry/Request/Citizen/NA or Forestry/Permit/Na/NA Create Scheduled inspection of type “Forestry Inspection” with the inspector assigned to the record assigned to with the current date.
var vGISInfo;
var vInspectorID;

/*
// Update ASI
var vGISTownship = getGISInfo("AURORACO","City Limits","JURISDICTION");
var vGISRange = getGISInfo("AURORACO","City Limits","Shape.STArea()") + " : " + getGISInfo("AURORACO","Parcels","Shape.StLength()");
var vGISSection = getGISInfo("AURORACO","City Limits","Shape.StLength()");

var vAreaName = vGISTownship + " : " + vGISRange + " : " + 0 +  " : " + vGISSection;

logDebug("Area Info: " + vAreaName);
*/

// Get inspector from GIS
vGISInfo = getGISBufferInfo("AURORACO", "Forestry Index Mapbook Poly", "0.01", "PlantBookUpdatePhase");
if (ifTracer(vGISInfo.length != null && vGISInfo.length > 0, 'found inspector')) {
	vInspectorID = (x[0]["PlantBookUpdatePhase"]);
}

if (typeof(vInspectorID) != "undefined" && vInspectorID != null && vInspectorID != "") {
	// Assign record to inspector
	assignCap(vInspectorID);
	
	// Schedule inspections
	if (appMatch("Forestry/Request/Planting/*") == true) {
		scheduleInspection("Forestry Site Review", 0, vInspectorID);
	} else if (appMatch("Forestry/Request/Citizen/NA") == true || appMatch("Forestry/Permit/NA/NA") == true) {
		scheduleInspection("Forestry Inspection", 0, vInspectorID);
	}
}

// Edit application name with address
var vAddress = getAddressInALine();
if (vAddress != null) {
	editAppName(vAddress);
}

// Update workflow
if (appMatch("Forestry/Request/Citizen/*")) {
	var vASIValue = getAppSpecific("Source of Request");
	if (vASIValue != null && vASIValue != "") {
		resultWorkflowTask("Tree Request Intake", "Assigned", "Proactive", "Updated by ASA:Forestry/Request/Citizen/*");
	}
}
//End Script 60 - User story 3
