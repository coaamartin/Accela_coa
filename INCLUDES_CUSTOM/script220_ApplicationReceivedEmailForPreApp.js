//Script 220
//Record Types: ODA/Pre Application/NA/NA
//Event:        ASA
//Desc:         When the record is submitted/created then generate 
//              Application Received email and send it to the contacts 
//              on the record. Aurora will provide the email template  
//
//Created By: Silver Lining Solutions

function script220_ApplicationReceivedEmailForPreApp() {
    logDebug("script220_ApplicationReceivedEmailForPreApp() started.");
    try{        
        /*var iNameResult = aa.person.getUser(currentUserID);
        var iName = iNameResult.getOutput();
        var email=iName.getEmail();
        var emlTo=email;*/
        //var emlTo = "eric@esilverliningsolutions.com";
        /*logDebug("script220 currentUserID: " + currentUserID);
        logDebug("script220         email: " + email);
        logDebug("script220         emlTo: " + emlTo);*/
        var emailTemplate = "ODA PRE APP SUBMITAL EMAIL # 220";
        var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
        acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
        var recordURL = getACARecordURL(acaURLDefault);
        var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
        var reportFile = [];
        var emailParams = aa.util.newHashtable();

        addParameter(emailParams, "$$altID$$", capIDString);
        addParameter(emailParams, "$$ApplicationName$$", capName);
        addParameter(emailParams, "$$acaRecordUrl$$", recordURL);
		
        
        var resParEmail = getContactEmailAddress("Responsible Party", capId);
        var ccEmails = "";
        
        if(resParEmail){
            var conts = getContactObjs(capId);
            for(each in conts){
                var aCont = conts[each].people;
                
                if(aCont.contactType == "Consultant" && aCont.email) 
                    ccEmails += aCont.email + ",";
            }
            
            var sendResult = sendNotification("noreply@auroragov.org",resParEmail,ccEmails,emailTemplate,emailParams,reportFile,capID4Email);
            if (!sendResult) { logDebug("script220: UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
            else { logDebug("script220: Sent email notification that ODA PRE APP is Submitted to "+resParEmail)}
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function script220_ApplicationReceivedEmailForPreApp(). Please contact administrator. Err: " + err);
        logDebug("Error on custom function script220_ApplicationReceivedEmailForPreApp(). Please contact administrator. Err: " + err);
    }
    logDebug("script220_ApplicationReceivedEmailForPreApp() ended.");
};//END script220_ApplicationReceivedEmailForPreApp