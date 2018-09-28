//Emails the license professionals of a certain type in a record
//written by jmain and using the async email functions provided by Emmett.

/*
lptypes = comma separated string of LP types (e.g. "Contractor,Architect,Barber")
emailtemplate = exact string of the email template we're using
emailparams = a hash table of necessary email params - remember, the Emmett email
			  function has a bunch of "built-ins" which do not need to be specifically included.
			  use "" if there are no email params.
report = the exact string of the report name.  use "" if there is no report to include a link to.
reportparams = a hash table of the necessary report parameters.  use "" if irrelevant.
capId = the capId of the current record
*/

function coa_emailLicenseProfessionals(lptypes,emailtemplate,emailparams,report,reportparams,capId)
{
	logDebug("Entering coa_emailLicenseProfessionals");
	
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
		if (lptypesarray.indexOf(lptype) != -1)
		{
			logDebug("Sending email to " + lpemail);
			//aa.env.setValue("eventType","Batch Process");
			emailWithReportLinkASync(lpemail, emailtemplate, emailparams, report, reportparams, "N", "");
		}
	}
	return;
}
	