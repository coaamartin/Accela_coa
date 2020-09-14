if (appMatch("Fire/Preplan/NA/NA") && "ApplicationSubmitAfter".equals(vEventName))
{
    scheduleInspect(capId, "Fire Preplan", 0);
}
else if (appMatch("Fire/Preplan/NA/NA") && "WorkflowTaskUpdateAfter".equals(vEventName) && "Denied".equals(wfStatus))
{
    scheduleInspect(capId, "Fire Preplan", 0);
}