//created by swakil
//edited by JMAIN - altered email template 07/17/2018

logDebug("Starting Script... #34");

if(wfTask=="Plan Review" && wfStatus=="Resubmittal Requested"){
	var contact = "Applicant";
	var template = "WAT_IRR_PLAN_RESUB";
	//must inlcude an emailparams hashtable even if we don't use it.
	//wfComment is NOT included as a built-in so we must add it if the email template requires this variable
	var emailparams = aa.util.newHashtable();
	emailparams.put(wfComment);
	emailContacts(contact, template, emailparams, "", "", "N", "");
}
