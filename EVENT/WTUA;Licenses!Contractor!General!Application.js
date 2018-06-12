//Last part of Script #106, Commercial and Residential are added via configurable script

if ("License Issuance".equals(wfTask) && "Ready to Pay".equals(wfStatus)) {
	var contType = getAppSpecific("Contractor Type");
	if (!matches(contType, "Commercial Building", "Residential Building")) {
		updateFee("LIC_020", "LIC_CONTRACTOR_GENERAL", "FINAL", 125, "Y");
	}
}

// Script 111
if ("License Issuance".equals(wfTask) && "Issued".equals(wfStatus)) {
	include("111_CreateContractorLicenseAndLP");
}
