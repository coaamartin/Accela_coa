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

createTempWaterChild("MESSAGE_NOTICE_PUBLIC WORKS");

if($iTrc(wfTask == "Plans Coordination" && wfStatus == "Resubmittal Requested", 'wfTask == "Plans Coordination" && wfStatus == "Resubmittal Requested"')){
	deactivateTask("Completeness Check");
}

if($iTrc(wfTask == "Plans Coordination" && wfStatus == "SS Requested", 'wfTask == "Plans Coordination" && wfStatus == "SS Requested"')){
	deactivateTask("Completeness Check");
}







