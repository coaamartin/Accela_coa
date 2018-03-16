//Script 197
//Record Types:	Building/NA/NA/NA 
//Event: 		ISA
//Desc:	 
//
//              Criteria If the inspectionType = “Sprinkler System” is scheduled
//              Action update the record status to “Awaiting Inspection”
//
//Created By: Silver Lining Solutions

function script197_SetAwaitingInspectionStatus() {
	logDebug("script197_SetAwaitingInspectionStatus() started.");
	try {
		if(inspType == "Sprinkler System" ){
			updateAppStatus("Awaiting Inspection");
		}
	}
	catch (err) {
		comment("Error on custom function script197_SetAwaitingInspectionStatus(). Please contact administrator. Err: " + err);
	}

};//END script197_SetAwaitingInspectionStatus();
