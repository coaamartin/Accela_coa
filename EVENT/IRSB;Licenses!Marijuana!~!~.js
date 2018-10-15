
var vChecklistItems = getGuideSheetItems({inspId: inspId});
var vChecklistStatuses = ["Pass","Fail","NA"];

logDebug("vChecklistItems length: " + vChecklistItems.length);

for (i in vChecklistItems) {
	if (!exists(vChecklistItems[i].getGuideItemStatus(), vChecklistStatuses)) {
		logDebug("checklist item statuses: " + vChecklistItems[i].getGuideItemStatus());
		cancel = true;
		showMessage = true;
		comment("Every checklist item must be resulted. Please review checklist items before submitting inspection results");
	}
}
