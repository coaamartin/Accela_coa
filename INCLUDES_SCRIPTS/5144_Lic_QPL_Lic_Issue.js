// SCRIPTNUMBER: 5144
// SCRIPTFILENAME: 5144_Lic_QPL_Lic_Issue.js
// PURPOSE: Email when License is ready to issue.
// DATECREATED: 07/15/2021
// BY: rprovinc

logDebug('Started script 5144_Lic_QPL_Lic_Issue.js');
wait(10000);
var balanceDue;
balanceDue = capDetail.getBalance();
logDebug("Balance Due: " + balanceDue);

if (appMatch("Licenses/Professional/General/Application") || appMatch("Licenses/Professional/General/Renewal")) {
    if (balanceDue == 0) {
        //need to send the receipt below
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
        var vAsyncScript = "SEND_EMAIL_LIC_QPL_CLL_LIC";
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
        envParameters.put("vemailTemplate", "BLD QPL LICENSE ISSUANCE # 64&65");
        logDebug("Starting to kick off ASYNC event for QPL LIC issuance. Params being passed: " + envParameters);
        aa.runAsyncScript(vAsyncScript, envParameters);

        logDebug("---------------------> 5144_Lic_QPL_Lic_Issue.js ended.");
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

function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }