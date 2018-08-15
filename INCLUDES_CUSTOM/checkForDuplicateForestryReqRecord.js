function checkForDuplicateForestryReqRecord(){
try{
	if(!publicUser){ //if CTRCA ,use publicUser
		var appType="Forestry/Request/*/*";
		useAppSpecificGroupName=false;
		var sOfReq=getAppSpecific("Source of Request",capId);
		var sameAddressCapId=getCapByAddressN(appType,capId,sOfReq);
		if (sameAddressCapId==false){//no matching record with the same address
			// check parcel matching
			var sameParcelCapId=getCapByParcel(appType,capId,sOfReq);
			if (sameParcelCapId!=false && sameParcelCapId!=null){
				  var detailedDesc=workDescGet(capId);
				  updateWorkDesc(String(detailedDesc) + "-Possible duplicate of record " + sameParcelCapId.getCustomID() ,capId);    
			}
		}else if(sameAddressCapId!=null){
			 // get the detail description and append the record id to it
			  var detailedDesc= workDescGet(capId) != null ? workDescGet(capId) : '';
			  updateWorkDesc(String(detailedDesc) + "-Possible duplicate of record " + sameAddressCapId.getCustomID() ,capId);    
		}
		
	}
}catch(e){
	logDebug("****ERROR IN ASA:FORESTRY/REQUEST/*/*:**** "+ e);
}
}
