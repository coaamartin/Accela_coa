logDebug("***** Starting SEND_EMAIL_PI_Acceptance_ASYNC *****");
if (typeof debug === 'undefined') {
    var debug = "";                                        // Debug String, do not re-define if calling multiple
}
var br = "<BR>";
var currentUserID = aa.env.getValue("currentUserID");
if (currentUserID == "ACHARLTO") {
    showDebug = 3;
}
try {
    var recordID = aa.env.getValue("altID");
    var capId = aa.cap.getCapID(recordID).getOutput();
    //var capId = aa.env.getValue("capId");
    cap = aa.cap.getCap(capId).getOutput();
    logDebug("recordID is = " + recordID);
    //var emailTo = getEmailString(); 
    var recordApplicants = getContactByType("Applicant", capId);
    for (var i in recordApplicants) {
        var recordApplicant = recordApplicants[i];
        var firstName = recordApplicant.getFirstName();
        var lastName = recordApplicant.getLastName();
        var emailTo = recordApplicant.getEmail();
        var capAlias = cap.getCapModel().getAppTypeAlias();
        var today = new Date();
        var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
        var tParms = aa.util.newHashtable();
        addParameter(tParms, "$$todayDate$$", thisDate);
        addParameter(tParms, "$$altid$$", recordID);
        addParameter(tParms, "$$capAlias$$", capAlias);
        addParameter(tParms, "$$FirstName$$", firstName);
        addParameter(tParms, "$$LastName$$", lastName);
        var rParams = aa.util.newHashtable();
        rParams.put("RecordID", recordID);
        logDebug("rParams: " + rParams);
        var emailtemplate = "PI INITIAL ACCEPTANCE # 167";
        var report = generateReportFile("PI_Initial_Acceptance_Script", rParams, aa.getServiceProviderCode());
        sendNotification("noreply@auroragov.org", emailTo, "", emailtemplate, tParms, [report]);
    }
    if (showDebug) {
        email("acharlton@truepointsolutions.com", "acharlton@truepointsolutions.com", "DEBUG PI Acceptance Async for " + recordID, "Debug: " + debug);
    }
}
catch (e) {
    email("acharlton@truepointsolutions.com", "acharlton@truepointsolutions.com", "Error in PI Acceptance Async" + recordID, e.message + " in Line " + e.lineNumber + br + "Stack: " + e.stack + br + "Debug: " + debug);
}

function getEmailString()
{
    var emailString = "";
    var contactArray = getPeople(capId);

 

    //need to add inspection contact below to this logic 
    for (var c in contactArray)
    {
        if (contactArray[c].getPeople().getEmail() && contactArray[c].getPeople().contactType == "Applicant")
        {
            emailString += contactArray[c].getPeople().getEmail() + ";";

 

        }
    }
    logDebug(emailString);
    return emailString;
}
logDebug("Starting function getPeople")
 function getPeople(capId)
{
    capPeopleArr = null;
    var s_result = aa.people.getCapContactByCapID(capId);
    if(s_result.getSuccess())
    {
        capPeopleArr = s_result.getOutput();
        if(capPeopleArr != null || capPeopleArr.length > 0)
        {
            for (loopk in capPeopleArr)    
            {
                var capContactScriptModel = capPeopleArr[loopk];
                var capContactModel = capContactScriptModel.getCapContactModel();
                var peopleModel = capContactScriptModel.getPeople();
                var contactAddressrs = aa.address.getContactAddressListByCapContact(capContactModel);
                if (contactAddressrs.getSuccess())
                {
                    var contactAddressModelArr = convertContactAddressModelArr(contactAddressrs.getOutput());
                    peopleModel.setContactAddressList(contactAddressModelArr);    
                }
            }
        }
        else
        {
            aa.print("WARNING: no People on this CAP:" + capId);
            capPeopleArr = null;
        }
    }
    else
    {
        aa.print("ERROR: Failed to People: " + s_result.getErrorMessage());
        capPeopleArr = null;    
    }
    return capPeopleArr;
}
function logDebug(str){aa.print(str);}
function logMessage(str){aa.print(str);}
 function getContactByType(conType,capId) {

 

    var contactArray = getPeople(capId);

 

    var cArray = [];

 

    for(thisContact in contactArray) {

 

        if((contactArray[thisContact].getPeople().contactType).toUpperCase() == conType.toUpperCase())

 

            cArray.push(contactArray[thisContact].getPeople());

 

    }

 

 

    return cArray;

 

}
function email(pToEmail, pFromEmail, pSubject, pText) 
    {
    //Sends email to specified address
    //06SSP-00221
    //
    aa.sendMail(pFromEmail, pToEmail, "", pSubject, pText);
    logDebug("Email sent to "+pToEmail);
    return true;
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
 function sendNotification(emailFrom,emailTo,emailCC,templateName,params,reportFile)

 

{

 

    var itemCap = capId;

 

    if (arguments.length == 7) itemCap = arguments[6]; // use cap ID specified in args

 

 

    var id1 = itemCap.ID1;

 

     var id2 = itemCap.ID2;

 

     var id3 = itemCap.ID3;

 

 

    var capIDScriptModel = aa.cap.createCapIDScriptModel(id1, id2, id3);

 

 

 

    var result = null;

 

    result = aa.document.sendEmailAndSaveAsDocument(emailFrom, emailTo, emailCC, templateName, params, capIDScriptModel, reportFile);

 

    if(result.getSuccess())

 

    {

 

        logDebug("Sent email successfully!");

 

        return true;

 

    }

 

    else

 

    {

 

        logDebug("Failed to send mail. - " + result.getErrorType());

 

        return false;

 

    }

 

}
 function convertContactAddressModelArr(contactAddressScriptModelArr)

 

{

 

    var contactAddressModelArr = null;

 

    if(contactAddressScriptModelArr != null && contactAddressScriptModelArr.length > 0)

 

    {

 

        contactAddressModelArr = aa.util.newArrayList();

 

        for(loopk in contactAddressScriptModelArr)

 

        {

 

            contactAddressModelArr.add(contactAddressScriptModelArr[loopk].getContactAddressModel());

 

        }

 

    }    

 

    return contactAddressModelArr;

 

}

 

function addParameter(pamaremeters, key, value)
{
    if(key != null)
    {
        if(value == null)
        {
            value = "";
        }
        pamaremeters.put(key, value);
    }
}
