
function getOwner(capId) {
    capOwnerArr = null;
    var s_result = aa.owner.getOwnerByCapId(capId);
    if (s_result.getSuccess()) {
        capOwnerArr = s_result.getOutput();
        if (capOwnerArr == null || capOwnerArr.length == 0) {
            aa.print("WARNING: no Owner on this CAP:" + capId);
            capOwnerArr = null;
        }
    } else {
        aa.print("ERROR: Failed to Owner: " + s_result.getErrorMessage());
        capOwnerArr = null;
    }
    return capOwnerArr;
}