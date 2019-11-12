if ("Complete".equals(inspResult))
{
	var options = {inspId: inspId};
	var gsItems = getGuideSheetItems(options);
	for (var g in gsItems)
	{
		var gsItem = gsItems[g];
		if ("Fire Violations".equals(gsItem.getGuideType()) && "Yes".equals(gsItem.getGuideItemStatus()))
		{
			cancel = true;
			showMessage = true;
			comment("Cannot Complete this inspection with open vilaitons.");
		}
	}
}