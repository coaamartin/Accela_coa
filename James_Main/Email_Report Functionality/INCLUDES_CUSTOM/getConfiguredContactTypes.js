function getConfiguredContactTypes() {
	var bizDomScriptResult = aa.bizDomain.getBizDomain('CONTACT TYPE');
	var vContactTypeArray = [];
	var i;
	
	if (bizDomScriptResult.getSuccess()) {
		bizDomScriptArray = bizDomScriptResult.getOutput().toArray();
		
		for (i in bizDomScriptArray) {
			if (bizDomScriptArray[i].getAuditStatus() != 'I') { 
				vContactTypeArray.push(bizDomScriptArray[i].getBizdomainValue());
			}
		}
	}
	
	return vContactTypeArray;
}