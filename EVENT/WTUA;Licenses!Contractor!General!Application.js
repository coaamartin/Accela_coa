//Last part of Script #106, Commercial and Residential are added via configurable script
//Looking to see if this has additonal code installed on the syetem by earlier programmer

if ("License Issuance".equals(wfTask) && "Ready to Pay".equals(wfStatus)) {
	// script 427
	var theFee = 125;
	if ("Commercial Building".equals(AInfo["Contractor Type"])) {
		theFee = 325;
	}
	if ("Residential Building".equals(AInfo["Contractor Type"])) {
		theFee = 195;
	}
	updateFee("LIC_020", "LIC_CONTRACTOR_GENERAL", "FINAL", theFee, "N");
	// end Script 427
   
   //include("5113_EMailReadyToPay");  
   
}

if ("License Issuance".equals(wfTask) && "Issued".equals(wfStatus))
{
  if ("License Issuance".equals(wfTask) && "Issued".equals(wfStatus) && balanceDue == 0) 
  {
   
    include("5114_EMailReadyLicenseIssue");
	include("5140_eMailLicensesContractor");
    include("111_CreateContractorLicenseAndLP");
    closeTask("License Issuance","Issued","Updated by WTUA;Licenses!Contractor!General!Application","");
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

