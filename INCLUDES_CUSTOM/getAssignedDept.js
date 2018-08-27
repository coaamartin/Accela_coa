function getAssignedDept() {
    try {
        var asgnDept = "";
        var cdScriptObjResult = aa.cap.getCapDetail(capId);
        if (!cdScriptObjResult.getSuccess()) {
            aa.debug("**ERROR: No cap detail script object : ",
                    cdScriptObjResult.getErrorMessage());
            return "";
        }

        var cdScriptObj = cdScriptObjResult.getOutput();
        if (!cdScriptObj) {
            aa.debug("**ERROR: No cap detail script object", "");
            return "";
        }
        cd = cdScriptObj.getCapDetailModel();
        var asgnDept = cd.getAsgnDept();

        return asgnDept;

    } catch (e) {
        aa.debug("getAssignedDept ", e);
        return null;
    }
}