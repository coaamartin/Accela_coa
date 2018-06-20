//Script 22
//Record Types:	​PublicWorks/Drainange/NA/NA
//				PublicWorks/CivilPublicWorks/Civil Plans/*/*
//				PublicWorks/Pavement Design/NA/NA​
//				Water/Utility/Master/Study

//Event: 		DUA:

//Desc:			FOR ACA only - When a document is uploaded and not from a Contact Type = "Agency Reviewer" 
//				and if the record status is = “Waiting on Documents” then the workflow task “Completeness Check” 
//				needs to be activated and the workflow Start Date and Due Date needs to be set to the current date and then update the record status to “Submitted”. 
//
//             
//
//Created By: Silver Lining Solutions

logDebug ("script22 START");

// if(isPublicUser && capStatus=="Waiting on Documents")
if(capStatus=="Waiting on Documents")
{
    logDebug("Script 22: criteria successfully met");
    activateTask("Completeness Check");
    editTaskDueDate("Completeness Check");
    
}
logDebug ("script22 END");

