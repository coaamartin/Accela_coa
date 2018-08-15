function getCapByAddressN(ats,capId,sOfRequest){
	try{
		var ret=null
		// get address data
		var addResult = aa.address.getAddressByCapId(capId);
		if (addResult.getSuccess()){ 
			var aoArray = addResult.getOutput();  
		}else{ 
			logDebug("**ERROR: getting address by cap ID: " + addResult.getErrorMessage());
			return false; 
			}
		
		if (aoArray.length)	{ 
			var ao = aoArray[0];
			}else{ 
				logDebug("**WARNING: no address for comparison:");
				return false; 
			}
		// get caps with same address
		var capAddResult = aa.cap.getCapListByDetailAddress(ao.getStreetName(),ao.getHouseNumberStart(),ao.getStreetSuffix(),ao.getZip(),ao.getStreetDirection(),null);
		if (capAddResult.getSuccess()){
			var capIdArray=capAddResult.getOutput(); 
		 	}
		else{
			logDebug("**ERROR: getting similar addresses: " + capAddResult.getErrorMessage());
				return false; 
			}
		// loop through related caps
		for (cappy in capIdArray){
			if(cappy = capId) {
				continue;	//make sure its not the same record.
			}

			var relcap = aa.cap.getCap(capIdArray[cappy].getCapID()).getOutput();
			// get cap type
			reltype = relcap.getCapType().toString();
						
			var ata = ats.split("/");
			var reltypeN=reltype.split("/");
			if (ata[0]==reltypeN[0] && ata[1]==reltypeN[1]){
				//check status & ASI value
				if (relcap.getCapStatus().toString().equalsIgnoreCase("Wait List") || relcap.getCapStatus().toString().equalsIgnoreCase("Assigned") || relcap.getCapStatus().toString().equalsIgnoreCase("Submitted") || relcap.getCapStatus().toString().equalsIgnoreCase("Working")){
					useAppSpecificGroupName=false;
					var sourceOfReq=getAppSpecific("Source of Request",capIdArray[cappy].getCapID());
					if (typeof(sourceOfReq)!="undefined" && sourceOfReq!=null && sourceOfReq!="" && sourceOfReq.equals(sOfRequest)){
						ret=capIdArray[cappy];
						break;
					}
				}
				
				
			}
			
		}
		
		
		return ret;
		
		}catch(err){
			logDebug("****ERROR IN BATCH_ARBORIST_LICENSE_NO_RENEWAL_SUSPEND_LICENSE:**** " + err);
			return false;
		}
}	
