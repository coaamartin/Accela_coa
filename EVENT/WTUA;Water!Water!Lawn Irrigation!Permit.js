//Water/Water/Lawn Irrigation/Permit
/*
Title : Update workflow task due date for postponed status (WorkflowTaskUpdateAfter)
Purpose : When the workflow status ="Postponed" then update the workflow due date of the current workflow task by 30 calendar
days.

Author: Haitham Eleisah

Functional Area : Records

Notes :

Sample Call:
UpdateworkFlowTaskDueDate("Note",30)
 */
 
 // Added 10-26-18 JMPorter
 include("78_Auto-Schedule-Type-Irrigation");

var workFlowTasktobeChecked = "Note";
var numberOfdayes = 30;
UpdateworkFlowTaskDueDate(workFlowTasktobeChecked, numberOfdayes);


//Scripts 193 is now fired from ASA, script 195 no longer needed
//script193_WatIrrigationAddInspFee();
//include("script195_ActivateFeeIrrPermit");

if(wfTask == "Application Submittal"){
	
	if(wfStatus == "Ready to Pay"){
		sendLIPNotification("WAT_IRRIGATION PLAN REVIEW INVOICED #193");
	}
	
	if(wfStatus == "Fees Paid"){
		sendLIPNotification("WAT_IP_PERMIT FEES PAID");
	}
	
	if(wfStatus == "Fees Not Required"){
		sendLIPNotification("WAT_IP_PERMIT_NO_FEES");
	}
	
	if(wfStatus == "Withdrawn"){
		sendLIPNotification("WAT_WITHDRAWAL");
	}
	
}

if(wfTask == "Inspection"){
	
	if(wfStatus == "Completed"){
		sendLIPNotification("WAT_IP_INSPECTION PASS");
	}
	
	if(wfStatus == "WIthdrawn"){
		sendLIPNotification("WAT_WITHDRAWAL");
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