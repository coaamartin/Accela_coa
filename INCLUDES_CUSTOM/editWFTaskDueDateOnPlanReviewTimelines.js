function editWFTaskDueDateOnPlanReviewTimelines() {
	//Set workflow due date based on plan review timelines
	if (wfTask == "Quality Check" && wfStatus == "Route for Review") {
		useAppSpecificGroupName = false;
		var submittalNum = getAppSpecific("Submittal Number", capId);
		var cps = AInfo["Civil Plan Sheets"];
		var ps = AInfo["Plan Sheets"];
		if (typeof(submittalNum) != "undefined" && submittalNum != null && submittalNum != "" && (cps != null && cps != "") || (ps != null && ps != "")) {

			var stdTimeline = findCivilConstructionPlanReviewTimeline(parseInt(submittalNum), (cps != null && cps != "") ? parseInt(cps) : parseInt(ps));
			// update each wfTask with name contains review
			logDebug("findCivilConstructionPlanReviewTimeline returned " + stdTimeline);
			if (!stdTimeline) {
				stdTimeline = 0; //if no value returned from std then use default 0
			}
			editWFTaskDueDatebyName("review", stdTimeline);
		}
	}
}

function findCivilConstructionPlanReviewTimeline(num, sheets) {
	logDebug("findCivilConstructionPlanReviewTimeline(" + num + "," + sheets + ")");
	var timeLineSC = "Civil Construction Plan Review Timelines";
	var bizDomScriptResult = aa.bizDomain.getBizDomain(timeLineSC);

	if (bizDomScriptResult.getSuccess()) {
		bizDomScriptArray = bizDomScriptResult.getOutput().toArray()
			for (var i in bizDomScriptArray) {
				var thisNum = bizDomScriptArray[i].getBizdomainValue().split(",")[0];
				if (num != thisNum) {
					continue;
				}
				var rangeLow = bizDomScriptArray[i].getBizdomainValue().split(",")[1].split("-")[0];
				var rangeHigh = bizDomScriptArray[i].getBizdomainValue().split(",")[1].split("-")[1];

				if (sheets >= rangeLow && sheets <= rangeHigh) {
					return parseInt(bizDomScriptArray[i].getDescription());
				}
			}
	}
}
