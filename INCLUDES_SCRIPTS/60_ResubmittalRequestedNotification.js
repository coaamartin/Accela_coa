/*
when Resubmittal Requested is selected on any wf step in Building/Permit/~/~ send the applicant and contractor contacts an 
email notification to log on to ACA and review their marked up plans. The Record status on ACA should also change to 
Resubmittal Requested.​

Building/Permit/~/~

Email template created "BLD RESUBMITTAL NOTIFICATION"
necessary vars:  $$wfTask$$, $$wfComment$$

written by SWAKIL
*/
logDebug("Start executing 60_ResubmittalRequestedNotification");
var targetStatusArray = ["Resubmittal Requested"];
if (exists(wfStatus, targetStatusArray))
{
		var contacts = "Applicant";
		var emailtemplate = "BLD RESUBMITTAL NOTIFICATION";
		//build ACA URL
		var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
		acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));  
		var recURL = acaSite + getACAUrl();
		var appTypeAlias = cap.getCapType().getAlias();

		//get contact
		var aContact = getContactByType("Applicant", capId);
		var fName = "";
		var lName = "";
		if (aContact) {fName = aContact.getFirstName(); lName = aContact.getLastName();}

		var emailparams = aa.util.newHashtable();
		emailparams.put("$$altid$$", capId.getCustomID());
		emailparams.put("$$todayDate$$", wfDate);
		emailparams.put("$$capAlias$$", appTypeAlias);
		emailparams.put("$$FirstName$$", fName);
		emailparams.put("$$LastName$$", lName);
		emailparams.put("$$acaURL$$", recURL);
		emailparams.put("$$wfComment$$", wfComment);
		emailparams.put("$$wfTask$$", wfTask);
		emailContacts(contacts, emailtemplate, emailparams, "", "", "N", capId);
      logDebug("JMP .. Just sent email to Applicant");
      
	
		//jmain edit - add LPs to email...
		var lptypes = "Contractor";
		coa_emailLicenseProfessionals(lptypes, emailtemplate, "", "", "", capId);

		//update record status
		// Commented this out at the request of the clienbt for Christy Paulin 9/11/2018
		//updateAppStatus("Resubmittal Requested", "");
		
}
logDebug("Finished executing 60_ResubmittalRequestedNotification");
