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

noInvoicedFeesErrorMessage("Completeness Check", [ "Ready to Pay" ]);
