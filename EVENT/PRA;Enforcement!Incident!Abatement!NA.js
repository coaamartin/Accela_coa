//Script 94
//Record Types:	Enforcement/Incident/Abatement/NA
//Event: 		PRA
//Desc:			If criteria: If the record status is NOT equal to Special Assessment 
//				and there is a 0 balance due
//
//				Action: Then update task Recordation status Lien Paid 
//				and activate the Release Lien workflow task
//
//Created By: Silver Lining Solutions

logDebug ("script94 START");

if (capStatus != "Special Assessment" && balanceDue == 0 ) 
{
	logDebug ("script94 criteria met");
	resultWorkflowTask("Recordation","Lien Paid","updated by script","updated by script");
	//activateTask("Release Lien");
}
logDebug ("script94 END");
