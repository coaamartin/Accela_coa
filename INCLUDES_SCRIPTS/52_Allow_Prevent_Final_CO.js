	/* Script ID: 52_Allow_Prevent_Final_CO
	if the Sub Workflow tasks (Waste Water, Special Inspections Check, FEMA Elevation Certificate) are deactivated or complete 
	and any checked Custom Field under Subgroup (ENGINEER LETTERS: ILC Letter Required, Foundation Letter Required, 
	Footing - Pier - Cassion Letter Required, Drain Letter Required, Waterproofing Letter Required) then see if the matching 
	received field is also checked under Subgroup (ENGINEER LETTERS: ILC Letter Received, Foundation Letter Received, Footing - Pier - Cassion Letter Received, 
	Drain Letter Received, Waterproofing Letter Received) and check if there are no any Inspections that are Pending 
	or Scheduled  (Required Inspections will be set to Pending on a per record basis depending on what is required). 
	If all of the above conditions are true then allow the status of ”Final” or “Ready For CO” in the Inspection Phase WF task to proceed, 
	if not then insert a pop up message that states something like “These items (then list what is not done in the list above) are not complete 
	so you can’t proceed.”
	*/

	if ((!isTaskActive("Waste Water") || isTaskComplete("Waste Water")) && (!isTaskActive("Special Inspections Check") || isTaskComplete("Special Inspections Check")) 
		&& (!isTaskActive("FEMA Elevation Certificate") || isTaskComplete("FEMA Elevation Certificate")))
	{
		var apply2Records = ["Building/Permit/New Building/NA", "Building/Permit/Plans/NA"]
		var allreceived = true;
		var requiredArray = ["ILC Letter Required", "Foundation Letter Required", "Footing - Pier - Cassion Letter Required", "Drain Letter Required", "Waterproofing Letter Required"];
		var receivedArray = ["ILC Letter Received", "Foundation Letter Received", "Footing - Pier - Cassion Letter Received", "Drain Letter Received", "Waterproofing Letter Received"];
		var missingCriteriaString = "";
      
      logDebug("JMP JMP Alert: ------------------------>> Script Item #52 - 52_Allow_Prevent_Final_CO");

		for (var x in requiredArray)
		{
			if (("CHECKED".equals(AInfo[requiredArray[x]]) && !"CHECKED".equals(AInfo[receivedArray[x]])))
			{
				allreceived = false;
				missingCriteriaString += requiredArray[x] + ", ";
            
     			cancel = true;
			   showMessage = true;
			   comment("The following items are not complete: " + missingCriteriaString.substring(0, missingCriteriaString.length - 2));
            
			}

      }
      
		//get inspections and check to see if there are any that are scheduled or pending
		var inspResult = aa.inspection.getInspections(capId);
		var insps = inspResult.getOutput();
		var inspExists = false;

		for (var i in insps)
		{
			var thisInsp = insps[i];
			var thisInspStatus = thisInsp.getInspectionStatus();

			if ("Pending".equals(thisInspStatus) || "Scheduled".equals(thisInspStatus))
			{
            
			cancel = true;
			showMessage = true;
			comment("The following items are not complete: " + missingCriteriaString.substring(0, missingCriteriaString.length - 2));
         
			}
		}

	}