logDebug ("script22 () started");

var docCategory = checkIfDocUploaded("Outside Agency");
//logDebug("Doc Category " + docCategory);
if( publicUser && (capStatus=="Waiting  on Documents" || capStatus=="Waiting on Documents" || capStatus=="Upload Signature Set" ) && docCategory == "Outside Agency") 
 {  
	activateTask("Completeness Check");
	editTaskDueDate("Completeness Check",dateAdd(null, 0));
	updateAppStatus("Submitted",null);
}
logDebug ("script22 () end")
