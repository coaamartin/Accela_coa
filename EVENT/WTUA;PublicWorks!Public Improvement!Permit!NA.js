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
var doReviewFee = getAppSpecific("Review Fee");
var strOccFee = getAppSpecific("Script 183 calculating Review Fee");
var roadwayType = getAppSpecific("Roadway Type");
var workZoneLength = getAppSpecific("Work Zone Length");
var numberOfLanesClosed = getAppSpecific("Number of Lanes Closed");
var closureLength = getAppSpecific("Closure Length");
var durationOfClosureInDays = getAppSpecific("Duration of Closure in Days");
var sidewalkLength = getAppSpecific("Sidewalk Length");
var parkingLaneLength = getAppSpecific("Parking Lane Length");
var permitParkingLength = getAppSpecific("Permit Parking Length");
var meteredParkingLength = getAppSpecific("Metered Parking Length");
var bikeLaneLength = getAppSpecific("Bike Lane Length");
var peak = getAppSpecific("Peak");
var detour = getAppSpecific("Detour");

var strOccFeeAmount = 0;

if (wfTask == "TCP Review" && wfStatus == "Estimate Fee")
{
	logDebug("Script 183 Conditions met - will calculate fees per spec");
	logDebug("roadway type = " + roadwayType);
	
	if (roadwayType == "Local") 
	{
/*
If Custom Field "Work Zone Length" <= 224 (this is a minimum fee) 
	then fee amount is (0.15 X "Number of Lanes Closed" X "Closure Length" X "Duration of Closure in Days") 
	If Custom Field "Work Zone Length" > 224 and "Peak" = Yes 
		then fee amount is 2(0.15 X "Number of Lanes Closed" X "Closure Length" X "Duration of Closure in Days") 
		If Custom Field "Peak" = No 
			then fee amount = 0.42 X "Number of Lanes Closed" X "Duration of Closure in Days X 420"

Detour If Yes and Peak = Yes 
	then add this amount to the fee calc 2(154 X "Number of Lanes Closed" X "Duration of Closure in Days) 
	if Detour = Yes and Peak = No 
		then add fee amount (154 X "Number of Lanes Closed" X "Duration of Closure in Days).

If Sidewalk Length > 0 
	then add to fee amount (0.00 X Sidewalk Length X Duration of Closure in Days) = will calc to zero always, 
	however if they have a value in the future then script will only need that value changed unless zero produces an error

If "Parking Lanes Length" > 0 
	then add to fee amount (0.15 X Parking Lane Length? X Duration of Closure in Days)

If "Permit Parking Length" > 0 
	then add to fee amount (0.15 X Permit Parking Length X Duration of Closure in Days)

If "Metered Parking Length" > 0 
	then add to fee amount (0.41 X Metered Parking Length X Duration of Closure in Days)
*/
		if (workZoneLength <= 224)
		{
			strOccFeeAmount = strOccFeeAmount + (.15 * numberOfLanesClosed * closureLength * durationOfClosureInDays);
		}
		else
		{
			if (peak == "Yes")
			{
				strOccFeeAmount = strOccFeeAmount + (2 * (.15 * numberOfLanesClosed * closureLength * durationOfClosureInDays));
			}
			else if (peak == "No")
			{
				strOccFeeAmount = strOccFeeAmount + (.42 * numberOfLanesClosed * durationOfClosureInDays * 420);
			}
		}
		
		if (detour == "Yes")
		{
			if (peak == "Yes")
			{
				strOccFeeAmount = strOccFeeAmount + (2 * (154 * numberOfLanesClosed * durationOfClosureInDays));
			}
			else if (peak == "No")
			{
				strOccFeeAmount = strOccFeeAmount + (154 * numberOfLanesClosed * durationOfClosureInDays);
			}
		}
		if (sidewalkLength > 0)
		{
			strOccFeeAmount = strOccFeeAmount + (0 * sidewalkLength * durationOfClosureInDays);
		}
		if (parkingLaneLength > 0)
		{
			strOccFeeAmount = strOccFeeAmount + (.15 * parkingLaneLength * durationOfClosureInDays);
		}
		if (permitParkingLength > 0)
		{
			strOccFeeAmount = strOccFeeAmount + (.15 * permitParkingLength * durationOfClosureInDays);
		}
		if (meteredParkingLength > 0)
		{
			strOccFeeAmount = strOccFeeAmount + (.41 * meteredParkingLength * durationOfClosureInDays);
		}
	} 
	
	else if (roadwayType == "Arterial")
	{
/*
If Custom Field "Work Zone Length" <=412 (this is a minimum fee) 
	then fee amount is (0.42 X "Number of Lanes Closed" X "Closure Length" X "Duration of Closure in Days") 
	If Custom Field "Work Zone Length" > 412 and "Peak" = Yes 
		then fee amount is 2(0.42 X "Number of Lanes Closed" X "Closure Length" X "Duration of Closure in Days") 
		If Custom Field "Peak" = No 
			then fee amount = 0.42 X "Number of Lanes Closed" X "Duration of Closure in Days X 420"

Detour If Yes and Peak = Yes 
	then add this amount to the fee calc above - 2(154 X "Number of Lanes Closed" X "Duration of Closure in Days) 
	if Detour = Yes and Peak = No 
		then add fee amount above (154 X "Number of Lanes Closed" X "Duration of Closure in Days).

If Sidewalk Length > 0 
	then add to fee amount above (0.15 X Sidewalk Length X Duration of Closure in Days)

If Bike Lane Length > 0 
	then add to fee amount above (0.15 X Bike Lane Length X Duration of Closure in Days)

If "Parking Lanes Length" > 0 
	then add to fee amount above (0.41 X Parking Lane Length X Duration of Closure in Days)

If "Permit Parking Length" > 0 
	then add to fee amount above (0.15 X Permit Parking Length X Duration of Closure in Days)

If "Metered Parking Length" > 0 
	then add to fee amount above (0.41 X Metered Parking Length X Duration of Closure in Days)
*/				 	
		if (workZoneLength <= 412)
		{
			strOccFeeAmount = strOccFeeAmount + (.42 * numberOfLanesClosed * closureLength * durationOfClosureInDays);
		}
		else
		{
			if (peak == "Yes")
			{
				strOccFeeAmount = strOccFeeAmount + (2 * (.42 * numberOfLanesClosed * closureLength * durationOfClosureInDays));
			}
			else if (peak == "No")
			{
				strOccFeeAmount = strOccFeeAmount + (.42 * numberOfLanesClosed * durationOfClosureInDays * 420);
			}
		}
		
		if (detour == "Yes")
		{
			if (peak == "Yes")
			{
				strOccFeeAmount = strOccFeeAmount + (2 * (154 * numberOfLanesClosed * durationOfClosureInDays));
			}
			else if (peak == "No")
			{
				strOccFeeAmount = strOccFeeAmount + (154 * numberOfLanesClosed * durationOfClosureInDays);
			}
		}
		if (sidewalkLength > 0)
		{
			strOccFeeAmount = strOccFeeAmount + (.15 * sidewalkLength * durationOfClosureInDays);
		}
		if (bikeLaneLength > 0)
		{
			strOccFeeAmount = strOccFeeAmount + (.15 * bikeLaneLength * durationOfClosureInDays);
		}
		if (parkingLaneLength > 0)
		{
			strOccFeeAmount = strOccFeeAmount + (.41 * parkingLaneLength * durationOfClosureInDays);
		}
		if (permitParkingLength > 0)
		{
			strOccFeeAmount = strOccFeeAmount + (.15 * permitParkingLength * durationOfClosureInDays);
		}
		if (meteredParkingLength > 0)
		{
			strOccFeeAmount = strOccFeeAmount + (.41 * meteredParkingLength * durationOfClosureInDays);
		}
	} 
	
	else if (roadwayType == "Collector")
	{
/*
If Custom Field "Work Zone Length" <= 279 
	(this is a minimum fee) (0.42 X "Number of Lanes Closed" X "Closure Length" X "Duration of Closure in Days") 
	If Custom Field "Work Zone Length" > 279 and "Peak" = Yes 
		then fee amount is 2 (0.42 X "Number of Lanes Closed" X "Closure Length" X "Duration of Closure in Days") 
		If Custom Field "Peak" = No 
			then fee amount = 0.42 X "Number of Lanes Closed" X "Duration of Closure in Days X 420"

Detour If Yes and Peak = Yes 
	then add this amount to the fee calc 2(154 X "Number of Lanes Closed" X "Duration of Closure in Days) 
	if Detour = Yes and Peak = No 
		then add fee amount (154 X "Number of Lanes Closed" X "Duration of Closure in Days).

If Sidewalk Length > 0 
	then add to fee amount (0.15 X Sidewalk Length X Duration of Closure in Days)

If Bike Lane Length > 0 
	then add to fee amount (0.15 X Bike Lane Length X Duration of Closure in Days)

If "Parking Lanes Length" > 0 
	then add to fee amount (0.15 X Parking Lane Length? X Duration of Closure in Days)

If "Permit Parking Length" > 0 
	then add to fee amount (0.15 X Permit Parking Length X Duration of Closure in Days)

If "Metered Parking Length" > 0 
	then add to fee amount (0.41 X Metered Parking Length X Duration of Closure in Days)
*/		
		if (workZoneLength <= 279)
		{
			strOccFeeAmount = strOccFeeAmount + (.42 * numberOfLanesClosed * closureLength * durationOfClosureInDays);
		}
		else
		{
			if (peak == "Yes")
			{
				strOccFeeAmount = strOccFeeAmount + (2 * (.42 * numberOfLanesClosed * closureLength * durationOfClosureInDays));
			}
			else if (peak == "No")
			{
				strOccFeeAmount = strOccFeeAmount + (.42 * numberOfLanesClosed * durationOfClosureInDays * 420);
			}
		}
		
		if (detour == "Yes")
		{
			if (peak == "Yes")
			{
				strOccFeeAmount = strOccFeeAmount + (2 * (154 * numberOfLanesClosed * durationOfClosureInDays));
			}
			else if (peak == "No")
			{
				strOccFeeAmount = strOccFeeAmount + (154 * numberOfLanesClosed * durationOfClosureInDays);
			}
		}
		if (sidewalkLength > 0)
		{
			strOccFeeAmount = strOccFeeAmount + (.15 * sidewalkLength * durationOfClosureInDays);
		}
		if (bikeLaneLength > 0)
		{
			strOccFeeAmount = strOccFeeAmount + (.15 * bikeLaneLength * durationOfClosureInDays);
		}
		if (parkingLaneLength > 0)
		{
			strOccFeeAmount = strOccFeeAmount + (.41 * parkingLaneLength * durationOfClosureInDays);
		}
		if (permitParkingLength > 0)
		{
			strOccFeeAmount = strOccFeeAmount + (.15 * permitParkingLength * durationOfClosureInDays);
		}
		if (meteredParkingLength > 0)
		{
			strOccFeeAmount = strOccFeeAmount + (.41 * meteredParkingLength * durationOfClosureInDays);
		}
	}
	
	else if (roadwayType == "Alley")
	{
		
/* 
If Custom Field "Duration of Closure in Days" > 0 
	then 0.15 X Number of Lanes Closed X Closure Length X Duration of Closure in Days

Detour If Yes and Peak = Yes 
	then add this amount to the fee calc 2(154 X "Number of Lanes Closed" X "Duration of Closure in Days) 
	if Detour = Yes and Peak = No 
		then add fee amount (154 X "Number of Lanes Closed" X "Duration of Closure in Days).
*/				
		if (durationOfClosureInDays > 0)
		{
			strOccFeeAmount = strOccFeeAmount + (.15 * numberOfLanesClosed * closureLength * durationOfClosureInDays);
			if (detour == "Yes")
			{
				if (peak == "Yes")
				{
					strOccFeeAmount = strOccFeeAmount + (2 * (154 * numberOfLanesClosed * durationOfClosureInDays));
				}
				else if (peak == "No")
				{
					strOccFeeAmount = strOccFeeAmount + (154 * numberOfLanesClosed * durationOfClosureInDays);
				}
			}
		}
	}

	
	if (doReviewFee == "Yes")
	{
		//Add Traffic Control Plan Review fee PW_PIP_35
		logDebug("Script 183 calculating Review Fee");
		
	}
	if (strOccFee != null )
	{
		//Add to the Street Occupancy fee based on ASI
		logDebug("Script 183 Calculating Street Occ Fee");
	}
	logDebug("Street Occupation Fee = " + strOccFeeAmount);
}

logDebug("Script 183 END");




