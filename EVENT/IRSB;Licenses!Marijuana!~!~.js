
//checks that all checklist items have been resulted before allowing inspection results to be submitted
var vChecklistItems = getGuideSheetItems({inspId: inspId});
var vChecklistStatuses = ["Pass","Fail","NA"];

for (i in vChecklistItems) {
	if (!exists(vChecklistItems[i].getGuideItemStatus(), vChecklistStatuses)) {
		cancel = true;
		showMessage = true;
		comment("Every checklist item must be resulted. Please review checklist items before submitting inspection results");
		break;
	}
}