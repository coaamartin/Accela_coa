script24_ForestryInspectionResultAutomation();

function script24_ForestryInspectionResultAutomation() {   
    var currentInspection = getInspections({ 
            inspId: inspId 
        }),
        guideSheets = getGuideSheetItems({
            inspId: inspId,
            guideTypeName: "FORESTRY INSPECTOR",
            guideItemValue: 'Yes'
        });

    if (ifTracer(inspType == "Forestry Inspection" && inspResult == "Complete", 'inspType == "Forestry Inspection" && inspResult == "Complete"' )) {
     //   inspectListitem = getChecklistItem("Inspect")

        if (ifTracer(guideSheets.length = 1 && guideSheets[0].guideItemText == "Inspect", 'Only Inspect == Yes')) {
            closeTask("Inspection Phase", "Complete", "", "");      
        }
        if(guideSheets.length > 1 
            && es6ArrayFind(guideSheets, function(itm) { return itm.guideItemText == 'Inspect' }) != null
            && (
                es6ArrayFind(guideSheets, function(itm) { return itm.guideItemText == 'Fertilize' })  != null
                ||  es6ArrayFind(guideSheets, function(itm) { return itm.guideItemText == 'Grind Stump' })  != null
                ||  es6ArrayFind(guideSheets, function(itm) { return itm.guideItemText == 'I&D Control' })  != null
                ||  es6ArrayFind(guideSheets, function(itm) { return itm.guideItemText == 'I&D Sampling' })  != null
                ||  es6ArrayFind(guideSheets, function(itm) { return itm.guideItemText == 'Plant' })  != null
                ||  es6ArrayFind(guideSheets, function(itm) { return itm.guideItemText == 'Removal' })  != null
                ||  es6ArrayFind(guideSheets, function(itm) { return itm.guideItemText == 'Remove Stakes' })  != null
                ||  es6ArrayFind(guideSheets, function(itm) { return itm.guideItemText == 'Stake' })  != null
                ||  es6ArrayFind(guideSheets, function(itm) { return itm.guideItemText == 'Storm Damage' })  != null
                ||  es6ArrayFind(guideSheets, function(itm) { return itm.guideItemText == 'Trim – Clearance' })  != null
                ||  es6ArrayFind(guideSheets, function(itm) { return itm.guideItemText == 'Trim – Dead Limbs' })  != null
                ||  es6ArrayFind(guideSheets, function(itm) { return itm.guideItemText == 'Trim – Full' })  != null
                ||  es6ArrayFind(guideSheets, function(itm) { return itm.guideItemText == 'Trim – Structure' })  != null
              )
        ) {
            scheduleInspection("Field Crew Inspection", dateAdd(null, 1, true));
        }

     logDebug('guideSheets.length: ' + guideSheets.length);
        
        // removalItem = getRemovalChecklistItem();
        // logDebug("removalItem: " + removalItem)
        // if(ifTracer(removalItem == "Yes", 'removalItem == "Yes"')) {
        //     closeTask("Crew Work", "Complete", "", ""); 
        //     activateTask("Stump Grind");
        // }
    } else if (ifTracer(inspType == "Forestry Inspection" && inspResult == "Fall Trim", 'inspType == "Forestry Inspection" && inspResult == "Fall Trim"' )) {

        scheduleInspection("Field Crew Inspection",nextWorkingDay,inspector);

        
    } else if (ifTracer(inspType == "Forestry Inspection" && matches(inspResult, ["PR1", "PR2", "PR20", "Other"], 'inspType == "Forestry Inspection" && matches(inspResult, ["PR1", "PR2", "PR20", "Other"]') )) {
        
        
    }
   
}