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
