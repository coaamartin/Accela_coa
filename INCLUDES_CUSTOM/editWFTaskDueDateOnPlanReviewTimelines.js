function editWFTaskDueDateOnPlanReviewTimelines() {
    //Set workflow due date based on plan review timelines {
    var stdTimeline = 0;
    //var civilPlanSheets = AInfo["Civil Plan Sheets"];
    //var submittalNum = AInfo["Submittal Number"];
    //var sigPlanSheets = AInfo["Signature Plan Sheets"];
    //var verticalConst = AInfo["Vertical Construction/Short Review"];
    
    //if(civilPlanSheets) civilPlanSheets = parseInt(civilPlanSheets);
    //else civilPlanSheets = 0;
    //    
    //if(sigPlanSheets) sigPlanSheets = parseInt(sigPlanSheets);
    //else sigPlanSheets = 0;
    
    /*if(ifTracer(appMatch("PublicWorks/Civil Plan/Review/NA"), 'Civil Plan Review')){
        if(submittalNum){
            submittalNum = parseInt(submittalNum);
            if(ifTracer(submittalNum == 1, 'submittalNum == 1')){
                if(ifTracer(civilPlanSheets <= 39, 'civilPlanSheets <= 39')) stdTimeline = 15;
                if(ifTracer(civilPlanSheets >= 40 && civilPlanSheets <= 59, 'civilPlanSheets >= 40 && civilPlanSheets <= 59')) stdTimeline = 20;
                if(ifTracer(civilPlanSheets >= 60, 'civilPlanSheets >= 60')) stdTimeline = 25;
            }
            if(ifTracer(submittalNum == 2, 'submittalNum == 2')){
                if(ifTracer(civilPlanSheets <= 39, 'civilPlanSheets <= 39')) stdTimeline = 10;
                if(ifTracer(civilPlanSheets >= 40 && civilPlanSheets <= 59, 'civilPlanSheets >= 40 && civilPlanSheets <= 59')) stdTimeline = 15;
                if(ifTracer(civilPlanSheets >= 60, 'civilPlanSheets >= 60')) stdTimeline = 20;
            
            }
            if(ifTracer(submittalNum >= 3, 'submittalNum == 3')){
                if(ifTracer(sigPlanSheets <= 39, 'sigPlanSheets <= 39')) stdTimeline = 5;
                if(ifTracer(sigPlanSheets >= 40 && sigPlanSheets <= 59, 'sigPlanSheets >= 40 && sigPlanSheets <= 59')) stdTimeline = 10;
                if(ifTracer(sigPlanSheets >= 60, 'sigPlanSheets >= 60')) stdTimeline = 10;
            }
        }
    }
    if(ifTracer(appMatch("PublicWorks/Civil Plan/Revision/NA"), 'Civil Plan Revision')){
        if(submittalNum){
            submittalNum = parseInt(submittalNum);
            if(ifTracer(submittalNum == 1, 'submittalNum == 1')){
                if(ifTracer(civilPlanSheets <= 39, 'civilPlanSheets <= 39')) stdTimeline = 15;
                if(ifTracer(civilPlanSheets >= 40 && civilPlanSheets <= 59, 'civilPlanSheets >= 40 && civilPlanSheets <= 59')) stdTimeline = 20;
                if(ifTracer(civilPlanSheets >= 60, 'civilPlanSheets >= 60')) stdTimeline = 25;
            }
            if(ifTracer(submittalNum == 2, 'submittalNum == 2')){
                if(ifTracer(civilPlanSheets <= 39, 'civilPlanSheets <= 39')) stdTimeline = 10;
                if(ifTracer(civilPlanSheets >= 40 && civilPlanSheets <= 59, 'civilPlanSheets >= 40 && civilPlanSheets <= 59')) stdTimeline = 15;
                if(ifTracer(civilPlanSheets >= 60, 'civilPlanSheets >= 60')) stdTimeline = 20;
            
            }
            if(ifTracer(submittalNum >= 3, 'submittalNum == 3')){
                if(ifTracer(civilPlanSheets <= 39, 'civilPlanSheets <= 39')) stdTimeline = 5;
                if(ifTracer(civilPlanSheets >= 40 && civilPlanSheets <= 59, 'civilPlanSheets >= 40 && civilPlanSheets <= 59')) stdTimeline = 10;
                if(ifTracer(civilPlanSheets >= 60, 'civilPlanSheets >= 60')) stdTimeline = 10;
            }
        }
        
        if(ifTracer(verticalConst == "Yes", 'verticalConst == "Yes"')) stdTimeline = 5;
    }
    
    if(ifTracer(appMatch("PublicWorks/Drainage/NA/NA"), 'Drainage Record')){
        if(submittalNum){
            submittalNum = parseInt(submittalNum);
            if(ifTracer(submittalNum == 1, 'submittalNum == 1')) stdTimeline = 15;
            if(ifTracer(submittalNum == 2, 'submittalNum == 2')) stdTimeline = 10;
            if(ifTracer(submittalNum >= 3, 'submittalNum == 3')) stdTimeline = 5;
        }
    }*/
    
    //if(ifTracer(stdTimeline > 0, 'stdTimeline > 0'))
    //    editWFTaskDueDatebyName("review", stdTimeline, true);
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
