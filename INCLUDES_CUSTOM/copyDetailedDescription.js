function copyDetailedDescription(srcCapId, targetCapId)
{
	newWorkDes = workDescGet(srcCapId);
	if (newWorkDes != null && newWorkDes != "")
		updateWorkDesc(newWorkDes, targetCapId);
}