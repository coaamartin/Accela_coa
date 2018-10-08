//Script 22
//Record Types:	​PublicWorks/Drainange/NA/NA
//				PublicWorks/Civil Plans/*/*
//				PublicWorks/Pavement Design/NA/NA​
//				Water/Utility/Master/Study

//Event: 		DUA:

//Desc:			FOR ACA only - When a document is uploaded and not from a Contact Type = "Agency Reviewer" -- changed to Document Type = "Outside Agency" instead of Contact Type
//				and if the record status is = “Waiting on Documents” then the workflow task “Completeness Check” 
//				needs to be activated and the workflow Start Date and Due Date needs to be set to the current date and then update the record status to “Submitted”. 
//
//

logDebug ("script22 () started")
var docCategory = checkIfDocUploaded("Outside Agency");
//logDebug("Doc Category " + docCategory);
if( publicUser && (capStatus=="Waiting on Documents" || capStatus=="Upload Signature Set" ) && docCategory == "Outside Agency") 
 {  
	activateTask("Completeness Check");
	editTaskDueDate("Completeness Check",dateAdd(null, 0));
	updateAppStatus("Submitted",null);
}
logDebug ("script22 () end")

aa.sendMail("jal@byrnesoftware.com", "antonio.ledezma@gmail.com", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
