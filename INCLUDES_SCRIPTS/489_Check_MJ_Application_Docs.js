var docs = getDocumentList();
if ("Corporation".equals(AInfo["Type of Ownership"]) || "LLC".equals(AInfo["Type of Ownership"]))
{
	var allGood = false;
	var requiredDocs = new Array();
	for (var d in docs)
	{
		requiredDocs[docs[d].getDocCategory()] = true;
	}
	if (!requiredDocs["Local - Articles of Incorporation"] || !requiredDocs["Local - Bylaws"])
	{
		cancel = true;
		showMessage = true;
		comment("Document types Local - Articles of Incorporation and Local - Bylaws are required for this Type of Ownership.");
	}
}
else if ("Individual".equals(AInfo["Type of Ownership"]) || "Sole Proprietor".equals(AInfo["Type of Ownership"]) || "Partnership".equals(AInfo["Type of Ownership"]))
{
	var allGood = false;
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
		comment("Document type Local - Operating Agreement is required for this Type of Ownership.");
	}	
}