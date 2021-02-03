//Ray adding in oracle link
include("5131_Lic_Update_Oracle_link.js");

if (appMatch('Licenses/Liquor/*/*') || appMatch('Licenses/Supplemental/*/*')){
	if (appMatch('Licenses/Liquor/Liquor License/*') || appMatch('Licenses/Liquor/Tasting License/*') || appMatch('Licenses/Supplemental/*/*')){
		updateShortNotes(AInfo['Type of License']);
	}
	if (appMatch('Licenses/Liquor/Liquor Permit/*')){
		updateShortNotes(AInfo['Type of Permit']);
	}
}

