logDebug("487_Assess_Water_Utility_Fees");
var tService = AInfo["Type of Service"];
if (publicUser)
{
	if ("Fire Line Repair".equals(tService))
	{
		addFee("WAT_US_03", "WAT_US", 'FINAL', 1, 'Y');
	}
	else if ("Sewer Repair".equals(tService))
	{
		addFee("WAT_US_02", "WAT_US", 'FINAL', 1, 'Y');
	}
	else if ("Water Repair".equals(tService))
	{
		addFee("WAT_US_01", "WAT_US", 'FINAL', 1, 'Y');
	}
}
else if (!"undefined".equals(typeof(wfTask)) && "Inspection".equals(wfTask) && "Ready to Pay".equals(wfStatus))
{
	if ("Fire Line Repair".equals(tService))
	{
		addFee("WAT_US_03", "WAT_US", 'FINAL', 1, 'Y');
	}
	else if ("Sewer Repair".equals(tService))
	{
		addFee("WAT_US_02", "WAT_US", 'FINAL', 1, 'Y');
	}
	else if ("Water Repair".equals(tService))
	{
		addFee("WAT_US_01", "WAT_US", 'FINAL', 1, 'Y');
	}
}