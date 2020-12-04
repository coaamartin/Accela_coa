// If setting the License status manually from the workflow
try {
if (wfTask == 'License Status' && wfStatus == 'About to Expire') {
	 lic = new licenseObject(capIDString);
	 lic.setStatus('About to Expire');
	 }
if (wfStatus == "Issue License") {
	include("2060_GBExpirationDateSet");
}
} catch (err) {
	logDebug("A JavaScript Error occured: " + err.message + " In Line " + err.lineNumber);
}