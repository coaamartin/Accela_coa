//created by swakil
//edited by JMAIN - altered email template 07/17/2018

logDebug("Starting Script...");

if(wfTask=="Plan Review" && wfStatus=="Resubmittal Requested"){
	var contact = "Applicant";
	var template = "WAT_IRR_PLAN_RESUB";
	//must inlcude an emailparams hashtable even if we don't use it.
	var emailparams = aa.util.newHashtable();
	emailContacts(contact, template, emailparams, "", "", "N", "");
}
