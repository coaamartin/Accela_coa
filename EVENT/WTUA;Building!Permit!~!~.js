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
1- The script will update the "Code Reference" custom field, when the workflow status = "Issued"
*/

setCodeReference("Issued");

//if(wfStatus == "Issued"){
//	logDebug("Inside Set Code Reference Custom Field");
//        var codeRefVal = getAppSpecific("Code Reference");
//        if (isEmpty(codeRefVal)) {
//			logDebug("Inside Set Code Reference Custom Field Empty Field Flag");
//            editAppSpecific("Code Reference","2015 I-Codes/Aurora Muni Codes/2017-NEC"); 
//        }
//    
//}	

/*------------------------------------------------------------------------------------------------------/
Title 		: Building Certificate of Occupancy does Complete on License WF(WorkflowTaskUpdateAfter).

Purpose		:If the workflow task "Inspection Phase" has a status of "Temporary CO Issued" or "Ready for CO" then use the address on
		the record to go out and see if an MJ License Application exists on that address. and If a MJ License Application exists on
		that address then close the workflow task "Certificate of Occupancy" with a status of "Final CO Issued".
			
Author :   Israa Ismail

Functional Area : Records 

Sample Call : closeWfTaskCertificateOfOccupancy()

Notes		: Provided Record type "MJ License Application" , is not available ,replaced with a Sample Record Type "Licenses/Marijuana/Retail Store/License"
	          ,to be replaced with the correct record type
------------------------------------------------------------------------------------------------------*/
closeWfTaskCertificateOfOccupancy();
script208_UpdatePermitFields();

//COA Script - Suhail
include("40_backFlowPreventerEmail");

var cOO = "";
if(!useAppSpecificGroupName) cOO=getAppSpecific("Certificate of Occupancy",capId);
else cOO=getAppSpecific("Certificate of Occupancy",capId);
if (cOO!="CHECKED"){
	deactivateTask("Certificate of Occupancy");
}
