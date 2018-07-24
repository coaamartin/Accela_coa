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
