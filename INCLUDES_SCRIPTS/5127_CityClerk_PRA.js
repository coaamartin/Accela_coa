//Written by rprovinc   
//
//include("5127_CityClerk_PRA.js");

//*****************************************************************************
//Script PRA;CityClerk!Incident!~!~.js
//Record Types:	CityClerk\Incident\*\* 
//Event: 		PRA
//Desc:			Payment Receive after.Sending emails to citizen letting them know that there permit was Approved.
//
//Created By: Rprovinc
//******************************************************************************
appTypeResult = cap.getCapType(); //create CapTypeModel object
appTypeString = appTypeResult.toString();
appTypeArray = appTypeString.split("/");
logDebug("Check to see what type of record it running and then update app status, task status and send email of permit approval.");


//Donation Bins code
if ("Application Close".equals(wfTask)) {
    var bal = getCapBalanceDue();
    logDebug("Current balance: " + bal);
    logDebug("Starting DB approval email and updating statues");

    //Check balance and update task
    if (bal == 0){
    updateAppStatus("Approved","Status updated via script 5127_CityClerk_PRA.js");
    updateTask("Application Close", "Approved", "Updated via script 5127_CityClerk_PRA.js");
    include("5124_CityClerk_Approval");
}				
} 

// //Temp Use code
// else if ("CityClerk/Incident/TempUse/NA".equals(appTypeString)) {
//     logDebug("Starting TU approval email and updating statues");
//     include("5124_CityClerk_Approval");
//     activateTask("Application Close");
//     updateAppStatus("PERMIT ISSUED","Status updated via script 5127_CityClerk_PRA.js");
//     updateTask("Application Close", "Approved", "Updated via script 5127_CityClerk_PRA.js");	
// }

// //Temp Sign code
// else if ("CityClerk/Incident/TempSign/NA".equals(appTypeString)) {
//     logDebug("Starting TS approval email and updating statues");
//     include("5124_CityClerk_Approval");
//     activateTask("Application Close");
//     updateAppStatus("PERMIT ISSUED","Status updated via script 5127_CityClerk_PRA.js");
//     updateTask("Application Close", "Approved", "Updated via script 5127_CityClerk_PRA.js");	
// }

function getCapBalanceDue() {
    //Optional capId
    itemCap = capId;
    if (arguments.length == 1)
        itemCap = arguments[0];

    var feesArr = loadFees();
    if (!feesArr)
        return 0;

    var tot = 0;
    for (i in feesArr)
    {
    	//if (("INVOICED".equals(feesArr[i].status)) || (("NEW".equals(feesArr[i].status))))
    	//{
    		tot += (+feesArr[i].amount) - (+feesArr[i].amountPaid);
         
         
    	//}
        
    }
    
    return tot;
}
logDebug("End of 5127_CityClerk_PRA script"); 