function addStdConditionwithComment(cType, cDesc, cComment) // optional cap ID
{
	var itemCap = capId;
	if (arguments.length == 4)
	{
		itemCap = arguments[3]; // use cap ID specified in args
	}
	if (!aa.capCondition.getStandardConditions)
	{
		logDebug("addStdCondition function is not available in this version of Accela Automation.");
	}
	else
	{
		standardConditions = aa.capCondition.getStandardConditions(cType, cDesc).getOutput();
		for (i = 0; i < standardConditions.length; i++)
		{
			standardCondition = standardConditions[i];
			var addCapCondResult = aa.capCondition.addCapCondition(itemCap, standardCondition.getConditionType(), standardCondition.getConditionDesc(), 
				cComment, sysDate, null, sysDate, null, null, standardCondition.getImpactCode(), systemUserObj, systemUserObj, "Applied", currentUserID, "A", 
				null, standardCondition.getDisplayConditionNotice(), standardCondition.getIncludeInConditionName(), standardCondition.getIncludeInShortDescription(), 
				standardCondition.getInheritable(), standardCondition.getLongDescripton(), standardCondition.getPublicDisplayMessage(), 
				standardCondition.getResolutionAction(), null, null, standardCondition.getConditionNbr(), standardCondition.getConditionGroup(), 
				standardCondition.getDisplayNoticeOnACA(), standardCondition.getDisplayNoticeOnACAFee(), standardCondition.getPriority(), 
				standardCondition.getConditionOfApproval());
			if (addCapCondResult.getSuccess())
			{
				//debugObject(addCapCondResult);
				logDebug("Successfully added condition (" + standardCondition.getConditionDesc() + ")");
			}
			else
			{
				logDebug("**ERROR: adding condition (" + standardCondition.getConditionDesc() + "): " + addCapCondResult.getErrorMessage());
			}
		}
	}
}