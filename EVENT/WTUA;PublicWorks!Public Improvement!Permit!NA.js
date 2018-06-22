//COA Script #22 added by JMAIN
include("22_publicworksPIPermitFinalAcceptanceEmail");


/*------------------------------------------------------------------------------------------------------/
Title 		: Update Assigned user for Traffic Engineering Request(WorkflowTaskUpdateAfter).

Purpose		:If workflow Task = Initial Review or Initial Supervisor Review and workflow status = "Assigned" then update workflow task
			"Traffic Investigation" Assigned User and Assigned Department with the user in the TSI field on the workflow task "Initial
			Review" or "Supervisor Review" (TRAFFIC_TER – USER ASSIGNMENT – Assigned To) NOTE - Use this value to grab
			the Accela user by cross referencing with First and Last name in Accela user table.
			
Author :   Israa Ismail

Functional Area : Records 

Sample Call : updateAssignedUserForTraffEngReq()
/------------------------------------------------------------------------------------------------------*/
updateAssignedUserForTraffEngReq();
script265_ManagerReviewToSupervisor();

/*
Title : Resubmittal requested email notification (WorkflowTaskUpdateAfter) 

Purpose : When any workflow task is updated with the status "Resubmittal Requested" then send an email to all contacts on record
with workflow comments included in the email template.

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	resubmittalRequestedEmailNotification(null, [ "Resubmittal Requested" ], "MESSAGE_NOTICE_PUBLIC WORKS");
	
Notes:
	Supported Email Parameters:
	$$altID$$, $$recordAlias$$, $$recordStatus$$, $$balance$$, $$wfTask$$, $$wfStatus$$, $$wfDate$$, $$wfComment$$, $$wfStaffUserID$$, $$wfHours$$
	
*/

resubmittalRequestedEmailNotification(null, [ "Resubmittal Requested" ], "MESSAGE_NOTICE_PUBLIC WORKS");

//*********************************************************************************************************
//script 183 		Assess Public Improvement Fees
//
//Record Types:		PublicWorks/Public Improvement/Permit/NA
//Event: 			WTUA - WorkflowTaskUpdateAfter
//Desc:				When the wfTask = "TCP Review" and the status = "Estimate Fee" then add but do NOT invoice 
//					the Street Occupation Fee and Review fee on the record from Custom Fields under subgroup 
//					TRAFFIC CONTROL INFORMATION (FEE GROUP: PW_PIP) if Custom Field "Review Fee" = yes add Traffic 
//					Control Plan Review fee (fee code = PW_PIP_35)if Custom Field "Street Occupancy Fee Amount " is
//					not = null (fee code = PW_PIP_30) then add this number to the fees amount not invoice 
//					(fee code = PW_PIP_30)Instructions to calculate Street Occupancy fee is 
//					based on values within Custom Fields
//
//Created By: 		Silver Lining Solutions
//*********************************************************************************************************

logDebug("Script 183 START");

if (wfTask == "TCP Review" && wfStatus == "Estimate Fee")
{
	logDebug("Script 183 Conditions met - will calculate fees per spec");
	
	if ({Review Fee} == "Yes")
	{
		//Add Traffic Control Plan Review fee PW_PIP_35
		logDebug("Script 183 calculating Review Fee");
		
	}
	if ({Street Occupancy Fee Amount} == )
	{
		//Add to the Street Occupancy fee based on ASI
		logDebug("Script 183 Calculating Street Occ Fee");
	}
	
}

logDebug("Script 183 END");




