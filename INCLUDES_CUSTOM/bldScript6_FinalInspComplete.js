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
			
			if (allwfTasksComplete(capId, "Inspection Phase") == false) {
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