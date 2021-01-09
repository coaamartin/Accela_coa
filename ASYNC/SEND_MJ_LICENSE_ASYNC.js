//SEND_MJ_LICENSE_ASYNC
var SCRIPT_VERSION = 9.0;

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
eval(getScriptText("INCLUDES_CUSTOM", null, true));

function getScriptText(vScriptName){
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(),vScriptName,"ADMIN");
    return emseScript.getScriptText() + "";
}
var currentUserID = "ADMIN"
var systemUserObj = aa.person.getUser(currentUserID).getOutput();
/*------------------------------------------------------------------------------------------------------/
| Execute Script Controls
/------------------------------------------------------------------------------------------------------*/

var recordID = aa.env.getValue("CapId");
//var recordID = "20-000092-MSL";
var capId = aa.cap.getCapID(recordID).getOutput();
aa.print(capId);

var asiValues = new Array();
loadAppSpecific(asiValues);

try
{
    var adResult = aa.address.getAddressByCapId(capId).getOutput();
    for(x in adResult)
    {
        var adType = adResult[x].getAddressType();
        var stNum = adResult[x].getHouseNumberStart();
        var preDir =adResult[x].getStreetDirection();
        var stName = adResult[x].getStreetName();
        var stType = adResult[x].getStreetSuffix();
        var city = adResult[x].getCity();
        var state = adResult[x].getState();
        var zip = adResult[x].getZip();
    }

    var primaryAddress = stNum + " " + preDir + " " + stName + " " + stType + " " + "," + city + " " + state + " " + zip;
    var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
    acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));


    var recordDeepUrl = acaURLDefault; //getACARecordURL(acaURLDefault);

    var tradeName = getAppName(capId);

    var cap = aa.cap.getCap(capId).getOutput();
    var appTypeAlias = cap.getCapType().getAlias();

    //var wfComment = "AAA";
    var vEmailTemplate = "LIC MJ APPROVAL OF LICENSE #226 - 230";
    var vReportTemplate = "MJ_License";
    var vEParams = aa.util.newHashtable();
    addParameter(vEParams, "$$ApplicationName$$", appTypeAlias);
    addParameter(vEParams, "$$recordAlias$$", appTypeAlias);
    addParameter(vEParams, "$$capAlias$$", appTypeAlias);
    //addParameter(vEParams, "$$wfComment$$", wfComment);
    addParameter(vEParams, "$$StateLicenseNumber$$", asiValues["State License Number"]);
    addParameter(vEParams, "$$TradeName$$", tradeName);
    //addParameter(vEParams, "$$TradeName$$", asiValues["Trade Name"]);
    addParameter(vEParams, "$$FullAddress$$", primaryAddress);
    addParameter(vEParams, "$$acaRecordUrl$$", recordDeepUrl);
    addParameter(vEParams, "$$altID$$", capId.getCustomID());

    var vRParams = aa.util.newHashtable();
    addParameter(vRParams, "Record_ID", capId.getCustomID());

    var emails = _getContactEmailNoDupEmail(capId,"Applicant");
    aa.print(emails);
    var emails2 = _getContactEmailNoDupEmail(capId,"Responsible Party");
    var allEmails = arrayUnique(emails.concat(emails2));
    allEmails = allEmails.join(";");

    logDebug("Email send to: " + allEmails)
    var reportFiles = new Array();
    var report = _generateReportFile(vReportTemplate, vRParams, aa.getServiceProviderCode(), capId);
    reportFiles.push(report);
    _sendNotification("noreply@auroragov.org", allEmails, "", vEmailTemplate, vEParams, reportFiles, capId);

    aa.sendMail("suhailwakil@gmail.com", "suhailwakil@gmail.com", "", "Log", "Debug: " + debug);

}
catch (err)
{
    aa.sendMail("suhailwakil@gmail.com", "suhailwakil@gmail.com", "", "Log", "Debug: " + err);
}

////FUNCTIONS//////


function _getContactEmailNoDupEmail(vcapId, vconType){
    var thisItem = arguments[0];
    var searchConType = arguments[1];
    var conEmailArray = [];
    var vConObjArry;
    if(searchConType.toUpperCase()=="ALL"){
        vConObjArry = getContactObjsByCap(thisItem);
    }else{
        vConObjArry = getContactObjsByCap(thisItem,searchConType);
    }
    //return valid email addressses and only one address for multiple contacts with same email
    for(eachCont in vConObjArry){
        var vConObj = vConObjArry[eachCont];
        //Get contact email
        if (vConObj) {
            var conEmail = vConObj.people.getEmail();
            var conType = vConObj.people.getContactType();
            if (conEmail && conEmail != null && conEmail != "" && conEmail.indexOf("@") > 0) {
                if(!exists(conEmail,conEmailArray) ){
                    conEmailArray.push(conEmail);
                    logDebug("Returning email for :" + conType )
                    logDebug('Email: ' + conEmail)

                }

            }
        }
    }
    return conEmailArray;

}

function _generateReportFile(aaReportName,parameters,rModule)
{
    var itemCap = capId;
    if (arguments.length > 3)
        itemCap = arguments[3];

    logDebug("_generateReportFile : "+itemCap.getCustomID() +" parms: "+parameters);
    var reportName = aaReportName;
    report = aa.reportManager.getReportInfoModelByName(reportName);
    report = report.getOutput();


    report.setModule(rModule);
    report.setCapId(itemCap);
    report.setReportParameters(parameters);
    //Added
    vAltId = itemCap.getCustomID();
    report.getEDMSEntityIdModel().setAltId(vAltId);
    var permit = aa.reportManager.hasPermission(reportName,"ADMIN");
    logDebug("Report successfully ran: "+permit.getOutput().booleanValue());
    if(permit.getOutput().booleanValue())
    {
        var reportResult = aa.reportManager.getReportResult(report);

        if(reportResult)
        {
            reportResult = reportResult.getOutput();
            var reportFile = aa.reportManager.storeReportToDisk(reportResult);
            //logDebug("Report Result: "+ reportResult);
            reportFile = reportFile.getOutput();
            logDebug("Report Result: "+ reportFile);
            return reportFile
        } else
        {
            logDebug("Unable to run report: "+ reportName + " for Admin" + systemUserObj);
            return false;
        }
    } else
    {
        logDebug("No permission to report: "+ reportName + " for Admin" + systemUserObj);
        return false;
    }
}

function _sendNotification(emailFrom,emailTo,emailCC,templateName,params,reportFile)
{
    var itemCap = capId;
    if (arguments.length > 6)
        itemCap = arguments[6];

    logDebug("_sendNotification1 : "+itemCap.getCustomID());

    var capIDScriptModel = aa.cap.createCapIDScriptModel(itemCap.getID1(), itemCap.getID2(), itemCap.getID3());
    var result = null;
    result = aa.document.sendEmailAndSaveAsDocument(emailFrom, emailTo, emailCC, templateName, params, capIDScriptModel, reportFile);
    if(result.getSuccess())
    {
        logDebug("Sent email successfully!");
        return true;
    }
    else
    {
        logDebug("Sent email unsuccessfully!");
        return false;

    }
}

function arrayUnique(array) {
    var tmp = [];
    var result = [];

    if (array !== undefined /* any additional error checking */ ) {
        for (var i = 0; i < array.length; i++) {
            var val = array[i];

            if (tmp[val] === undefined) {
                tmp[val] = true;
                result.push(val);
            }

        }
    }

    return result;
}