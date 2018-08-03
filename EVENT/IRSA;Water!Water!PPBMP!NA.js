/*
Title : Set next inspection for PPBMP (InspectionResultSubmitAfter)
Purpose : If any inspection has a result of Pass then auto send email with inspection report attached to the Owner and cc Applicant.
(Need Email Template plus Report Name from Client). In addition also set Custom Field Next Inspection Date to today + 3
years.

Author: Yazan Barghouth
 
Functional Area : Records

Sample Call:
	checkInspectionsResultAndSendEmail4PPBMP("MESSAGE_NOTICE_PUBLIC WORKS", "Date of next Inspection");

Notes:
	- ASI filed name is 'Date of next Inspection' NOT 'Next Inspection Date'
	- Inspection result is 'Complete' not 'Pass'
*/

//Based on report fill report parameters here
var rptParams = aa.util.newHashtable();
rptParams.put("altID", cap.getCapModel().getAltID());

logDebug('script 102 started')
if(ifTracer(inspResult == "Complete",'inspResult == "Complete"')){
	var emailParams = aa.util.newHashtable(),
		reportParams = aa.util.newHashtable(),
		reportTemplate = '',
		newInspDate = dateAddMonths(null, 36);
	
	editAppSpecific("Date of next Inspection", newInspDate);
	//scheduleInspection(insp2Create, newInspDate);//, inspector, null, newInspReqComments);

	emailContactsWithCCs(
		"Project Owner", 
		"PPBMP INSPECTION # 102", 
		emailParams, 
		"", 
		reportTemplate, 
		"N", 
		"", 
		"Applicant,Developer"
	);





   // checkInspectionsResultAndSendEmail4PPBMP("PPBMP INSPECTION # 102", "Date of next Inspection");
}
