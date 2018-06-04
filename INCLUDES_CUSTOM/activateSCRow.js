
// Activate a value in an SC or add if it doesn't exits
function activateSCRow(stdChoiceName, stdChoiceValue){
	var bizDomainResult = aa.bizDomain.getBizDomainByValue(stdChoiceName, stdChoiceValue);

	if (bizDomainResult.getSuccess()) {
	    bizDomainResult = bizDomainResult.getOutput();
	    if (bizDomainResult != null && bizDomainResult.getBizDomain().getAuditStatus() == "I") {//exist and active
	    	var bizModel = bizDomainResult.getBizDomain();
	    	bizModel.setAuditStatus("A");
	    	var edit = aa.bizDomain.editBizDomain(bizModel, "en_US");
	    	if (!edit.getSuccess()) {
	    		logDebug("SD edit failed, Error: " + edit.getErrorMessage());
	    		return false;
	    	}
	    }
	    return true;
	}
	else{//It doesn't exist add it
		editLookup(stdChoiceName,stdChoiceValue,"used when there is nothing in the list - made inactive or deleted once 1 items is added to the list via script");
	}
}