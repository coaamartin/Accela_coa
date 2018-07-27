//WTUB:PublicWorks/Real Property/License Agreement/NaN

/* Title :  Payment before Route Signatures Completion (WorkflowTaskUpdateBefore)

Purpose :  If workflow task = “Signatures” and workflow status = “Routed for Signatures” and Balance due > 0 or a fee item exists in a
“NEW” status then prevent the workflow from proceeding and display the error message “Route for Signatures requires all
fees to be paid”

Author :   Israa Ismail

Functional Area : Records
 
Sample Call : checkIfAllFeesPaid()

*/

checkIfAllFeesPaid();
