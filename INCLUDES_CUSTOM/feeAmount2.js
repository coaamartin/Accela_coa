function feeAmount2(feestr, options) {
    var settings = {
        capId: capId,
        checkStatus: false
    };
    for (var attr in options) { settings[attr] = options[attr]; } //optional params - overriding default settings

	var statusArray = new Array();

	//get optional arguments
	if (settings.checkStatus == true) {
		for (var i = 1; i < arguments.length; i++)
			statusArray.push(arguments[i]);
	}

	var feeTotal = 0;
	var feeResult = aa.fee.getFeeItems(settings.capId, feestr, null);
	if (feeResult.getSuccess()) {
		var feeObjArr = feeResult.getOutput();
	} else {
		logDebug("**ERROR: getting fee items: " + feeResult.getErrorMessage());
		return false
	}

	for (ff in feeObjArr) {
		if (feestr.equals(feeObjArr[ff].getFeeCod()) && (!settings.checkStatus || exists(feeObjArr[ff].getFeeitemStatus(), statusArray))) {
            feeTotal += feeObjArr[ff].getFee();
        }

        return feeTotal;
    }
} 