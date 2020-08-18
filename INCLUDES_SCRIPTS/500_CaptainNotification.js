if ("Station Captain Review".equals(wfTask) && "Denied".equals(wfStatus)){
    var inspector = getInspector("Fire Preplan");
    scheduleInspection("Fire Preplan",0,inspector, 0, "Scheduled due to previous task: " + wfTask + " status of: "+wfStatus);
}

if ("Battalion Chief Review".equals(wfTask) && "Denied".equals(wfStatus))
{
    var inspector = getInspector("Fire Preplan");
    scheduleInspection("Fire Preplan",0,inspector, 0, "Scheduled due to previous task: " + wfTask + " status of: "+wfStatus);
    var taskHistoryArray = getTaskHistory("Station Review");
    var approvalUser = null;
    for (var x in taskHistoryArray)
    {
        var thisTask = taskHistoryArray[x];
        var thisStatus = thisTask.getDisposition();
        var thisStatusUser = thisTask.getTaskItem().getAuditID();
        if ("Approved".equals(thisStatus))
        {
            approvalUser = thisStatusUser;
            break;
        }
    }
    if (approvalUser)
    {
        approvalUserObj = aa.person.getUser(approvalUser).getOutput();
        approvalUserEmail = approvalUserObj.getEmail();
        if (approvalUserEmail && approvalUserEmail.length() > 0)
        {
            var template = "STATION_CAPTAIN_NOTIFICATION";
            var eparams = aa.util.newHashtable();
            eparams.put("$$capid$$", capId.getCustomID() + "");
            if (wfComment)
                eparams.put("$$comments$$", wfComment);
            sendNotification("", approvalUserEmail, "", template, eparams, null);
        }
    }
}

function getTaskHistory(tName)
{
    try
    {
        var itemCap = capId;
        var result = new Array();
        if (arguments.length > 1)
            itemCap = arguments[1];
                
        var wfHist = aa.workflow.getWorkflowHistory(itemCap, tName, null);
        if (wfHist.getSuccess())
        {
            wfHist = wfHist.getOutput();            
            return wfHist;
        }
        else
        {
            logDebug("Problem in " + arguments.callee.name + ": " + wfHist.getErrorMessage());
        }
        return result;
    }
    catch(e)
    {
        logDebug("Problem in function " + arguments.callee.name + " on line " + e.lineNumber + ": " + e.message);
    }

}