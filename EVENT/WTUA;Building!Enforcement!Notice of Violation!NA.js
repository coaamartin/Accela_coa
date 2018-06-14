var $iTrc = ifTracer;
//Script 332
if(wfTask == "Pre Hearing Inspection" && wfStatus == "Non Compliance"){
	Script332_scheduleInspectionTSI();
}

if($iTrc(wfTask == "Complaint Intake" && wfStatus == "Assigned", 'wfTask == "Complaint Intake" && wfStatus == "Assigned"')){
	bldScript329_createInspection();
}