// Script 64

if ("License Issuance".equals(wfTask) && "Ready to Pay".equals(wfStatus)) 
{
	// script 427
	var theFee = 102;
}
	updateFee("LIC_020", "LIC_CONTRACTOR_GENERAL", "FINAL", theFee, "Y");
	// end Script 427


if ("License Issuance".equals(wfTask) && "Issued".equals(wfStatus) && balanceDue == 0) {
	include("64_CreateProfessionalLicenseAndLP");
}

//SWAKIL

//include("50_ReadyToPayWF");
