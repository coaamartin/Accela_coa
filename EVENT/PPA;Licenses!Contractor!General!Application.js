/*
Title : Create license for professional license  (PaymentReceiveAfter)
Purpose : If paid in full, Create a parent license, copy the ASI's, and email the applicant

Author: Ahmad WARRAD
 
Functional Area : Records

Sample Call:
	createParentLicenseOnPRA("MESSAGE_NOTICE_PUBLIC WORKS");
*/

// Script 64
if (balanceDue == 0) {
    include("5114_EMailReadyLicenseIssue");
    include("5140_eMailLicensesContractor");
     include("64_CreateProfessionalLicenseAndLP");
     closeTask("License Issuance","Issued","Updated by PRA;Licenses!Professional!General!Application","");
 }
 
 
 //createParentLicenseOnPRA("MESSAGE_NOTICE_PUBLIC WORKS");
 