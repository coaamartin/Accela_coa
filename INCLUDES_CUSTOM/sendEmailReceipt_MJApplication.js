function sendEmailReceipt_MJApplication(){
    var toEmail = "marijuana@auroragov.org";
    var appEmail = getContactEmailNoDupEmail(capId,"Applicant");
    appEmail = appEmail.join(";");
    var resPartyEmail = getContactEmailNoDupEmail(capId,"Responsible Party");
    resPartyEmail = resPartyEmail.join(";");

    if(appEmail) toEmail += ";"+appEmail;
    if(resPartyEmail) toEmail += ";"+resPartyEmail;

    logDebug(toEmail);

    //var toEmail = applicant.getEmail();
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
	//loop through fee items
	var pfResult = aa.finance.getPaymentFeeItems(capId, null);
	if (pfResult.getSuccess()) {
        var pfObj = pfResult.getOutput();
		//match fee items to sequence number
		for (ij in pfObj) {
			if (pfObj[ij].getPaymentSeqNbr() != vPaymentSeqNbr)
				continue;
            logDebug("Debug Point 3");
            var thisFeeSeq = pfObj[ij].getFeeSeqNbr();
            var thisFeeItem = aa.fee.getFeeItemByPK(capId, thisFeeSeq).getOutput();
            var thisFeeCode = thisFeeItem.getFeeCod();
            //check for state and local fees
            if (thisFeeCode == "LIC_MJRC_01" || thisFeeCode == "LIC_MJRPM_01" || thisFeeCode == "LIC_MJST_05" || 
                thisFeeCode == "LIC_MJTST_01" || thisFeeCode == "LIC_MJTR_01" || thisFeeCode == "LIC_MJ_01") {
                logDebug("State fee is present");
                vStateFee = true;
            } 
            if (thisFeeCode == "LIC_MJTR_02" || thisFeeCode == "LIC_MJTST_02" || thisFeeCode == "LIC_MJST_01" || 
                thisFeeCode == "LIC_MJRPM_02" || thisFeeCode == "LIC_MJRC_02") {
                logDebug("Local fee is present");
                vLocalFee = true;
            }
					
				
		}
    }
	
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
		addParameter(eParams, "$$TradeName$$", appName);
		//addParameter(eParams, "$$TradeName$$", asiValues["Trade Name"]);
		addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
		addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
		addParameter(eParams, "$$FullAddress$$", primaryAddress);
		addParameter(eParams, "$$ApplicationName$$", appName);

		//send email
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
		addParameter(eParams, "$$TradeName$$", appName);
		//addParameter(eParams, "$$TradeName$$", asiValues["Trade Name"]);
		addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
		addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
		addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
		addParameter(eParams, "$$FullAddress$$", primaryAddress);
		addParameter(eParams, "$$ApplicationName$$", appName);

		//send email
		emailWithReportLinkASync(toEmail, emailTemplateName, eParams, "", "", "N", "");
	}
}
