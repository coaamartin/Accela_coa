/*
Title : Update custom fields based on Planning Commission Meeting Calendar (WorkflowTaskUpdateAfter)
Purpose : Update review Comments Due dates, applicant submission dates, and Planning Commission Hearing Date

Author: Ahmad WARRAD

Update By : haitham Eleisah : update the script to consider the new customer changes and change the script to be as standard
Functional Area : Records

Sample Call:
	updateReviewCommentsDueDate("Review Distribution", "In Review", "1st Review Comments Due Date", "2nd Review Comments Due Date", "3rd Review Comments Due Date", "Planning Commission", Planning Commission Date",
		"Applicant 2nd Submission Date", "Applicant 3rd Submission Date", "MESSAGE_NOTICE_PUBLIC WORKS", recordURL);

*/
/****************** Per Don Bates we are commenting out this code - if you need it, please correct it ******/
/*  ************* start of code commented out!
var workFlowTask = "Review Distribution";
var workFlowStatus = "In Review";
var firstReviewDateASI = "1st Review Comments Due Date";
var secondReviewDateASI = "2nd Review Comments Due Date";
var thirdReviewDateASI = "3rd Review Comments Due Date";
var meetingType = "Planning Commission";
var planningCommissionDateASI = "Planning Commission Hearing Date";
var applicant2ndSubmissionDateASI = "Applicant 2nd Submission Date";
var applicant3rdSubmissionDateASI = "Applicant 3rd Submission Date";
var emailTemplate = "MESSAGE_NOTICE_PUBLIC WORKS";
var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
var recordURL = getACARecordURL(acaURLDefault);

updateReviewCommentsDueDate(workFlowTask, workFlowStatus, firstReviewDateASI, secondReviewDateASI, thirdReviewDateASI, meetingType, planningCommissionDateASI,
		applicant2ndSubmissionDateASI, applicant3rdSubmissionDateASI, emailTemplate, recordURL);
******************** end commented out code!  */

/* Script 419 created by SLS */
logDebug("script419 WTUACreatePublicWorksDrainageRecord START."); 
if (wfTask == 'Civil Review' && ( wfStatus == 'Note' || wfStatus == 'Complete' || wfStatus == 'Resubmittal Requested' || wfStatus == 'Comments Not Received')) {

// >>>>>>>>>>>> for now set the TSI value to true to create 
// >>>>>>>>>>>> the record until City can decide on config change

	var isDrainageReqTSI = true;
	var thisTSIArr = [];
	loadTaskSpecific(thisTSIArr);

	var appNamed = cap.getSpecialText() + "";
	var alreadyDrainageChildWithSameName = false;
	var childArr = getChildren("PublicWorks/Drainage/NA/NA",capId);
	for (aChild in childArr) {
		var aChildCap = aa.cap.getCap(childArr[aChild]).getOutput();
		var childAppNameStr = aChildCap.getSpecialText();
		if ( childAppNameStr == appNamed ) {
			alreadyDrainageChildWithSameName = true;
		}
	}
	if ((!alreadyDrainageChildWithSameName) && isDrainageReqTSI) {
		var newChildrec = createChild('PublicWorks','Drainage','NA','NA',appNamed);
		if (!newChildrec) { 
			logDebug("script419: unable to create child record");
		}
		else {
			logDebug("script419: Child Record Created="+newChildrec);
		}
	}
	else {
		logDebug("script419: Drainage TSI is false or already child created!");
		logDebug("script419: alreadyDrainageChildWithSameName= "+alreadyDrainageChildWithSameName);
		logDebug("script419: isDrainageReqTSI+ "+isDrainageReqTSI);				
	}
}
logDebug("script419 WTUACreatePublicWorksDrainageRecord end.");
/* END script 419 */


/*
Script 273
Record Types:		Planning/Application/Site Plan/Amendment
			Planning/Application/Conditional Use/NA 
			Planning/Application/Site Plan/Minor
Desc:			Spec:  (from spec: 273/Script-273-version3.pdf) and tracker comments

Created By: Silver Lining Solutions

removed per instruction on 7/18
*/

/*
Script 274
Record Types:   Planning/Application/Preliminary Plat/NA
                Planning/Application/Site Plan/Major
Desc:           Spec:  (from spec: 274) and tracker comments
Created By: Silver Lining Solutions
*/

logDebug("script274_WTUA_CalcReviewDueDatesAndPotentialPCHearingSchedule2 START.");

var appSpecRevComments = "";
var appSpecValRevComments = "";
var appSpecProjCommHearingDate = "";
var appSpecSubmissionDate = "";
var appSpecValSubmissionDate = "";

if (wfTask == "Review Distribution" && wfStatus == "In Review") {
    logDebug("*******TASK AND STATUS MATCH*****");
    if ( !(AInfo["1st Review Comments Due Date"]) ) {
        // Set up the 'target' date we want to search for meetings
        var dToday = new Date();
        var lookForPlanningMtgDate  = aa.date.parseDate(dateAddHC2(dToday,(7*12)));
        var lookForMMDDYYYY = ("0" + lookForPlanningMtgDate.getMonth()).slice(-2) + "/" 
                                + ("0" + lookForPlanningMtgDate.getDayOfMonth()).slice(-2) + "/" 
                                + lookForPlanningMtgDate.getYear();
        logDebug("lookForPlanningMtgDate = " + lookForPlanningMtgDate);
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
            logDebug("newHearingDate = " + newHearingDate);                             
            editAppSpecific("Projected Planning Commission Date",newHearingDate);
        } else {
            logDebug("Script 274: WARNING - there is no planning commission date within 45 days of your target date!");
            comment("<B><Font Color=RED>WARNING - there is no planning commission date within 45 days of your target date!</Font></B>");
        }
    }
    else if ( !(AInfo["2nd Review Comments Due Date"]) ) {
        // Set up the 'target' date we want to search for meetings
        logDebug("1st Review Comments is Populated--Looking at 2nd Review Comments");
        var dToday = new Date();
        var lookForPlanningMtgDate  = aa.date.parseDate(dateAddHC2(dToday,(7*8)));
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
        logDebug("*******2nd Review Date = " +revdDateStr);

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
            logDebug("Script 274: WARNING - there is no planning commission date within 45 days of your target date!");
            comment("<B><Font Color=RED>WARNING - there is no planning commission date within 45 days of your target date!</Font></B>");
        }
        
    } else {
        // Set up the 'target' date we want to search for meetings
        var dToday = new Date();
        var lookForPlanningMtgDate  = aa.date.parseDate(dateAddHC2(dToday,(7*4)));
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
            logDebug("Script 274: WARNING - there is no planning commission date within 45 days of your target date!");
            comment("<B><Font Color=RED>WARNING - there is no planning commission date within 45 days of your target date!</Font></B>");
        }
    }
    
        logDebug("**script274 preparing email**");
        
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
        
        var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
        var emailParameters = aa.util.newHashtable();
        addParameter(emailParameters, "$$altID$$", cap.getCapModel().getAltID());
        addParameter(emailParameters, "$$recordAlias$$", cap.getCapType().getAlias());
        addParameter(emailParameters, "$$StaffPhone$$", caseManagerPhone);
        addParameter(emailParameters, "$$StaffEmail$$", caseManagerEmail);
        addParameter(emailParameters, "$$StaffFullName$$", caseManagerFullName);
        addParameter(emailParameters, "$$StaffTitle$$", caseManagerTitle);
        addParameter(emailParameters, "$$applicantFirstName$$", recordApplicant.getFirstName());
        addParameter(emailParameters, "$$applicantLastName$$", recordApplicant.getLastName());
        addParameter(emailParameters, "$$wfComment$$", wfComment);
        var reportFile = [];
        var sendResult = sendNotification("noreply@aurora.gov",applicantEmail,"","PLN REVIEW COMMENTS # 273 274 275",emailParameters,reportFile,capID4Email);
        if (!sendResult) 
            { logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
        else
            { logDebug("Sent Notification"); }  
            
}
logDebug("script274_WTUA_CalcReviewDueDatesAndPotentialPCHearingSchedule2 end.");

/*
Script 277
Record Types:	​Planning/Application/Conditional Use/NA 
				Planning/Application/Rezoning/NA 
				Planning/Application/Site Plan/Major
				Planning/Application/​​Site Plan/Amendment

Desc:			see Script Tracker for script 277

Created By: Silver Lining Solutions
*/
logDebug("START of script277_WTUA_Assign Case Manager to Hearing Scheduled.");
if (wfTask == "Review Consolidation" && (wfStatus == "Review Complete" || wfStatus == "Ready for Planning Commission"))
{
	logDebug("script277_Match on task/status");
	// get Record assigned staff 
	var assignedStaff = getAssignedStaff();
	logDebug("script277 assignedstaff =" + assignedStaff);
	assignTask("Hearing Scheduling",assignedStaff);
	
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
