/* JMP - 11/13/2018 - Script Item #58_Rescheduled SWMP

// Staff initiated Rescheduling of inspections on final on SWMP permit and echo initial on the application, send an email to the applicant with the date and inspection type.
 
*/

logDebug("JMP JMP Alert: ------------------------>> Script Item #58_Rescheduled SWMP");

if ("Final Inspection".equals(inspType))  //JMP
{
 
  logDebug("JMP - OK trapped for reschedule"); //JMP
  var contact = "Applicant";
  var template = "SWMP INSPECTION RESCHEDULED";
  var emailparams = aa.util.newHashtable();
  
  emailparams.put("$$todayDate$$", todayDateLongForm);  // JMP
  emailparams.put($$altID$$,altId);
  emailparams.put($$inspDate$$,inspDate);
  
  emailContacts(contact, template, emailparams, null, null, "N", "");	
 
}

