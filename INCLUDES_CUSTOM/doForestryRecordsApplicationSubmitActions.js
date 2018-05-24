/*
Title : Forestry Record Application Submission Actions (ApplicationSubmitAfter,ConvertToRealCapAfter)

Purpose : Actions that need to occur upon submission of a Forestry record of any kind.

Author: Ali Othman
 
Functional Area : Parcel, Inspections, Custom Fields, Address, Records

Sample Call:
   doForestryRecordsApplicationSubmitActions("Forestry_Inspector_Assignments", "Tree Inspect", "Forestry Inspection");
   
Notes:
	
*/


function doForestryRecordsApplicationSubmitActions(stdForestryInspectorAssignments, inspectionGroupCode, inspectionTypeForestryInspection) {
    getPrimaryParcelAttributesAndUpdateCustomField(stdForestryInspectorAssignments);
    updateApplicationNameWithAddressInfo();
    createAndAssignPendingInspection(inspectionGroupCode, inspectionTypeForestryInspection);
}

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

function mapAreaTRSAssignmentInspectors(areaNo, trs, stdForestryInspectorAssignments) {
    var bizDomScriptResult = aa.bizDomain.getBizDomain(stdForestryInspectorAssignments);
    if (bizDomScriptResult.getSuccess()) {
        arrBizDomScript = bizDomScriptResult.getOutput().toArray();
        if (arrBizDomScript != null && arrBizDomScript.length > 0) {
            for (var b in arrBizDomScript) {
                var bizDomainValue = arrBizDomScript[b].getBizdomainValue();
                var inspectorName = arrBizDomScript[b].getDescription();
                if (typeof (bizDomainValue) != "undefined" && bizDomainValue != null && bizDomainValue != "") {
                    var arrBizDomainValue = bizDomainValue.split("\\|");
                    if (arrBizDomainValue != null && arrBizDomainValue.length > 0) {
                        if (typeof (areaNo) != "undefined" && areaNo != null && areaNo != "") {
                            if (arrBizDomainValue[0] != null && arrBizDomainValue[0] != "") {
                                if (areaNo == arrBizDomainValue[0]) {
                                    if (typeof (inspectorName) != "undefined" && inspectorName != null && inspectorName != "") {
                                        getAssignInspectorID(inspectorName);
                                        break;
                                    }
                                }
                            }
                        } else if (typeof (trs) != "undefined" && trs != null && trs != "") {
                            if (arrBizDomainValue[1] != null && arrBizDomainValue[1] != "") {
                                if (trs == arrBizDomainValue[1]) {
                                    if (typeof (inspectorName) != "undefined" && inspectorName != null && inspectorName != "") {
                                        getAssignInspectorID(inspectorName);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function getAssignInspectorID(inspectorName) {
    var arrInspectorName = inspectorName.split(' ');
    if (arrInspectorName != null && arrInspectorName.length > 0) {
        var firstName = arrInspectorName[0];
        var middleName = null;
        var lastName = arrInspectorName[1];
        var personResult = aa.person.getUser(firstName, middleName, lastName);
        if (personResult.getSuccess()) {
            var objPerson = personResult.getOutput();
            var inspectorID = objPerson.getUserID();
            var inspectorDepartment = objPerson.getDeptOfUser();
            if (typeof (inspectorID) != "undefined" && inspectorID != null && inspectorID != "" && typeof (inspectorDepartment) != "undefined" && inspectorDepartment != null && inspectorDepartment != "")
                updateRecordDetails(inspectorID, inspectorDepartment);
        }
    }
}

function updateRecordDetails(inspectorID, inspectorDepartment) {
    var cdScriptObjResult = aa.cap.getCapDetail(capId);
    var objCDScript = cdScriptObjResult.getOutput();
    capDetailModel = objCDScript.getCapDetailModel();
    if (typeof (capDetailModel) != "undefined" && capDetailModel != null) {
        capDetailModel.setAsgnDept(inspectorDepartment);
        capDetailModel.setAsgnStaff(inspectorID);
        aa.cap.editCapDetail(capDetailModel);
    }
}

function updateApplicationNameWithAddressInfo() {
    var capAddrResult = aa.address.getAddressByCapId(capId);
    if (capAddrResult.getSuccess()) {
        var listAddress = capAddrResult.getOutput();
        if (listAddress != null && listAddress.length > 0) {
            var checkForPrimary = true;
            if (listAddress.length == 1)
                checkForPrimary = false;

            for (var a in listAddress) {
                var objAddress = listAddress[a];
                if (typeof (objAddress) != "undefined" && objAddress != null) {
                    if (checkForPrimary) {
                        var primaryFlag = objAddress.getPrimaryFlag();
                        if (typeof (primaryFlag) != "undefined" && primaryFlag != null && primaryFlag != "") {
                            if (primaryFlag.toLowerCase() == "y") {
                                var displayAddress = objAddress.getDisplayAddress();
                                if (typeof (displayAddress) != "undefined" && displayAddress != null && displayAddress != "")
                                    editAppName(displayAddress);
                                break;
                            }
                        }
                    } else {
                        var displayAddress = objAddress.getDisplayAddress();
                        if (typeof (displayAddress) != "undefined" && displayAddress != null && displayAddress != "")
                            editAppName(displayAddress);
                        break;
                    }
                }
            }
        }
    }
}

function createAndAssignPendingInspection(inspectionGroupCode, inspectionTypeForestryInspection) {
    createPendingInspection(inspectionGroupCode, inspectionTypeForestryInspection);
    var assignedStaff = getAssignedStaff();
    var inspectionID = getPendingInspectionID();

    if (inspectionID != null && inspectionID != "" && assignedStaff != null && assignedStaff != "")
        assignInspection(inspectionID, assignedStaff);
}

function getAssignedStaff() {
    var asgnedStaff;
    var cdScriptObjResult = aa.cap.getCapDetail(capId);
    var objCDScript = cdScriptObjResult.getOutput();
    capDetailModel = objCDScript.getCapDetailModel();
    if (typeof (capDetailModel) != "undefined" && capDetailModel != null)
        asgnedStaff = capDetailModel.getAsgnStaff();

    return asgnedStaff;
}

function getPendingInspectionID() {
    var inspID;
    var objInspResult = aa.inspection.getInspections(capId);
    if (objInspResult.getSuccess()) {
        var listInspection = objInspResult.getOutput();
        for (l in listInspection) {
            var inspectionType = listInspection[l].getInspectionType();
            var inspectionStatus = listInspection[l].getInspectionStatus();
            if (typeof (inspectionType) != "undefined" && inspectionType != null && inspectionType != "" && typeof (inspectionStatus) != "undefined" && inspectionStatus != null && inspectionStatus != "") {
                if (inspectionType.toLowerCase() == "forestry inspection" && inspectionStatus.toLowerCase() == "pending") {
                    var inspID = listInspection[l].getIdNumber();
                    break;
                }
            }
        }
    }

    return inspID;
}
