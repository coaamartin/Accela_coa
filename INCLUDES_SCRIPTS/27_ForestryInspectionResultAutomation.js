script27_ForestryInspectionResultAutomation();

function script27_ForestryInspectionResultAutomation() {   
    var inspectListitem = null;

    if (ifTracer(inspType == "Forestry Inspection" && inspResult == "Complete", 'inspType == "Forestry Inspection" && inspResult == "Complete"' )) {
        inspectListitem = getChecklistItem("Inspect")
        
        // removalItem = getRemovalChecklistItem();
        // logDebug("removalItem: " + removalItem)
        // if(ifTracer(removalItem == "Yes", 'removalItem == "Yes"')) {
        //     closeTask("Crew Work", "Complete", "", ""); 
        //     activateTask("Stump Grind");
        // }
    } else if (ifTracer(inspType == "Forestry Inspection" && inspResult == "Fall Trim", 'inspType == "Forestry Inspection" && inspResult == "Fall Trim"' )) {
        
        
    } else if (ifTracer(inspType == "Forestry Inspection" && matches(inspResult, ["PR1", "PR2", "PR20", "Other"], 'inspType == "Forestry Inspection" && matches(inspResult, ["PR1", "PR2", "PR20", "Other"]') )) {
        
        
    }
    
    
    function getChecklistItem(itemKey) {
        var guideSheetObjects;

        guideSheetObjects = getGuideSheetObjects(inspId);
        var items = loadGuideSheetItems(inspId) 
        return items[itemKey];
    }
}