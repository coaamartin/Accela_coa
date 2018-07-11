/* Title :  Require initial inspection to be statused (InspectionScheduleBefore)

Purpose :  If an inspection of a particular type that contains the string “Final” is being scheduled then check all the existing inspections
on the record and make sure there is an inspection that has a string from the same inspection type that is NOT a final and
has a result of “Passed”. For Example: If the user is trying to schedule an inspection type called “Electrical Final Inspection”
there must be an inspection such as “Electrical Rough Inspection” on the record in a passed status. If there is not an
inspection of similar type on the record in a passing status then prevent the user from scheduling the Final inspection and
display an error message to the user saying “$$Initial Inspection Type$$ is not Passed”.

Author :   Israa Ismail

Functional Area : Records
 
Notes : 
	-if no initial inspection exist for the same type show message "There must be an initial inspection of status passed for the inspection type " + InspectionType, this could be changed.

Sample Call : checkIfPassedInspections()

*/
if (!appMatch("Building/Permit/No Plans/NA") {
	checkIfPassedInspections(inspType);
}
/*
Title : Check for Existing Inspection on Same Day (InspectionScheduleBefore) 

Purpose : check if same inspection is already Scheduled on same date, block submit

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	checkScheduledInspSameDate(inspType, inspSchedDate);
	
Notes:
	Event should be ISB(InspectionScheduleBefore) not IRSB(InspectionResultSubmitBefore)
*/

if (typeof inspSchedDate == 'undefined') { 
	inspSchedDate = aa.env.getValue("InspectionDate"); // from ISB
}

checkScheduledInspSameDate(inspType, inspSchedDate);
