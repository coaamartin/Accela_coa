/*Script 399
 * Record Types:	Water/Water/SWMP/Application
 * Event: 		WorkflowTaskUpdateAfter (WTUA)
 * 
 * Desc:			
 * When workflow task application submittal = accepted and custom field 
 * Paying by bond= yes then email applicant that they must bring in physical 
 * bond with instructions to bring to the permit center and status workflow 
 * task fee processing as awaiting bond.

 * 
*/

function script399_BondEmailAndAwaitingBondTaskStatus() {
	logDebug("script399_BondEmailAndAwaitingBondTaskStatus() started.");
	try{
		if (ifTracer(wfTask == "Application Submittal" && wfStatus == "Accepted", 'wfTask == Application Submittal && wfStatus == Accepted')) 
		{
            var emailTemplate = 'WAT_SWMP_APP_BOND_EMAIL',
                contactTypes = 'Applicant',
                emailparams = aa.util.newHashtable();

            if(ifTracer(getAppSpecific("Paying with Bond") =='Yes','Paying with Bond == Yes')) {
                emailContacts(contactTypes, emailTemplate, emailparams, "", "", "N", "");
                updateTask('Fee Processing',"Awaiting Bond", "Updated via EMSE (#399)","");
            }
 		}
	}
	catch(err){
		showMessage = true;
		comment("Error on custom function “script399_BondEmailAndAwaitingBondTaskStatus(). Please contact administrator. Err: " + err);
		logDebug("Error on custom function “script399_BondEmailAndAwaitingBondTaskStatus(). Please contact administrator. Err: " + err);
	}
	logDebug("script399_BondEmailAndAwaitingBondTaskStatus() ended.");
};//END script399_BondEmailAndAwaitingBondTaskStatus();
