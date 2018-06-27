var $iTrc = ifTracer;
/*
Title : Create Child Utility Permit Records (WorkflowTaskUpdateAfter)
Purpose : Create a child utility permit record, set the child utility permit Type to the value of its parent "Water Review" TSI
          and then send an email to the applicant

Author: Ahmad WARRAD
 
Functional Area : Records

Sample Call:
	createTempWaterChild("MESSAGE_NOTICE_PUBLIC WORKS");
*/

createTempWaterChild("SWMP PERMIT REQUIRED # 219");

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

if($iTrc(wfTask == "Application Submittal" && wfStatus == "Accepted", 'wfTask == "Application Submittal" && wfStatus == "Accepted"')){
	//Script 125
	deactivateTask("Completeness Check");
}




