/* Title : Inspection Scheduling(Building): Populate the newly created inspection request comment field with the contents of the record Description field (PostScript)

Purpose :   Both user stories on this record require the same postScript, which populates the newly created inspection request comment field
with the contents of the record Description field. The creation of the inspection is configured with JSON CONF_BUILDING_INSPECTION_SCHEDULING
and working as expected. This business rule doesn't seem like something that common, so don't want to add it as an enhancement,
but seems a good candidate for a small postScript. Especially since it can be used for both these scripts.

Author :   Israa Ismail

Functional Area : Records
 
Notes : The postScript name must be added to the json file : "postScript": "POST_BUILDING_INSPECTIONSCHEDULING"
	

Script Name "POST_BUILDING_INSPECTIONSCHEDULING" , Sample Call : populateRequestComment()

*/

populateRequestComment();
function  populateRequestComment(){
	var detailedDesc=workDescGet(capId);
	logDebug("Getting inspection type " + rules.action.inspectionType);
	var iObjResult = getLastInspectionbyType(capId, rules.action.inspectionType);
	if (iObjResult!=null){
		logDebug("Updating inspection comments to " + detailedDesc);
		iObjResult.setInspectionComments(String(detailedDesc));
		aa.inspection.editInspection(iObjResult);
	}
}

function getLastInspectionbyType(capId, inspectioType) {
	var ret = null;
	var r = aa.inspection.getInspections(capId);
	if (r.getSuccess()) {
		var maxId = -1;
		var maxInsp = null;
		var inspArray = r.getOutput();

		for (i in inspArray) {
			if (String(inspectioType).equals(inspArray[i].getInspectionType())) {
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
	} else {
		aa.debug("LIST INSP ERROR:", r.getErrorMessage())
	}
	return ret;
}
