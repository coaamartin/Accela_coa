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
// for conditional document
if (publicUser)
{
	try
	{	
		var documentModels = documentModelArray.toArray();
		var documentModel = null;
		var conditionNumber = 0;
		logDebug("documentModels.length = " + documentModels.length);

		if(conditionNumber != null && conditionNumber != 0)
		{
			for(i = 0; i<documentModels.length;i++)
			{
				documentModel = documentModels[i];
				conditionNumber = documentModel.getConditionNumber();
				logDebug(" i = " + i);
				logDebug("Condition Number = " + conditionNumber);				
				var capConditions = getCAPConditions("Required Document");
				for (var c in capConditions)
				{

					var capCondition = capConditions[c].object;
					if (!capCondition.getReferenceConditionNumber() == conditionNumber)
						continue;
					if (capCondition == null) { logDebug("capCondition is null"); continue; }
					
					var conditionGroup = capCondition.getConditionGroup();
					var conditionName = capCondition.getConditionDescription();
					var docGroup = "";
					var capType = aa.cap.getCapTypeModelByCapID(capId).getOutput();				
					if (capType)
						docGroup = capType.getDocCode();
					documentModel.setDocCategory(conditionName);
					documentModel.setDocGroup(docGroup);
					
					logDebug("Condition Name - " + conditionName);
					logDebug("Condition Group - " + conditionGroup);
					var updateDocumentResult = aa.document.updateDocument(documentModel);
					if(updateDocumentResult.getSuccess())
					{
						logDebug("Update document model successfully - " + documentModel.getDocName());
					}
					else
					{
						logDebug("Update document model failed - " + documentModel.getDocName());
					}
					break;
				}
			}
		}
	}
	catch(e)
	{
		logDebug("PROBLEM in DUA:*/*/*/*: " + e.message + " on line: " + e.lineNumber + ", stack: " + e.stack);		
	}
	finally
	{
	}
}