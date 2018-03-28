//Script 40
//Created by SW 2018-03-27
logDebug("Starting Script");
if (wfTask == "Backflow Preventor" && wfStatus == "Final") {
	backFlowPreventerEmail();
}


/*--Supporting Functions--*/

function backFlowPreventerEmail(){
	try 
	{
	var applicant = getContactByType("Applicant", capId);
	if (!applicant || !applicant.getEmail()) {
		logDebug("**WARN no applicant found on or no email capId=" + capId);
		return false;
	}
	var email = applicant.getEmail();
	var emailtemplatename = "BACKFLOW PREVENTER NOTIFICATION";
	var vEParams = aa.util.newHashtable();
	var emailparams = addStdVarsToEmail(vEParams, capId);
	emailparams.put("$$wfDate$$", wfDate);
	emailAsync(email, emailtemplatename, emailparams, "", "", "", "");

	}
	catch (err) 
	{
		logDebug("A JavaScript Error occured: " + err.message);
	}
}
