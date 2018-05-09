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
useAppSpecificGroupName=false;
var cOO=getAppSpecific("Certificate of Occupancy",capId);
if (cOO!="CHECKED"){
	deleteTask(capId,"Certificate of Occupancy");
}

//TestComment

