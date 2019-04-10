// SCRIPTNUMBER: 5092
// SCRIPTFILENAME: 5092_RequireNoteOnFail.js
// PURPOSE: Called when status is set to fail and no comment exists
// DATECREATED: 04/09/2019
// BY: JMP

var wfComment = "Hello JP";

logDebug('Started script 5092_RequireNoteOnFail');

if (wfStatus == "Fail") //There is only 1 WFStep so no reason to check
{
   logDebug(wfComment.text); 
   
   if (wfComment != null && typeof wfComment !== 'undefined')       
   {
     logDebug('Script#5092 Comments have been provided');
   
   }
   // JMP
   
   else
      
   {
      
   logDebug('Script#5092 - Comments were not provided when the status of Fail had been indicated');
   //jmp
   comment("<B><Font Color=RED>Comments are required when a status of Fail has been indicated </Font></B>");
   cancel = true;
      
    logDebug(wfComment);  
      
   }
}  

logDebug('Ended script 5092_RequireNoteOnFail');