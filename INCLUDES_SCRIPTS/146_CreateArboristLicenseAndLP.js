logDebug("Creating Parent License");
var contactType = "Arborist Company";
var licenseType = "Arborist";
var addressType = "Business";
var appName = cap.getSpecialText();
var createdApp = aa.cap.createApp("Licenses", "Contractor", "Arborist", "License", appName);
if (!createdApp.getSuccess()) {
	logDebug("**ERROR creating app failed, error: " + createdApp.getErrorMessage());
}
createdApp = createdApp.getOutput();
logDebug("Creating Parent License : " + createdApp.getCustomID());
//add as parent:
var related = aa.cap.createAppHierarchy(createdApp, capId);
if (!related.getSuccess()) {
	logDebug("**ERROR createAppHierarchy failed, error: " + related.getErrorMessage());
}

//copy data:
copyContacts(capId, createdApp);
copyAppSpecific(createdApp);

var licenseNbr = null;
var contact = getContactByType(contactType, capId);

//contact required exist on child (current) record
if (contact) {
	logDebug("Creating Ref LP");
	vExpDate = new Date();
	// TODO?   Assume if issued after October, let expire next year
	vNewExpDate = new Date(vExpDate.getFullYear() + (vExpDate.getMonth > 9 ? 1 : 0), 11,31);

	var licenseNbr;
	var licensesByName = aa.licenseScript.getRefLicensesProfByName(aa.serviceProvider, contact.getFirstName(), contact.getMiddleName(), contact.getLastName());

	if (licensesByName.getSuccess()) {
		licensesByName = licensesByName.getOutput();

		if (licensesByName != null && licensesByName.length > 0) {
			licenseNbr = licensesByName[0].getStateLicense();
			logDebug("Using Existing Ref LP: " + licenseNbr);
		}
	}

	if (!licenseNbr) {
		/*
		// no requirements on sequence number, but leave here just in case
		if (licenseNbr == null) {
		licenseNbr = getNextSequence(seqType, seqName, maskName);
		}
		 */

		licenseNbr = createdApp.getCustomID();
		createRefLP4Lookup(licenseNbr, licenseType, contactType, addressType);
		logDebug("Created Ref LP: " + createdApp.getCustomID());
	}
	var theRefLP = aa.licenseScript.getRefLicensesProfByLicNbr(aa.serviceProvider, licenseNbr).getOutput();

	if (theRefLP != null && theRefLP.length > 0) {
		logDebug("Updating Ref LP Expiry : " + vNewExpDate);

		theRefLP = theRefLP[0];
		aa.licenseScript.associateLpWithCap(createdApp, theRefLP);
		theRefLP.setLicenseExpirationDate(aa.date.getScriptDateTime(vNewExpDate));
		var editRefResult = aa.licenseScript.editRefLicenseProf(theRefLP);

		rB1ExpResult = aa.expiration.getLicensesByCapID(createdApp).getOutput();
		rB1ExpResult.setExpDate(aa.date.getScriptDateTime(vNewExpDate));
		rB1ExpResult.setExpStatus("Active");
		aa.expiration.editB1Expiration(rB1ExpResult.getB1Expiration());
	}
	
	var vEmailTemplate = "FT ARBORIST LICENSE ISSUANCE #146";
    var reportName = "JD_TEST_SSRS";
    var LicenseType = "Licenses/Contractor/Arborist/License";
    var rptParams = aa.util.newHashtable();
    rptParams.put("Record_ID", licenseNbr);
	var vEParams = aa.util.newHashtable();
	addParameter(vEParams, "$$LicenseType$$", LicenseType);
	addParameter(vEParams, "$$ExpirationDate$$", dateAdd(vNewExpDate,0));
	addParameter(vEParams, "$$ApplicationID$$", licenseNbr);
	addParameter(vEParams, "$$altID$$", licenseNbr);

	tmpCap = capId;
	capId = createdApp;
	emailContacts("All",vEmailTemplate, vEParams, reportName,rptParams);
	capId = tmpCap;
	
} else { //contact required exist on child (current) record
	logDebug("**WARN contact of type : " + contactType + " not found on record");
}
