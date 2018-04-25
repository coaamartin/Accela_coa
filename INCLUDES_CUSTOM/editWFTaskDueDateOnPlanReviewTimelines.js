function editWFTaskDueDateOnPlanReviewTimelines(){
//Set workflow due date based on plan review timelines
if(wfTask=="Quality Check" && wfStatus=="Route for Review"){
		useAppSpecificGroupName=false;
		var submittalNum=getAppSpecific("Submittal Number",capId);
		if (typeof(submittalNum)!="undefined" && submittalNum!=null && submittalNum!=""){
			var stdTimeline=stdTimeline=lookup("Civil Construction Plan Review Timelines",submittalNum);
			// update each wfTask with name contains review
			if (stdTimeline==null || stdTimeline=="") stdTimeline=0; //if no value returned from std then use default 0
			editWFTaskDueDatebyName("review",stdTimeline);
		}
		
}
}