if (wfStatus == 'About to Expire') {
	include("2052_LicenseStatus");
}

if (appMatch('Licenses/Liquor/*/*') || appMatch('Licenses/Business/*/*') || appMatch('Licenses/Supplemental/*/*')) {
	include("2056_Send_License_Notification");
}

if (wfTask == 'Application Received' && wfStatus == 'Complete'){
	include("2057_LicenseFees");
}
if (wfStatus == 'Active') {
	include("2061_Send_IssuedLicense_Email");
}
