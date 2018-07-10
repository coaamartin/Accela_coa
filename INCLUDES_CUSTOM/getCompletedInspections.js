function getCompletedInspections(options) {
    var settings = {
        inspType: null, // if not null, will filter by given inspection type
        capId: capId,
    };
    for (var attr in options) { settings[attr] = options[attr]; } //optional params - overriding default settings

    var completedInspections = [],
        inspResultObj = aa.inspection.getInspections(settings.capId);
      
    if (inspResultObj.getSuccess()) {
        var inspList = inspResultObj.getOutput();
        for (xx in inspList) {
            if(
                (!inspList[xx].getInspectionStatus().toUpperCase().equals("SCHEDULED"))
                && (settings.inspType = null || String(settings.inspType).equals(inspArray[i].getInspectionType()))
            ){
                completedInspections.push(inspList[xx]);
            }
        }
    }    
      
    return completedInspections;
}
