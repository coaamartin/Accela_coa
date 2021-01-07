
// Script 2051
if (wfStatus == "Issue License") {
	include("2051_CreateChildLicense");
}

//Script 2062
if (appMatch('*/Liquor/*/*')) {
	include("2062_TempLicenseExpDate");
}