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

if(inspnsComplete || inspnComplete)
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
				if (!( inspStatus.equals("PASSED") || inspStatus.equals("CANCELED") || inspStatus.equals("COMPLETE")) ) 
				{
				  return false;
				}
			}
			return true; 
		} 
	} 
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
				  return true;
				}
			}
		} 
	} 
	return false;
}

function sendEmailToApplicant(){
  var contact = "Applicant";
  var template = "JD_TEST_TEMPLATE";
  var joke = "Where there's a will, there's a relative.";
  var emailparams = aa.util.newHashtable();
  emailparams.put("$$Joke$$", joke);
  emailContacts(contact, template, emailparams, "", "", "N", "");
}