var $iTrc = ifTracer;

if($iTrc(wfTask == "Plans Coordination" && wfStatus == "Resubmittal Requested", 'wfTask == "Plans Coordination" && wfStatus == "Resubmittal Requested"')){
	//Script 125
	deactivateTask("Completeness Check");
}

if($iTrc(wfTask == "Plans Coordination" && wfStatus == "SS Requested", 'wfTask == "Plans Coordination" && wfStatus == "SS Requested"')){
	//Script 125
	deactivateTask("Completeness Check");
}

if($iTrc(wfTask == "Completeness Check" && wfStatus == "Incomplete", 'wfTask == "Completeness Check" && wfStatus == "Incomplete"')){
	//Script 125
	deactivateTask("Completeness Check");
}

if($iTrc(wfTask == "Application Submittal" && wfStatus == "Complete", 'wfTask == "Application Submittal" && wfStatus == "Complete"')){
	//Script 125
	deactivateTask("Completeness Check");
}