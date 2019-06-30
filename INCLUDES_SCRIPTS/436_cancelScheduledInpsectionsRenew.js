// SCRIPTNUMBER: 436
// SCRIPTFILENAME: 436_cancelScheduledInpsections.js
// PURPOSE: If license becomes inactive with any of the below WF status's then cancel all scheduled inpsections
// DATECREATED: 05/18/2019
// BY: SWAKIL
// CHANGELOG: 05/18/2019 , SWAKIL Created this file. 

if ((wfTask == "Renewal Review" && (wfStatus == "Withdrawn" || wfStatus == "Denied")) ||
    (wfTask == "License Issuance" && (wfStatus == "Denied" || wfStatus == "Withdrawn"))){
    vLicenseID = getParentLicenseCapID(capId);
    vIDArray = String(vLicenseID).split("-");
    vLicenseID = aa.cap.getCapID(vIDArray[0], vIDArray[1], vIDArray[2]).getOutput();

    if (vLicenseID != null) {
        var tempCapId = capId;
        capId = vLicenseID;
        cancelScheduledInspections();
        //restore capId
        capId = tempCapId;
    }
}

function cancelScheduledInspections() {
    var insps = aa.inspection.getInspections(capId).getOutput();
    for (var i in insps){
        var thisInsp = insps[i];
        var inspStatus = thisInsp.getInspectionStatus();

        if ("Scheduled".equals(inspStatus))
        {
            var inspId = thisInsp.getIdNumber();
            var res=aa.inspection.cancelInspection(capId, inspId);
            if (res.getSuccess()){
                logDebug("Inspection Canceled:" + inspId);
            }
        }
    }
}