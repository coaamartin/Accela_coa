//------------------------------------------------------------------------------------------------------/
// Program		: ASA:BUILDING/PERMIT/*/*
/* Event		: ApplicationSubmitAfter, WorkflowTaskUpdateAfter
|
| Usage			: 
| Notes			: 
| Created by	: ISRAA
| Created at	: 29/01/2018 15:41:
|
/------------------------------------------------------------------------------------------------------*/
var tmpUASGN = useAppSpecificGroupName;
useAppSpecificGroupName=false;
var cOO=getAppSpecific("Certificate of Occupancy",capId);
useAppSpecificGroupName = tmpUASGN;
if (cOO!="CHECKED"){
	deactivateTask("Certificate of Occupancy");
}

//SWAKIL
include("5047_master_plan_parent");

