if (wfStatus == 'About to Expire') {
	include("2052_LicenseStatus");
}

if ((wfStatus == 'Fees Invoiced') && (appMatch('Licenses/Liquor/*/*') || appMatch('Licenses/Supplemental/*/*'))) {
	include("2056_Send_License_Notification");
}