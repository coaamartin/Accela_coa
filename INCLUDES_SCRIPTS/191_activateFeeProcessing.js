if ("Waiting on Documents".equals(capStatus))
{
	activateTask("Fee Processing");
	updateAppStatus("In Review", "Set via script");
}