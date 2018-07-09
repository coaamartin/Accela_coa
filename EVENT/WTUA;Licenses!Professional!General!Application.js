// Script 64
if ("License Issuance".equals(wfTask) && "Issued".equals(wfStatus) && balanceDue == 0) {
	include("64_CreateProfessionalLicenseAndLP");
}
