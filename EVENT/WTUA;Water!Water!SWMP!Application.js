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

createPPBMPRecord("Re Certification", [ "Accepted" ], "POND TYPES");

script399_BondEmailAndAwaitingBondTaskStatus();
