function loadFIGuideSheetItems(inspId) {
	//
	// Returns an array of guide sheet objects
	// Optional second parameter, cap ID to load from
	// requires guideSheetObject definition
	//

	var retArray = new Array()
	var itemCap = capId;
	if (arguments.length == 2)
		itemCap = arguments[1]; // use cap ID specified in args

	var r = aa.inspection.getInspections(itemCap); // have to use this method to get guidesheet data

	if (r.getSuccess()) {
		var inspArray = r.getOutput();

		for (i in inspArray) {
			if (inspArray[i].getIdNumber() == inspId) {
				var inspModel = inspArray[i].getInspection();

				var gs = inspModel.getGuideSheets()

				if (gs) {
					gsArray = gs.toArray();
					for ( var loopk in gsArray) {
						a = gsArray[loopk];

						var gsItems = gsArray[loopk].getItems().toArray()
						for ( var loopi in gsItems) {
							if (gsItems[loopi].getGuideType().toUpperCase() == "FORESTRY INSPECTOR") {
								var gso = new guideSheetObject(gsArray[loopk], gsItems[loopi]);
								retArray.push(gsItems[loopi].getGuideItemStatus());
							}
						}
					}
				} // if there are guidesheets
				else
					logDebug("No guidesheets for this inspection");
			} // if this is the right inspection
		} // for each inspection
	} // if there are inspections

	logDebug("loaded " + retArray.length + " guidesheet items");
	return retArray;
}