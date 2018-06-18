var $iTrc = ifTracer;
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

/* Title :  Send Notice - PC email (WorkflowTaskUpdateAfter)

Purpose :  If workflow task = "Prepare Signs" AND workflow task "Notice - PC" both have a workflow status of "Complete" then email
the Applicant and cc Developer and cc the Case Manager (email from user is the Assigned Staff in Record detail), include
workflow comments. (need email wording from Aurora). Email also needs a form attached for the Applicant to fill out(Aurora
will determine the report).

Author :   Israa Ismail

Functional Area : Records 

Sample Call : sendNoticePCEmail()

Notes : 
		  1-Report name and parameters are not provided, they are handled below in reportName(sample:"WorkFlowTasksOverdue"),rptParams.put...
		  2-Email Template Name is not provided, sample template Name : "MESSAGE_NOTICE_PLANNING"
		  3-The provided wfTasks is not found alternatively wfTask "Prepare Signs and Notice - PC" is used
		  4-Please apply the script on these record types :"PLANNING/APPLICATION/ Conditional Use/NA","PLANNING/APPLICATION/PRELIMINARY PLAT/NA"
		    "PLANNING/APPLICATION/MASTER PLAN/*","PLANNING/APPLICATION/REZONING/NA","PLANNING/APPLICATION/SITE PLAN/*"
*/
sendNoticePCEmail();

if($iTrc(wfTask == "Generate Hearing Results" && wfStatus == "Technical Submittal", 'wf:Generate Hearing Results/Technical Submittal')){
	plnScript284_activateTasks();
}

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


//Script 58
//-- this is how it is spelled now. if this is corrected then comment the first line and uncomment the second one
setEAgendaDueDate("Generate Hearing Results", [ "Reveiw Complete" ], "Create E-Agenda", "City Council"); 
//setEAgendaDueDate("Generate Hearing Results", [ "Review Complete" ], "Create E-Agenda", "City Council");

/*
Script 275
Record Types:	Planning/Application/Master Plan/NA
				Planning/Application/Rezoning/NA
Desc:			Spec:  (from spec: 275) and tracker comments
Created By: Silver Lining Solutions
*/

logDebug("script275_WTUA_CalcReviewDueDatesAndPotentialPCHearingSchedule3 START.");

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
		var lookForPlanningMtgDate	= aa.date.parseDate(dateAddHC(dToday,(7*17.5),true));
		var lookForMMDDYYYY = ("0" + lookForPlanningMtgDate.getMonth()).slice(-2) + "/" 
								+ ("0" + lookForPlanningMtgDate.getDayOfMonth()).slice(-2) + "/" 
								+ lookForPlanningMtgDate.getYear();

		//Set up the 'look back' from the target date for searching
		var lookForStartDate		= aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,0));
		
		//Set up the 'look forward' from the target date for searching
		var lookForEndDate			= aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,+45));
		logDebug("lookForPlanningMtgDate = " + lookForPlanningMtgDate);
		//Find the closest meeting to lookForPlanningMtgDate between lookForStartDate and lookForEndDate 
		var newPlnMtg = getClosestAvailableMeeting("Planning Commission", lookForPlanningMtgDate, lookForStartDate, lookForEndDate, "PLANNING COMMISSION");

		// update review comments
		var revdDate = aa.date.parseDate(dateAddHC("",15, true));
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
			logDebug("Script 275: WARNING - there is no planning commission date within 45 days of your target date!");
			comment("<B><Font Color=RED>WARNING - there is no planning commission date within 45 days of your target date!</Font></B>");
		}
	}
	else if ( !(AInfo["2nd Review Comments Due Date"]) ) {
		// Set up the 'target' date we want to search for meetings
		logDebug("1st Review Comments is Populated--Looking at 2nd Review Comments");
		var dToday = new Date();
		var lookForPlanningMtgDate	= aa.date.parseDate(dateAddHC(dToday,(7*6),true));
		var lookForMMDDYYYY = ("0" + lookForPlanningMtgDate.getMonth()).slice(-2) + "/" 
								+ ("0" + lookForPlanningMtgDate.getDayOfMonth()).slice(-2) + "/" 
								+ lookForPlanningMtgDate.getYear();
		
		//Set up the 'look back' from the target date for searching
		var lookForStartDate		= aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,0));
		
		//Set up the 'look forward' from the target date for searching
		var lookForEndDate			= aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,+45));
		
		//Find the closest meeting to lookForPlanningMtgDate between lookForStartDate and lookForEndDate 
		var newPlnMtg = getClosestAvailableMeeting("Planning Commission", lookForPlanningMtgDate, lookForStartDate, lookForEndDate, "PLANNING COMMISSION");

		// update review comments
		var revdDate = aa.date.parseDate(dateAddHC("",15, true));
		var revdDateStr = ("0" + revdDate.getMonth()).slice(-2) + "/" 
							+ ("0" + revdDate.getDayOfMonth()).slice(-2) + "/" 
							+ revdDate.getYear();
		editAppSpecific("2nd Review Comments Due date",revdDateStr);
		logDebug("*******2nd Review Date = " +revdDateStr);

		// update submission date
		var subdDate = aa.date.parseDate(dateAddHC("",20, true));
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
			logDebug("Script 275: WARNING - there is no planning commission date within 45 days of your target date!");
			comment("<B><Font Color=RED>WARNING - there is no planning commission date within 45 days of your target date!</Font></B>");
		}
		
	} else {
		// Set up the 'target' date we want to search for meetings
		var dToday = new Date();
		var lookForPlanningMtgDate	= aa.date.parseDate(dateAddHC(dToday,(7*5),true));
		var lookForMMDDYYYY = ("0" + lookForPlanningMtgDate.getMonth()).slice(-2) + "/" 
								+ ("0" + lookForPlanningMtgDate.getDayOfMonth()).slice(-2) + "/" 
								+ lookForPlanningMtgDate.getYear();
				
		//Set up the 'look back' from the target date for searching
		var lookForStartDate		= aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,0));
		
		//Set up the 'look forward' from the target date for searching
		var lookForEndDate			= aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY, +45));
		
		//Find the closest meeting to lookForPlanningMtgDate between lookForStartDate and lookForEndDate 
		var newPlnMtg = getClosestAvailableMeeting("Planning Commission", lookForPlanningMtgDate, lookForStartDate, lookForEndDate, "PLANNING COMMISSION");

		if (!(AInfo["3rd Review Comments Due Date"])) {
			// update review comments
			var revdDate = aa.date.parseDate(dateAddHC("",10, true));
			var revdDateStr = ("0" + revdDate.getMonth()).slice(-2) + "/" 
								+ ("0" + revdDate.getDayOfMonth()).slice(-2) + "/" 
								+ revdDate.getYear();
			editAppSpecific("3rd Review Comments Due date",revdDateStr);
		
			// update submission date
			var subdDate = aa.date.parseDate(dateAddHC("",15, true));
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
	
		logDebug("**script275 preparing email**");
		
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
logDebug("script275_WTUA_CalcReviewDueDatesAndPotentialPCHearingSchedule3 end.");

