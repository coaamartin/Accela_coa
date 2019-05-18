// Script 64
// Script 106 JMP 

if ("License Issuance".equals(wfTask) && "Ready to Pay".equals(wfStatus)) 
{
	// script 427
	var theFee = 102;
}
	updateFee("LIC_110", "LIC_PROFESSIONAL_GENERAL", "FINAL", theFee, "N");
	// 


if ("License Issuance".equals(wfTask) && "Issued".equals(wfStatus) && balanceDue == 0) {
	include("64_CreateProfessionalLicenseAndLP");
}

//SWAKIL

//include("5050_ReadyToPayWF");
