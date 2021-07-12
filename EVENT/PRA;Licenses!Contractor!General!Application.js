// Script 111
if (balanceDue == 0) {
   
   include("5114_EMailReadyLicenseIssue");
   include("5140_eMailLicensesContractor");
	include("111_CreateContractorLicenseAndLP");
	closeTask("License Issuance","Issued","Updated by PRA;Licenses!Contractor!General!Application","");
}

