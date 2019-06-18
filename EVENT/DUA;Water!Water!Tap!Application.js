//Script 482 SWAKIL
//When wfTask - "Application Submittal" is active and the Record Status is "Waiting on Documents", 
//update the record status to "Submitted" when documents are uploaded via AA or ACA

if (isTaskActive("Application Submittal") && appStatus.equals("Waiting on Documents"))
{
	updateAppStatus("Submitted","");
}

