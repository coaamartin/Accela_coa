try{ 
if ((wfStatus == 'Accepted') && appMatch('PublicWorks/Public Improvement/Permit/*')) {
logDebug("Starting of 2063_PI_Email Notification Script");
var altID = capId.getCustomID()
appType = cap.getCapType().toString();
    var recordApplicants = getContactByType("Applicant", capId);
    for (var i in recordApplicants) {
        var recordApplicant = recordApplicants[i];
        //var firstName = recordApplicant.getFirstName();
        //var lastName = recordApplicant.getLastName();
        var emailTo = recordApplicant.getEmail();
        var capAlias = cap.getCapModel().getAppTypeAlias();
        var today = new Date();
        var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
        var tParms = aa.util.newHashtable();
        addParameter(tParms, "$$todayDate$$", thisDate);
        addParameter(tParms, "$$altid$$", recordID);
        addParameter(tParms, "$$capAlias$$", capAlias);
        //addParameter(tParms, "$$FirstName$$", firstName);
        //addParameter(tParms, "$$LastName$$", lastName);
        var rParams = aa.util.newHashtable();
        rParams.put("RecordID", altID);
        logDebug("rParams: " + rParams);
        var emailtemplate = "PI INITIAL ACCEPTANCE # 167";
        var report = generateReportFile("PI_Initial_Acceptance_Script", rParams, aa.getServiceProviderCode());
        sendNotification("noreply@auroragov.org", emailTo, "", emailtemplate, tParms, [report]);
    }
    if (showDebug) {
        email("acharlton@truepointsolutions.com", "acharlton@truepointsolutions.com", "DEBUG PI Acceptance Async for " + recordID, "Debug: " + debug);
    }
logDebug("End of 2063_PI_Email Notification Script");
}
} catch(e) {
	email("acharlton@truepointsolutions.com", "rprovinc@auroragov.org", "Error in 2063 WTUA Script", e.message);
}
