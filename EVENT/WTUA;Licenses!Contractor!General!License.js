
if ("License Status".equals(wfTask) && "About to Expire".equals(wfStatus)) 
{
   
   var theFee = 125;
	if ("Commercial Building".equals(AInfo["Contractor Type"])) {
		theFee = 300;
	}
	if ("Residential Building".equals(AInfo["Contractor Type"])) {
		theFee = 180;
	}
	updateFee("LIC_020", "LIC_CONTRACTOR_GENERAL", "FINAL", theFee, "N");
   
	include("5117_EMailAboutToExpire");
   
}
