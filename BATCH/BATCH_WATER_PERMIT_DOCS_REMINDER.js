var SCRIPT_VERSION = "3.0";
var BATCH_NAME = "";
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, true));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, true));
eval(getScriptText("INCLUDES_CUSTOM", null, true));
var currentUserID = "ADMIN";
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
logMessage = function (etype, edesc) {
    aa.print(etype + " : " + edesc);
}
logDebug = function (edesc) {
    if (showDebug) {
        aa.print("DEBUG : " + edesc);
    }
}
/*------------------------------------ USER PARAMETERS ---------------------------------------*/

/*------------------------------------ END OF USER PARAMETERS --------------------------------*/

var showDebug = true; // Set to true to see debug messages
var maxSeconds = 5 * 60; // number of seconds allowed for batch processing,
// usually < 5*60
var startDate = new Date();
var timeExpired = false;
var startTime = startDate.getTime(); // Start timer
var sysDate = aa.date.getCurrentDate();
var batchJobID = aa.batchJob.getJobID().getOutput();
var systemUserObj = aa.person.getUser("ADMIN").getOutput();
var servProvCode = aa.getServiceProviderCode();
var capId = null;

logMessage("START", "Start of Job");
if (!timeExpired) mainProcess();
logMessage("END", "End of Job: Elapsed Time : " + elapsed() + " Seconds");

function mainProcess() {

    var records = getRecords();
    logDebug("Processing " + records.length + " records");

    for (var r in records)
    {
        var altId = records[r]["B1_ALT_ID"] + "";
        var appStatus = records[r]["B1_APPL_STATUS"] + "";
        var statusDate = new Date(records[r]["APPDATE"]);
        var today = new Date().setHours(0,0,0,0);
        var datediff = dateDiff(statusDate, today);
        capId = aa.cap.getCapID(altId).getOutput();
        if (!capId) {logDebug(altId + ": Problem while getting capId, skipping"); continue;}
        if (datediff < 30) continue;
        if (datediff % 30 == 0)
        {
        	logDebug(altId + ": Has been in Waiting on Documents for " + datediff + " days. Sending reminder email...");
			var contacts = "Applicant,Responsible Water Billing Party";
			var emailtemplate = "JD_TEST_TEMPLATE";
			 //build ACA URL
			var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
			acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));  
			var recURL = acaSite + getACAUrl();

			var emailparams = aa.util.newHashtable();
			emailparams.put("$$altid$$", altId);
			emailparams.put("$$acaRecordURL$$", recURL);
			emailContacts(contacts, emailtemplate, emailparams, "", "", "N", "");	        	
        }
        

    }

}

function elapsed() {
    var thisDate = new Date();
    var thisTime = thisDate.getTime();
    return ((thisTime - startTime) / 1000)
}

function sendMail(from, to, cc, templateName, params, fileNames)
{
    // var fileNames = [];
    var result = aa.document.sendEmailByTemplateName(from, to, cc, templateName, params, fileNames);
    if(result.getSuccess())
    {
        aa.print("Send mail success.");
    }
    else
    {
        aa.print("Send mail fail.");
    }
}

 function getRecords()
 {
    var array = [];
    var sql = "SELECT B1_ALT_ID, B1_APPL_STATUS, TO_CHAR(B1_APPL_STATUS_DATE, 'MM/DD/YYYY') AS APPDATE FROM B1PERMIT WHERE B1_APPL_STATUS = 'Waiting on Documents' AND B1_PER_GROUP = 'Water' AND B1_PER_TYPE = 'Utility' AND B1_PER_SUB_TYPE = 'Permit' AND B1_PER_CATEGORY = 'NA' AND B1_APPL_CLASS = 'COMPLETE' AND SERV_PROV_CODE = 'AURORACO'";

    try {
        var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
        var ds = initialContext.lookup("java:/AA");
        var conn = ds.getConnection();
        var sStmt = conn.prepareStatement(sql);
        var rSet = sStmt.executeQuery();
       while (rSet.next()) {
            var obj = {};
            var md = rSet.getMetaData();
            var columns = md.getColumnCount();
            for (i = 1; i <= columns; i++) {
                obj[md.getColumnName(i)] = String(rSet.getString(md.getColumnName(i)));
            }
            obj.count = rSet.getRow();
            array.push(obj)
        }


        return array;
    } catch (err) {
        aa.print(err.message);
    }
    finally
    {
        if (rSet) rSet.close();
        if (sStmt) sStmt.close();
        if (conn) conn.close();
    }
 }