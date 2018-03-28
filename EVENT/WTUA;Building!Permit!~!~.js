//WTUA:Building/Permit/*/*

updateExpirationDateAsi();

/*
Title : Set the Code Reference custom field value (WorkflowTaskUpdateAfter)
Purpose : If the workflow status = "Issued" and the custom field "Code Reference" is not filled out with data then
          update the "Code Reference" field with the value "2015 I-Codes/Aurora Muni Codes/2017-NEC".

Author: Ahmad WARRAD
 
Functional Area : Records

Sample Call:
	setCodeReference("Complete");

Notes:
1- The script will update the "Code Reference" custom field, when the workflow status = "Complete"
*/

// In specification record the status is "Issued", but we set it to "Complete", since we didn't find an "Issued" status
var wfStatusCompareVal = "Complete";
setCodeReference(wfStatusCompareVal);

/*------------------------------------------------------------------------------------------------------/
Title 		: Building Certificate of Occupancy does Complete on License WF(WorkflowTaskUpdateAfter).

Purpose		:If the workflow task “Inspection Phase” has a status of “Temporary CO Issued” or “Ready for CO” then use the address on
		the record to go out and see if an MJ License Application exists on that address. and If a MJ License Application exists on
		that address then close the workflow task “Certificate of Occupancy” with a status of “Final CO Issued”.
			
Author :   Israa Ismail

Functional Area : Records 

Sample Call : closeWfTaskCertificateOfOccupancy()

Notes		: Provided Record type "MJ License Application" , is not available ,replaced with a Sample Record Type "Licenses/Marijuana/Retail Store/License"
	          ,to be replaced with the correct record type
/------------------------------------------------------------------------------------------------------*/
closeWfTaskCertificateOfOccupancy();

/*------------------------------------------------------------------------------------------------------/
Title	: Building Certificate of Occupancy does Complete on License WF(WorkflowTaskUpdateAfter).
Purpose	: Send email to Applicant email address using tempalte BACKFLOW PREVENTER NOTIFICATION if wfTask == "Backflow Preventor" && wfStatus == "Final"
Author	: Suhail Wakil
Functional Area : Record WF
Sample Call : backFlowPreventerEmail()
/------------------------------------------------------------------------------------------------------*/
script40_backFlowPreventerEmail();
