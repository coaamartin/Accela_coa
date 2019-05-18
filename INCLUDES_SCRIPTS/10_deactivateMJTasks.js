// SCRIPTNUMBER: 10
// SCRIPTFILENAME: 10_deactivateMJTasks.js
// PURPOSE: (Licenses/Marijuana//Application)  If the wfTask Status "Denied" or "Withdrawn" are selected and saved
//          - Close ALL active workflow tasks.
// DATECREATED: 05/18/2019
// BY: SWAKIL
// CHANGELOG: 05/18/2019 , SWAKIL Created this file. 

if (wfStatus == "Denied" || wfStatus == "Withdrawn"){
    var wfProcess = getWfProcessCodeByCapId(capId);
    if(wfProcess) deactivateActiveTasks(wfProcess);
}
