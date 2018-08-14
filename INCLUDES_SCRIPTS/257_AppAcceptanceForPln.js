/*
Title : Application Acceptance for Planning (WorkflowTaskUpdateAfter) 

Purpose : 

Author: Silver Lining Solutions
 
Functional Area : Records

Sample Call:
script257_ApplicationAcceptanceForPlanning(workFlowTask, workFlowStatus, firstReviewDateASI, meetingType, planningCommissionDateASI, emailTemplate, recordURL);
    
    Note:
        this script will abort if subType = "Address", requested in PDF:
        ... Record Type: Planning/Application/{*}/{*} (except Planning/Application/Address/{*})
*/

var workFlowTask = "Application Acceptance";
var workFlowStatus = "Accepted";
var firstReviewDateASI = "1st Review Comments Due Date";
var meetingType = "Planning Commission";
var planningCommissionDateASI = "Planning Commission Hearing Date";
var emailTemplate ="PLN APPLICATION ACCEPTANCE FOR PLANNING # 257" //"MESSAGE_NOTICE_PUBLIC WORKS"; //
var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
var recordURL = getACARecordURL(acaURLDefault);

script257_AppAcceptanceForPln(workFlowTask, workFlowStatus, firstReviewDateASI, meetingType, planningCommissionDateASI, emailTemplate, recordURL);
//("Application Acceptance", [ "Accepted" ], "Planning Commission", "Planning Commission Hearing Date", "PLN APPLICATION ACCEPTANCE FOR PLANNING # 257");


function script257_AppAcceptanceForPln(workFlowTask, workFlowStatus, firstReviewDateASI, meetingType, planningCommissionDateASI, emailTemplate, recordURL) 
{


    if (cap.getCapModel().getCapType().getSubType().equalsIgnoreCase("Address")) {
            return false;
        }

    if (matches(wfTask, workFlowTask) && matches(wfStatus, workFlowStatus)) {
        var firstReviewDate = getAppSpecific(firstReviewDateASI);
        logDebug("*****Enter NEW script257_AppAcceptanceForPln function*****");

        
        if (ifTracer(isEmpty(firstReviewDate), 'isEmpty(firstReviewDate)')) 
        {
            // If Custom Field "1st Review Comments Due date" is null
            // Then update it with Today + 15 days
            firstReviewDate = dateAddHC2(new Date(), 15, 'Y');
            logDebug("firstReviewDate = " + firstReviewDate);
            editAppSpecific(firstReviewDateASI, firstReviewDate);
        
            // And update the custom Field "Projected Planning Commission Hearing date" by searching the Planning
            // Commission Meeting Calendar returning the "Planning Commission Meeting" closest to 6.5 weeks from the current date
            var dToday = new Date();

            var lookForPlanningMtgDate  = aa.date.parseDate(dateAddHC2(dToday,(7*6.5)));
            var lookForMMDDYYYY = ("0" + lookForPlanningMtgDate.getMonth()).slice(-2) + "/" 
                                    + ("0" + lookForPlanningMtgDate.getDayOfMonth()).slice(-2) + "/" 
                                    + lookForPlanningMtgDate.getYear();
            logDebug("lookforMMDDYYYY:"+lookForMMDDYYYY);

            //Set up the 'look back' from the target date for searching
            var lookForStartDate        = aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,0));
            logDebug("you lookForStartDate is:"+lookForStartDate.getMonth()+"/"+lookForStartDate.getDayOfMonth()+"/"+lookForStartDate.getYear());
            
            //Set up the 'look forward' from the target date for searching
            var lookForEndDate          = aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,+45));
            logDebug("you lookForStartDate is:"+lookForEndDate.getMonth()+"/"+lookForEndDate.getDayOfMonth()+"/"+lookForEndDate.getYear());
            
            var newPlnMtg = getClosestAvailableMeeting("Planning Commission", lookForPlanningMtgDate, lookForStartDate, lookForEndDate, "PLANNING COMMISSION");
            
            // now set the ASI values you need to update for this If
        //  editAppSpecific("1st Review Comments Due date",dateAddHC2(null,15,true));
            if (newPlnMtg != null) {
                logDebug("----------------the new planning meet date is:"+newPlnMtg.meetingId+"----------------");
                //printObjProperties(newPlnMtg);
                    var newHearingDate = (""+ newPlnMtg.startDate).slice(5,7)+"/" 
                                    +(""+ newPlnMtg.startDate).slice(8,10)+"/"
                                    +(""+ newPlnMtg.startDate).slice(0,4);
                logDebug("now updating the date with:"+newHearingDate);
                editAppSpecific("Projected Planning Commission Date",newHearingDate);
            } else {
                logDebug("Script 257: WARNING - there is no planning commission date within 45 days of your target date!");
                comment("<B><Font Color=RED>WARNING - there is no planning commission date within 45 days of your target date!</Font></B>");
            }
            
        }
                logDebug("**script257 preparing email**");
        
        // send an email to the applicant
        // Get the Applicant's email
        var recordApplicant = getContactByType("Applicant", capId);
        var applicantEmail = null;
        if (!recordApplicant || recordApplicant.getEmail() == null || recordApplicant.getEmail() == "") {
            logDebug("**WARN no applicant or applicant has no email, capId=" + capId);
        } else {
            applicantEmail = recordApplicant.getEmail();

            //06/19 - Concatenate first and last name
            var firstName = recordApplicant.getFirstName();   
            var middleName =recordApplicant.getMiddleName();   
            var lastName = recordApplicant.getLastName(); 
            var fullName = buildFullName(firstName, middleName,lastName);

            // Get the Case Manager's email
            var caseManagerEmail=getAssignedStaffEmail();
            var caseManagerPhone=getAssignedStaffPhone();
            var caseManagerFullName=getAssignedStaffFullName();
            var caseManagerTitle=getAssignedStaffTitle();
            //New spec on 06/19/2018 - User current userid for Staff Info
            
            var iNameResult = aa.person.getUser(currentUserID);
            var iName = iNameResult.getOutput();
            var userEmail=iName.getEmail();
            var userName = iName.getFullName();
            var userPhone = iName.getPhoneNumber();
            var userTitle = iName.getTitle(); 

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

            var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
            var emailParameters = aa.util.newHashtable();
            addParameter(emailParameters, "$$altID$$", cap.getCapModel().getAltID());
            addParameter(emailParameters, "$$recordAlias$$", cap.getCapType().getAlias());
            addParameter(emailParameters, "$$StaffPhone$$", userPhone); 
            addParameter(emailParameters, "$$StaffEmail$$", userEmail);
            addParameter(emailParameters, "$$StaffFullName$$", userName);
            addParameter(emailParameters, "$$StaffTitle$$", userTitle);
            addParameter(emailParameters, "$$applicantFirstName$$", recordApplicant.getFirstName());
            addParameter(emailParameters, "$$applicantLastName$$", recordApplicant.getLastName());
            addParameter(emailParameters, "$$ContactFullName$$", fullName);
            addParameter(emailParameters, "$$wfComment$$", wfComment);
            addParameter(emailParameters, "$$recordDeepUrl$$", recordDeepUrl);
            var reportFile = [];
            var sendResult = sendNotification("noreply@aurora.gov",applicantEmail,"","PLN APPLICATION ACCEPTANCE FOR PLANNING # 257",emailParameters,reportFile,capID4Email);
            if (!sendResult) { 
                logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); 
            }
            else { 
                logDebug("Sent Notification");            
            }  

        }
        // assign Review Distribution to the assigned staff for the record
        logDebug("**script257 assigning task**");
        var assignedStaff = getAssignedStaff();
        assignTask("Review Distribution",assignedStaff);
        
    }
}     