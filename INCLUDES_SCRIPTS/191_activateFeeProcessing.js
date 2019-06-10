if ("Waiting on Documents".equals(capStatus))
{
	activateTask("Fee Processing");
	updateAppStatus("Submitted", "Set via script");
}