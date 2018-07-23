/*
When any fees are Invoiced in the Fee Tab, it needs to email the applicant and the contractor that fees are owed and they can click the link to go online to login to their account to view and pay their fees. 

Written by JMAIN
*/

if (balanceDue > 0)
{
  //email the applicant
  var contact = "Applicant"; //Cont
  var template = "BLD_INVOICEDFEES";
  var fullName = "";
  //get contact
  var aContact = getContactByType(contact, capId);
  if (aContact) fullName = aContact.getFullName() || aContact.getFirstName() + " " + aContact.getLastName();
  //build ACA URL
  var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
  acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));  
  var recURL = acaSite + getACAUrl();

  //email parameters
  var eParams = aa.util.newHashtable();
  addParameter(eParams, "$$acaRecordUrl$$", recURL);
  addParameter(eParams, "$$altID$$", capId.getCustomID());
  addParameter(eParams, "$$ContactFullName$$", fullName);
  //emailparams.put("$$invoideFees$$", feesString);
  emailContacts(contact, template, eParams, "", "", "N", "");
}