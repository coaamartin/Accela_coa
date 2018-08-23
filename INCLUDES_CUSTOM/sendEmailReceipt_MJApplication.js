
/**
 * 
 * 
 */
function sendEmailReceipt_MJApplication(){

	var applicant = getContactByType("Applicant", capId);
	if (!applicant || !applicant.getEmail()) {
		logDebug("**WARN no applicant found on or no email capId=" + capId);
		return false;
	}
	var toEmail = applicant.getEmail();
	var vStateFee;
	var vLocalFee;
	
	var vPayment;
	var vPayments;
	var vPaymentSeqNbr = 0;
	
	// Get all payments on the record
	vPayments = aa.finance.getPaymentByCapID(capId, null);
	
	if (vPayments.getSuccess() == true) {
		vPayments = vPayments.getOutput();
		var y = 0;
		// Loop through payments to get the latest by highest SEQ number
		for (y in vPayments) {
			vPayment = vPayments[y];
			if (vPayment.getPaymentSeqNbr() > vPaymentSeqNbr) {
				vPaymentSeqNbr = vPayment.getPaymentSeqNbr();
			}
		}
		if (vPaymentSeqNbr != null && vPaymentSeqNbr != "") {
			logDebug("The latest payment has a sequence number of " + vPaymentSeqNbr);
		}
	}
	
	var feeResult = aa.fee.getFeeItems(capId);
	
	if (feeResult.getSuccess()) {
		var feeObjArr = feeResult.getOutput();
	} else {
		logDebug("**ERROR: getting fee items: " + capContResult.getErrorMessage());
		return false		
	}

	var ff = 0;
	
	for (ff in feeObjArr) {
		logDebug("Debug Point 1");
        var pfResult = aa.finance.getPaymentFeeItems(capId, null);
        if (pfResult.getSuccess()) {
			var pfObj = pfResult.getOutput();
			
			for (ij in pfObj) {
				logDebug("Debug Point 2");
				if (feeObjArr[ff].getFeeSeqNbr() == pfObj[ij].getFeeSeqNbr() && pfObj[ij].getPaymentSeqNbr() == vPaymentSeqNbr) {
					logDebug("Debug Point 3");
					if (feeObjArr[ff].getFeeCod() == "LIC_MJRC_01" || feeObjArr[ff].getFeeCod() == "LIC_MJRPM_01" || feeObjArr[ff].getFeeCod() == "LIC_MJST_05" || feeObjArr[ff].getFeeCod() == "LIC_MJTST_01" || feeObjArr[ff].getFeeCod() == "LIC_MJTR_01" || feeObjArr[ff].getFeeCod() == "LIC_MJ_01") {
						logDebug("State fee is present");
						vStateFee = true;
					} else {
						logDebug("Local fee is present");
						vLocalFee = true;
					}
				}
			}
		}
	}
	
	logDebug("vStateFee equals " + vStateFee);
	logDebug("vLocalFee equals " + vLocalFee);
	logDebug("Applicant email: " + toEmail);
	
	if(vStateFee != null && vStateFee != "" && vStateFee == true) {
		var emailTemplateName = "LIC MJ STATE FEE RECEIPT";

		var eParams = aa.util.newHashtable();

		//load ASi and ASIT
		var olduseAppSpecificGroupName = useAppSpecificGroupName;
		useAppSpecificGroupName = false;
		var asiValues = new Array();
		loadAppSpecific(asiValues);
		useAppSpecificGroupName = olduseAppSpecificGroupName;
		//logDebug("State License Number: " + asiValues["State License Number"]);
			
		adResult = aa.address.getAddressByCapId(capId).getOutput(); 
		for(x in adResult) {
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
		
		addParameter(eParams, "$$date$$", sysDateMMDDYYYY);
		addParameter(eParams, "$$amountPaid$$", PaymentTotalPaidAmount);
		addParameter(eParams, "$$StateLicenseNumber$$", asiValues["State License Number"]);
		addParameter(eParams, "$$TradeName$$", asiValues["Trade Name"]);
		addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
		addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
		addParameter(eParams, "$$FullAddress$$", primaryAddress);
		addParameter(eParams, "$$ApplicationName$$", appName);

		logDebug("CapID = " + capId);
		emailWithReportLinkASync(toEmail, emailTemplateName, eParams, "", "", "N", "");
	}
	
	if(vLocalFee != null && vLocalFee != "" && vLocalFee == true) {
		var emailTemplateName = "LIC MJ FEE RECEIPT";
		var eParams = aa.util.newHashtable();

		//load ASi and ASIT
		var olduseAppSpecificGroupName = useAppSpecificGroupName;
		useAppSpecificGroupName = false;
		var asiValues = new Array();
		loadAppSpecific(asiValues);
		useAppSpecificGroupName = olduseAppSpecificGroupName;
		//logDebug("State License Number: " + asiValues["State License Number"]);
			
		adResult = aa.address.getAddressByCapId(capId).getOutput(); 
		for(x in adResult) {
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
		
		addParameter(eParams, "$$date$$", sysDateMMDDYYYY);
		addParameter(eParams, "$$amountPaid$$", PaymentTotalPaidAmount);
		addParameter(eParams, "$$StateLicenseNumber$$", asiValues["State License Number"]);
		addParameter(eParams, "$$TradeName$$", asiValues["Trade Name"]);
		addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
		addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
		addParameter(eParams, "$$FullAddress$$", primaryAddress);
		addParameter(eParams, "$$ApplicationName$$", appName);

		logDebug("CapID = " + capId);
		emailWithReportLinkASync(toEmail, emailTemplateName, eParams, "", "", "N", "");
	}
}