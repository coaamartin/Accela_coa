/* JMP - 10/10/2018 - Script Item #76 - 76_Building_Inspection_Update
// ​Building/Permit/New Building/NA – When Permit Issuance workflow task has a status of ‘Issued’, 
// then Inspection Types “Roofing”, “Engineering Inspection”, “Grade Inspection”, “Zoning Inspection”, “Water Service/Sanitary Service Inspection” and “Irrigation Inspection” 
// are to automatically move to ‘Pending’ status in the Inspection tab. 
*/

logDebug("JMP JMP Alert: ------------------------>> Script Item #76 - 76_Building_Inspection_Update ... Need to see if createInspecion still not working ");

var foundRoofingInspecion = false;
var foundEngineerInspecion = false;
var foundGradeInspecion = false;
var foundZoneInspecion = false;
var foundWaterInspecion = false;
var foundIrrigationInspecion = false;

var inspGroup = "BLD_NEW_CON";

if(wfTask =="Permit Issuance" && wfStatus== "Issued") 
{
   
  var inspResultObj = aa.inspection.getInspections(capId);
  if (inspResultObj.getSuccess()) 
  {      
		var inspList = inspResultObj.getOutput();
      var showInspName = ''; 
      
      for (index in inspList)          
      {            
         showInspName = inspList[index].getInspectionType() + "";
         
         if (showInspName == "Roofing") 
         {             
          foundRoofingInspecion = true;                   
         } 
         
         if (showInspName == "Engineering Inspection") 
         {             
          foundEngineerInspecion = true;                   
         }   

         if (showInspName == "Grade Inspection") 
         {             
          foundGradeInspecion = true;                   
         }  

         if (showInspName == "Zoning Inspection") 
         {             
          foundZoneInspecion = true;                   
         }   

         if (showInspName == "Water Service/Sanitary Service Inspection") 
         {             
          foundWaterInspecion  = true;                   
         }      

         if (showInspName == "Irrigation Inspection") 
         {             
          foundIrrigationInspecion  = true;                   
         }            
     
      }
  } 
  
  if (!foundRoofingInspecion)
  {   
   createPendingInspection(inspGroup,"Roofing");
  }
  
  if (!foundEngineerInspecion)
  {  
   createPendingInspection(inspGroup,"Engineering Inspection");
  }
  
  if(!foundGradeInspecion)
  {
   createPendingInspection(inspGroup,"Grade Inspection");
  }
  
  if(!foundZoneInspecion)
  {   
   createPendingInspection(inspGroup,"Zoning Inspection");
  }

  if(!foundWaterInspecion)
  {
   createPendingInspection(inspGroup,"Water Service/Sanitary Service Inspection");
  }
  
  if(!foundIrrigationInspecion)
  {   
   createPendingInspection(inspGroup,"Irrigation Inspection");
  }  
     
    
}