
/**
 * Activate workflow tasks based on the Status of other Tasks
 * @returns {Boolean}
 */
function activateWorkflowTasks() {
    logDebug("activateWorkflowTasks() started");
    var $iTrc = ifTracer;
    var reviewTasksAry = [ "Structural Plan Review", "Electrical Plan Review", "Mechanical Plan Review", "Plumbing Plan Review", "Bldg Life Safety Review", "Fire Life Safety Review",
            "Structural Engineering Review" ];

    var activeReviewTasksAry = [ "Real Property Review", "Water Review", "Zoning Review", "Traffic Review", "Forestry Review" ];

    var wfTasks = aa.workflow.getTaskItems(capId, null, null, null, null, null);
    if (!wfTasks.getSuccess()) {
        logDebug("WARNING: Unable to get tasks.");
        return false;
    }
    wfTasks = wfTasks.getOutput();

    var allMatched = true;

    for (r in reviewTasksAry) {
        for (w in wfTasks) {
            var task = wfTasks[w];
            if (task.getTaskDescription() != reviewTasksAry[r]) {
                continue;
            }
            allMatched = allMatched && (task.getDisposition() == "Approved" || task.getDisposition() == "Not Required");
            break;
        }//for all cap tasks

        if (!allMatched) {
            break;
        }
    }//for reviewTasksAry

    //Check if taskStatus of Quality Check is not Approved, if it is then no need to activate it again.
    //If the current task being activated is Quality Check, then no need check if needs to be activated.
    if($iTrc(wfTask != "Quality Check", 'wfTask != "Quality Check"'))
        if ($iTrc(allMatched && !taskStatus("Quality Check", "Approved"), 'allTasks && Quality Check not resulted as Approved')) {
            activateTask("Quality Check");
        }

    allMatched = true;
    for (r in activeReviewTasksAry) {
        for (w in wfTasks) {
            var task = wfTasks[w];
            if (task.getTaskDescription() != activeReviewTasksAry[r]) {
                continue;
            }
            allMatched = allMatched && (task.getDisposition() == "Approved" || task.getDisposition() == "Not Required");
            break;
        }//for all cap tasks

        if (!allMatched) {
            break;
        }
    }//for reviewTasksAry

    var engineeringReviewMatched = true;
    var wasteWaterReviewMatched = true;
    var qualityCheckMatched = true;

    if (allMatched) {
        //stage 2, check other tasks:
        for (w in wfTasks) {
            var task = wfTasks[w];
            if (task.getTaskDescription() == "Engineering Review") {
                engineeringReviewMatched = engineeringReviewMatched
                        && (task.getDisposition() == "Approved" || task.getDisposition() == "Approved with FEMA Cert Required" || task.getDisposition() == "Not Required");
            }

            if (task.getTaskDescription() == "Waste Water Review") {
                wasteWaterReviewMatched = wasteWaterReviewMatched
                        && (task.getDisposition() == "Approved" || task.getDisposition() == "Approved Inspection Required" || task.getDisposition() == "Not Required");
            }

            if (task.getTaskDescription() == "Quality Check") {
                qualityCheckMatched = qualityCheckMatched && task.getDisposition() == "Approved";
            }
        }//for all cap tasks

        if($iTrc(wfTask != "Fee Processing", 'wfTask != "Fee Processing"'))
            if ($iTrc(engineeringReviewMatched && wasteWaterReviewMatched && qualityCheckMatched && !isTaskComplete("Fee Processing"), 'engineeringReviewMatched && wasteWaterReviewMatched && qualityCheckMatched && !isTaskComplete("Fee Processing")')) {
                activateTask("Fee Processing");
            }

    }//allMatched

    logDebug("activateWorkflowTasks() ended");
    return true;
}