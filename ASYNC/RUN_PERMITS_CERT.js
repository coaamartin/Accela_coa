SCRIPT_VERSION = 3.0;
var useSA = false;
var SA = null;
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_FOR_EMSE");
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") {
	useSA = true;
	SA = bzr.getOutput().getDescription();
	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_INCLUDE_SCRIPT");
	if (bzr.getSuccess()) {
		SAScript = bzr.getOutput().getDescription();
	}
}

if (SA) {
	eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS", SA));
	eval(getMasterScriptText(SAScript, SA));
} else {
	eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS"));
}

eval(getScriptText("INCLUDES_BATCH"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
eval(getMasterScriptText("INCLUDES_CUSTOM"));
/*------------------------------------------------------------------------------------------------------/
| <===========internal functions - do not modify ================>
/-----------------------------------------------------------------------------------------------------*/
function getMasterScriptText(vScriptName) {
	var servProvCode = aa.getServiceProviderCode();
	if (arguments.length > 1)
		servProvCode = arguments[1]; // use different serv prov code
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}

function getScriptText(vScriptName) {
	var servProvCode = aa.getServiceProviderCode();
	if (arguments.length > 1)
		servProvCode = arguments[1]; // use different serv prov code
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var emseScript = emseBiz.getScriptByPK(servProvCode, vScriptName, "ADMIN");
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}
wait(10000);
try {
var capId = aa.env.getValue("CapId");
//var appTypeString = aa.env.getValue("AppType");
var module = "Building";

//Start to generate the Certificate. This will attach to the record when ran.
logDebug("Starting to kick off event to attach cert to record");
//logDebug("altId = " + altId);
//logDebug("AppType = " + appTypeString);
if ("Building/Permit/DonationBin/NA".equals(appTypeString)) {
  logDebug("Donation Bin app type. Starting to run report.");
  var repName = "Don_Bin_Permit_script";
  //var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
  reportParameters = aa.util.newHashMap(); 
  reportParameters.put("RecordID", capId.getCustomID());
  logDebug("Rparams for envent" + reportParameters);
  report = null;
  report = generateReportFile(repName, reportParameters, module);
}
if ("Building/Permit/TempSigns/NA".equals(appTypeString)) {
  logDebug("Temp Sign app type. Starting to run report.");
  var repName = "Temp_Sign_Permit_script";
  var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
  reportParameters = aa.util.newHashMap();
  reportParameters.put("RecordID", capId.getCustomID());
  logDebug("Rparams for envent" + reportParameters);
  report = null;
  report = generateReportFile(repName, reportParameters, module);
}
if ("Building/Permit/TempUse/NA".equals(appTypeString)) {
  logDebug("Temp Use app type. Starting to run report.");
  var repName = "Temp_Use_Permit_script";
  var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
  reportParameters = aa.util.newHashMap();
  reportParameters.put("RecordID", capId.getCustomID());
  logDebug("Rparams for envent" + reportParameters);
  report = null;
  report = generateReportFile(repName, reportParameters, module);
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
aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
}
catch (err) {
  return "";
}