if (balanceDue > 0)
{
  //email the applicant
  var contacts = "Individual";
  var emailtemplate = "JD_TEST_TEMPLATE";

  emailContactsWithReportLinkASync(contacts, emailtemplate, "", "", "", "N", "");
}