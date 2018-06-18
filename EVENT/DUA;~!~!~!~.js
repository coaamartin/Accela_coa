doConfigurableScriptActions();

// For an unknown reason DUA is not finding this function in the INCLUDES_CUSTOM, so adding here

function doConfigurableScriptActions(){
	var module = appTypeArray[0];
	
	rulesetName = "CONFIGURABLE_RULESET_" + module;
	rulesetName = rulesetName.toUpperCase();
	logDebug("rulesetName: " + rulesetName);
	
	 var configRuleset = getScriptText(rulesetName);
	 if (configRuleset == ""){
		 logDebug("No JSON file exists for this module.");
	 }else{
		var configJSON = JSON.parse(configRuleset);

	// match event, run appropriate configurable scripts
		settingsArray = [];
		if(configJSON[controlString]) {
			var ruleSetArray = configJSON[controlString];
			var scriptsToRun = ruleSetArray.StandardScripts;
			
			for (s in scriptsToRun){
				logDebug("doConfigurableScriptActions scriptsToRun[s]: " + scriptsToRun[s]);
				var script = scriptsToRun[s];
				var validScript = getScriptText(script);
				if (validScript == ""){
					logDebug("Configurable script " + script + " does not exist.");
				}else{
					eval(getScriptText(scriptsToRun[s]));
				}
			}
		}
	}
}


//script 22 
logDebug("Script #22 Starting");
if (matchARecordType([
	  "PublicWorks/Drainage/NA/NA",
	  "PublicWorks/Civil Plans/*/*",
	  "PublicWorks/Pavement Design/NA/NA",
	  "Water/Utility/Master/Study"
  	], appTypeString)) {
	if(ifTracer(cap.getCapStatus() == "Waiting on Documents", "Record status = Waiting on Documents")) {
		include("22_activateCompletenessCheck");
	}
}