// JMP TEST 101
//COA Script - Suhail
include("5036_autoCreateTempIrrigationPermit");
include("5034_emailResubmittalPlanReview");

/*
Title : Add Inspection Fee (WorkflowTaskUpdateAfter)

Purpose : check wfTask and wfStatus match, then add a Fee based on ASI value, and send email

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	addInspectionFeeAndSendEmail("Application Submittal", [ "Plans Required" ], "Type of Project", "MESSAGE_NOTICE_PUBLIC WORKS", "WorkFlowTasksOverdue", rptParams);
	
Notes:
	- Record type: WATER/WATER/IRRIGATION PLAN REVIEW/NA
	- Email sent to Owner, CC Applicant: Applicant used as EmailTO if no owner on record
	- Fee WAT_IPLAN has one Fee Code only (WAT_IPLAN_01) it's used with different amounts (based on ASI)
*/

//Based on report fill report parameters here
var rptParams = aa.util.newHashtable();
rptParams.put("altID", cap.getCapModel().getAltID());

addInspectionFeeAndSendEmail("Application Submittal", [ "Plans Required" ], "Type of Project", "LIR REQUIRE IRRIGATION PLAN 191", "WorkFlowTasksOverdue", rptParams);
addInspectionFeeAndSendEmail("Plans Review", [ "Resubmittal Requested" ], "Type of Project", "LIR REQUIRE IRRIGATION PLAN 191", "WorkFlowTasksOverdue", rptParams);

//script 191
if ("Application Submittal".equals(wfTask) && "Plans Required".equals(wfStatus)) {
	deactivateTask("Fee Processing");
}

//SWAKIL
if ("Plan Review".equals(wfTask) && "Resubmittal Requested".equals(wfStatus)) {
	deactivateTask("Plan Review");
}


if(wfTask == "Application Submittal"){
	
	if(wfStatus == "Plans Required"){
		sendLIPNotification("WAT IRR PLANS REQUIRED");
	}
	
	if(wfStatus == "Plans Not Required"){
		sendLIPNotification("WAT_IRR_PLANS NOT REQUIRED");
	}
	
}

if(wfTask == "Fee Processing"){
	
	if(wfStatus == "Invoiced"){
		sendLIPNotification("WAT_IP_FEE # 411");
	}
	
	if(wfStatus == "Fees Paid"){
		sendLIPNotification("WAT_IRR_FEES_PAID");
	}

	if(wfStatus == "No Fees Required"){
		sendLIPNotification("WAT_IRR_NO FEES DUE");
	}
	
	
}

if(wfTask == "Plan Review"){
	
	if(wfStatus == "Resubmittal Requested"){
		sendLIPNotification("WAT_IRR_PLAN_RESUB");
	}
	
	if(wfStatus == "Approved"){
		sendLIPNotification("WAT_IRR_PLAN_APPRVD");
	}
	
	
}

function sendLIPNotification(vemailTemplate){
	var emailTemplateName = arguments[0];
	var eParams = aa.util.newHashtable();
	//today
	var today = new Date();
	var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
	eParams.put("$$todayDate$$", thisDate);
	
	//build ACA URL
	var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
	acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));  
	var recordURL = acaSite + getACAUrl();
	addParameter(eParams, "$$acaRecordUrl$$", recordURL);

	//get contact
	var recordApplicant = getContactByType("Applicant", capId);
	var applicantEmail = null;
	if (!recordApplicant || recordApplicant.getEmail() == null || recordApplicant.getEmail() == "") {
		logDebug("**WARN no applicant or applicant has no email, capId=" + capId);
		return false;
	}else 
		{
			applicantEmail = recordApplicant.getEmail();
		}
		
	//get owner email if exist
	var ownerEmail = "";
	var ownersObj = aa.owner.getOwnerByCapId(capId);
	if (!ownersObj.getSuccess() || ownersObj.getOutput() == null || ownersObj.getOutput().length == 0) {
		logDebug("No owner found");
	}else{
		ownersObj = ownersObj.getOutput()
		ownersObj = ownersObj[0];
		ownerEmail = ownersObj.getEmail();
		if(!matches(ownerEmail,null,undefined,"")){
			logDebug("Owner email: " + ownerEmail);
			addParameter(eParams, "$$OwnerEmail$$", ownerEmail);
			
		}
	}
	
		
	//wf comments
	if (wfComment) addParameter(eParams, "$$wfComment$$", wfComment);
	
	
	addParameter(eParams, "$$ContactEmail$$", applicantEmail);
	addParameter(eParams, "$$FirstName$$", recordApplicant.getFirstName());
	addParameter(eParams, "$$LastName$$", recordApplicant.getLastName());
	addParameter(eParams, "$$altid$$", capId.getCustomID());
	var cap = aa.cap.getCap(capId).getOutput();
	addParameter(eParams, "$$capAlias$$", cap.getCapType().getAlias());
	
	//send
	//var sent = emailContacts("Applicant", emailTemplateName, eParams, "", "", "N", "");
	
	var reportFile = [];
	var sent = sendNotification("noreply@aurora.gov",applicantEmail,"",emailTemplateName,eParams,reportFile);
	if (!sent) {
		logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
		return false;
	}
	
}