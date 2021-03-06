// SCRIPTNUMBER: 5092
// SCRIPTFILENAME: 5092_RequireNoteOnFail.js
// PURPOSE: Called when status is set to fail and no comment exists
// DATECREATED: 04/09/2019
// BY: JMPorter

logDebug('Started script 5092_RequireNoteOnFail');

if (wfStatus == "Fail" && wfTask == "Inspection") //There is only 1 WFStep so no reason to check wfTask however included for future changes
{
    
   if (typeof wfComment !== 'undefined')      // Ojbect will not exist if blank  
   {

     logDebug('Script#5092 - Comments were not provided when the status of Fail had been indicated');
     comment("<B><Font Color=RED>Comments are required when a status of Fail has been indicated </Font></B>");
     cancel = true;
   }
   
   else 
      
     if (typeof wfComment == null)      // Ojbect will not exist if blank  
     {      
   
       logDebug('Script#5092 - Comments were not provided when the status of Fail had been indicated');
       comment("<B><Font Color=RED>Comments are required when a status of Fail has been indicated </Font></B>");
       cancel = true;
   
     }   
     else
     {
       
       closeTask("Inspection", "Completed", "EMSE ID 5092", "EMSE ID 5092");
     
     }  
}  

logDebug('Ended script 5092_RequireNoteOnFail');