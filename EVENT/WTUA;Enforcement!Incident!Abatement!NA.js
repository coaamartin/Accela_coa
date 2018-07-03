//script 432
logDebug("Script 423 Starting");
if (ifTracer(wfTask == "Invoicing" && wfStatus == "Invoiced", "wfTask == Invoicing && wfStatus == Invoiced")) {
    include("423_AccessInvoiceSnowAndAbatementFees");
}


//Script 229
//Name: 		Issued Retail Product Manufacturer License
//Record Types:	Enforcement/Incident/Abatement/NA
//Event: 		EMSE
//Desc:			Criteria; wfTask = License Issuance and status = Issued Action; Generate email to Responsible Party and cc: Applicant (Contacts) Subject: 
//				“Congratulations your Retail Product Manufacturer License $$Record_ID$$ has been issued” and attached license as a pdf. 
//				(Dusty to provide email template and report name for attachment). ). Include a deep link of the record within the email body. 
//				Create child Licenses/Marijuana/ Retail Product Manufacturer/License Record and copy APO, Contacts, Values in Custom Fields. 
//				auto schedule Quarterly Inspections Assign all to user Steve Clark on the child license 
//				record; MJ AMED Inspection, MJ Building Inspection - Electrical, MJ Building Inspection - Life Safety, MJ Building Inspection - Mechanical, 
//				MJ Building Inspection – Plumbing, MJ Building Inspection – Structural, MJ Security Inspection - 3rd Party , MJ Zoning Inspection , 
//				schedule date 3 months minus a week.
//
//Created By: Silver Lining Solutions

logDebug ("script229 START");


if (wfTask == "License Issuance" && wfStatus== "Issued Action")
{ 	// Get the Applicant's email
	var recordApplicant = getContactByType("Applicant", capId);
	var applicantEmail = null;
	if (!recordApplicant || recordApplicant.getEmail() == null || recordApplicant.getEmail() == "") {
		logDebug("**WARN no applicant or applicant has no email, capId=" + capId);
	} else {
		applicantEmail = recordApplicant.getEmail();


}

logDebug ("script229 END")