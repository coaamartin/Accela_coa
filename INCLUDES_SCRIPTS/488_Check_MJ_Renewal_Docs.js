var docs = getDocumentList();
var allGood = false;
var parent = getParentCapID4Renewal();
var oType = getAppSpecific("Type of Ownership", parent) || "";
if ("Corporation".equals(oType) || "LLC".equals(oType) || "Partnership".equals(oType))
{
	for (var d in docs)
	{
		if ("Local - Bylaws".equals(docs[d].getDocCategory()))
		{
			allGood = true;
			break;
		}
	}
	if (!allGood)
	{
		cancel = true;
		showMessage = true;
		comment("Document type Local - Bylaws is required for this Type of Ownership");
	}
}
else if ("Individual".equals(oType) || "Sole Proprietor".equals(oType))
{
	for (var d in docs)
	{
		if ("Local - Operating Agreement".equals(docs[d].getDocCategory()))
		{
			allGood = true;
			break;
		}
	}
	if (!allGood)
	{
		cancel = true;
		showMessage = true;
		comment("Document type Local - Operating Agreement is required for this Type of Ownership");
	}	
}