//Last part of Script #106, Commercial and Residential are added via configurable script

if ("License Issuance".equals(wfTask) && "Ready to Pay".equals(wfStatus)) {
	// script 427
	var theFee = 125;
	if ("Commercial Building".equals(AInfo["Contractor Type"])) {
		theFee = 300;
	}
	if ("Residential Building".equals(AInfo["Contractor Type"])) {
		theFee = 180;
	}
	updateFee("LIC_020", "LIC_CONTRACTOR_GENERAL", "FINAL", theFee, "N");
	// end Script 427
}

// Script 111
if ("License Issuance".equals(wfTask) && "Issued".equals(wfStatus)) {
	include("111_CreateContractorLicenseAndLP");
}
