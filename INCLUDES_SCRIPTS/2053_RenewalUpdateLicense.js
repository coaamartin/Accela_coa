	saveId = capId;
	parentLicenseCAPID = getParentCapIDForReview(capId);
	comment('ParentLic CAPID = ' + parentLicenseCAPID);
	capId = parentLicenseCAPID;
	if (parentLicenseCAPID) {
		pCapIdSplit = String(parentLicenseCAPID).split('-');
		pCapIdObj = aa.cap.getCapID(pCapIdSplit[0], pCapIdSplit[1], pCapIdSplit[2]).getOutput();
		pCapIdCustomId = pCapIdObj.getCustomID();
	}
	if (parentLicenseCAPID) {
		comment(' Parent Custom ID = ' + pCapIdCustomId);
	}

	updateAppStatus('Active', 'Renewal Approved By: ' + capIDString, parentLicenseCAPID);


        // Figure out new EXPIRATION Date

		
	lic = new licenseObject(capIDString, parentLicenseCAPID);comment("Get License Object");
	lic.setStatus('Active'); comment("Set Lic Exp Status to Active");

        b1ExpResult = aa.expiration.getLicensesByCapID(parentLicenseCAPID);
        this.b1Exp = b1ExpResult.getOutput();
        tmpDate = this.b1Exp.getExpDate();
        if (tmpDate){
             this.b1ExpDate = tmpDate.getMonth() + "/" + tmpDate.getDayOfMonth() + "/" + tmpDate.getYear();
             comment("This Lic Expires on " + this.b1ExpDate);

	     //default to 12 months from today
             numberOfMonths = 12; // 0 months because the EXP Code bumps it up 12 months

             newExpDate = this.b1ExpDate;
	     comment("newExpDate = "+newExpDate);

             lic.setExpiration(newExpDate);

             }

		logDebug("Starting SEND_ISSUEDLICENSE_EMAIL script");
		appType = cap.getCapType().toString();
		var vAsyncScript = "SEND_EMAIL_TAXLIC_LICENSE_ASYNC";
		var envParameters = aa.util.newHashMap();
		envParameters.put("altID", pCapIdCustomId);
		logDebug("ALTID is " +pCapIdCustomId);
		envParameters.put("currentUserID",currentUserID);
		logDebug("Starting to kick off ASYNC event for Invoice. Params being passed: " + envParameters);
		aa.runAsyncScript(vAsyncScript, envParameters);

	capId = saveId;
    logDebug('Running WTUA4Renewal');
	include("2055_WORKFLOWTASKUPDATEAFTER4RENEWTPS");
	logDebug('Messages in WTUA4Renewal:<br>' + aa.env.getValue('ScriptReturnMessage'));