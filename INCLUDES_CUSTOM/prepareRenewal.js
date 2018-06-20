function prepareRenewal() {

    if (isRenewProcess(parentCapId, capId)) {
        logDebug("CAPID(" + parentCapId + ") is ready for renew. PartialCap (" + capId + ")");

        //Associate partial cap with parent CAP.
        var result = aa.cap.createRenewalCap(parentCapId, capId, true);
        if (result.getSuccess()) {
            // Set B1PERMIT.B1_ACCESS_BY_ACA to "N" for partial CAP to not allow that it is searched by ACA user.
            aa.cap.updateAccessByACA(capId, "N");
        }
        else
        { logDebug("ERROR: Associate partial cap with parent CAP. " + result.getErrorMessage()); return false };

        return true;
    }
    else
    { logDebug("Renewal Process did not finish properly"); return false; }
}
