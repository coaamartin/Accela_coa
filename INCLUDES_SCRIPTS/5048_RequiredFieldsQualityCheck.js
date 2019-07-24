//SWAKIL
if ("Quality Check".equals(wfTask) && "Approved".equals(wfStatus))
{	
	var isMissing = false;
	var missingFields = "";

//7-24-19 Keith - Removed Construction Type and Occupancy Group per request from Darcy
//	var reqFieldsArray = ["Total Finished Area Sq Ft", "Project Category", "Construction Type", "Occupancy Group", "Maximum Occupancy", 
	var reqFieldsArray = ["Total Finished Area Sq Ft", "Project Category", "Maximum Occupancy", 
	"# of Residential Units", "Single Family Detached Home", "Special Inspections", "Materials Cost", "Valuation", "Homeowner acting as Contractor"];

	for (var x in reqFieldsArray)
	{
		if (!AInfo[reqFieldsArray[x]] || AInfo[reqFieldsArray[x]] == "")
		{
			isMissing = true;
			missingFields += reqFieldsArray[x] + ", ";
		}
	}

		if(isMissing){
			missingFields = missingFields.substring(0, missingFields.length - 2);
			cancel=true;
			showMessage=true;
	        comment("Not all Required Custom fields are populated for QC Approval. The following fields are missing: " + missingFields);
			
		}
}