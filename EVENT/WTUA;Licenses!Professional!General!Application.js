// Script 64
// Script 106 JMP 

//if ("License Issuance".equals(wfTask) && "Issued".equals(wfStatus) && balanceDue == 0) {
//   logDebug("JMP - Trying to email");
//   include("64_CreateProfessionalLicenseAndLP");
//}

if ("License Issuance".equals(wfTask) && "Ready to Pay".equals(wfStatus)) 
{
   
   //include("5113_EMailReadyToPay");
   
	// script 427
	var theFee = 102;
   updateFee("LIC_110", "LIC_PROFESSIONAL_GENERAL", "FINAL", theFee, "N");
}

if ("License Issuance".equals(wfTask) && "Issued".equals(wfStatus)) 
{
  if ("License Issuance".equals(wfTask) && "Issued".equals(wfStatus) && balanceDue == 0) 
  {
   
   include("5114_EMailReadyLicenseIssue");
	include("64_CreateProfessionalLicenseAndLP");   
	closeTask("License Issuance","Issued","Updated by WTUA;Licenses!Professional!General!Application","");
   
  } 
}

if ("License Issuance".equals(wfTask) && "Additional Info Required".equals(wfStatus)) 
{
	include("5115_EMailDeclineMoreInfo");
}

if ("License Issuance".equals(wfTask) && "Denied".equals(wfStatus)) 
{
	include("5115_EMailDeclineMoreInfo");
}
