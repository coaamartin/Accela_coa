function feeAmount2(feestr, itemCap) {
    var checkStatus = false;
	var statusArray = new Array();

	//get optional arguments
	if (arguments.length > 2) {
		checkStatus = true;
		for (var i = 1; i < arguments.length; i++)
			statusArray.push(arguments[i]);
	}


	var feeTotal = 0;
	var feeResult = aa.fee.getFeeItems(itemCap, feestr, null);
	if (feeResult.getSuccess()) {
		var feeObjArr = feeResult.getOutput();
	} else {
		logDebug("**ERROR: getting fee items: " + feeResult.getErrorMessage());
		return false
	}

	for (ff in feeObjArr) {
		if (feestr.equals(feeObjArr[ff].getFeeCod()) && (!checkStatus || exists(feeObjArr[ff].getFeeitemStatus(), statusArray))) {
            feeTotal += feeObjArr[ff].getFee();
        }
    }

    return feeTotal;
}