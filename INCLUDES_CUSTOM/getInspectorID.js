function getInspectorID() {
    var inspID;
    var cdScriptObjResult = aa.cap.getCapDetail(capId);
    var objCDScript = cdScriptObjResult.getOutput();
    capDetailModel = objCDScript.getCapDetailModel();
    if (typeof (capDetailModel) != "undefined" && capDetailModel != null)
        inspID = capDetailModel.getAsgnStaff();
        logDebug("Inspector ID: " + inspID);
    return inspID;
}