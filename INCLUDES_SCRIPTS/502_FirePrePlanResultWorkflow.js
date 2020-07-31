if (appMatch("Fire/Preplan/NA/NA") && matches(inspResult, "Knowledge", "In Progress", "Complete") && isTaskActive("Preplan Recieved"))
{
    resultWorkflowTask("Preplan Recieved", inspResult, "502_FirePrePlanResultWorkflow", "");
}