if (balanceDue > 0)
{
  //email the applicant
  var contacts = "Applicant,Contractor(s)";
  var lptypes = "Contractor";
  var emailtemplate = "JD_TEST_TEMPLATE";

  emailContactsWithReportLinkASync(contacts, emailtemplate, "", "", "", "N", "");
  coa_emailLicenseProfessionals(lptypes, emailtemplate, "", "", "", capId);
}