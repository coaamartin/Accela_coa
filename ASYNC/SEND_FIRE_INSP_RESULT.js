//SEND_FIRE_INSP_RESULT
logDebug("***** Starting SEND_FIRE_INSP_RESULT from script *****");
try
{
	var capId = aa.env.getValue("capId");
	var cap = aa.env.getValue("cap");
	var reportName = aa.env.getValue("reportName");
	var altId = aa.env.getValue("altID")
	var emailTo = getEmailString(); 
	var capAlias = cap.getCapModel().getAppTypeAlias();
	var today = new Date();
	var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
	var tParams = aa.util.newHashtable();
	tParams.put("$$todayDate$$", thisDate);
	tParams.put("$$altID$$", capId.getCustomID());
	tParams.put("$$capAlias$$", capAlias);
	var rParams = aa.util.newHashtable();
	if ("Fire_Primary_Inspection".equals(reportName))
	{		
		rParams.put("recordid", altId);
	}
	else if ("Fire_Follow_Up_Inspection".equals(reportName))
	{
		rParams.put("RecordID", altId);
	}
	else if ("Fire Order Notice".equals(reportName))
	{
		rParams.put("RecordID", capId.getCustomID());
		
	}

	var emailtemplate = "FIRE INSPECTION RESULTS #15";
	var report = generateReportFile(reportName, rParams, aa.getServiceProviderCode());
	sendNotification("noreply@aurora.gov", emailTo, "", emailtemplate, tParams, [report]);
}
catch(e)
{
	email("rprovinc@auroragov.org", "rprovinc@auroragov.org", "Error", e.message);
}
function getEmailString()
{
	var emailString = "";
	var contactArray = getPeople(capId);

	//need to add inspection contact below to this logic 
	for (var c in contactArray)
	{
		if (contactArray[c].getPeople().getEmail() && contactArray[c].getPeople().contactType == "Inspection Contact")
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