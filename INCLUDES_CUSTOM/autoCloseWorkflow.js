
/**
 * prepare parameters and calls the method that will do the actual work
 */
function autoCloseWorkflow() {
    var recTypesAry = new Array();
    var matched = false;
    var applicant = getContactByType("Applicant", capId);
    var applicantEmail = getContactEmailAddress("Applicant", capId);
    var issuedEmlTemplate = "BLD PERMIT ISSUED # 35";
    
    var reportTemplate = "Building Permit";
    var reportParams = aa.util.newHashtable();
    addParameter(reportParams, "RecordID", capIDString);
    
    var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
    acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
    var recordURL = getACARecordURL(acaURLDefault);
    
    var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
    var reportFile = [];
    
    var eParams = aa.util.newHashtable();
    addParameter(eParams, "$$altID$$", capIDString);
    addParameter(eParams, "$$ContactFullName$$", applicant.getFullName());
    addParameter(eParams, "$$recordAlias$$", appTypeAlias);
    addParameter(eParams, "$$acaRecordUrl$$", recordURL);
    
    //#1
    recTypesAry = [ "Building/Permit/Plans/Amendment", "Building/Permit/New Building/Amendment", "Building/Permit/Master/Amendment", "Building/Permit/Master/NA" ];
    matched = checkBalanceAndStatusUpdateRecord(recTypesAry, "Payment Pending", "Fee Processing", "Complete", "Approved");
    if(matched){
        
        setCodeReference("Complete");
        //Send email for case #1
        
        var emailTemplate = "BLD PLANS APPROVED # 35";
        var lpEmail = getPrimLPEmailByCapId(capId);
        addParameter(eParams, "$$LicenseProfessionalEmail$$", lpEmail);
        var sendResult = sendNotification("noreply@aurora.gov",applicantEmail,"",emailTemplate,eParams,reportFile,capID4Email);
        if (!sendResult) { logDebug("autoCloseWorkflow: UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
        else { logDebug("autoCloseWorkflow: Sent email to applicant "+applicantEmail)}  
    }
    
    //#2
    if (!matched) {
        recTypesAry = new Array();
        recTypesAry = [ "Building/Permit/New Building/NA", "Building/Permit/Plans/NA" ];
        matched = checkBalanceAndStatusUpdateRecord(recTypesAry, "Payment Pending", "Fee Processing", "Issued", "Issued");
        //Specs don't mention anything for Ready to Issuematched = checkBalanceAndStatusUpdateRecord(recTypesAry, "Ready to Issue", "Permit Issuance", "Issued", "Issued");
        
        //extra steps for #2
        //2.1
        if (matched) {
            if (appMatch("Building/Permit/New Building/NA")) {
                activateTask("Water Meter");
                activateTask("Inspection Phase");
                if(isTaskStatus("Waste Water Review", "Approved Inspection Required")) activateTask("Waste Water");
                if(AInfo["Special Inspections"] == "Yes") activateTask("Special Inspections Check");
                if(isTaskStatus("Engineering Review", "Approved with FEMA Cert Required")) activateTask("FEMA Elevation Certificate");
            }//2.1

            //2.2
            if (appMatch("Building/Permit/Plans/NA")) {
                if(isTaskStatus("Waste Water Review", "Approved Inspection Required")) activateTask("Waste Water");
                activateTask("Inspection Phase");
                if(AInfo["Special Inspections"] == "Yes") activateTask("Special Inspections Check");
            }//2.2
            
            setCodeReference("Issued");
            //send email()
            var lpEmail = getPrimLPEmailByCapId(capId);
            addParameter(eParams, "$$LicenseProfessionalEmail$$", lpEmail);
            emailContacts("Applicant", issuedEmlTemplate, eParams, reportTemplate, reportParams);
        }//matched
    }

    //#3
    if (!matched) {
        recTypesAry = new Array();
        recTypesAry = [ "Building/Permit/No Plans/NA" ];
        if(bldScript2_noContractorCheck())
            matched = checkBalanceAndStatusUpdateRecord(recTypesAry, "Submitted", "Permit Issuance", "Issued", "Issued");
        else logDebug("No LP on file.  Not issuing permit");
        
        if(matched){
            //send email()
            var lpEmail = getPrimLPEmailByCapId(capId);
            addParameter(eParams, "$$LicenseProfessionalEmail$$", lpEmail);
            emailContacts("Applicant", issuedEmlTemplate, eParams, reportTemplate, reportParams);
            
            setCodeReference("Issued");
        }
    }
}
