//WTUB:LICENSES/MARIJUANA/*/APPLICATION
/*
Title : Prevent License Issuance until Inspections are completed (WorkflowTaskUpdateBefore) 

Purpose : Event WorflowUpdateBefore Criteria wfTask = License Issuance and Status = Issued Action check that all Scheduled
Inspections are done, if not raise error message.

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	checkInspectionsAndPreventLicenseIssuance("License Issuance", [ "Issued" ]);
*/

//checkInspectionsAndPreventLicenseIssuance("License Issuance", [ "Issued" ]);

//sw 495
var feeAdded = _isFeeAdded(capId);
//defer payment only adds fee. If fee added it must be invoiced and paid
if(feeAdded){
	cancel = true;
	showMessage=true;
	comment("Fee exist and not invoiced. All fees must be paid prior to advancing workflow");
}

if(balanceDue > 0){
	cancel = true;
	showMessage=true;
	comment("All fees must be paid prior to advancing workflow");
}

//SW ID 431
include("431_allInspectionsResultedWF");
//SWAKIL ID 489
if ("City Application Intake".equals(wfTask) && "Complete".equals(wfStatus))
{
	//include("489_Check_MJ_Application_Docs");
}

//SW ID 503
include("503_CityStateFees");




/*#####################################
Internal functions
#####################################*/
function _isFeeAdded(vcapId){
	var thisItem = arguments[0];
	var getFeeResult = aa.fee.getFeeItems(thisItem, null, "NEW");
	if (getFeeResult.getSuccess()) {
		var feeList = getFeeResult.getOutput();
		for (feeNum in feeList) {
			if (feeList[feeNum].getFeeitemStatus().equals("NEW")) {
				var feeAmount = feeList[feeNum].getFee();
				//convert string to num
				feeAmount = feeAmount*1
				//logDebug("Fee Amount: " +feeAmount )
				if(feeAmount > 0){
					return true;
				}
			}
		}
	}
	return false;
}

