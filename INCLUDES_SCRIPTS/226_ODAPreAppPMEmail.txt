
    logDebug("226_ODAPreAppPMEmail started.");
    
        var iName = iNameResult.getOutput();
        var email=iName.getEmail();
        var emlTo=email;*/
        var emailTemplate = "ODA PRE APP PM EMAIL # 226";
        var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
        var reportFile = [];
        var emailParams = aa.util.newHashtable();

        addParameter(emailParams, "$$altID$$", capIDString);
        
        var resParEmail = ""
        var ccEmails = "";
            
        var sendResult = sendNotification("noreply@auroragov.org",resParEmail,ccEmails,emailTemplate,emailParams,reportFile,capID4Email);
        if (!sendResult) { logDebug("script226: UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
        else { logDebug("script226: Sent email notification that to ODA PM")}
       
    logDebug("226_ODAPreAppPMEmail ended.");

