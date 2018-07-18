/* SEND_INSPECTION_REPORT_TO_OWNER_ASYNC */
aa.print("Executing SEND_INSPECTION_REPORT_TO_OWNER_ASYNC");
logDebug("Executing SEND_INSPECTION_REPORT_TO_OWNER_ASYNC");
aa.sendMail("jal@byrnesoftware.com", "jal@byrnesoftware.com", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
//Get environmental variables pass into the script
var emailParameters = aa.env.getValue("emailParameters");
var capId = aa.env.getValue("CapId");
var emailTemplate = aa.env.getValue("emailTemplate");
var reportTemplate = aa.env.getValue("");
var vRParams = aa.env.getValue("vRParams");
var toEmail = aa.env.getValue("toEmail");
var ccEmail = aa.env.getValue("ccEmail");
//var  = aa.env.getValue("");

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

//Get the capId type needed for the email function
capId4Email = null;
capId4Email = aa.cap.createCapIDScriptModel(capId.getID1(), capId.getID2(), capId.getID3());

var reportFile = [];

//Get ACA Url
vACAUrl = lookup("ACA_CONFIGS", "ACA_SITE");
vACAUrl = vACAUrl.substr(0, vACAUrl.toUpperCase().indexOf("/ADMIN"));


var vReportName = generateReportForEmail(capId, reportTemplate, aa.getServiceProviderCode(), vRParams);

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
            getACADocDownloadParam4Notification(vEParams, vACAUrl, vDocumentModel);
            logDebug("including document url: " + vEParams.get('$$acaDocDownloadUrl$$'));
            aa.print("including document url: " + vEParams.get('$$acaDocDownloadUrl$$'));
            break;
        }
    }
}

logDebug("Email Sent: " + aa.document.sendEmailAndSaveAsDocument("noreply@aurora.gov", toEmail, ccEmail, emailTemplate, emailParameters, capId4Email, null).getSuccess());

//var sendResult = sendNotification("noreply@aurora.gov",toEmail,ccEmail,emailTemplate,emailParameters,reportFile,capID4Email);
//if (!sendResult) { logDebug("UNABLE TO SEND NOTICE!  ERROR: "+sendResult); }
aa.sendMail("jal@byrnesoftware.com", "jal@byrnesoftware.com", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);