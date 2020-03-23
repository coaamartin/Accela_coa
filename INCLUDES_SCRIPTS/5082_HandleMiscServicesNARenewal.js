// SCRIPTNUMBER: 5082
// SCRIPTFILENAME: 5082_HandleMiscServicesNARenewal.js
// PURPOSE: Called when NA Renewal record has review task updated.  The master record then gets updated.
// DATECREATED: 02/08/2019
// BY: amartin
// CHANGELOG: 4/29/2019,coa,ajm,added update of parent date last updated custom field,
// CHANGELOG: 3/5/2020, COA,RLP,moved it to Associations from MISCSERVICES

logDebug("At start of 5082 outside if");	 
if (wfTask == "Review Application" && wfStatus == "Complete") {
logDebug("5082 inside if");	 

	var vLicenseID;
	var vIDArray;
	var renewalCapProject;
	var vExpDate;
	var vNewExpDate;
	var vLicenseObj;

	var currentDate = sysDateMMDDYYYY;
	
	// Get the parent license
	vLicenseID = getParentLicenseCapID(capId);
	vIDArray = String(vLicenseID).split("-");
	vLicenseID = aa.cap.getCapID(vIDArray[0], vIDArray[1], vIDArray[2]).getOutput();

	if (vLicenseID != null) {
		// Get current expiration date.
		vLicenseObj = new licenseObject(null, vLicenseID);
		vExpDate = convertDate(vLicenseObj.b1ExpDate);
		// Extend expiration by 1 year
		vNewExpDate = new Date(vExpDate.getFullYear() + 1, vExpDate.getMonth(), vExpDate.getDate());

		// Update expiration date
		logDebug("Updating Expiration Date to: " + vNewExpDate);
		vLicenseObj.setExpiration(dateAdd(vNewExpDate, 0));
		// Set record expiration to active
		vLicenseObj.setStatus("Active");
		// set parent record status to Active
		updateAppStatus("Active", "Updated by 5082_HandleMiscServicesNARenewal.js", vLicenseID);
	}
	//Set renewal to Renewed status.
	updateAppStatus("Renewed", "Updated by 5082_HandleMiscServicesNARenewal.js", capId);
	//Set info field Date Last Updated so reports can use it.
	editAppSpecific("Date Last Updated", currentDate, capId);
	
	//Set renewal to complete, used to prevent more than one renewal record for the same cycle
	//renewalCapProject = getRenewalCapByParentCapIDForIncomplete(vLicenseID);
	//if (renewalCapProject != null) {
	//	renewalCapProject.setStatus("Renewed");
	//	aa.cap.updateProject(renewalCapProject);
	//}
	
	// send the email
	//script84_SendRenewalEmailWhenPermitIssuedComplete();
	sendEmailForRenew();
	UpdateMiscNARParent();	
	
}

function sendEmailForRenew() {
	// var envParameters = aa.util.newHashMap();
	// envParameters.put("capId", capId);
	// envParameters.put("cap", cap);
	// envParameters.put("AGENCYID", "AURORACO");
	// var vAsyncScript = "SEND_HOA_RENEW_EMAIL";
	// aa.runAsyncScript(vAsyncScript, envParameters)
	// logDebug("CapID info: " + envParameters);
	// logDebug("End of email renewal in 5082_HandleMiscServicesNARenewal");
	logDebug("***** Starting SEND_HOA_RENEW_EMAIL from script *****");
	try
	{
		var capId = aa.env.getValue("capId");
		var cap = aa.env.getValue("cap");
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
		var emailtemplate = "HOA RENEWAL CONFIRMATION LETTER";
		sendNotification("noreply@aurora.gov", emailTo, "", emailtemplate, tParams);
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
		if (!(contactArray[c].getPeople().getEmail() && contactArray[c].getPeople().getEmail().length() > 0))
				continue;
			if (getAll || exists(contactArray[c].getPeople().getContactType(), contactTypeArray))
			{
				result.push(contactArray[c].getPeople().getEmail());
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
	
}

function UpdateMiscNARParent() {
	logDebug("5082_HandleMiscServicesNARenewal.js started.");
	try{
		//if (ifTracer(wfTask == "Permit Issued" && wfStatus == "Complete", 'wfTask == Permit Issued && wfStatus == Complete')) 
		//{
            //get parent
            var childCapScriptModel,
                parentCapScriptModel,
                parentCapTypeString,
                parentCapId = getParentLicenseCapID(capId);

            if(ifTracer(parentCapId, 'parent found')) {
 
                childCapScriptModel = aa.cap.getCap(capId).getOutput();
                parentCapScriptModel = aa.cap.getCap(parentCapId).getOutput();
                parentCapTypeString = parentCapScriptModel.getCapType().toString();
                if(ifTracer(parentCapTypeString == 'Associations/Neighborhood/Association/Master', 'parent = Associations/Neighborhood/Association/Master')) {
                    // copy data from renewal to parent application
					// First, remove existing contacts to prevent doubling them up.
					logDebug("***** Removing Master record contacts *****");
					removeContactsFromCapByType(parentCapId, "President");
					removeContactsFromCapByType(parentCapId, "Board Member");
					removeContactsFromCapByType(parentCapId, "Referral Contact");
					removeContactsFromCapByType(parentCapId, "Property Manager");
					//Now proceed with the update
                    copyContacts(capId,parentCapId);
                    copyAppSpecific(parentCapId);
                    copyASIFields(capId,parentCapId);
                    copyASITables(capId,parentCapId);
                    copyAddresses(capId, parentCapId);
                    copyParcels(capId, parentCapId);
                    editAppName(childCapScriptModel.specialText, parentCapId);
					//closeTask("Review Application", "Complete", "Closed by Script 5082");
                }
            }
 		//}
	}
	catch(err){
		showMessage = true;
		comment("Error on custom function “5082_HandleMiscServicesNARenewal.js. Please contact administrator. Err: " + err);
		logDebug("Error on custom function “5082_HandleMiscServicesNARenewal.js. Please contact administrator. Err: " + err);
	}
}
	logDebug("5082_HandleMiscServicesNARenewal.js ended.");
