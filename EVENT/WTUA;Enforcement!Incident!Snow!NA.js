//Script 73
//Record Types:	​Enforcement/Incident/Snow/NA
//				Enforcement/Incident/Snow/NA
//				Enforcement/Incident/Snow/NA
//				Forestry/Request/Citizen/NA

//Event: 		TBD
//Desc:			TBD
//Created By: Silver Lining Solutions

logDebug("START: Script 77");

if (wfTask == "Initial Investigation" && wfStatus == "Skip to City Abatement")
{
	logDebug("task/status criteria met");
	closeTask("Initial Investigation","Skip to City Abatement","auto closed by script","auto closed by script");
	updateAppStatus("Closed","auto closed");
}


logDebug("END: Script 77");