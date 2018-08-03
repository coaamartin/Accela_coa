//CRM INTEGRATION BEGIN - DO NOT CHANGE
//include INCLUDES_CRM functions for CRM integration
showDebug = true;
eval(getScriptText("INCLUDES_CRM", null, false));
logDebug("***** BEGIN CRM INTEGRATION *****");
processShadowRecord(capId, wfTask, wfStatus, wfComment);
logDebug("*****   END CRM INTEGRATION *****");
//CRM INTEGRATION END
