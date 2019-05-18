// SCRIPTNUMBER: 11
// SCRIPTFILENAME: 11_MJ_Application_Update.js
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
	    //save capId
	    var tempCapId = capId;
	    capId = wPermit;
	    createPendingInspection("LIC_MJ_RST", "MJ AMED Inspections");
	    createPendingInspection("LIC_MJ_RST", "MJ Building Inspections");
	    createPendingInspection("LIC_MJ_RST", "MJ Code Enforcement Inspections");
	    createPendingInspection("LIC_MJ_RST", "MJ Planning Inspections");
	    createPendingInspection("LIC_MJ_RST", "MJ Security Inspections - Police");
	    closeTask("Certificate of Occupancy","Complete","Updated by script COA #11","Updated by script COA #11");
	    //restore capId
	    capId = tempCapId;
	   
	}
	else
	{
	    logDebug("Problem locating child permit for record " + capId.getCustomID());
	}
}