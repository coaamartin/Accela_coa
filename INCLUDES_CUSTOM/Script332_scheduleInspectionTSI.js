function Script332_scheduleInspectionTSI()  {
    var today = aa.util.parseDate(dateAdd(null, 0));
    var tsiArray = new Array();
            
    loadTaskSpecific(tsiArray);
    var pPreHearingDate = tsiArray["Pre hearing inspection date"];
	var preHearingDateMinus1 = getPrevWorkingDays(new Date(pPreHearingDate), 1);
    var inspectorID = getInspectorID();
    var noOfDays = days_between(today, preHearingDateMinus1);
                
    if (pPreHearingDate != null )
        scheduleInspection("Pre Court Investigation", noOfDays, inspectorID, null, workDescGet(capId));
}