/*
Title : Create child arborist and business license (WorkflowTaskUpdateAfter)
Purpose : When workflow task = "Issuance" and the workflow status = "Issued" then create child Arborist License, copy record Detail,
create licensed profession(from Applicant data), copy any duplicate custom fields and email the applicant with the issued
notification with the attached license report. (Email details will be provided by Aurora). In addition if there is no Business
License listed as a child record then auto create the business license application as a temp record as well and copy the
applicable data.
(Report template & Email details will be provided by Aurora).
Author: Haitham Eleisah

Functional Area : Records

Sample Call:
createArboristLicenseAndCopyDataAndSendEmail("License Issuance", "Issued", "Licenses/Contractor/Arborist/License", "MESSAGE_NOTICE_PUBLIC WORKS", "WorkFlowTasksOverdue", rptParams);

 */



if(ifTracer(wfTask == "License Issuance" && wfStatus == "Issued", 'wf:License Issuance/Issued')){
	var emailTemplate = "FT ARBORIST LICENSE ISSUANCE #146";
    var reportName = "JD_TEST_SSRS";
    var LicenseType = "Licenses/Contractor/Arborist/License";
    var rptParams = aa.util.newHashtable();
    rptParams.put("Record_ID", cap.getCapModel().getAltID());
    createArboristLicenseAndCopyDataAndSendEmail(LicenseType, emailTemplate, reportName, rptParams);
}
