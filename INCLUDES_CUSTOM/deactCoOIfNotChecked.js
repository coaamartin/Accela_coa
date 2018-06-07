function deactCoOIfNotChecked(){
	var tmpUASGN = useAppSpecificGroupName;
    useAppSpecificGroupName=false;
    var cOO=getAppSpecific("Certificate of Occupancy",capId);
    useAppSpecificGroupName = tmpUASGN;
    if (cOO!="CHECKED"){
    	deactivateTask("Certificate of Occupancy");
    }
}