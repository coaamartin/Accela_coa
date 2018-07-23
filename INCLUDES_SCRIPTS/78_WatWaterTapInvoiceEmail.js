script78_WatWaterTapInvoiceEmail();

function script78_WatWaterTapInvoiceEmail() {        
    var emailTemplate = 'WAT WET TAP INVOICE EMAIL # 78',
            contactTypes = 'Applicant',
            emailparams = aa.util.newHashtable(),
            reportname = "Invoice Report"
            reportparams = aa.util.newHashtable(),
            applicant = getContactByType("Applicant", capId),
            lastInvoice = getLastInvoice({});

    //email params
    if(ifTracer(applicant, 'found applicant, will send ContactFullName')) {
        logDebug("applicant.contactName - " + applicant.contactName);
        emailparams.put("$$ContactFullName$$", applicant.contactName);
    } 

    if(lastInvoice != null && lastInvoice.invNbr != null) {
        reportparams.put("AGENCYID", aa.getServiceProviderCode());
        reportparams.put("INVOICEID", lastInvoice.invNbr);
        emailContacts(contactTypes, emailTemplate, emailparams, reportname, reportparams, "N", "");    
    } 
}