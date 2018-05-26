
function mapAreaTRSAssignmentInspectors(areaNo, trs, stdForestryInspectorAssignments) {
    var bizDomScriptResult = aa.bizDomain.getBizDomain(stdForestryInspectorAssignments);
    if (bizDomScriptResult.getSuccess()) {
        arrBizDomScript = bizDomScriptResult.getOutput().toArray();
        if (arrBizDomScript != null && arrBizDomScript.length > 0) {
            for (var b in arrBizDomScript) {
                var bizDomainValue = arrBizDomScript[b].getBizdomainValue();
                var inspectorName = arrBizDomScript[b].getDescription();
                if (typeof (bizDomainValue) != "undefined" && bizDomainValue != null && bizDomainValue != "") {
                    var arrBizDomainValue = bizDomainValue.split("\\|");
                    if (arrBizDomainValue != null && arrBizDomainValue.length > 0) {
                        if (typeof (areaNo) != "undefined" && areaNo != null && areaNo != "") {
                            if (arrBizDomainValue[0] != null && arrBizDomainValue[0] != "") {
                                if (areaNo == arrBizDomainValue[0]) {
                                    if (typeof (inspectorName) != "undefined" && inspectorName != null && inspectorName != "") {
                                        getAssignInspectorID(inspectorName);
                                        break;
                                    }
                                }
                            }
                        } else if (typeof (trs) != "undefined" && trs != null && trs != "") {
                            if (arrBizDomainValue[1] != null && arrBizDomainValue[1] != "") {
                                if (trs == arrBizDomainValue[1]) {
                                    if (typeof (inspectorName) != "undefined" && inspectorName != null && inspectorName != "") {
                                        getAssignInspectorID(inspectorName);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
