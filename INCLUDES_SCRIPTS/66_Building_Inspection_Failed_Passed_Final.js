/* JMP - 10/4/2018 - Script Item #66 - 66_Building_Inspection_Failed_Passed_Final
// ​When any Inspection is resulted with ‘Failed’, ‘Passed’ or ‘Final’ the Permit  
// expiration Date needs to change to 180 days from the current date
*/

logDebug("Alert: ------------------------>> Script Item #66_Building_Inspection_Failed_Passed_Final");
//just confirming deploy

if (matches(inspType.toUpperCase(),"FAILED","PASSED","FINAL"))
{
  editAppSpecific("Permit Expiration Date",dateAdd(null,180));  
}


