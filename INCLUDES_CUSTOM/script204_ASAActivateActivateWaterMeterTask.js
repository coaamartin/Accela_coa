//Script  204
//Record Types:	Building/NA/NA/NA
//Event: 		ApplicationSubmitAfter(Civic Platform) or ConvertToRealCapAfter(ACA)
//Desc:			If criteria:
//				If Custom Field Single Family Detached Homes = No
//				Action: then Activate the Water Meter WF task.
//Created By: Silver Lining Solutions

function script204_ASAActivateActivateWaterMeterTask() {
	logDebug("script204_ASAActivateActivateWaterMeterTask started.");
	try{
		if(!publicUser){
			var asiSingleFamilyDetachedHome = AInfo["Single Family Detached Home"];
		}
		else {
			loadAppSpecific4ACA(AInfo);
			var asiSingleFamilyDetachedHome = AInfo["Single Family Detached Home"];
		}
		logDebug("script204: Single Family Detached Home:"+asiSingleFamilyDetachedHome);
		if (asiSingleFamilyDetachedHome == "No" )
		{
				activateTask("Water Meter");
		}
	}
	catch(err){
		showMessage = true;
		comment("script204: Error on custom function script204_ASAActivateActivateWaterMeterTask(). Please contact administrator. Err: " + err);
		logDebug("script204: Error on custom function script204_ASAActivateActivateWaterMeterTask(). Please contact administrator. Err: " + err);
	}
	logDebug("script204_ASAActivateActivateWaterMeterTask() ended.");
};//END script204_ASAActivateActivateWaterMeterTask();
