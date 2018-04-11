function getASIgroup(groupName, itemCap) {
	var ret = new Array();
	var appSpecInfoResult = aa.appSpecificInfo.getByCapID(itemCap);
	if (appSpecInfoResult.getSuccess()) {
		var appspecObj = appSpecInfoResult.getOutput();

		if (groupName != "") {
			for (i in appspecObj)
				if (appspecObj[i].getCheckboxType() == groupName) {
					ret.push(appspecObj[i]);
				}
		}
	} else {
		ret = null;
		logDebug("**ERROR: getting app specific info for Cap : " + appSpecInfoResult.getErrorMessage())
	}
	return ret;
}