/*
Title : Create license for professional license  (PaymentReceiveAfter)
Purpose : If paid in full, Create a parent license, copy the ASI's, and email the applicant

Author: Ahmad WARRAD
 
Functional Area : Records

Sample Call:
	createParentLicenseOnPRA("MESSAGE_NOTICE_PUBLIC WORKS");
*/

// Script 64
if (balanceDue == 0 && "Ready to Pay".equals(taskStatus("License Issuance"))) {
	include("64_CreateProfessionalLicenseAndLP");
	updateTask("License Issuance","Issued","Updated by PRA;Licenses!Professional!General!Application","");
	closeTask("License Issuance","Issued","Updated by PRA;Licenses!Professional!General!Application","");
}


//createParentLicenseOnPRA("MESSAGE_NOTICE_PUBLIC WORKS");
