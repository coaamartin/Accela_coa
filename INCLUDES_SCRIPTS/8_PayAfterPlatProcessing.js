var taskCheck = "Application Acceptance";
var statusCheck = "Ready to Pay";

if(!hasBalance() && isTaskActive(taskCheck) && isTaskStatus(taskCheck, statusCheck)){
    var statusNew = "Accepted";
    var taskNext = "Review Distribution";
    var userId = "DAKRIE";

    closeTask(taskCheck, statusNew, "EMSE ID 8", "EMSE ID 8")
    activateTask(taskNext, "EMSE ID 8", "EMSE ID 8");  
    assignTask(taskNext, userId)
    var today = new Date();
    thatDate = addWorkDays(today, 5);
    editTaskDueDate(taskNext, jsDateToMMDDYYYY(thatDate));
}

function hasBalance(){
  var hasBal = true; 
  var capDetailObjResult = aa.cap.getCapDetail(capId);
  if (capDetailObjResult.getSuccess()) {
    capDetail = capDetailObjResult.getOutput();
    var balanceDue = capDetail.getBalance();
    if(!balanceDue > 0){
      hasBal = false; 
    }
  }
  return hasBal;
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