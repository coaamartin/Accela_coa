/*
Title : Hearing Scheduled email and update hearing date field (WorkflowTaskUpdateAfter) 

Purpose : If the workflow task = Hearing Scheduling and workflow status = Scheduled 
then get the meeting type "Planning Commission" from the meeting tab and get the meeting date and then update
the Custom Field "Planning Commission Hearing Date".
In addition email the applicant that their hearing has been scheduled. Email template and content will be provided by Aurora.

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
    sendHearingScheduledEmailAndUpdateASI("Hearing Scheduling", [ "Scheduled" ], "Planning Commission", "Planning Commission Hearing Date", "MESSAGE_NOTICE_PUBLIC WORKS");
    
    Note:
        this script will abort if subType = "Address", requested in PDF:
        ... Record Type: Planning/Application/{*}/{*} (except Planning/Application/Address/{*})
*/
if(!appMatch(("Planning/Application/Address/*"))){
//Script 278
    if(appMatch("Planning/Application/Conditional Use/NA"))
        sendHearingScheduledEmailAndUpdateASI("Hearing Scheduled", [ "Scheduled" ], "Planning Commission", "Planning Commission Hearing Date", "PLN PUBLIC HEARING EMAIL # 278");
    else sendHearingScheduledEmailAndUpdateASI("Hearing Scheduling", [ "Scheduled" ], "Planning Commission", "Planning Commission Hearing Date", "PLN PUBLIC HEARING EMAIL # 278");
}
// Workflow Task name is different for Rezoning so putting in the Event for WTUA:"Planning/Application/Rezoning/NA
//  sendHearingScheduledEmailAndUpdateASI("Hearing Scheduling", [ "Scheduled" ], "Planning Commission", "Planning Commission Hearing Date", "PLN PUBLIC HEARING EMAIL # 278");

/*
Title : Update Workflow Task for Traffic/ODA (WorkflowTaskUpdateAfter) 

Purpose : When Record Type Planning/Application/Master Plan/NA, Planning/Application/Preliminary Plat/NA, Planning/Application/Site
Plan/Major, Planning/Application/Site Plan/Minor Event: WorkflowTaskUpdateAfter If criteria: wfTask = Traffic Review and
Status = "Comments not Received" or "Resubmittal Requested" when the TSI field "Is a Traffic Impact Study Required?" =
yes (this is currently in the Accela change log) and there is not already a child Traffic Impact record Action: Then
automatically create a child PublicWorks/Traffic/Traffic Impact/NA record and copy all relevant information (Record
Application Name, Description, APO, Applicant and all Contacts on the record).

Author: Mohammed Deeb 
 
Functional Area : Workflow , Records
*/

createRecordAndCopyInfo([ "Planning/Application/Master Plan/NA", "Planning/Application/Preliminary Plat/NA", "Planning/Application/Site Plan/Major",
        "Planning/Application/Site Plan/Minor" ], "Traffic Review", [ "Comments Not Received", "Resubmittal Requested", "Note" ], "Is a Traffic Impact Study Required?",
        "PublicWorks/Traffic/Traffic Impact/NA");
 

/*
Title : Auto create Master Utility Study record (WorkflowTaskUpdateAfter) 

Purpose : Event WorkflowTaskUpdateAfter 
Criteria wfTask = Water Dept Review and wfTaskStatus = Resubmittal Requested or Complete or Comments Not Received 
and TSI Is a Master Utility Plan Required = Yes on Water Dept Review Task and there not a child Master Utility Study record already
-- this was modified according to the new specs
Author: Yazan Barghouth 
 
Functional Area : Records
Sample Call:
    autoCreateMasterUtilStudyApplication("Water Dept Review", [ "Comments Not Received", "Resubmittal Requested",  "Complete"], "Is a Master Utility Plan Required", "Water Dept Review",
        "Water/Utility/Master Utility/NA");
Notes:
    - child record type is "Water/Utility/Master Utility/Study" (Study not NA)
*/
// Script 244
autoCreateMasterUtilStudyApplication("Water Dept Review", [ "Comments Not Received", "Resubmittal Requested",  "Complete", "Note"], "Is a Master Utility Plan Required", "Water Dept Review",
        "Water/Utility/Master Utility/Study");
        

logDebug("script 257: started");
if(!appMatch(("Planning/Application/Address/*"))) {
    include("257_AppAcceptanceForPln");
}

  

//Script 282
//Record Types: Planning/Application/~/~ except for Address
//Event:        WTUA
//Desc:         Event: WorkflowTaskUpdateAfter wfTask = Landscape Pre Acceptance 
//              or Addressing Pre Acceptance or Planning Pre Acceptance or Civil 
//              Pre Acceptance = Resubmittal Requested send an email to the applicant,
//              include Record # and deep link for the record (Planning to send 
//              Template). Sincerely, Name of Assigned to Staff in the Record Detail, 
//              with their email from user and phone number from (Shared Dropdown if 
//              Active directory does not merge phone numbers or a general phone 
//              number for Planning). Include comments from the status – Req for Planning
//
//Created By: Silver Lining Solutions
logDebug("script 282: started");
if((wfTask == "Landscape Pre Acceptance" || wfTask == "Addressing Pre Acceptance" || 
    wfTask == "Real Property Pre Acceptance" || wfTask == "Planning Pre Acceptance" || wfTask == "Civil Pre Acceptance" ) &&
    wfStatus == "Resubmittal Requested" && !appMatch("Planning/Application/Address/*"))
{
    logDebug("script 282: criteria met");
    
    // Get the Applicant's email
    var recordApplicant = getContactByType("Applicant", capId);
    var applicantEmail = null;
    if (!recordApplicant || recordApplicant.getEmail() == null || recordApplicant.getEmail() == "") {
        logDebug("**WARN no applicant or applicant has no email, capId=" + capId);
    } else {
        applicantEmail = recordApplicant.getEmail();
        var applicantName = recordApplicant.getFullName();
    }
    
    
    // get the users info that is assigned to the task
    var staff = getTaskAssignedStaff(wfTask);
    logDebug("staff = " + staff);
    var staffFullName = staff.getFullName();

   //prepare Deep URL:
    var acaSiteUrl = lookup("ACA_CONFIGS", "ACA_SITE");
    var subStrIndex = acaSiteUrl.toUpperCase().indexOf("/ADMIN");
    var recordDeepUrl = getACARecordURL(subStrIndex)
    
    
    // send an email to the applicant - we're waiting on the actual template here.
    var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
    
    var emailParameters = aa.util.newHashtable();
    addParameter(emailParameters, "$$altID$$", cap.getCapModel().getAltID());
    addParameter(emailParameters, "$$acaRecordUrl$$", recordDeepUrl);
    addParameter(emailParameters, "$$recordAlias$$", cap.getCapType().getAlias());
    addParameter(emailParameters, "$$StaffFullName$$", staffFullName);
    addParameter(emailParameters, "$$StaffTitle$$", staff.getTitle());
    addParameter(emailParameters, "$$StaffPhone$$", staff.getPhoneNumber());
    addParameter(emailParameters, "$$StaffEmail$$", staff.getEmail());
    addParameter(emailParameters, "$$ContactEmail$$", applicantEmail);
    addParameter(emailParameters, "$$applicantFirstName$$", recordApplicant.getFirstName());
    addParameter(emailParameters, "$$applicantLastName$$", recordApplicant.getLastName());
    addParameter(emailParameters, "$$ContactFullName$$", applicantName);
    addParameter(emailParameters, "$$wfComment$$", wfComment);
    
    var reportFile = [];
    
    var sendResult = sendNotification("noreply@aurora.gov",applicantEmail,"","PLN PRE ACCEPTANCE # 282",emailParameters,reportFile,capID4Email);
    if (!sendResult) 
        { logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
    else
        { logDebug("Sent Notification"); }  
}

logDebug("script 282: ended");