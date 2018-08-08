var $iTrc = ifTracer;
/*
Title : Issue Permit Conditions (WorkflowTaskUpdateBefore) 

Purpose : check if parent of certain type exists, and has a certain capStatus, block workflow submit

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
    validateParentCapStatus([ "Issued" ], "Building/Permit/Master/NA", "Unapproved");
*/

if(appMatch("Building/Permit/New Building/NA") || appMatch("Building/Permit/Plans/NA"))
    validateParentCapStatus([ "Issued" ], "Building/Permit/Master/NA", "Unapproved");

//Sharepoint script ID 2 part 3
//commented the code below because latest specs Script-2-Version4.pdf don't have part 3
//if(wfTask =="Permit Issuance" && wfStatus =="Issued" && balanceDue>0){
//  
//              cancel=true;
//              showMessage=true;
//              comment("All fees must be paid prior to issuance");
//  
//}


if($iTrc(wfTask == "Permit Issuance" && wfStatus == "Issued", 'wf:Permit Issuance/Issued')){
    if(appMatch("Building/Permit/New Building/NA") || appMatch("Building/Permit/Plans/NA") || appMatch("Building/Permit/No Plans/NA"))
        bldScript2_noContractorCheck();
}

//script ID: 52_Allow_Prevent_Final_CO
if ("Inspection Phase".equals(wfTask) && exists(wfStatus, ["Ready for CO", "Final"]))
{
	include("52_Allow_Prevent_Final_CO");
}