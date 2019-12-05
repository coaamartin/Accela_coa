// This was updated on 12/4/42019 by Raymond Province

// script16_FillApplicationNameWhenEmpty();
var newBusinessName= getAppSpecific("Business Name");
logDebug("Updating Application Name field with Business Name of: " + newBusinessName);
editAppName(newBusinessName); 