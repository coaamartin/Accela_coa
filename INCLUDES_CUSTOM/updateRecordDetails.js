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