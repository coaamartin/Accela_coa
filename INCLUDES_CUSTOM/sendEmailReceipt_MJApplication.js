
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
	var stateFee = null;
	var auroraFee = null;
	
	var payResult = aa.finance.getPaymentByCapID(capId, null);
	
		if (!payResult.getSuccess()) {
			logDebug("**ERROR: error retrieving payments " + payResult.getErrorMessage());
			return false;
		}
	
	var payments = payResult.getOutput();
	
	for (var paynum in payments) {
		var payment = payments[paynum];
		var payStatus = payment.getPaymentStatus();

		if (payStatus != "Paid")
			logDebug("Fee is not in 'Paid' status")); // not in paid status

		var feeResult = aa.finance.getFeeItemByCapID(capId);

		if (!feeResult.getSuccess()) {
			logDebug("**ERROR: error retrieving fee items " + feeResult.getErrorMessage());
			return false;
		}
		
		if(feeResult == LIC_MJRC_01 || feeResult == LIC_MJRPM_01 || feeResult == LIC_MJST_05 || feeResult == LIC_MJTST_01 || feeResult == LIC_MJTR_01  || feeResult == LIC_MJ_01) {
			stateFee = true;
		} else {
			auroraFee = true;
		}
	}
		
	if(stateFee != null && stateFee == true) {
		
		//insert state logic here
		var emailTemplateName = "LIC MJ STATE FEE RECEIPT";

		var eParams = aa.util.newHashtable();

		//load ASi and ASIT
		var olduseAppSpecificGroupName = useAppSpecificGroupName;
		useAppSpecificGroupName = false;
		var asiValues = new Array();
		loadAppSpecific(asiValues)
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
	
	if(auroraFee != null && auroraFee == true) {
		//insert non-state logic here
		var emailTemplateName = "LIC MJ FEE RECEIPT";

		var eParams = aa.util.newHashtable();

		//load ASi and ASIT
		var olduseAppSpecificGroupName = useAppSpecificGroupName;
		useAppSpecificGroupName = false;
		var asiValues = new Array();
		loadAppSpecific(asiValues)
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