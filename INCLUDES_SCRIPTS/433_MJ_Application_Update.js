// SCRIPTNUMBER: 433
// SCRIPTFILENAME: 433_MJ_Application_Update.js
// PURPOSE: When wfTask "Certificate of Occupancy" is statused "Final CO Issued" on a building permit (Building/New Builiding/Permit/NA), 
// 		update the child Marijuana Application (Licenses/Marijuana/*/Application) wfTask "Certificate of Occupancy" with the wfTask Status "Complete"
// 		Schedule all 5 "Pending" inspections
// DATECREATED: 05/17/2019
// BY: SWAKIL
// CHANGELOG: 05/17/2019 , SWAKIL Created this file. 
if (wfTask == "Certificate of Occupancy" && wfStatus == "Final CO Issued"){
	var appTypeStr = "Licenses/Marijuana/*/Application";
	var cRecords = getChildren(appTypeStr, capId);
	if (cRecords && cRecords.length > 0)
	{
	    var wPermit = cRecords[0];
	    
	    scheduleInspectionWithCapIdBusinessDays("MJ AMED Inspections", 0, " ", " ", "Scheduled by Script 226", wPermit);	
	    scheduleInspectionWithCapIdBusinessDays("MJ Building Inspections", 0, " ", " ", "Scheduled by Script 226", wPermit);
	    scheduleInspectionWithCapIdBusinessDays("MJ Code Enforcement Inspections", 0, " ", " ", "Scheduled by Script 226", wPermit);
	    scheduleInspectionWithCapIdBusinessDays("MJ Planning Inspections", 0, " ", " ", "Scheduled by Script 226", wPermit);
	    scheduleInspectionWithCapIdBusinessDays("MJ Security Inspections - Police", 0, " ", " ", "Scheduled by Script 226", wPermit);

	    //save capId
	    var tempCapId = capId;
	    capId = wPermit;
	    closeTask("Certificate of Occupancy","Complete","Updated by script COA #11","Updated by script COA #11");
	    //restore capId
	    capId = tempCapId;
		   
	}
	else
	{
	    logDebug("Problem locating child permit for record " + capId.getCustomID());
	}
}