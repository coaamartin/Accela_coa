// SCRIPTNUMBER: 5114
// SCRIPTFILENAME: 5114_EMailReadyLicenseIssue
// PURPOSE: Email for Ready to Pay
// DATECREATED: 06/06/2019
// BY: JMPorter

logDebug('Started script 5114_EMailReadyLicenseIssue');
var balanceDue;
balanceDue = capDetail.getBalance();
logDebug("Balance Due: " + balanceDue);

if (appMatch("Licenses/Professional/General/Application") || appMatch("Licenses/Professional/General/Renewal")) {
   if (balanceDue == 0) {
      var asiValues = getAppSpecific("Qualifying Professional Type");
      licenseType = asiValues;
      var altID = capId.getCustomID();
      appType = cap.getCapType().toString();
      var invoiceNbrObj = getLastInvoice({});
      var invNbr = invoiceNbrObj.getInvNbr();
      var vAsyncScript = "SEND_EMAIL_LIC_QPL_CLL_RECEIPT";
      var emailTo = getEmailString(); 
	   var recordApplicant = getContactByType("License Holder", capId);
	   var firstName = recordApplicant.getFirstName();
      var lastName = recordApplicant.getLastName();
      var envParameters = aa.util.newHashMap();
      envParameters.put("altID", altID);
      envParameters.put("capId", capId);
      envParameters.put("cap", cap);
      envParameters.put("INVOICEID", String(invNbr));
      envParameters.put("licenseType", licenseType);
      envParameters.put("emailTo", emailTo);
      envParameters.put("recordApplicant", recordApplicant);
      envParameters.put("firstName", firstName);
      envParameters.put("lastName", lastName);
      envParameters.put("vemailTemplate", "BLD_QPL_LICENSE_ISSUANCE_#_64-65");
      logDebug("Starting to kick off ASYNC event for QPL issuance. Params being passed: " + envParameters);
      aa.runAsyncScript(vAsyncScript, envParameters);
      logDebug("---------------------> 5114_EMailReadyLicenseIssue.js ended.");
   }
}

if (appMatch("Licenses/Contractor/General/Application") || appMatch("Licenses/Contractor/General/Renewal")) {
   if (balanceDue == 0) {
      var asiValues = getAppSpecific("Contractor Type");
      licenseType = asiValues;
      var altID = capId.getCustomID();
      appType = cap.getCapType().toString();
      var invoiceNbrObj = getLastInvoice({});
      var invNbr = invoiceNbrObj.getInvNbr();
      var vAsyncScript = "SEND_EMAIL_LIC_QPL_CLL_RECEIPT";
      var emailTo = getEmailString2(); 
	   var recordApplicant = getContactByType("Applicant", capId);
	   var firstName = recordApplicant.getFirstName();
      var lastName = recordApplicant.getLastName();
      var envParameters = aa.util.newHashMap();
      envParameters.put("altID", altID);
      envParameters.put("capId", capId);
      envParameters.put("cap", cap);
      envParameters.put("INVOICEID", String(invNbr));
      envParameters.put("licenseType", licenseType);
      envParameters.put("emailTo", emailTo);
      envParameters.put("recordApplicant", recordApplicant);
      envParameters.put("firstName", firstName);
      envParameters.put("lastName", lastName);
      //envParameters.put("vemailTemplate", "BLD_CLL_LICENSE_ISSUANCE_#111");
      envParameters.put("vemailTemplate", "BLD_RECIEPT");
      logDebug("Starting to kick off ASYNC event for CLL payment reciept. Params being passed: " + envParameters);
      aa.runAsyncScript(vAsyncScript, envParameters);
      logDebug("Kicking off the license issuance email. ------->")
      //Below we will run the License report script
      var asiValues2 = getAppSpecific("Contractor Type");
      licenseType2 = asiValues;
      var altID2 = capId.getCustomID();
      appType2 = cap.getCapType().toString();
      var invoiceNbrObj2 = getLastInvoice({});
      var invNbr2 = invoiceNbrObj.getInvNbr();
      var vAsyncScript2 = "SEND_EMAIL_LIC_CONT_LIC";
      var emailTo2 = getEmailString2(); 
	   var recordApplicant2 = getContactByType("Applicant", capId);
	   var firstName2 = recordApplicant.getFirstName();
      var lastName2 = recordApplicant.getLastName();
      var envParameters2 = aa.util.newHashMap();
      envParameters2.put("altID", altID2);
      envParameters2.put("capId", capId);
      envParameters2.put("cap", cap);
      envParameters2.put("INVOICEID", String(invNbr2));
      envParameters2.put("licenseType", licenseType2);
      envParameters2.put("emailTo", emailTo2);
      envParameters2.put("recordApplicant", recordApplicant2);
      envParameters2.put("firstName", firstName2);
      envParameters2.put("lastName", lastName2);
      envParameters2.put("vemailTemplate", "BLD QPL LICENSE ISSUANCE # 64&65");
      logDebug("Starting to kick off ASYNC event for CLL issuance of the license. Params being passed: " + envParameters2);
      aa.runAsyncScript(vAsyncScript2, envParameters2);
      logDebug("---------------------> 5114_EMailReadyLicenseIssue.js ended.");
   }


}
function getEmailString()
{
	var emailString = "";
	var contactArray = getPeople(capId);

	//need to add inspection contact below to this logic 
	for (var c in contactArray)
	{
		if (contactArray[c].getPeople().getEmail() && contactArray[c].getPeople().contactType == "License Holder")
		{
			emailString += contactArray[c].getPeople().getEmail() + ";";

		}
	}
	logDebug(emailString);
	return emailString;
}

   function getEmailString2()
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
//emailContacts(contactType,vEmailTemplate, vEParams, "", "", "N", "");
// if(appMatch("Licenses/Professional/General/Application"))
// {
//    var contactType = "License Holder";
//    var licenseType = "Qualified Professional";
//    var addressType = "Business";

//    var vEmailTemplate = "BLD_QPL_LICENSE_ISSUANCE_#_64-65"; 
//    var vEParams = aa.util.newHashtable();
      
//    var asiValues = new Array();
//    loadAppSpecific(asiValues);     
//    addParameter(vEParams, "$$LicenseType$$", asiValues["Qualifying Professional Type"]);
// }


// if(appMatch("Licenses/Contractor/General/Application"))
// {   

//    var contactType = "Applicant";
//    var licenseType = "Contractor";
//    var addressType = "Business";
   
//    var vEmailTemplate = "BLD_CLL_LICENSE_ISSUANCE_#111"; 
//    var vEParams = aa.util.newHashtable();
   
//    var asiValues = new Array();
//    loadAppSpecific(asiValues);     
//    addParameter(vEParams, "$$LicenseType$$", asiValues["Contractor Type"]);
  
// }  
   
// emailContacts(contactType,vEmailTemplate, vEParams, "", "", "N", "");   

logDebug('Ended script 5114_EMailReadyLicenseIssue');
