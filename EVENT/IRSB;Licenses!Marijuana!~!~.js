
var vChecklistItems = getGuideSheetItems({inspId: inspId});

for (i in vChecklistItems) {
	if (vChecklistItems[i].guideItemStatus == null) {
	cancel = true;
	showMessage = true;
	comment("Every checklist item must be resulted. Please review checklist items before submitting inspection results");
	}
}
