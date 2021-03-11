//Ray adding in oracle link
// logDebug("Start script 5131_Lic_Update_Oracle_link.js")
// include("5131_Lic_Update_Oracle_link");

if (appMatch('Licenses/Liquor/*/*') || appMatch('Licenses/Supplemental/*/*')){
	if (appMatch('Licenses/Liquor/Liquor License/*') || appMatch('Licenses/Liquor/Tasting License/*') || appMatch('Licenses/Supplemental/*/*')){
		updateShortNotes(AInfo['Type of License']);
		logDebug("Start script 5131_Lic_Update_Oracle_link.js")
		include("5131_Lic_Update_Oracle_link");
	}
	if (appMatch('Licenses/Liquor/Liquor Permit/*')){
		updateShortNotes(AInfo['Type of Permit']);
		logDebug("Start script 5131_Lic_Update_Oracle_link.js")
		include("5131_Lic_Update_Oracle_link");
	}
}

else if(appMatch('Licenses/Business/*/*')){
	logDebug("Start script 5131_Lic_Update_Oracle_link.js")
	include("5131_Lic_Update_Oracle_link");
}