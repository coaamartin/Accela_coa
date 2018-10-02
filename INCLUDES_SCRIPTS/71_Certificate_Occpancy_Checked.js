/* JMP - 10/2/2018 - Script Item #71 - Certificate of Occupancy checked
// If Inspection Phase workflow task has the status of ‘Ready for CO’ verify the Info Field ‘Certificate of Occupancy’ is checked, 
//   if it is unchecked then stop the workflow progression and give an error message that says “There is not a Certificate of Occupancy required on this record.” 
*/

if(wfTask =="Certificate of Occupancy" && wfStatus== "Final CO Issued")
{
  
  var tmpUASGN = useAppSpecificGroupName;
  
  useAppSpecificGroupName=false;
  
  var cOO = getAppSpecific("Certificate of Occupancy") + "";
  useAppSpecificGroupName = tmpUASGN;
  
  logDebug("JMP JMP ------------------------>> Testing logDebug JMP ----------------->  About to test logic: c00 = " + cOO);  
  
  if (cOO != "CHECKED" )
    {

		showMessage = true;
		comment("<h2 style='background-color:rgb(255, 0, 0);'>WARNING - There is not a Certificate of Occupancy required on this record.</h2>");
		deactivateTask("Certificate of Occupancy");
	}
}