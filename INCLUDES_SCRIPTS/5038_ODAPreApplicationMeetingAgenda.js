//written by JMAIN

logDebug("Starting email ODA PreApp agenda");
if (wfTask == "Finalize Agenda" && wfStatus == "Complete")
{
	//need to get an ODA distro group - use emailAsync for this one
	var emailtemplate = "JD_TEST_TEMPLATE";
	var distroemail = "odapreappteam@auroragov.org";
	var joke = "This will eventually be a real Email template - for now, just pretend.";
	var emailparams = aa.util.newHashtable();
	emailparams.put("$$Joke$$", joke);
	emailparams.put("$$wfComment$$", wfComment + "");
	
	//need to get the ODA Agenda Report
	var reportname = "JD_TEST_REPORT";
	var reportparams = aa.util.newHashtable();
	reportparams.put("DEPARTMENT", "Administrator");
	
	emailAsync(distroemail, emailtemplate, emailparams, reportname, reportparams, "", "");
	logDebug("Called emailAsync...");
}

