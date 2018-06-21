//Script 94
//Record Types:	Enforcement/Incident/Abatement/NA
//Event: 		PRA
//Desc:			If criteria: If the record status is NOT equal to “Special Assessment” 
//				and there is a 0 balance due
//
//				Action: Then status workflow task "Recordation" with the task status 
//				"Lien Paid" and activate the “Release Lien” workflow task
//
//Created By: Silver Lining Solutions


	logDebug ("script94 START");
	logDebug ("this is a special assesement")
	if (capStatus!=“Special Assessment”){};
	
	
	
	logDebug ("script94 END");
