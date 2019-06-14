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
		if (getAppSpecific("Planning Review") != "CHECKED")
		{
			closeTask("Planning Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if (getAppSpecific("Building Review") != "CHECKED")
		{
			closeTask("Building Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if (getAppSpecific("Civil Review") != "CHECKED")
		{
			closeTask("Civil Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if (getAppSpecific("Fire Review") != "CHECKED")
		{
			closeTask("Fire Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if (getAppSpecific("Traffic Review") != "CHECKED")
		{
			closeTask("Traffic Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if (getAppSpecific("Landscape Review") != "CHECKED")
		{
			closeTask("Landscape Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if (getAppSpecific("Water Dept Review") != "CHECKED")
		{
			closeTask("Water Dept Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if (getAppSpecific("Parks Review") != "CHECKED")
		{
			closeTask("Parks Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if (getAppSpecific("Addressing Review") != "CHECKED")
		{
			closeTask("Addressing Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if (getAppSpecific("Life Safety Review") != "CHECKED")
		{
			closeTask("Life Safety Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if (getAppSpecific("Forestry Review") != "CHECKED")
		{
			closeTask("Forestry Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if (getAppSpecific("City Attorney Review") != "CHECKED")
		{
			closeTask("City Attorney Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if (getAppSpecific("Public Art Review") != "CHECKED")
		{
			closeTask("Public Art Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if (getAppSpecific("ODA Review") != "CHECKED")
		{
			closeTask("ODA Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if (getAppSpecific("Real Property Review") != "CHECKED")
		{
			closeTask("Real Property Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		
		if (getAppSpecific("Historic Review") != "CHECKED")
		{
			closeTask("Historic Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		
		if (getAppSpecific("Airport Review") != "CHECKED")
		{
			closeTask("Airport Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if (getAppSpecific("Neighborhood Liaison Review") != "CHECKED")
		{
			closeTask("Neighborhood Liaison Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if (getAppSpecific("Outside Agencies Review") != "CHECKED")
		{
			closeTask("Outside Agencies Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
	}
		if (wfTask == "Reviews Consolidation" && wfStatus == "Tech Review Complete")
	{
		setTask("Reviews Consolidation","N","Y");
		activateTask("Case Closed");		
	}
	
	logDebug("Script #2010 - UpdateDevAppWorkflowTasks - End");
}