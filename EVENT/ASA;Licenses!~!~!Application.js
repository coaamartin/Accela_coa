if (appMatch('Licenses/Liquor/*/*')){
	if (appMatch('Licenses/Liquor/Liquor License/*') || appMatch('Licenses/Liquor/Tasting License/*')){
		updateShortNotes(AInfo['Type of License']);
	}
	if (appMatch('Licenses/Liquor/Liquor Permit/*')){
		updateShortNotes(AInfo['Type of Permit']);
	}
}
