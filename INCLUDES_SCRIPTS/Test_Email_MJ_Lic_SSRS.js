/*

Testing to see if an SSRS report is generated
Using Record:  18-000021-MJS (aplication) and License 18-000066-MJS

*/
if ("License Issuance".equals(wfTask) && "Issued".equals(wfStatus))
{
		var contacts = "Applicant";
		var emailtemplate = "JD_TEST_TEMPLATE";
		var reportname = "JD_TEST_SSRS"
		
		var emailparams = aa.util.newHashtable();
		emailparams.put("$$wfComment$$", wfComment);
		emailparams.put("$$Joke$$", "blah blah blah");
		
		var reportparams = aa.util.newHashtable();
		reportparams.put("Record_ID", myCapId);
		
		logDebug("about to send the email...")
		emailContacts(contacts, emailtemplate, emailparams, reportname, reportparams, "N", "");		
		logDebug("Did it work?");
}
