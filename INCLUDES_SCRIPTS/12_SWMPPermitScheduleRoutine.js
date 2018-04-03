eval(getScriptText("STDBASE_INSPECTION_AUTOMATION"));
var inspType = "ECKO and Initial Inspection";
var inspResultComment = "";
if ("ECKO and Initial Inspection".equals(inspType) && "Passed".equals(inspResult))
{
    //Schedule a Routine Inspection in child SWMP Permit record (SWMP Permit Inspection group) for 30 business days 
    //to the same Inspector who did this status
    var cRecords = getChildren("Water/Water/SWMP/Permit", capId);
    //assuming only 1 permit child record
    if (cRecords && cRecords.length > 0)
    {
        var wPermit = cRecords[0];
        //save capId
        var tempCapId = capId;
        capId = wPermit;
        schedInspection("Routine Inspections", true, "Days", 30, "");
        //restore capId
        capId = tempCapId;
        //set app status to closed
        updateAppStatus("Closed", "Closed Via Script")
    }
    else
    {
        logDebug("Problem locating child permit for record " + capId.getCustomID())
    }
    

}
else if ("ECKO and Initial Inspection".equals(inspType) && "Failed".equals(inspResult))
{
    //Auto send email with inspection comments included to applicant (need email template) 
    //(Need to know if schedule another inspection or will Applicant schedule in ACA from COA Water staff)  
    var contact = "Applicant";
    var template = "JD_TEST_TEMPLATE";
    var emailparams = aa.util.newHashtable();
    emailparams.put("$$inspComments$$", inspResultComment);
    emailContacts(contact, template, emailparams, "", "", "N", "");
}