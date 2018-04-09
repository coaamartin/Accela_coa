/*
When wf step "Application Submittal" status = "Specific Contract Fees - Accepted" then 
status wf step "Fee Processing" =  "Ready to Pay with Specific Contract Fees"

written by COA JMAIN
*/


if (wfTask == "Application Submittal" && wfStatus == "Specific Contract Fees - Accepted")
{
	logDebug("Activating Task Fee Processing and Setting Task Status to Specific Contract Fees - Accepted");
	activateTask("Fee Processing");
	updateTask("Fee Processing", "Specific Contract Fees - Accepted", "updated by script", "updated by script");
}
