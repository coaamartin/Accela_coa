// SCRIPTNUMBER: 5092
// SCRIPTFILENAME: 5092_RequireNoteOnFail.js
// PURPOSE: Called when status is set to fail and no comment exists
// DATECREATED: 04/09/2019
// BY: JMP

var inspResultComment = inspObj.getInspectionComments();

logDebug('Started script 5092_RequireNoteOnFail');

if (wfStatus == "Fail") //There is only 1 WFStep so no reason to check
{
   
   //if (inspResultComment = "" || inspResultComment = null)
   //{      
   logDebug('Comments are required when a status of Fail has been indicated');
   //comment("<B><Font Color=RED>Comments are required when a status of Fail has been indicated </Font></B>");
   cancel = true;
   //}
}  

logDebug('Ended script 5092_RequireNoteOnFail');