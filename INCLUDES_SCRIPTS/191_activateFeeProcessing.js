if ("Waiting on Docuements".equals(capStatus))
{
	activateTask("Fee Processing");
	updateAppStatus("Submitted", "Set via script");
}