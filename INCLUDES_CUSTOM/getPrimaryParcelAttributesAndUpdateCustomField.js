function getPrimaryParcelAttributesAndUpdateCustomField(stdForestryInspectorAssignments) {
    var capParcelResult = aa.parcel.getParcelByCapId(capId, null);
    if (capParcelResult.getSuccess()) {
        var arrParcels = capParcelResult.getOutput().toArray();
        for (var p in arrParcels) {
            var isPrimaryParcel = arrParcels[p].isPrimaryParcel();
            if (isPrimaryParcel) {
                var township = arrParcels[p].getTownship();
                var range = arrParcels[p].getRange();
                var section = arrParcels[p].getSection();
                var areaNumberValue = township + range +  "0" + section ;
                logDebug("Area: " + areaNumberValue);
                editAppSpecific("Area Number", areaNumberValue);
                var areaNo = arrParcels[p].getInspectionDistrict();
                var trs = township + range + section;
                if ((typeof (areaNo) != "undefined" && areaNo != null && areaNo != "") || (typeof (trs) != "undefined" && trs != null && trs != ""))
                    mapAreaTRSAssignmentInspectors(areaNo, trs, stdForestryInspectorAssignments);
            }
        }
    }
}