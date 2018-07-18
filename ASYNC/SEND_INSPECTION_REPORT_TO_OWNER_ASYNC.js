/* SEND_INSPECTION_REPORT_TO_OWNER_ASYNC */
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
aa.print("Executing SEND_INSPECTION_REPORT_TO_OWNER_ASYNC");
logDebug("Executing SEND_INSPECTION_REPORT_TO_OWNER_ASYNC");
//Get environmental variables pass into the script
var emailParameters = aa.env.getValue("emailParameters");
var capId = aa.env.getValue("CapId");
var emailTemplate = aa.env.getValue("emailTemplate");
var reportTemplate = aa.env.getValue("reportTemplate");
var vRParams = aa.env.getValue("vRParams");
var toEmail = aa.env.getValue("toEmail");
var ccEmail = aa.env.getValue("ccEmail");
//var  = aa.env.getValue("");

try{
    //Get the capId type needed for the email function
    capId4Email = null;
    capId4Email = aa.cap.createCapIDScriptModel(capId.getID1(), capId.getID2(), capId.getID3());
    
    var reportFile = [];
    
    //Get ACA Url
    vACAUrl = lookup("ACA_CONFIGS", "ACA_SITE");
    vACAUrl = vACAUrl.substr(0, vACAUrl.toUpperCase().indexOf("/ADMIN"));
    
    
    var vReportName = generateReportForEmail4thisScript(capId, reportTemplate, aa.getServiceProviderCode(), vRParams);
    
    //Get document deep link URL
    if (vReportName != null && vReportName != false) {
        vDocumentList = aa.document.getDocumentListByEntity(capId, "CAP");
        if (vDocumentList != null) {
            vDocumentList = vDocumentList.getOutput();
        }
    }
    
    if (vDocumentList != null) {
        for (y = 0; y < vDocumentList.size(); y++) {
            vDocumentModel = vDocumentList.get(y);
            vDocumentName = vDocumentModel.getFileName();
            if (vDocumentName == vReportName) {
                //Add the document url to the email paramaters using the name: $$acaDocDownloadUrl$$
                getACADocDownloadParam4Notification(emailParameters, vACAUrl, vDocumentModel);
                logDebug("including document url: " + vEParams.get('$$acaDocDownloadUrl$$'));
                aa.print("including document url: " + vEParams.get('$$acaDocDownloadUrl$$'));
                break;
            }
        }
    }
    
    logDebug("Email Sent: " + aa.document.sendEmailAndSaveAsDocument("noreply@aurora.gov", toEmail, ccEmail, emailTemplate, emailParameters, capId4Email, null).getSuccess());
    
    var sendResult = sendNotification("noreply@aurora.gov",toEmail,ccEmail,emailTemplate,emailParameters,reportFile,capID4Email);
    if (!sendResult) { logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
    aa.sendMail("jal@byrnesoftware.com", "jal@byrnesoftware.com", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
}
catch(err){
	showMessage = true;
    comment("Error on custom function (). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
    logDebug("Error on custom function (). Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
	aa.sendMail("jal@byrnesoftware.com", "jal@byrnesoftware.com", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
}

function generateReportForEmail4thisScript(itemCap, reportName, module, parameters) {
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