// SCRIPTNUMBER: 210
// SCRIPTFILENAME: 210_SendMJEmail.js
// PURPOSE: Additional Info Required Email for Licenses MJ Applications
// DATECREATED: 03/14/2019
// BY: jmp

	var emailTemplate= "LIC MJ ADDITIONAL INFO # 210";
	var applicant = getContactByType("Applicant", capId);
	var acaUrl = lookup("ACA_CONFIGS","OFFICIAL_WEBSITE_URL");
	if (!applicant || !applicant.getEmail()) {
		logDebug("**WARN no applicant found or no email capId=" + capId);
		return false;
	}
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
	addParameter(eParams, "$$wfTask$$", wfTask);
	addParameter(eParams, "$$wfStatus$$", wfStatus);
	addParameter(eParams, "$$wfDate$$", wfDate);
	addParameter(eParams, "$$wfComment$$", wfComment);
	addParameter(eParams, "$$acaRecordUrl$$", acaUrl);
	addParameter(eParams, "$$FullAddress$$", primaryAddress);
	addParameter(eParams, "$$ApplicationName$$", appName);

	//send email to applicant, no report included
	emailContactsWithReportLinkASync("Applicant,Responsible Party", emailTemplate, eParams, "", "", "N", "");
