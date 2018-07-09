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
