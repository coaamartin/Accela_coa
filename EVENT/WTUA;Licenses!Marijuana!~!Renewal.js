var totalPaid = totalPaidAmount();
if (totalPaid >= 2500 && wfTask == "Renewal Review" && wfStatus == "Complete") {
	
	closeTask("License Issuance", "Renewed - Pending Notification", "Updated by WTUA;Licenses!Professional!General!Renewal", "");
	updateAppStatus("Renewed - Pending Notification","Updated by Script",capId);
	// Begin script to complete the renewal and send notifications
	var vLicenseID;
	var vIDArray;
	var renewalCapProject;
	var vExpDate;
	var vNewExpDate;
	var vLicenseObj;

	// Get the parent license
	vLicenseID = getParentLicenseCapID(capId);
	vIDArray = String(vLicenseID).split("-");
	vLicenseID = aa.cap.getCapID(vIDArray[0], vIDArray[1], vIDArray[2]).getOutput();

	if (vLicenseID != null) {
		var licExpObj = aa.expiration.getLicensesByCapID(vLicenseID).getOutput().getExpDate();
        var licExpDate = dateFormatted(licExpObj.getMonth(),licExpObj.getDayOfMonth(),licExpObj.getYear(),"");
		//Activate the license records expiration cycle
		vLicenseObj = new licenseObject(null, vLicenseID);
		vLicenseObj.setStatus("Active");
		thisLicExpOb = vLicenseObj.b1Exp
		expUnit = thisLicExpOb.getExpUnit()
		expInt = thisLicExpOb.getExpInterval()
		if (expUnit == "MONTHS") {
			newExpDate = dateAddMonths(licExpDate, expInt);
			} 
		vLicenseObj.setExpiration(newExpDate);
		updateAppStatus("Active","Updated by Script",vLicenseID);
		
		//Set renewal to complete, used to prevent more than one renewal record for the same cycle
		renewalCapProject = getRenewalCapByParentCapIDForIncomplete(vLicenseID);
		if (renewalCapProject != null) {
			renewalCapProject.setStatus("Complete");
			aa.cap.updateProject(renewalCapProject);
		}
        emailOnRenewApproval(licExpDate);
		/*
		//This logic is in BATCH JOB
        var vAsyncScript = "SEND_MJ_LICENSE_ASYNC";
        var envParameters = aa.util.newHashMap();
        envParameters.put("CapId", vLicenseID.getCustomID());
        aa.runAsyncScript(vAsyncScript, envParameters);
		*/
	}
}

function totalPaidAmount(){
    var vPayment;
    var vPayments;
    var vPaymentAmt = 0;

// Get all payments on the record
    vPayments = aa.finance.getPaymentByCapID(capId, null);
    if (vPayments.getSuccess() == true) {
        vPayments = vPayments.getOutput();
        var y = 0;
        // Loop through payments to get the latest by highest SEQ number
        for (y in vPayments) {
            vPayment = vPayments[y];
            vPaymentAmt += vPayment.getPaymentAmount();
        }
    }
    return vPaymentAmt;
}

//SW Script 436
include("436_cancelScheduledInpsectionsRenew");
//SW Script 432
include("432_deactivateMJTasks");

include("432_closeLicenseMJ");

if (wfTask=="Renewal Review" && wfStatus=="Additional Info Required")
{
    include("210_SendMJEmail");
}

function emailOnRenewApproval(licExpDate){
    var emailTemplate= "LIC_MJ_RENEWALAPPROVAL";
    var applicant = getContactByType("Applicant", capId);
    //var acaUrl = lookup("ACA_CONFIGS","OFFICIAL_WEBSITE_URL");
    var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
    acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
    var recordDeepUrl = getACARecordURL(acaURLDefault);

    var asiValues = new Array();
    loadAppSpecific(asiValues);

    if (!applicant || !applicant.getEmail())
    {
        logDebug("**WARN  - no applicant found or no email capId =" + capId);
    }
    else
    {
        var files = new Array();
        // use the correct parameters related to the email template provided + wfComment
        var adResult = aa.address.getAddressByCapId(capId).getOutput();
        for(x in adResult)
        {
            var adType = adResult[x].getAddressType();
            var stNum = adResult[x].getHouseNumberStart();
            var preDir =adResult[x].getStreetDirection();
            var stName = adResult[x].getStreetName();
            var stType = adResult[x].getStreetSuffix();
            var city = adResult[x].getCity();
            var state = adResult[x].getState();
            var zip = adResult[x].getZip();
        }

        var primaryAddress = stNum + " " + preDir + " " + stName + " " + stType + " " + "," + city + " " + state + " " + zip;
        var appName = cap.getSpecialText();

        var eParams = aa.util.newHashtable();

        addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
        addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
        addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
        addParameter(eParams, "$$wfTask$$", wfTask.toUpperCase());
        addParameter(eParams, "$$wfStatus$$", wfStatus);
        addParameter(eParams, "$$wfDate$$", wfDate);
        addParameter(eParams, "$$wfComment$$", wfComment);
        addParameter(eParams, "$$acaRecordUrl$$", recordDeepUrl);
        addParameter(eParams, "$$FullAddress$$", primaryAddress);
        addParameter(eParams, "$$ApplicationName$$", appName);
        addParameter(eParams, "$$TradeName$$", appName);
        //addParameter(eParams, "$$TradeName$$", asiValues["Trade Name"]);
        addParameter(eParams, "$$StateLicenseNumber$$", asiValues["State License Number"]);
        addParameter(eParams, "$$licExpDate$$", licExpDate+"");

        //send email to applicant, no report included
        emailContactsWithReportLinkASync("Applicant,Responsible Party", emailTemplate, eParams, "", "", "N", "");
        emailWithReportLinkASync("marijuana@auroragov.org", emailTemplate, eParams, "", "", "N", "");
    }
}