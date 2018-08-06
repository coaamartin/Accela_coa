// NOTE
    //Task status = "Crew Work", because "Field Crew" task status mentioned in the spec document was not found on the record type workflow.

 script55_AfterForestryFieldCrewInspection();

 function script55_AfterForestryFieldCrewInspection() {   
    var removalItem = null;

    if (ifTracer(inspResult == "Complete", 'inspResult == "Complete"')) {
        removalItem = getRemovalChecklistItem();
        if(ifTracer(removalItem == "Yes", 'removalItem == "Yes"') {
        //  closeTask("Crew Work", "Complete", "", ""); 
        //  activateTask("Stump Grind");
        }
    }


    
    function getRemovalChecklistItem() {
         var guideSheetObjects,
         item = null,

         guideSheetObjects = getGuideSheetObjects(inspId);
         if (ifTracer(guideSheetObjects && guideSheetObjects.length > 0, 'guideSheetObjects.length > 0')) {
            for (idx in guideSheetObjects) {
                if(ifTracer(guideSheetObjects[idx].gsType == "FORESTRY FIELD CREW", 'guideSheetObjects[idx].gsType == "FORESTRY FIELD CREW"')) {
                    guideSheetObjects[idx].loadInfo();
                    return guideSheetObjects[idx].info["Removal"]
                }
                
            }
        }
        return item;
    }
 }