function generateReportForASyncEmail(itemCap, reportName, module, parameters) {
    //returns the report file which can be attached to an email.
    var vAltId;
	var user = currentUserID;   // Setting the User Name
    var report = aa.reportManager.getReportInfoModelByName(reportName);
	var permit;
	var reportResult;
	var reportOutput;
	var vReportName;
    report = report.getOutput();
    report.setModule(module);
    report.setCapId(itemCap);
    report.setReportParameters(parameters);
	
	vAltId = itemCap.getCustomID();
	report.getEDMSEntityIdModel().setAltId(vAltId);
	
    permit = aa.reportManager.hasPermission(reportName, user);
    if (permit.getOutput().booleanValue()) {
        reportResult = aa.reportManager.getReportResult(report);
        if (!reportResult.getSuccess()) {
            logDebug("System failed get report: " + reportResult.getErrorType() + ":" + reportResult.getErrorMessage());
            return false;
        }
        else {
            reportOutput = reportResult.getOutput();
			vReportName = reportOutput.getName();
			logDebug("Report " + vReportName + " generated for record " + itemCap.getCustomID() + ". " + parameters);
            return vReportName;
        }
    }
    else {
        logDebug("Permissions are not set for report " + reportName + ".");
        return false;
    }
}