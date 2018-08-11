//script40_backFlowPreventerEmail Functions
//created by swakil

script40_backFlowPreventerEmail();
function script40_backFlowPreventerEmail()
{
	logDebug("Started script40_backFlowPreventerEmail..");
	if (wfTask == "Backflow Preventor" && wfStatus == "Final")
	{
		var emailtemplatename = "BACKFLOW PREVENTER NOTIFICATION";
		var vEParams = aa.util.newHashtable();
		var emailparams = aa.util.newHashtable();
		emailparams = addStdVarsToEmail(vEParams, capId);
		emailparams.put("$$wfDate$$", wfDate);
		emailAsync("backflow@auroragov.org", emailtemplatename, emailparams, "", "", "", "");
	}
	logDebug("Ended #40_backFlowPreventerEmail..");
};