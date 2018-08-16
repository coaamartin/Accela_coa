logDebug("Script 27 Starting");
include("24_ForestryInspectionResultAutomation");


logDebug("Script 62 Starting");
if (ifTracer(inspType == "Forestry Inspection" && matches(inspResult, "PR1", "PR2", "PR20"), 'inspType == "Forestry Inspection" && matches(inspResult, "PR1", "PR2", "PR20"')) { 
    closeTask("Inspection Phase", "Complete", "", "");      
    activateTask("Crew Work");
}