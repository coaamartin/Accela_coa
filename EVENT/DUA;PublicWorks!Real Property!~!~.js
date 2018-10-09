
logDebug ("script22 () started");
var notOutsideReview = checkDocNotOfType("Outside Agency");
if( publicUser && (capStatus=="Waiting  on Documents" || capStatus=="Waiting on Documents" || capStatus=="Upload Signature Set" ) && notOutsideReview) 
 {  
	activateTask("Completeness Check");
	editTaskDueDate("Completeness Check",dateAdd(null, 0));
	updateAppStatus("Submitted",null);
}
logDebug ("script22 () end")