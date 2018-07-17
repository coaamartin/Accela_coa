//Script 84
//Record Types: Water/Water/SWMP/Renewal
//Event:        WorkflowTaskUpdateAfter (WTUA)
//Desc:         If the wfTask = “Permit Issued” and the wfStatus = “Completed” 
//              Then send email notification(Email Template TBD by Aurora) 
//              to Geoff(grabinow@auroragov.org) which will have details 
//              that the renewal has been approved. 
//
//      THIS SCRIPT WILL NOT BE COMPLETED UNTIL CITY HAS NOTIFICATION TEMPLATE IN PLACE, THEN CHANGE THE EMAIL ADDRESS
//   
//Created By: Silver Lining Solutions

function script84_SendRenewalEmailWhenPermitIssuedComplete() {
    logDebug("script84_SendRenewalEmailWhenPermitIssuedComplete() started.");
    try{
        // if wfTask = Permit Issued & wfStatus = Completed"
        var emailTo = getContactEmailAddress("Applicant", capId);
		if(emailTo){
            var applicantObj = getContactObjsByCap(capId, "Applicant");
            var applicantFullNam = getContactName(applicantObj[0]);
            var emailTemplate = "SWMP PERMIT RENEWAL APPROVED # 84";
            var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
            acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
            var recordURL = getACARecordURL(acaURLDefault);
            var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
            var reportFile = [];
            var emailParameters = aa.util.newHashtable();
            emailParams.put("$$altID$$", capIDString);
            emailParams.put("$$ContactFullName$$", applicantFullNam);
            emailParams.put("$$acaRecordUrl$$", recordURL);
            
            var sendResult = sendNotification("noreply@aurora.gov",emailTo,"",emailTemplate,emailParams,reportFile,capID4Email);
            if (!sendResult) { logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
		}
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function script84_SendRenewalEmailWhenPermitIssuedComplete(). Please contact administrator. Err: " + err);
        logDebug("Error on custom function script84_SendRenewalEmailWhenPermitIssuedComplete(). Please contact administrator. Err: " + err);
    }
    logDebug("script84_SendRenewalEmailWhenPermitIssuedComplete() ended.");
};//END script84_SendRenewalEmailWhenPermitIssuedComplete();
