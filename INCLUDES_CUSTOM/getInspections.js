/*
* GETS INSPECTIONS

    OPTIONS: ADDITIONAL OPTIONS YOU NEED FOR FILTERING (CURRENTLY FILTERS BY inspId, inspType & inspResult)
*/
function getInspections(options) {
    var settings = {
        capId: capId,
        inspId: null, // if not null, will filter by given inspection id
        inspType: null, // if not null, will filter by given inspection type
        inspResult: null // if not null, will filter by given inspection result
    };
    for (var attr in options) { settings[attr] = options[attr]; } //optional params - overriding default settings
    
	var retInspections = [];
	var r = aa.inspection.getInspections(settings.capId);
	if (r.getSuccess()) {
		var inspArray = r.getOutput();

		for (var i in inspArray) {
			if (
                (settings.inspType = null || String(settings.inspType).equals(inspArray[i].getInspectionType()))
                && (settings.inspResult = null || String(settings.inspResult).equals(inspArray[i].getInspectionStatus()))
                && (settings.inspId = null || settings.inspId == inspArray[i].getIdNumber())
            ) {
                retInspections.push(inspArray[i]);
			}
		}
	} 
	return retInspections;
}
