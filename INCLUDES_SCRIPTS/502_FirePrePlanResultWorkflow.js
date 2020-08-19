if (appMatch("Fire/Preplan/NA/NA") && matches(inspResult, "Acknowledge", "In Progress", "Complete") && isTaskActive("Preplan Recieved"))
{
    resultWorkflowTask("Preplan Recieved", inspResult, "502_FirePrePlanResultWorkflow", "");
}