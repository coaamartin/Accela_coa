/* Title :  Planning Case Assignment Change (ApplicationDetailUpdateAfter)

Purpose :   If the Assigned to Staff field is changed on the Record detail tab then update the assigned User on any Active Workflow
task where current department assigned = "Planning"

Author :   Israa Ismail

Functional Area : Records

Sample Call : planningCaseAssignmentChange()
 
Notes : 
	-Requirment modified to change the assigned user on active workflow (with dept : Planning) without checking if the assigned user is changed.
*/

planningCaseAssignmentChange();


