
/**
 * check if any inspection was finished with result 'Complete', it sends email to owner and applicant and updates an ASI field
 * @param emailTemplateName
 * @param reportName
 * @param rptParams
 * @param asiFieldName
 * @returns {Boolean}
 */
function checkInspectionsResultAndSendEmail4PPBMP(emailTemplateName, asiFieldName) {
	logDebug("checkInspectionsResultAndSendEmail() started");
	//Update ASI
	var newDate = dateAddMonths(null, 36);//36 months = 3 years
	editAppSpecific(asiFieldName, newDate);

	//Send the email
	var ownerEmail = null, applicantEmail = null;
	var owners = aa.owner.getOwnerByCapId(capId);
	if (owners.getSuccess()) {
		owners = owners.getOutput();
		if (owners == null || owners.length == 0) {
			logDebug("**WARN no owners on record " + capId);
			return false;
		}//len=0

		ownerEmail = owners[0].getEmail();
	} else {
		logDebug("**Failed to get owners on record " + capId + " Error: " + owners.getErrorMessage());
		return false;
	}
	var recordApplicant = getContactByType("Applicant", capId);
	if (recordApplicant) {
		applicantEmail = recordApplicant.getEmail();
	}

	if (ownerEmail == null || ownerEmail == "") {
		logDebug("**WARN Owner on record " + capId + " has no email");
		return false
	}

	var ownerName = getOnwertName();
	
    var capID4Email = aa.cap.createCapIDScriptModel(capId.getID1(),capId.getID2(),capId.getID3());
    var reportFile = [];
	
	var acaURL = lookup("ACA_CONFIGS", "ACA_SITE");
	acaURL = acaURL.substr(0, acaURL.toUpperCase().indexOf("/ADMIN"));
	
	var emailParams = aa.util.newHashtable();
	addParameter(emailParams, "$$ContactEmail$$", applicantEmail);
	addParameter(emailParams, "$$ContactFullName$$", ownerName);
	addParameter(emailParams, "$$acaDocDownloadUrl$$", acaURL);
            
    var sendResult = sendNotification("noreply@aurora.gov",ownerEmail,"",emailTemplateName,emailParams,reportFile,capID4Email);
    if (!sendResult) { logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }

	return true;
}
