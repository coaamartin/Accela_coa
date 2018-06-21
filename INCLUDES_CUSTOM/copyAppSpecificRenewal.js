function copyAppSpecificRenewal(AInfo,newCap) // copy all App Specific info into new Cap, 1 optional parameter for ignoreArr
{
	var ignoreArr = new Array();
	var limitCopy = false;
	if (arguments.length > 2) 
	{
		ignoreArr = arguments[2];
		limitCopy = true;
	}
	
	for (asi in AInfo){
		//Check list
		if(limitCopy){
			var ignore=false;
		  	for(var i = 0; i < ignoreArr.length; i++)
		  		if(ignoreArr[i] == asi){
		  			ignore=true;
					logDebug("Skipping ASI Field: " + ignoreArr[i]);
		  			break;
		  		}
		  	if(ignore)
		  		continue;
		}
		//logDebug("Copying ASI Field: " + asi);
		editAppSpecific(asi,AInfo[asi],newCap);
	}
}