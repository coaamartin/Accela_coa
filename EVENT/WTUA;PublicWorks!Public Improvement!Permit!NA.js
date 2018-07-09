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
function doPIPCalculation(closureLength, sidewalkLength, parkingLaneLength, permitParkingLength, meteredParkingLength, bikeLaneLength,
						  peak, detour, durationOfClosureInDays, roadwayType, workZoneLength, numberOfLanesClosed)
{
	

	logDebug("Script 183: function doPIPCalculation START");
	var strOccFeeAmount = 0;

	
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



//****************************************************************************************
// Start of script 183
//****************************************************************************************
logDebug("Script 183 START");

var doReviewFee = getAppSpecific("Review Fee"); // y/n field indicating whether a review fee should be included
var strOccFee = getAppSpecific("Street Occupancy Fee Amount"); // this value is what is already in the ASI field before the script and will be added to the total of the rows

if (doReviewFee == "Yes"){
	//Add Traffic Control Plan Review fee PW_PIP_35
	logDebug("Script 183 calculating Review Fee");
	addFee("PW_PIP_35","PW_PIP","FINAL",1,"N");
}
	
if (wfTask == "TCP Review" && wfStatus == "Estimate Fee")
{
	logDebug("Script 183 Conditions met - will calculate fees per spec");
	var strOccFeeTotal = 0;
	var strOccFeeAmount = 0;
	
	var closureLength = null;
	var sidewalkLength = null;
	var parkingLaneLength = null;
	var permitParkingLength = null;
	var meteredParkingLength = null;
	var bikeLaneLength = null;
	var peak = null;
	var detour = null;
	var durationOfClosureInDays = null;
	var roadwayType = null;
	var workZoneLength = null;
	var numberOfLanesClosed = null;
	var strOccFee = getAppSpecific("Street Occupancy Fee Amount");
	
	//Add to the Street Occupancy fee based on ASI
	logDebug("Script 183 Calculating Street Occ Fee");

	if (strOccFee != null)
		strOccFeeTotal = parseFloat(strOccFee);


	var table = loadASITable("TRAFFIC CONTROL INFORMATION");
	for (var i in table) {
		row = table[i];
		closureLength = row["Closure Length"].fieldValue;
		sidewalkLength = row["Sidewalk Length"].fieldValue;
		parkingLaneLength = row["Parking Lane Length"].fieldValue;
		permitParkingLength = row["Permit Parking Length"].fieldValue;
		meteredParkingLength = row["Metered Parking Length"].fieldValue;
		bikeLaneLength = row["Bike Lane Length"].fieldValue;
		peak = row["Peak"].fieldValue;
		detour = row["Detour"].fieldValue;
		durationOfClosureInDays = row["Duration of Closure in Days"].fieldValue;
		roadwayType = row["Roadway Type"].fieldValue;
		workZoneLength = row["Work Zone Length"].fieldValue;
		numberOfLanesClosed = row["Number of Lanes Closed"].fieldValue;
		
		logDebug("i = " + i + " row = " + row + " cl = " + closureLength);
		logDebug("cl  = " + closureLength);
		logDebug("swl = " + sidewalkLength);
		logDebug("pll = " + parkingLaneLength);
		logDebug("ppl = " + permitParkingLength);
		logDebug("mpl = " + meteredParkingLength);
		logDebug("bll = " + bikeLaneLength);
		logDebug("p   = " + peak);
		logDebug("d   = " + detour);
		logDebug("dcd = " + durationOfClosureInDays);
		logDebug("rt  = " + roadwayType);
		logDebug("wzl = " + workZoneLength);
		logDebug("nlc = " + numberOfLanesClosed);
		
		var strOccFeeAmount = doPIPCalculation(closureLength, sidewalkLength, parkingLaneLength, permitParkingLength, meteredParkingLength, bikeLaneLength,
												peak, detour, durationOfClosureInDays, roadwayType, workZoneLength, numberOfLanesClosed);
		
		var strOccFeeTotal = strOccFeeTotal + strOccFeeAmount;
		logDebug("amount = " + strOccFeeAmount + " & total = " + strOccFeeTotal);
		
	}
	addFee("PW_PIP_30","PW_PIP","FINAL",strOccFeeAmount,"N");

	logDebug("Street Occupation Fee = " + strOccFeeAmount);
}

logDebug("Script 183 END");