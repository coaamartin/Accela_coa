logDebug("***** Starting SEND_EMAIL_TAXLIC_INVOICE_ASYNC.JS *****");
try
{
	var capId = aa.env.getValue("capId");
	var cap = aa.env.getValue("cap");
	var invNbr = aa.env.getValue("INVOICEID");
	var emailTo = getEmailString(); 
	var capAlias = cap.getCapModel().getAppTypeAlias();
	var today = new Date();
	var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
    var acaUrl = lookup("ACA_CONFIGS", "ACA_SITE");
	var tParams = aa.util.newHashtable();
	getACARecordParam4Notification(tParams,acaUrl)
	tParams.put("$$todayDate$$", thisDate);
	tParams.put("$$altID$$", capId.getCustomID());
	tParams.put("$$capAlias$$", capAlias);
	var rParams = aa.util.newHashtable();
	rParams.put("AGENCYID", "AURORACO");
	rParams.put("INVOICEID", invNbr);
	var emailtemplate = "LIC FEES INVOICED";
	var report = generateReportFile("Invoice Report", rParams, aa.getServiceProviderCode());
	sendNotification("noreply@auroragov.org", emailTo, "", emailtemplate, tParams, [report]);
}
catch(e)
{
	email("acharlton@truepointsolutions.com", "acharlton@truepointsolutions.com", "Error", e.message);
}
function getEmailString()
{
	var emailString = "";
	var contactArray = getPeople(capId);

	//need to add inspection contact below to this logic 
	for (var c in contactArray)
	{
		if (contactArray[c].getPeople().getEmail() && contactArray[c].getPeople().contactType == "Licensee")
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

function getACARecordParam4Notification(params,acaUrl) {

	itemCap = (arguments.length == 3) ? arguments[2] : capId;

	addParameter(params, "$$acaRecordUrl$$", getACARecordURL(acaUrl,itemCap));

	return params;	

}

function getACARecordURL(acaUrl) {

    var acaRecordUrl = "";
                var acaUrl = lookup("ACA_CONFIGS", "ACA_SITE");
                if (acaUrl) acaUrl = acaUrl.toLowerCase().replace("/admin", "").replace("/default.aspx", "");     
    var id1 = capId.ID1;
    var id2 = capId.ID2;
    var id3 = capId.ID3;

    acaRecordUrl = acaUrl + "/urlrouting.ashx?type=1000";
    acaRecordUrl += "&Module=" + cap.getCapModel().getModuleName();
    acaRecordUrl += "&capID1=" + id1 + "&capID2=" + id2 + "&capID3=" + id3;
    acaRecordUrl += "&agencyCode=" + aa.getServiceProviderCode();

    return acaRecordUrl;
}

function lookup(stdChoice,stdValue) 
	{
	var strControl;
	var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice,stdValue);
	
   	if (bizDomScriptResult.getSuccess())
   		{
		var bizDomScriptObj = bizDomScriptResult.getOutput();
		strControl = "" + bizDomScriptObj.getDescription(); // had to do this or it bombs.  who knows why?
		logDebug("lookup(" + stdChoice + "," + stdValue + ") = " + strControl);
		}
	else
		{
		logDebug("lookup(" + stdChoice + "," + stdValue + ") does not exist");
		}
	return strControl;
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
