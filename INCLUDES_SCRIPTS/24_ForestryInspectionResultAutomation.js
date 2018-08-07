script24_ForestryInspectionResultAutomation();

function script24_ForestryInspectionResultAutomation() {   
    var guideSheets = [];

    if (ifTracer(inspType == "Forestry Inspection" && inspResult == "Complete", 'inspType == "Forestry Inspection" && inspResult == "Complete"' )) {
     //   inspectListitem = getChecklistItem("Inspect")

     guideSheets = getGuideSheetItems({
        inspId: inspId,
        guideTypeName: "FORESTRY INSPECTION",
        guideItemValue: 'Yes'
     });

     logDebug('guideSheets.length: ' + guideSheets.length);
        
        // removalItem = getRemovalChecklistItem();
        // logDebug("removalItem: " + removalItem)
        // if(ifTracer(removalItem == "Yes", 'removalItem == "Yes"')) {
        //     closeTask("Crew Work", "Complete", "", ""); 
        //     activateTask("Stump Grind");
        // }
    } else if (ifTracer(inspType == "Forestry Inspection" && inspResult == "Fall Trim", 'inspType == "Forestry Inspection" && inspResult == "Fall Trim"' )) {
        
        
    } else if (ifTracer(inspType == "Forestry Inspection" && matches(inspResult, ["PR1", "PR2", "PR20", "Other"], 'inspType == "Forestry Inspection" && matches(inspResult, ["PR1", "PR2", "PR20", "Other"]') )) {
        
        
    }
   
}