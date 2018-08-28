function scheduleInspectionWithCapIdBusinessDays(iType,DaysAhead) // optional inspector ID.  This function requires dateAddHC function
{
    // DQ - Added Optional 4th parameter inspTime Valid format is HH12:MIAM or AM (SR5110) 
    // DQ - Added Optional 5th parameter inspComm ex. to call without specifying other options params scheduleInspection("Type",5,null,null,"Schedule Comment");
    var inspectorObj = null;
    var inspTime = null;
    var inspComm = "Scheduled via Script";
    if (arguments.length >= 3) 
        if (arguments[2] != null){
            var inspRes = aa.person.getUser(arguments[2])
            if (inspRes.getSuccess())
                var inspectorObj = inspRes.getOutput();
        }
    
    if (arguments.length >= 4)
        if (arguments[3] != null)
                        inspTime = arguments[3];
    
    if (arguments.length == 5)
        if (arguments[4] != null)
            inspComm = arguments[4];
    
    if (arguments.length == 6)
        if (arguments[5] != null)
            vCapId = arguments[5];
                                    
    var schedRes = aa.inspection.scheduleInspection(vCapId, inspectorObj, aa.date.parseDate(dateAddHC(null,DaysAhead)), inspTime, iType, inspComm)
    
    if (schedRes.getSuccess())
        logDebug("Successfully scheduled inspection : " + iType + " for " + dateAddHC(null,DaysAhead));
    else
        logDebug( "**ERROR: adding scheduling inspection (" + iType + "): " + schedRes.getErrorMessage());
}
