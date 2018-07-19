function wtrScript302_warrantyReqdNotification(){
    logDebug("wtrScript302_warrantyReqdNotification() started");
    try{
        var emlTemplate = "WUP WARRANTY WORK REQUIRED #302";
        var lpEml = getPrimLPEmailByCapId(capId);
        var applicantEml = getContactEmailAddress("Applicant", capId);
        var ownerEml = getPrimaryOwnerEmail();
        
        if(ifTracer(applicantEml, 'applicantEml')){
            var applicantObj = getContactObjsByCap(capId, "Applicant");
            var applicantFullNam = getContactName(applicantObj[0]);
            
            var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
            acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
            var recordURL = getACARecordURL(acaURLDefault);
            var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
            var reportFile = [];
            //var punchListModel = getDocModel4Link("Warrant Work Punch List");
            //var punchListLink = recordURL;
            var emailParams = aa.util.newHashtable();
            emailParams.put("$$ContactEmail$$", applicantEml);
            emailParams.put("$$altID$$", capIDString);
            emailParams.put("$$ContactFullName$$", applicantFullNam);
            emailParams.put("$$acaRecordUrl$$", recordURL);
            emailParams.put("$$wfComment$$", wfComment == null ? "" : wfComment);
            
            //Send email to applicant
            if(applicantEml){
                var sendResult = sendNotification("noreply@aurora.gov",applicantEml,"",emlTemplate,emailParams,reportFile,capID4Email);
                if (!sendResult) { logDebug("wtrScript302_warrantyReqdNotification: UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
                else { logDebug("wtrScript302_warrantyReqdNotification: Sent email notification that work order is complete to "+applicantEml)}
            }
            //Send email to owner
            if(ownerEml){
                emailParams.put("$$ContactEmail$$", ownerEml);
                var sendResult = sendNotification("noreply@aurora.gov",ownerEml,"",emlTemplate,emailParams,reportFile,capID4Email);
                if (!sendResult) { logDebug("wtrScript302_warrantyReqdNotification: UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
                else { logDebug("wtrScript302_warrantyReqdNotification: Sent email notification that work order is complete to "+ownerEml)}
            }
            //Send email to lp
            if(lpEml){
                emailParams.put("$$ContactEmail$$", lpEml);
                var sendResult = sendNotification("noreply@aurora.gov",lpEml,"",emlTemplate,emailParams,reportFile,capID4Email);
                if (!sendResult) { logDebug("wtrScript302_warrantyReqdNotification: UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
                else { logDebug("wtrScript302_warrantyReqdNotification: Sent email notification that work order is complete to "+lpEml)}
            }
        }
        
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function wtrScript302_warrantyReqdNotification(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function wtrScript302_warrantyReqdNotification(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("wtrScript302_warrantyReqdNotification() ended.");
}//END wtrScript302_warrantyReqdNotification();
