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
      var foundInspection = false;
      
		var inspList = inspResultObj.getOutput();
			for (index in inspList) 
         {            
  		      var showInspName = inspList[index].getInspectionType() + "";
            
            if (showInspName == "Roofing")
            { 
              foundInspection = true;
            }    
            
            if (showInspName == "Engineering Inspection")
            { 
              foundInspection = true;
            }  
            
            if (showInspName == "Grade Inspection")
            { 
              foundInspection = true;
            }  
            
            if (showInspName == "Zoning Inspection")
            { 
              foundInspection = true;
            }    

            if (showInspName == "Water Service/Sanitary Service Inspection")
            { 
              foundInspection = true;
            }

            if (showInspName == "Irrigation Inspection")
            { 
              foundInspection = true;
            }      

            if (foundInspection)
            {
              inspList[index].setInspectionStatus("Pending");
            }            
         
         //logDebug("JMP JMP Alert: ------------------------>> Script Item #76 = " + (showInspName));
         //logDebug("Hello JP - Print Object = " + printObject(in);
         //OK JP - Just testing         
         }
         

   }


}