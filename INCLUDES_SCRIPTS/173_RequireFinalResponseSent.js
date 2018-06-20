script173_RequireFinalResponseSent()

function script173_RequireFinalResponseSent() {
    var errMsg = '',
        finalRespReq=getAppSpecific("Final Response Required", capId),
        tasks = aa.workflow.getHistory(capId).getOutput();

    if (finalRespReq=="CHECKED"){
        for (var t in tasks) {
            var task = tasks[t];
            if (task.getTaskDescription() == 'Final Response Required' ||  task.getTaskDescription() == 'Final Request Sent') {
                printObjProps(task);  
           //     actionBy = task.getTaskItem().getSysUser();
           //     aa.print(actionBy);
            //    var userObj = aa.person.getUser(actionBy.firstName,null,actionBy.lastName).getOutput();
           //     assignTask("Generate Work Order",userObj.getUserID());
            }
        }
    }


}