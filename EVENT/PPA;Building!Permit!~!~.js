logDebug("Starting PPA;Building!Permit!~!~.js ");
logDebug("Starting 5127_CityClerk_PRA.js");
//include("5127_CityClerk_PRA.js");
logDebug("Current balance: " + balanceDue);
logDebug("Starting DB approval email and updating statues");
//Check balance and update task
if (balanceDue == 0){
updateAppStatus("Approved","Status updated via script 5127_CityClerk_PRA.js");
//updateTask("Application Close", "Approved", "Updated via script 5127_CityClerk_PRA.js");
closeTask("Application Close","Approved","","");
closeAllTasks(capId, "");
include("5124_CityClerk_Approval");
logDebug("End of 5127_CityClerk_PRA script"); 
logDebug("---------------------> 5127_CityClerk_PRA.js ended.");
aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
//Start to generate the Certificate. This will attach to the record when ran.
logDebug("Starting to kick off event to attach cert to record");
    if ("Building/Permit/DonationBin/NA".equals(appTypeString)) {
        logDebug("Donation Bin app type. Starting to run report.");
        var reportName = "Don_Bin_Permit_script";
        var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
        var altID = capId.getCustomID();
        var rParams = aa.util.newHashtable();
        rParams.put("RecordID", altID);
        logDebug("Rparams for envent" + rParams);
        report = generateReportFile(reportName, rParams, 'Building');
        //sendNotification("noreply@auroragov.org", "noreply@auroragov.org", "", emailTemplate, tParams, null);
    }
    if ("Building/Permit/TempSigns/NA".equals(appTypeString)) {
        logDebug("Temp Sign app type. Starting to run report.");
        var reportName = "Temp_Sign_Permit_script";
        var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
        var altID = capId.getCustomID();
        var rParams = aa.util.newHashtable();
        rParams.put("RecordID", altID);
        logDebug("Rparams for envent" + rParams);
        report = generateReportFile(reportName, rParams, 'Building');
        //sendNotification("noreply@auroragov.org", "noreply@auroragov.org", "", emailTemplate, tParams, null);
    }
    if ("Building/Permit/TempUse/NA".equals(appTypeString)) {
        logDebug("Donation Bin app type. Starting to run report.");
        var reportName = "Temp_Use_Permit_script";
        var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
        var altID = capId.getCustomID();
        var rParams = aa.util.newHashtable();
        rParams.put("RecordID", altID);
        logDebug("Rparams for envent" + rParams);
        report = generateReportFile(reportName, rParams, 'Building');
        //sendNotification("noreply@auroragov.org", "noreply@auroragov.org", "", emailTemplate, tParams, null);
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
}

logDebug("End of PPA;CityClerk!Incident!~!~.js ");