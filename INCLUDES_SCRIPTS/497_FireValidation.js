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
			comment("Cannot Complete this inspection with open violations.");
		}	
	}

	var gsi = getGuideSheetObjects(inspId);
	if (gsi) 
	{
		for (var gs in gsi) 
		{
			var t = gsi[gs];
			t.loadInfoTables();
			for (var tb in t.infoTables)
			{					
				var g = (t.infoTables[tb] ? t.infoTables[tb] : []);
				for (var fvi in g) 
				{
					var fvit = g[fvi];
					if ("Non Compliance".equals(fvit["Violation Status"])) 
					{
						cancel = true;
						showMessage = true;
						comment("Cannot complete inspection while there are checklist items in non compliance");							
					}
				}	
			}
		}
	}
}