/*Event   DocumentUploadAfter   
Added by SWAKIL
*/
documentModelArray = aa.env.getValue("DocumentModelList");
documentModelArray = documentModelArray.toArray();

for (var d in documentModelArray)
{
	var thisDoc = documentModelArray[d];
	var addDays = lookup("PLAN_REVIEW_CORRECTION", "ADD_DAYS");
	var wfdate = dateAdd(null, addDays);
	switch(thisDoc.getDocCategory() + "") 
	{
	    case "Electrical Plans":
	        editTaskDueDate("Electrical Plan Review", wfdate);
	        break;
	    case "Mechanical Plans":
	        editTaskDueDate("Mechanical Plan Review", wfdate);
	        break;
	    case "Plumbing Plans":
	        editTaskDueDate("Plumbing Plan Review", wfdate);
	        break;
	    case "Structural Plans":
	        editTaskDueDate("Structural Plan Review", wfdate);
	        editTaskDueDate("Structural Engineering Review", wfdate);
	        break;
	    case "Fire/Life Safety Plans":
	        editTaskDueDate("Bldg Life Safety Review", wfdate);
	        editTaskDueDate("Fire Life Safety Review", wfdate);
	        break;	
	    case "Building Plans":
	        editTaskDueDate("Electrical Plan Review", wfdate);
	        editTaskDueDate("Mechanical Plan Review", wfdate);
	        editTaskDueDate("Plumbing Plan Review", wfdate);
	        editTaskDueDate("Structural Plan Review", wfdate);
	        editTaskDueDate("Structural Engineering Review", wfdate);
	        editTaskDueDate("Bldg Life Safety Review", wfdate);
	        editTaskDueDate("Fire Life Safety Review", wfdate);
	        break;
	    case "Foundation and Soils Report":
	        editTaskDueDate("Structural Plan Review", wfdate);
	        break;	
	    case "Sign Plans":
	        editTaskDueDate("Zoning Review", wfdate);
	        break;	
	    case "Plot Plans":
	        editTaskDueDate("Engineereing Review", wfdate);
	        editTaskDueDate("Real Property Review", wfdate);
	        editTaskDueDate("Water Review", wfdate);
	        editTaskDueDate("Zoning Review", wfdate);
	        editTaskDueDate("Traffic Review", wfdate);
	        editTaskDueDate("Waste Water Review", wfdate);
	        editTaskDueDate("Forestry Review", wfdate);
	        break;	  
	    case "Traffic Control":
	        editTaskDueDate("Traffic Review", wfdate);
	        break;		              	        	        
	    default:
	        break;
	}
}
