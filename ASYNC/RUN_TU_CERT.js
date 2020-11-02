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
wait(10000);

var capID = aa.env.getValue("CapId");
var module = aa.env.getValue("ServProvCode");
//var module = "Permits";
var repName = "Temp_Use_Permit_script";
logDebug("CapId: " + capID);
logDebug("module: " + module);
logDebug("repName: " + repName);
reportParameters = aa.util.newHashMap(); 
reportParameters.put("RecordID", capID);
logDebug("Report Parameters: " + reportParameters);
report = null;  
report = generateReportFile(repName,reportParameters,module);
aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
function generateReportFile(aaReportName,parameters,rModule) 
{
var reportName = aaReportName;

report = aa.reportManager.getReportInfoModelByName(reportName);
report = report.getOutput();


report.setModule(rModule);
report.setCapId(capID);
report.setReportParameters(parameters);
//Added
vAltId = capID;
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
