//Script 480 - SWAKIL
if (balanceDue == 0) {
	closeTask("Fee Processing", "Fees Paid", "by script, PRA balance=0", "by script, PRA balance=0");
	activateTask("Water Meter Set");
	updateAppStatus("Ready for Meter Set", "by script, PRA balance=0");

	//send email
	var template = "JD_TEST_TEMPLATE";
	var emailparams = aa.util.newHashtable();
	var reportparams = aa.util.newHashtable();
	var contact = "Developer";
    //build ACA URL
    var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
    acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));  
    var recURL = acaSite + getACAUrl();     
    //create email parameters
    emailparams.put("$$date$$", sysDateMMDDYYYY);
    emailparams.put("$$altID$$", capId.getCustomID());
    emailparams.put("$$recLink$$", recURL);	
    //send emails
	emailLicenseProfessionals("ALL", template, emailparams, "", reportparams, capId);
	emailContacts(contact, template, emailparams, "", reportparams, "N", "");
}


function emailLicenseProfessionals(lptypes,emailtemplate,emailparams,report,reportparams,capId)
{
	logDebug("Entering emailLicenseProfessionals");
	
	//split and trim the lptypes
	var lptypesarray = lptypes.split(",").map(function(item) {return item.trim();});
	
	//get array of all LPs in the record
	var lparray = getLicenseProfessional(capId);
	
	//send an email to all the LPs requested
	for (var i in lparray)
	{
		lp = lparray[i];
		lpemail = lp.getEmail() + ""; //force string
		lptype = lp.licenseType + ""; //force string
		logDebug(lptype + " : " + lpemail);
		
		//if the lptype is in the lptypesarray, send an email...
		if (lptypesarray.indexOf(lptype) != -1 || "ALL".equals(lptypes))
		{
			logDebug("Sending email to " + lpemail);
			//aa.env.setValue("eventType","Batch Process");
			emailWithReportLinkASync(lpemail, emailtemplate, emailparams, report, reportparams, "N", "");
		}
	}
	return;
}