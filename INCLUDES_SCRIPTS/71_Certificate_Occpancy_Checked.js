//JMP - 10/2/2018 - Script Item #71 - Certificate of Occupancy checked
/* If Inspection Phase workflow task has the status of ‘Ready for CO’ verify the Info Field ‘Certificate of Occupancy’ is checked, 
   if it is unchecked then stop the workflow progression and give an error message that says “There is not a Certificate of Occupancy required on this record.” */

if(wfTask =="Certificate of Occupancy" && wfStatus== "Ready for CO"){
  
  var tmpUASGN = useAppSpecificGroupName;
  useAppSpecificGroupName=false;
  var cOO=getAppSpecific("Certificate of Occupancy",capId);
  useAppSpecificGroupName = tmpUASGN;
  if (cOO!="CHECKED"){
	comment("<B><Font Color=RED>WARNING - There is not a Certificate of Occupancy required on this record.</Font></B>");
    deactivateTask("Certificate of Occupancy");}
}