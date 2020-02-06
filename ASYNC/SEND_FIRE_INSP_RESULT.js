//SEND_FIRE_INSP_RESULT
logDebug("***** Starting SEND_FIRE_INSP_RESULT from script *****");
try
{
	var capId = aa.env.getValue("capId");
	var cap = aa.env.getValue("cap");
	var reportName = aa.env.getValue("reportName");
	var altId = aa.env.getValue("altID")
	//var inspId = aa.env.getValue("InspActNumber");


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
		//rParams.put("InspActNumber", inspId);
		rParams.put("RecordId", altId);
	}
	else if ("Fire_Follow_Up_Inspection".equals(reportName))
	{
		//rParams.put("InspActNumber", inspId);
		rParams.put("RecordID", altId);
	}
	else if ("Fire Order Notice".equals(reportName))
	{
		rParams.put("RecordID", capId.getCustomID());
		//rParams.put("RecordID", altId);
	}

	var emailtemplate = "FIRE INSPECTION RESULTS #15";
	var report = generateReportFile(reportName, rParams, aa.getServiceProviderCode());
	sendNotification("noreply@aurora.gov", emailTo, "", emailtemplate, tParams, [report]);
}
catch(e)
{
	email("debug@gmail.com", "aurora@gov.org", "Error", e.message);
}
function getEmailString()
{
	var emailString = "";
	var contactArray = getPeople(capId);

	//need to add inspection contact below to this logic 
	for (var c in contactArray)
	{
		if (contactArray[c].getPeople().getEmail() && contactArray[c].getPeople().getEmail().length() > 0)
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



// if (capStatus && !capStatus.equals("Cancelled") && !capStatus.equals("Case Finaled") && !capStatus.equals("Case Closed, No Merit") && !capStatus.equals("Case Closed") && !capStatus.equals("Closed, Approved") && !capStatus.equals("Closed, Denied") && !capStatus.equals("Denied") && !capStatus.equals("Withdrawn") && !capStatus.equals("Void") && !capStatus.equals("Expired"))
// {
// if(capStatus.equals("Permit Issued")
// 			   {
// 			   updateAppStatus(statusSet,"Auto-expiration by batch script");
// 			   taskCloseAllExcept("Expired Locked","Auto-closed by batch script due to permit expiration");
// 			   }
// //added the following to send email notifications to record contact
// //var contactTypesArray = new Array("Applicant","Site Contact");
// var notificationTemplate = "BLD_PERMIT Expired"
// var agencyReplyEmail = "noreply@adcogov.org"
// //var contactObjArray = getContactObjs(capId,contactTypesArray);
// contactArray = getContactArray();
// if (typeof(contactArray =="object"))
// 			   {
// 			   for (var eachContact in contactArray) 
// 							  {
// 							  if(contactArray[eachContact]["contactType"] == "Applicant") 
// 											 {
// 											 thisContact = contactArray[eachContact];
// 											 if (thisContact["email"] != null)
// 															{
// 															emailSendTo = thisContact["email"];
// 															var eParams = aa.util.newHashtable();
// 															addParameter(eParams, "$$altID$$",altId);
// 															if (!matches(notificationTemplate,null,undefined,""))
// 																		   {
// 																		   sendNotification(agencyReplyEmail,emailSendTo,"",notificationTemplate,eParams,null);
// 																		   }
// 															}
// 											 }              
// 							  }
// 			   }

// }


// function getContactArray()
// {
// // Returns an array of associative arrays with contact attributes.  Attributes are UPPER CASE
// // optional capid
// // added check for ApplicationSubmitAfter event since the contactsgroup array is only on pageflow,
// // on ASA it should still be pulled normal way even though still partial cap
// var thisCap = capId;
// if (arguments.length == 1) thisCap = arguments[0];

// var cArray = new Array();

// if (arguments.length == 0 && !cap.isCompleteCap() && controlString != "ApplicationSubmitAfter") // we are in a page flow script so use the capModel to get contacts
// {
// capContactArray = cap.getContactsGroup().toArray() ;
// }
// else
// {
// var capContactResult = aa.people.getCapContactByCapID(thisCap);
// if (capContactResult.getSuccess())
// {
// var capContactArray = capContactResult.getOutput();
// }
// }

// if (capContactArray)
// {
// for (yy in capContactArray)
// {
// var aArray = new Array();
// aArray["lastName"] = capContactArray[yy].getPeople().lastName;
// aArray["firstName"] = capContactArray[yy].getPeople().firstName;
// aArray["middleName"] = capContactArray[yy].getPeople().middleName;
// aArray["businessName"] = capContactArray[yy].getPeople().businessName;
// aArray["contactSeqNumber"] =capContactArray[yy].getPeople().contactSeqNumber;
// aArray["contactType"] =capContactArray[yy].getPeople().contactType;
// aArray["relation"] = capContactArray[yy].getPeople().relation;
// aArray["phone1"] = capContactArray[yy].getPeople().phone1;
// aArray["phone2"] = capContactArray[yy].getPeople().phone2;
// aArray["email"] = capContactArray[yy].getPeople().email;
// aArray["addressLine1"] = capContactArray[yy].getPeople().getCompactAddress().getAddressLine1();
// aArray["addressLine2"] = capContactArray[yy].getPeople().getCompactAddress().getAddressLine2();
// aArray["city"] = capContactArray[yy].getPeople().getCompactAddress().getCity();
// aArray["state"] = capContactArray[yy].getPeople().getCompactAddress().getState();
// aArray["zip"] = capContactArray[yy].getPeople().getCompactAddress().getZip();
// aArray["fax"] = capContactArray[yy].getPeople().fax;
// aArray["notes"] = capContactArray[yy].getPeople().notes;
// aArray["country"] = capContactArray[yy].getPeople().getCompactAddress().getCountry();
// aArray["fullName"] = capContactArray[yy].getPeople().fullName;

// if (arguments.length == 0 && !cap.isCompleteCap()) // using capModel to get contacts
// 			   var pa = capContactArray[yy].getPeople().getAttributes().toArray();
// else
// 			   var pa = capContactArray[yy].getCapContactModel().getPeople().getAttributes().toArray();
// for (xx1 in pa)
// aArray[pa[xx1].attributeName] = pa[xx1].attributeValue;
// cArray.push(aArray);
// }
// }
// return cArray;
// }

// function appMatch(ats) // optional capId or CapID string
// {
// var matchArray = appTypeArray //default to current app
// if (arguments.length == 2) 
// {
// matchCapParm = arguments[1]
// if (typeof(matchCapParm) == "string")
// matchCapId = aa.cap.getCapID(matchCapParm).getOutput();   // Cap ID to check
// else
// matchCapId = matchCapParm;
// if (!matchCapId)
// {
// logDebug("**WARNING: CapId passed to appMatch was not valid: " + arguments[1]);
// return false
// }
// matchCap = aa.cap.getCap(matchCapId).getOutput();
// matchArray = matchCap.getCapType().toString().split("/");
// }

// var isMatch = true;
// var ata = ats.split("/");
// if (ata.length != 4)
// logDebug("**ERROR in appMatch.  The following Application Type String is incorrectly formatted: " + ats);
// else
// for (xx in ata)
// if (!ata[xx].equals(matchArray[xx]) && !ata[xx].equals("*"))
// 			   isMatch = false;
// return isMatch;

// }