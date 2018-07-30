/* SEND_EMAIL_WITH_LAST_INVOICE_ASYNC */
/* Scripts takes the following env parameters:
 *  emailParameters
 *  CapId
 *  emailTemplate
 *  reportTemplate
 *  vRParams
 *  toEmail
 *  ccEmail */
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
eval(getScriptText("INCLUDES_CUSTOM", null, true));
aa.print("Executing SEND_EMAIL_WITH_LAST_INVOICE_ASYNC");
logDebug("Executing SEND_EMAIL_WITH_LAST_INVOICE_ASYNC");
//Get environmental variables pass into the script
var emailParameters = aa.env.getValue("emailParameters");
var capId = aa.env.getValue("CapId");
var emailTemplate = aa.env.getValue("emailTemplate");
//var reportTemplate = aa.env.getValue("reportTemplate");
//var vRParams = aa.env.getValue("vRParams");
var toEmail = aa.env.getValue("toEmail");
var ccEmail = aa.env.getValue("ccEmail");

try{
    //Get the capId type needed for the email function
    var capId4Email = null;
    capId4Email = aa.cap.createCapIDScriptModel(capId.getID1(), capId.getID2(), capId.getID3());
    
    var reportFile = [];
    
    //Get ACA Url
    vACAUrl = lookup("ACA_CONFIGS", "ACA_SITE");
    vACAUrl = vACAUrl.substr(0, vACAUrl.toUpperCase().indexOf("/ADMIN"));
    
    
    var vReportName = generateLastInvoiceReportForEmail4thisScript();
    
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
                logDebug("including document url: " + emailParameters.get('$$acaDocDownloadUrl$$'));
                aa.print("including document url: " + emailParameters.get('$$acaDocDownloadUrl$$'));
                break;
            }
        }
    }
    
    var recordURL = getACARecordURL(vACAUrl);
    if(!vDocumentList) addParameter(emailParameters, "$$acaRecordUrl$$", recordURL);
    else addParameter(emailParameters, "$$acaRecordUrl$$", emailParameters.get("$$acaDocDownloadUrl$$"));
    
    logDebug("Email Sent: " + aa.document.sendEmailAndSaveAsDocument("noreply@aurora.gov", toEmail, ccEmail, emailTemplate, emailParameters, capId4Email, null).getSuccess());
    
    //var sendResult = sendNotification("noreply@aurora.gov",toEmail,ccEmail,emailTemplate,emailParameters,reportFile,capID4Email);
    //if (!sendResult) { logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
}
catch(err){
    showMessage = true;
    comment("Error on custom async script SEND_EMAIL_WITH_LAST_INVOICE_ASYNC. Please contact administrator. Err: " + err + ". Line: " + err.lineNumber);
    logDebug("Error on custom function SEND_EMAIL_WITH_LAST_INVOICE_ASYNC. Please contact administrator. Err: " + err + ". Line: " + err.lineNumber + ". Stack: " + err.stack);
    aa.sendMail("jal@byrnesoftware.com", "jal@byrnesoftware.com", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
}
aa.sendMail("jal@byrnesoftware.com", "jal@byrnesoftware.com", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
function generateLastInvoiceReportForEmail4thisScript() {
    //returns the report file which can be attached to an email.
    //returns the report file which can be attached to an email.
    var user = currentUserID;   // Setting the User Name
    var reportResult = aa.reportManager.getReportInfoModelByName("Invoice Report");
    logDebug("report: " + reportResult);
    lastInvoice = getLastInvoice({});
    if(lastInvoice) var invoiceNbr = lastInvoice.invNbr;
    else { logDebug("WARNING: There are no invoices to send."); return false; }
    var reportParams = aa.util.newHashtable();
    addParameter(reportParams, "AGENCYID", "AURORACO");
    addParameter(reportParams, "INVOICEID", invoiceNbr.toString());
    
    report = reportResult.getOutput();
    report.setModule("PublicWorks");
    report.setCapId(capId.getID1() + "-" + capId.getID2() + "-" + capId.getID3());
    report.setReportParameters(reportParams);
    report.getEDMSEntityIdModel().setAltId(capId.getCustomID());

    var permit = aa.reportManager.hasPermission("Invoice Report",user);
    if (permit.getOutput().booleanValue()) {
    var reportResult = aa.reportManager.getReportResult(report);
    if(reportResult.getSuccess()) {
        logDebug("report result = " + reportResult);
        reportOutput = reportResult.getOutput();
        var reportFile=aa.reportManager.storeReportToDisk(reportOutput);
        reportFile=reportFile.getOutput();
        var reportName = reportOutput.getName();
        logDebug("report File = " + reportFile);
        logDebug("report Name = " + reportName);
        printObject(reportName);
        return reportName;
    }  
    else {
        logDebug("System failed get report: " + reportResult.getErrorType() + ":" +reportResult.getErrorMessage());
        return false;
    }
    } else {
        logDebug("You have no permission.");
        return false;
    }
}