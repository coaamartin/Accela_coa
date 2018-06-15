var $iTrc = ifTracer;

if($iTrc(wfTask == "Plans Coordination" && wfStatus == "Resubmittal Requested", 'wfTask == "Plans Coordination" && wfStatus == "Resubmittal Requested"')){
	//Script 125
	deactivateTask("Completeness Check");
}

if($iTrc(wfTask == "Plans Coordination" && wfStatus == "SS Requested", 'wfTask == "Plans Coordination" && wfStatus == "SS Requested"')){
	//Script 125
	deactivateTask("Completeness Check");
}
