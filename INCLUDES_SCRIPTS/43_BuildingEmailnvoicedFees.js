/*
When any fees are Invoiced in the Fee Tab, it needs to email the applicant and the contractor (including license professionals)
that fees are owed and they can click the link to go online to login to their account to view and pay their fees. 

Written by JMAIN
*/

if (balanceDue > 0)
{
  //email the applicant
  var contacts = "Applicant,Contractor(s)";
  var lptypes = "Contractor";
  var emailtemplate = "BLD_INVOICEDFEES";

  emailContactsWithReportLinkASync(contacts, emailtemplate, "", "", "", "N", "");
  coa_emailLicenseProfessionals(lptypes, emailtemplate, "", "", "", capId);
}