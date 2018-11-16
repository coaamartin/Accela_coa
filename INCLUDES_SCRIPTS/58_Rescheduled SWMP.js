/* JMP - 11/13/2018 - Script Item #58_Rescheduled SWMP

// Staff initiated Rescheduling of inspections on final on SWMP permit and echo initial on the application, send an email to the applicant with the date and inspection type.
 
*/

logDebug("JMP JMP Alert: ------------------------>> Script Item #58_Rescheduled SWMP");

if ("Final Inspection".equals(inspType))  //JMP
{
 
  logDebug("JMP - OK trapped #58 for reschedule"); //JMP
  
  var contact = "Applicant";
  var template = "SWMP INSPECTION RESCHEDULED";
  var emailparams = aa.util.newHashtable();
  
  var now = new Date();
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var todayDateLongForm = months[now.getMonth()] + " " + now.getDate() + ", " + now.getFullYear()
  
  var capIDString = capId.getCustomID();	
  var recordURL = getACARecordURL(vACAUrl);  
  logDebug(recordURL + "");
  
  emailparams.put("$$todayDate$$", todayDateLongForm);  // JMP
  emailparams.put("$$altID$$",capIDString);
  emailparams.put("$$inspDate$$",inspDate);
  emailparams.put("$$acaRecordUrl$$", recordURL);
  
  emailContacts(contact, template, emailparams, null, null, "N", "");	
 
}

