function odaScript225_emailMeetingNotes(){
    logDebug("odaScript225_emailMeetingNotes() started");
    try{
        var emailTemplate = "ODA PRE APP MEETING NOTES EMAIL # 225";
        var reportTemplate = "JD_TEST_SSRS";
        var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
        acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
        var recordURL = getACARecordURL(acaURLDefault);
        var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
        var reportFile = [];
        var emailParams = aa.util.newHashtable();
        var reportParms = aa.util.newHashtable();
        
        var odaProjMan = AInfo["ODA Project Manager"];
        var odaProjCor = AInfo["ODA Project Coordinator"];
        
        addParameter(emailParams, "$$altID$$", capIDString);
        addParameter(emailParams, "$$acaRecordUrl$$", recordURL);
        
        var resParEmail = getContactEmailAddress("Responsible Party", capId);
        var ccEmails = "";
        
        if(resParEmail){
        
            var conts = getContactObjs(capId);
            
            for(each in conts){
                var aCont = conts[each].people;
                
                if(matches(aCont.contactType, "Consultant", "Responsible Party") && aCont.email) 
                    resParEmail += aCont.email + ";";
            }
            
            if(odaProjMan){
                var adaProjManSplit = odaProjMan.split(" ");
                if(adaProjManSplit.length == 3)
                    var staffObj = aa.person.getUser(adaProjManSplit[0], adaProjManSplit[1], adaProjManSplit[3]).getOutput();
                else
                    var staffObj = aa.person.getUser(adaProjManSplit[0], "", adaProjManSplit[1]).getOutput();
                
                if(staffObj.email != null && staffObj.email != undefined && staffObj.email != "") {
                    ccEmails += staffObj.email;
                    addParameter(emailParams, "$$projectManagerEmail$$", staffObj.email)
                }
            }           
            
            if(odaProjCor){
                var adaProjCorSplit = odaProjCor.split(" ");
                if(adaProjCorSplit.length == 3)
                    var staffObj = aa.person.getUser(adaProjCorSplit[0], adaProjCorSplit[1], adaProjCorSplit[3]).getOutput();
                else
                    var staffObj = aa.person.getUser(adaProjCorSplit[0], "", adaProjCorSplit[1]).getOutput();
                
                if(staffObj.email != null && staffObj.email != undefined && staffObj.email != "") {
                    ccEmails += staffObj.email;
                    addParameter(emailParams, "$$projectCoordinatorEmail$$", staffObj.email)
                }
            }
            
            addParameter(reportParms, "Record_ID", capIDString)
            
            var vReportName = generateReportForEmail(capId, reportTemplate, aa.getServiceProviderCode(), reportParms);
    
            //Get document deep link URL
            
            //Get ACA Url
            vACAUrl = lookup("ACA_CONFIGS", "ACA_SITE");
            vACAUrl = vACAUrl.substr(0, vACAUrl.toUpperCase().indexOf("/ADMIN"));

            if (vReportName != null && vReportName != false) {
                vDocumentList = aa.document.getDocumentListByEntity(capId, "CAP");
                if (vDocumentList != null) {
                    vDocumentList = vDocumentList.getOutput();
                }
            }
            
            if (vDocumentList != null) {
                for (y = 0; y < vDocumentList.size(); y++) {
                    vDocumentModel = vDocumentList.get(y);
                    vDocumentName = vDocumentModel.getFileName();
                    if (vDocumentName == vReportName) {
                        //Add the document url to the email paramaters using the name: $$acaDocDownloadUrl$$
                        getACADocDownloadParam4Notification(emailParams, vACAUrl, vDocumentModel);
                        logDebug("including document url: " + emailParams.get('$$acaDocDownloadUrl$$'));
                        aa.print("including document url: " + emailParams.get('$$acaDocDownloadUrl$$'));
                        break;
                    }
                }
            }
            
            var sendResult = sendNotification("noreply@aurora.gov",resParEmail,ccEmails,emailTemplate,emailParams,reportFile,capID4Email);
            if (!sendResult) { logDebug("script225: UNABLE TO SEND NOTICE!  ERROR: "+ sendResult.getErrorMessage()); }
            else { logDebug("script225: Sent email notification of meeting notes to "+ resParEmail + ", and CC to " + ccEmails)}
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function odaScript225_emailMeetingNotes(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
        logDebug("Error on custom function odaScript225_emailMeetingNotes(). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    }
    logDebug("odaScript225_emailMeetingNotes() ended");
}//END odaScript225_emailMeetingNotes()