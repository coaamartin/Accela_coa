if ("Waiting on Documents".equals(capStatus) && isTaskStatus("Plan Review","Resubmittal Requested"))
{
	activateTask("Plan Review");
	updateAppStatus("In Review", "Set via script");
} else if ("Waiting on Documents".equals(capStatus) && isTaskStatus("Application Submittal","Plans Required"))
{
	activateTask("Fee Processing");
	updateAppStatus("Submitted", "Set via script");
}