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
		if ({Planning Review} != "CHECKED")
		{
			closeTask("Planning Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if ({Building Review} != "CHECKED")
		{
			closeTask("Building Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if ({Civil Review} != "CHECKED")
		{
			closeTask("Civil Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if ({Fire Review} != "CHECKED")
		{
			closeTask("Fire Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if ({Traffic Review} != "CHECKED")
		{
			closeTask("Traffic Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if ({Landscape Review} != "CHECKED")
		{
			closeTask("Landscape Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if ({Water Dept Review} != "CHECKED")
		{
			closeTask("Water Dept Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if ({Parks Review} != "CHECKED")
		{
			closeTask("Parks Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if ({Addressing Review} != "CHECKED")
		{
			closeTask("Addressing Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if ({Life Safety Review} != "CHECKED")
		{
			closeTask("Life Safety Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if ({Forestry Review} != "CHECKED")
		{
			closeTask("Forestry Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if ({City Attorney Review} != "CHECKED")
		{
			closeTask("City Attorney Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if ({Public Art Review} != "CHECKED")
		{
			closeTask("Public Art Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if ({ODA Review} != "CHECKED")
		{
			closeTask("ODA Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if ({Real Property Review} != "CHECKED")
		{
			closeTask("Real Property Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		
		if ({Historic Review} != "CHECKED")
		{
			closeTask("Historic Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		
		if ({Airport Review} != "CHECKED")
		{
			closeTask("Airport Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if ({Neighborhood Liaison Review} != "CHECKED")
		{
			closeTask("Neighborhood Liaison Review","NA", "Closed via script. Review task not selected.", "Closed via script. Review task not selected.");
		}
		if ({Outside Agencies Review} != "CHECKED")
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