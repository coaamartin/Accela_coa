//IF ASI GENERALBUSINESS not filled out, then stop the worfklow.
appTypeResult = cap.getCapType(); //create CapTypeModel object
appTypeString = appTypeResult.toString();
appTypeArray = appTypeString.split("/");
logDebug("appType: " + appTypeString);

if (!appMatch("Licenses/Liquor/Tasting License/Renewal ")){

if ((wfStatus == 'Issue License') && (AInfo['General Business License Number'] == null)){
	cancel = true;
	showMessage = true;
	logDebug("<font size=small><b>Liquor License:</b></font><br><br>The General Business License Number field is blank; cannot issue license.");
	comment("Warning: The General Business License field is missing. Go to Info Fields and enter the General Business License Number and try again.");
}

//IF ASI Temp License Issue Date not filled out, then stop the worfklow.
if ((wfStatus == 'Temp License Issued') && (AInfo['Temporary Permit Issue Date'] == null)){
	cancel = true;
	showMessage = true;
	logDebug("<font size=small><b>Liquor License:</b></font><br><br>The Temporary Permit Issue Date field is blank; cannot issue a temporary license.");
	comment("Warning: The Temporary Permit Issue Date field is missing. Go to Info Fields and enter the Temporary Permit Issue Date and try again.");
}
}