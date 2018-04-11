/*
Title : After Forestry Field Crew Inspection

Purpose : If Inspection Result is Complete update workflow task Field Crew and activate workflow task Stump Grind

Author: Ali Othman
 
Functional Area : Inspections

Sample Call:
   checkInspResultsAndUpdateWF("Forestry Field Crew", ["Complete"], "Crew Work", "Complete", "Stump Grind");
   
Notes:
	Task status parameter value will be passed as "Crew Work", because "Field Crew" task status mentioned in the specification document was not found on the record type workflow.
*/

checkInspResultsAndUpdateWF("Forestry Field Crew", ["Complete"], "Crew Work", "Complete", "Stump Grind");

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