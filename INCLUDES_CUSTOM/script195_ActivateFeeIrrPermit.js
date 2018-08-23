//script195_ActivateFeeIrrPermit
//Record Types:	Water/Water/Lawn Irrigation/Permit
//Event: WTUA - WorkflowTaskUpdateAfter
//Desc: When the wfStatus = “Application Fee Submitted” then send email to the applicant that the fees are invoiced and ready to be paid.
//Created By: Silver Lining Solutions

function script195_ActivateFeeIrrPermit() {
	
	logDebug("script195_ActivateFeeIrrPermit started.");
	try{
		if (wfTask==("Application Submittal") && wfStatus ==("Application Fee Submitted")) {
			var emailTemplate="IP LAWN IRRIGATION ACCEPTED # 195"
			var acaUrl = lookup("ACA_CONFIGS","OFFICIAL_WEBSITE_URL");
			var appName = cap.getSpecialText();
			
			//get full address
			adResult = aa.address.getAddressByCapId(capId).getOutput(); 
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
			var eParams = aa.util.newHashtable();
			addParameter(eParams, "$$altID$$", cap.getCapModel().getAltID());
			addParameter(eParams, "$$recordAlias$$", cap.getCapType().getAlias());
			addParameter(eParams, "$$recordStatus$$", cap.getCapStatus());
			addParameter(eParams, "$$wfTask$$", wfTask);
			addParameter(eParams, "$$wfStatus$$", wfStatus);
			addParameter(eParams, "$$wfDate$$", wfDate);
			addParameter(eParams, "$$wfComment$$", wfComment);
			addParameter(eParams, "$$acaRecordUrl$$", acaUrl);
			addParameter(eParams, "$$FullAddress$$", primaryAddress);
			addParameter(eParams, "$$ApplicationName$$", appName);
			
			//send email to applicant
			emailContactsWithReportLinkASync("Applicant", emailTemplate, eParams, "", "", "N", "");
			
		}
	} catch(err){
		showMessage = true;
		comment("Error on custom function script195_ActivateFeeIrrPermit. Please contact administrator. Err: " + err);
		logDebug("Error on custom function script195_ActivateFeeIrrPermit. Please contact administrator. Err: " + err);
		logDebug("A JavaScript Error occurred: script195_ActivateFeeIrrPermit: " + err.message);
		logDebug(err.stack)
	}
	logDebug("script195_ActivateFeeIrrPermit ended.");
//	if function is used        };//END WTUA:Water/Water/Lawn Irrigation/Permit;

}