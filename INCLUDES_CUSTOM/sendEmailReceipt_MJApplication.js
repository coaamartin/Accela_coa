
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
	var vStateFee = null;
	var vLocalFee = null;
	
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
			//if (feeBalanceByPayment(vFeeCodetoCheck,vPaymentSeqNbr) == 0) {
			//    aa.print("Fee item " + vFeeCodetoCheck + " was paid with this payment is has a balance of 0");
			//}
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

	
	
	
	
	
	
	
	
	
	
	
	/*
	var payResult = aa.finance.getPaymentByCapID(capId, null);
								
	if (!payResult.getSuccess()) {
		logDebug("**ERROR: error retrieving payments " + payResult.getErrorMessage());
		return false;
	}
								
	var payments = payResult.getOutput();
	var paynum = payments.length - 1;
	
	for (var i = 0; i < payments.length; i++) {			
		logDebug("Number of payments: " + payments.length);
		if (i == paynum) {
		
			logDebug("Debug point 1");		
			var feeResult = aa.finance.getFeeItemByCapID(capId);
			if (!feeResult.getSuccess()) {
				logDebug("**ERROR: error retrieving fee items " + feeResult.getErrorMessage());
				return false;
			}
			var feeArray = feeResult.getOutput();
			
			for (var j = 0; j < feeArray.length; j++) {
				logDebug("Debug point 2");
				var feeItem = feeArray[j];
				var pfResult = aa.finance.getPaymentFeeItems(capId, null);
				if (!pfResult.getSuccess()) {
					logDebug("**ERROR: error retrieving fee payment items " + pfResult.getErrorMessage());
					return false;
				}
				
				if (feeItem.toString() == "LIC_MJRC_01" || feeItem.toString() == "LIC_MJRPM_01" || feeItem.toString() == "LIC_MJST_05" || feeItem.toString() == "LIC_MJTST_01" || feeItem.toString() == "LIC_MJTR_01"  || feeItem.toString() == "LIC_MJ_01") {
					stateFee = true;
					logDebug("State fee is present");
				} else {
					logDebug("Fee item: " + feeItem);
					auroraFee = true;
					logDebug("Local fee is present");
				}
			}
		}
	}
	*/
	
	logDebug("vStateFee equals " + vStateFee);
	logDebug("vLocalFee equals " + vLocalFee);
	
	
	
	if(vStateFee != null && vStateFee == true) {
		
		//insert state logic here
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

		var files = new Array();
		var sent = sendNotification("noreply@aurora.gov",toEmail,"",emailTemplateName,eParams,files);
		//var sent = aa.document.sendEmailByTemplateName("", toEmail, "", emailTemplateName, eParams, files);
		if (!sent) {
			logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
			return false;
		}
	}
	
	if(vLocalFee != null && vLocalFee == true) {
		//insert non-state logic here
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

		var files = new Array();
		var sent = sendNotification("noreply@aurora.gov",toEmail,"",emailTemplateName,eParams,files);
		//var sent = aa.document.sendEmailByTemplateName("", toEmail, "", emailTemplateName, eParams, files);
		if (!sent) {
			logDebug("**WARN sending email failed, error:" + sent.getErrorMessage());
			return false;
		}
	}
}