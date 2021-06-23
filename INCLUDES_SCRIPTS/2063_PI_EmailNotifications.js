try{ 
if ((wfStatus == 'Accepted') && appMatch('PublicWorks/Public Improvement/Permit/*')) {
logDebug("Starting of 2063_PI_Email Notification Script");
var recordID = capId.getCustomID()
appType = cap.getCapType().toString();
    var recordApplicant = getContactByType("Applicant", capId);
    //for (var i in recordApplicants) {
        //var recordApplicant = recordApplicants[i];
		if (recordApplicant) {
			var firstName = recordApplicant.getFirstName();
			var lastName = recordApplicant.getLastName();
			var emailTo = recordApplicant.getEmail();
			var capAlias = cap.getCapModel().getAppTypeAlias();
			var today = new Date();
			var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
			var tParms = aa.util.newHashtable();
			addParameter(tParms, "$$todayDate$$", thisDate);
			addParameter(tParms, "$$altid$$", recordID);
			addParameter(tParms, "$$capAlias$$", capAlias);
			addParameter(tParms, "$$FirstName$$", firstName);
			addParameter(tParms, "$$LastName$$", lastName);
			var rParams = aa.util.newHashtable();
			rParams.put("RecordID", recordID);
			logDebug("rParams: " + rParams);
			var emailtemplate = "PI INITIAL ACCEPTANCE # 167";
			var report = generateReportFile("PI_Initial_Acceptance_Script", rParams, aa.getServiceProviderCode());
			sendNotification("noreply@auroragov.org", emailTo, "", emailtemplate, tParms, [report]);
		}	
    if (showDebug) {
        email("acharlton@truepointsolutions.com", "acharlton@truepointsolutions.com", "DEBUG PI Acceptance Async for " +recordID, e.message + " in Line " + e.lineNumber + br + "Stack: " + e.stack + br + "Debug: " + debug);
    }
logDebug("End of 2063_PI_Email Notification Script");
}
} catch(e) {
	email("acharlton@truepointsolutions.com", "rprovinc@auroragov.org", "Error in 2063 WTUA Script" +recordID, e.message + " in Line " + e.lineNumber + br + "Stack: " + e.stack + br + "Debug: " + debug);
}

function generateReportFile(aaReportName,parameters,rModule) 
{
    var reportName = aaReportName;

    report = aa.reportManager.getReportInfoModelByName(reportName);
    report = report.getOutput();


    report.setModule(rModule);
    report.setCapId(capId);
    report.setReportParameters(parameters);
    //Added
    vAltId = capId.getCustomID();
    report.getEDMSEntityIdModel().setAltId(vAltId);
    var permit = aa.reportManager.hasPermission(reportName,"ADMIN");
    aa.print("---"+permit.getOutput().booleanValue());
    if(permit.getOutput().booleanValue()) 
    {
        var reportResult = aa.reportManager.getReportResult(report);

        if(reportResult) 
        {
            reportResult = reportResult.getOutput();
            var reportFile = aa.reportManager.storeReportToDisk(reportResult);
            logMessage("Report Result: "+ reportResult);
            reportFile = reportFile.getOutput();
            return reportFile
        } else 
        {
            logMessage("Unable to run report: "+ reportName + " for Admin" + systemUserObj);
            return false;
        }
    } else 
    {
        logMessage("No permission to report: "+ reportName + " for Admin" + systemUserObj);
        return false; 
    }
}
