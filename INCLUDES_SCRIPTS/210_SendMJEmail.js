// SCRIPTNUMBER: 210
// SCRIPTFILENAME: 210_SendMJEmail.js
// PURPOSE: Additional Info Required Email for Licenses MJ Applications
// DATECREATED: 03/14/2019
// BY: JMPorter

	var emailTemplate= "LIC MJ ADDITIONAL INFO # 210";
	var applicant = getContactByType("Applicant", capId);
	var applicant2 = getContactByType("Responsible Party",capId);
	logDebug("Responsible Party: " + applicant2);
	//var acaUrl = lookup("ACA_CONFIGS","OFFICIAL_WEBSITE_URL");
    var acaURLDefault = lookup("ACA_CONFIGS", "ACA_SITE");
    acaURLDefault = acaURLDefault.substr(0, acaURLDefault.toUpperCase().indexOf("/ADMIN"));
    var recordDeepUrl = getACARecordURL(acaURLDefault);

   	var asiValues = new Array();
	loadAppSpecific(asiValues);
      
// 	if (!applicant || !applicant.getEmail()) 
//    {
//      logDebug("**WARN SCRIPT#210 - no applicant found or no email capId =" + capId);
//    }
   
//    else
      
//    {
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
   
	//send email to applicant, no report included
	emailContactsWithReportLinkASync("Applicant,Responsible Party", emailTemplate, eParams, "", "", "N", "");
   //}