logDebug("***** Starting SEND_EMAIL_TAXLIC_INVOICE_ASYNC *****");
function getScriptText(vScriptName){
   vScriptName = vScriptName.toUpperCase();
   var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
   var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(),vScriptName,"ADMIN");
   return emseScript.getScriptText() + "";          
 }

 var SCRIPT_VERSION = 3.0
 aa.env.setValue("CurrentUserID", "ADMIN");
 eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
 eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
 eval(getScriptText("COMMON_RUN_REPORT_AND_NOTIFICATION"));
try
{
	var capId = aa.env.getValue("capId");
	var cap = aa.env.getValue("cap");
	var recordID = aa.env.getValue("altID");
	var emailTo = getEmailString(); 
	var recordApplicant = getContactByType("Applicant", capId);
	var firstName = recordApplicant.getFirstName();
    var lastName = recordApplicant.getLastName();
	var capAlias = cap.getCapModel().getAppTypeAlias();
	var today = new Date();
	var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
	var tParams = aa.util.newHashtable();
	tParams.put("$$todayDate$$", thisDate);
    tParams.put("$$altid$$", recordID);
    tParams.put("$$capAlias$$", capAlias);
    tParams.put("$$FirstName$$", firstName);
    tParams.put("$$LastName$$", lastName);
	//lastInvoice = getLastInvoice({});
    //invoiceNbr = lastInvoice.invNbr;
    var reportParams = aa.util.newHashtable();
    addParameter(reportParams, "AGENCYID", "AURORACO");
    //addParameter(reportParams, "INVOICEID", invoiceNbr.toString());
	//var rParams = aa.util.newHashtable();
	//rParams.put("AGENCYID", "AURORACO");
	//rParams.put("AGENCYID", recordID);
	//rParams.put("INVOICEID", "4694");
	var emailtemplate = "LIC FEES INVOICED";
	//var report = generateReportFile("Invoice Report", reportParams, aa.getServiceProviderCode());
	var report = generateLastInvoiceReportForEmail4thisScript();
	sendNotification("noreply@auroragov.org", emailTo, "", emailtemplate, tParams, [report]);
}
catch(e)
{
	email("acharlton@truepointsolutions.com", "acharlton@truepointsolutions.com", "Error", e.message);
	showMessage = true;
    comment("Error on custom async script SEND_EMAIL_WITH_LAST_INVOICE_ASYNC. Please contact administrator. Err: " + e + ". Line: " + e.lineNumber);
    logDebug("Error on custom function SEND_EMAIL_WITH_LAST_INVOICE_ASYNC. Please contact administrator. Err: " + e + ". Line: " + e.lineNumber + ". Stack: " + e.stack);
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



    for(thisContact in contactArray) {

        if((contactArray[thisContact].getPeople().contactType).toUpperCase() == conType.toUpperCase())

            return contactArray[thisContact].getPeople();

    }



    return false;

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
    report.setModule("Licenses");
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