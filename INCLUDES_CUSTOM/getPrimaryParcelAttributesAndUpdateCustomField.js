
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
					var vArea = getGISInfo("AURORACO", "Forestry Index Mapbook Poly", "TRS_NO");
					logDebug("Area: " + vArea);
					//Save to ASI field
					editAppSpecific("Area Number", vArea);
				}
            }
        }
    }
}
   