/*
Title : Auto schedule failed inspections based on original schedule date (InspectionResultSubmitAfter) 

Purpose : check if specific inspection type, with specific Result, reschedule same inspection, original scheduled date + n

Author: Yazan Barghouth 
 
Functional Area : Records

Notes:
	- Result "Failed" not "Fail"
	
Sample Call:
	autoScheduleFailedInspectionsOrgScheduleDatePlusDays([ "MJ AMED Quarterly Inspection", "MJ Building Inspection - Electrical", "MJ Building Inspection - Life Safety",
		"MJ Building Inspection - Mechanical", "MJ Building Inspection - Plumbing", "MJ Building Inspection - Structural", "MJ Security Inspection - 3rd Party",
		"MJ Zoning Inspection" ], "Failed", 7, "MESSAGE_NOTICE_PUBLIC WORKS", "WorkFlowTasksOverdue", rptParams);

*/

//pre-existing code, probably needs to be removed once testing is concluded
/*
autoScheduleFailedInspectionsOrgScheduleDatePlusDays([ "MJ AMED Inspection", "MJ Building Inspection - Electrical", "MJ Building Inspection - Life Safety",
		"MJ Building Inspection - Mechanical", "MJ Building Inspection - Plumbing", "MJ Building Inspection - Structural", "MJ Security Inspection - 3rd Party",
		"MJ Zoning Inspection" ], "Failed", 7, "LIC MJ INSPECTION CORRECTION REPORT # 231", "WorkFlowTasksOverdue", rptParams);
*/		

//var rptParams = aa.util.newHashtable();
//rptParams.put("altID", cap.getCapModel().getAltID());
		
failedMJInspectionAutomation([ "MJ AMED Inspection", "MJ Building Inspection - Electrical", "MJ Building Inspection - Life Safety",
		"MJ Building Inspection - Mechanical", "MJ Building Inspection - Plumbing", "MJ Building Inspection - Structural", "MJ Security Inspection - 3rd Party",
		"MJ Zoning Inspection" ], "Failed", 7, "LIC MJ INSPECTION CORRECTION REPORT # 231", "WorkFlowTasksOverdue");
		
passedMJInspectionAutomation([ "MJ AMED Inspection", "MJ Building Inspection - Electrical", "MJ Building Inspection - Life Safety",
		"MJ Building Inspection - Mechanical", "MJ Building Inspection - Plumbing", "MJ Building Inspection - Structural", "MJ Security Inspection - 3rd Party",
		"MJ Zoning Inspection" ], "Passed", 7, "LIC MJ COMPLIANCE #232", "WorkFlowTasksOverdue", rptParams);