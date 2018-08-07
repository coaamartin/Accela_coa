//Script 59
//Record Types: Planning/NA/NA/NA
//Event:        WTUA
//Desc:         tbd  
//
//Created By: Silver Lining Solutions

function script59_PlanningCloseCaseComplete(){
    logDebug("script59_PlanningCloseCaseComplete() started.");
    if(ifTracer(wfTask == 'Case Complete' && matches(wfStatus, 'Closed', 'Complete'), 'wf: Case Complete/Closed OR Case Complete/Complete'))
        if(wfProcess) deactivateActiveTasks(wfProcess);
    logDebug("script59_PlanningCloseCaseComplete() ended.");
};//END script59_PlanningCloseCaseComplete();