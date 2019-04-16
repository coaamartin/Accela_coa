
// SCRIPTNUMBER: 58
// SCRIPTFILENAME: 58_Rescheduled SWMP.js
// PURPOSE: Additional Info Required Email for Licenses MJ Applications
// DATECREATED: 03/14/2019
// BY: JMPorter

logDebug("JMPorter JMPorter Alert: ------------------------>> Script Item #58_Rescheduled SWMP");

if ("Final Inspection".equals(inspType)) //JMPorter
{
 
  logDebug("JMPorter - OK trapped #58 for reschedule"); //JMPorter
  
  var contact = "JMPorterorter@auroragov.org";
  //var contact = "Applicant";
  var template = "SWMP INSPECTION RESCHEDULED";
  var emailparams = aa.util.newHashtable();
  
  var now = new Date();
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  var todayDateLongForm = months[now.getMonth()] + " " + now.getDate() + ", " + now.getFullYear()
  var inspDate = inspSchedDate;  
  
  emailparams.put("$$todayDateLongForm$$", todayDateLongForm);  // JMPorter
  emailparams.put("$$inspDate$$",inspDate);
  
  // emailContacts(contact, template, emailparams, null, null, "N", "");	
  emailContacts(contact, template, emailparams, null, null, "N", "");	//test code
}

