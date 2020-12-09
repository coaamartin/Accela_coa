//IF ASI GENERALBUSINESS not filled out, then stop the worfklow.
if ((wfStatus == 'Issue License') && (AInfo['General Business License Number'] == null)){
	cancel = true;
	showMessage = true;
	logDebug("<font size=small><b>Liquor License:</b></font><br><br>The General Business License Number field is blank; cannot issue license.");
	comment("Warning: The General Business License field is missing. Go to Info Fields and enter the General Business License Number and try again.");
}