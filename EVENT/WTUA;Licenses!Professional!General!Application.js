// Script 64
// Script 106 JMP 

if ("License Issuance".equals(wfTask) && "Issued".equals(wfStatus) && balanceDue == 0) {
   logDebug("JMP - Trying to email");
	include("64_CreateProfessionalLicenseAndLP");
}

if ("License Issuance".equals(wfTask) && "Ready to Pay".equals(wfStatus)) 
{
	// script 427
	var theFee = 102;
   updateFee("LIC_110", "LIC_PROFESSIONAL_GENERAL", "FINAL", theFee, "N");
}

