var vLicenseId = getParentLicenseCapID(capId);
if (vLicenseId != null && vLicenseId != false) {
	// Assess the Delinquent Fee
	var vLicenseObj;
	var vExpDate;
	var vExpDateString;
	var vLicExp_mm;
	var vLicExp_dd;
	var vLicExp_yyyy
	var vCompareDate;
	// Get expiration date as MM/DD/YYYY
	vLicenseObj = new licenseObject(null, vLicenseId);
	vExpDate = vLicenseObj.b1ExpDate;
	vExpDate = new Date(vExpDate);
	vLicExp_mm = vExpDate.getMonth() + 1;
	vLicExp_mm = (vLicExp_mm < 10) ? '0' + vLicExp_mm : vLicExp_mm;
	vLicExp_dd = vExpDate.getDate();
	vLicExp_dd = (vLicExp_dd < 10) ? '0' + vLicExp_dd : vLicExp_dd;
	vLicExp_yyyy = vExpDate.getFullYear();
	vExpDateString = vLicExp_mm + "/" + vLicExp_dd + "/" + vLicExp_yyyy;
	vExpDate = new Date(vExpDateString);
	vExpDate = dateAdd(vExpDate, 7);
	// Get the date of submittal to compare against license expiration.
	// For ACA submitted records it will be the Application Acceptance - Submitted date.
	// For non ACA submitted records it will be the Application Acceptance - Application Received date.
	var vCompareDate = new Date();;
	logDebug("Delinquent fee check. ACA submittal: " + cap.isCreatedByACA() + " Expiration Date: " + vExpDateString + " Compare Date: " + vCompareDate);
	if (vCompareDate != null && vCompareDate != false) {
		//vCompareDate = new Date(vCompareDateString);
		if (vExpDate < vCompareDate) {
			logDebug("Assessing delinquent fee. ACA submittal: " + cap.isCreatedByACA() + " Expiration Date: " + vExpDateString + " Compare Date: " + vCompareDate);
			if (appMatch("Licenses/Marijuana/Retail Cultivation/Renewal")) {
				updateFee("LIC_MJRC_03", "LIC_MJ_RC", "FINAL", 1, "Y");				
			} else if (appMatch("Licenses/Marijuana/Retail Product Manufacturer/Renewal")) {
				updateFee("LIC_MJRPM_03", "LIC_MJ_RPM", "FINAL", 1, "Y");				
			} else if (appMatch("Licenses/Marijuana/Retail Store/Renewal")) {
				updateFee("LIC_MJST_02", "LIC_MJ_STORE", "FINAL", 1, "Y");				
			} else if (appMatch("Licenses/Marijuana/Retail Transporter/Renewal")) {
				updateFee("LIC_MJTR_03", "LIC_MJ_TRANS", "FINAL", 1, "Y");			
			} else if (appMatch("Licenses/Marijuana/Testing Facility/Renewal")) {
				updateFee("LIC_MJTST_03", "LIC_MJ_TEST", "FINAL", 1, "Y");				
			} else {
				logDebug("Invalid renewal record type");
			}
		}
	}
}