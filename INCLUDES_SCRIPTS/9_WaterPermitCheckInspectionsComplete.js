/*
COA #9
Event InspectionResultSubmitAfter Criteria When all scheduled inspections
have a status of Passed or Canceled or Complete and Initial Acceptance Inspection
has a status of Complete Action Move the workflow forward to Request Materials Testing,
by inserting status = Completed on wftask = Utility Inspection. And Email Applicant that
Installation is complete will now need the Materials testing uploaded.
Using WUP Request for Testing Template attached example.
written by swakil 05/2018
edited by jmain 07/23/2018
*/

var inspnsComplete = inspectionsComplete();
var inspnComplete = inspectionComplete("Initial Acceptance");

if(inspnsComplete && inspnComplete)
{
	closeTask("Utility Inspection", "Completed", "EMSE ID 9", "EMSE ID 9");
	activateTask("Request Materials Testing", "EMSE ID 9", "EMSE ID 9");  
	sendEmailToApplicant();
}

function inspectionsComplete()
{
	var t = aa.inspection.getInspections(capId);
	if (t.getSuccess()) 
	{
		var n = t.getOutput();
		if(n.length > 0)
		{
			for (xx in n)
			{
				inspStatus = n[xx].getInspectionStatus().toUpperCase();
				logDebug(inspStatus);
				if (!( inspStatus.equals("PASSED") || inspStatus.equals("CANCELED") || inspStatus.equals("COMPLETE")) ) 
				{
				  logDebug("inspection check returns false...");
				  return false;
				}
			}
			logDebug("inspection check returns true...");
			return true; 
		} 
	} 
	logDebug("inspection getSuccess returns false...");
	return false;
}

function inspectionComplete(type) 
{
	var t = aa.inspection.getInspections(capId);
	if (t.getSuccess()) 
	{
		var n = t.getOutput();
		if(n.length > 0)
		{
			for (xx in n)
			{
				inspType = n[xx].getInspectionType();
				inspStatus = n[xx].getInspectionStatus().toUpperCase();
				if ( inspType.equals(type) && inspStatus.equals("COMPLETE"))  
				{
				  logDebug("Initial Acceptance returns true...");
				  return true;
				}
			}
			logDebug("Initial Acceptance returns false...");
			return false;
		} 
	}
	logDebug("Initial Acceptance getSuccess returns false...");
	return false;
}

function sendEmailToApplicant(){
  var contact = "Applicant";
  var template = "WAT_MATERIALS_TESTING";
  var asiextensionnumber = getAppSpecific("Extension Number") + "" //it may be null so best to turn into blank string;
  var emailparams = aa.util.newHashtable();
  emailparams.put("$$asi_ExtensionNumber$$", asiextensionnumber);
  emailContacts(contact, template, emailparams, "", "", "N", "");
}