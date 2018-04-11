/*------------------------------------------------------------------------------------------------------/
Title 		: Update Assigned user for Traffic Engineering Request(WorkflowTaskUpdateAfter).

Purpose		:If workflow Task = Initial Review or Initial Supervisor Review and workflow status = "Assigned" then update workflow task
			"Traffic Investigation" Assigned User and Assigned Department with the user in the TSI field on the workflow task "Initial
			Review" or "Supervisor Review" (TRAFFIC_TER – USER ASSIGNMENT – Assigned To) NOTE - Use this value to grab
			the Accela user by cross referencing with First and Last name in Accela user table.
			
Author :   Israa Ismail

Functional Area : Records 

Sample Call : updateAssignedUserForTraffEngReq()
/------------------------------------------------------------------------------------------------------*/
updateAssignedUserForTraffEngReq();
script265_ManagerReviewToSupervisor();
script268_MakeFieldsNullIfNoWorkOrderrder();
script270_GenerateWorkOrderNumber();

/*
Title : Generate Work Order Email (WorkflowTaskUpdateAfter)

Purpose : If the workflow task = “Manager Review” and the workflow status = “Approved” then auto generate an incrementing
number(Format TBD by Aurora) and update the custom field “Work Order Number” and send a notification email(Template
TBD by Aurora) with an attached Work Order Report(Report name TBD) and email Chris Carnihan(ccarnihan@aurora.gov)

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	generateWorkOrderEmail("Manager Review", [ "Approved" ], "Work Order Number", "MESSAGE_NOTICE_PUBLIC WORKS", "WorkFlowTasksOverdue", rptParams, "ccarnihan@aurora.gov");

Notes:
	- The auto incrementing number, Mask/Sequence is used, the script needs a seqType, seqName, maskName
	which can be obtained from Config UI when seq/mask is created
	- record of type in task details was not found, we used another record for test
*/

//Based on report fill report parameters here
var rptParams = aa.util.newHashtable();
rptParams.put("altID", cap.getCapModel().getAltID());

generateWorkOrderEmail("Manager Review", [ "Approved" ], "Work Order Number", "MESSAGE_NOTICE_PUBLIC WORKS", "WorkFlowTasksOverdue", rptParams, "ccarnihan@aurora.gov", "Receipt",
		"Agency-Receipt", "Agency-Receipt");
