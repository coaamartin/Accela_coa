/* Title :  Create child water utility permit records (WorkflowTaskUpdateAfter)

Purpose :   If workflow task = "Fire Life Safety Review" and workflow status = "Approved" and the TSI field "Is there a private fire line" =
"Yes" and the custom field "Number of Fire Lines" > 0 then auto create a child Water Utility Permit record
(Water/Utility/Permit/NA) for each number listed in the TSI field "Number of Fire Lines" as a child of the
Building/Permit/New Building/NA or Building/Permit/Plan/NA. When creating these child records copy address, parcel,
owner and contact information. In addition set the custom field "Utility Permit Type" = "Private Fire Lines" On the Utility
Permit record.

Author :   Israa Ismail

Functional Area : Records
 
Record Types : Building/Permit/New Building/NA or Building/Permit/Plan/NA and
Water/Utility/Permit/NA

Sample Call : createChildWaterUtilityPermitRecords()

*/

//createChildWaterUtilityPermitRecords();


/*
Title : No Fee Required Permit Issuance (WorkflowTaskUpdateAfter) 
Purpose : If workflow task = Fee Processing and the workflow status = No Fees Required then update the workflow task "Permit
Issuance" with a status of "Issued" and update the application status to "Issued" and send an email to the applicant that the
permit has been issued.

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	checkNoFeeAndUpdateTask(capId, "Fee Processing", [ "No Fees Required" ], "MESSAGE_NOTICE_PUBLIC WORKS", "Permit Issuance", "Issued","Issued");

Supported Email Parameters:
	$$altID$$,$$recordAlias$$,$$recordStatus$$,$$balance$$,$$wfTask$$,$$wfStatus$$,$$wfDate$$,$$wfComment$$,$$wfStaffUserID$$,$$wfHours$$
*/

checkNoFeeAndUpdateTask(capId, "Fee Processing", [ "No Fees Required" ], "MESSAGE_NOTICE_PUBLIC WORKS", "Permit Issuance", "Issued","Issued");


//JMAIN - show message if no phase plan
//disabled the script below as it was causing errors and will not work as designed
//include("11_WaterUtilityNeedPhaseWorkPlanForPermit");

//SWAKIL - Email
include("41_EmailWaterUtilityPermit");

if(ifTracer(wfTask == "Final Acceptance Inspection" && wfStatus == "Warranty Work Required", 'wf:Final Acceptance Inspection/Warranty Work Required')){
	//Script 302
	wtrScript302_warrantyReqdNotification();
}

if(ifTracer(wfTask == "Final Acceptance Inspection" && wfStatus == "Complete", 'wf:Final Acceptance Inspection/Complete')){
	//Script 302
	wtrScript302_warrantyReqdNotification();
}
