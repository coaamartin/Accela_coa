// SCRIPTNUMBER: 5092
// SCRIPTFILENAME: 5092_RequireNoteOnFail.js
// PURPOSE: Called when status is set to fail and no comment exists
// DATECREATED: 04/09/2019
// BY: JMP

logdebug('Started script 5092_RequireNoteOnFail');

if wfTask== "Inspection-" && wfStatus == "Fail" ) 
{
   logdebug('Within logic loop with Fail');
}  

logdebug('Ended script 5092_RequireNoteOnFail');