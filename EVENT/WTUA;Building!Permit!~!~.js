var SCRIPT_VERSION = 3.0
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
eval(getScriptText("INCLUDES_CUSTOM",null,true));

function getScriptText(vScriptName){
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(),vScriptName,"ADMIN");
    return emseScript.getScriptText() + "";          
}


//WTUA:Building/Permit/*/*

updateExpirationDateAsi();

/*
Title : Set the Code Reference custom field value (WorkflowTaskUpdateAfter)
Purpose : If the workflow status = "Issued" and the custom field "Code Reference" is not filled out with data then
          update the "Code Reference" field with the value "2015 I-Codes/Aurora Muni Codes/2017-NEC".

Author: Ahmad WARRAD
 
Functional Area : Records

Sample Call:
	setCodeReference("Complete");

Notes:
1- The script will update the "Code Reference" custom field, when the workflow status = "Complete"
*/

// In specification record the status is "Issued", but we set it to "Complete", since we didn't find an "Issued" status
var wfStatusCompareVal = "Complete";
setCodeReference(wfStatusCompareVal);

/*------------------------------------------------------------------------------------------------------/
Title 		: Building Certificate of Occupancy does Complete on License WF(WorkflowTaskUpdateAfter).

Purpose		:If the workflow task “Inspection Phase” has a status of “Temporary CO Issued” or “Ready for CO” then use the address on
		the record to go out and see if an MJ License Application exists on that address. and If a MJ License Application exists on
		that address then close the workflow task “Certificate of Occupancy” with a status of “Final CO Issued”.
			
Author :   Israa Ismail

Functional Area : Records 

Sample Call : closeWfTaskCertificateOfOccupancy()

Notes		: Provided Record type "MJ License Application" , is not available ,replaced with a Sample Record Type "Licenses/Marijuana/Retail Store/License"
	          ,to be replaced with the correct record type
/------------------------------------------------------------------------------------------------------*/
closeWfTaskCertificateOfOccupancy();

/*------------------------------------------------------------------------------------------------------/
Title	: Building Certificate of Occupancy does Complete on License WF(WorkflowTaskUpdateAfter).
Purpose	: Send email to Applicant email address using tempalte BACKFLOW PREVENTER NOTIFICATION if wfTask == "Backflow Preventor" && wfStatus == "Final"
Author	: Suhail Wakil
Functional Area : Record WF
Sample Call : script40_backFlowPreventerEmail()
/------------------------------------------------------------------------------------------------------*/
script40_backFlowPreventerEmail();

//Supporting Functions
function script40_backFlowPreventerEmail(){
	if (wfTask == "Backflow Preventor" && wfStatus == "Final") {
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
}

