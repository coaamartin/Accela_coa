// SCRIPTNUMBER: 2010
// SCRIPTFILENAME: 2010_UpdateDevAppWorkflowTasks.js
// PURPOSE: Update the Development Application Workflow when Application Acceptance, Admin Decision, or Planning Comm Hearing tasks are Approved
// DATECREATED: 05/29/2019
// BY: CProbasco
// CHANGELOG: 

logDebug("Script #2010 - UpdateDevAppWorkflowTasks - Start");
logDebug(capStatus + "");

if (appTypeResult == "Planning/Application/Development Application/NA") 
{ 

	if (wfTask == "Administrative Decision" && wfStatus == "Approve")
	{
		setTask("Administrative Decision","N","Y");
		activateTask("Case Closed");
	}

	if (wfTask == "Planning Commission Hearing" && wfStatus == "Approve")
	{
		setTask("Planning Commission Hearing","N","Y");
		activateTask("Case Closed");
	}
	
	if (wfTask == "Administrative Decision" && wfStatus == "Tech Review Required")
	{
		setTask("Administrative Decision","N","Y");
		activateTask("Application Acceptance");
	}
	if (wfTask == "Planning Commission Hearing" && wfStatus == "Tech Review Required")
	{
		setTask("Planning Commission Hearing","N","Y");
		activateTask("Application Acceptance");		
	}
	if (wfTask == "City Council" && wfStatus == "Tech Review Required")
	{
		setTask("Administrative Decision","N","Y");
		activateTask("Application Acceptance");		
	}

	if (wfTask == "Application Acceptance" && (wfStatus == "Routed for Review" || wfStatus == "Routed for Tech Review"))
	{
		var reviewTasks = new Array();
		loadTaskSpecific(reviewTasks);
		for (x in reviewTasks){
			logDebug(x + " = " +reviewTasks[x]);
			if(reviewTasks[x] != "CHECKED") {
			thisTask = x; 
			closeTask(thisTask,"NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
			}
		}

	}
	
	if (wfTask == "Reviews Consolidation" && wfStatus == "Tech Review Complete")
	{
		setTask("Reviews Consolidation","N","Y");
		activateTask("Case Closed");		
	}
	
	logDebug("Script #2010 - UpdateDevAppWorkflowTasks - End");
}