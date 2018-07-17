function scheduleInspectionCustom4CapId(itemCap, iType,DaysAhead) // optional inspector ID.  This function requires dateAdd function
    {
    // DQ - Added Optional 5th parameter inspTime Valid format is HH12:MIAM or AM (SR5110) 
    // DQ - Added Optional 6th parameter inspComm ex. to call without specifying other options params scheduleInspection("Type",5,null,null,"Schedule Comment");
    var inspectorObj = null;
    var inspTime = null;
    var inspComm = "Scheduled via Script";
    if (arguments.length >= 4) 
        if (arguments[3] != null)
        {
        var inspRes = aa.person.getUser(arguments[2])
        if (inspRes.getSuccess())
            var inspectorObj = inspRes.getOutput();
        }

    if (arguments.length >= 5)
        if (arguments[4] != null)
            inspTime = arguments[4];
    
    if (arguments.length == 6)
        if (arguments[5] != null)
            inspComm = arguments[5];

    var schedRes = aa.inspection.scheduleInspection(itemCap, inspectorObj, aa.date.parseDate(dateAdd(null,DaysAhead)), inspTime, iType, inspComm)
    
    if (schedRes.getSuccess()){
        logDebug("Successfully scheduled inspection : " + iType + " for " + dateAdd(null,DaysAhead));
        return schedRes.getOutput();
    }
    else
        logDebug( "**ERROR: adding scheduling inspection (" + iType + "): " + schedRes.getErrorMessage());
    
    return null;
}