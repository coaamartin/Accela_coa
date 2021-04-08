var $iTrc = ifTracer;
//Script 332
if($iTrc(wfTask == "Pre Hearing Inspection" && wfStatus == "Hearing Scheduled", 'wfTask == "Pre Hearing Inspection" && wfStatus == "Hearing Scheduled"')){
	Script332_scheduleInspectionTSI();
}
if($iTrc(wfTask == "Complaint Intake" && wfStatus == "Assigned", 'wfTask == "Complaint Intake" && wfStatus == "Assigned"')){
	Script332_scheduleInspectionTSI();
}
