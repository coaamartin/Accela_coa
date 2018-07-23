function createTempChild(appNameAppendix, utilityPermitType, emailTemplate) {
    var appName = cap.getSpecialText() + "-" + appNameAppendix;
    var ctm = aa.proxyInvoker.newInstance("com.accela.aa.aamain.cap.CapTypeModel").getOutput();
    ctm.setGroup("Water");
    ctm.setType("Utility");
    ctm.setSubType("Permit");
    ctm.setCategory("NA");

    createChildResult = aa.cap.createSimplePartialRecord(ctm, appName, "INCOMPLETE EST");
    if (createChildResult.getSuccess()) {
        childCapId = createChildResult.getOutput();
        aa.cap.createAppHierarchy(capId, childCapId);
        // Copy APO
        copyAddresses(capId, childCapId);
        copyParcels(capId, childCapId);
        copyOwner(capId, childCapId);
        // Copy contacts
        copyContacts(capId, childCapId);
        removeContactsFromCapByType(childCapId, "Agency Reviewer");
        // Update the child Utility Permit Type ASI
        editAppSpecific("Utility Permit Type", utilityPermitType, childCapId);
        // Send an email
        //sendEmail(emailTemplate);
        var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
        var reportFile = [];
        var emailCC = "";//Rest of contacts
        var emailTo = "";//Applicant
        var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
        acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
        var recordURL = getACARecordURL(acaURLDefault);
        var emailParams = aa.util.newHashtable();
        addParameter(emailParams, "$$altID$$", capId.getCustomID());
        addParameter(emailParams, "$$acaRecordUrl$$", recordURL);
        
        //Email All contacts except agency reviewer
        var contactArray = getPeople(capId);
        for(thisContact in contactArray) {
            var cont = contactArray[thisContact].getPeople();
            
            if(cont.contactType == "Applicant") emailTo = cont.getEmail();
            if(cont.contactType != "Applicant" && cont.contactType != "Agency Reviewer") emailCC += cont.getEmail() + ";";
        }

        if(emailTo && emailTo != null && emailTo != "" && emailTo != undefined){
            var sendResult = sendNotification("noreply@aurora.gov",emailTo,emailCC,emailTemplate,emailParams,reportFile,capID4Email);
            if (!sendResult) { logDebug("createTempChild: UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
            else { logDebug("createTempChild: Sent email notification to "+emailTo)}
        }
    } else {
        logDebug("**WARN creating a temporary child failed, error:" + sent.getErrorMessage());
    }
}




