/*Script 78
 * Record Types: Water/Water/Wet Tap/Application
 * Event: 		WorkflowTaskUpdateAfter (WTUA)
 * 
 * Desc:			
 * When Application Submittal workflow task is set to Accepted send an email to the customer with the invoice.
 * 
*/
function script78_WatWaterTapInvoiceEmail() {
    
	logDebug("script78_WatWaterTapInvoiceEmail() started.");
	try{
		if (ifTracer(wfTask == "Application Submittal" && wfStatus == "Accepted", 'wfTask == Application Submittal && wfStatus == Accepted')) 
		{
            
            var emailTemplate = 'WAT WET TAP INVOICE EMAIL # 78',
                  contactTypes = 'Applicant',
                  emailparams = aa.util.newHashtable(),
                  reportname = "Invoice Report"
                  reportparams = aa.util.newHashtable(),
                  applicant = getContactByType("Applicant", capId);

            //email params
           if(ifTracer(applicant, 'found applicant, will send ContactFullName')) {
                logDebug("applicant.contactName - " + applicant.contactName);
                emailparams.put("$$ContactFullName$$", applicant.contactName);
           } 
           
           //report params
            reportparams.put("AGENCYID", aa.getServiceProviderCode());
            reportparams.put("INVOICEID", getLastInvoice({}));
            emailContacts(contactTypes, emailTemplate, emailparams, reportname, reportparams, "N", "");
     }
}
catch(err){
		showMessage = true;
		comment("Error on custom function “script78_WatWaterTapInvoiceEmail(). Please contact administrator. Err: " + err);
		logDebug("Error on custom function “script78_WatWaterTapInvoiceEmail(). Please contact administrator. Err: " + err);
	}
	logDebug("script78_WatWaterTapInvoiceEmail() ended."); 
}   //END script78_WatWaterTapInvoiceEmail();
