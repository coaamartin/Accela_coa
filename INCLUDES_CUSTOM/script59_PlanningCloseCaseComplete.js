//Script 59
//Record Types: Planning/NA/NA/NA
//Event:        WTUA
//Desc:         tbd  
//
//Created By: Silver Lining Solutions

function script59_PlanningCloseCaseComplete(){
    logDebug("script59_PlanningCloseCaseComplete() started.");
    if(ifTracer(wfTask == 'Case Complete' && wfStatus == 'Closed', 'wf: Case Complete/Closed'))
        if(wfProcess) deactivateActiveTasks(wfProcess);
    logDebug("script59_PlanningCloseCaseComplete() ended.");
};//END script59_PlanningCloseCaseComplete();