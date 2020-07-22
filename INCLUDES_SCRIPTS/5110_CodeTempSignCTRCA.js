// SCRIPTNUMBER: 5110
// SCRIPTFILENAME: 5110_CodeTempSignCTRCA.js
// PURPOSE: Called when a Temporary Sign Permit record submitted from ACA.  Sends email.
// DATECREATED: 05/23/2019
// BY: amartin
// CHANGELOG: 

logDebug("---------------------> At start of 5110 CTRCA");

var adResult = aa.address.getPrimaryAddressByCapID(capId,"Y");
addressLine = adResult.getOutput().getAddressModel();
logDebug("---------------------> addressLine " + addressLine);	

editAppName(addressLine,capId);

logDebug("---------------------> Preparing to send email. ");	

//I cannot get the async to work so using non-async by forcing env variable.
aa.env.setValue("eventType","Batch Process");
//Send email
if("CityClerk/Incident/DonationBin/NA".equals(appTypeString)){
var emailTemplate = "TEMP SIGN SUBMIT APPLICANT";		
var todayDate = new Date();
var signType = AInfo["Type of Sign"];
var signAddress = AInfo["Address where proposed sign will be displayed"];
if (emailTemplate != null && emailTemplate != "") {
	logDebug("5110 sending DONATION BIN  APPLICANT.  Defaulting to contact Applicant.");	
	eParams = aa.util.newHashtable();
	eParams.put("$$ContactEmail$$", "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org");			
	eParams.put("$$todayDate$$", todayDate);
	eParams.put("$$altid$$",capId.getCustomID());
	eParams.put("$$capAlias$$",cap.getCapType().getAlias());
	eParams.put("$$signType$$",signType);	
	eParams.put("$$signAddress$$",signAddress);			
	logDebug('Attempting to send email: ' + emailTemplate + " : " + capId.getCustomID());
	emailContacts("Applicant", emailTemplate, eParams, null, null, "Y");
}
}

else if ("CityClerk/Incident/TempUse/NA".equals(appTypeString)) {
//Use these groups when in production to populate ContactEmail.  Use a comma separator: tup_zoning@auroragov.org,tup_citymanager@auroragov.org,tup_publicworks@auroragov.org,tup_risk@auroragov.org,tup_neighborhood@auroragov.org
var emailTemplate = "TEMP SIGN SUBMIT REVIEWERS";		
if (emailTemplate != null && emailTemplate != "") {
	logDebug("5110 sending TEMP USE SUBMIT REVIEWERS.  Sending to several email groups.");	
	eParams = aa.util.newHashtable();
	eParams.put("$$ContactEmail$$", "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org");			
	eParams.put("$$todayDate$$", todayDate);
	eParams.put("$$altid$$",capId.getCustomID());
	eParams.put("$$capAlias$$",cap.getCapType().getAlias());
	eParams.put("$$signType$$",signType);	
	eParams.put("$$signAddress$$",signAddress);			
	logDebug('Attempting to send email: ' + emailTemplate + " : " + capId.getCustomID());
	emailContacts("Applicant", emailTemplate, eParams, null, null, "Y");
}
}

else if ("CityClerk/Incident/TempSign/NA".equals(appTypeString)) {
	//Use these groups when in production to populate ContactEmail.  Use a comma separator: tup_zoning@auroragov.org,tup_citymanager@auroragov.org,tup_publicworks@auroragov.org,tup_risk@auroragov.org,tup_neighborhood@auroragov.org
var emailTemplate = "TEMP SIGN SUBMIT REVIEWERS";		
if (emailTemplate != null && emailTemplate != "") {
	logDebug("5110 sending TEMP SIGN SUBMIT REVIEWERS.  Sending to several email groups.");	
	eParams = aa.util.newHashtable();
	eParams.put("$$ContactEmail$$", "rprovinc@auroragov.org;bwatkins@auroragov.org;cmariano@auroragov.org");			
	eParams.put("$$todayDate$$", todayDate);
	eParams.put("$$altid$$",capId.getCustomID());
	eParams.put("$$capAlias$$",cap.getCapType().getAlias());
	eParams.put("$$signType$$",signType);	
	eParams.put("$$signAddress$$",signAddress);			
	logDebug('Attempting to send email: ' + emailTemplate + " : " + capId.getCustomID());
	emailContacts("Applicant", emailTemplate, eParams, null, null, "Y");
}
}
logDebug("---------------------> At end of 5110 CTRCA");
aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);