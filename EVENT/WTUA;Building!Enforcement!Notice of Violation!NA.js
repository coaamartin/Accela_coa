var $iTrc = ifTracer;
//Script 332
if($iTrc(wfTask == "Pre Hearing Inspection" && wfStatus == "Hearing Scheduled", 'wfTask == "Pre Hearing Inspection" && wfStatus == "Hearing Scheduled"')){
	Script332_scheduleInspectionTSI();
}
if($iTrc(wfTask == "Complaint intake" && wfStatus == "Assign", 'wfTask == "Complaint intake" && wfStatus == "Assign"')){
	Script332_scheduleInspectionTSI();
}
