/* Title :  Work order fields must have a value (WorkflowTaskUpdateBefore)

Purpose :   If workflow task = "Draft Workorder" and workflow status = "Drafted workorder" and if any of the following custom fields do
NOT have a value (Location, Description, and Priority) then prevent the workflow from moving forward and raise the error
message “Content incomplete please populate workflow information to use this status”

Author :   Israa Ismail

Functional Area : Records 

Sample Call : validateWOFields()
Notes : The name of the record is changed to “Traffic Engineering Request” (PublicWorks/Traffic/Traffic Engineering Request/NA). 
*/

validateWOFields();