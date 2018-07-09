// Deactivate task 'Certificate of Occupancy' if custom field, 'Certificate of Occupancy' is not checked
// Also, deativate it if Water Meter task is active
function deactCoOIfNotChecked(){
	var tmpUASGN = useAppSpecificGroupName;
    useAppSpecificGroupName=false;
    var cOO=getAppSpecific("Certificate of Occupancy",capId);
    useAppSpecificGroupName = tmpUASGN;
    if (cOO!="CHECKED" || isTaskActive("Water Meter")){
    	deactivateTask("Certificate of Occupancy");
    }
}