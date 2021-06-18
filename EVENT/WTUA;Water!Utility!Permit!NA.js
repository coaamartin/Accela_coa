/* Title :  Create child water utility permit records (WorkflowTaskUpdateAfter)

Purpose :   If workflow task = "Fire Life Safety Review" and workflow status = "Approved" and the TSI field "Is there a private fire line" =
"Yes" and the custom field "Number of Fire Lines" > 0 then auto create a child Water Utility Permit record
(Water/Utility/Permit/NA) for each number listed in the TSI field "Number of Fire Lines" as a child of the
Building/Permit/New Building/NA or Building/Permit/Plan/NA. When creating these child records copy address, parcel,
owner and contact information. In addition set the custom field "Utility Permit Type" = "Private Fire Lines" On the Utility
Permit record.

Author :   Israa Ismail

Functional Area : Records
 
Record Types : Building/Permit/New Building/NA or Building/Permit/Plan/NA and
Water/Utility/Permit/NA

Sample Call : createChildWaterUtilityPermitRecords()

*/

//createChildWaterUtilityPermitRecords();


/*
Title : No Fee Required Permit Issuance (WorkflowTaskUpdateAfter) 
Purpose : If workflow task = Fee Processing and the workflow status = No Fees Required then update the workflow task "Permit
Issuance" with a status of "Issued" and update the application status to "Issued" and send an email to the applicant that the
permit has been issued.

Author: Yazan Barghouth 
 
Functional Area : Records

Sample Call:
	checkNoFeeAndUpdateTask(capId, "Fee Processing", [ "No Fees Required" ], "MESSAGE_NOTICE_PUBLIC WORKS", "Permit Issuance", "Issued","Issued");

Supported Email Parameters:
	$$altID$$,$$recordAlias$$,$$recordStatus$$,$$balance$$,$$wfTask$$,$$wfStatus$$,$$wfDate$$,$$wfComment$$,$$wfStaffUserID$$,$$wfHours$$
*/
var wasSuccessful = false;
wasSuccessful = checkNoFeeAndUpdateTask(capId, "Fee Processing", [ "No Fees Required" ], "MESSAGE_NOTICE_PUBLIC WORKS", "Permit Issuance", "Issued","Issued");
//if (wasSuccessful) 
//{
//  activateTask("Permit Issuance");
//}

//SWAKIL - Email
include("5041_EmailWaterUtilityPermit");

if(ifTracer(wfTask == "Final Acceptance Inspection" && wfStatus == "Warranty Work Required", 'wf:Final Acceptance Inspection/Warranty Work Required')){
	//Script 302
	wtrScript302_warrantyReqdNotification();
}

if(ifTracer(wfTask == "Final Acceptance Inspection" && wfStatus == "Complete", 'wf:Final Acceptance Inspection/Complete')){
	//Script 302
	//wtrScript302_warrantyReqdNotification();
}

/* Script 401 - moved from ASIUA to WTUA */
if ( wfTask == "Permit Issuance" && wfStatus == "Issued" ) {
	if ("Public Water Utility Permit".equals(AInfo["Utility Permit Type"]) || "Private Water Utility Permit".equals(AInfo["Utility Permit Type"])) {
		createTempWaterWetTapCopyDataAndSendEmail("WATER CREATE WET TAP TEMP RECORD #401");
	}
}

if(wfTask == "Fee Processing" && wfStatus == "No Fees Required"){
	if ("Public Water Utility Permit".equals(AInfo["Utility Permit Type"]) || "Private Water Utility Permit".equals(AInfo["Utility Permit Type"])) {
		createTempWaterWetTapCopyDataAndSendEmail("WATER CREATE WET TAP TEMP RECORD #401");
	}
}

if(wfTask == "Verify Materials Testing" && wfStatus == "Incomplete"){
	deactivateTask("Verify Materials Testing");
}

//SWAKIL - Email
include("438_UtiltiyInspectionComplete");

//SWAKIL - Email when VMT is Approved
include("494_EmailWaterUtilityPermitVMT");

if(wfTask == "Engineering Review" && wfStatus == "Resubmittal Requested"){
	sendWUPNotification("WAT UTL RESUBMITAL REQUESTED #218");
}


function sendWUPNotification(vemailTemplate){
	var emailTemplateName = arguments[0];
	email
	var eParams = aa.util.newHashtable();
	//today
	var today = new Date();
	var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
	eParams.put("$$todayDate$$", thisDate);
	
	//build address
	var capAddresses = aa.address.getAddressByCapId(capId);
	if (capAddresses.getSuccess()) {
		capAddresses = capAddresses.getOutput();
		if (capAddresses != null && capAddresses.length > 0) {
			capAddresses = capAddresses[0];
			var addressVar = "";
			addressVar = capAddresses.getHouseNumberStart() + " ";
			addressVar = addressVar + capAddresses.getStreetName() + " ";
			addressVar = addressVar + capAddresses.getCity() + " ";
			addressVar = addressVar + capAddresses.getState() + " ";
			addressVar = addressVar + capAddresses.getZip();
			addParameter(eParams, "$$FullAddress$$", addressVar);
		}
	}

	//build ACA URL
	var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
	acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
	var recordURL = getACARecordURL(acaURLDefault);
	addParameter(eParams, "$$acaRecordUrl$$", recordURL);

	//get contact
	var recordApplicant = getContactByType("Applicant", capId);
	var applicantEmail = null;
	if (!recordApplicant || recordApplicant.getEmail() == null || recordApplicant.getEmail() == "") {
		logDebug("**WARN no applicant or applicant has no email, capId=" + capId);
		return false;
	}else 
		{
			applicantEmail = recordApplicant.getEmail();
		}
		
	//wf comments
	if (wfComment) addParameter(eParams, "$$wfComment$$", wfComment);
	
	
	addParameter(eParams, "$$ContactEmail$$", applicantEmail);
	addParameter(eParams, "$$FirstName$$", recordApplicant.getFirstName());
	addParameter(eParams, "$$LastName$$", recordApplicant.getLastName());
	addParameter(eParams, "$$altid$$", capId.getCustomID());
	var cap = aa.cap.getCap(capId).getOutput();
	addParameter(eParams, "$$capAlias$$", cap.getCapType().getAlias());
	
	//send
	//var sent = emailContacts("Applicant", emailTemplateName, eParams, "", "", "N", "");
	
	var reportFile = [];
	var sent = sendNotification("noreply@aurora.gov",applicantEmail,"",emailTemplateName,eParams,reportFile);
	if (!sent) {
		logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
		return false;
	}
	
}
