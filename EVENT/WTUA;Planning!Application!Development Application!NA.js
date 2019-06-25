
//var $iTrc = ifTracer;
var entitlementType = null; 
if (typeof(ENTITLEMENTS) == Object) {
	for (x in ENTITLEMENTS) if ((ENTITLEMENTS[x]["Entitlements"] = "Master Plan" || ENTITLEMENTS[x]["Entitlements"] = "Master Plan Amendment") && ENTITLEMENTS[x]["Status"] != "Inactive") {
	entitlementType = ENTITLEMENTS[x]["Entitlements"]; logDebug ("Entitlements List includes type = "+entitlementType);
	}
}

if (entitlementType != "Master Plan" && entitlementType != "Master Plan Amendment" && typeof(ENTITLEMENTS) == Object) {
	for (x in ENTITLEMENTS) if (matches(ENTITLEMENTS[x]["Entitlements"],"Site Plan - Preliminary Plat","Site Plan - Major") && ENTITLEMENTS[x]["Status"] != "Inactive") {
	entitlementType = ENTITLEMENTS[x]["Entitlements"]; logDebug ("Entitlements List includes type = "+entitlementType); 
	}
} 

if (!matches(entitlementType,"Master Plan","Master Plan Amendment","Site Plan - Preliminary Plat","Site Plan - Major") && typeof(ENTITLEMENTS) == Object) {
	for (x in ENTITLEMENTS) if (matches(ENTITLEMENTS[x]["Entitlements"],"Conditional Use","Rezoning","Site Plan - Amendment","Site Plan - Minor") && ENTITLEMENTS[x]["Status"] != "Inactive") {
	entitlementType = ENTITLEMENTS[x]["Entitlements"]; logDebug ("Entitlements List includes type = "+entitlementType); 
	}
} 

/*
Script 273 
Record Types:       Planning/Application/Site Plan/Minor

Desc:           Spec:  (from spec: 273/Script-273-version3.pdf) and tracker comments

Created By: Silver Lining Solutions

removed per instruction on 7/18
*/

/*
Script 273
(Site Plan Amendment, Rezoning, Conditional Use)
Record Types:		Planning/Application/Site Plan/Amendment
					Planning/Application/Conditional Use/NA 
					Planning/Application/Rezoning
Desc:			Spec:  (from spec: 273/Script-273-version3.pdf) and tracker comments

Created By: Silver Lining Solutions
*/

//if (wfTask == "Review Distribution" && wfStatus == "In Review") {
//    if(countOfTaskStatus("Review Distribution", "In Review") > 1) script273_WTUA_CalcReviewDueDatesAndPotentialPCHearingSchedule()
//}

if (matches(entitlementType,"Conditional Use","Rezoning","Site Plan - Amendment","Site Plan - Minor") && (wfTask == "Application Acceptance" && wfStatus == "Routed for Review")) {
    if(countOfTaskStatus("Application Acceptance", "Routed for Review") > 1) script273_WTUA_CalcReviewDueDatesAndPotentialPCHearingSchedule()
}

/*
Script 274
Record Types:	Planning/Application/Preliminary Plat/NA
				Planning/Application/Site Plan/Major
Desc:			Spec:  (from spec: 274) and tracker comments
Created By: Silver Lining Solutions
*/

//if (ifTracer(wfTask == "Review Distribution" && wfStatus == "In Review", 'wf:Review Distribution/In Review')) {
//    if(countOfTaskStatus("Review Distribution", "In Review") > 1)script274_WTUA_CalcReviewDueDatesAndPotentialPCHearingSchedule2()
//}


if (matches(entitlementType,"Site Plan - Preliminary Plat","Site Plan - Major") && (wfTask == "Application Acceptance" && wfStatus == "Routed for Review")) {
    if(countOfTaskStatus("Application Acceptance", "Routed for Review") > 1)script274_WTUA_CalcReviewDueDatesAndPotentialPCHearingSchedule2()
}


/*
Script 275
Record Types:   Planning/Application/Master Plan/NA

Desc:           Spec:  (from spec: 275) and tracker comments
Created By: Silver Lining Solutions
*/
//if (wfTask == "Review Distribution" && wfStatus == "In Review") {
//    if(countOfTaskStatus("Review Distribution", "In Review") > 1) script275_WTUA_CalcReviewDueDatesAndPotentialPCHearingSchedule();
//}

if (matches(entitlementType,"Master Plan","Master Plan Amendment") && (wfTask == "Application Acceptance" && wfStatus == "Routed for Review")) {
    if(countOfTaskStatus("Application Acceptance", "Routed for Review") > 1) script275_WTUA_CalcReviewDueDatesAndPotentialPCHearingSchedule();
}



/*
Script 277
Record Types:   ​Planning/Application/Conditional Use/NA 
                Planning/Application/Rezoning/NA 
                Planning/Application/Site Plan/Major
                Planning/Application/​​Site Plan/Amendment

Desc:           see Script Tracker for script 277

Created By: Silver Lining Solutions
*/
/*
logDebug("START of script277_WTUA_Assign Case Manager to Hearing Scheduled.");
if (wfTask == "Review Consolidation" && (wfStatus == "Review Complete" || wfStatus == "Ready for PC"))
{
    logDebug("script277_Match on task/status");
    // get Record assigned staff 
    var assignedStaff = getAssignedStaff();
    logDebug("script277 assignedstaff =" + assignedStaff);
    assignTask("PZC Hearing Scheduling",assignedStaff);
    
    logDebug("**script277 preparing email**");
    
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
    
    var cc="";
    
    if (isBlankOrNull(caseManagerEmail)==false){
        if (cc!=""){
            cc+= ";" +caseManagerEmail;
        }else{
            cc=caseManagerEmail;
        }
    }   
    
       //prepare Deep URL:
        var acaSiteUrl = lookup("ACA_CONFIGS", "ACA_SITE");
        var subStrIndex = acaSiteUrl.toUpperCase().indexOf("/ADMIN");
        var acaCitizenRootUrl = acaSiteUrl.substring(0, subStrIndex);
        var deepUrl = "/urlrouting.ashx?type=1000";
        deepUrl = deepUrl + "&Module=" + cap.getCapModel().getModuleName();
        deepUrl = deepUrl + "&capID1=" + capId.getID1();
        deepUrl = deepUrl + "&capID2=" + capId.getID2();
        deepUrl = deepUrl + "&capID3=" + capId.getID3();
        deepUrl = deepUrl + "&agencyCode=" + aa.getServiceProviderCode();
        deepUrl = deepUrl + "&HideHeader=true";

        var recordDeepUrl = acaCitizenRootUrl + deepUrl;
    // send an email to the applicant - we're waiting on the actual template here.
    var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
    
    var emailParameters = aa.util.newHashtable();
    addParameter(emailParameters, "$$altID$$", cap.getCapModel().getAltID());
    addParameter(emailParameters, "$$recordDeepUrl$$", recordDeepUrl);
    addParameter(emailParameters, "$$recordAlias$$", cap.getCapType().getAlias());
    addParameter(emailParameters, "$$StaffPhone$$", caseManagerPhone);
    addParameter(emailParameters, "$$StaffEmail$$", caseManagerEmail);
    addParameter(emailParameters, "$$applicantFirstName$$", recordApplicant.getFirstName());
    addParameter(emailParameters, "$$applicantLastName$$", recordApplicant.getLastName());
    var reportFile = [];
    
    var sendResult = sendNotification("noreply@aurora.gov",applicantEmail,"","PLN HEARING SCHEDULED # 277",emailParameters,reportFile,capID4Email);
    if (!sendResult) 
        { logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
    else
        { logDebug("Sent Notification"); }  
}
logDebug("END of script277_WTUA_Assign Case Manager to Hearing Scheduled.");
*/