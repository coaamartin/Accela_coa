/*
Title : Notice of Violation Inspection Order (InspectionResultSubmitBefore) 

Purpose : For an inspection type, force inspection results to be in a specific order (a result has a pre-required result)

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	checkPrevInspResultAndPreventSubmit("Notice of Violation", [ "Second Notice", "Third Notice" ], [ "First Notice", "Second Notice" ]);

Notes:
	- Inspection in Specs is not found on record config:
	specs insp: 'Notice of Violation', available insp on record is only: 'Investigation'
	
	- parameters reqInspResults and preReqInspResult must be same length
	
	- result in reqInspResults will be checked for preReqInspResult at same index
*/

checkPrevInspResultAndPreventSubmit("Notice of Violation Inspection", [ "Second Notice", "Third Notice" ], [ "First Notice", "Second Notice" ]);
