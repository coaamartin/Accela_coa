//RUN_PERMITS_CERT.js
function getScriptText(vScriptName){
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(),vScriptName,"ADMIN");
    return emseScript.getScriptText() + "";          
}

var SCRIPT_VERSION = 9
aa.env.setValue("CurrentUserID", "ADMIN");
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
eval(getScriptText("COMMON_RUN_REPORT_AND_NOTIFICATION"));
aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
wait(10000);
var capId = aa.env.getValue("CapId");
var module = aa.env.getValue("ServProvCode");
var appType1 = aa.env.getValue("AppType");
logDebug("Starting to kick off report logic");
aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
if ("Building/Permit/DonationBin/NA".equals(appTypeString)){
    var repName = "Don_Bin_Permit_script";
    reportParameters = aa.util.newHashMap(); 
    reportParameters.put("RecordID", capId.getCustomID());
    report = null;  
    report = generateReportFile(repName,reportParameters,module);
    aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
}
else if ("Building/Permit/TempUse/NA".equals(appTypeString)) {
    var repName = "Temp_Use_Permit_script";
    reportParameters = aa.util.newHashMap(); 
    reportParameters.put("RecordID", capId.getCustomID());
    report = null;  
    report = generateReportFile(repName,reportParameters,module);
    aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
}
else if ("Building/Permit/TempSigns/NA".equals(appTypeString)) {
    var repName = "Temp_Sign_Permit_script";
    reportParameters = aa.util.newHashMap(); 
    reportParameters.put("RecordID", capId.getCustomID());
    report = null;  
    report = generateReportFile(repName,reportParameters,module);
    aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
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

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}