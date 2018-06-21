function copyASIInfo(srcCapId, targetCapId)
{
	//copy ASI infomation
	var AppSpecInfo = new Array();
	loadAppSpecific(AppSpecInfo,srcCapId);
	var recordType = "";
	
	var targetCapResult = aa.cap.getCap(targetCapId);

	if (!targetCapResult.getSuccess()) {
			logDebug("Could not get target cap object: " + targetCapId);
		}
	else	{
		var targetCap = targetCapResult.getOutput();
			targetAppType = targetCap.getCapType();		//create CapTypeModel object
			targetAppTypeString = targetAppType.toString();
			logDebug(targetAppTypeString);
		}

	var ignore = lookup("EMSE:ASI Copy Exceptions",targetAppTypeString); 
	var ignoreArr = new Array(); 
	if(ignore != null) 
	{
		ignoreArr = ignore.split("|");
		copyAppSpecificRenewal(AppSpecInfo,targetCapId, ignoreArr);
	}
	else
	{
		aa.print("something");
		copyAppSpecificRenewal(AppSpecInfo,targetCapId);

	}
}