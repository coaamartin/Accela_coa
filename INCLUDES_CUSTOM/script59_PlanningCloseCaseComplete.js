//Script 59
//Record Types:	Planning/NA/NA/NA
//Event: 		WTUA
//Desc:			tbd  
//
//Created By: Silver Lining Solutions

function script59_PlanningCloseCaseComplete(){
	aa.print("script59_PlanningCloseCaseComplete() started.");

		aa.print("script59: wf task is: "+wfTask);
		aa.print("script59: wf status is: "+wfStatus);
	
		if  (wfTask == 'Case Complete' && wfStatus == 'Closed'){
			closeTask('Case Complete');
			aa.print(wfStatus+ " is now closed");			
		}
	aa.print("script59_PlanningCloseCaseComplete() ended.");
};//END script59_PlanningCloseCaseComplete();