logDebug("490_Email_Tap_Invoice");

sysDate = aa.date.getCurrentDate();
sysDateMMDDYYYY = dateFormatted(sysDate.getMonth(), sysDate.getDayOfMonth(), sysDate.getYear(), "");


var contacts = "Applicant,Responsible Water Billing Party";
var emailtemplate = "WAT_TAP_APP_INVOICE_EMAIL";
 //build ACA URL
var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));  
var recURL = acaSite + getACAUrl();
var appTypeAlias = cap.getCapType().getAlias();

var emailparams = aa.util.newHashtable();
emailparams.put("$$altid$$", capId.getCustomID());
emailparams.put("$$todayDate$$", sysDateMMDDYYYY);
emailparams.put("$$capAlias$$", appTypeAlias);
emailparams.put("$$acaRecordURL$$", recURL);
emailContacts(contacts, emailtemplate, emailparams, "", "", "N", "");	