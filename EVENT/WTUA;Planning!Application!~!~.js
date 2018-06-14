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
sendHearingScheduledEmailAndUpdateASI("Hearing Scheduling", [ "Scheduled" ], "Planning Commission", "Planning Commission Hearing Date", "PLN PUBLIC HEARING EMAIL # 278");
}

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
		"Planning/Application/Site Plan/Minor" ], "Traffic Review", [ "Comments Not Received", "Resubmittal Requested" ], "Is a Traffic Impact Study Required?",
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

autoCreateMasterUtilStudyApplication("Water Dept Review", [ "Comments Not Received", "Resubmittal Requested",  "Complete"], "Is a Master Utility Plan Required", "Water Dept Review",
		"Water/Utility/Master Utility/Study");
		
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
if(!appMatch(("Planning/Application/Address/*"))){
	var workFlowTask = "Application Acceptance";
	var workFlowStatus = "Accepted";
	var firstReviewDateASI = "1st Review Comments Due Date";
	var meetingType = "Planning Commission";
	var planningCommissionDateASI = "Planning Commission Hearing Date";
	var emailTemplate = "MESSAGE_NOTICE_PUBLIC WORKS"; //"PLN APPLICATION ACCEPTANCE FOR PLANNING # 257"
	var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
	acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
	var recordURL = getACARecordURL(acaURLDefault);

script257_AppAcceptanceForPln(workFlowTask, workFlowStatus, firstReviewDateASI, meetingType, planningCommissionDateASI, emailTemplate, recordURL);
//("Application Acceptance", [ "Accepted" ], "Planning Commission", "Planning Commission Hearing Date", "PLN APPLICATION ACCEPTANCE FOR PLANNING # 257");
}

function script257_AppAcceptanceForPln(workFlowTask, workFlowStatus, firstReviewDateASI, meetingType, planningCommissionDateASI, emailTemplate, recordURL) {

if (cap.getCapModel().getCapType().getSubType().equalsIgnoreCase("Address")) {
		return false;
	}

if (matches(wfTask, workFlowTask) && matches(wfStatus, workFlowStatus)) {
	var firstReviewDate = getAppSpecific(firstReviewDateASI);
	logDebug("*****Enter NEW script257_AppAcceptanceForPln function*****");

	
	if (isEmpty(firstReviewDate)) 
	{
		logDebug("**script257: step 1**");
		// If Custom Field "1st Review Comments Due date" is null
		// Then update it with Today + 15 days
		firstReviewDate = dateAdd(new Date(), 15, true);
		editAppSpecific(firstReviewDateASI, firstReviewDate);
	
		// And update the custom Field "Projected Planning Commission Hearing date" by searching the Planning
		// Commission Meeting Calendar returning the "Planning Commission Meeting" closest to 6.5 weeks from the current date
	
	
		var dToday = new Date();
		dToday = ("0" + (dToday.getMonth() + 1)).slice(-2) + "/" 
				+ ("0" + dToday.getDate()).slice(-2) + "/" 
				+ dToday.getYear();
		logDebug("LABEL (anything) dToday = " + dToday);
		var lookForPlanningMtgDate	= aa.date.parseDate(dateAdd(dToday,(7*6.5)));
		var lookForMMDDYYYY = ("0" + lookForPlanningMtgDate.getMonth()).slice(-2) + "/" 
								+ ("0" + lookForPlanningMtgDate.getDayOfMonth()).slice(-2) + "/" 
								+ lookForPlanningMtgDate.getYear();
		logDebug("lookforMMDDYYYY:"+lookForMMDDYYYY);
		//Set up the 'look back' from the target date for searching
		var lookForStartDate		= aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,0));
		logDebug("you lookForStartDate is:"+lookForStartDate.getMonth()+"/"+lookForStartDate.getDayOfMonth()+"/"+lookForStartDate.getYear());
		
		//Set up the 'look forward' from the target date for searching
		var lookForEndDate			= aa.date.parseDate(aa.date.addDate(lookForMMDDYYYY,+45));
		logDebug("you lookForStartDate is:"+lookForEndDate.getMonth()+"/"+lookForEndDate.getDayOfMonth()+"/"+lookForEndDate.getYear());
		
		var newPlnMtg = getClosestAvailableMeeting("Planning Commission", lookForPlanningMtgDate, lookForStartDate, lookForEndDate, "PLANNING COMMISSION");
		logDebug("**script257: step 2**");

		// now set the ASI values you need to update for this If
		editAppSpecific("1st Review Comments Due date",dateAdd(null,15));
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
	
		var applicantEmail = null;
    var recordApplicant = getContactByType("Applicant", capId);
    if (recordApplicant) {
        applicantEmail = recordApplicant.getEmail();
    }
    if (applicantEmail == null) {
        logDebug("**WARN Applicant on record " + capId + " has no email");
        return false
    }
    var files = new Array();
    var emailParams = aa.util.newHashtable();
    addParameter(emailParams, "$$altID$$", cap.getCapModel().getAltID());
    addParameter(emailParams, "$$recordAlias$$", cap.getCapModel().getCapType().getAlias());
    addParameter(emailParams, "$$recordStatus$$", cap.getCapModel().getCapStatus());
    addParameter(emailParams, "$$wfComment$$", wfComment);
    addParameter(emailParams, "$$wfTask$$", wfTask);
    addParameter(emailParams, "$$wfStatus$$", wfStatus);
    addParameter(emailParams, "$$acaRecordUrl$$", recordURL);
    var sent = aa.document.sendEmailByTemplateName("", applicantEmail, "", emailTemplate, emailParams, files);
    if (!sent.getSuccess()) {
        logDebug("**ERROR sending email failed, error:" + sent.getErrorMessage());
        return false;
    }

	} else {
		return false;
	}
}		
