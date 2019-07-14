//SWAKIL
logDebug("3001_Water_DocUpload");
if (appMatch("Water/Water/SWMP/Application"))
{
	if (isTaskActive("Application Submittal") && "Waiting on Documents".equals(capStatus))
	{
		updateAppStatus("Submitted", "Updated via script");
	}
}
else if (appMatch("Water/Water/SWMP/Permit"))
{
	if (isTaskActive("Final Certification") && "Waiting on Re-Certs".equals(capStatus))
	{
		updateAppStatus("Re-Certs Received", "Updated via script");
	}
}
else if (appMatch("Water/Water/PPBMP/NA"))
{
	if (isTaskActive("Annual Report") && "Active".equals(capStatus))
	{
		updateTask("Annual Report", "Annual Report Received", "Updated via Script", null);
	}
}