function scheduleInspectionWithCapIdBusinessDaysDept(iType,DaysAhead) // optional inspector ID.  This function requires dateAddHC2 function. Can take dept if no user
{
    var inspectorObj = null;
    var inspTime = null;
    var inspComm = "Scheduled via Script";
    var vCapId = capId;
    if (arguments.length >= 3)
        if (arguments[2] != null){
            var inspRes = aa.person.getUser(arguments[2])
            if (inspRes.getSuccess())
                var inspectorObj = inspRes.getOutput();
        }

    if (arguments.length >= 4)
        if (arguments[3] != null)
            inspTime = arguments[3];

    if (arguments.length >= 5)
        if (arguments[4] != null)
            inspComm = arguments[4];

    if (arguments.length >= 6)
        if (arguments[5] != null)
            vCapId = arguments[5];
        
    if (arguments.length == 7)
        if (arguments[6] != null)
            dept = arguments[6];

    var schedRes = aa.inspection.scheduleInspection(vCapId, inspectorObj, aa.date.parseDate(dateAddHC2(null,DaysAhead)), inspTime, iType, inspComm)

    var inspId = schedRes.getOutput();
    var inspObj = aa.inspection.getInspection(vCapId, inspId).getOutput();
    var inspModelObj = inspObj.getInspection();
    var inspModelActivityObj = inspModelObj.getActivity();
    
    if (inspModelActivityObj.getSysUser() == null || inspModelActivityObj.getSysUser() == "") {
        var deptArray = dept.split("/");
        if (deptArray.length < 6)
            return;
        var inspRes = aa.person.getUser("", "", "", "", "", "", "", "", "", "", "").getOutput();
        inspRes.setServiceProviderCode("AURORACO");
        inspRes.setAgencyCode(deptArray[0]);
        inspRes.setBureauCode(deptArray[1]);
        inspRes.setDivisionCode(deptArray[2]);
        inspRes.setSectionCode(deptArray[3]);
        inspRes.setGroupCode(deptArray[4]);
        inspRes.setOfficeCode(deptArray[5]);

        inspModelActivityObj.setSysUser(inspRes);
        inspModelObj.setActivity(inspModelActivityObj);
        aa.inspection.editInspection(inspObj);
        logDebug("Insp Updated with dept "+ dept);
    }

    if (schedRes.getSuccess())
        logDebug("Successfully scheduled inspection : " + iType + " for " + dateAddHC(null,DaysAhead));
    else
        logDebug( "**ERROR: adding scheduling inspection (" + iType + "): " + schedRes.getErrorMessage());
}