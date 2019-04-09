// SCRIPTNUMBER: 5092
// SCRIPTFILENAME: 5092_RequireNoteOnFail.js
// PURPOSE: Called when status is set to fail and no comment exists
// DATECREATED: 04/09/2019
// BY: JMP

logDebug('Started script 5092_RequireNoteOnFail');

if (wfStatus == "Fail") 
{
   logDebug('Within logic loop with Fail');
}  

logDebug('Ended script 5092_RequireNoteOnFail');