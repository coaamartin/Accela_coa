//COA Script #22 added by JMAIN
include("5022_publicworksPIPermitFinalAcceptanceEmail");

//COA Script #51 added by SWAKIL
include("5051_deactivatePIInspectionTask");
/*------------------------------------------------------------------------------------------------------/
Title       : Update Assigned user for Traffic Engineering Request(WorkflowTaskUpdateAfter).

Purpose     :If workflow Task = Initial Review or Initial Supervisor Review and workflow status = "Assigned" then update workflow task
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
//script 183        Assess Public Improvement Fees
//
//Record Types:     PublicWorks/Public Improvement/Permit/NA
//Event:            WTUA - WorkflowTaskUpdateAfter
//Desc:             When the wfTask = "TCP Review" and the status = "Estimate Fee" then add but do NOT invoice 
//                  the Street Occupation Fee and Review fee on the record from Custom Fields under subgroup 
//                  TRAFFIC CONTROL INFORMATION (FEE GROUP: PW_PIP) if Custom Field "Review Fee" = yes add Traffic 
//                  Control Plan Review fee (fee code = PW_PIP_35)if Custom Field "Street Occupancy Fee Amount " is
//                  not = null (fee code = PW_PIP_30) then add this number to the fees amount not invoice 
//                  (fee code = PW_PIP_30)Instructions to calculate Street Occupancy fee is 
//                  based on values within Custom Fields
//
//Created By:       Silver Lining Solutions
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
    
    else if (roadwayType == "Arterial") {
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
            { strOccFeeAmount = strOccFeeAmount + (.15 * sidewalkLength * durationOfClosureInDays); }
        if (bikeLaneLength > 0)
            { strOccFeeAmount = strOccFeeAmount + (.15 * bikeLaneLength * durationOfClosureInDays); }
        if (parkingLaneLength > 0)
            { strOccFeeAmount = strOccFeeAmount + (.41 * parkingLaneLength * durationOfClosureInDays);  }
        if (permitParkingLength > 0)
            { strOccFeeAmount = strOccFeeAmount + (.15 * permitParkingLength * durationOfClosureInDays); }
        if (meteredParkingLength > 0)
            { strOccFeeAmount = strOccFeeAmount + (.41 * meteredParkingLength * durationOfClosureInDays); }
    } // end of Arterial
    
    else if (roadwayType == "Collector") {
        if (workZoneLength <= 279)  {
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
            { strOccFeeAmount = strOccFeeAmount + (.15 * sidewalkLength * durationOfClosureInDays); }
        if (bikeLaneLength > 0)
            { strOccFeeAmount = strOccFeeAmount + (.15 * bikeLaneLength * durationOfClosureInDays); }
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
                    { strOccFeeAmount = strOccFeeAmount + (2 * (154 * numberOfLanesClosed * closureLength * durationOfClosureInDays));  }
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
if (ifTracer(wfTask == "TCP Review" && wfStatus == "Estimate Fee", 'wfTask == "TCP Review" && wfStatus == "Estimate Fee"')){
    pubWrksScript183_assessFeesScenario1();
}

if(ifTracer(wfTask == "Fee Processing" && wfStatus == "Estimate Fee", 'wf:Fee Processing/Estimate Fee')){
    pubWrksScript183_assessFees();
}

if(ifTracer(wfTask == "Fee Processing" && wfStatus == "Ready to Pay", 'wf:Fee Processing/Ready to Pay')){
    //Script 183 Invoice fees if they exists
    var fees2Inv = ["PW_PIP_13","PW_PIP_15","PW_PIP_16","PW_PIP_14","PW_PIP_23","PW_PIP_31 ","PW_PIP_32","PW_PIP_03","PW_PIP_34","PW_PIP_17","PW_PIP_05","PW_PIP_37","PW_PIP_20","PW_PIP_22","PW_PIP_04","PW_PIP_11","PW_PIP_19","PW_PIP_18","PW_PIP_12","PW_PIP_02","PW_PIP_10","PW_PIP_01","PW_PIP_07","PW_PIP_21","PW_PIP_09","PW_PIP_08","PW_PIP_24","PW_PIP_06"];
    for(f in fees2Inv){ if(feeExists(fees2Inv[f])) invoiceFee(fees2Inv[f], "FINAL"); }
	
	var scrt183Fees = ["PW_PIP_30", "PW_PIP_35", "PW_PIP_36"];
	for(f in scrt183Fees){ if(feeExists(scrt183Fees[f])) invoiceFee(scrt183Fees[f], "FINAL"); }
    //END Script 183
	
	//invoiceNewFeesOneInvoice(capId);
}
