function bldScript6_FinalInspComplete(){
    logDebug("bldScript6_FinalInspComplete() started")
    try{
        var $iTrc = ifTracer,
            pendOrSched = inspectionsByStatus(capId, "scheduled") || inspectionsByStatus(capId, "pending"),
            lettersReceived = checkReqLettersReceived(capId),
            certOfOccup = AInfo["Certificate of Occupancy"] == "CHECKED";
            
        if($iTrc(inspResult == "Final" && !pendOrSched, 'New Building && inspResult == "Final" AND no pending or scheduled inspections')){
            if($iTrc(appTypeString == "Building/Permit/New Building/NA", 'New Building'))
                if($iTrc(lettersReceived && !certOfOccup, 'lettersReceived && !certOfOccup')) {
                    closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
				}
            
            if($iTrc(appTypeString == "Building/Permit/Plans/NA" && !certOfOccup, 'appTypeString == "Building/Permit/Plans/NA" && !certOfOccup')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}
            
            if($iTrc(appTypeString == "Building/Permit/No Plans/NA", 'appTypeString == "Building/Permit/No Plans/NA"')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}

			if($iTrc(appTypeString == "Building/Permit/OTC/AC Only", 'appTypeString == "Building/Permit/OTC/AC Only"')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}

			if($iTrc(appTypeString == "Building/Permit/OTC/Furnace", 'appTypeString == "Building/Permit/OTC/Furnace"')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}

			if($iTrc(appTypeString == "Building/Permit/OTC/Furnace and AC", 'appTypeString == "Building/Permit/OTC/Furnace and AC"')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}

			if($iTrc(appTypeString == "Building/Permit/OTC/Furnace AC and Water Heater", 'appTypeString == "Building/Permit/OTC/Furnace AC and Water Heater"')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}

			if($iTrc(appTypeString == "Building/Permit/OTC/Commercial Roof", 'appTypeString == "Building/Permit/OTC/Commercial Roof"')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}

            if($iTrc(appTypeString == "Building/Permit/OTC/Gas Pipe", 'appTypeString == "Building/Permit/OTC/Gas Pipe"')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}			

			if($iTrc(appTypeString == "Building/Permit/OTC/Residential Electrical Service", 'appTypeString == "Building/Permit/OTC/Residential Electrical Service"')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}

			if($iTrc(appTypeString == "Building/Permit/OTC/Residential Roof", 'appTypeString == "Building/Permit/OTC/Residential Roof"')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}

			if($iTrc(appTypeString == "Building/Permit/OTC/Siding", 'appTypeString == "Building/Permit/OTC/Siding"')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}

			if($iTrc(appTypeString == "Building/Permit/OTC/Tankless Water Heater", 'appTypeString == "Building/Permit/OTC/Tankless Water Heater"')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}

			if($iTrc(appTypeString == "Building/Permit/OTC/Water Heater", 'appTypeString == "Building/Permit/OTC/Water Heater"')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}

			if($iTrc(appTypeString == "Building/Permit/OTC/Water Heater and AC", 'appTypeString == "Building/Permit/OTC/Water Heater and AC"')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}

			if($iTrc(appTypeString == "Building/Permit/OTC/Water Heater and Furnace", 'appTypeString == "Building/Permit/OTC/Water Heater and Furnace"')) {
                closeTask("Inspection Phase", "Final", "Closed via script", "Closed via script");
			}

			if ((allTasksComplete("BLD_NEWCON") == false) || (allTasksComplete("BLD_MASTER") == false)){
					updateAppStatus("Issued","Status updated via script 6");				
			}
        }
    }
    catch(err){
        showMessage = true;
        comment("Error on custom function bldScript6_FinalInspComplete(). Err: " + err);
    }
    logDebug("bldScript6_FinalInspComplete() ended")
}//END bldScript6_FinalInspComplete()