//written by JMAIN
//Email the MJ Applicant on application submission

//get a couple ASI fields
var preappdate = getAppSpecific("Pre Application Meeting Date") + ""; //force string
var preapptime = getAppSpecific("Pre Application Meeting Time") + ""; //force string

logDebug(preappdate);
logDebug(preapptime);

//what contact types should get an email - comma delimited string of contact types
var allowedcontacttypes = "Applicant";
	
//send email to all contacts with the apropriate template and report
var emailtemplate = "JD_TEST_TEMPLATE";

//populate the email parameters not already included for "free" - must examine the template to know
var joke = "Not a joke but the preapp date and time: " + preappdate + " - " + preapptime;
var emailparams = aa.util.newHashtable();
emailparams.put("$$Joke$$", joke);

//call Emmett's emailContacts function - this runs asynchronously - puts "deep link" to report in email
emailContacts(allowedcontacttypes, emailtemplate, emailparams, "", "", "N", "");

logDebug("Did it work?");
