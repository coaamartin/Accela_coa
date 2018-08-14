//Script 271	Assignments due when site plan is due
//Record Types:	​PublicWorks\Traffic\Traffic Impact\NA​​
//Event: 		WTUA
//Desc:			IF wfTask = "Application Submittal" and wfStatus = "Accepted" 
//				THEN set due date of wfTasks 
//					"Completeness Review", 
//					"Traffic Study Manager Review", 
//					"Traffic Study Supervisor Review" and 
//					"Traffic Study Staff Review" parallel tasks 
//				need to have the same due date as the parent site plan.
//
//Created By: Silver Lining Solutions

function script271_AssignmentsDueWhenSitePlanIsDue() {
	aa.print("script271_AssignmentsDueWhenSitePlanIsDue started.");
	try{
		if ( wfTask == "Application Submittal" && wfStatus == "Accepted" ) {
			var thisParentCap = getParent();
			if (thisParentCap) {
				aa.print("script271: parent found! Parent custom ID is:"+thisParentCap.getCustomID());
				var thisParentCapModel = aa.cap.getCap(thisParentCap).getOutput();;
				if (thisParentCapModel == null) {
					aa.print("script271: **WARNING get parent capModel is null.  Nothing to update");
				} else {
					var workflowResult = aa.workflow.getTasks(thisParentCap);
					var vThisWorkflow = aa.workflow.getTasks(capId);
					if (workflowResult.getSuccess()) {
						var wfObj = workflowResult.getOutput();
					} else { 
						aa.print("script271:  **ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage()); 
						return; 
					}
					
					if (vThisWorkflow.getSuccess()) {
						var vThisWorkflowObj = vThisWorkflow.getOutput();
					} else {
						aa.print("script271:  **ERROR: Failed to get this workflow object: " + s_capResult.getErrorMessage()); 
						return; 
					}
					
					for (i in wfObj)
					{
						var fTask = wfObj[i];
						if (fTask.getTaskDescription().toUpperCase() == "TRAFFIC REVIEW" ){
							var thisAADueDate = fTask.getDueDate();
							var thisDueDateMonth = "00"+thisAADueDate.month;
							thisDueDateMonth = thisDueDateMonth.substr(thisDueDateMonth.length-2);
							var thisDueDateDay = "00"+thisAADueDate.dayOfMonth;
							thisDueDateDay = thisDueDateDay.substr(thisDueDateDay.length-2);
							var thisDueDateYear = "00"+thisAADueDate.year;
							thisDueDateYear = thisDueDateYear.substr(thisDueDateYear.length-4);
							/*var thisDueDateHour = "00"+thisAADueDate.hourOfDay;
							thisDueDateHour = thisDueDateHour.substr(thisDueDateHour.length-2);
							var thisDueDateMinute = "00"+thisAADueDate.minute;
							thisDueDateMinute = thisDueDateMinute.substr(thisDueDateMinute.length-2);
							var thisDueDateSecond = "00"+thisAADueDate.second;
							thisDueDateSecond = thisDueDateSecond.substr(thisDueDateSecond.length-2);
							*/
							var thisDueDate =	thisDueDateMonth+"/"+
												thisDueDateDay+"/"+
												thisDueDateYear;
							//					thisDueDateYear+" "+
							//					thisDueDateHour+":"+
							//					thisDueDateMinute+":"+
							//					thisDueDateSecond;
							aa.print("script271: Setting WF DUE DATE to:"+thisDueDate);
							
							for (i in vThisWorkflowObj) {
								var vTask = vThisWorkflowObj[i];
								vTask.setDaysDue(null);								
							}
							
							editTaskDueDate("Completeness Review",thisDueDate);
							editTaskDueDate("Traffic Study Manager Review",thisDueDate);
							editTaskDueDate("Traffic Study Supervisor Review",thisDueDate);
							editTaskDueDate("Traffic Study Staff Review",thisDueDate);
						}
					}
				}
			}
			else aa.print("script271: No parent site plan found!");
		}
	}
	catch(err){
		showMessage = true;
		comment("script271: Error on custom function script271_AssignmentsDueWhenSitePlanIsDue(). Please contact administrator. Err: " + err);
		aa.print("script271: Error on custom function script271_AssignmentsDueWhenSitePlanIsDue(). Please contact administrator. Err: " + err);
	}
	aa.print("script271_AssignmentsDueWhenSitePlanIsDue() ended.");
};//END script271_AssignmentsDueWhenSitePlanIsDue();