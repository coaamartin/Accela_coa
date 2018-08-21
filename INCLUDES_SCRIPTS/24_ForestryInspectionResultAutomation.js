script24_ForestryInspectionResultAutomation();

function script24_ForestryInspectionResultAutomation() {   
    var newInspection,
        newGuidesheetModel,
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
        
    //   printObjProps(curInspection);
      //  printObjProps(curInspection[0].getInspection());
     //   printObjProps(curInspection[0].getInspection().getActivity());

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
                    
                    createInspection("Forestry Field Crew",  aa.date.parseDate(dateAdd(null, 1, true)));
                    //populate inspection with specified values from current insption
                    newInspection.getInspection().getActivity().unitNBR = curInspection[0].getInspection().getActivity().unitNBR;
                    newInspection.getInspection().getActivity().vehicleID = curInspection[0].getInspection().getActivity().vehicleID;
                    //update guidesheet items marked yes
                    getGuidesheetObjs()
                    for(var i in curGuideSheetItems) {
                        newGuideSheetItem = es6ArrayFind(newGuideSheetItems, function(itm) { return itm.guideItemText == curGuideSheetItems[i].guideItemText 
                                                                                                && curGuideSheetItems[i].guideItemText != 'Inspect' })  
                        if(ifTracer(newGuideSheetItem != null, "guidesheet item found - so set it's value to Yes")) {
                            newGuideSheetItem.guideItemStatus = 'Yes';
                            newGuideSheetItem.guideItemComment = curGuideSheetItems[i].guideItemComment;
                        }
                    }
                    updateInspectionAndGuidesheet();
                }
            }
        }
    } else if (ifTracer(inspType == "Forestry Inspection" && inspResult == "Fall Trim", 'inspType == "Forestry Inspection" && inspResult == "Fall Trim"' )) {

        var today = new Date();
        var apr1 = new Date(today.getFullYear(), 3, 1),
            nov15 = new Date(today.getFullYear(), 10, 14);
         var inspDte = today.getTime() > apr1.getTime() && today.getTime() < nov15.getTime() ? new Date(today.getFullYear(), 10, 15) : new Date(); 

        createInspection("Forestry Field Crew",  aa.date.parseDate(aa.util.formatDate(inspDte, "MM/dd/YYYY")));
        //populate inspection with specified values from current insption
        newInspection.getInspection().resultComment = curInspection[0].getInspection().resultComment;
        newInspection.getInspection().getActivity().unitNBR = curInspection[0].getInspection().getActivity().unitNBR;
        newInspection.getInspection().getActivity().vehicleID = curInspection[0].getInspection().getActivity().vehicleID;
        //update guidesheet items marked yes
        getGuidesheetObjs()
        for(var i in curGuideSheetItems) {
            newGuideSheetItem = es6ArrayFind(newGuideSheetItems, function(itm) { return itm.guideItemText == curGuideSheetItems[i].guideItemText 
                                                                                        && curGuideSheetItems[i].guideItemText != 'Inspect' })  
            if(ifTracer(newGuideSheetItem != null, "guidesheet item found - so set it's value to Yes")) {
                newGuideSheetItem.guideItemStatus = 'Yes';
                newGuideSheetItem.guideItemComment = curGuideSheetItems[i].guideItemComment;
            }
        }
        updateInspectionAndGuidesheet();

        
    } else if (ifTracer(inspType == "Forestry Inspection" && matches(inspResult, "PR1", "PR2", "PR20", "Other"), 'inspType == "Forestry Inspection" && matches(inspResult, ["PR1", "PR2", "PR20", "Other"]')) {
        
        createInspection("Forestry Field Crew",  aa.date.parseDate(aa.util.formatDate(new Date(), "MM/dd/YYYY")));
        //populate inspection with specified values from current insption
        newInspection.getInspection().resultComment = curInspection[0].getInspection().resultComment;
        newInspection.getInspection().getActivity().unitNBR = curInspection[0].getInspection().getActivity().unitNBR;
        newInspection.getInspection().getActivity().vehicleID = curInspection[0].getInspection().getActivity().vehicleID;
        //update guidesheet items marked yes
        getGuidesheetObjs()
        for(var i in curGuideSheetItems) {
            newGuideSheetItem = es6ArrayFind(newGuideSheetItems, function(itm) { return itm.guideItemText == curGuideSheetItems[i].guideItemText 
                                                                                        && curGuideSheetItems[i].guideItemText != 'Inspect' })  
            if(ifTracer(newGuideSheetItem != null, "guidesheet item found - so set it's value to Yes")) {
                newGuideSheetItem.guideItemStatus = 'Yes';
                newGuideSheetItem.guideItemComment = curGuideSheetItems[i].guideItemComment;
            }
        }
        updateInspectionAndGuidesheet();
        
    } else if (ifTracer(inspType == "Forestry Inspection" && inspResult == "Forestry Refer to Code", 'inspType == "Forestry Inspection" && inspResult == "Forestry Refer to Code"' )) {

        closeAllTasks(capId, 'closed by script 24');
        updateAppStatus('Compliance','Status set by script 24', capId);
        var childCapId = createChildGeneric('Enforcement', 'Incident', 'Zoning', 'NA', {});
        
        if(ifTracer(childCapId, 'child was generated'))
            updateWorkDesc(workDescGet(capId) + " " + inspResultDate + " - " + inspComment, childCapId);
    }


    function createInspection(type, date) {
        aa.inspection.scheduleInspection(capId, null, date, null, type, curInspection[0].getInspection().requestComment);
        newInspection = getLastInspection({ inspType: "Forestry Field Crew" });
    }

    function getGuidesheetObjs() {
        newGuidesheetModel = newInspection.getInspection().getGuideSheets().toArray()[0];
        newGuideSheetItems = newGuidesheetModel.getItems().toArray();
    }

    function updateInspectionAndGuidesheet() {
        aa.guidesheet.updateGGuidesheet(newGuidesheetModel, newGuidesheetModel.getAuditID());
        aa.inspection.editInspection(newInspection);                       
    }
   
}