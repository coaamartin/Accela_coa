//RUN_DB_CERT
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
//wait(10000);
var capId = aa.env.getValue("CapId");

var module = "Building";
var repName = "Don_Bin_Permit_script";

reportParameters = aa.util.newHashMap(); 
reportParameters.put("RecordID", capId);
report = null;  
report = generateReportFile(repName,reportParameters,module);

function generateReportFile(aaReportName,parameters,rModule) 
{
var reportName = aaReportName;

report = aa.reportManager.getReportInfoModelByName(reportName);
report = report.getOutput();


report.setModule(rModule);
report.setCapId(capId);
report.setReportParameters(parameters);
//Added
vAltId = capId;
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

aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);








// function getScriptText(vScriptName) {
//   vScriptName = vScriptName.toUpperCase();
//   var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
//   var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
//   return emseScript.getScriptText() + "";
// }

// var SCRIPT_VERSION = 3.0
// aa.env.setValue("CurrentUserID", "ADMIN");
// eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
// eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
// eval(getScriptText("COMMON_RUN_REPORT_AND_NOTIFICATION"));

// wait(10000);
// var capId = aa.env.getValue("CapId");
// var appTypeString = aa.env.getValue("AppType");
// var module = aa.getServiceProviderCode();
// //var repName = null;
// //Start to generate the Certificate. This will attach to the record when ran.
// logDebug("Starting to kick off event to attach cert to record");
// logDebug("CapID:" + capId);
// logDebug("module:" + module);
// logDebug("AppType = " + appTypeString);
// if ("Building/Permit/DonationBin/NA".equals(appTypeString)) {
//   logDebug("Donation Bin app type. Starting to run report.");
//   var repName = "Don_Bin_Permit_script";
//   var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
//   reportParameters = aa.util.newHashMap(); 
//   reportParameters.put("RecordID", capId.getCustomID());
//   logDebug("Rparams for envent" + reportParameters);
//   report = null;
//   report = generateReportFile(repName, reportParameters, aa.getServiceProviderCode());
// }
// else if ("Building/Permit/TempSigns/NA".equals(appTypeString)) {
//   logDebug("Temp Sign app type. Starting to run report.");
//   var repName = "Temp_Sign_Permit_script";
//   var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
//   reportParameters = aa.util.newHashMap();
//   reportParameters.put("RecordID", capId.getCustomID());
//   logDebug("Rparams for envent" + reportParameters);
//   report = null;
//   report = generateReportFile(repName, reportParameters, aa.getServiceProviderCode());
// }
// else if ("Building/Permit/TempUse/NA".equals(appTypeString)) {
//   logDebug("Temp Use app type. Starting to run report.");
//   var repName = "Temp_Use_Permit_script";
//   var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
//   reportParameters = aa.util.newHashMap();
//   reportParameters.put("RecordID", capId.getCustomID());
//   logDebug("Rparams for envent" + reportParameters);
//   report = null;
//   report = generateReportFile(repName, reportParameters, aa.getServiceProviderCode());
// }
// aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);

// function generateReportFile(aaReportName, parameters, rModule) {
//   var reportName = aaReportName;

//   report = aa.reportManager.getReportInfoModelByName(reportName);
//   report = report.getOutput();


//   report.setModule(rModule);
//   report.setCapId(capId);
//   report.setReportParameters(parameters);
//   //Added
//   vAltId = capId.getCustomID();
//   report.getEDMSEntityIdModel().setAltId(vAltId);
//   var permit = aa.reportManager.hasPermission(reportName, "ADMIN");
//   aa.print("---" + permit.getOutput().booleanValue());
//   if (permit.getOutput().booleanValue()) {
//     var reportResult = aa.reportManager.getReportResult(report);

//     if (reportResult) {
//       reportResult = reportResult.getOutput();
//       var reportFile = aa.reportManager.storeReportToDisk(reportResult);
//       logMessage("Report Result: " + reportResult);
//       reportFile = reportFile.getOutput();
//       return reportFile
//     } else {
//       logMessage("Unable to run report: " + reportName + " for Admin" + systemUserObj);
//       return false;
//     }
//   } else {
//     logMessage("No permission to report: " + reportName + " for Admin" + systemUserObj);
//     return false;
//   }
// }
// aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
// function wait(ms) {
//   var start = new Date().getTime();
//   var end = start;
//   while (end < start + ms) {
//     end = new Date().getTime();
//   }
// }
// //aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);