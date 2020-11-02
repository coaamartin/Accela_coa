function getScriptText(vScriptName){
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(),vScriptName,"ADMIN");
    return emseScript.getScriptText() + "";          
  }
  
  var SCRIPT_VERSION = 3.0
  aa.env.setValue("CurrentUserID", "ADMIN");
  eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
  eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
  eval(getScriptText("COMMON_RUN_REPORT_AND_NOTIFICATION"));

if ("Building/Permit/DonationBin/NA".equals(appTypeString)) {
    //Start to generate the Certificate. This will attach to the record when ran.
    logDebug("Starting to kick off event to attach cert to record");
    var altID = capId.getCustomID();
    var appType = cap.getCapType().toString();
    var vAsyncScript = "RUN_DB_CERT";
    var envParameters = aa.util.newHashMap();
    envParameters.put("CapId", altID);
    envParameters.put("AppType", appType)
    logDebug("Starting to kick off ASYNC event for DB. Params being passed: " + envParameters);
    aa.runAsyncScript(vAsyncScript, envParameters);
    include("5124_CityClerk_Approval");
} else if ("Building/Permit/TempSigns/NA".equals(appTypeString)) {
    updateAppStatus("Approved", "Status updated via script 5127_CityClerk_PRA.js");
    closeTask("Application Close", "Approved", "", "");
    closeAllTasks(capId, "");
    //include("5124_CityClerk_Approval");
    //aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
    //Start to generate the Certificate. This will attach to the record when ran.
    logDebug("Starting to kick off event to attach cert to record");
    var altID = capId.getCustomID();
    var appType = cap.getCapType().toString();
    var vAsyncScript = "RUN_TS_CERT";
    var envParameters = aa.util.newHashMap();
    envParameters.put("CapId", altID);
    envParameters.put("AppType", appType)
    logDebug("Starting to kick off ASYNC eventfor TS. Params being passed: " + envParameters);
    aa.runAsyncScript(vAsyncScript, envParameters);
    include("5124_CityClerk_Approval");
} else if ("Building/Permit/TempUse/NA".equals(appTypeString)) {
    //wait(10000);
    //Start to generate the Certificate. This will attach to the record when ran.
    logDebug("Starting to kick off event to attach cert to record");
    var capID = capId.getCustomID();
    var appType = cap.getCapType().toString();
    var serProvCode = aa.getServiceProviderCode();
    var vAsyncScript = "RUN_TU_CERT";
    // var envParameters = aa.util.newHashMap();
    // envParameters.put("CapId", altID);
    // envParameters.put("AppType", appType);
    // envParameters.put("ServProvCode", serProvCode);
    //logDebug("Starting to kick off ASYNC eventfor Temp Use. Params being passed: " + envParameters);
    //aa.runAsyncScript(vAsyncScript, envParameters);
    var module = "Building";
    var repName = "Temp_Use_Permit_script";
    reportParameters = aa.util.newHashMap(); 
    reportParameters.put("RecordID", capID);
    logDebug("Report Parameters: " + reportParameters);
    report = null;
    report = generateReportFile(repName, reportParameters, module);
    //aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
}



function generateReportFile(aaReportName, parameters, rModule) {
    var reportName = aaReportName;

    report = aa.reportManager.getReportInfoModelByName(reportName);
    report = report.getOutput();


    report.setModule(rModule);
    report.setCapId(capID);
    report.setReportParameters(parameters);
    //Added
    vAltId = capID;
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
function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
   }