/*Event   InspectionResultSubmitAfter   
Criteria   If SWMP Permit inspection Type "Final Inspection" = "complete" then 
status wf step "closure" = "Return Fiscal Security" and email the applicant the inspection report 
If SWMP Permit inspection Type "Final Inspection" = "Fail" 
then make a follow up final inspection schedulable on ACA  
created by swakil
*/

var inspResultComment = "";

if ("Final Inspection".equals(inspType) && "Complete".equals(inspResult))
{
	//status wf step "Closure" = "Return Fiscal Security"
	updateTask("Closure","Return Fiscal Security", "updated by EMSE","");

	//Email Applicant Inspection Report
	var contact = "Applicant";
    var template = "JD_TEST_TEMPLATE";
    var emailparams = aa.util.newHashtable();
    emailparams.put("$$inspComments$$", inspResultComment);

    var reportname = "JD_TEST_REPORT";
	var reportparams = aa.util.newHashtable();
	reportparams.put("DEPARTMENT", "Administrator");
    emailContacts(contact, template, emailparams, reportname, reportparams, "N", "");	

}
else if ("Final Inspection".equals(inspType) && "Fail".equals(inspResult))
{
	//If SWMP Permit inspection Type "Final Inspection" = "Fail" 
	//then make a follow up final inspection schedulable on ACA  
	addPendingInspection("Final Inspection", "Generated by EMSE");
}

function addPendingInspection(iType, inspComm) {
    var inspId = 0;
    var inspectorObj = null;
    var inspTime = null;

    var schedRes = aa.inspection.scheduleInspection(capId, inspectorObj, aa.date.parseDate(dateAdd(null, 0)), inspTime, iType, inspComm);

    if (schedRes.getSuccess()) {
        inspId = schedRes.output;
        aa.print("inspId = " + inspId);

        var justScheduled = aa.inspection.getInspection(capId, inspId);

        if (justScheduled.getSuccess()) {
            var inspModel = justScheduled.getOutput();

            inspModel.setInspectionStatus("Pending");
            aa.inspection.editInspection(inspModel);
        }
        else {
            aa.print("Failed to get inspection.");
        }

        logDebug("Successfully scheduled pending inspection : " + iType);
    } else {
        logDebug("**ERROR: adding pending scheduling inspection (" + iType + "): " + schedRes.getErrorMessage());
    }
}