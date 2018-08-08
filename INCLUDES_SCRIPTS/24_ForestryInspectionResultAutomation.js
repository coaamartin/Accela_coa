script24_ForestryInspectionResultAutomation();

function script24_ForestryInspectionResultAutomation() {   
    var newInspection,
        newGuideSheetItems,
        newGuideSheetItem,
        curInspection = getInspections({ 
            inspId: inspId 
        }),
        curGuideSheetItems = getGuideSheetItems({
            inspId: inspId,
            guideTypeName: "FORESTRY INSPECTOR",
            guideItemValue: 'Yes'
        });

    if (ifTracer(inspType == "Forestry Inspection" && inspResult == "Complete", 'inspType == "Forestry Inspection" && inspResult == "Complete"' )) {
        
        logDebug('curGuideSheetItems.length: ' + curGuideSheetItems.length);
        logDebug('curInspection.length: ' + curInspection.length);
        //  printObjProps(curInspection);
        // printObjProps(curInspection[0].getInspection());
        // printObjProps(curInspection[0].getInspection().getActivity());

        if (ifTracer(curGuideSheetItems.length == 1 && curGuideSheetItems[0].guideItemText == "Inspect", 'Only Inspect == Yes')) {
            closeTask("Inspection Phase", "Complete", "", "");      
        } if (ifTracer(curGuideSheetItems.length > 1, 'curGuideSheetItems.length > 1')) {
            if(ifTracer(es6ArrayFind(curGuideSheetItems, function(itm) { return itm.guideItemText == 'Inspect' }) != null, 'Inspect == Yes')) {
                if(ifTracer( es6ArrayFind(curGuideSheetItems, function(itm) { return itm.guideItemText == 'Fertilize' })  != null
                        ||  es6ArrayFind(curGuideSheetItems, function(itm) { return itm.guideItemText == 'Grind Stump' })  != null
                        ||  es6ArrayFind(curGuideSheetItems, function(itm) { return itm.guideItemText == 'I&D Control' })  != null
                        ||  es6ArrayFind(curGuideSheetItems, function(itm) { return itm.guideItemText == 'I&D Sampling' })  != null
                        ||  es6ArrayFind(curGuideSheetItems, function(itm) { return itm.guideItemText == 'Plant' })  != null
                        ||  es6ArrayFind(curGuideSheetItems, function(itm) { return itm.guideItemText == 'Removal' })  != null
                        ||  es6ArrayFind(curGuideSheetItems, function(itm) { return itm.guideItemText == 'Remove Stakes' })  != null
                        ||  es6ArrayFind(curGuideSheetItems, function(itm) { return itm.guideItemText == 'Stake' })  != null
                        ||  es6ArrayFind(curGuideSheetItems, function(itm) { return itm.guideItemText == 'Storm Damage' })  != null
                        ||  es6ArrayFind(curGuideSheetItems, function(itm) { return itm.guideItemText == 'Trim - Clearance' })  != null
                        ||  es6ArrayFind(curGuideSheetItems, function(itm) { return itm.guideItemText == 'Trim - Dead Limbs' })  != null
                        ||  es6ArrayFind(curGuideSheetItems, function(itm) { return itm.guideItemText == 'Trim - Full' })  != null
                        ||  es6ArrayFind(curGuideSheetItems, function(itm) { return itm.guideItemText == 'Trim - Structure' })  != null
                      , "Going to create an inspection for 1 day in the future" )) {
                    
                        //create new inspection
                        scheduleInspection("Forestry Field Crew", dateAdd(null, 1, true), null, null, curInspection[0].getInspection().requestComment);
                        newInspection = getLastInspection({ inspType: "Forestry Field Crew" });
                        //populate inspection with specified values from current insption
                        newInspection.getInspection().getActivity().unitNBR = curInspection[0].getInspection().getActivity().unitNBR;
                        //      newInspection.getInspection().requestComment = curInspection.getInspection().requestComment;
                        newInspection.getInspection().getActivity().vehicleID = curInspection[0].getInspection().getActivity().vehicleID;
                        //update guidesheet items marked yes
                        newGuideSheetItems = newInspection.getInspection().getGuideSheets();
                        for(var i in curGuideSheetItems) {
                            newGuideSheetItem = es6ArrayFind(newGuideSheetItems, function(itm) { return itm.guideItemText == curGuideSheetItems[i].guideItemText })  
                            if(ifTracer(newGuideSheetItem != null, "guidesheet item found - so set it's value to Yes")) {
                                newGuideSheetItem.guideItemStatus = curGuideSheetItems[i].guideItemStatus;
                                aa.guidesheet.updateGGuidesheet(newGuideSheetItem.getAuditID());
                             }
                        }

                        //save updates to new inspection 
                        logDebug('going to update the inspection');
                        aa.inspection.editInspection(newInspection);                       

                }
            }
        }
    } else if (ifTracer(inspType == "Forestry Inspection" && inspResult == "Fall Trim", 'inspType == "Forestry Inspection" && inspResult == "Fall Trim"' )) {

        scheduleInspection("Field Crew Inspection",dateAdd(null, 1, true));

        
    } else if (ifTracer(inspType == "Forestry Inspection" && matches(inspResult, ["PR1", "PR2", "PR20", "Other"], 'inspType == "Forestry Inspection" && matches(inspResult, ["PR1", "PR2", "PR20", "Other"]') )) {
        
        
    }

    // function searchInspect1DayReqs() {
    //     return 
    // }
   
}