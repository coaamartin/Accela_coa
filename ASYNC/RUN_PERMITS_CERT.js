//RUN_PERMITS_CERT.js
function getScriptText(vScriptName, servProvCode, useProductScripts) {
    if (!servProvCode)
        servProvCode = aa.getServiceProviderCode();
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        if (useProductScripts) {
            var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
        } else {
            var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
        }
        return emseScript.getScriptText() + "";
    } catch (err) {
        return "";
    }
}
var SCRIPT_VERSION = 3.0;
aa.env.setValue("CurrentUserID", "ADMIN");
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, true));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, true));
eval(getScriptText("INCLUDES_CUSTOM"));
eval(getScriptText("COMMON_RUN_REPORT_AND_NOTIFICATION"));
aa.print("Executing RUN_PERMITS_CERT");
logDebug("Executing RUN_PERMITS_CERT");

try {
//aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
wait(10000);
var capId = aa.env.getValue("CapId");
var repName = aa.env.getValue("RepName");
var module = aa.env.getValue("ServProvCode");
var appTypeString = aa.env.getValue("AppType");
logDebug("Starting to kick off report logic");
logDebug("Capid: " + capId);
logDebug("Report Name: " + repName);
logDebug("module: " + module);
logDebug("apptype: " + appTypeString);
aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
logDebug("Starting to kick off logic");
reportParameters = aa.util.newHashMap();
reportParameters.put("RecordID", capId);
logDebug("REPORT Parameters: " + reportParameters);
report = null;
report = generateReportFile(repName, reportParameters, module);
logDebug("End of Temp use async");
aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
}
catch(err){
    aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
}


function generateReportFile(aaReportName, parameters, rModule) {
    logDebug("Starting generateReportFile");
    var reportName = aaReportName;
    report = aa.reportManager.getReportInfoModelByName(reportName);
    report = report.getOutput();
    report.setModule(rModule);
    report.setCapId(capId);
    report.setReportParameters(parameters);
    //Added
    vAltId = capId;
    logDebug("vAltId = " + vAltId);
    //aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
    report.getEDMSEntityIdModel().setAltId(vAltId);
    var permit = aa.reportManager.hasPermission(reportName, "ADMIN");
    aa.print("---" + permit.getOutput().booleanValue());
    if (permit.getOutput().booleanValue()) {
        var reportResult = aa.reportManager.getReportResult(report);

        if (reportResult) {
            reportResult = reportResult.getOutput();
            var reportFile = aa.reportManager.storeReportToDisk(reportResult);
            logMessage("Report Result: " + reportResult);
            reportFile = reportFile.getOutput();
            return reportFile
        } else {
            logMessage("Unable to run report: " + reportName + " for Admin" + systemUserObj);
            return false;
        }
    } else {
        logMessage("No permission to report: " + reportName + " for Admin" + systemUserObj);
        return false;
    }
}

function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}