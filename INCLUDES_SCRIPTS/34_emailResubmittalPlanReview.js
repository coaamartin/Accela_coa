logDebug("Starting Script...");

if(wfTask=="Plan Review" && wfStatus=="Resubmittal Requested"){
	var contact = "Applicant";
	var template = "JD_TEST_TEMPLATE";
	var joke = "Where there's a will, there's a relative.";
	var emailparams = aa.util.newHashtable();
	emailparams.put("$$Joke$$", joke);
	emailContacts(contact, template, emailparams, "", "", "N", "");
}
