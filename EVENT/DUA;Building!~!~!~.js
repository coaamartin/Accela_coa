/*------------------------------------------------------------------------------------------------------/
| Program		: DUA:BUILDING.js
| Event			: 
|
| Usage			: 
| Notes			: 
| Created by	: ISRAA
| Created at	: 25/01/2018 13:26:53
|
/------------------------------------------------------------------------------------------------------*/
if (capStatus=="Waiting on Documents"){
	// Check if Active WF Task is Accept Plans or  Accepted In House
	// then Update WF Task Due Date to : the date the document is uploaded plus 1
	if (isTaskActive("Accept Plans")){
		editTaskDueDate("Accept Plans",dateAdd(null, 1));
	}else if (isTaskActive ("Accepted In House")) {
		editTaskDueDate("Accepted In House",dateAdd(null, 1));
	}
}

//Added by SWAKIL
include("49_doc_upload_corrections");