//Script #245
//Created by JMAIN 2018-03-06
//This is JDM's first - does this script even work?

if (inspResult == "Complete")
{
	{	
		editAppSpecific("Number of Failed Inspections", 0);
		closeTask("Inspection","Compliance/Complete","Updated via script","Updated via script");
		updateAppStatus("Complete","updated by script");
	}

if (inspResult =="No Violations Found")
	{
		editAppSpecific("Number of Failed Inspections", 0);
		closeTask("Inspection","No Violations Found","Updated via script","Updated via script");
		updateAppStatus("Complete","updated by script");
	}	
}

if (inspResult != "Complete" || inspResult != "No Violations Found")
{
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