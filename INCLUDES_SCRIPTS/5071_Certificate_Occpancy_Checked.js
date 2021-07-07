/* JMPorter - 10/2/2018 - Script Item #5071 - Certificate of Occupancy Checked
// If Inspection Phase workflow task has the status of ‘Ready for CO’ verify the Info Field ‘Certificate of Occupancy’ is checked, 
//   if it is unchecked then stop the workflow progression and give an error message that says “There is not a Certificate of Occupancy required on this record.” 
*/

logDebug("JMPorter JMPorter Alert: ------------------------>> Called Script Item #5071 - Certificate of Occupancy checked");

if(wfTask == "Inspection Phase" && wfStatus == "Ready for CO")     // "Final CO Issued" used in DEV to test 
{
  
  var tmpUASGN = useAppSpecificGroupName;
  
  useAppSpecificGroupName=false;
  
  var doesCheckExist = getAppSpecific("Certificate of Occupancy");
  useAppSpecificGroupName = tmpUASGN;
  
  if (doesCheckExist == null)
   {
		showMessage = true;
		comment("<h2 style='background-color:rgb(255, 0, 0);'>WARNING - There is not a Certificate of Occupancy required on this record.</h2>");
		deactivateTask("Certificate of Occupancy");
		cancel = true;
	}
}

if(wfTask == "Permit Issuance" && wfStatus == "Issued")     // "Final CO Issued" used in DEV to test 
{
  logDebug("Checking if Backflow Prevention Task is being activated. If so CO box needs to be checked.");
  
  var doesCOExist = getAppSpecific("Certificate of Occupancy");
  
  if (doesCOExist == null)
   {
		showMessage = true;
		comment("<h2 style='background-color:rgb(255, 0, 0);'>WARNING - The Certificate of Occupancy box is not checked and is required on this record.</h2>");
		//deactivateTask("Certificate of Occupancy");
		cancel = true;
	}
}

