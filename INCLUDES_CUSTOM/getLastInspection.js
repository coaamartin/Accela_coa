/*
* GETS LAST INSPECTION

    OPTIONS: ADDITIONAL OPTIONS YOU NEED FOR FILTERING (CURRENTLY FILTERS BY inspType & inspResult)
*/
function getLastInspection(options) {
    var settings = {
        capId: capId,
        inspType: null, // if not null, will filter by given inspection type
        inspResult: null // if not null, will filter by given inspection result
    };
    for (var attr in options) { settings[attr] = options[attr]; } //optional params - overriding default settings

    
	var ret = null;
	var r = aa.inspection.getInspections(settings.capId);
	if (r.getSuccess()) {
		var maxId = -1;
		var maxInsp = null;
		var inspArray = r.getOutput();

		for (i in inspArray) {
			if (
                (settings.inspType == null || String(settings.inspType).equals(inspArray[i].getInspectionType()))
                && (settings.inspResult == null || String(settings.inspResult).equals(inspArray[i].getInspectionStatus()))
            ) {
				var id = inspArray[i].getIdNumber();
				if (id > maxId) {
					maxId = id;
					maxInsp = inspArray[i];
				}
			}
		}
		if (maxId >= 0) {
			ret = maxInsp;
		}
	} 
	return ret;
}
