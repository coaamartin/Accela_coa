/*Script 398
 * Record Types:	Water/Water/SWMP/Permit
 * Event: 		WorkflowTaskUpdateAfter (WTUA)
 * 
 * Desc:			
 * When WF Task = Final Certification is statused as Complete send 
 * email to Applicant to schedule the Final Inspection when ready 
 * for an inspection. Include Deeplink to the record in the email

 * 
*/

function script398_ScheduleFinalInspection() {
	logDebug("script398_ScheduleFinalInspection() started.");
	try{
		if (ifTracer(wfTask == "Final Certification" && wfStatus == "Complete", 'wfTask == Final Certification && wfStatus == Complete')) 
		{
            var emailTemplate = 'WAT_SWMP_PERMIT_SCHED_FINAL_INSP',
                contactTypes = 'Applicant',
                emailparams = aa.util.newHashtable();

            emailContacts(contactTypes, emailTemplate, emailparams, "", "", "N", "");
 		}
	}
	catch(err){
		showMessage = true;
		comment("Error on custom function “script398_ScheduleFinalInspection(). Please contact administrator. Err: " + err);
		logDebug("Error on custom function “script398_ScheduleFinalInspection(). Please contact administrator. Err: " + err);
	}
	logDebug("script398_ScheduleFinalInspection() ended.");
};//END script398_ScheduleFinalInspection();
