logDebug("Creating Parent License");
var contactType = "Applicant";
var licenseType = "Contractor";
var addressType = "Business";
var appName = cap.getSpecialText();
var createdApp = aa.cap.createApp("Licenses", "Contractor", "General", "License", appName);
if (!createdApp.getSuccess()) {
	logDebug("**ERROR creating app failed, error: " + createdApp.getErrorMessage());
}
createdApp = createdApp.getOutput();
logDebug("Creating Parent License : " + createdApp.getCustomID());
//add as parent:
var related = aa.cap.createAppHierarchy(createdApp, capId);
if (!related.getSuccess()) {
	logDebug("**ERROR createAppHierarchy failed, error: " + related.getErrorMessage());
}

//copy data:
copyContacts(capId, createdApp);
copyAppSpecific(createdApp);

var licenseNbr = null;
var contact = getContactByType(contactType, capId);


//contact required exist on child (current) record
//if (contact) {
	logDebug("Creating Ref LP");
	vExpDate = new Date();
	vNewExpDate = new Date(vExpDate.getFullYear() + 1, vExpDate.getMonth(), vExpDate.getDate());
	vNewExpDate.setDate(1);
	if (vNewExpDate.getMonth() == 11) {
		vNewExpDate.setMonth(0);
		vNewExpDate.setFullYear(vNewExpDate.getFullYear() + 1);
	} else {
		vNewExpDate.setMonth(vNewExpDate.getMonth() + 1);
	}
	//vNewExpDate = new Date(vNewExpDate - 1);
   
   var vEmailTemplate = "BLD_CLL_LICENSE_ISSUANCE_#111";
	var vEParams = aa.util.newHashtable();
   
	//addParameter(vEParams, "$$LicenseType$$", appTypeAlias);
	//addParameter(vEParams, "$$ExpirationDate$$", dateAdd(vNewExpDate,0));
	//addParameter(vEParams, "$$ApplicationID$$", createdApp.getCustomID());
	//addParameter(vEParams, "$$altID$$", createdApp.getCustomID());

	//tmpCap = capId;
	//capId = createdApp;
   logDebug("emailing from #111 - JMP");
   
	emailContacts_JMP(contactType,vEmailTemplate, vEParams, "", "");
   
	//capId = tmpCap;
	
	var licenseNbr;
   
   if (contact) {
  	  var licensesByName = aa.licenseScript.getRefLicensesProfByName(aa.serviceProvider, contact.getFirstName(), contact.getMiddleName(), contact.getLastName());

	  if (licensesByName.getSuccess()) {
	  	  licensesByName = licensesByName.getOutput();

		  if (licensesByName != null && licensesByName.length > 0) {
			  licenseNbr = licensesByName[0].getStateLicense();
			  logDebug("Using Existing Ref LP: " + licenseNbr);
		   }
	   }
   }   

	if (!licenseNbr) {
		/*
		// no requirements on sequence number, but leave here just in case
		if (licenseNbr == null) {
		licenseNbr = getNextSequence(seqType, seqName, maskName);
		}
		 */

		licenseNbr = createdApp.getCustomID();
		createRefLP4Lookup(licenseNbr, licenseType, contactType, addressType);
		logDebug("Created Ref LP: " + createdApp.getCustomID());
	}
	var theRefLP = aa.licenseScript.getRefLicensesProfByLicNbr(aa.serviceProvider, licenseNbr).getOutput();

	if (theRefLP != null && theRefLP.length > 0) {
		logDebug("Updating Ref LP Expiry : " + vNewExpDate);

		theRefLP = theRefLP[0];
		aa.licenseScript.associateLpWithCap(createdApp, theRefLP);
		theRefLP.setLicenseExpirationDate(aa.date.getScriptDateTime(vNewExpDate));
		var editRefResult = aa.licenseScript.editRefLicenseProf(theRefLP);

		rB1ExpResult = aa.expiration.getLicensesByCapID(createdApp).getOutput();
		rB1ExpResult.setExpDate(aa.date.getScriptDateTime(vNewExpDate));
		rB1ExpResult.setExpStatus("Active");
		aa.expiration.editB1Expiration(rB1ExpResult.getB1Expiration());
	}
	
function emailContacts_JMP(sendEmailToContactTypes, emailTemplate, vEParams, reportTemplate, vRParams) {
	var vChangeReportName = "";
	var conTypeArray = [];
	var validConTypes = getContactTypes();
	var x = 0;
	var vConType;
	var vAsyncScript = "SEND_EMAIL_ASYNC";
	var envParameters = aa.util.newHashMap();
	var vAddAdHocTask = true;

	//Ad-hoc Task Requested
	if (arguments.length > 5) {
		vAddAdHocTask = arguments[5]; // use provided prefrence for adding an ad-hoc task for manual notification
		if (vAddAdHocTask == "N") {
logDebug("No adhoc task");			
			vAddAdHocTask = false;
		}
	}
	
	//Change Report Name Requested
	if (arguments.length > 6) {
		vChangeReportName = arguments[6]; // use provided report name
	}

logDebug("Provided contact types to send to: " + sendEmailToContactTypes);
	
	//Check to see if provided contact type(s) is/are valid
	if (sendEmailToContactTypes != "All" && sendEmailToContactTypes != null && sendEmailToContactTypes != '') {
		conTypeArray = sendEmailToContactTypes.split(",");
	}
	for (x in conTypeArray) {
		//check all that are not "Primary"
		vConType = conTypeArray[x];
		if (vConType != "Primary" && !exists(vConType, validConTypes)) {
			logDebug(vConType + " is not a valid contact type. No actions will be taken for this type.");
			conTypeArray.splice(x, (x+1));
		}
	}
	//Check if any types remain. If not, don't continue processing
	if ((sendEmailToContactTypes != "All" && sendEmailToContactTypes != null && sendEmailToContactTypes != '') && conTypeArray.length <= 0) {
		logDebug(vConType + " is not a valid contact type. No actions will be taken for this type.");
		return false;	
	}
	else if((sendEmailToContactTypes != "All" && sendEmailToContactTypes != null && sendEmailToContactTypes != '') && conTypeArray.length > 0) {
		sendEmailToContactTypes = conTypeArray.toString();
	}
	
logDebug("Validated contact types to send to: " + sendEmailToContactTypes);	
	//Save variables to the hash table and call sendEmailASync script. This allows for the email to contain an ACA deep link for the document
	envParameters.put("sendEmailToContactTypes", sendEmailToContactTypes);
	envParameters.put("emailTemplate", emailTemplate);
	envParameters.put("vEParams", vEParams);
	envParameters.put("reportTemplate", reportTemplate);
	envParameters.put("vRParams", vRParams);
	envParameters.put("vChangeReportName", vChangeReportName);
	envParameters.put("CapId", capId);
	envParameters.put("vAddAdHocTask", vAddAdHocTask);
	
	//Start modification to support batch script
	var vEvntTyp = aa.env.getValue("eventType");
	if (vEvntTyp == "Batch Process") {
		aa.env.setValue("sendEmailToContactTypes", sendEmailToContactTypes);
		aa.env.setValue("emailTemplate", emailTemplate);
		aa.env.setValue("vEParams", vEParams);
		aa.env.setValue("reportTemplate", reportTemplate);
		aa.env.setValue("vRParams", vRParams);
		aa.env.setValue("vChangeReportName", vChangeReportName);
		aa.env.setValue("CapId", capId);
		aa.env.setValue("vAddAdHocTask", vAddAdHocTask);		
		//call sendEmailASync script
		logDebug("Attempting to run Non-Async: " + vAsyncScript);
		aa.includeScript(vAsyncScript);
	}
	else {
		//call sendEmailASync script
		logDebug("Attempting to run Async: " + vAsyncScript);
		aa.runAsyncScript(vAsyncScript, envParameters);
	}
	//End modification to support batch script
	
	return true;
}