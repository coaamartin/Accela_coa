//WTUA:Water/Water/SWMP/APPLICATION

include("13_WaterSWMPEmailInvoicedFees");

/*
Title : Create PPBMP Record (WorkflowTaskUpdateAfter)

Purpose : on specified wfTask&wfStatus, create child record from ASIT on Parent or grand parent, and copy APO and data to child

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	createPPBMPRecord("Re Certification", [ "Accepted" ], "POND TYPES");
	
Notes:
	- Task name 'Re Certification' not Recertification
*/

//script 238
logDebug('Script 238 Starting')
if (ifTracer(wfTask=="Fee Processing" && 
		(wfStatus=="No fees due" || wfStatus=="Fees Paid" || wfStatus=="Paid by Bond"),
		'wfTask & wfStatus match')) {

	emailContactsWithCCs(
		"Applicant", 
		"SWMP PERMIT ISSUED # 238", 
		aa.util.newHashtable(), 
		"", 
		aa.util.newHashtable(), 
		"N", 
		"", 
		"Contact,Project Owner"
	);
}

createPPBMPRecord("Re Certification", [ "Accepted" ], "POND TYPES");

script399_BondEmailAndAwaitingBondTaskStatus();
