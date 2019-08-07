logDebug("491_Email_Water_Meter_Pass");

var contacts = "Applicant,Responsible Water Billing Party";
var emailtemplate = "WAT_TAP_METER_SET_PASS";
 //build ACA URL
var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));  
var recURL = acaSite + getACAUrl();
var appTypeAlias = cap.getCapType().getAlias();

var emailparams = aa.util.newHashtable();
emailparams.put("$$altid$$", capId.getCustomID());
emailparams.put("$$todayDate$$", wfDate);
emailparams.put("$$capAlias$$", appTypeAlias);
emailparams.put("$$acaRecordURL$$", recURL);
emailContacts(contacts, emailtemplate, emailparams, "", "", "N", "");	