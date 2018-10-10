/* JMP - 10/10/2018 - Script Item #76 - 76_Building_Inspection_Update
// ​Building/Permit/New Building/NA – When Permit Issuance workflow task has a status of ‘Issued’, 
// then Inspection Types “Roofing”, “Engineering Inspection”, “Grade Inspection”, “Zoning Inspection”, “Water Service/Sanitary Service Inspection” and “Irrigation Inspection” 
// are to automatically move to ‘Pending’ status in the Inspection tab. 
*/

logDebug("JMP JMP Alert: ------------------------>> Script Item #76 - 76_Building_Inspection_Update");

if(wfTask =="Permit Issuance" && wfStatus== "Issued") 
{
  
  var inspResultObj = aa.inspection.getInspections(capId);
	if (inspResultObj.getSuccess()) 
   {
		var inspList = inspResultObj.getOutput();
			for (index in inspList) 
         {
            
  		   var ShowInspName = inspList[index].getInspectionType();
               //scheduleInspectDate(INSPECTION_NAME, nextInspectionDate)
               
         logDebug("JMP JMP Alert: ------------------------>> Script Item #76 = " & ShowInspName);
				

         }
   }


}