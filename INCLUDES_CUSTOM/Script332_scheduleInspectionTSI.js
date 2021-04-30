function Script332_scheduleInspectionTSI() {
    if (wfTask == "Pre Hearing Inspection" && wfStatus == "Hearing Scheduled") {
        var today = aa.util.parseDate(dateAdd(null, 0));
        var tsiArray = new Array();

        loadTaskSpecific(tsiArray);
        var pPreHearingDate = tsiArray["Pre hearing inspection date"];
        var preHearingDateMinus1 = getPrevWorkingDays(new Date(pPreHearingDate), 3);
        var inspectorID = getInspectorID();
        var noOfDays = days_between(today, preHearingDateMinus1);

        if (pPreHearingDate != null)
            scheduleInspection("Pre Court Investigation", noOfDays, inspectorID, null, workDescGet(capId));
    }
    if (wfTask == "Complaint Intake" && wfStatus == "Assigned") {
        //var today = aa.util.parseDate(dateAdd(null, 0));
        var today = new Date();
        var thisDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
        //var tsiArray = new Array();

        //loadTaskSpecific(tsiArray);
        //var pPreHearingDate = tsiArray["Pre hearing inspection date"];
        //var preHearingDateMinus1 = getPrevWorkingDays(new Date(pPreHearingDate), 1);
        var inspectorID = getInspectorID();
        var noOfDays = thisDate;

        scheduleInspection("Investigation", 0, inspectorID, null, workDescGet(capId));
    }
}
