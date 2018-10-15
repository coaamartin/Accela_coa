
var vChecklistItems = getGuideSheetItems({inspId: inspId});

logDebug("vChecklistItems length: " + vChecklistItems.length);

for (i in vChecklistItems) {
	if (vChecklistItems[i].getGuideItemStatus() == null) {
		cancel = true;
		showMessage = true;
		comment("Every checklist item must be resulted. Please review checklist items before submitting inspection results");
	}
}
