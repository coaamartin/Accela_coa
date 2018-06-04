
/**
 * deactivate a SD item
 * @param stdChoiceName
 * @param stdChoiceValue
 * @returns {Boolean}
 */
function deactivateSD(stdChoiceName, stdChoiceValue) {
	var bizDomainResult = aa.bizDomain.getBizDomainByValue(stdChoiceName, stdChoiceValue);

	if (!bizDomainResult.getSuccess()) {
		logDebug("bizDomainResult failed " + bizDomainResult.getErrorMessage());
		return false;
	}

	bizDomainResult = bizDomainResult.getOutput();
	if (bizDomainResult != null && bizDomainResult.getBizDomain().getAuditStatus() != "I") {//exist and active
		var bizModel = bizDomainResult.getBizDomain();
		bizModel.setAuditStatus("I");
		var edit = aa.bizDomain.editBizDomain(bizModel, "en_US");
		if (!edit.getSuccess()) {
			logDebug("SD edit failed, Error: " + edit.getErrorMessage());
			return false;
		}
		
		if(!activeRecsOnBizDomain(stdChoiceName)){
			activateSCRow(stdChoiceName, "Code Change");
		}
	}
	return true;
}