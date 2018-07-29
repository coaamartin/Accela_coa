function sendEmailNotification(emailTemplate,reportName){

	// Get the Applicant's email
	var recordApplicant = getContactByType("Applicant", capId);
	var applicantEmail = null;
	if (!recordApplicant || recordApplicant.getEmail() == null || recordApplicant.getEmail() == "") {
		logDebug("**WARN no applicant or applicant has no email, capId=" + capId);
	} else {
		applicantEmail = recordApplicant.getEmail();
	}
	// Get the Developer's email
	var recordDeveloper = getContactByType("Developer", capId);
	var developerEmail = null;
	if (!recordDeveloper || recordDeveloper.getEmail() == null || recordDeveloper.getEmail() == "") {
		logDebug("**WARN no developer or developer has no email, capId=" + capId);
	} else {
		developerEmail = recordDeveloper.getEmail();
	}
	
	// Get the Case Manager's email
	var caseManagerEmail=getAssignedStaffEmail();
	var caseManagerPhone=getAssignedStaffPhone();
	
	var cc="";
	if (isBlankOrNull(developerEmail)==false){
		cc=developerEmail;
	}
	if (isBlankOrNull(caseManagerEmail)==false){
		if (cc!=""){
			cc+= ";" +caseManagerEmail;
		}else{
			cc=caseManagerEmail;
		}
	}
	
	var eParams = aa.util.newHashtable();
	addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
	addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
	addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
	addParameter(eParams, "$$balance$$", feeBalance(""));
	addParameter(eParams, "$$wfTask$$", wfTask);
	addParameter(eParams, "$$wfStatus$$", wfStatus);
	addParameter(eParams, "$$wfDate$$", wfDate);
	addParameter(eParams, "$$wfComment$$", wfComment);
	addParameter(eParams, "$$wfStaffUserID$$", wfStaffUserID);
	addParameter(eParams, "$$wfHours$$", wfHours);
	addParameter(eParams, "$$StaffPhone$$", caseManagerPhone);
	addParameter(eParams, "$$StaffEmail$$", caseManagerEmail);
	
	//Based on report, fill report parameters here
	var rptParams = aa.util.newHashtable();
	rptParams.put("RECORD_MODULE", "PLANNING");
	
	var sent =sendEmailWithReport(applicantEmail,cc, emailTemplate, reportName, rptParams, eParams);
	if (sent==false) {
		logDebug("**WARN sending email failed");
	}
  
// 7/29/2018 New requirements added for script 290
// need to send notice for a Public Hearing Notice document
	vACAUrl = lookup("ACA_CONFIGS", "ACA_SITE");
    vACAUrl = vACAUrl.substr(0, vACAUrl.toUpperCase().indexOf("/ADMIN"));
    var docNotFound = true;
    vDocumentList = aa.document.getDocumentListByEntity(capId, "CAP");
    if (vDocumentList != null) {
        vDocumentList = vDocumentList.getOutput();
    }
	aa.print("doc list = " + vDocumentList);
	aa.print("list size = " + vDocumentList.size());
	if (vDocumentList != null) {
		for (y = 0; y < vDocumentList.size(); y++) {
			vDocumentModel = vDocumentList.get(y);
			vDocumentCat = vDocumentModel.getDocCategory();
			aa.print("doc category = " + vDocumentCat);
			if (vDocumentCat == "Public Hearing Notice") {
				//Add the document url to the email paramaters using the name: $$acaDocDownloadUrl$$
				getACADocDownloadParam4Notification(eParams, vACAUrl, vDocumentModel);
				logDebug("including document url: " + eParams.get('$$acaDocDownloadUrl$$'));
				aa.print("including document url: " + eParams.get('$$acaDocDownloadUrl$$'));
				docNotFound = false;
				break;
			}
		}
	}
	var reportFile = [];
	var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
	var sendResult = sendNotification("noreply@aurora.gov",applicantEmail,"",emailTemplate,eParam,reportFile,capID4Email);
	if (!sendResult) 
		{ logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
	else
		{ logDebug("Sent Notification"); }	

}
