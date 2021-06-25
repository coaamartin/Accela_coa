var $iTrc = ifTracer;

if($iTrc(wfTask == "Plans Coordination" && wfStatus == "Resubmittal Requested", 'wfTask == "Plans Coordination" && wfStatus == "Resubmittal Requested"')){
	//Script 125
	deactivateTask("Completeness Check");
}

if($iTrc(wfTask == "Plans Coordination" && wfStatus == "SS Requested", 'wfTask == "Plans Coordination" && wfStatus == "SS Requested"')){
	//Script 125
	deactivateTask("Completeness Check");
}

if($iTrc(wfTask == "Completeness Check" && wfStatus == "Incomplete", 'wfTask == "Completeness Check" && wfStatus == "Incomplete"')){
	//Script 125
	deactivateTask("Completeness Check");
}


//Request AU1208
if(wfTask == "Application Submittal" && wfStatus == "Withdrawn"){
	sendMUSNotification("WAT_WITHDRAWAL");
}

if(wfTask == "Completeness Check"){
	if(wfStatus == "Incomplete"){
		sendMUSNotification("WAT MUS APP INCOMPLETE")
	}
	else if(wfStatus == "Withdrawn"){
		sendMUSNotification("WAT_WITHDRAWAL");
	}
	if(wfStatus == "Resubmittal Requested"){
		sendMUSNotification("WAT OTHER RESUBMITAL REQUESTED #407")
	}
}

if(wfTask == "Water Review"){
	if(wfStatus == "Resubmittal Requested"){
		sendMUSNotification("WAT OTHER RESUBMITAL REQUESTED #407")
	}
	else if(wfStatus == "SS Requested"){
		sendMUSNotification("WAT SS REQUESTED");
	}
}

if(wfTask == "Plans Coordination" && wfStatus == "Approved"){
	sendMUSNotification("WAT MUS APPROVAL")
}


function sendMUSNotification(vemailTemplate){
	var emailTemplateName = arguments[0];
	email
	var eParams = aa.util.newHashtable();
	//today
	var today = new Date();
	var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
	
	eParams.put("$$todayDate$$", thisDate);

	//build ACA URL
	var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
	acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
	var recordURL = getACARecordURL(acaURLDefault);
	addParameter(eParams, "$$acaRecordUrl$$", recordURL);

	//get contact
	var recordApplicant = getContactByType("Applicant", capId);
	var applicantEmail = null;
	if (!recordApplicant || recordApplicant.getEmail() == null || recordApplicant.getEmail() == "") {
		logDebug("**WARN no applicant or applicant has no email, capId=" + capId);
		
	}else {
			applicantEmail = recordApplicant.getEmail();
		}

    //get developer
	var recordDeveloper = getContactByType("Developer", capId);
	var developerEmail = null;
	if (!recordDeveloper || recordDeveloper.getEmail() == null || recordDeveloper.getEmail() == "") {
		logDebug("**WARN developer has no email, capId=" + capId);
		
	}else {
        developerEmail = recordDeveloper.getEmail();
		}
		
		
	addParameter(eParams, "$$wfComment$$", wfComment)
	addParameter(eParams, "$$ContactEmail$$", applicantEmail);
	addParameter(eParams, "$$FirstName$$", recordApplicant.getFirstName());
	addParameter(eParams, "$$LastName$$", recordApplicant.getLastName());
	addParameter(eParams, "$$altid$$", capId.getCustomID());
	var cap = aa.cap.getCap(capId).getOutput();
	addParameter(eParams, "$$capAlias$$", cap.getCapType().getAlias());
	addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias())
	//send
	//var sent = emailContacts("Applicant", emailTemplateName, eParams, "", "", "N", "");
	
	var reportFile = [];
	var sent = sendNotification("noreply@aurora.gov",applicantEmail,developerEmail,emailTemplateName,eParams,reportFile);
	if (!sent) {
		logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
		return false;
	}
	
}