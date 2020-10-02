function getParentCapIDForReview(capid) {
    if (capid == null || aa.util.instanceOfString(capid)) {
        return null;
    }
    //1. Get parent license for review
    var result = aa.cap.getProjectByChildCapID(capid, "Renewal", "Incomplete"); //"Incomplete" was"Review"
    if (result.getSuccess()) {
        projectScriptModels = result.getOutput();
        if (projectScriptModels == null || projectScriptModels.length == 0) {
            logDebug("ERROR: Failed to get parent CAP with CAPID(" + capid + ") for review");
            return null;
        }
        //2. return parent CAPID.
        projectScriptModel = projectScriptModels[0];
        return projectScriptModel.getProjectID();
    }
    else {
        logDebug("ERROR: Failed to get parent CAP by child CAP(" + capid + ") for review: " + result.getErrorMessage());
        return null;
    }
}