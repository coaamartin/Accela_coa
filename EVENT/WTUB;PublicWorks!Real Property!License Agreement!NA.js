/*
Title : No Invoiced Fees Error Message (WorkflowTaskUpdateBefore) 
Purpose : check for specific wfStatus and wfTask, then check Invoiced fee exist or not

Author: Yazan Barghouth
 
Functional Area : Records

Sample Call:
	noInvoicedFeesErrorMessage("Completeness Check", [ "Ready to Pay" ]);

Notes:
- Workflow submit is not blocked if no invoiced fees found, this is not mentioned in the requirements
only display error message.

- See below feeBalanceLocal() and reason to use it
*/
//Script 164
noInvoicedFeesErrorMessage("Completeness Check", [ "Ready to Pay" ]);

//Script 294
//Record Types:	​PublicWorks/Real Property/Easement/NA
//              PublicWorks/Real Property/License Agreement/Na

//Event: 		WTUB
//Desc:			If there is a balance due and the user selects a workflow status of 
//   			"Complete" then prevent the user from moving forward and display an 
//				error message 'Fees must be paid before proceeding the workflow".
//Created By: Silver Lining Solutions

logDebug("START: Script 294");
if (wfStatus == "Complete" && balanceDue != 0) {
	showMessage = true;
	comment("Fees must be paid before proceeding with the workflow");
	cancel = true;
}
logDebug("END: Script 294");
