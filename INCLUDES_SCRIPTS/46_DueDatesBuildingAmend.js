if ("Accepted In House".equals(wfTask) && "Routed for Review".equals(wfStatus))
{
	var today = new Date();
	thatDate = addWorkDays(today, 7);

	tasksArray = ["Structural Plan Review", "Electrical Plan Review", "Mechanical Plan Review", 
	"Plumbing Plan Review", "Bldg Life Safety Review", "Fire Life Safety Review", "Structural Engineering Review", "Real Property Review", "Planning Review", 
	"Water Review", "Zoning Review", "Engineering Review", "Traffic Review", "Waste Water Review", "Forestry Review"];
    
    for(i in tasksArray){
      editTaskDueDate(tasksArray[i], jsDateToMMDDYYYY(thatDate));
    }
}

function addWorkDays(startDate, days) {
    if(isNaN(days)) {
        return
    }
    if(!(startDate instanceof Date)) {
        return
    }
    var dow = startDate.getDay();
    var daysToAdd = parseInt(days);
    if (dow == 0)
        daysToAdd++;
    if (dow + daysToAdd >= 6) {
        var remainingWorkDays = daysToAdd - (5 - dow);
        daysToAdd += 2;
        if (remainingWorkDays > 5) {
            daysToAdd += 2 * Math.floor(remainingWorkDays / 5);
            if (remainingWorkDays % 5 == 0)
                daysToAdd -= 2;
        }
    }
    startDate.setDate(startDate.getDate() + daysToAdd);
    return startDate;
}