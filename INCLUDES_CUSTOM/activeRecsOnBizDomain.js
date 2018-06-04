
// return true or false.
// Check if there active records on the given standard choice
function activeRecsOnBizDomain(stdChoiceName){
	var actRecs = false;
	var bizDomainResult = aa.bizDomain.getBizDomain(stdChoiceName);
	
	if (!bizDomainResult.getSuccess()) {
		aa.print("bizDomainResult failed in activeRecsOnBizDomain()" + bizDomainResult.getErrorMessage());
		return false;
	}
	
	bizDomain = bizDomainResult.getOutput().toArray();
	if(bizDomain != null){
		if(bizDomain.length > 0) actRecs = true;
	}
	
	return actRecs;
}