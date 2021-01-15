function getACARecordURL(acaUrl) {

    var acaRecordUrl = "";
	var acaUrl = lookup("ACA_CONFIGS", "ACA_SITE");
	if (acaUrl) acaUrl = acaUrl.toLowerCase().replace("/admin", "").replace("/default.aspx", "");     
	var id1 = capId.ID1;
    var id2 = capId.ID2;
    var id3 = capId.ID3;

    acaRecordUrl = acaUrl + "/urlrouting.ashx?type=1000";
    acaRecordUrl += "&Module=" + cap.getCapModel().getModuleName();
    acaRecordUrl += "&capID1=" + id1 + "&capID2=" + id2 + "&capID3=" + id3;
    acaRecordUrl += "&agencyCode=" + aa.getServiceProviderCode();

    return acaRecordUrl;
}
