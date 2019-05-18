// SCRIPTNUMBER: 10
// SCRIPTFILENAME: 10_closeLicenseMJ.js
// PURPOSE: (Licenses/Marijuana//Renewal)  If the wfTask Status "Denied" or "Withdrawn" are selected and 
// 			saved - Associated License record status should be updated to "Closed"
//          
// DATECREATED: 05/18/2019
// BY: SWAKIL
// CHANGELOG: 05/18/2019 , SWAKIL Created this file. 

if (wfStatus == "Denied" || wfStatus == "Withdrawn"){
    vLicenseID = getParentLicenseCapID(capId);
    vIDArray = String(vLicenseID).split("-");
    vLicenseID = aa.cap.getCapID(vIDArray[0], vIDArray[1], vIDArray[2]).getOutput();

    if (vLicenseID != null) {
        updateAppStatus("Closed", "Updated by 10_closeLicenseMJ.js", vLicenseID);
    }
}