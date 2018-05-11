function createTempWaterChild(emailTemplate) {
    if (wfTask == "Plans Coordination" && wfStatus == "Approved") {
        var waterReviewTask = aa.workflow.getTask(capId, "Water Review").getOutput();
        var processID = waterReviewTask.getProcessID();
        var stepNumber = waterReviewTask.getStepNumber();

        var waterMainUtilityPermitTsiVal;
        var sanitarySewerUtilityPermitTsiVal;
        var publicStormSewerUtilityPermitTsiVal;
        var privateStormSewerUtilityPermitTsiVal;
        var stormWaterUtilityPermitRequiredTsiVal;
        var privateFireLineUtilityPermitTsiVal;

        // Get the "Water Review" TSI's
        var valDef = aa.taskSpecificInfo.getTaskSpecifiInfoByDesc(capId, processID, stepNumber, "Water Main Utility Permit").getOutput();
        if (valDef != null) waterMainUtilityPermitTsiVal = valDef.getChecklistComment();

        valDef = aa.taskSpecificInfo.getTaskSpecifiInfoByDesc(capId, processID, stepNumber, "Sanitary Sewer Permit").getOutput();
        if (valDef != null) sanitarySewerUtilityPermitTsiVal = valDef.getChecklistComment();

        valDef = aa.taskSpecificInfo.getTaskSpecifiInfoByDesc(capId, processID, stepNumber, "Public Storm Sewer Permit").getOutput();
        if (valDef != null) publicStormSewerUtilityPermitTsiVal = valDef.getChecklistComment();

        valDef = aa.taskSpecificInfo.getTaskSpecifiInfoByDesc(capId, processID, stepNumber, "Private Storm Sewer Permit").getOutput();
        if (valDef != null) privateStormSewerUtilityPermitTsiVal = valDef.getChecklistComment();

        valDef = aa.taskSpecificInfo.getTaskSpecifiInfoByDesc(capId, processID, stepNumber, "Storm Water Permit Required").getOutput();
        if (valDef != null) stormWaterUtilityPermitRequiredTsiVal = valDef.getChecklistComment();

        valDef = aa.taskSpecificInfo.getTaskSpecifiInfoByDesc(capId, processID, stepNumber, "Private Fire Line").getOutput();
        if (valDef != null) privateFireLineUtilityPermitTsiVal = valDef.getChecklistComment();

        // Create a child record based on the selected utility permit
        if (waterMainUtilityPermitTsiVal == "Yes") {
            createTempChild("Water Utility Main Permit", "Water Main Utility Permit", emailTemplate);
        }
        if (sanitarySewerUtilityPermitTsiVal == "Yes") {
            createTempChild("Sanitary Sewer Utility Permit", "Sanitary Sewer Permit", emailTemplate);
        }
        if (publicStormSewerUtilityPermitTsiVal == "Yes") {
            createTempChild("Public Storm Sewer Utility Permit", "Public Storm Sewer Permit", emailTemplate);
        }
        if (privateStormSewerUtilityPermitTsiVal == "Yes") {
            createTempChild("Private Storm Sewer Utility Permit", "Private Storm Sewer Permit", emailTemplate);
        }
        if (stormWaterUtilityPermitRequiredTsiVal == "Yes") {
            createTempChild("Storm Water Utility Permit", "Storm Water Permit", emailTemplate);
        }
        if (privateFireLineUtilityPermitTsiVal == "Yes") {
            // For private fire line utility permit, create a child record for each fire line
            var privateFireLinesCount = 0;
            valDef = aa.taskSpecificInfo.getTaskSpecifiInfoByDesc(capId, processID, stepNumber, "Number of Private Fire Lines").getOutput();
            if (valDef != null) privateFireLinesCount = valDef.getChecklistComment();

            if (privateFireLinesCount > 0) {
                for (var i = 0; i < privateFireLinesCount; i++) {
                    createTempChild("Private Fire Line Utility Permit", "Private Fire Lines", emailTemplate);
                }
            }
        }
    }
}
