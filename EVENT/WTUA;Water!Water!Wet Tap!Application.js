//logDebug("Script 78 Starting");
//if (ifTracer(wfTask == "Application Submittal" && wfStatus == "Accepted", 'wfTask == Application Submittal && wfStatus == Accepted')) {
//   include("5078_WatWaterTapInvoiceEmail");
//}



if(wfTask == "Application Submittal"){
	
	if(wfStatus == "Resubmittal Requested"){
        sendWETNotification("WAT OTHER RESUBMITAL REQUESTED #407")
	}

    if(wfStatus == "Accepted"){
        include("5078_WatWaterTapInvoiceEmail");
	}

    if(wfStatus == "Withdrawn"){
        sendWETNotification("WAT_WITHDRAWAL")
	}
	
	
}

if(wfTask == "Fee Processing"){
	
	if(wfStatus == "Fees Paid"){
		sendWETNotification("PAYMENT ON WET TAP # 243")
	}	
}


function sendWETNotification(vemailTemplate){
	var emailTemplateName = arguments[0];
	var eParams = aa.util.newHashtable();
	//today
	var today = new Date();
	var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
	
	eParams.put("$$todayDate$$", thisDate);

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
		
	}else {
			applicantEmail = recordApplicant.getEmail();
		}

    		
	addParameter(eParams, "$$wfComment$$", wfComment)
	addParameter(eParams, "$$ContactEmail$$", applicantEmail);
    addParameter(eParams, "$$ApplicantEmail$$", applicantEmail);
	addParameter(eParams, "$$FirstName$$", recordApplicant.getFirstName());
	addParameter(eParams, "$$LastName$$", recordApplicant.getLastName());
	addParameter(eParams, "$$altid$$", capId.getCustomID());
	var cap = aa.cap.getCap(capId).getOutput();
	addParameter(eParams, "$$capAlias$$", cap.getCapType().getAlias());
	addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias())
   
    //ASI info and ASIT
    var utilityPermitNumber = getAppSpecific("Utility Permit Number");
    var civilPlanNumber = getAppSpecific("Civil Plan Number");
    var asitSize = loadASITable("SIZE");
    
    var sizes = new Array();
    for (c in asitSize) {
        var size = asitSize[c]["Size"].fieldValue;
        sizes.push(size)
    }

    addParameter(eParams, "$$size$$", sizes.toString());
    addParameter(eParams, "$$amountPaid$$", PaymentTotalPaidAmount);
    addParameter(eParams, "$$utilityPermitNumber$$", utilityPermitNumber);
    addParameter(eParams, "$$civilPlanNumber$$",civilPlanNumber );

//send
	//var sent = emailContacts("Applicant", emailTemplateName, eParams, "", "", "N", "");
	
	var reportFile = [];
	var sent = sendNotification("noreply@aurora.gov",applicantEmail,"",emailTemplateName,eParams,reportFile);
	if (!sent) {
		logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
		return false;
	}
	
}