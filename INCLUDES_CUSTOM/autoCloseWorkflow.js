
/**
 * prepare parameters and calls the method that will do the actual work
 */
function autoCloseWorkflow() {
    logDebug("autoCloseWorkflow() started")
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
    
    var deacSpecInspCheck = false;//To use for script 205
    var autoCreateInsp = false;//To use for script 202
    
    //Script #35
    recTypesAry = [ "Building/Permit/Plans/Amendment", "Building/Permit/New Building/Amendment", "Building/Permit/Master/Amendment", "Building/Permit/Master/NA" ];
    matched = checkBalanceAndStatusUpdateRecord(recTypesAry, "Payment Pending", "Fee Processing", "Complete", "Approved");
    if(matched){
        logDebug("matched #1");
        setCodeReference("Complete");
        //Send email for case #1
        var emailTemplate = "BLD PLANS APPROVED # 35";
        var lpEmail = getPrimLPEmailByCapId(capId);
        addParameter(eParams, "$$LicenseProfessionalEmail$$", lpEmail);
        var sendResult = sendNotification("noreply@aurora.gov",applicantEmail,"",emailTemplate,eParams,reportFile,capID4Email);
        if (!sendResult) { logDebug("autoCloseWorkflow: UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
			else { logDebug("autoCloseWorkflow: Sent email to applicant "+applicantEmail)}  
        var sendResult2 = sendNotification("noreply@aurora.gov",lpEmail,"",emailTemplate,eParams,reportFile,capID4Email);
        if (!sendResult2) { logDebug("autoCloseWorkflow: UNABLE TO SEND NOTICE!  ERROR: "+sendResult2); }
			else { logDebug("autoCloseWorkflow: Sent email to applicant "+lpEmail)}         
        //Script 324
        if(appMatch("Building/Permit/Master/NA")){
            logDebug("Calling Script 324 from PRA");
            addMasterPlanDataToShrdDDList("Master Plan Type", "Approved", "Code Change");
        }
        
        deacSpecInspCheck = true;//Script 205
    }
    
    if (!matched) {
        logDebug("match #2");
        recTypesAry = new Array();
        recTypesAry = [ "Building/Permit/New Building/NA", "Building/Permit/Plans/NA" ];
		//validateParentCapStatus() is part of script 2.  Permit cannot be issued if Parent Master is Unapproved
        if(validateParentCapStatus([ "Issued" ], "Building/Permit/Master/NA", "Unapproved") && bldScript2_noContractorCheck())
            matched = checkBalanceAndStatusUpdateRecord(recTypesAry, "Payment Pending", "Permit Issuance", "Issued", "Issued");
        else
            logDebug("No LP on file.  Not issuing permit")
        //Specs don't mention anything for Ready to Issuematched = checkBalanceAndStatusUpdateRecord(recTypesAry, "Ready to Issue", "Permit Issuance", "Issued", "Issued");
        
        //extra steps for #2
        //2.1
        if (matched) {
            if (appMatch("Building/Permit/New Building/NA")) {
                activateTask("Water Meter");
                activateTask("Inspection Phase");
                if(isTaskStatus("Waste Water Review", "Approved Inspection Required")){
                    activateTask("Waste Water", "BLD_NEWCON_INSPSUB");
                    activateTask("Waste Water", "BLD_MASTER_INSPSUB");
                }
                if(AInfo["Special Inspections"] == "Yes") {
                    activateTask("Special Inspections Check","BLD_NEWCON_INSPSUB");
                    activateTask("Special Inspections Check","BLD_MASTER_INSPSUB");
                }
                if(isTaskStatus("Engineering Review", "Approved with FEMA Cert Required")) {
                    activateTask("FEMA Elevation Certification","BLD_NEWCON_INSPSUB");
                    activateTask("FEMA Elevation Certification","BLD_MASTER_INSPSUB");
                }
            }//2.1

            //2.2
            if (appMatch("Building/Permit/Plans/NA")) {
                if(isTaskStatus("Waste Water Review", "Approved Inspection Required")) {
                    activateTask("Waste Water", "BLD_NEWCON_INSPSUB");
                    activateTask("Waste Water", "BLD_MASTER_INSPSUB");
                }
                activateTask("Inspection Phase");
                if(AInfo["Special Inspections"] == "Yes") {
                    activateTask("Special Inspections Check","BLD_NEWCON_INSPSUB");
                    activateTask("Special Inspections Check","BLD_MASTER_INSPSUB");
                }
            }//2.2
            
            setCodeReference("Issued");
            //send email()
            var lpEmail = getPrimLPEmailByCapId(capId);
            addParameter(eParams, "$$LicenseProfessionalEmail$$", lpEmail);
            emailContacts("Applicant", issuedEmlTemplate, eParams, reportTemplate, reportParams);
            if(lpEmail != null)
			{
				emailContactsIncludesLP("PRIMARYLP", issuedEmlTemplate, eParams, reportTemplate, reportParams);
			}
		
            autoCreateInsp = true;//Script 202
            deacSpecInspCheck = true;//Script 205
        }//matched
    }

    //#3
    if (ifTracer(!matched, '!matched')) {
        logDebug("match #3");
        recTypesAry = new Array();
        //  4-10-19 Keith added OTC permits to Array
        recTypesAry = [ "Building/Permit/No Plans/NA","Building/Permit/OTC/AC Only","Building/Permit/OTC/Commercial Roof","Building/Permit/OTC/Furnace","Building/Permit/OTC/Furnace AC and Water Heater","Building/Permit/OTC/Furnace and AC","Building/Permit/OTC/Gas Pipe","Building/Permit/OTC/Residential Electrical Service","Building/Permit/OTC/Residential Roof","Building/Permit/OTC/Siding","Building/Permit/OTC/Tankless Water Heater","Building/Permit/OTC/Water Heater","Building/Permit/OTC/Water Heater and AC","Building/Permit/OTC/Water Heater and Furnace" ];
        if(appMatch("Building/Permit/No Plans/NA") || appMatch("Building/Permit/OTC/*")) && bldScript2_noContractorCheck() && validateParentCapStatus([ "Issued" ], "Building/Permit/Master/NA", "Unapproved"))
            matched = checkBalanceAndStatusUpdateRecord(recTypesAry, "Submitted", "Permit Issuance", "Issued", "Issued");
        else logDebug("No LP on file.  Not issuing permit");
        
        if(ifTracer(matched, 'match #3 inner criteria')) {
            //send email()
            var lpEmail = getPrimLPEmailByCapId(capId);
            addParameter(eParams, "$$LicenseProfessionalEmail$$", lpEmail);
            emailContacts("Applicant", issuedEmlTemplate, eParams, reportTemplate, reportParams);
            if(lpEmail != null)
			{
				emailContactsIncludesLP("PRIMARYLP", issuedEmlTemplate, eParams, reportTemplate, reportParams);
			}            
            setCodeReference("Issued");
            logDebug('Going to activate Inspection Phase')
            activateTask("Inspection Phase");
            autoCreateInsp = true;//Script 202
            deacSpecInspCheck = true;//Script 205
            
            
        }
    }
    
    //Script 202
    if(deacSpecInspCheck){
        logDebug("Script 202: autoCreateInspections");
        var tasksToCheck = [ "Mechanical Plan Review", "Electrical Plan Review", "Plumbing Plan Review", "Structural Plan Review" ];
        createAutoInspection(tasksToCheck);
    }
    
    //Script 205, 206 being
    if(deacSpecInspCheck){
        logDebug("Script 205: Deactivating Special Inspections Check, FEMA Elevation Certification, Waste Water")
        if(AInfo["Special Inspections"] != "Yes")
        {
            deactivateTask("Special Inspections Check","BLD_NEWCON_INSPSUB");
            deactivateTask("Special Inspections Check","BLD_MASTER_INSPSUB");
        }//END Script 205
        
        //Script 206
        if(!isTaskStatus("Engineering Review","Approved with FEMA Cert Required"))
        {
            deactivateTask("FEMA Elevation Certification","BLD_NEWCON_INSPSUB");
            deactivateTask("FEMA Elevation Certification","BLD_MASTER_INSPSUB");
        }
        
        if(!isTaskStatus("Waste Water Review","Approved Inspection Required"))
        {
            deactivateTask("Waste Water","BLD_NEWCON_INSPSUB");
            deactivateTask("Waste Water","BLD_MASTER_INSPSUB");
        }//END Script 206
    }//END Script 205, 206
    
    logDebug("autoCloseWorkflow() ended");
}
