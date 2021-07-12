// Script 111
if (balanceDue == 0) {
   
   include("5114_EMailReadyLicenseIssue");
   include("5140_eMailLicensesContractor");
   wait(10000);
	include("111_CreateContractorLicenseAndLP");
	closeTask("License Issuance","Issued","Updated by PRA;Licenses!Contractor!General!Application","");
}

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

