/*
This event created by JMAIN 03-15-2018
 */

include("15_waterCheckFeesInvoicedBeforeSendingEmail");
script89_PreventInspStatus();

//put the jmain script back into this event
include("11_WaterUtilityNeedPhaseWorkPlanForPermit");

/*

// refactored version of include("11_WaterUtilityNeedPhaseWorkPlanForPermit");  7/11/18 JHS

if ("Engineering Review".equals(wfTask) && "Approved".equals(wfStatus)) {
	var asi_isprojectphased = "Y".equals(AInfo["Is this project going to be phased?"].substring(0,1).toUpperCase());
	var docType = "Phase Work Plan";
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
		comment("Phased projects require Phase Work Plan to be attached in Documents");
	}
}

*/