logDebug("Starting PPA;CityClerk!~!~!~.js ");
logDebug("Starting 5127_CityClerk_PRA.js");
//include("5127_CityClerk_PRA.js");
logDebug("Current balance: " + balanceDue);
logDebug("Starting DB approval email and updating statues");
//Check balance and update task
if (balanceDue == 0){
updateAppStatus("Approved","Status updated via script 5127_CityClerk_PRA.js");
updateTask("Application Close", "Approved", "Updated via script 5127_CityClerk_PRA.js");
include("5124_CityClerk_Approval");
logDebug("End of 5127_CityClerk_PRA script"); 
logDebug("---------------------> 5127_CityClerk_PRA.js ended.");
aa.sendMail("rprovinc@auroragov.org", "rprovinc@auroragov.org", "", "Log", "Debug: <br>" + debug + "<br>Message: <br>" + message);
}
logDebug("End of PPA;CityClerk!Incident!~!~.js ");