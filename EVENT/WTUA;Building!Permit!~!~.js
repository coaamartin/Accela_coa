//WTUA:Building/Permit/*/*

//Call all customs for wf:Permit Issuance/Issued
if(wfTask == "Permit Issuance" && wfStatus == "Issued"){
	script208_UpdatePermitFields();
	//script206_DeactivateFEMA(); //Commented out since it is being done in WTUA:Building/*/*/*
}

//Call all customs for wf:Accepted/Accept Plans
if(wfTask == "Accepted" && wfStatus == "Accept Plans"){
	updateExpirationDateAsi();
}

//Call all customs for wfStatus of Resubmittal Requested
if(wfStatus == "Resubmittal Requested"){
	updateExpirationDateAsi();
}


if(wfTask =="Inspection Phase"  && wfStatus == "Temporary CO Issued"){
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
}

var vCoOASI = getAppSpecific("Certificate of Occupancy");

if(wfTask =="Inspection Phase"  && wfStatus=="Ready for CO" && vCoOASI == "CHECKED"){
	activateWfTaskCertificateOfOccupancy();
} else {
	deactCoOIfNotChecked();
}

if(wfTask =="Inspection Phase"  && wfStatus=="Final"){
	deactCoOIfNotChecked();
	
	if (allwfTasksComplete(capId) == false) {
		updateAppStatus("Issued","Status updated via script 6"); 
	}
}

if(wfTask == "Backflow Preventor" && wfStatus == "Final"){
	deactCoOIfNotChecked();
	include("40_backFlowPreventerEmail");
}

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


//Script ID#60  Resubmittal Requested Notification 
include("60_ResubmittalRequestedNotification");