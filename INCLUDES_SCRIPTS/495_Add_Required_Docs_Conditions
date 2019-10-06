var docs = getDocumentList();
if ("Corporation".equals(AInfo["Type of Ownership"]) || "LLC".equals(AInfo["Type of Ownership"]))
{
	var allGood = false;
	var requiredDocs = new Array();
	for (var d in docs)
	{
		requiredDocs[docs[d].getDocCategory()] = true;
	}
	if (!requiredDocs["Local - Articles of Incorporation"])
		addStdConditionwithComment("Required Document", "Required Document", "Local - Articles of Incorporation");
	if (!requiredDocs["Local - Bylaws"])
		addStdConditionwithComment("Required Document", "Required Document", "Local - Bylaws");
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
		addStdConditionwithComment("Required Document", "Required Document", "Local - Operating Agreement");
	
}