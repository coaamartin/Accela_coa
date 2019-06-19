
if ("License Status".equals(wfTask) && "About to Expire".equals(wfStatus)) 
{
   
	include("5117_EMailAboutToExpire");
   
   var theFee = 102;
   updateFee("LIC_130", "LIC_PROFESSIONAL_RENEWAL", "FINAL", theFee, "N");
   
}
