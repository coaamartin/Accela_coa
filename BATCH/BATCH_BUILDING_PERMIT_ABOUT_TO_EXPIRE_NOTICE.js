/*------------------------------------------------------------------------------------------------------/
| Program       : BATCH_BUILDING_PERMIT_ABOUT_TO_EXPIRE_NOTICE.js
| Event         : 
|
| Usage         :Building/Permit : About to Expire Notice       
| Notes         :Record types does not have "Permit Expiration Date" Custom field
|               example: "Building/Permit/Master/NA","Building/Permit/Master/Amendment","Building/Permit/No Plans/Amendment"
|               *************************************************
|               excluded records with statues (Withdrawn,Expired,Complete,Unapproved) 
|               *************************************************
|               Temporary EmailTemplate is used "MESSAGE_NOTICE_LICENSE_EXPIRED" ,
|               this must be replaced with the correct template name , the correct params must be used instead of the existing in function sendEmailNotification
| Created by    : ISRAA
| Created at    : 30/01/2018 16:08:35
/------------------------------------------------------------------------------------------------------*/
var SCRIPT_VERSION = 3.0;
var useCustomScriptFile = true;  // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useCustomScriptFile));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, useCustomScriptFile));
eval(getScriptText("INCLUDES_CUSTOM", null, useCustomScriptFile));

function getScriptText(vScriptName, servProvCode, useProductScripts) {
    if (!servProvCode) servProvCode = aa.getServiceProviderCode();
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

var sysDate = aa.date.getCurrentDate();
// Global variables
var batchStartDate = new Date();
// System Date
var batchStartTime = batchStartDate.getTime();
var startTime = batchStartTime;
var batchJobName = "" + aa.env.getValue("BatchJobName"); // Name of the batch job

try{
    printDebug("Batch started on " + batchStartDate);
    var afterThirtyDays=dateAdd(null,30);
    useAppSpecificGroupName=false;
    //var capListResult = aa.cap.getByAppType("Building", "Permit", null,null);
    //var capListResult = aa.cap.getCapIDsByAppSpecificInfoField("Permit Expiration Date", afterThirtyDays);
    var expDate = aa.date.parseDate(dateAdd(null, 30));
    var expDateString = dateAdd(null, 30);
    //Process Records
    var capListResult = aa.cap.getCapIDsByAppSpecificInfoDateRange("PERMIT DATES", "Permit Expiration Date", expDate, expDate);
    printDebug("Processing records with 'PERMIT DATES.Permit Expiration Date' custom field = " + expDateString);
    var capList = capListResult.getOutput();
    var emailTemplate="BLD ABOUT TO EXPIRE #5";
    for (xx in capList) {
        var capId = capList[xx].getCapID();
        capId = aa.cap.getCapID(capId.getID1(), capId.getID2(), capId.getID3()).getOutput();
        var altId = capId.getCustomID();
        var cap = aa.cap.getCap(capId).getOutput();
        var appTypeString = cap.getCapType().toString();
        var appTypeAlias = cap.getCapType().getAlias();
        var capStatus = cap.getCapStatus();
        // if permit already expired or closed or rejected then no need to check the expiration date
        if( matches(capStatus, "Expired", "Withdrawn", "Complete", "Unapproved")) continue;
        
        printDebug("ALT ID is : "+ altId);
        var addressLine = "";
        var adResult = aa.address.getPrimaryAddressByCapID(capId,"Y");
        if (adResult.getSuccess())
            addressLine = adResult.getOutput().getAddressModel();
        
        var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
        acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
        var recordURL = getACARecordURL(acaURLDefault);
        
        var eParams = aa.util.newHashtable();
        addParameter(eParams, "$$altID$$", altId);
        addParameter(eParams, "$$todayDate$$", dateAdd(null, 0));
        addParameter(eParams, "$$capAlias$$", appTypeAlias);
        addParameter(eParams, "$$FullAddress$$", addressLine);
        addParameter(eParams, "$$acaRecordUrl$$", recordURL);
        
        sendEmailNotificationBatch(capId,emailTemplate, eParams, "Applicant");
        sendEmailNotificationBatch(capId,emailTemplate, eParams, "Contractor");
    }
    
    printDebug("Run Time     : " + elapsed());
    printDebug("Batch ended on " + new Date());
}
catch (err){
    printDebug("error : stopped batch processing BATCH_BUILDING_PERMIT_ABOUT_TO_EXPIRE_NOTICE" + err + ". Line number: " + err.lineNumber + ". Stack: " + err.stack);
}

function sendEmailNotificationBatch(itemCapId,emailTemplate, params, recipientType){
    var files = new Array();
    if(recipientType == "Applicant"){
        var recordApplicant = getContactByType("Applicant", itemCapId);
        var applicantEmail = null;
        if (!recordApplicant || recordApplicant.getEmail() == null || recordApplicant.getEmail() == "") {
                    printDebug("**WARN no applicant or applicant has no email, capId=" + itemCapId);
        } else {
            applicantEmail = recordApplicant.getEmail();
            var applicantName = recordApplicant.getFullName();
            
            addParameter(params, "$$ContactEmail$$", applicantEmail);
            addParameter(params, "$$ContactFullName$$", applicantName);
            //var sent = aa.document.sendEmailByTemplateName("", applicantEmail, "", emailTemplate, params, files);
			var sent = sendNotification("",applicantEmail,"",emailTemplate,params,files); 
            if (!sent) {
                printDebug("**WARN sending email applicant failed, error:" + sent.getErrorMessage());
                return false;
            }
        }//applicant OK
    }
    if(recipientType == "Contractor"){
        var contractorEmail = getPrimContractorEmail(itemCapId);
        var contractorName = getPrimContractorName(itemCapId);
        if(contractorEmail){
            addParameter(params, "$$ContactEmail$$", contractorEmail);
            addParameter(params, "$$ContactFullName$$", contractorName);
            var sent = aa.document.sendEmailByTemplateName("", contractorEmail, "", emailTemplate, params, files);
            if (!sent.getSuccess()) {
                printDebug("**WARN sending email to contractor failed, error:" + sent.getErrorMessage());
                return false;
            }
        }
        else return false;
    }
}

function elapsed() {
    var thisDate = new Date();
    var thisTime = thisDate.getTime();
    return ((thisTime - batchStartTime) / 1000)
}

function printDebug(dstr){
    aa.print(dstr + br);
}

function getPrimContractorEmail(itemCap){
    var licProfResult = aa.licenseScript.getLicenseProf(itemCap);
    if (!licProfResult.getSuccess()){
        logDebug("Error getting CAP's license professional: " +licProfResult.getErrorMessage());
        return false;
    }
    else{
        var licProfList = licProfResult.getOutput();
        if(licProfList && licProfList.length > 0) {
            for(each in licProfList){
                lp = licProfList[each];
                if(licProfList.length == 1){
                    return lp.getEmail();
                }
                if(lp.getPrintFlag() == "Y"){
                    return lp.getEmail();
                }
            }
        }
        return false;
    }
}



function getPrimContractorName(itemCap){
    var licProfResult = aa.licenseScript.getLicenseProf(itemCap);
    if (!licProfResult.getSuccess()){
        logDebug("Error getting CAP's license professional: " +licProfResult.getErrorMessage());
        return false;
    }
    else{
        var licProfList = licProfResult.getOutput();
        if(licProfList && licProfList.length > 0) {
            for(each in licProfList){
                lp = licProfList[each];
                if(licProfList.length == 1){
                    return lp.getBusinessName();
                }
                if(lp.getPrintFlag() == "Y"){
                    return lp.getBusinessName();
                }
            }
        }
        return false;
    }
}