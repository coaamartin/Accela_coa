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
  		      var showInspName = inspList[index].getInspectionType() + "";
         
            if (showInspName == "Roofing")
            { 
              inspList[index].setInspectionStatus("Pending");
            }      
            
            if (showInspName == “Engineering Inspection”)
            { 
              inspList[index].setInspectionStatus("Pending");
            }    
            
            if (showInspName == “Grade Inspection”)
            { 
              inspList[index].setInspectionStatus("Pending");
            }   
            
            if (showInspName == “Zoning Inspection”)
            { 
              inspList[index].setInspectionStatus("Pending");
            }  

            if (showInspName == “Water Service/Sanitary Service Inspection”)
            { 
              inspList[index].setInspectionStatus("Pending");
            }  
                     
            if (showInspName == “Irrigation Inspection” )
            { 
              inspList[index].setInspectionStatus("Pending");
            } 
         
         //logDebug("JMP JMP Alert: ------------------------>> Script Item #76 = " + (showInspName));
         //logDebug("Hello JP - Print Object = " + printObject(in);
         //OK JP - Just testing
         }
   }


}