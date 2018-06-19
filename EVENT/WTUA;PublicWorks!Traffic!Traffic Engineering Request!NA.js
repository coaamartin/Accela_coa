//script 250
logDebug('Script 250 Starting')
if (ifTracer((wfTask=="Initial Review" || wfTask=="Initial Supervisor Review") && wfStatus=="Assigned",'wfTask & wfStatus match - calling 250_updateAssignedUserForTrafficEngRequest()')) {
	include("250_updateAssignedUserForTrafficEngRequest");
}

// //script 265
// logDebug('Script 265 Starting')
// if (ifTracer(wfTask=="Manager Review" && wfStatus=="Approved",'wfTask & wfStatus match')) {
// 	var tasks = aa.workflow.getHistory(capId).getOutput();
// 	for (var t in tasks) {
// 		var task = tasks[t];
// 		logDebug(task.getTaskDescription());
// 		if (task.getTaskDescription() == 'Traffic Investigation') {
// 			printObjProps(task);
// 		}
// 	}
// //printObjProps(tiTask);
// //	assignTask("Generate Work Order",userObj.getUserID());
// }

script265_ManagerReviewToSupervisor();
script268_MakeFieldsNullIfNoWorkOrderrder();
script270_GenerateWorkOrderNumber();

/*
Title : Generate Work Order Email (WorkflowTaskUpdateAfter)

Purpose : If the workflow task = 'Manager Review' and the workflow status = 'Approved then auto generate an incrementing
number(Format TBD by Aurora) and update the custom field "Work Order Number" and send a notification email(Template
TBD by Aurora) with an attached Work Order Report(Report name TBD) and email Chris Carnihan(ccarnihan@aurora.gov)

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	generateWorkOrderEmail('Manager Review', [ 'Approved' ], 'Work Order Number', 'MESSAGE_NOTICE_PUBLIC WORKS', 'WorkFlowTasksOverdue', rptParams, 'ccarnihan@aurora.gov');

Notes:
	- The auto incrementing number, Mask/Sequence is used, the script needs a seqType, seqName, maskName
	which can be obtained from Config UI when seq/mask is created
	- record of type in task details was not found, we used another record for test
*/

//Based on report fill report parameters here
var rptParams = aa.util.newHashtable();
rptParams.put("altID", cap.getCapModel().getAltID());

//generateWorkOrderEmail("Manager Review", [ "Approved" ], "Work Order Number", "MESSAGE_NOTICE_PUBLIC WORKS", "WorkFlowTasksOverdue", rptParams, "ccarnihan@aurora.gov", "Receipt",
//		"Agency-Receipt", "Agency-Receipt");
