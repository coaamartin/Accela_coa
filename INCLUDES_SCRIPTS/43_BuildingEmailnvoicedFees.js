/*
When any fees are Invoiced in the Fee Tab, it needs to email the applicant and the contractor that fees are owed and they can click the link to go online to login to their account to view and pay their fees. 

Written by JMAIN
*/

if (balanceDue > 0)
{
  //email the applicant
  var contact = "Applicant"; //Cont
  var template = "BLD_INVOICEDFEES";
  var emailparams = aa.util.newHashtable();
  //emailparams.put("$$invoideFees$$", feesString);
  emailContacts(contact, template, emailparams, "", "", "N", "");
}

