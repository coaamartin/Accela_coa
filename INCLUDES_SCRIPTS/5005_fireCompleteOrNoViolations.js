//************************************************ >>  5005_fireCompleteOrNoViolations.js  << ****************************
// SCRIPTNUMBER: 5005
// SCRIPTFILENAME: 5005_fireCompleteOrNoViolations.js
// PURPOSE: ​testing on 18-000073-AFR
// DATECREATED: 2018-03-06
// BY: JMAIN

logDebug("Inspection Results: " + inspResult);
logDebug(inspResult.length());

if ("Complete".equals(inspResult))
	{	
		logDebug("inspResult is complete so setting num failed insp to 0 and closing Inspection task");
		editAppSpecific("Number of Failed Inspections", 0);
		closeTask("Inspection","Compliance/Complete","Updated via script","Updated via script COA #5");
		updateAppStatus("Complete","updated by script COA #5");
	}

if ("No Violations Found".equals(inspResult))
	{
		logDebug("inspResult is no violations so setting num failed insp to 0 and closing Inspection task");
		editAppSpecific("Number of Failed Inspections", 0);
		closeTask("Inspection","No Violation","Updated via script","Updated via script COA #5");
		updateAppStatus("Complete","updated by script COA #5");
	}

if (inspResult != "Complete" && inspResult != "No Violations Found")
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