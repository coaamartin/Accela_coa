/*==========================================================================================
Title : STDBASE_SEND_CONTACT_EMAILS

Purpose : Sends Email Template to necessary Contact Types with available parameters

Author: David Bischof / Jason Plaisted

Functional Area : General

Description : JSON must contain :
    "Module/Type/Subtype/Category" = 4 level record structure parent
        "Rule set" - SubParent.  Event name plus rules.  Currently supports only wftTask/wfStatus or inspType/inspResult. example: "WorflowTaskUpdateAfter/wfTask/wfStatus" 
            "notificationTemplate" = name of emanil template to be used
            "notificationReport" = name of reports to be sent with notification, Array ["val1","val2"]
            ""
            "notifyContactTypes" = contact types to be sent the notification, Array ["val1","val2"]. May include "ALL" and "Primary" but as the only element
            "url4ACA" = include the URL for ACA 
            "fromEmail" = who to send from (must have proper permissions)
            "additionalEmailsTo" = /optional/ additional Email Recipients, Array ["val1","val2"] email addresses
                Sample: "additionalEmailsTo":["email1@host.com","email2@host.com"]
            "customFields"= /optional/ key-value pairs, (asiFieldName,asiRequiredValue) allows multiple (matched with AND)
                Sample: "customFields":{"asiField1":"asiVal1","asiField2":"asiVal2"}
            "createFromParent" = /optional/ (true/false) creates the notification from the parent License Record for example
            "reportingInfoStandards" = /optional/ Defualts to "Reporting Information Standards" Standard Choice for varibles such as Agency Name
            "balanceAllowed": /optional/ if set to false and Balance equal zero feesContactTypes will recieve an email.
            
- Department information parameters can be added to email parameters, current user's department is used.
1. a standard choice with name 'DEPARTMENT_INFORMATION' should be added
2. a row per department should be added in DEPARTMENT_INFORMATION
3. row Value should be department name
4. row Desc contains all parameters: $$paramName1$$:paramValue1|$$paramName2$$:paramValue2|...

Sample JSON :
{
  "Marijuana/Enforcement/Complaint/NA": {
    "ApplicationSpecificInfoUpdateAfter": [
      {
        "metadata": {
          "description": "Sends Email Template to necessary Contact Types with available parameters",
          "operators": {
            
          }
        },
        "preScript": "",
        "criteria": {
          "customFields": {
            "Notify Complaintant": "Yes"
          }
        },
        "action": {
          "notificationTemplate": "MESSAGE_NOTICE_PUBLIC WORKS",
          "notificationReport": [],
          "reportParamContactType":"Applicant",
          "notifyContactTypes": [
            "Applicant"
          ],
          "additionalEmailsTo": [
            "email1@hostAbc.com"

          ],
          "notifyLPTypes":["ALL"],
          "url4ACA": "",
          "fromEmail": "",
          "createFromParent": false,
          "reportingInfoStandards": "",
          "balanceAllowed": false,
          
        },
        "postScript": ""
      }
    ]
  }
}
    For testing, a sample JSON object is embedded in the function.  Wild cards are accepted in all 4 levels.
    
    Included Report Params are:
    altID
    inspID (inspection events only)
    
    Included email Parameters are:
    Contacts:
    $$ContactLastName$$
    $$ContactFirstName$$
    $$ContactMiddleName$$
    $$ContactFullName$$
    $$ContactBusinesName$$
    $$ContactContactSeqNumber$$
    $$ContactType$$
    $$ContactRelation$$
    $$ContactPhone1$$
    $$ContactPhone2$$
    $$ContactEmail$$
    $$ContactAddressLine1$$
    $$ContactAddressLine2$$
    $$ContactCity$$
    $$ContactState$$
    $$ContactZip$$
    $$ContactFax$$
    $$ContactNotes$$
    $$ContactCountry$$

    
    Record:
    $$altID$$
    $$recordAlias$$
    $$recordStatus$$
    $$balance$$
    $$fileDate$$
    $$workDesc$$
    $$acaRecordUrl$$
    $$acaPaymentUrl$$
    $$recordName$$
    $$FullAddress$$


    Inspection Schedule:
    $$inspId$$  (inspection schedule events only)
    $$inspInspector$$    (inspection schedule events only)
    $$inspGroup$$   (inspection schedule events only)
    $$inspType$$    (inspection schedule events only)
    $$inspSchedDate$$    (inspection schedule events only)
    $$InspectorName$$    (inspection schedule events only)

    Inspection Result:
    $$inspId$$  (inspection result events only)
    $$inspInspector$$   (inspection result events only)
    $$inspResult$$   (inspection result events only)
    $$inspComment$$   (inspection result events only)
    $$inspResultDate$$   (inspection result events only)
    $$inspGroup$$   (inspection result events only)
    $$inspType$$    (inspection result events only)
    $$inspSchedDate$$    (inspection events only)
    
    Workflow:
    $$wfTask$$    (workflow events only)
    $$wfStatus$$    (workflow events only)
    $$wfDate$$    (workflow events only)
    $$wfComment$$    (workflow events only)
    $$wfStaffUserID$$    (workflow events only)
    $$wfActionByUserID$$    (workflow events only)
    $$wfHours$$    (workflow events only)



Reviewed By: 

Script Type : (EMSE, EB, Pageflow, Batch): EMSE

General Purpose/Client Specific : General

Client developed for : 

Parameters:
                parameters - pass in aa.util.newHashtable(); for additional parameters. 
                            (example: myNewParams = aa.util.hashTable(); 
                                      addParameter(myNewParams, $$expirationDate$$, expirationDate);
                                      send to function:  sendContactEmails(myNewParams);
                             or, pass "null" if none:    sendContactEmails(null);
                itemCap - optional capId
================================================================================================================*/
var scriptSuffix = "SEND_CONTACT_EMAILS";
// CONF_{SOLUTION}_SEND_CONTACT_EMAILS
// {SOLUTION} = AS DEFINED IN THE "SOLUTION MAPPING" STANDARD CHOICE

var agencyReplyEmailDefault = lookup("ACA_EMAIL_TO_AND_FROM_SETTING", "RENEW_LICENSE_AUTO_ISSUANCE_MAILFROM");
var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));

try {
    // This should be included in all Configurable Scripts
    eval(getScriptText("CONFIGURABLE_SCRIPTS_COMMON"));
    var settingsArray = [];
    if (isConfigurableScript(settingsArray, scriptSuffix)) {

        for (s in settingsArray) {

            var rules = settingsArray[s];

            //Execute PreScript
            if (!isEmptyOrNull(rules.preScript)) {
                eval(getScriptText(rules.preScript));
            }

            if (cancelCfgExecution) {
                logDebug("**WARN STDBASE Script [" + scriptSuffix + "] canceled by cancelCfgExecution");
                cancelCfgExecution = false;
                continue;
            }

            sendContactEmails(capId, rules);

            //Execute Post Script
            if (!isEmptyOrNull(rules.postScript)) {
                eval(getScriptText(rules.postScript));
            }
        }
    }

} catch (ex) {
    logDebug("**ERROR: Exception while verification the rules for " + scriptSuffix + ". Error: " + ex);
}

function getRecordAssignedStaffEmail(){
    var cdScriptObjResult = aa.cap.getCapDetail(capId);
    if (!cdScriptObjResult.getSuccess()) {
        logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage());
        return ""
    }
    var cdScriptObj = cdScriptObjResult.getOutput();
    if (!cdScriptObj) {
        logDebug("**ERROR: No cap detail script object");
        return ""
    }
    var cd = cdScriptObj.getCapDetailModel();
    var userId=cd.getAsgnStaff();
    if (userId==null) return "";
    var iNameResult = aa.person.getUser(userId);
    var iName = iNameResult.getOutput();
    var email=iName.getEmail();
    return email;
}

function getRecordAssignedStaffPhone(){
    var cdScriptObjResult = aa.cap.getCapDetail(capId);
    if (!cdScriptObjResult.getSuccess()) {
        logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage());
        return ""
    }
    var cdScriptObj = cdScriptObjResult.getOutput();
    if (!cdScriptObj) {
        logDebug("**ERROR: No cap detail script object");
        return ""
    }
    var cd = cdScriptObj.getCapDetailModel();
    var userId=cd.getAsgnStaff();
    if (userId==null) return "";
    var iNameResult = aa.person.getUser(userId);
    var iName = iNameResult.getOutput();
    var phone=iName.getPhoneNumber();
    return phone;
}

function getRecordAssignedStaffTitle(){
    var cdScriptObjResult = aa.cap.getCapDetail(capId);
    if (!cdScriptObjResult.getSuccess()) {
        logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage());
        return ""
    }
    var cdScriptObj = cdScriptObjResult.getOutput();
    if (!cdScriptObj) {
        logDebug("**ERROR: No cap detail script object");
        return ""
    }
    var cd = cdScriptObj.getCapDetailModel();
    var userId=cd.getAsgnStaff();
    if (userId==null) return "";
    var iNameResult = aa.person.getUser(userId);
    var iName = iNameResult.getOutput();
    var title=iName.getTitle();
    return title;
}
function getRecordAssignedStaffFullname(){
    var cdScriptObjResult = aa.cap.getCapDetail(capId);
    if (!cdScriptObjResult.getSuccess()) {
        logDebug("**ERROR: No cap detail script object : " + cdScriptObjResult.getErrorMessage());
        return ""
    }
    var cdScriptObj = cdScriptObjResult.getOutput();
    if (!cdScriptObj) {
        logDebug("**ERROR: No cap detail script object");
        return ""
    }
    var cd = cdScriptObj.getCapDetailModel();
    var userId=cd.getAsgnStaff();
    if (userId==null) return "";
    var iNameResult = aa.person.getUser(userId);
    var iName = iNameResult.getOutput();
    var fn=iName.getFullName();
    return fn;
}

function runReportAndSendAsync(reportName, module, itemCapId, reportParameters, emailFrom, emailTo, emailTemplate, emailParameters, emailCC, waitTimeSec, reportAttach) {

    var scriptName = "STDBASE_RUNREPORTANDSENDASYNC";
    var errorEmailTo = "";
    var debugEmailTo = errorEmailTo;
    var vReportAttach = matches(reportAttach, "false", false) ? false : true;
    var systemEmailFrom = agencyReplyEmailDefault;
    var waitTime = 2000;
    if (!matches(waitTimeSec, null, ""))
        waitTime = parseInt(parseInt(waitTimeSec) * 1000);

    var envParameters = aa.util.newHashMap();
    envParameters.put("ReportName", reportName);
    envParameters.put("ReportParameters", reportParameters);
    envParameters.put("ReportAttach", vReportAttach);
    envParameters.put("Module", module);
    envParameters.put("CustomCapId", itemCapId.getCustomID());
    envParameters.put("CapID", itemCapId);
    envParameters.put("ReportUser", currentUserID);
    envParameters.put("ServProvCode", servProvCode);
    envParameters.put("EmailFrom", emailFrom);
    envParameters.put("EmailTo", emailTo);
    envParameters.put("EmailCC", emailCC);
    envParameters.put("EmailTemplate", emailTemplate);
    envParameters.put("EmailParameters", emailParameters);
    envParameters.put("SystemMailFrom", systemEmailFrom);
    envParameters.put("ErrorEmailTo", errorEmailTo);
    envParameters.put("DebugEmailTo", debugEmailTo);
    envParameters.put("WaitTime", waitTime);

    aa.runAsyncScript(scriptName, envParameters);
    logDebug("(runReportAndSendAsync) Calling runAsyncScript for " + reportName);
}

function getStandardChoiceArray(stdChoice) {
    var cntItems = 0;
    var stdChoiceArray = new Array();
    var bizDomScriptResult = aa.bizDomain.getBizDomain(stdChoice);
    if (bizDomScriptResult.getSuccess()) {
        var bizDomScriptObj = bizDomScriptResult.getOutput();
        if(bizDomScriptObj != null){
            cntItems = bizDomScriptObj.size();
            logDebug("getStdChoiceArray: " + stdChoice + " size = " + cntItems);
            if (cntItems > 0) {
                var bizDomScriptItr = bizDomScriptObj.iterator();
                while (bizDomScriptItr.hasNext()) {
                    var bizBomScriptItem = bizDomScriptItr.next();
                    var stdChoiceArrayItem = new Array();
                    stdChoiceArrayItem["value"] = bizBomScriptItem.getBizdomainValue();
                    stdChoiceArrayItem["valueDesc"] = bizBomScriptItem.getDescription();
                    stdChoiceArrayItem["active"] = bizBomScriptItem.getAuditStatus();
                    stdChoiceArray.push(stdChoiceArrayItem);
                }
            }
        }
        else{
            logDebug("getStdChoiceArray: WARNING stdChoice not found - " + stdChoice);
        }
        
    }
    return stdChoiceArray;
}

function getReporingInfoStandards4Notification(eParamsHash, rptInfoStdChoice) {

    var rptInfoStdArray = getStandardChoiceArray(rptInfoStdChoice);

    for (iSC in rptInfoStdArray) {
        if (rptInfoStdArray[iSC]["active"] == "A") {
            var scValue = String(rptInfoStdArray[iSC]["value"]);
            var scValueDesc = (rptInfoStdArray[iSC]["valueDesc"] != null) ? String(rptInfoStdArray[iSC]["valueDesc"]) : "";
            var parameterName = "";

            if (scValue.indexOf("$$") < 0)
                parameterName = "$$" + scValue.replace(/\s+/g, '') + "$$";
            else
                parameterName = scValue;

            addParameter(eParamsHash, parameterName, scValueDesc);
        }
    }

    return eParamsHash;
}

function getDepartmentParams4Notification(eParamsHash, deptName) {
    if (deptName == null) {
        return eParamsHash;
    }
    var rptInfoStdArray = getStandardChoiceArray("DEPARTMENT_INFORMATION");
    var foundDept = false;

    var valDesc = null;
    var defaultDeptValDesc = null;
    for (s in rptInfoStdArray) {
        if (rptInfoStdArray[s]["active"] == "A" && String(rptInfoStdArray[s]["value"]).toUpperCase() == String(deptName).toUpperCase()) {
            valDesc = rptInfoStdArray[s]["valueDesc"];
            if (isEmptyOrNull(valDesc)) {
                return eParamsHash;
            }
            valDesc = String(valDesc).split("|");
            foundDept = true;
            break;
        }//active and name match
        if (rptInfoStdArray[s]["active"] == "A" && String(rptInfoStdArray[s]["value"]).toUpperCase() == "DEFAULT"){
            defaultDeptValDesc = rptInfoStdArray[s]["valueDesc"];
            if (isEmptyOrNull(valDesc)) {
                return eParamsHash;
            }
            defaultDeptValDesc = String(defaultDeptValDesc).split("|");
        }
    }//all std-choice rows

    if(!foundDept){
        // No department found, use default values
        valDesc = defaultDeptValDesc;
    }

    if (!isEmptyOrNull(valDesc)) {
        for (e in valDesc) {
            var parameterName = "";
            var tmpParam = valDesc[e].split(":");
            if (tmpParam[0].indexOf("$$") < 0)
                parameterName = "$$" + tmpParam[0].replace(/\s+/g, '') + "$$";
            else
                parameterName = tmpParam[0];

            addParameter(eParamsHash, parameterName, tmpParam[1]);
        }//for all parameters in each row
    }//has email parameters

    return eParamsHash;
}

function sendNotificationLocal(emailFrom, emailTo, emailCC, templateName, params, reportFile) {
    var itemCap = capId;

    if (arguments.length == 7)
        itemCap = arguments[6]; // use cap ID specified in args

    var id1 = itemCap.ID1;
    var id2 = itemCap.ID2;
    var id3 = itemCap.ID3;

    var capIDScriptModel = aa.cap.createCapIDScriptModel(id1, id2, id3);

    var result = null;
    if (isEmptyOrNull(emailFrom))
        emailFrom = null;
    if (isEmptyOrNull(emailCC))
        emailCC = null;

    result = aa.document.sendEmailAndSaveAsDocument(emailFrom, emailTo, emailCC, templateName, params, capIDScriptModel, reportFile);

    if (result.getSuccess()) {
        logDebug("Sent email successfully!");
        return true;
    } else {
        logDebug("Failed to send mail. - " + result.getErrorType() + " : " + result.getErrorMessage());
        return false;
    }
}

function getDepartmentNameLocal(username)
{
    var suo = aa.person.getUser(username).getOutput(); 
    var dpt = aa.people.getDepartmentList(null).getOutput();
    for (var thisdpt in dpt)
        {
        var m = dpt[thisdpt]
        var  n = m.getServiceProviderCode() + "/" + m.getAgencyCode() + "/" + m.getBureauCode() + "/" + m.getDivisionCode() + "/" + m.getSectionCode() + "/" + m.getGroupCode() + "/" + m.getOfficeCode() 
      
        if (suo && n.equals(suo.deptOfUser)) 
        return(m.getDeptName())
        }
}

function getLicensedProfessionalObjectsByRecord(pCapId,licenseTypeArray){
    var itemCap = capId;
    if (pCapId != null)
        itemCap = pCapId; // use cap ID specified in args

    var licenseProfObjArray = new Array();
    var licenseProfResult = aa.licenseProfessional.getLicensedProfessionalsByCapID(itemCap);
    if(licenseProfResult.getSuccess()){
        var licenseProfList = licenseProfResult.getOutput();
        var licenseProfObjArray= new Array();
        if (licenseProfList) {
            for (thisLP in licenseProfList) {
                if(licenseProfList[thisLP].getLicenseNbr() != null){
                    if (!licenseTypeArray || exists(licenseProfList[thisLP].getLicenseType(), licenseTypeArray))
                    var vLPObj = new licenseProfObject(licenseProfList[thisLP].getLicenseNbr());
                    licenseProfObjArray.push(vLPObj);
                }
            }
        }
    }
    
    return licenseProfObjArray;
}

/**
 * Standard base automation to send notifications to contacts based on JSON configurable rules.
 * 
 * @param {CapIdObject} itemCapId CapIdObject blah
 * @param {JSON} recordSettings JSON configuration ruleset
 * @param {HashMap} parameters Optional hashmap of notification template parameters
 */
function sendContactEmails(itemCapId, recordSettings, parameters) {

    var functionTitle = "sendContactEmails()";

    var debugMode = false;

    // validate JSON parameters using handleUndefined function
    // handleUndefine(JSON Parameter, isRequired);
    var rNotificationTemplate = handleUndefined(recordSettings.action.notificationTemplate, false);
    var rReportParamContactType = handleUndefined(recordSettings.action.reportParamContactType,false);
    var rNotifyContactType = handleUndefined(recordSettings.action.notifyContactTypes, false);
    var rNotifyLPType = handleUndefined(recordSettings.action.notifyLPTypes, false);
    var rUrl4ACA = handleUndefined(recordSettings.action.url4ACA, false);
    var rNotificationReport = handleUndefined(recordSettings.action.notificationReport, false);
    var rFromEmail = handleUndefined(recordSettings.action.fromEmail, false);
    var rAdditionalEmailsTo = handleUndefined(recordSettings.action.additionalEmailsTo, false);
    var rCreateFromParent = handleUndefined(recordSettings.action.createFromParent, false);
    var rReportingInfoStandards = handleUndefined(recordSettings.action.reportingInfoStandards, false);
    var rBalanceAllowed = handleUndefined(recordSettings.action.balanceAllowed, false);

    // VALIDATE FUNCTION PARAMETERS
    // validate required parameters, log error and return false if required parameters are missing
    if (!rNotificationTemplate) {
        logDebug("ERROR: recordSettings.notificationTemplate is missing in JSON configuration.");
        return false;
    }

    if (isEmptyOrNull(rNotifyContactType)) {
        logDebug("ERROR: recordSettings.notifyContactType is missing in JSON configuration.");
        return false;
    }

    if (isEmptyOrNull(rUrl4ACA)) {
        rUrl4ACA = acaURLDefault;
    }






    if (isEmptyOrNull(rFromEmail)) {
        rFromEmail = agencyReplyEmailDefault;
    }

    if (typeof itemCapId == 'undefined') {
        logDebug("WARNING: The capIdObject Parameter is required for the function. " + functionTitle);
        return false;
    }
    if (isEmptyOrNull(rCreateFromParent)) {
        rCreateFromParent = false;
    }

    if (rCreateFromParent) {
        var vParentCapId = getParentByCapId(itemCapId);

        if (vParentCapId) {
            itemCapId = vParentCapId;
        }
    }

    if (isEmptyOrNull(rReportingInfoStandards)) {
        rReportingInfoStandards = "Reporting Information Standards";
    }

    if (!isEmptyOrNull(rNotificationTemplate) && !isEmptyOrNull(rNotifyContactType)) {
        try {
            //Get Contacts
            emailAddrList = new Array();
            contactObjArray = new Array();
            capContactArray = null;
            var capContactResult = aa.people.getCapContactByCapID(itemCapId);
            if (capContactResult.getSuccess()) {
                var capContactArray = capContactResult.getOutput();
            }

            //Check Necessary Contacts
            if (rNotifyContactType[0].toUpperCase() != "ALL" && rNotifyContactType[0].toUpperCase() != "PRIMARY") {
                if (capContactArray) {
                    for (y in capContactArray) {
                        thisCon = capContactArray[y];
                        for (z in rNotifyContactType) {
                            if (thisCon.getPeople().getContactType().toUpperCase() == rNotifyContactType[z].toUpperCase()) {
                                if (thisCon.getEmail())
                                    contactObjArray.push(new contactObjLocal(thisCon));
                            }
                        }
                    }
                }
            } else if (rNotifyContactType[0].toUpperCase() == "ALL") {
                if (capContactArray) {
                    for (y in capContactArray) {
                        thisCon = capContactArray[y];
                        if (thisCon.getEmail())
                            contactObjArray.push(new contactObjLocal(thisCon));
                    }
                }
            } else if (rNotifyContactType[0].toUpperCase() == "PRIMARY") {
                if (capContactArray) {
                    for (y in capContactArray) {
                        thisCon = capContactArray[y];
                        if (thisCon.getPeople().getFlag() == "Y" && thisCon.getEmail())
                            contactObjArray.push(new contactObjLocal(thisCon));
                    }
                }
            }

            var eParams = null;
            if (contactObjArray.length > 0 || !isEmptyOrNull(rAdditionalEmailsTo)) {

                //Build parameters
                if (!parameters) {
                    eParams = aa.util.newHashtable();
                } else {
                    eParams = parameters;
                }
                responsiveACA = lookup("ACA_CONFIGS", "ENABLE_CUSTOMIZATION_PER_PAGE");
                var itemCapIDString = itemCapId.getCustomID();
                var itemCap = aa.cap.getCap(itemCapId).getOutput();
                var itemCapName = itemCap.getSpecialText();
                var itemCapStatus = itemCap.getCapStatus();
                var itemFileDate = itemCap.getFileDate();
                var itemCapTypeAlias = itemCap.getCapType().getAlias();
                var itemAppTypeResult = itemCap.getCapType();
                var itemAppTypeString = itemAppTypeResult.toString();
                var itemAppTypeArray = itemAppTypeString.split("/");
                var itemModule = itemCap.getCapModel().getModuleName();
                var capIDScriptModel = aa.cap.createCapIDScriptModel(itemCapId.getID1(), itemCapId.getID2(), itemCapId.getID3());
                var itemHouseCount;
                var itemFeesInvoicedTotal;
                var itemBalanceDue = 0;
                var departmentNameUserID;

                var itemCapDetailObjResult = aa.cap.getCapDetail(itemCapId);
                if (itemCapDetailObjResult.getSuccess()) {
                    itemCapDetail = itemCapDetailObjResult.getOutput();
                    itemHouseCount = itemCapDetail.getHouseCount();
                    itemFeesInvoicedTotal = itemCapDetail.getTotalFee();
                    itemBalanceDue = itemCapDetail.getBalance();
                }

                var workDesc = workDescGet(itemCapId);

                //Report Parameters
                var repParams = aa.util.newHashMap();
                //repParams.put("altID", itemCapId.getCustomID());
                repParams.put("p1Value", itemCapIDString); // Used for Ad Hoc Reporting

                getReporingInfoStandards4Notification(eParams, rReportingInfoStandards);






                addParameter(eParams, "$$altID$$", itemCapIDString);
                addParameter(eParams, "$$recordName$$", itemCapName);
                addParameter(eParams, "$$recordAlias$$", itemCapTypeAlias);
                addParameter(eParams, "$$recordStatus$$", itemCapStatus);
                addParameter(eParams, "$$fileDate$$", itemFileDate);
                addParameter(eParams, "$$balanceDue$$", "$" + parseFloat(itemBalanceDue).toFixed(2));
                addParameter(eParams, "$$workDesc$$", (workDesc) ? workDesc : "");

                var capAddresses = aa.address.getAddressByCapId(capId);
                if (capAddresses.getSuccess()) {
                    capAddresses = capAddresses.getOutput();
                    if (capAddresses != null && capAddresses.length > 0) {
                        capAddresses = capAddresses[0];
                        var addressVar = "";
                        addressVar = capAddresses.getHouseNumberStart() + " ";
                        addressVar = addressVar + capAddresses.getStreetName() + " ";
                        addressVar = addressVar + capAddresses.getCity() + " ";
                        addressVar = addressVar + capAddresses.getState() + " ";
                        addressVar = addressVar + capAddresses.getZip();
                        addParameter(eParams, "$$FullAddress$$", addressVar);
                    }
                }

                if (rUrl4ACA && responsiveACA.toUpperCase() != "YES") {
                    buildRecURL = rUrl4ACA + getACAUrl(itemCapId);
                    buildPayURL = buildRecURL.replace("1000", "1009");
                    addParameter(eParams, "$$acaRecordUrl$$", buildRecURL);
                    addParameter(eParams, "$$acaPaymentUrl$$", buildPayURL);
                }
                if (rUrl4ACA && responsiveACA.toUpperCase() == "YES") {
                    buildRecURL = rUrl4ACA + getACAUrl(itemCapId) + "&FromACA=Y";
                    buildPayURL = buildRecURL.replace("1000", "1009");
                    addParameter(eParams, "$$acaRecordUrl$$", buildRecURL);
                    addParameter(eParams, "$$acaPaymentUrl$$", buildPayURL);
                }

                if (controlString.indexOf("InspectionSchedule") > -1) {
                    if (inspId) {
                        addParameter(eParams, "$$inspId$$", inspId);
                        repParams.put("inspId", inspId);
                    }
                    if (inspInspector){
                        addParameter(eParams, "$$inspInspector$$", inspInspector);
                        departmentNameUserID = inspInspector;
                    }
                    if (InspectorFirstName && InspectorLastName)
                        addParameter(eParams, "$$InspectorName$$", InspectorFirstName + " " + InspectorLastName);       
                    if (inspGroup)
                        addParameter(eParams, "$$inspGroup$$", inspGroup);
                    if (inspType)
                        addParameter(eParams, "$$inspType$$", inspType);
                    if (inspSchedDate)
                        addParameter(eParams, "$$inspSchedDate$$", inspSchedDate);
                }
                if (controlString.indexOf("InspectionResult") > -1) {
                    if (inspId) {
                        addParameter(eParams, "$$inspId$$", inspId);
                        repParams.put("inspId", inspId);
                    }
                    if (inspObj) {
                        var inspInspectorObj = inspObj.getInspector();
                        if (inspInspectorObj) {
                            addParameter(eParams, "$$inspInspector$$", inspInspectorObj.getUserID());
                            departmentNameUserID = inspInspectorObj.getUserID();
                        }
                    }
                    if (inspResult)
                        addParameter(eParams, "$$inspResult$$", inspResult);
                    if (inspComment)
                        addParameter(eParams, "$$inspComment$$", inspComment);
                    if (inspResultDate)
                        addParameter(eParams, "$$inspResultDate$$", inspResultDate);
                    if (inspGroup)
                        addParameter(eParams, "$$inspGroup$$", inspGroup);
                    if (inspType)
                        addParameter(eParams, "$$inspType$$", inspType);
                    if (inspSchedDate)
                        addParameter(eParams, "$$inspSchedDate$$", inspSchedDate);
                }
                if (controlString.indexOf("Workflow") > -1) {
                    if (wfTask)
                        addParameter(eParams, "$$wfTask$$", wfTask);
                    if (wfStatus)
                        addParameter(eParams, "$$wfStatus$$", wfStatus);
                    if (wfDateMMDDYYYY)
                        addParameter(eParams, "$$wfDate$$", wfDateMMDDYYYY);
                    if (wfComment)
                        addParameter(eParams, "$$wfComment$$", wfComment);
                    if (wfStaffUserID){

                        addParameter(eParams, "$$wfStaffUserID$$", wfStaffUserID);
                        addParameter(eParams,"$$StaffEmail$$",getRecordAssignedStaffEmail());
                        addParameter(eParams,"$$StaffPhone$$",getRecordAssignedStaffPhone());
                        addParameter(eParams,"$$StaffTitle$$",getRecordAssignedStaffTitle());
                        addParameter(eParams,"$$StaffFullName$$",getRecordAssignedStaffFullname());
                        departmentNameUserID = wfStaffUserID;
                    }
                    if (typeof wfActionByUserID != 'undefined' && wfActionByUserID)
                        addParameter(eParams, "$$wfActionByUserID$$", wfActionByUserID);
                    if (wfHours)
                        addParameter(eParams, "$$wfHours$$", wfHours);
                }

                if(!isEmptyOrNull(departmentNameUserID)){
                    var departmentName = getDepartmentNameLocal(departmentNameUserID);
                    logDebug("STDBASE_SEND_CONTACT_EMAILS: UserID = " + departmentNameUserID + " :: Department Name = " + departmentName);
                    getDepartmentParams4Notification(eParams, departmentName);
                }else if(isEmptyOrNull(departmentNameUserID) && !isEmptyOrNull(currentUserID)){
                    var departmentName = getDepartmentNameLocal(currentUserID);
                    logDebug("STDBASE_SEND_CONTACT_EMAILS: CurrentUserID = " + currentUserID + " :: Department Name = " + departmentName);
                    getDepartmentParams4Notification(eParams, departmentName);
                }
                
            }//contacs list or additional emails

            //an email needs to be sent to a specified contact type when all fees have been paid.
            if (String(rNotifyContactType) != "" && String(rBalanceAllowed) != "") {
                var itemBalanceDue = 0;
                var itemCapDetailObjResult = aa.cap.getCapDetail(itemCapId);
                if (itemCapDetailObjResult.getSuccess()) {
                    itemCapDetail = itemCapDetailObjResult.getOutput();
                    itemBalanceDue = itemCapDetail.getBalance();
                }
                if (rBalanceAllowed == false && itemBalanceDue == 0) {
                    if (capContactArray) {
                        for (y in capContactArray) {
                            thisCon = capContactArray[y];
                            for (z in rNotifyContactType) {
                                if (thisCon.getPeople().getContactType().toUpperCase() == rNotifyContactType[z].toUpperCase()) {
                                    if (thisCon.getEmail())
                                        contactObjArray.push(new contactObjLocal(thisCon));
                                }
                            }
                        }
                    }
                }
            }

            //Send Email logic
            for (iCont in contactObjArray) {
                var eParamsContact = eParams;
                var rptParamsContact = repParams;
                var tContactObj = contactObjArray[iCont];

                
                tContactObj.getEmailTemplateParams(eParamsContact, "Contact");

                if(!isEmptyOrNull(rReportParamContactType)){
                    rptParamsContact.put("p2Value", rReportParamContactType);
                }
                

                if (isEmptyOrNull(rNotificationReport)) {
                    sendNotificationLocal(rFromEmail, tContactObj.people.getEmail(), "", rNotificationTemplate, eParamsContact, null, itemCapId);
                } else {
                    reportFiles = new Array();
                    repTypeArray = rNotificationReport;

                    for (xReport in repTypeArray) {
                        var report = repTypeArray[xReport]; 
                        runReportAndSendAsync(report, itemModule, itemCapId, rptParamsContact, rFromEmail, tContactObj.people.getEmail(), rNotificationTemplate, eParamsContact, "", 1);

                    }
                }
            } // contactObjArray loop

            //code block repeated, we could not create empty CapContactScriptModel object and push() it to 'contactObjArray'
            if (!isEmptyOrNull(rAdditionalEmailsTo)) {
                for (e in rAdditionalEmailsTo) {
                    if (isEmptyOrNull(rNotificationReport)) {
                        sendNotificationLocal(rFromEmail, rAdditionalEmailsTo[e].trim(), "", rNotificationTemplate, eParams, null, itemCapId);
                    } else {
                        reportFiles = new Array();
                        repTypeArray = rNotificationReport;
                        var capIDScriptModel = aa.cap.createCapIDScriptModel(itemCapId.getID1(), itemCapId.getID2(), itemCapId.getID3());
                        for (xReport in repTypeArray) {
                            var report = repTypeArray[xReport];
                            runReportAndSendAsync(report, itemModule, itemCapId, repParams, rFromEmail, rAdditionalEmailsTo[e].trim(), rNotificationTemplate, eParams, "", 1);
                        }
                    }
                }//for all extra emails
            }//rAdditionalEmailsTo

            if(!isEmptyOrNull(rNotifyLPType)){
                var eParamsLP = eParams;
                var rptParamsLP = repParams;
                var licenseProfObjArray = new Array();

                if (rNotifyLPType[0].toUpperCase() == "ALL") {
                    licenseProfObjArray = getLicensedProfessionalObjectsByRecord(itemCapId);
                }
                else{
                    licenseProfObjArray = getLicensedProfessionalObjectsByRecord(itemCapId,rNotifyLPType);
                }


                for(var lp in licenseProfObjArray){
                    var vLPObj = licenseProfObjArray[lp];
                
                    var vLPEmail = vLPObj.refLicModel.getEMailAddress();

                    if (!matches(vLPEmail,null,undefined,"") && vLPEmail.indexOf("@") > 0) {
                        var eParamsLP = aa.util.newHashtable();
                        vLPObj.getEmailTemplateParams(eParamsLP,"Contact");
                
                        if(!isEmptyOrNull(rReportParamContactType)){
                            rptParamsLP.put("p2Value", rReportParamContactType);
                        }
                        
        
                        if (isEmptyOrNull(rNotificationReport)) {
                            sendNotificationLocal(rFromEmail, vLPEmail, "", rNotificationTemplate, eParamsLP, null, itemCapId);
                        } else {
                            reportFiles = new Array();
                            repTypeArray = rNotificationReport;
        
                            for (xReport in repTypeArray) {
                                var report = repTypeArray[xReport]; 
                                runReportAndSendAsync(report, itemModule, itemCapId, rptParamsLP, rFromEmail, vLPEmail, rNotificationTemplate, eParamsLP, "", 1);
                            }
                        }
                    }
                    else{
                        logDebug("WARNING: No valid License Professional Email found")
                    }
                }
            }

        } catch (err) {
            logDebug("Exception generating emails : " + err);
        }
    }
}
