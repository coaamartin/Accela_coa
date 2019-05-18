// SCRIPTNUMBER: 16
// SCRIPTFILENAME: 16_cancelScheduledInpsections.js
// PURPOSE: If license becomes inactive with any of the below WF status's then cancel all scheduled inpsections
// DATECREATED: 05/18/2019
// BY: SWAKIL
// CHANGELOG: 05/18/2019 , SWAKIL Created this file. 

if ((wfTask == "License Status" && (wfStatus == "Inactive" || wfStatus == "Closed" || wfStatus == "Revoked")) ||
	(wfTask == "License Issuance" && (wfStatus == "Denied" || wfStatus == "Withdrawn"))){
	cancelScheduledInspections();
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