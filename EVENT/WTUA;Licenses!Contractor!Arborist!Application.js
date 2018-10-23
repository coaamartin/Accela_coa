// Script 146
if ("License Issuance".equals(wfTask) && "Issued".equals(wfStatus)) {
	include("146_CreateArboristLicenseAndLP");
}

//JMP Added 10/22/18 per Script #77 request
if ("Application Intake".equals(wfTask) && "Additional Info Needed".equals(wfStatus)) 
{
	include("77-Email_Arborist_Applicant_MoreInfoNeeded");
}
