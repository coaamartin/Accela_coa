if ("Accepted In House".equals(wfTask) && "Routed for Review".equals(wfStatus))
{
  tasksArray = ["Structural Plan Review", "Electrical Plan Review", "Mechanical Plan Review", 
  "Plumbing Plan Review", "Bldg Life Safety Review", "Fire Life Safety Review", "Structural Engineering Review", "Real Property Review", "Planning Review", 
  "Water Review", "Zoning Review", "Engineering Review", "Traffic Review", "Waste Water Review", "Forestry Review"];
    
    for(i in tasksArray){
      editTaskDueDate(tasksArray[i], dateAdd(null, 7, "Y"));
    }
}