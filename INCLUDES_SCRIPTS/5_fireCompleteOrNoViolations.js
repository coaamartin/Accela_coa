//Script #5
//Created by JMAIN 2018-03-06
//testing on 18-000073-AFR

if (inspResult == "Complete")
{
	{	
		logDebug("inspResult is complete so setting num failed insp to 0 and closing Inspection task");
		editAppSpecific("Number of Failed Inspections", 0);
		editAppSpecific("Description of Mixed Hazards", "this is debug to test whether this script can update an ASI field");
		closeTask("Inspection","Compliance/Complete","Updated via script","Updated via script");
		updateAppStatus("Complete","updated by script");
	}

if (inspResult == "No Violations Found")
	{
		logDebug("inspResult is no violations so setting num failed insp to 0 and closing Inspection task");
		editAppSpecific("Number of Failed Inspections", 0);
		editAppSpecific("Description of Mixed Hazards", "this is debug to test whether this script can update an ASI field");
		closeTask("Inspection","No Violations Found","Updated via script","Updated via script");
		updateAppStatus("Complete","updated by script");
	}	
}

if (inspResult != "Complete" || inspResult != "No Violations Found")
{
	logDebug("not complete or no violations so will be incrementing the failed inspections");
	var numinspections = getAppSpecific("Number of Failed Inspections");
	
	//ensure the value is not null - if so , make it a zero
	if (!numinspections)
	{
		numinspections = 0;		
	}
	numinspectionsint = parseInt(numinspections);
	
	newnuminspectionsint = numinspectionsint + 1;
	editAppSpecific("Number of Failed Inspections", newnuminspectionsint);
}