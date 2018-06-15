/*
Title : Deactivate Pre Submittal Meeting Task and Email (WorkflowTaskUpdateAfter) 

Purpose : check WF task and status, deactivate a Task, and send email

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	checkWorkflowDeactivateTaskAndSendEmail("Pre Submittal Meetings", [ "Email Applicant" ], "Pre Submittal Meetings", "test_yaz");
	
Notes:
	- Deep URL variable for email template $$recordDeepUrl$$
	- $$altID$$ is used for record#
*/

checkWorkflowDeactivateTaskAndSendEmail("Pre Submittal Meetings", [ "Email Applicant" ], "Pre Submittal Meetings", "PLN PRE SUBMITTAL MEETING #253");

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
	assignTask("Hearing Scheduled",assignedStaff);
	
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
	// send an email to the applicant - we're waiting on the actual template here.
	var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
	
	var emailParameters = aa.util.newHashtable();
	addParameter(emailParameters, "$$altID$$", cap.getCapModel().getAltID());
	addParameter(emailParameters, "$$recordAlias$$", cap.getCapType().getAlias());
	addParameter(emailParameters, "$$StaffPhone$$", caseManagerPhone);
	addParameter(emailParameters, "$$StaffEmail$$", caseManagerEmail);
	addParameter(emailParameters, "$$applicantFirstName$$", recordApplicant.getFirstName());
	addParameter(emailParameters, "$$applicantLastName$$", recordApplicant.getLastName());
	var reportFile = [];
	
	var sendResult = sendNotification("noreply@aurora.gov","eric@esilverliningsolutions.com","","PLN HEARING SCHEDULED # 277",emailParameters,reportFile,capID4Email);
	if (!sendResult) 
		{ logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
	else
		{ logDebug("Sent Notification"); }	
}
logDebug("END of script277_WTUA_Assign Case Manager to Hearing Scheduled.");