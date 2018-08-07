function script273_WTUA_CalcReviewDueDatesAndPotentialPCHearingSchedule(){
    logDebug("script273_WTUA_CalcReviewDueDatesAndPotentialPCHearingSchedule START.");
    var appSpecRevComments = "";
    var appSpecValRevComments = "";
    var appSpecProjCommHearingDate = "";
    var appSpecSubmissionDate = "";
    var appSpecValSubmissionDate = "";
    
    if ( !(AInfo["1st Review Comments Due Date"]) ) {
        // Set up the 'target' date we want to search for meetings
        var dToday = new Date();
        var lookForPlanningMtgDate  = aa.date.parseDate(dateAdd(dToday,(7*6.5)));
        var lookForMMDDYYYY = ("0" + lookForPlanningMtgDate.getMonth()).slice(-2) + "/" 
                                + ("0" + lookForPlanningMtgDate.getDayOfMonth()).slice(-2) + "/" 
                                + lookForPlanningMtgDate.getYear();

        //Set up the 'look back' from the target date for searching
        var lookForStartDate        = aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,0));
        
        //Set up the 'look forward' from the target date for searching
        var lookForEndDate          = aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,+45));
        
        //Find the closest meeting to lookForPlanningMtgDate between lookForStartDate and lookForEndDate 
        var newPlnMtg = getClosestAvailableMeeting("Planning Commission", lookForPlanningMtgDate, lookForStartDate, lookForEndDate, "PLANNING COMMISSION");

        // update review comments
        var revdDate = aa.date.parseDate(dateAddHC2("",15, true));
        var revdDateStr = ("0" + revdDate.getMonth()).slice(-2) + "/" 
                            + ("0" + revdDate.getDayOfMonth()).slice(-2) + "/" 
                            + revdDate.getYear();
        editAppSpecific("1st Review Comments Due date",revdDateStr);
        
        // update planning commission date if found
        if (newPlnMtg != null) {
            var newHearingDate = (""+ newPlnMtg.startDate).slice(5,7)+"/" 
                                +(""+ newPlnMtg.startDate).slice(8,10)+"/"
                                +(""+ newPlnMtg.startDate).slice(0,4);
            editAppSpecific("Projected Planning Commission Date",newHearingDate);
        } else {
            logDebug("Script 273: WARNING - there is no planning commission date within 45 days of your target date!");
            comment("<B><Font Color=RED>WARNING - there is no planning commission date within 45 days of your target date!</Font></B>");
        }
    }
    else 
        if ( !(AInfo["2nd Review Comments Due Date"]) ) {
            // Set up the 'target' date we want to search for meetings
            var dToday = new Date();
            var lookForPlanningMtgDate  = aa.date.parseDate(dateAddHC2(dToday,(7*6)));
            var lookForMMDDYYYY = ("0" + lookForPlanningMtgDate.getMonth()).slice(-2) + "/" 
                                    + ("0" + lookForPlanningMtgDate.getDayOfMonth()).slice(-2) + "/" 
                                    + lookForPlanningMtgDate.getYear();
            
            //Set up the 'look back' from the target date for searching
            var lookForStartDate        = aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,0));
            
            //Set up the 'look forward' from the target date for searching
            var lookForEndDate          = aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,+45));
            
            //Find the closest meeting to lookForPlanningMtgDate between lookForStartDate and lookForEndDate 
            var newPlnMtg = getClosestAvailableMeeting("Planning Commission", lookForPlanningMtgDate, lookForStartDate, lookForEndDate, "PLANNING COMMISSION");
            
            // update review comments
            var revdDate = aa.date.parseDate(dateAddHC2("",15, true));
            var revdDateStr = ("0" + revdDate.getMonth()).slice(-2) + "/" 
                                + ("0" + revdDate.getDayOfMonth()).slice(-2) + "/" 
                                + revdDate.getYear();
            editAppSpecific("2nd Review Comments Due date",revdDateStr);
            
            // update submission date
            var subdDate = aa.date.parseDate(dateAddHC2("",20, true));
            var subdDateStr = ("0" + subdDate.getMonth()).slice(-2) + "/" 
                                + ("0" + subdDate.getDayOfMonth()).slice(-2) + "/" 
                                + subdDate.getYear();
            editAppSpecific("Applicant 2nd Submission Date",subdDateStr); 
            
            // update planning commission date if found
            if (newPlnMtg != null) {
                var newHearingDate = (""+ newPlnMtg.startDate).slice(5,7)+"/" 
                                    +(""+ newPlnMtg.startDate).slice(8,10)+"/"
                                    +(""+ newPlnMtg.startDate).slice(0,4);
                editAppSpecific("Projected Planning Commission Date",newHearingDate);
            } else {
                logDebug("Script 273: WARNING - there is no planning commission date within 45 days of your target date!");
                comment("<B><Font Color=RED>WARNING - there is no planning commission date within 45 days of your target date!</Font></B>");
            }
            
        } else {
            // Set up the 'target' date we want to search for meetings
            var dToday = new Date();
            var lookForPlanningMtgDate  = aa.date.parseDate(dateAddHC2(dToday,(7*5)));
            var lookForMMDDYYYY = ("0" + lookForPlanningMtgDate.getMonth()).slice(-2) + "/" 
                                    + ("0" + lookForPlanningMtgDate.getDayOfMonth()).slice(-2) + "/" 
                                    + lookForPlanningMtgDate.getYear();
                    
            //Set up the 'look back' from the target date for searching
            var lookForStartDate        = aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,0));
            
            //Set up the 'look forward' from the target date for searching
            var lookForEndDate          = aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY, +45));
            
            //Find the closest meeting to lookForPlanningMtgDate between lookForStartDate and lookForEndDate 
            var newPlnMtg = getClosestAvailableMeeting("Planning Commission", lookForPlanningMtgDate, lookForStartDate, lookForEndDate, "PLANNING COMMISSION");
        
            if (!(AInfo["3rd Review Comments Due Date"])) {
                // update review comments
                var revdDate = aa.date.parseDate(dateAddHC2("",10, true));
                var revdDateStr = ("0" + revdDate.getMonth()).slice(-2) + "/" 
                                    + ("0" + revdDate.getDayOfMonth()).slice(-2) + "/" 
                                    + revdDate.getYear();
                editAppSpecific("3rd Review Comments Due date",revdDateStr);
            
                // update submission date
                var subdDate = aa.date.parseDate(dateAddHC2("",15, true));
                var subdDateStr = ("0" + subdDate.getMonth()).slice(-2) + "/" 
                                    + ("0" + subdDate.getDayOfMonth()).slice(-2) + "/" 
                                    + subdDate.getYear();
                editAppSpecific("Applicant 3rd Submission Date",subdDateStr); 
            }
        
            // update planning commission date if found
            if (newPlnMtg != null) {
                var newHearingDate = (""+ newPlnMtg.startDate).slice(5,7)+"/" 
                                    +(""+ newPlnMtg.startDate).slice(8,10)+"/"
                                    +(""+ newPlnMtg.startDate).slice(0,4);
                editAppSpecific("Projected Planning Commission Date",newHearingDate);
            } else {
                    logDebug("Script 273: WARNING - there is no planning commission date within 45 days of your target date!");
                    comment("<B><Font Color=RED>WARNING - there is no planning commission date within 45 days of your target date!</Font></B>");
                }
        }
    
        logDebug("**script273 preparing email**");
        
        // send an email to the applicant
        // Get the Applicant's email
        var recordApplicant = getContactByType("Applicant", capId);
        var applicantEmail = null;
        if (!recordApplicant || recordApplicant.getEmail() == null || recordApplicant.getEmail() == "") {
            logDebug("**WARN no applicant or applicant has no email, capId=" + capId);
        } else {
            applicantEmail = recordApplicant.getEmail();
        }
        
        // Get the Case Manager's email
        var caseManagerEmail=getAssignedStaffEmail();
        var caseManagerPhone=getAssignedStaffPhone();
        var caseManagerFullName=getAssignedStaffFullName();
        var caseManagerTitle=getAssignedStaffTitle();
        
        var cc="";
        
        if (isBlankOrNull(caseManagerEmail)==false){
            if (cc!=""){
                cc+= ";" +caseManagerEmail;
            }else{
                cc=caseManagerEmail;
            }
        }       
        
        if(recordApplicant){
            var acaSiteUrl = lookup("ACA_CONFIGS", "ACA_SITE");
            var subStrIndex = acaSiteUrl.toUpperCase().indexOf("/ADMIN");
            var recordACAUrl = getACARecordURL(subStrIndex)
            
            var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
            var emailParameters = aa.util.newHashtable();
            addParameter(emailParameters, "$$todayDate$$", dateAdd(null, 0));
            addParameter(emailParameters, "$$altID$$", cap.getCapModel().getAltID());
            addParameter(emailParameters, "$$capAlias$$", capName);
            addParameter(emailParameters, "$$recordAlias$$", cap.getCapType().getAlias());
            addParameter(emailParameters, "$$StaffPhone$$", caseManagerPhone);
            addParameter(emailParameters, "$$StaffEmail$$", caseManagerEmail);
            addParameter(emailParameters, "$$StaffFullName$$", caseManagerFullName);
            addParameter(emailParameters, "$$StaffTitle$$", caseManagerTitle);
            addParameter(emailParameters, "$$FirstName$$", recordApplicant.getFirstName());
            addParameter(emailParameters, "$$LastName$$", recordApplicant.getLastName());
            addParameter(emailParameters, "$$wfComment$$", wfComment);
            addParameter(emailParameters, "$$acaRecordUrl$$", recordACAUrl);
            var reportFile = [];
            var sendResult = sendNotification("noreply@aurora.gov",applicantEmail,"","PLN REVIEW COMMENTS # 273 274 275",emailParameters,reportFile,capID4Email);
            if (!sendResult) 
                { logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
            else
                { logDebug("Sent Notification"); }  
        }
    logDebug("script273_WTUA_CalcReviewDueDatesAndPotentialPCHearingSchedule end.");    
}//END script273_WTUA_CalcReviewDueDatesAndPotentialPCHearingSchedule()