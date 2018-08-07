 /* RETURNS AN ARRAY OF [ {com.accela.aa.inspection.guidesheet.GGuideSheetItemModel } ]
     * OPTIONAL FILTERS SUCH AS inspId, guidesheetName, guideTypeName, guideItemName, guideItemValue
     *
     * EXAMPLE - Gets all items for specified inspId, guidelist type, where value = 'Yes'
     *  guideSheets = getGuideSheetItems({
            inspId: inspId,
            guideTypeName: "FORESTRY INSPECTOR",
            guideItemValue: 'Yes'
        });
     * 
    */
   function getGuideSheetItems(options) {
    var settings = {
        capId: capId,
        inspId: null,    // filter by InspId - null for no filtering
        guideTypeName: null,    // filter by guideTypeName - null for no filtering
        guideItemName: null,  // filter by guideItemName (guideItemText) - null for no filtering
        guideItemValue: null  // filter by itemValue (guideItemStatus) - null for no filtering
    };
    //optional params - overriding default settings
    for (var attr in options) { settings[attr] = options[attr]; } 
  
    var returnItems = [],
        inspections = [],
        inspModel,
        inspGuidesheets,
        inspGuidesheetsArray = [],
        inspGuidesheetItemsArray = [];

    inspections = aa.inspection.getInspections(settings.capId).getOutput();

    for (var inspKey in inspections) {
        if (inspections[inspKey].getIdNumber() == settings.inspId || settings.inspId == null) {
            inspModel = inspections[inspKey].getInspection();
            inspGuidesheets = inspModel.getGuideSheets();

            if (inspGuidesheets) {
                inspGuidesheetsArray = inspGuidesheets.toArray();
                for (var gsKey in inspGuidesheetsArray) {
                    if(inspGuidesheetsArray[gsKey].guideType == settings.guideTypeName || settings.guideTypeName == null) {
                        var inspGuidesheetItemsArray = inspGuidesheetsArray[gsKey].getItems().toArray();
                        for (var idx in inspGuidesheetItemsArray) {
                            if(settings.guideItemName == inspGuidesheetItemsArray[idx].guideItemText
                                || settings.guideItemValue == inspGuidesheetItemsArray[idx].guideItemStatus
                                || (settings.guideItemName == null && settings.guideItemValue == null)
                            ) {
                                returnItems.push( inspGuidesheetItemsArray[idx]);
                            }
                        }
                    }
                } 
            }
        } 
    }
    return returnItems;
}
