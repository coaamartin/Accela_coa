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
/*
Script 273
Record Types:		Planning/Application/Site Plan/Amendment
			Planning/Application/Conditional Use/NA 
			Planning/Application/Site Plan/Minor
Desc:			Spec:  (from spec: 273/Script-273-version3.pdf) and tracker comments

Created By: Silver Lining Solutions
*/

logDebug("script273_WTUA_CalcReviewDueDatesAndPotentialPCHearingSchedule START.");
var appSpecRevComments = "";
var appSpecValRevComments = "";
var appSpecProjCommHearingDate = "";
var appSpecSubmissionDate = "";
var appSpecValSubmissionDate = "";

if (wfTask == "Review Distribution" && wfStatus == "In Review") {
	if ( !(AInfo["1st Review Comments Due Date"]) ) {
		// Set up the 'target' date we want to search for meetings
		var dToday = new Date();
		var lookForPlanningMtgDate	= aa.date.parseDate(dateAddHC(dToday,(7*6.5)));
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
	else if ( !(AInfo["2nd Review Comments Due Date"]) ) {
		// Set up the 'target' date we want to search for meetings
		var dToday = new Date();
		var lookForPlanningMtgDate	= aa.date.parseDate(dateAddHC(dToday,(7*6)));
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
			logDebug("Script 273: WARNING - there is no planning commission date within 45 days of your target date!");
			comment("<B><Font Color=RED>WARNING - there is no planning commission date within 45 days of your target date!</Font></B>");
		}
		
	} else {
		// Set up the 'target' date we want to search for meetings
		var dToday = new Date();
		var lookForPlanningMtgDate	= aa.date.parseDate(dateAddHC(dToday,(7*5)));
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
			logDebug("Script 273: WARNING - there is no planning commission date within 45 days of your target date!");
			comment("<B><Font Color=RED>WARNING - there is no planning commission date within 45 days of your target date!</Font></B>");
		}
	}
	
// send an email to the applicant - we're waiting on the actual template here.
	sendEmail("TEST_FOR_SCRIPTS");
}
logDebug("script273_WTUA_CalcReviewDueDatesAndPotentialPCHearingSchedule end.");

		
