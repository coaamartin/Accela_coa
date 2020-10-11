
/*-----------------------------------------------------------------------------------------------------/
| Event			: WorkflowTaskUpdateAfter
| Usage			: Additional Info Required Email for Licenses MJ Applications
| Notes			: Email Template must be provided by Aurora.
|			  The Correct eParams must be used according to the provided email template ,and must include wfComment.
| Created by	: ISRAA
| Created at	: 05/02/2018 08:28:24
|
/------------------------------------------------------------------------------------------------------*/
if ( (wfTask=="City Application Intake" || wfTask=="State Application Intake" || wfTask=="Application Review") && wfStatus=="Additional Info Required")
{
	include("210_SendMJEmail");
}
//SW Script 432
include("432_deactivateMJTasks");

// SW Script 433
include("433_MJ_Application_Update");

//schedule pending inspections
include("404_AppAutomationMJ");
