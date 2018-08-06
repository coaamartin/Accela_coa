/*
Title : Forestry Inspection Assigned (InspectionResultSubmitAfter) 

Purpose : If a Forestry Inspection has a status of PR1, PR2 or PR20 then update the workflow 
task “Inspection Phase” with a status of “Complete” and activate the workflow task “Crew Work”.

Author: Mohammed Deeb 
 
Functional Area : Inspections

Sample Call:
   checkInspResultsAndUpdateWF("Forestry Inspection", ["PR1", "PR2" , "PR20"], "Inspection Phase", "Complete", "Crew Work");
*/

checkInspResultsAndUpdateWF("Forestry Inspection", ["PR1", "PR2" , "PR20"], "Inspection Phase", "Complete", "Crew Work");