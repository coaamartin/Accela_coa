/*
This event created by JMAIN 03-15-2018
 */

include("15_waterCheckFeesInvoicedBeforeSendingEmail");
script89_PreventInspStatus();

// begin script 304
/*
If workflow task = Final Acceptance Inspection and
Status = Warranty Work Required and Document
Type of Warranty Work Punch List does not exist
block progression of the workflow and
raise the error message “Warranty
Work Punch List is required for
Warranty Work Required status
 */

if ("Final Acceptance Inspection".equals(wfTask) && "Warranty Work Required".equals(wfStatus)) {
	var docType = "Warrant Work Punch List";
	var docList = getDocumentList();
	var filteredDocs;

	if (docList) {
		var filteredDocs = docList.filter(function (o) {
				return docType.equalsIgnoreCase(o.getDocCategory().toString());
			});
	}

	if (!filteredDocs || filteredDocs.length == 0) {
		cancel = true;
		showMessage = true;
		comment("Warranty Work Punch List is required for Warranty Work Required statusxx");
	}
}

// end script 304
