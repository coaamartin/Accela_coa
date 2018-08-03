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
	else
        sendHearingScheduledEmailAndUpdateASI("Hearing Scheduling", [ "Scheduled" ], "Planning Commission", "Planning Commission Hearing Date", "PLN PUBLIC HEARING EMAIL # 278");
}
// Workflow Task name is different for Rezoning so putting in the Event for WTUA:"Planning/Application/Rezoning/NA
//	sendHearingScheduledEmailAndUpdateASI("Hearing Scheduling", [ "Scheduled" ], "Planning Commission", "Planning Commission Hearing Date", "PLN PUBLIC HEARING EMAIL # 278");

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
// Script 244
autoCreateMasterUtilStudyApplication("Water Dept Review", [ "Comments Not Received", "Resubmittal Requested",  "Complete", "Note"], "Is a Master Utility Plan Required", "Water Dept Review",
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
	var emailTemplate ="PLN APPLICATION ACCEPTANCE FOR PLANNING # 257" //"MESSAGE_NOTICE_PUBLIC WORKS"; //
	var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
	acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
	var recordURL = getACARecordURL(acaURLDefault);

script257_AppAcceptanceForPln(workFlowTask, workFlowStatus, firstReviewDateASI, meetingType, planningCommissionDateASI, emailTemplate, recordURL);
//("Application Acceptance", [ "Accepted" ], "Planning Commission", "Planning Commission Hearing Date", "PLN APPLICATION ACCEPTANCE FOR PLANNING # 257");
}

function script257_AppAcceptanceForPln(workFlowTask, workFlowStatus, firstReviewDateASI, meetingType, planningCommissionDateASI, emailTemplate, recordURL) 
{

	if (cap.getCapModel().getCapType().getSubType().equalsIgnoreCase("Address")) {
			return false;
		}

	if (matches(wfTask, workFlowTask) && matches(wfStatus, workFlowStatus)) {
		var firstReviewDate = getAppSpecific(firstReviewDateASI);
		logDebug("*****Enter NEW script257_AppAcceptanceForPln function*****");

		
		if (isEmpty(firstReviewDate)) 
		{
			// If Custom Field "1st Review Comments Due date" is null
			// Then update it with Today + 15 days
			firstReviewDate = dateAddHC2(new Date(), 15, 'Y');
			logDebug("firstReviewDate = " + firstReviewDate);
			editAppSpecific(firstReviewDateASI, firstReviewDate);
		
			// And update the custom Field "Projected Planning Commission Hearing date" by searching the Planning
			// Commission Meeting Calendar returning the "Planning Commission Meeting" closest to 6.5 weeks from the current date
			var dToday = new Date();

			var lookForPlanningMtgDate	= aa.date.parseDate(dateAddHC2(dToday,(7*6.5)));
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
			
			// now set the ASI values you need to update for this If
		//	editAppSpecific("1st Review Comments Due date",dateAddHC2(null,15,true));
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
		}
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
		if (!sendResult) 
			{ logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
		else
			{ logDebug("Sent Notification"); }	
		// assign Review Distribution to the assigned staff for the record
		logDebug("**script257 assigning task**");
		var assignedStaff = getAssignedStaff();
		assignTask("Review Distribution",assignedStaff);
		
	}
}		

//Script 282
//Record Types:	Planning/Application/~/~ except for Address
//Event: 		WTUA
//Desc:			Event: WorkflowTaskUpdateAfter wfTask = Landscape Pre Acceptance 
//				or Addressing Pre Acceptance or Planning Pre Acceptance or Civil 
//				Pre Acceptance = Resubmittal Requested send an email to the applicant,
//				include Record # and deep link for the record (Planning to send 
//				Template). Sincerely, Name of Assigned to Staff in the Record Detail, 
//				with their email from user and phone number from (Shared Dropdown if 
//				Active directory does not merge phone numbers or a general phone 
//				number for Planning). Include comments from the status – Req for Planning
//
//Created By: Silver Lining Solutions
logDebug("script 282: started");
if((wfTask == "Landscape Pre Acceptance" || wfTask == "Addressing Pre Acceptance" || 
	wfTask == "Real Property Pre Acceptance" ||	wfTask == "Planning Pre Acceptance" || wfTask == "Civil Pre Acceptance" ) &&
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