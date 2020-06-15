// Script 146
if ("License Issuance".equals(wfTask) && "Issued".equals(wfStatus)) {
	include("146_CreateArboristLicenseAndLP");

	var pCapId = getParent();
	if (pCapId) {
		var vAsyncScript = "RUN_ARBORIST_LICENSE_REPORT";
		var envParameters = aa.util.newHashMap();
		envParameters.put("CapId", pCapId);
		aa.runAsyncScript(vAsyncScript, envParameters);
	}
}

//JMPorter Added 10/22/18 per Script #77 request
if ("Application Intake".equals(wfTask) && "Additional Info Needed".equals(wfStatus)) 
{
	include("5077-Email_Arborist_Applicant_MoreInfoNeeded");
}

//added @ go live to ensure fees get invoiced

if (("Application Intake".equals(wfTask) && ("Accepted".equals(wfStatus) || "Accepted No Test".equals(wfStatus))))
{
	invoiceFee("LIC_CONT_A01","FINAL");
}