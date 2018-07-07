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

resubmittalRequestedEmailNotification(null, [ "Resubmittal Requested" ], "PI RESUBMITTAL REQUESTED # 382");

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

//*********************************************************************************************************
// function doPIPCalculation() is used by script 183 to calculate each row in the Traffic Control Information Table
//*********************************************************************************************************
function doPIPCalculation()
{
	var closureLength = getAppSpecific("Closure Length");									// now in ASIT row **** NEEDS TO BE THERE

	var sidewalkLength = getAppSpecific("Sidewalk Length");									// now in ASIT row
	var parkingLaneLength = getAppSpecific("Parking Lane Length");							// now in ASIT row
	var permitParkingLength = getAppSpecific("Permit Parking Length");						// now in ASIT row
	var meteredParkingLength = getAppSpecific("Metered Parking Length");					// now in ASIT row
	var bikeLaneLength = getAppSpecific("Bike Lane Length");								// now in ASIT row
	var peak = getAppSpecific("Peak");														// now in ASIT row
	var detour = getAppSpecific("Detour");													// now in ASIT row
	var durationOfClosureInDays = getAppSpecific("Duration of Closure in Days");  			// now in ASIT row
	var roadwayType = getAppSpecific("Roadway Type");  										// now in ASIT row
	var workZoneLength = getAppSpecific("Work Zone Length");  								// now in ASIT row
	var numberOfLanesClosed = getAppSpecific("Number of Lanes Closed");  					// now in ASIT row

	logDebug("Script 183: function doPIPCalculation START");
	var strOccFeeAmount = 0;

	if (strOccFee != null)
	{
		strOccFeeAmount = Number(strOccFee);
	} 
	
	logDebug("roadway type = " + roadwayType);
	if (roadwayType == "Local") {
		if (workZoneLength <= 224){
			if (peak == "Yes")
				{ strOccFeeAmount = strOccFeeAmount + (2 * (.15 * numberOfLanesClosed * 225 * durationOfClosureInDays)); }
			else if (peak == "No")
				{ strOccFeeAmount = strOccFeeAmount + (.15 * numberOfLanesClosed * durationOfClosureInDays * 225); }
		}
		else {
			if (peak == "Yes")
				{ strOccFeeAmount = strOccFeeAmount + (2 * (.15 * numberOfLanesClosed * closureLength * durationOfClosureInDays)); }
			else if (peak == "No")
				{ strOccFeeAmount = strOccFeeAmount + (.15 * numberOfLanesClosed * durationOfClosureInDays * closureLength); }
		}
		if (detour == "Yes") {
			if (peak == "Yes")
			{ strOccFeeAmount = strOccFeeAmount + (2 * (154 * numberOfLanesClosed * closureLength * durationOfClosureInDays)); }
			else if (peak == "No")
				{ strOccFeeAmount = strOccFeeAmount + (154 * numberOfLanesClosed * closureLength * durationOfClosureInDays); }
		}
		if (sidewalkLength > 0)
			{ strOccFeeAmount = strOccFeeAmount + (0 * sidewalkLength * durationOfClosureInDays); }
		if (parkingLaneLength > 0)
			{ strOccFeeAmount = strOccFeeAmount + (.15 * parkingLaneLength * durationOfClosureInDays); }
		if (permitParkingLength > 0)
			{ strOccFeeAmount = strOccFeeAmount + (.15 * permitParkingLength * durationOfClosureInDays); }
		if (meteredParkingLength > 0)
			{ strOccFeeAmount = strOccFeeAmount + (.41 * meteredParkingLength * durationOfClosureInDays); }
	} // end of Local
	
	else if (roadwayType == "Arterial")	{
		if (workZoneLength <= 419){
			if (peak == "Yes")
				{ strOccFeeAmount = strOccFeeAmount + (2 * (.42 * numberOfLanesClosed * 420 * durationOfClosureInDays)); }
			else if (peak == "No")
				{ strOccFeeAmount = strOccFeeAmount + (.42 * numberOfLanesClosed * durationOfClosureInDays * 420); }
		}
		else {
			if (peak == "Yes")
				{ strOccFeeAmount = strOccFeeAmount + (2 * (.42 * numberOfLanesClosed * closureLength * durationOfClosureInDays)); }
			else if (peak == "No")
				{ strOccFeeAmount = strOccFeeAmount + (.42 * numberOfLanesClosed * durationOfClosureInDays * closureLength); }
		}
		if (detour == "Yes") {
			if (peak == "Yes")
				{ strOccFeeAmount = strOccFeeAmount + (2 * (154 * numberOfLanesClosed * closureLength * durationOfClosureInDays)); }
			else if (peak == "No")
				{ strOccFeeAmount = strOccFeeAmount + (154 * numberOfLanesClosed * closureLength * durationOfClosureInDays); }
		}
		if (sidewalkLength > 0)
			{ strOccFeeAmount = strOccFeeAmount + (.15 * sidewalkLength * durationOfClosureInDays);	}
		if (bikeLaneLength > 0)
			{ strOccFeeAmount = strOccFeeAmount + (.15 * bikeLaneLength * durationOfClosureInDays);	}
		if (parkingLaneLength > 0)
			{ strOccFeeAmount = strOccFeeAmount + (.41 * parkingLaneLength * durationOfClosureInDays);	}
		if (permitParkingLength > 0)
			{ strOccFeeAmount = strOccFeeAmount + (.15 * permitParkingLength * durationOfClosureInDays); }
		if (meteredParkingLength > 0)
			{ strOccFeeAmount = strOccFeeAmount + (.41 * meteredParkingLength * durationOfClosureInDays); }
	} // end of Arterial
	
	else if (roadwayType == "Collector") {
		if (workZoneLength <= 279)	{
			if (peak == "Yes")
				{ strOccFeeAmount = strOccFeeAmount + (2 * (.42 * numberOfLanesClosed * 280 * durationOfClosureInDays)); }
			else if (peak == "No")
				{ strOccFeeAmount = strOccFeeAmount + (.42 * numberOfLanesClosed * durationOfClosureInDays * 280); }		
		}
		else {
			if (peak == "Yes")
				{ strOccFeeAmount = strOccFeeAmount + (2 * (.42 * numberOfLanesClosed * closureLength * durationOfClosureInDays)); }
			else if (peak == "No")
				{ strOccFeeAmount = strOccFeeAmount + (.42 * numberOfLanesClosed * durationOfClosureInDays * closureLength); }
		}
		if (detour == "Yes") {
			if (peak == "Yes")
				{ strOccFeeAmount = strOccFeeAmount + (2 * (154 * numberOfLanesClosed * closureLength * durationOfClosureInDays)); }
			else if (peak == "No")
				{ strOccFeeAmount = strOccFeeAmount + (154 * numberOfLanesClosed * closureLength * durationOfClosureInDays); }
		}
		if (sidewalkLength > 0)
			{ strOccFeeAmount = strOccFeeAmount + (.15 * sidewalkLength * durationOfClosureInDays);	}
		if (bikeLaneLength > 0)
			{ strOccFeeAmount = strOccFeeAmount + (.15 * bikeLaneLength * durationOfClosureInDays);	}
		if (parkingLaneLength > 0)
			{ strOccFeeAmount = strOccFeeAmount + (.41 * parkingLaneLength * durationOfClosureInDays); }
		if (permitParkingLength > 0)
			{ strOccFeeAmount = strOccFeeAmount + (.15 * permitParkingLength * durationOfClosureInDays); }
		if (meteredParkingLength > 0)
			{ strOccFeeAmount = strOccFeeAmount + (.41 * meteredParkingLength * durationOfClosureInDays); }
	} // end of Collector
	
	else if (roadwayType == "Alley") {
		if (durationOfClosureInDays > 0) {
			strOccFeeAmount = strOccFeeAmount + (.15 * numberOfLanesClosed * closureLength * durationOfClosureInDays);
			if (detour == "Yes"){
				if (peak == "Yes")
					{ strOccFeeAmount = strOccFeeAmount + (2 * (154 * numberOfLanesClosed * closureLength * durationOfClosureInDays));	}
				else if (peak == "No")
					{ strOccFeeAmount = strOccFeeAmount + (154 * numberOfLanesClosed * closureLength * durationOfClosureInDays); }
			}
		}
	} // end of Alley

	logDebug("Fee Amount = " + strOccFeeAmount);
	logDebug("Script 183: function doPIPCalculation END");
	return strOccFeeAmount;
}

logDebug("Script 183 START");
var doReviewFee = getAppSpecific("Review Fee"); // y/n field indicating whether a review fee should be included
var strOccFee = getAppSpecific("Street Occupancy Fee Amount"); // this value is what is already in the ASI field before the script and will be added to the total of the rows


//****************************************************************************************
// Start of script 183
//****************************************************************************************
if (wfTask == "TCP Review" && wfStatus == "Estimate Fee")
{
	logDebug("Script 183 Conditions met - will calculate fees per spec");


	if (doReviewFee == "Yes"){
		//Add Traffic Control Plan Review fee PW_PIP_35
		logDebug("Script 183 calculating Review Fee");
		addFee("PW_PIP_35","PW_PIP","FINAL",1,"N");
	}

	//Add to the Street Occupancy fee based on ASI
	logDebug("Script 183 Calculating Street Occ Fee");
	var strOccFeeAmount = doPIPCalculation();
	addFee("PW_PIP_30","PW_PIP","FINAL",strOccFeeAmount,"N");

	logDebug("Street Occupation Fee = " + strOccFeeAmount);
}

logDebug("Script 183 END");




