// NOTE
    //Task status = "Crew Work", because "Field Crew" task status mentioned in the spec document was not found on the record type workflow.

 script55_AfterForestryFieldCrewInspection();

 function script55_AfterForestryFieldCrewInspection() {   
    var removalItem = null;

    if (ifTracer(inspResult == "Complete", 'inspResult == "Complete"')) {
        removalItem = getRemovalChecklistItem();
        logDebug("removalItem: " + removalItem)
        if(ifTracer(removalItem == "Yes", 'removalItem == "Yes"')) {
            closeTask("Crew Work", "Complete", "", ""); 
            activateTask("Stump Grind");
        }
    }
    
    function getRemovalChecklistItem() {
        var guideSheetObjects;

        guideSheetObjects = getGuideSheetObjects(inspId);
        var items = loadGuideSheetItems(inspId) 
        return items['Removal'];
    }
 }